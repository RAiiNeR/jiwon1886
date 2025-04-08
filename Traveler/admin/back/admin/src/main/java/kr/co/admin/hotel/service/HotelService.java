package kr.co.admin.hotel.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.admin.hotel.entity.Hotel;
import kr.co.admin.hotel.entity.Room;
import kr.co.admin.hotel.repository.HotelRepository;
import kr.co.admin.hotel.repository.RoomRepository;

@Service
@Transactional
public class HotelService {
    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelReservationService reservationService;

    // 호텔 목록 조회 (리스트)
    public Page<Hotel> getHotels(int page, int size) {
        return hotelRepository.findAllByOrderByNumDesc(PageRequest.of(page, size));
    }

    // 이름으로 검색한 호텔 목록 조회 (페이지네이션)
    public Page<Hotel> searchHotelsByName(String name, Pageable pageable) {
        return hotelRepository.findByNameContainingIgnoreCaseOrderByNumDesc(name, pageable);
    }

    // 특정 호텔 상세 조회
    public Hotel getHotelByNum(Long num) {
        Hotel hotel = hotelRepository.findById(num).orElse(null);

        // 호텔이 존재하고 썸네일이 없으면 기본 이미지 설정
        if (hotel != null && (hotel.getThumbnail() == null || hotel.getThumbnail().isEmpty())) {
            hotel.setThumbnail("default.jpg"); // 기본 이미지로 설정
        }

        return hotel;
    }

    // 호텔 삭제
    public void deleteHotel(Long num) {
        hotelRepository.deleteById(num);
    }

    // 수정
    public Hotel updateHotel(Long num, Hotel hotel) {
        Hotel existingHotel = hotelRepository.findById(num).orElse(null);
        if (existingHotel != null) {
            hotel.setNum(num);
            return hotelRepository.save(hotel);
        }
        return null;
    }

    public List<Room> getHotelRooms(Long hotelNum) {
        return roomRepository.findByHotelNum(hotelNum);
    }

    public Map<String, Object> getHotelRoomsWithAvailability(Long hotelNum) {
        List<Room> rooms = roomRepository.findByHotelNum(hotelNum);
        Map<String, Object> result = new HashMap<>();
        result.put("rooms", rooms);

        // 사용 중인 객실 수 계산
        int usedRooms = reservationService.getUsedRoomCountByHotel(hotelNum);

        // 예약 가능한 객실 수 계산
        int totalRooms = rooms.stream().mapToInt(Room::getNumRooms).sum();
        int availableRooms = totalRooms - usedRooms;

        result.put("usedRooms", usedRooms);
        result.put("availableRooms", availableRooms);

        return result;
    }
}
