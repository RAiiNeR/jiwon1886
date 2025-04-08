package kr.co.user.music;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/music")
@RequiredArgsConstructor
public class MusicController {

    private final SpotifyMusicService spotifyMusicService;  
    
    @GetMapping("/recommendMusic")
    public ResponseEntity<List<Map<String, String>>> recommendedMusic(@RequestParam(name="weather") String weather) {
        List<Map<String, String>> recommendedPlaylists = spotifyMusicService.getMusicForWeather(weather);
        return ResponseEntity.ok(recommendedPlaylists);
    }
}