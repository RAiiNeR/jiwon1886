package kr.co.user.tour;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;
    private final ReviewRepository reviewRepository;

    // ✅ 투어 등록 (이미지 & 스케줄 포함)
    @PostMapping(value = "/upload")
    public ResponseEntity<Map<String, Object>> uploadTour(@RequestBody Map<String, Object> tour) {
        System.out.println("Received Tour Object: " + tour);
        tourService.saveTourWithDetails(tour);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Tour uploaded successfully!");
        response.put("status", "success");

        return ResponseEntity.ok(response);
    }

    // ✅ 특정 투어 조회 (상세 보기)
    @GetMapping("/{tourId}")
    public ResponseEntity<Tour> getTourDetail(@PathVariable("tourId") Long tourId) {
        Tour tour = tourService.getTourDetail(tourId);
        return ResponseEntity.ok(tour);
    }

    // ✅ 모든 투어 조회 - 항상 배열을 반환
    // @GetMapping
    // public ResponseEntity<List<Tour>> getAllTours() {
    // List<Tour> tours = tourService.getAllTours();
    // return ResponseEntity.ok(tours != null ? tours : Collections.emptyList());
    // }

    @GetMapping
    public ResponseEntity<?> getTours(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", required = false) String sort) { // ✅ sort 파라미터 추가
        System.out.println("🔥 API 요청: keyword=" + keyword + ", page=" + page + ", sort=" + sort);
        try {
            Page<Tour> tours = tourService.getTours(keyword, page - 1, size, sort); // ✅ sort 파라미터 전달
            Map<String, Object> response = new HashMap<>();
            response.put("content", tours.getContent());
            response.put("totalPages", tours.getTotalPages());
            response.put("totalElements", tours.getTotalElements());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTours() {
        try {
            List<Tour> tours = tourService.getAllTours(); // ✅ 전체 데이터 가져오는 서비스 호출
            return ResponseEntity.ok(tours);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생: " + e.getMessage());
        }
    }

    @GetMapping("/similar")
    public List<Tour> getSimilarTours(@RequestParam(name = "theme", required = false) String theme) {
        if (theme == null || theme.trim().isEmpty()) {
            throw new IllegalArgumentException("테마 값이 필요합니다.");
        }
        return tourService.getToursByTheme(theme);
    }

    @GetMapping("/test-similar")
    public List<Tour> testSimilar(@RequestParam String theme) {
        return tourService.getToursByTheme(theme);
    }

    // ✅ 특정 투어의 스케줄 조회
    @GetMapping("/{tourId}/schedules")
    public ResponseEntity<List<TourSchedule>> getTourSchedules(@PathVariable("tourId") Long tourId) {
        List<TourSchedule> schedules = tourService.getTourSchedules(tourId);
        return ResponseEntity.ok(schedules);
    }

    // ✅ 특정 투어의 이미지 조회
    @GetMapping("/{tourId}/images")
    public ResponseEntity<List<TourImage>> getTourImages(@PathVariable("tourId") Long tourId) {
        List<TourImage> images = tourService.getTourImages(tourId);
        return ResponseEntity.ok(images);
    }

    // ✅ 투어 삭제 (스케줄 & 이미지 포함)
    @DeleteMapping("/{tourId}")
    public ResponseEntity<String> deleteTour(@PathVariable("tourId") Long tourId,
            @RequestBody(required = false) Map<String, Object> body) {
        System.out.println("Deleting Tour ID: " + tourId);
        tourService.deleteTour(tourId);
        return ResponseEntity.ok("Tour deleted successfully!");
    }

    @PutMapping("/{tourId}")
    public ResponseEntity<Tour> updateTour(
            @PathVariable("tourId") Long tourId,
            @RequestBody Map<String, Object> tourData) {
        Tour updatedTour = tourService.updateTour(tourId, tourData);
        return ResponseEntity.ok(updatedTour);
    }

    // ✅ 여행지 추천 API
    @PostMapping("/recommend")
    public Optional<Tour> recommendTour(@RequestBody Map<String, Object> requestData) {
        String location = (String) requestData.get("location");
        List<String> themes = (List<String>) requestData.get("themes");
        String mbti = (String) requestData.get("mbti");

        return tourService.recommendTour(location, themes, mbti);
    }

    @GetMapping("/location-count")
    public List<LocationTourCountDTO> getLocationTourCounts() {
        return tourService.getLocationTourCounts();
    }

    @GetMapping("/{tourId}/review-count")
    public ResponseEntity<Long> getReviewCount(@PathVariable("tourId") Long tourId) {
        long reviewCount = reviewRepository.countByTour_Num(tourId);
        return ResponseEntity.ok(reviewCount);

    }
}
