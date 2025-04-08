package kr.co.user.tour;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    @GetMapping("/{tourNum}")
    public ResponseEntity<Map<String, Object>> getReviews(
            @PathVariable("tourNum") Long tourNum,
            @RequestParam(name = "page", defaultValue = "1") Integer page) {
        int pageSize = 5;

        Page<Review> reviewPage = reviewService.getReviewsByTour(tourNum, page, pageSize);

        // ✅ 감정 분석 결과도 반환하도록 수정
        List<Map<String, Object>> reviewsWithSentiment = reviewPage.getContent().stream().map(review -> {
            Map<String, Object> reviewMap = new HashMap<>();
            reviewMap.put("id", review.getId());
            reviewMap.put("userName", review.getUserName());
            reviewMap.put("rating", review.getRating());
            reviewMap.put("content", review.getContent());
            reviewMap.put("createdAt", review.getCreatedAt());
            reviewMap.put("sentiment", review.getSentiment()); // ✅ 감정 분석 결과 추가
            return reviewMap;
        }).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("reviews", reviewsWithSentiment);
        response.put("totalPages", reviewPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    
    @PostMapping("/add-review")
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
}