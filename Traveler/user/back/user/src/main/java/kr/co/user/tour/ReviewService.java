package kr.co.user.tour;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TourRepository tourRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final SentimentAnalysisService sentimentAnalysisService;

    public ReviewService(ReviewRepository reviewRepository, TourRepository tourRepository,SentimentAnalysisService sentimentAnalysisService) {
        this.reviewRepository = reviewRepository;
        this.tourRepository = tourRepository;
        this.sentimentAnalysisService = sentimentAnalysisService;
    }

    // 특정 투어의 리뷰 목록 조회
    public Page<Review> getReviewsByTour(Long tourNum, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by(Sort.Direction.DESC, "createdAt")); // ✅ 최신순 정렬 추가
        return reviewRepository.findByTour_Num(tourNum, pageable);
    }

    // ✅ Map 데이터를 받아서 리뷰 저장
    @Transactional
    public Review saveReview(Long tourNum, String userName, Double rating, String content) {
        Tour tour = tourRepository.findById(tourNum)
                .orElseThrow(() -> new IllegalArgumentException("❌ 투어 ID를 찾을 수 없습니다: " + tourNum));
        String sentiment = sentimentAnalysisService.analyze(content); // ✅ 감정 분석 결과 가져오기
        if (sentiment == null || sentiment.isEmpty()) {
            sentiment = "unknown"; // 감정 분석 실패 시 기본값 설정
        }

        Review review = new Review();
        review.setTour(tour);
        review.setUserName(userName);
        review.setRating(rating);
        review.setContent(content);
        review.setSentiment(sentiment); // ✅ 감정 분석 결과 저장

        Review savedReview = reviewRepository.save(review);

        // ✅ 리뷰 저장 후 평균 별점 업데이트
        updateTourRating(tour);

        return savedReview;
    }

    // 투어의 평균 별점 계산 및 업데이트
    private void updateTourRating(Tour tour) {
        List<Review> reviews = reviewRepository.findByTour_Num(tour.getNum());
        if (!reviews.isEmpty()) {
            double averageRating = reviews.stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);

            // ✅ 소수점 1자리까지만 반올림
            BigDecimal roundedRating = new BigDecimal(averageRating)
                    .setScale(1, RoundingMode.HALF_UP);

            System.out.println("🟢 새로운 평균 별점 계산됨: " + roundedRating);

            tour.setRating(roundedRating.doubleValue());
        } else {
            tour.setRating(0.0);
        }

        System.out.println("🔄 TOUR 테이블 업데이트 중...");
        tourRepository.save(tour);
        System.out.println("✅ TOUR 테이블 업데이트 완료!");
    }

    private String analyzeSentiment(String text) {
        try {
            String apiUrl = "http://127.0.0.1:9000/api/reviews/analyze-sentiment/"; // ✅ BERT API URL
            Map<String, String> request = new HashMap<>();
            request.put("text", text);

            // ✅ BERT API 호출
            String sentiment = restTemplate.postForObject(apiUrl, request, String.class);
            System.out.println("🟢 감정 분석 결과: " + sentiment);
            return sentiment;
        } catch (Exception e) {
            System.out.println("❌ 감정 분석 실패: " + e.getMessage());
            return "unknown"; // 실패 시 기본값
        }
    }
}
