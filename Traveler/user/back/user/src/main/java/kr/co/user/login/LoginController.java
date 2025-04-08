package kr.co.user.login;

import java.io.IOException;
import java.net.URI;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.hc.core5.net.URIBuilder;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.co.user.member.MemberService;

import kr.co.user.member.MemberVO;
import kr.co.user.passwordless.MessageUtils;
import lombok.extern.slf4j.Slf4j;

//2025-02-27 전준영

@Slf4j
@RestController
@CrossOrigin // CORS 허용
@PropertySource("classpath:properties/config.properties")
@RequestMapping("/api/member")
public class LoginController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private AuthenticationManager authenticationManager; // 인증 처리 매니저

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JWT 토큰 제공 클래스

    @Autowired
    private PasswordEncoder passwordEncoder; // 비밀번호 암호화를 위한 PasswordEncoder 객체

    @Autowired
    private MessageUtils messageUtils;

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

    // 사용자 로그아웃
    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // SecurityContext를 비워서 로그아웃 처리
        SecurityContextHolder.clearContext();
        System.out.println("Token을 삭제 했습니다.");
        return ResponseEntity.ok("Logout 성공!");
    }

    // 카카오 로그인 후 사용자 정보가 담긴 토큰 받아오기
    @GetMapping("/kakao")
    public void callback(@RequestParam(value = "code") String code, HttpServletResponse response) throws IOException {
        String token = "";
        RestTemplate restTemplate = new RestTemplate();// HTTP요청을 보내기 위해 사용되는 Spring의 HTTP클라이언트

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "0b998fb74842d1e39d265724fb1257fc");
        params.add("redirect_uri", "http://localhost:81/traveler/api/member/kakao");
        params.add("code", code);

        HttpHeaders headers = new HttpHeaders(); // HTTP요청 헤더를 생성하는 객체
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));// 서버에서 JSON응답을 기대
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);// 요청데이터 형식을 JSON으로 설정

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
        ResponseEntity<Map> result = restTemplate.postForEntity(
                "https://kauth.kakao.com/oauth/token", entity, Map.class);
        token = (String) result.getBody().get("access_token");

        response.sendRedirect("/traveler/kakaologin/" + token);
    }

    // 카카오 로그인 후 사용자 정보가 담긴 토큰 받아오기
    @GetMapping("/naver")
    public void callback(@RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "state") String state,
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "error_description", required = false) String error_description,
            HttpServletResponse response) throws IOException {
        String token = "";
        RestTemplate restTemplate = new RestTemplate();// HTTP요청을 보내기 위해 사용되는 Spring의 HTTP클라이언트

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "9XH9_Bze03nlmv894GgZ");
        params.add("client_secret", "GgcLTO8Ms4");
        params.add("redirect_uri", "http://localhost:81/traveler/api/member/naver");
        params.add("code", code);
        params.add("state", state);

        HttpHeaders headers = new HttpHeaders(); // HTTP요청 헤더를 생성하는 객체
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));// 서버에서 JSON응답을 기대
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
        ResponseEntity<Map> result = restTemplate.postForEntity(
                "https://nid.naver.com/oauth2.0/token", entity, Map.class);
        token = (String) result.getBody().get("access_token");

        headers = new HttpHeaders(); // HTTP요청 헤더를 생성하는 객체
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));// 서버에서 JSON응답을 기대
        headers.set("Authorization", "Bearer " + token);

        entity = new HttpEntity<>(headers);
        result = restTemplate.postForEntity(
                "https://openapi.naver.com/v1/nid/me", entity, Map.class);

        Map<String, String> data = (Map) result.getBody().get("response");

        String name = data.get("name");
        String email = data.get("email");
        String phone = data.get("mobile").replaceAll("-", "");
        String byear = data.get("birthyear");
        String ssn = byear.substring(2) + data.get("birthday").replaceAll("-", "") + "-"
                + (data.get("gender").equals("M") ? (Integer.parseInt(byear) >= 2000 ? "3" : "1")
                        : (Integer.parseInt(byear) >= 2000 ? "4" : "2"));
        Map<String, Object> userData = new HashMap<>();
        userData.put("username", email);
        userData.put("name", name);
        userData.put("email", email);
        userData.put("phone", phone);
        userData.put("code", ssn);
        ResponseEntity<?> res = socialLogin(userData);
        token = ((AuthResponse) res.getBody()).getAccessToken();
        response.sendRedirect("/traveler/naverlogin/" + token);
    }

    // 소셜로그인한 유저의 기존 가입여부 확인
    public boolean checkSocial(String email) {
        return memberService.isEmailDuplicate(email);
    }

    @PostMapping("/changePwd")
    public ResponseEntity<?> changePwd(@RequestBody AuthRequest authRequest) {

        String id = authRequest.getUsername();
        String pw = authRequest.getPassword();

        MemberVO member = memberService.findByUsername(id).get();
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

        MemberVO userinfo = new MemberVO();
        userinfo.setName(userId);
        MemberVO newUserinfo = memberService.findByUsername(userId).get();

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
                            newUserinfo.setName(userId);
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
                            newUserinfo.setName(userId);
                            String encodePw = passwordEncoder.encode(newPw);
                            newUserinfo.setPwd(encodePw);
                            memberService.changepwd(newUserinfo);

                            session.setAttribute("id", userId);

                            // 사용자 인증 시도
                            Authentication authentication = authenticationManager.authenticate(
                                    new UsernamePasswordAuthenticationToken(
                                            userId,
                                            newPw));
                            SecurityContextHolder.getContext().setAuthentication(authentication);
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

    @PostMapping("/socialLogin")
    public ResponseEntity<?> socialLogin(@RequestParam Map<String, Object> params) {
        boolean isExists = checkSocial((String) params.get("email")); // ((String)
                                                                      // params.get("isExists")).equals("true") ? true :
                                                                      // false;
        String username = (String) params.get("username");
        String newPw = Long.toString(System.currentTimeMillis()) + "A@" + (String) params.get("username");
        if (!isExists) {
            MemberVO entity = MemberVO.builder()
                    .username(username)
                    .pwd(newPw)
                    .name((String) params.get("name"))
                    .code((String) params.get("code")) // 주민번호
                    .phone((String) params.get("phone"))
                    .email((String) params.get("email"))
                    .role("USER")
                    .socialUser(true)
                    .mdate(new Date()) // 가입일 설정
                    .build();
            memberService.registerUser(entity);
        } else {
            memberService.changePwd(username, newPw);
        }
        try {
            // 사용자 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            username,
                            newPw));
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

    // 인증 테스트
    @GetMapping("/test")
    public ResponseEntity<?> test(HttpServletRequest request) {
        // 토큰 추출
        String token = jwtTokenProvider.resolveToken(request);
        boolean validateToken = jwtTokenProvider.validateToken(token);
        return ResponseEntity.ok(validateToken);}

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

    // public String callApi(String type, String requestURL, String params) {
    //     String retVal = "";
    //     RestTemplate restTemplate = new RestTemplate();

    //     try {
    //         // URI 생성
    //         UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
    //         Map<String, String> mapParams = getParamsKeyValue(params);
    //         MultiValueMap<String, String> param = new LinkedMultiValueMap<>();
    //         for (Map.Entry<String, String> entry : mapParams.entrySet()) {
    //             param.add(entry.getKey(), entry.getValue());
    //             builder.queryParam(entry.getKey(), entry.getValue());
    //         }
    //         URI uri = builder.build().encode().toUri();

    //         // 요청 실행
    //         ResponseEntity<String> response;
    //         HttpHeaders headers = new HttpHeaders();
    //         headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    //         HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(param, headers);

    //         if ("POST".equalsIgnoreCase(type)) {
    //             response = restTemplate.exchange(requestURL, HttpMethod.POST, entity, String.class);
    //         } else {
    //             response = restTemplate.exchange(requestURL, HttpMethod.GET, entity, String.class);
    //         }

    //         retVal = response.getBody();
    //     } catch (Exception e) {
    //         System.out.println(e.toString());
    //     }
    //     return retVal;
    // }

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
