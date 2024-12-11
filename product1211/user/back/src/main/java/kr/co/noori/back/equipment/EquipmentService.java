package kr.co.noori.back.equipment;

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
    private RentalRepository rentalRepository;

    @Autowired
    private EmailService emailService; //이메일발송

    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public List<Member> getAllMember() {
        return memberRepository.findAll();
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
            // 대기자에게 이메일 발송
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


    // 대여 신청
    @Transactional
    public String rent(String memberId, String rname, int quantity) {
        // 1. 대여할 물품 찾기
        Equipment equipment = equipmentRepository.findByRname(rname)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        // 2. 대여 가능한 수량 확인
        if (equipment.getCnt() < quantity) {
            return "Not enough stock available!";
        }

        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found"));
        // 3. 대여 기록 추가
        rentalRepository.insert(quantity, "대여중", equipment.getNum(), member.getNum());

        // 4. 물품 수량 감소
        equipment.setCnt(equipment.getCnt() - quantity);
        equipmentRepository.save(equipment);

        return "Rental request successful!";
    }

    // 재고 업데이트 및 대기자 알림
    @Transactional
    public void updateStock(String rname, int cnt) {
        Equipment equipment = equipmentRepository.findByRname(rname)
                .orElseThrow(() -> new RuntimeException("해당 물품이 존재하지 않습니다."));
        equipment.setCnt(equipment.getCnt() + cnt);

        // 재고 상태 업데이트
        if (equipment.getCnt() > 0) {
            equipment.setState("대여가능");
        }

        equipmentRepository.save(equipment);
    }


    // 대기자에게 알림 전송
    private void sendReservationAlert(String rname) {
        // 대기자 리스트에서 가장 먼저 대기 중인 사용자에게 이메일 발송
        List<Rental> waitingList = rentalRepository.findTopByEquipmentRnameAndStatusOrderByReservedTimeDesc(rname, "대기중");

        if (!waitingList.isEmpty()) {
            Rental firstInLine = waitingList.get(0);
            Member member = firstInLine.getMember();
            emailService.sendEmail(member.getEmail(), "대여 가능 안내", "요청하신 " + rname + "이(가) 대여 가능해졌습니다.");
        }
    }
}