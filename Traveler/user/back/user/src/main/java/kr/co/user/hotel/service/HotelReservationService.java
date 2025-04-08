package kr.co.user.hotel.service;

import kr.co.user.hotel.entity.HotelReservation;
import kr.co.user.hotel.entity.Room;
import kr.co.user.hotel.repository.HotelReservationRepository;
import kr.co.user.hotel.repository.RoomRepository;
import kr.co.user.hotel.vo.HotelReservationVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HotelReservationService {

    @Autowired
    private HotelReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;

    public HotelReservation createReservation(HotelReservationVO reservationVO) {
        if (reservationVO.getCheckindate() == null) {
            throw new IllegalArgumentException("체크인 날짜는 필수입니다.");
        }
        if (reservationVO.getCheckoutdate() == null) {
            throw new IllegalArgumentException("체크아웃 날짜는 필수입니다.");
        }
        if (reservationVO.getNumguests() <= 0) {
            throw new IllegalArgumentException("인원 수는 1명 이상이어야 합니다.");
        }

        Room room = roomRepository.findById(reservationVO.getRoomnum())
                .orElseThrow(() -> new RuntimeException("객실을 찾을 수 없습니다."));

        if (room.getNumPerRooms() <= 0) {
            throw new RuntimeException("예약 가능한 객실이 없습니다.");
        }

        // 객실 수 감소 및 저장
        room.setNumPerRooms(room.getNumPerRooms() - 1);
        roomRepository.save(room);

        // 예약 생성 및 저장
        HotelReservation reservation = new HotelReservation();
        reservation.setCheckindate(reservationVO.getCheckindate());
        reservation.setCheckoutdate(reservationVO.getCheckoutdate());
        reservation.setNumguests(reservationVO.getNumguests());
        reservation.setMemberemail(reservationVO.getMemberemail());
        reservation.setTotalprice(reservationVO.getTotalprice());
        reservation.setStatus(reservationVO.getStatus());
        reservation.setRoomnum(room);

        return reservationRepository.save(reservation);
    }
}
