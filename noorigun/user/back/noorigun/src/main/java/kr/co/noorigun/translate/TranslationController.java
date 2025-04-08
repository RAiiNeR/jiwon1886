package kr.co.noorigun.translate;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@RestController
@RequestMapping("/api")
class TranslationController {

    private final String deeplApiUrl = "https://api-free.deepl.com/v2/translate"; //주소
    private final String authKey = "bf11001c-a5e0-40b9-ba4d-716973f9e823:fx"; //API인증키

    @PostMapping("/translate")
    public ResponseEntity<TranslationResponse> translate(@RequestBody TranslationRequest request) {
        String targetLang = request.getTarget_lang();//요청본문에서 대상언어(target_lang) 추출
        String apiUrl = deeplApiUrl + "?target_lang=" + targetLang; //대상언어를 포함한 API URL생성
        RestTemplate restTemplate = new RestTemplate();//HTTP요청을 보내기 위해 사용되는 Spring의 HTTP클라이언트

        HttpHeaders headers = new HttpHeaders(); //HTTP요청 헤더를 생성하는 객체
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));//서버에서 JSON응답을 기대
        headers.setContentType(MediaType.APPLICATION_JSON);//요청데이터 형식을 JSON으로 설정
        headers.add("Authorization", "DeepL-Auth-Key " + authKey);//DeepL API 키를 추가하여 인증

        TranslationResponse response = restTemplate.postForObject(apiUrl, createHttpEntity(request, headers), TranslationResponse.class);
        //restTemplate.postForObject: DeepL API로 HTTP POST 요청을 보낸다
        //createHttpEntity(request, headers): 요청 본문(TranslationRequest)과 헤더를 포함한 HttpEntity 객체를 생성합니다.
        //apiUrl: 요청할 URL.
        //HttpEntity: 요청 본문 및 헤더.
        //TranslationResponse.class: 응답을 매핑할 객체 타입.
        return ResponseEntity.ok(response);//번역 결과를 TranslationResponse 객체로 반환
    }

    //HttpEntity: HTTP 요청 본문과 헤더를 포함하는 객체. 요청 데이터를 DeepL API에 전달하기 위해 사용
    private HttpEntity<TranslationRequest> createHttpEntity(TranslationRequest request, HttpHeaders headers) {
        return new HttpEntity<>(request, headers);
    }
}