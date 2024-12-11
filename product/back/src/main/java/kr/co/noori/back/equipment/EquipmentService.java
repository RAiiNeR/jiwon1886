package kr.co.noori.back.equipment;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository; //장비

    @Autowired
    private MemberRepository memberRepository; //멤버

    @Autowired
    private RentRepository rentRepository; //렌트

    @Autowired
    private ReservationRepository reservationRepository; //예약

    @Autowired
    private EmailService emailService; //이메일발송

    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public List<Member> getAllMember() {
        return memberRepository.findAll();
    }

    public String rent(String id, String rname, int cnt) {
        Member member = memberRepository.findById(id)  // 회원 ID로 조회
            .orElseThrow(() -> new RuntimeException(id + "인 회원이 존재하지 않습니다."));
            
        Equipment equipment = equipmentRepository.findByRname(rname)  // 물품 이름으로 조회
            .orElseThrow(() -> new RuntimeException(rname + "인 물품이 존재하지 않습니다."));
    
        // 물품의 재고 확인
        if (equipment.getCnt() < cnt) {
            throw new RuntimeException("재고가 부족합니다. 현재 재고: " + equipment.getCnt() + ", 요청 수량: " + cnt);
        }
    
        // 재고 차감
        equipment.setCnt(equipment.getCnt() - cnt);
        equipmentRepository.save(equipment); //차감된 재고 저장(업데이트)

        Rent rent = new Rent();
        rent.setRentDate(new Date());
        rent.setMember(member);
        rent.setEquipment(equipment);
        rent.setCnt(cnt);
        rentRepository.save(rent);
        return "신청되었습니다.";
    }

    public String reserve(String id, String rname, int cnt) {
        Member member = memberRepository.findById(id)  // 회원 ID로 조회
            .orElseThrow(() -> new RuntimeException("회원 ID가 " + id + "인 회원이 존재하지 않습니다."));
            
        Equipment equipment = equipmentRepository.findByRname(rname)  // 물품 이름으로 조회
            .orElseThrow(() -> new RuntimeException("물품명이 " + rname + "인 물품이 존재하지 않습니다."));
        
        // 물품의 재고 확인
        if (equipment.getCnt() >= cnt) {
            // 대여가 가능하면 대여 로직 실행
            rent(id, rname, cnt);
            return "대여 신청되었습니다.";
        } else {
            // 재고가 부족하면 예약 진행
            Reservation reservation = new Reservation();
            reservation.setMember(member);
            reservation.setEquipment(equipment);
            reservation.setQuantity(cnt);
            reservation.setStatus(ReservationStatus.WAITING);
            reservation.setReservedTime(LocalDateTime.now()); // 예약 시간 기록
            reservationRepository.save(reservation);
            return "재고가 부족하여 예약되었습니다. 재고가 채워지면 안내해 드리겠습니다.";
        }
    }

    // 재고 업데이트 및 예약 대기자 알림 처리
    @Transactional
    public void update(String rname, int cnt) {
        // Step 1: 재고 업데이트
        equipmentRepository.updateStock(rname, cnt);

        // Step 2: 업데이트된 장비 조회
        Equipment updatedEquipment = equipmentRepository.findByRname(rname)
                .orElseThrow(() -> new RuntimeException("해당 물품이 존재하지 않습니다."));

        // Step 3: 재고가 1 이상인 경우 대기자에게 이메일 발송
        if (updatedEquipment.getCnt() > 0) {
            reservation(updatedEquipment);  // 대기자에게 이메일 발송
        }
    }

    private void reservation(Equipment equipment) {
        List<Reservation> waitingReservations = reservationRepository
                .findByEquipmentAndStatusOrderByReservedTimeAsc(equipment, ReservationStatus.WAITING);
    
        if (!waitingReservations.isEmpty()) {
            Reservation reservation = waitingReservations.get(0); // 첫 번째 대기자
            Member member = reservation.getMember();
    
            try {
                emailService.sendOrderAvailableEmail(member, equipment); // 이메일 발송
                reservation.setStatus(ReservationStatus.NOTIFIED); // 상태 변경
                reservationRepository.save(reservation);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    //--------------------------2024.12.09 페이징처리
    public Page<Equipment> getPagination(String rname, int page, int size) {
        int startRow = (page -1) * size + 1;
        int endRow = startRow + size -1;
        System.out.println("시작과 끝 ==========> " + startRow + "/" +endRow);
        List<Equipment> entity = equipmentRepository.findWithPaging(rname, startRow, endRow);
        System.out.println("리스트 사이즈 : " + entity.size());
        int totalElements = equipmentRepository.countByRnameContaining(rname);

        // PageImpl을 사용하여 Page 객체로 반환
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }
}