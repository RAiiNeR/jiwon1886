package kr.co.user.hotel.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.user.hotel.entity.Room;
import kr.co.user.hotel.repository.HotelReservationRepository;
import kr.co.user.hotel.repository.RoomRepository;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelReservationRepository hotelReservationRepository;

    public Room getRoom(Long roomnum) {
        return roomRepository.findById(roomnum).get();
    }

    // 전체 객실 목록을 가져오는 메소드
    public List<Room> getRoomList() {
        return roomRepository.findAll();
    }

    // 특정 객실의 남은 객실 수를 계산하는 메소드
    public int getAvailableRooms(Long roomId) {
        // 해당 객실 정보 조회
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("객실을 찾을 수 없습니다."));

        // 사용 중인 객실 수 (numPerRooms) 구하기
        int reservedRooms = room.getNumPerRooms(); // 이미 예약된 객실 수

        // 남은 객실 수 계산
        return room.getNumRooms() - reservedRooms; // 전체 객실 수 - 예약된 객실 수
    }

    // 예약 가능 여부 확인 후 예약 처리
    public boolean isRoomAvailableAndReserve(Long roomId) {
        int availableRooms = getAvailableRooms(roomId);
        if (availableRooms > 0) {
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new RuntimeException("객실을 찾을 수 없습니다."));
            // 예약 시, 사용 중인 객실 수를 증가시킴 (예약이 되면 남은 객실이 줄어듦)
            room.setNumPerRooms(room.getNumPerRooms() + 1);
            roomRepository.save(room);
            return true; // 예약 성공
        }
        return false; // 예약 실패 (남은 객실 없음)
    }
}
