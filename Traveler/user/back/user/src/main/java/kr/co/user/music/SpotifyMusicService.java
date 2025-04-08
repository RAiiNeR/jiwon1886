package kr.co.user.music;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SpotifyMusicService {

    @Value("${spotify.api-url}")
    private String apiUrl;

    @Lazy
    private final SpotifyAuthService spotifyAuthService;
    private final RestTemplate restTemplate;

    private final List<Map<String, String>> defaultPlaylist = List.of(
        Map.of("name", "like JENNIE", "image", "https://i.scdn.co/image/ab67616d0000b2735a43918ea90bf1e44b7bdcfd", "url", "https://open.spotify.com/track/0DC62SYIRKMFgx2f7OyvwD?si=0356e9bea8be4ffe"),
        Map.of("name", "Air", "image", "https://i.scdn.co/image/ab67616d0000b27338d7a50443e2a6043d6da247", "url", "https://open.spotify.com/track/6OOEQb3Su7Khcw9rDcJ07L?si=0cbaf287013b493d"),
        Map.of("name", "APT.", "image", "https://i.scdn.co/image/ab67616d0000b27336032cb4acd9df050bc2e197","url", "https://open.spotify.com/track/2vDkR3ctidSd17d2CygVzS?si=73dce278963d4403"),
        Map.of("name", "How Sweet", "image", "https://i.scdn.co/image/ab67616d0000b273b657fbb27b17e7bd4691c2b2","url", "https://open.spotify.com/track/38tXZcL1gZRfbqfOG0VMTH?si=c005c16487874bf2"),
        Map.of("name", "Supernova", "image", "https://i.scdn.co/image/ab67616d0000b273115d1e2cfde4e387f0a13ce2","url", "https://open.spotify.com/track/18nZWRpJIHzgb1SQr4ncwb?si=a95ac66edc034c07")
        );

    public List<Map<String,String>> getMusicForWeather(String weather) {
        Map<String, String> attributes = mapWeatherToAttributes(weather);
        String genre = attributes.get("genre");

        System.out.println("🔹 Genre: " + genre);
        
        return searchSpotifyPlaylists(genre);
    }

    private Map<String, String> mapWeatherToAttributes(String weather) {
        Map<String, String> attributes = new HashMap<>();
        attributes.put("genre", "kpop");  // 기본 장르 K-pop

        switch (weather.toLowerCase()) {
            case "rain":
                attributes.put("mood", "calm");
                attributes.put("tempo", "slow");
                break;
            case "clear":
                attributes.put("mood", "energetic");
                attributes.put("tempo", "fast");
                break;
            case "clouds":
                attributes.put("mood", "chill");
                attributes.put("tempo", "medium");
                break;
            default:
                attributes.put("mood", "chill");
                attributes.put("tempo", "medium");
                break;
        }
        return attributes;
    }

    private List<Map<String, String>> searchSpotifyPlaylists(String genre) {
        String searchUrl = apiUrl + "/search?q=" + genre + "&type=playlist&limit=10";
        
        ResponseEntity<Map> searchResponse = makeApiRequest(searchUrl);
        if (searchResponse.getStatusCode() != HttpStatus.OK) {
            System.out.println("⚠️ 플레이리스트 검색 실패. 기본 플레이리스트 반환.");
            return defaultPlaylist;
        }

        Map<String, Object> responseBody = searchResponse.getBody();
        System.out.println("🔹 API Response: " + responseBody);

        if (responseBody != null && responseBody.containsKey("playlists")) {
            Map<String, Object> playlists = (Map<String, Object>) responseBody.get("playlists");
            List<Map<String, Object>> items = (List<Map<String, Object>>) playlists.get("items");

            if (items == null || items.isEmpty()) {
                System.out.println("⚠️ 플레이리스트가 존재하지 않음. 기본 플레이리스트 반환.");
                return defaultPlaylist;
            }

            int randomIndex = (int) (Math.random() * items.size());
            Map<String, Object> selectedPlaylist = items.get(randomIndex);

            if (selectedPlaylist != null && selectedPlaylist.containsKey("id")) {
                String playlistId = (String) selectedPlaylist.get("id");
                String playlistUrl = "https://open.spotify.com/playlist/" + playlistId;
                
                List<Map<String, String>> tracks = getTrackNamesAndImagesFromPlaylist(playlistId);
                
                return tracks;
            }
        }

        return defaultPlaylist;
    }

    private List<Map<String, String>> getTrackNamesAndImagesFromPlaylist(String playlistId) {
        String url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks?limit=10";
        
        ResponseEntity<Map> response = makeApiRequest(url);
        if (response.getStatusCode() != HttpStatus.OK) {
            System.out.println("⚠️ 플레이리스트 트랙 가져오기 실패. 기본 플레이리스트 반환.");
            return defaultPlaylist;
        }

        List<Map<String, String>> trackDetailsList = new ArrayList<>();
        Map<String, Object> responseBody = response.getBody();

        if (responseBody != null && responseBody.containsKey("items")) {
            List<Map<String, Object>> tracks = (List<Map<String, Object>>) responseBody.get("items");
            if (tracks == null || tracks.isEmpty()) {
                System.out.println("⚠️ 트랙이 존재하지 않음. 기본 플레이리스트 반환.");
                return defaultPlaylist;
            }

            for (Map<String, Object> track : tracks) {
                if (track != null && track.containsKey("track")) {
                    Map<String, Object> trackDetails = (Map<String, Object>) track.get("track");

                    if (trackDetails != null) {
                        String trackName = (String) trackDetails.get("name");
                        String trackId = (String) trackDetails.get("id");
                        String trackUrl = "https://open.spotify.com/track/" + trackId;

                        Map<String, Object> albumDetails = (Map<String, Object>) trackDetails.get("album");
                        List<Map<String, Object>> albumImages = (List<Map<String, Object>>) albumDetails.get("images");
                        String albumImageUrl = albumImages != null && !albumImages.isEmpty()
                                ? (String) albumImages.get(0).get("url")
                                : "/images/default-music.jpg";  // 기본 이미지

                        if (trackName != null && !trackName.isEmpty()) {
                            Map<String, String> trackInfo = new HashMap<>();
                            trackInfo.put("name", trackName);
                            trackInfo.put("image", albumImageUrl);
                            trackInfo.put("url", trackUrl);

                            trackDetailsList.add(trackInfo);
                        }
                    }
                }
            }
        }

        return trackDetailsList.isEmpty() ? defaultPlaylist : trackDetailsList;
    }

    private ResponseEntity<Map> makeApiRequest(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(spotifyAuthService.getAccessToken());
        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            return restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        } catch (Exception e) {
            System.out.println("❌ API 요청 오류: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
