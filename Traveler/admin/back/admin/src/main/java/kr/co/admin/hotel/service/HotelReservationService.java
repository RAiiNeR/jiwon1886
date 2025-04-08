package kr.co.admin.hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.admin.hotel.dto.HotelReservationDTO;
import kr.co.admin.hotel.entity.Hotel;
import kr.co.admin.hotel.entity.HotelReservation;
import kr.co.admin.hotel.repository.HotelRepository;
import kr.co.admin.hotel.repository.HotelReservationRepository;
import kr.co.admin.member.MemberRepository;
import kr.co.admin.member.MemberVO;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class HotelReservationService {

        @Autowired
        private HotelReservationRepository reservationRepository;

        @Autowired
        private HotelRepository hotelRepository;

        @Autowired
        private MemberRepository memberRepository;

        // 예약 상세 조회
        public Optional<HotelReservationDTO> getReservationByNum(Long num) {
                return reservationRepository.findById(num)
                                .map(this::convertToDTO);
        }

        // 예약 조회 (페이징 추가)
        public Page<HotelReservationDTO> getAllReservationsWithDetails(int page, int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<HotelReservation> reservations = reservationRepository.findAll(pageable);
                return reservations.map(this::convertToDTO);
        }

        // 예약 삭제
        public void deleteByNum(Long num) {
                try {
                        Optional<HotelReservation> reservation = reservationRepository.findById(num);
                        if (!reservation.isPresent()) {
                                throw new RuntimeException("해당 예약을 찾을 수 없습니다.");
                        }
                        reservationRepository.delete(reservation.get());
                } catch (Exception e) {
                        throw new RuntimeException("예약 삭제 중 오류 발생", e);
                }
        }

        // DTO 변환 메서드
        private HotelReservationDTO convertToDTO(HotelReservation reservation) {
                HotelReservationDTO dto = new HotelReservationDTO();
                dto.setNum(reservation.getNum());
                dto.setMemberemail(reservation.getMemberemail());

                // roomnum이 null인지 체크
                if (reservation.getRoomnum() != null) {
                        dto.setRoomname(reservation.getRoomnum().getName());
                } else {
                        dto.setRoomname("No room assigned"); // 기본값 처리
                }

                dto.setCheckindate(reservation.getCheckindate());
                dto.setCheckoutdate(reservation.getCheckoutdate());
                dto.setTotalprice(reservation.getTotalprice());
                dto.setNumguests(reservation.getNumguests());

                // 호텔 이름 설정
                if (reservation.getRoomnum() != null) {
                        Hotel hotel = hotelRepository.findById(reservation.getRoomnum().getHotelNum()).orElse(null);
                        if (hotel != null) {
                                dto.setHotelname(hotel.getName());
                        } else {
                                dto.setHotelname("Unknown Hotel"); // 호텔 이름이 없을 경우 기본값 처리
                        }
                } else {
                        dto.setHotelname("Unknown Hotel"); // roomnum이 없을 경우 기본값 처리
                }

                // 멤버 이름 설정
                if (reservation.getMembernum() != null) {
                        MemberVO memberVO = memberRepository.findById(reservation.getMembernum()).orElse(null);
                        if (memberVO != null) {
                                dto.setMembername(memberVO.getName());
                        } else {
                                dto.setMembername("Unknown Member"); // 멤버 이름이 없을 경우 기본값 처리
                        }
                }

                return dto;
        }

        // 호텔 번호로 사용 중인 객실 수 계산
        public int getUsedRoomCountByHotel(Long hotelNum) {
                List<HotelReservation> reservations = reservationRepository.findAll();
                int count = 0;
                String usedStatus = "C"; // 실제 데이터베이스의 "사용 중" 상태 값으로 수정 필요

                for (HotelReservation reservation : reservations) {
                        if (reservation.getRoomnum() != null && reservation.getRoomnum().getHotelNum() != null
                                        && reservation.getRoomnum().getHotelNum().equals(hotelNum)
                                        && usedStatus.equals(reservation.getStatus())) {
                                count++;
                        }
                }
                return count;
        }

        // 호텔 번호로 예약 목록 조회
        public List<HotelReservationDTO> getReservationsByHotelNum(Long hotelNum) {
                List<HotelReservation> reservations = reservationRepository.findAll();
                return reservations.stream()
                                .filter(reservation -> reservation.getRoomnum() != null
                                                && reservation.getRoomnum().getHotelNum() != null
                                                && reservation.getRoomnum().getHotelNum().equals(hotelNum))
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }
}
