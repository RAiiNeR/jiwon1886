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
    private ReserveRepository reserveRepository;

    @Autowired
    private EmailService emailService; //이메일발송

    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public List<Member> getAllMember() {
        return memberRepository.findAll();
    }

    public String rent(String id, String rname, int cnt) {
        Member m = memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(id + "인 회원이 존재하지 않습니다."));
        Equipment e = equipmentRepository.findByRname(rname)
            .orElseThrow(() -> new RuntimeException(rname + "인 물품이 존재하지 않습니다."));
        //물품의 재고 확인
        if (e.getCnt() < cnt) {
            throw new RuntimeException("재고가 부족합니다. 현재 재고 : " + e.getCnt());
            
        }
        //재고 차감
        equipmentRepository.down(rname, cnt);
        equipmentRepository.save(e);

        Rental r = new Rental();
        r.setRdate(new Date());
        r.setMember(m);
        r.setEquipment(e);
        r.setRcnt(cnt);
        rentalRepository.save(r);
        return "신청되었습니다.";
    }

    public String reserve(String id, String rname, String remail, int cnt) {
        Member m = memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("회원 아이디 틀림 : " + id));
        Equipment e = equipmentRepository.findByRname(rname)
            .orElseThrow(() -> new RuntimeException("물품틀림 : " + rname));
        // 항상 예약 처리
        Reserve reserveForm = new Reserve();
        reserveForm.setMember(m);
        reserveForm.setEquipment(e);
        reserveForm.setRecnt(cnt);
        reserveForm.setRemail(remail);  // 회원 이메일
        reserveForm.setRname(m);    // 예약한 물품 이름
        reserveForm.setStatus(ReservationStatus.WAITING);
        reserveRepository.save(reserveForm);
        
        return "예약완료";
    }

    // 대기자 알림
    @Transactional
    public void update(String rname, int cnt) {
        equipmentRepository.update(rname, cnt);
        Equipment updateE = equipmentRepository.findByRname(rname)
            .orElseThrow(() -> new RuntimeException("해당물품 없음"));
        if (updateE.getCnt() > 0) {
            alarm(updateE);
        }
    }

    private void alarm(Equipment equipment) {
        List<Reserve> wait = reserveRepository
            .findByEquipmentAndStatus(equipment, ReservationStatus.WAITING);
        if (!wait.isEmpty()) {
            Reserve reserve = wait.get(0);
            Member member = reserve.getMember();
            try {
                emailService.sendOrderAvailableEmail(member, equipment);
                reserve.setStatus(ReservationStatus.NOTIFIED);
                reserveRepository.save(reserve);
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