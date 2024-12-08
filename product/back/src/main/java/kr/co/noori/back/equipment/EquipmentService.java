package kr.co.noori.back.equipment;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RentRepository rentRepository;

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
}