package kr.co.user.hotel.controller;

import java.text.SimpleDateFormat;
import java.util.Map;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.user.hotel.entity.Hotel;
import kr.co.user.hotel.entity.HotelReservation;
import kr.co.user.hotel.entity.Room;
import kr.co.user.hotel.repository.HotelRepository;
import kr.co.user.hotel.repository.HotelReservationRepository;
import kr.co.user.hotel.service.RoomService;
import kr.co.user.hotel.service.EmailService;
import kr.co.user.hotel.vo.HotelReservationVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class HotelReservationController {

    private static final Logger log = LoggerFactory.getLogger(HotelReservationController.class);

    @Autowired
    private HotelReservationRepository hotelReservationRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private HotelRepository hotelRepository;

    @PostMapping("/reservation")
    public ResponseEntity<?> createReservation(@RequestBody HotelReservationVO reservationVO) {
        log.info("예약 요청 데이터: {}", reservationVO);

        try {
            HotelReservation reservation = new HotelReservation();
            BeanUtils.copyProperties(reservationVO, reservation);

            // 객실 예약 가능 여부 확인
            Long roomId = reservationVO.getRoomnum();
            boolean isAvailable = roomService.isRoomAvailableAndReserve(roomId);

            if (!isAvailable) {
                log.warn("남은 객실이 없습니다. roomId: {}", roomId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "남은 객실이 없습니다."));
            }

            // 객실 정보와 호텔 정보 가져오기
            Room room = roomService.getRoom(roomId); // 객실 정보
            Hotel hotel = getHotelByRoom(room); // 객실에 해당하는 호텔 정보

            // 객실 이름과 호텔 이름 가져오기
            String roomName = room != null ? room.getName() : "정보 없음";
            String hotelName = hotel != null ? hotel.getName() : "정보 없음";

            reservation.setRoomnum(room);

            // 예약 저장 전 로그
            log.info("예약 저장 전 데이터: {}", reservation);

            // 예약 저장
            hotelReservationRepository.save(reservation);

            // 날짜 포맷 설정 (한글 날짜)
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy년 MM월 dd일");
            String checkinDate = sdf.format(reservation.getCheckindate()); // 체크인 날짜 한글로 포맷
            String checkoutDate = sdf.format(reservation.getCheckoutdate()); // 체크아웃 날짜 한글로 포맷

            // 이메일 내용 수정
            String subject = "호텔 예약 확인서";
            String text = "<h1>예약이 완료되었습니다!</h1>" +
                    "<p>호텔: " + hotelName + "</p>" + // 호텔 이름
                    "<p>객실: " + roomName + "</p>" + // 객실 이름
                    "<p>체크인 날짜: " + checkinDate + "</p>" + // 한글로 포맷된 체크인 날짜
                    "<p>체크아웃 날짜: " + checkoutDate + "</p>" + // 한글로 포맷된 체크아웃 날짜
                    "<p>예약자 이메일: " + reservation.getMemberemail() + "</p>" +
                    "<p>총 결제 금액: " + reservation.getTotalprice() + "원</p>";

            // 이메일 발송
            emailService.sendReservationEmail(reservation.getMemberemail(), subject, text);

            return ResponseEntity.ok(Map.of("message", "예약이 완료되었습니다. 이메일을 확인하세요."));

        } catch (Exception e) {
            log.error("❌ 예약 실패! 예외 발생: {}", e.getMessage(), e); // 예외 메시지 포함해서 출력
            e.printStackTrace(); // 콘솔에 전체 스택 트레이스 출력

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "예약에 실패했습니다.", "message", e.getMessage()));
        }
    }

    // 객실을 통해 해당 호텔 정보를 가져오는 메서드
    private Hotel getHotelByRoom(Room room) {
        // 객실에 해당하는 hotelNum을 이용하여 호텔 정보를 조회
        if (room != null) {
            Long hotelNum = room.getHotelNum(); // 객실에 해당하는 호텔 번호
            return hotelRepository.findById(hotelNum).orElse(null); // HotelRepository를 사용하여 호텔 정보 조회
        }
        return null; // 객실이 없으면 null 반환
    }
}
