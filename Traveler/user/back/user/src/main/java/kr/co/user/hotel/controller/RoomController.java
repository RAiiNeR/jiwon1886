package kr.co.user.hotel.controller;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.user.hotel.entity.Room;
import kr.co.user.hotel.repository.RoomRepository;
import kr.co.user.hotel.vo.RoomVO;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final Path uploadDir = Paths.get("./files/img/hotels")
            .toAbsolutePath().normalize();

    public RoomController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory.", e);
        }
    }

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/hotel/{hotelNum}")
    public List<Room> getRoomByHotelNum(@PathVariable("hotelNum") Long hotelNum) {
        return roomRepository.findByHotelNum(hotelNum);
    }

    // 개별 객실 정보 조회
    @GetMapping("/{roomNum}")
    public ResponseEntity<Room> getRoomByRoomNum(@PathVariable("roomNum") Long roomNum) {
        Optional<Room> room = roomRepository.findById(roomNum);

        if (room.isPresent()) {
            return ResponseEntity.ok(room.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping // 게시글 작성, 이미지 업로드 - 서버에 이미지 파일 저장, 데이터베이스에 게시글 저장
    public Room createRoom(@ModelAttribute RoomVO vo) throws IOException {
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
        Room room = new Room();
        room.setName(vo.getName());
        room.setHotelNum(vo.getHotelNum());
        room.setPrice(vo.getPrice());
        room.setMaxPerson(vo.getMaxPerson());
        room.setNumRooms(vo.getNumRooms());
        room.setNumPerRooms(vo.getNumPerRooms());
        room.setContent(vo.getContent());
        room.setThumbnail(thumbnailName);
        room.setImgNames(imageNames); // 업로드된 파일명 저장

        return roomRepository.save(room); // `Hotel` 엔티티를 `createHotel()`로 전달
    }
}
