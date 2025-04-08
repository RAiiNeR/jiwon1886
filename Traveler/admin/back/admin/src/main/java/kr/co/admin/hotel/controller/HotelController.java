package kr.co.admin.hotel.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.admin.hotel.dto.HotelReservationDTO;
import kr.co.admin.hotel.entity.Hotel;
import kr.co.admin.hotel.entity.Room;
import kr.co.admin.hotel.service.HotelReservationService;
import kr.co.admin.hotel.service.HotelService;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private HotelReservationService reservationService;

    // 호텔 목록 조회 (리스트)
    @GetMapping
    public ResponseEntity<?> getHotels(
            @RequestParam(name = "name", required = false) String name, // 이름 검색 파라미터 추가
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {

        Page<Hotel> hotels;
        if (name != null && !name.isEmpty()) {
            hotels = hotelService.searchHotelsByName(name, PageRequest.of(page, size)); // 이름으로 검색
        } else {
            hotels = hotelService.getHotels(page, size); // 기본적인 페이지네이션
        }

        Map<String, Object> response = new HashMap<>();
        response.put("content", hotels.getContent()); // 호텔 데이터 리스트
        response.put("totalPages", hotels.getTotalPages()); // 전체 페이지 수
        response.put("totalElements", hotels.getTotalElements()); // 전체 호텔 수

        return ResponseEntity.ok(response);
    }

    // 특정 호텔 상세 조회
    @GetMapping("/{num}")
    public Hotel getHotel(@PathVariable("num") Long num) {
        Hotel hotel = hotelService.getHotelByNum(num);

        // thumbnail이 비어있으면 기본 이미지로 설정
        if (hotel.getThumbnail() == null || hotel.getThumbnail().isEmpty()) {
            hotel.setThumbnail("default.jpg");
        }

        return hotel;
    }

    // 호텔 삭제
    @DeleteMapping("/{num}")
    public void deleteHotel(@PathVariable("num") Long num) {
        hotelService.deleteHotel(num);
    }

    // 호텔 수정
    @PutMapping("/{num}")
    public Hotel updateHotel(@PathVariable("num") Long num, @RequestBody Hotel hotel) {
        return hotelService.updateHotel(num, hotel);
    }

    @GetMapping("/{num}/rooms")
    public List<Room> getHotelRooms(@PathVariable("num") Long num) {
        return hotelService.getHotelRooms(num);
    }

    // 객실 정보 및 사용 가능한 객실 수 조회
    @GetMapping("/{num}/rooms/availability")
    public Map<String, Object> getHotelRoomsWithAvailability(@PathVariable("num") Long num) {
        return hotelService.getHotelRoomsWithAvailability(num);
    }

    // 호텔 번호로 예약 목록 조회
    @GetMapping("/{num}/reservations")
    public List<HotelReservationDTO> getReservationsByHotelNum(@PathVariable("num") Long num) {
        return reservationService.getReservationsByHotelNum(num);
    }

}
