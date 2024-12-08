package kr.co.noori.back.equipment;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RentRepository rentRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EmailService emailService;


    //-----------------------------------------------------------------------

    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public List<Member> getAllMember() {
        return memberRepository.findAll();
    }

    public String rentEquipment(String id, String rname, int cnt) {
        Member member = memberRepository.findById(id)  // 회원 ID로 조회
            .orElseThrow(() -> new RuntimeException("회원 ID가 " + id + "인 회원이 존재하지 않습니다."));
            
        Equipment equipment = equipmentRepository.findByRname(rname)  // 물품 이름으로 조회
            .orElseThrow(() -> new RuntimeException("물품명이 " + rname + "인 물품이 존재하지 않습니다."));
    
        // 물품의 재고 확인
        if (equipment.getCnt() < cnt) {
            throw new RuntimeException("재고가 부족합니다. 현재 재고: " + equipment.getCnt() + ", 요청 수량: " + cnt);
        }
    
        // 재고 차감
        equipment.setCnt(equipment.getCnt() - cnt);
        equipmentRepository.save(equipment);
    
        Rent rent = new Rent();
        rent.setRentDate(new Date());
        rent.setMember(member);
        rent.setEquipment(equipment);
        rent.setCnt(cnt);
        rentRepository.save(rent);
        return "신청되었습니다.";
    }

    // EquipmentService.java

    // public List<Reservation> getAllReservations() {
    //     return reservationRepository.findAll();
    // }

    public String reserveEquipment(String id, String rname, int cnt) {
        Member member = memberRepository.findById(id)  // 회원 ID로 조회
            .orElseThrow(() -> new RuntimeException("회원 ID가 " + id + "인 회원이 존재하지 않습니다."));
            
        Equipment equipment = equipmentRepository.findByRname(rname)  // 물품 이름으로 조회
            .orElseThrow(() -> new RuntimeException("물품명이 " + rname + "인 물품이 존재하지 않습니다."));
        
        // 물품의 재고 확인
        if (equipment.getCnt() >= cnt) {
            // 대여가 가능하면 대여 로직 실행
            rentEquipment(id, rname, cnt);
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

    // public void reservation(Equipment equipment) {
    //     List<Reservation> waitingReservations = reservationRepository.findByEquipmentAndStatusOrderByReservedTimeAsc(equipment, ReservationStatus.WAITING);
    
    //     System.out.println("대기 중인 예약 수: " + waitingReservations.size());

    //     if (!waitingReservations.isEmpty()) {
    //         Reservation reservation = waitingReservations.get(0); // 선착순 1번 예약자
    //         Member member = reservation.getMember();
    //         try {
    //             System.out.println("이메일 발송 시도 - 회원: " + member.getEmail());
    //             emailService.sendOrderAvailableEmail(member, equipment); // 이메일 발송
    //             System.out.println("이메일 발송 성공");

    //             reservation.setStatus(ReservationStatus.NOTIFIED); // 알림 발송 후 상태 변경
    //             reservationRepository.save(reservation);
    //             System.out.println("예약 상태 업데이트 완료");
    //         } catch (MessagingException e) {
    //             System.err.println("이메일 발송 실패: " + e.getMessage());
    //             e.printStackTrace();
    //         }
    //     }
    // }

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
    


    //----------------------------------------------------------------
    // 재고 업데이트 및 예약 대기자 알림 처리
    // @Transactional
    // public void update(Long equipmentId, int addedStock) {
    //     System.out.println("재고 업데이트 시작 - equipmentId: " + equipmentId + ", addedStock: " + addedStock);

    //     Equipment equipment = equipmentRepository.findById(equipmentId)
    //         .orElseThrow(() -> new RuntimeException("해당 물품이 존재하지 않습니다."));

    //         System.out.println("현재 재고: " + equipment.getCnt());
        
    //     // 재고 추가
    //     equipment.setCnt(equipment.getCnt() + addedStock);
    //     equipmentRepository.save(equipment);

    //     System.out.println("재고 업데이트 완료 - 새로운 재고: " + equipment.getCnt());
        
    //     // 재고가 채워졌을 때 대기자에게 알림
    //     System.out.println("대기자 알림 프로세스 시작");
    //     reservation(equipment);
    //     System.out.println("대기자 알림 프로세스 완료");
    // }

    // @Transactional
    // public void update(Long equipmentId, int addedStock) {
    //     // Step 1: 재고 업데이트
    //     equipmentRepository.updateStock(equipmentId, addedStock);

    //     // Step 2: 업데이트된 장비를 조회
    //     Equipment updatedEquipment = equipmentRepository.findById(equipmentId)
    //         .orElseThrow(() -> new RuntimeException("장비 ID " + equipmentId + "가 존재하지 않습니다."));

    //     // Step 3: 예약 대기자 처리
    //     reservation(updatedEquipment);
    // }


}