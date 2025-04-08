package kr.co.user.hotel.controller;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import kr.co.user.hotel.entity.Hotel;
import kr.co.user.hotel.service.HotelService;
import kr.co.user.hotel.vo.HotelVO;

// 2025-02-15 황보도연 추가 
@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    // 특정 호텔을 조회하는 메서드 (디테일)
    // @GetMapping("/{num}")
    // public Hotel getHotelById(@PathVariable("num") Long num) {
    // return hotelRepository.findById(num).orElse(null);
    // }

    // @GetMapping("/{num}")
    // public Hotel getHotelById(@PathVariable("num") Long num) {
    // return hotelService.getHotelByNum(num); // 이미지를 포함한 호텔 반환
    // }

    // 2025-02-27 전준영 수정

    // 업로드할 파일의 디렉토리 설정
    private final Path uploadDir = Paths.get("./files/img/hotels")
            .toAbsolutePath().normalize();

    public HotelController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory.", e);
        }
    }

    @PostMapping // 게시글 작성, 이미지 업로드 - 서버에 이미지 파일 저장, 데이터베이스에 게시글 저장
    public Hotel createHotel(@ModelAttribute HotelVO vo) throws IOException {
        // Path uploadDir = Paths.get("./files/img/hotels"); // 이미지 저장 경로 지정
        String thumbnailName = "";

        if (!vo.getThumbnail().isEmpty()) {
            String originalFileName = vo.getThumbnail().getOriginalFilename();
            System.out.println(originalFileName);
            try {
                Path destinationFile = uploadDir.resolve(originalFileName).normalize();
                Files.copy(vo.getThumbnail().getInputStream(), destinationFile); // 파일 저장
            } catch (FileAlreadyExistsException e) {
                System.out.println("파일이 이미 있음");
            } finally {
                thumbnailName = vo.getThumbnail().getOriginalFilename();
            }
        }

        List<String> imageNames = new ArrayList<>();
        System.out.println("Logs================>" + uploadDir);
        // 업로드된 이미지 처리
        if (vo.getImages() != null) {
            for (MultipartFile multipartFile : vo.getImages()) {
                if (!multipartFile.isEmpty()) {
                    String originalFileName = multipartFile.getOriginalFilename();
                    System.out.println(originalFileName);
                    try {
                        Path destinationFile = uploadDir.resolve(originalFileName).normalize();
                        Files.copy(multipartFile.getInputStream(), destinationFile); // 파일 저장
                    } catch (FileAlreadyExistsException e) {
                        System.out.println("파일이 이미 있음");
                    } finally {
                        imageNames.add(originalFileName); // 파일명 추가
                    }
                }
            }
        } else {
            imageNames.add(""); // 이미지가 없는 경우 빈문자열 추가
        }

        // HotelVO → Hotel 변환
        Hotel hotel = new Hotel();
        hotel.setName(vo.getName());
        hotel.setMembernum(vo.getMembernum());
        hotel.setRating(vo.getRating());
        hotel.setContent(vo.getContent());
        hotel.setLocation(vo.getLocation());
        hotel.setThumbnail(thumbnailName);
        hotel.setHit(0);
        hotel.setHdate(new Date());
        hotel.setImgNames(imageNames); // 업로드된 파일명 저장

        return hotelService.createHotel(hotel); // `Hotel` 엔티티를 `createHotel()`로 전달
    }

    // 특정 게시글 상세 조회
    @GetMapping("/{num}")
    public Hotel getHotel(@PathVariable("num") Long num) {
        System.out.println("디테일 실행");
        return hotelService.getHotelByNum(num); // 게시글 번호로 조회
    }

    // 제목을 포함하는 게시글을 페이징하여 조회
    @GetMapping("/search")
    public Page<Hotel> getHotelByTitle(
            @RequestParam(name = "title", defaultValue = "") String title, // 제목
            @RequestParam(name = "page", defaultValue = "1") int page, // 페이지 번호
            @RequestParam(name = "size", defaultValue = "9") int size // 페이지 크기
    ) {
        return hotelService.getHotelsWithPagination(title, page, size);
    }

    // 게시글 생성 테스트용
    // @PostMapping("/test")
    // public void creatFreeboard(Hotel vo) throws IOException {
    // System.out.println("title:" + vo.getName());
    // }

    @DeleteMapping
    public ResponseEntity<?> deleteHotel(@RequestParam("num") Long num) {
        hotelService.delete(num); // 게시글 삭제
        return ResponseEntity.ok().body(num + "번 게시글 삭제 완료");
    }

    @GetMapping
    public Page<Hotel> getHotels(
            @RequestParam(name = "searchQuery", defaultValue = "") String searchQuery,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "9") int size) {
        return hotelService.getHotelsWithPagination(searchQuery, page, size);
    }

    @GetMapping("/coalition")
    public Page<Hotel> getHotelsByNum(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "9") int size,
            @RequestParam("num") int num) {
        return hotelService.getHotelsWithPaginationByNum(page, size, num);
    }

    // 게시글 수정 (새로운 API 추가)
    @PutMapping("/{num}")
    public Hotel updateHotel(@PathVariable("num") Long num, @ModelAttribute Hotel updateHotel) {
        return hotelService.updateHotel(num, updateHotel);
    }
}
