package kr.co.noorigun.jwt;

import java.net.URI;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.hc.core5.http.HttpHeaders;
import org.apache.hc.core5.net.URIBuilder;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.co.noorigun.member.Member;
import kr.co.noorigun.member.MemberService;
import kr.co.noorigun.passwordLess.MessageUtils;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PostMapping;

@Slf4j
@RestController
@CrossOrigin // CORS 허용
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager; // 인증 처리 매니저

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JWT 토큰 제공 클래스

    @Autowired
    private PasswordEncoder passwordEncoder; // 비밀번호 암호화를 위한 PasswordEncoder 객체

    @Autowired
    private MemberService memberService;

    @Autowired
    MessageUtils messageUtils;

    @Value("${passwordless.corpId}")
    private String corpId;

    @Value("${passwordless.serverId}")
    private String serverId;

    @Value("${passwordless.serverKey}")
    private String serverKey;

    @Value("${passwordless.simpleAutopasswordUrl}")
    private String simpleAutopasswordUrl;

    @Value("${passwordless.restCheckUrl}")
    private String restCheckUrl;

    @Value("${passwordless.pushConnectorUrl}")
    private String pushConnectorUrl;

    @Value("${passwordless.recommend}")
    private String recommend;

    // Passwordless URL
    private String isApUrl = "/ap/rest/auth/isAp"; // Passwordless 등록여부 확인
    private String joinApUrl = "/ap/rest/auth/joinAp"; // Passwordless 등록 REST API
    private String withdrawalApUrl = "/ap/rest/auth/withdrawalAp"; // Passwordless 해지 REST API
    private String getTokenForOneTimeUrl = "/ap/rest/auth/getTokenForOneTime"; // Passwordless 일회용토큰 요청 REST API
    private String getSpUrl = "/ap/rest/auth/getSp"; // Passwordless 인증요청 REST API
    private String resultUrl = "/ap/rest/auth/result"; // Passwordless 인증 결과 요청 REST API
    private String cancelUrl = "/ap/rest/auth/cancel"; // Passwordless 인증요청 취소 REST API

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        System.out.println("AuthRequest username => " + authRequest.getUsername());
        System.out.println("AuthRequest password => " + authRequest.getPassword());
        try {
            // 사용자 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()));
            System.out.println("인증 성공 여부: " + authentication);
            System.out.println("Authentication 호출 후");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("SecurityContextHolder 호출 후");
            // JWT 토큰 생성
            String jwt = jwtTokenProvider.createToken(authentication);
            System.out.println("jwtLog ===============> " + jwt);
            // 인증 성공 시 JWT 토큰 반환
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (Exception e) {
            // 인증 실패 시
            System.out.println(e);
            System.out.println("인증 오류");
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AuthResponse(null));
    }

    @PostMapping("/changePwd")
    public ResponseEntity<?> changePwd(@RequestBody AuthRequest authRequest) {

        String id = authRequest.getUsername();
        String pw = authRequest.getPassword();

        Member member = memberService.findMember(id);
        if (member != null) {
            String encodePw = passwordEncoder.encode(pw);
            member.setPwd(encodePw);
            memberService.changepwd(member);
            return ResponseEntity.ok("변경완료");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AuthResponse(null));
    }

    @PostMapping(value = "passwordlessManageCheck", produces = "application/json;charset=utf8")
    public Map<String, Object> passwordlessManageCheck(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "pw", required = false) String pw,
            HttpServletRequest request) {

        if (id == null) {
            id = "";
        }
        if (pw == null) {
            pw = "";
        }

        log.info("passwordlessManageCheck : id [" + id + "] pw [" + pw + "]");

        Map<String, Object> mapResult = new HashMap<String, Object>();

        if (!id.equals("") && !pw.equals("")) {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(id, pw));
            System.out.println("Authtication: " + ((UserDetails) authentication.getPrincipal()).getUsername());

            if (authentication != null) {
                String tmpToken = java.util.UUID.randomUUID().toString();
                String tmpTime = Long.toString(System.currentTimeMillis());

                log.info("passwordlessManageCheck : token [" + tmpToken + "] time [" + tmpTime + "]");

                HttpSession session = request.getSession(true);
                session.setAttribute("PasswordlessToken", tmpToken);
                session.setAttribute("PasswordlessTime", tmpTime);
                mapResult.put("PasswordlessToken", tmpToken);
                mapResult.put("result", "OK");
            } else {
                mapResult.put("result", messageUtils.getMessage("text.passwordless.invalid"));
            }
        } else {
            mapResult.put("result", messageUtils.getMessage("text.passwordless.empty"));
        }

        return mapResult;
    }

    @RequestMapping(value = "/passwordlessCallApi")
    public ModelMap passwordlessCallApi(
            @RequestParam(value = "url", required = false) String url,
            @RequestParam(value = "params", required = false) String params,
            HttpServletRequest request, HttpServletResponse response) {

        ModelMap modelMap = new ModelMap();
        String result = "";

        boolean existMember = false;

        if (url == null) {
            url = "";
        }
        if (params == null) {
            params = "";
        }

        Map<String, String> mapParams = getParamsKeyValue(params);

        String userId = "";
        String userToken = "";

        HttpSession session = request.getSession(true);

        log.info(String.valueOf(session.getAttribute("PasswordlessToken")));
        String sessionUserToken = String.valueOf(session.getAttribute("PasswordlessToken"));
        String sessionTime = (String) session.getAttribute("PasswordlessTime");

        if (sessionUserToken == null) {
            sessionUserToken = "";
        }
        if (sessionTime == null) {
            sessionTime = "";
        }

        long nowTime = System.currentTimeMillis();
        long tokenTime = 0L;
        int gapTime = 0;
        try {
            tokenTime = Long.parseLong(sessionTime);
            gapTime = (int) (nowTime - tokenTime);
        } catch (Exception e) {
            gapTime = 99999999;
        }

        userId = mapParams.get("userId");
        userToken = mapParams.get("token");

        boolean matchToken = false;
        if (!sessionUserToken.equals("") && sessionUserToken.equals(userToken)) {
            matchToken = true;
        }

        log.info(
                "passwordlessCallApi : [" + url + "] userId=" + userId + ", Token Match [" + matchToken + "] userToken["
                        + userToken + "], sessionUserToken [" + sessionUserToken + "], gapTime [" + gapTime + "]");

        if (userId == null) {
            userId = "";
        }
        if (userToken == null) {
            userToken = "";
        }

        // QR 요청 및 해제 시 본인 확인
        if (url.equals("joinApUrl") || url.equals("withdrawalApUrl")) {
            // Passwordless 설정을 위한 로그인이 안된 경우
            if (!matchToken) {
                modelMap.put("result", messageUtils.getMessage("text.passwordless.abnormal")); // This is not a normal
                                                                                               // user.
                return modelMap;
            } // Passwordless 설정을 위한 로그인 후 5분 경과 시 Timeout 처리
            else if (gapTime > 5 * 60 * 1000) {
                modelMap.put("result", messageUtils.getMessage("text.passwordless.expired")); // Passwordless management
                                                                                              // token expired.
                return modelMap;
            }
        }

        if (!url.equals("resultUrl")) {
            log.info("passwordlessCallApi : url [" + url + "] params [" + params + "] userId [" + userId + "]");
        }

        Member userinfo = new Member();
        userinfo.setId(userId);
        Member newUserinfo = memberService.findMember(userId);

        if (newUserinfo == null) {
            String tmp_result = messageUtils.getMessage("text.passwordless.idnotexist"); // ID [" + id + "] does not
                                                                                         // exist.
            modelMap.put("result", tmp_result.replace("@@@", userId));
            return modelMap;
        } else {
            String random = java.util.UUID.randomUUID().toString();
            String sessionId = System.currentTimeMillis() + "_sessionId";
            String apiUrl = "";
            String ip = request.getRemoteAddr();

            if (ip.equals("0:0:0:0:0:0:0:1")) {
                ip = "127.0.0.1";
            }

            if (url.equals("isApUrl")) {
                apiUrl = isApUrl;
            }
            if (url.equals("joinApUrl")) {
                apiUrl = joinApUrl;
            }
            if (url.equals("withdrawalApUrl")) {
                apiUrl = withdrawalApUrl;
            }
            if (url.equals("getTokenForOneTimeUrl")) {
                apiUrl = getTokenForOneTimeUrl;
            }
            if (url.equals("getSpUrl")) {
                apiUrl = getSpUrl;
                params += "&clientIp=" + ip + "&sessionId=" + sessionId + "&random=" + random + "&password=";
            }
            if (url.equals("resultUrl")) {
                apiUrl = resultUrl;
            }
            if (url.equals("cancelUrl")) {
                apiUrl = cancelUrl;
            }

            if (!url.equals("resultUrl")) {
                log.info("passwordlessCallApi : url [" + url + "], param [" + params + "], apiUrl [" + apiUrl + "]");
            }

            if (!apiUrl.equals("")) {
                try {
                    if (!url.equals("getSpUrl") && !url.equals("resultUrl")) {
                        log.info("passwordlessCallApi : url [" + (restCheckUrl + apiUrl + "?" + params) + "]");
                    }

                    result = callApi("POST", restCheckUrl + apiUrl, params);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            if (!url.equals("getSpUrl") && !url.equals("resultUrl")) {
                log.info("passwordlessCallApi : result [" + result + "]");
            }

            // 1회용 토큰 요청
            if (url.equals("getTokenForOneTimeUrl")) {
                String token = "";
                String oneTimeToken = "";

                JSONParser parser = new JSONParser();
                try {
                    JSONObject jsonResponse = (JSONObject) parser.parse(result);
                    JSONObject jsonData = (JSONObject) jsonResponse.get("data");
                    token = (String) (jsonData).get("token");
                    oneTimeToken = getDecryptAES(token, serverKey.getBytes());
                } catch (ParseException pe) {
                    pe.printStackTrace();
                }
                log.info("passwordlessCallApi : token [" + token + "] --> oneTimeToken [" + oneTimeToken + "]");

                modelMap.put("oneTimeToken", oneTimeToken);
            }

            // Passwordless 인증요청 REST API
            if (url.equals("getSpUrl")) {
                modelMap.put("sessionId", sessionId);
            }

            // Passwordless QR 등록대기 Websocket URL
            if (url.equals("joinApUrl")) {
                modelMap.put("pushConnectorUrl", pushConnectorUrl);
            }

            // Passwordless QR 등록대기
            if (url.equals("isApUrl")) {
                log.info("passwordlessCallApi : mapParams=" + mapParams.toString());
                try {
                    String isQRReg = mapParams.get("QRReg");
                    if (isQRReg.equals("T")) {
                        JSONParser parser = new JSONParser();
                        JSONObject jsonResponse = (JSONObject) parser.parse(result);
                        JSONObject jsonData = (JSONObject) jsonResponse.get("data");
                        boolean exist = (boolean) (jsonData).get("exist");

                        if (exist) {
                            // QR등록 완료 시 비밀번호 변경
                            log.info("passwordlessCallApi : QR등록완료 --> 비밀번호 변경");
                            String newPw = Long.toString(System.currentTimeMillis()) + ":" + userId;
                            newUserinfo.setId(userId);
                            String encodePw = passwordEncoder.encode(newPw);
                            newUserinfo.setPwd(encodePw);
                            memberService.changepwd(newUserinfo);
                        }
                    }
                } catch (NullPointerException npe) {
                    //
                } catch (ParseException pe) {
                    //
                }
            }

            // Passwordless 승인 대기
            if (url.equals("resultUrl")) {
                JSONParser parser = new JSONParser();
                try {
                    JSONObject jsonResponse = (JSONObject) parser.parse(result);
                    JSONObject jsonData = (JSONObject) jsonResponse.get("data");

                    if (jsonData != null) {
                        String auth = (String) (jsonData).get("auth");

                        if (auth != null && auth.equals("Y")) {
                            // 로그인 성공 시 패스워드 변경
                            log.info("passwordlessCallApi : 로그인성공 --> 비밀번호 변경");
                            String newPw = Long.toString(System.currentTimeMillis()) + ":" + userId;
                            newUserinfo.setId(userId);
                            String encodePw = passwordEncoder.encode(newPw);
                            newUserinfo.setPwd(encodePw);
                            memberService.changepwd(newUserinfo);

                            session.setAttribute("id", userId);

                            // 사용자 인증 시도
                            Authentication authentication = authenticationManager.authenticate(
                                    new UsernamePasswordAuthenticationToken(
                                            userId,
                                            newPw));
                            System.out.println("인증 성공 여부: " + authentication);
                            System.out.println("Authentication 호출 후");
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            System.out.println("SecurityContextHolder 호출 후");
                            // JWT 토큰 생성
                            String jwt = jwtTokenProvider.createToken(authentication);
                            log.info("Make Token: " + jwt);
                            modelMap.put("token", jwt);
                        }
                    }
                } catch (ParseException pe) {
                    pe.printStackTrace();
                }
            }

            modelMap.put("result", "OK");
        }

        modelMap.put("data", result);

        return modelMap;
    }

    @PostMapping("/socaillogin")
    public ResponseEntity<?> authenticateSocail(@RequestBody SocailAuth socailAuth) {
        System.out.println("AuthRequest email => " + socailAuth.getEmail());
        try {
            // JWT 토큰 생성
            String jwt = jwtTokenProvider.createToken(socailAuth.getEmail());
            System.out.println("jwtLog ===============> " + jwt);
            // 인증 성공 시 JWT 토큰 반환
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (Exception e) {
            // 인증 실패 시
            System.out.println(e);
            System.out.println("인증 오류");
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AuthResponse(null));
    }

    // 사용자 로그아웃
    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // SecurityContext를 비워서 로그아웃 처리
        SecurityContextHolder.clearContext();
        System.out.println("Token을 삭제 했습니다.");
        return ResponseEntity.ok("Logout 성공!");
    }

    // 인증 테스트
    @GetMapping("/test")
    public ResponseEntity<?> test(HttpServletRequest request) {
        // 토큰 추출
        String token = jwtTokenProvider.resolveToken(request);
        boolean validateToken = jwtTokenProvider.validateToken(token);
        return ResponseEntity.ok(validateToken);
    }

    public Map<String, String> getParamsKeyValue(String params) {
        String[] arrParams = params.split("&");
        Map<String, String> map = new HashMap<String, String>();
        for (String param : arrParams) {
            String name = "";
            String value = "";

            String[] tmpArr = param.split("=");
            name = tmpArr[0];

            if (tmpArr.length == 2) {
                value = tmpArr[1];
            }

            map.put(name, value);
        }

        return map;
    }

    public String callApi(String type, String requestURL, String params) {

        String retVal = "";
        Map<String, String> mapParams = getParamsKeyValue(params);

        try {
            URIBuilder b = new URIBuilder(requestURL);

            Set<String> set = mapParams.keySet();
            Iterator<String> keyset = set.iterator();
            while (keyset.hasNext()) {
                String key = keyset.next();
                String value = mapParams.get(key);
                b.addParameter(key, value);
            }
            URI uri = b.build();
            // HttpClient httpClient = HttpClient.create()
            // .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000) // timeout 시간 조절
            // .responseTimeout(Duration.ofMillis(5000))
            // .doOnConnected(conn -> conn.addHandlerLast(new ReadTimeoutHandler(5000,
            // TimeUnit.MILLISECONDS))
            // .addHandlerLast(new WriteTimeoutHandler(5000, TimeUnit.MILLISECONDS)));

            WebClient webClient = WebClient.builder()
                    .baseUrl(uri.toString())
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                    .build();

            String response;

            if (type.toUpperCase().equals("POST")) {
                response = webClient.post().retrieve().bodyToMono(String.class).block();
            } else {
                response = webClient.get().retrieve().bodyToMono(String.class).block();
            }
            retVal = response;
        } catch (Exception e) {
            System.out.println(e.toString());
        }
        return retVal;
    }

    private static String getDecryptAES(String encrypted, byte[] key) {
        String strRet = null;

        byte[] strIV = key;
        if (key == null || strIV == null) {
            return null;
        }
        try {
            SecretKey secureKey = new SecretKeySpec(key, "AES");
            Cipher c = Cipher.getInstance("AES/CBC/PKCS5Padding");
            c.init(Cipher.DECRYPT_MODE, secureKey, new IvParameterSpec(strIV));
            byte[] byteStr = java.util.Base64.getDecoder().decode(encrypted);// Base64Util.getDecData(encrypted);
            strRet = new String(c.doFinal(byteStr), "utf-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return strRet;
    }
}
