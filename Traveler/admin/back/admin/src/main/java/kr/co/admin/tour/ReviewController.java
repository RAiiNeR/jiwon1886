package kr.co.admin.tour;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ✅ 특정 투어의 리뷰 목록 조회
    @GetMapping("/{tourNum}") // url 수정
    public ResponseEntity<Map<String, Object>> getReviews(
            @PathVariable("tourNum") Long tourNum,
            @RequestParam(name = "page", defaultValue = "1") Integer page) {
        int pageSize = 5;

        Page<Review> reviewPage = reviewService.getReviewsByTour(tourNum, page, pageSize);

        Map<String, Object> response = new HashMap<>();
        response.put("reviews", reviewPage.getContent());
        response.put("totalPages", reviewPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // ✅ DTO 제거 후, Review 엔티티 직접 사용
    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> reviewMap) {
        try {
            System.out.println("🟢 받은 요청 데이터: " + reviewMap.toString());

            Long tourNum = ((Number) reviewMap.get("tourNum")).longValue();
            String userName = (String) reviewMap.get("userName");
            Double rating = ((Number) reviewMap.get("rating")).doubleValue();
            String content = (String) reviewMap.get("content");

            Review savedReview = reviewService.saveReview(tourNum, userName, rating, content);

            Map<String, Object> response = new HashMap<>();
            response.put("id", savedReview.getId());
            response.put("tourNum", tourNum);
            response.put("userName", userName);
            response.put("rating", rating);
            response.put("content", content);
            response.put("createdAt", savedReview.getCreatedAt());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable("reviewId") Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(Collections.singletonMap("message", "리뷰 삭제 완료"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "리뷰 삭제 중 오류 발생"));
        }
    }
}