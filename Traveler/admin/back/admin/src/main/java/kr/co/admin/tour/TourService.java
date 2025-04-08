package kr.co.admin.tour;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;
    private final TourScheduleRepository tourScheduleRepository;
    private final TourImageRepository tourImageRepository;

    private String saveFile(MultipartFile file) {
        try {
            // ✅ 저장할 디렉토리 지정
            String uploadDir = "./files/img/tour/";
            Files.createDirectories(Paths.get(uploadDir)); // 디렉토리 없으면 생성

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            String fileName = UUID.randomUUID().toString() + "." + extension;
            Path filePath = Paths.get(uploadDir + fileName);

            // ✅ 파일 저장
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // ✅ 저장된 파일 경로 반환
            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("파일 저장 실패: " + e.getMessage());
        }
    }

    // ✅ 투어 등록 (이미지 & 스케줄 포함)
    @Transactional
    public void saveTourWithDetails(Map<String, Object> data, MultipartFile thumbnailFile,
            List<MultipartFile> additionalImageFiles) {
        Tour tour = new Tour();
        tour.setName((String) data.get("name"));
        tour.setRating(data.get("rating") instanceof Number ? ((Number) data.get("rating")).doubleValue() : 0.0);
        tour.setDays(data.get("days") instanceof Number ? ((Number) data.get("days")).intValue() : 0);
        tour.setHit(data.get("hit") instanceof Number ? ((Number) data.get("hit")).intValue() : 0);
        tour.setContent((String) data.get("content"));
        tour.setLocation((String) data.get("location"));
        tour.setTheme((String) data.get("theme"));
        tour.setVideoLink((String) data.get("videoLink"));
        tour.setTDate(new Date());

        // ✅ 1️⃣ 썸네일 저장 (파일 있을 경우에만)
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            String savedThumbnailPath = saveFile(thumbnailFile);
            tour.setThumbnail(savedThumbnailPath); // 저장된 경로를 DB에 저장
        }

        // ✅ 2️⃣ 부모 엔티티 저장 (ID 발급)
        Tour savedTour = tourRepository.saveAndFlush(tour);
        if (savedTour.getNum() == null) {
            throw new RuntimeException("Tour 저장 실패: ID가 생성되지 않음");
        }

        // ✅ 3️⃣ 추가 이미지 저장
        List<TourImage> tourImages = new ArrayList<>();
        if (additionalImageFiles != null) {
            for (MultipartFile file : additionalImageFiles) {
                if (!file.isEmpty()) {
                    String savedImagePath = saveFile(file);
                    TourImage image = new TourImage();
                    image.setImgName(savedImagePath);
                    image.setTour(savedTour);
                    tourImages.add(image);
                }
            }
            tourImageRepository.saveAll(tourImages);
        }

        // ✅ 4️⃣ 스케줄 저장
        List<TourSchedule> tourSchedules = new ArrayList<>();
        List<Map<String, Object>> scheduleList = (List<Map<String, Object>>) data.get("schedules");
        if (scheduleList != null) {
            for (Map<String, Object> o : scheduleList) {
                TourSchedule schedule = new TourSchedule();
                schedule.setTour(savedTour);
                schedule.setDay(o.get("day") instanceof Number ? ((Number) o.get("day")).intValue() : 0);
                schedule.setContent((String) o.get("content"));
                schedule.setPlace((String) o.get("place"));
                tourSchedules.add(schedule);
            }
            tourScheduleRepository.saveAll(tourSchedules);
        }
    }

   // ✅ 특정 투어 조회 (스케줄 & 이미지 포함)
    @Transactional(readOnly = true)
    public Tour getTourDetail(Long tourId) {
        return tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));
    }

    // ✅ 모든 투어 조회
    @Transactional(readOnly = true)
    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Tour> getTours(String ketword, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        return tourRepository.searchTours(ketword, pageable);
    }

    // ✅ 특정 투어의 스케줄 조회
    @Transactional(readOnly = true)
    public List<TourSchedule> getTourSchedules(Long tourId) {
        return tourScheduleRepository.findByTour_Num(tourId);
    }

    // ✅ 특정 투어의 이미지 조회
    @Transactional(readOnly = true)
    public List<TourImage> getTourImages(Long tourId) {
        return tourImageRepository.findByTour_Num(tourId);
    }

    // ✅ 투어 삭제 (연관된 스케줄 & 이미지도 함께 삭제)
    @Transactional
    public void deleteTour(Long tourId) {
        Optional<Tour> tourOptional = tourRepository.findById(tourId);
        if (tourOptional.isPresent()) {
            // ✅ 1️⃣ 연관된 스케줄 & 이미지 삭제 최적화
            tourScheduleRepository.deleteAllByTour_Num(tourId);
            tourImageRepository.deleteAllByTour_Num(tourId);

            // ✅ 2️⃣ 투어 삭제
            tourRepository.delete(tourOptional.get());
        } else {
            throw new RuntimeException("Tour not found");
        }
    }


    @Transactional
    public Tour updateTour(Long tourId, Map<String, Object> data) {
        // ✅ 기존 투어 조회
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        // ✅ 값이 있을 경우에만 업데이트
        if (data.containsKey("name"))
            tour.setName((String) data.get("name"));
        if (data.containsKey("rating"))
            tour.setRating((Double) data.get("rating"));
        if (data.containsKey("content"))
            tour.setContent((String) data.get("content"));
        if (data.containsKey("days"))
            tour.setDays((Integer) data.get("days"));
        if (data.containsKey("location"))
            tour.setLocation((String) data.get("location"));
        if (data.containsKey("thumbnail"))
            tour.setThumbnail((String) data.get("thumbnail"));
        if (data.containsKey("hit"))
            tour.setHit((Integer) data.get("hit"));
        if (data.containsKey("theme"))
            tour.setTheme((String) data.get("theme"));
        if (data.containsKey("videoLink"))
            tour.setVideoLink((String) data.get("videoLink"));

        // ✅ 업데이트된 투어 저장
        return tourRepository.save(tour);
    }

}
