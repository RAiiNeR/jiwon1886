package kr.co.noorigun.equipmentadmin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import kr.co.noorigun.equipmentadmin.dao.EquipmentDao;
import kr.co.noorigun.equipmentadmin.dao.RentDao;
import kr.co.noorigun.equipmentadmin.dao.ReserveDao;
import kr.co.noorigun.vo.EquipmentImgVO;
import kr.co.noorigun.vo.RentVO;
import kr.co.noorigun.vo.EquipmentVO;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentDao equipmentDao;

    @Autowired
    private RentDao rentDao;

    @Autowired
    private ReserveDao reserveDao;

    // 비품 수량 감소 (대여,예약 되었을때 비품이 감소하고 남은 수량을 업데이트)
    public void decreaseQuantity(Long itemid, int cnt) {
        EquipmentVO equipment = rentDao.getEquipmentById(itemid);
        if (equipment == null) {
            throw new RuntimeException("비품을 찾을 수 없습니다.");
        }

        int currentCnt = equipment.getCnt();
        if (currentCnt - cnt < 0) {
            throw new RuntimeException("수량이 부족합니다. 현재 수량: " + currentCnt);
        }

        equipment.setCnt(currentCnt - cnt);

        if (equipment.getCnt() == 0) {
            equipment.setState("대여 불가");
        }

        equipmentDao.update(equipment);
    }

    public void add(EquipmentVO vo, List<EquipmentImgVO> eimgvo) {
        equipmentDao.add(vo); // 게시글 추가
        equipmentDao.addImg(eimgvo); // 이미지 추가
    }

    // 비품 목록 조회
    public List<EquipmentVO> list() {
        return equipmentDao.list();
    }

    // 예약 목록 조회
    public List<Map<String, Object>> reservelist() {
        return reserveDao.reservelist();
    }

    // 대여 내역 조회
    public List<Map<String, Object>> getAllRentals() {
        return rentDao.getAllRentals();
    }

    // 비품 상세 조회
    public EquipmentVO detail(int num) {
        List<Map<String, Object>> maps = equipmentDao.detail(num);
        EquipmentVO vo = null;
        for (Map<String, Object> map : maps) {
            if (vo == null) {
                vo = new EquipmentVO();
                vo.setNum(Integer.parseInt(String.valueOf(map.get("NUM"))));
                vo.setRname((String) map.get("RNAME"));
                vo.setState((String) map.get("STATE"));
                vo.setCnt(Integer.parseInt(String.valueOf(map.get("CNT"))));
                vo.setEdate(String.valueOf(map.get("EDATE")));
                vo.setRcnt(Integer.parseInt(String.valueOf(map.get("RCNT")))); // 예약된 수량 설정
                vo.setImgNames(new ArrayList<>());
            }
            vo.getImgNames().add((String) map.get("IMGNAME"));
        }
        return vo;
    }

    // 비품 삭제
    public void delete(int num) {
        equipmentDao.delete(num);
    }

    // 비품 이미지 삭제
    public void deleteChild(int num) {
        equipmentDao.deleteChild(num);
    }

    // 비품 정보 수정
    public void update(EquipmentVO vo, List<EquipmentImgVO> eimgList) {
        equipmentDao.update(vo);

        if (eimgList != null && !eimgList.isEmpty()) {
            for (EquipmentImgVO eimgvo : eimgList) {
                equipmentDao.updateImage(eimgvo);
            }
        }
    }

    // 대여 수량 증가 (대여가 이루어질 때마다 대여 수량 증가)
    public void incrementRentedCount(Long itemid) {
        equipmentDao.incrementRentedCount(itemid);
    }

    // 비품 대여 가능 여부 확인
    public boolean isItemAvailable(Long itemid) {
        EquipmentVO equipment = rentDao.getEquipmentById(itemid); // 해당 itemid에 해당하는 비품을 DB에서 조회
        if (equipment == null) {
            return false;
        }
        return equipment.getCnt() > equipment.getRcnt();
    }

    // 비품 대여 처리
    public boolean rentItem(String userid, Long itemid) {
        if (!isItemAvailable(itemid)) {
            return false;
        }
        equipmentDao.incrementRentedCount(itemid);

        RentVO rental = new RentVO(userid, itemid);
        equipmentDao.insertRental(rental);

        return true;
    }

}
