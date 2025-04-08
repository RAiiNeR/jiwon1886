package kr.co.admin.tour;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    private final TourService tourService;
    private final ObjectMapper objectMapper; // JSON 파싱을 위한 ObjectMapper 추가
    private final ReviewRepository reviewRepository;

    public TourController(TourService tourService, ObjectMapper objectMapper, ReviewRepository reviewRepository) {
        this.tourService = tourService;
        this.objectMapper = objectMapper;
        this.reviewRepository = reviewRepository;
    }

    // ✅ 투어 등록 (이미지 & 스케줄 포함)
     @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadTour(
        @RequestParam("jsonData") String jsonData,  // JSON 데이터를 String으로 받음
        @RequestParam("thumbnail") MultipartFile thumbnail,  // 대표 이미지 파일
        @RequestParam("additionalImages") List<MultipartFile> additionalImages // 추가 이미지 리스트
    ) {
        Map<String, Object> tourData;

        try {
            // ✅ JSON 문자열을 Map<String, Object>로 변환
            tourData = objectMapper.readValue(jsonData, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "JSON 파싱 오류", "error", e.getMessage()));
        }

        // ✅ 서비스 로직 실행
        tourService.saveTourWithDetails(tourData, thumbnail, additionalImages);

        Map<String, Object> response = Map.of("message", "투어 등록 성공", "status", "success");
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
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "9") int size) {
        System.out.println("🔥 API 요청: keyword=" + keyword + ", page=" + page);
        try {
            if (page < 0) page = 0; // 🔥 페이지 번호가 0보다 작으면 0으로 설정
        Page<Tour> tours = tourService.getTours(keyword, page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("content", tours.getContent());
        response.put("totalPages", tours.getTotalPages());
        response.put("totalElements", tours.getTotalElements());
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            Map.of("message", "서버 에러 발생", "error", e.getMessage())
        );
    }
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

    @GetMapping("/{tourId}/review-count")
    public ResponseEntity<Long> getReviewCount(@PathVariable("tourId") Long tourId){
        long reviewCount = reviewRepository.countByTour_Num(tourId);
        return ResponseEntity.ok(reviewCount);

    }

}
