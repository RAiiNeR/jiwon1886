package kr.co.admin.hotel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.admin.hotel.dto.HotelReservationDTO;
import kr.co.admin.hotel.service.HotelReservationService;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class HotelReservationController {

    @Autowired
    private HotelReservationService reservationService;

    // 관리자 예약 조회 (페이징 추가)
    @GetMapping("/list")
    public ResponseEntity<Page<HotelReservationDTO>> getAllReservations(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Page<HotelReservationDTO> reservations = reservationService.getAllReservationsWithDetails(page, size);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    // 예약 번호로 예약 디테일 조회
    @GetMapping("/{num}")
    public ResponseEntity<HotelReservationDTO> getReservationByNum(@PathVariable("num") Long num) {
        Optional<HotelReservationDTO> reservation = reservationService.getReservationByNum(num);
        if (reservation.isPresent()) {
            return ResponseEntity.ok(reservation.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 예약 번호로 삭제
    @DeleteMapping("/{num}")
    public ResponseEntity<String> deleteReservation(@PathVariable("num") Long num) {
        try {
            reservationService.deleteByNum(num);
            return ResponseEntity.ok("예약이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("예약 삭제 실패");
        }
    }
}
