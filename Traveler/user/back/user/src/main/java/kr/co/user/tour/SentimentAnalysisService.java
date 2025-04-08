package kr.co.user.tour;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

@Service
public class SentimentAnalysisService {

    private final RestTemplate restTemplate;

    public SentimentAnalysisService() {
        this.restTemplate = new RestTemplate();
    }

    // ✅ 감정 분석 API 호출
    public String analyze(String text) {
    try {
        String apiUrl = "http://127.0.0.1:9000/api/reviews/analyze-sentiment/";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("text", text);
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonRequest = objectMapper.writeValueAsString(requestBody);  // ✅ JSON 변환 명확히 수행

        HttpEntity<String> entity = new HttpEntity<>(jsonRequest, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            String sentiment = (String) response.getBody().get("sentiment");
            
            // ✅ "unknown" 값이 있는 경우, 그대로 반환하도록 수정
            if ("unknown".equals(sentiment)) {
                return "unknown";
            }
            return "긍정".equals(sentiment) ? "긍정" : "부정";
        } else {
            return "unknown";
        }
    } catch (Exception e) {
        System.out.println("❌ 감정 분석 API 호출 실패: " + e.getMessage());
        return "unknown";
    }
}
}