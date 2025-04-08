package kr.co.user.music;


import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor  // 생성자 자동 주입
public class SpotifyAuthService {
    
    @Value("${spotify.client-id}")
    private String clientId;

    @Value("${spotify.client-secret}")
    private String clientSecret;

    @Value("${spotify.token-url}")
    private String tokenUrl;

    @PostConstruct
    public void init() {
        System.out.println("Client ID: " + clientId);
        System.out.println("Client Secret: " + clientSecret);
    }

    private String accessToken;
    private Instant tokenExpiration;

    private final RestTemplate restTemplate;  // ✅ 생성자 주입으로 변경

    public String getAccessToken() {
        String clientId = "905a8791cd2845ef85d1c61adf75e631";
        String clientSecret = "af7bb5202c54491aab492a3d4ba88e6f";
        String tokenUrl = "https://accounts.spotify.com/api/token";
    
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBasicAuth(clientId, clientSecret);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "client_credentials");
    
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            RestTemplate restTemplate = new RestTemplate();
    
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            
            return response.getBody().get("access_token").toString();  
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    

    private void refreshAccessToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(clientId, clientSecret);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseBody = response.getBody();
            this.accessToken = (String) responseBody.get("access_token");
            int expiresIn = (Integer) responseBody.get("expires_in");
            this.tokenExpiration = Instant.now().plusSeconds(expiresIn);
        }
    }
}
