package kr.co.noorigun.notification;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.NotificationVO;

@Service
public class NotificationService {
    @Autowired
    private NotificationDao notificationDao;

    //공지 추가
    public void addNoti(NotificationVO vo){
        notificationDao.addNoti(vo);
    }

    //공지사항 페이징처리
    public Page<Map<String,Object>> getList(int page, int size){
        int startRow = (page - 1) * size + 1;
        int endRow = page * size;
        Map<String,Integer> map = new HashMap<>();
        map.put("startRow", startRow);
        map.put("endRow", endRow);
        List<Map<String,Object>> list = notificationDao.getList(map);
        int totalElements = notificationDao.count();
        return new PageImpl<>(list,PageRequest.of(page - 1, size), totalElements);
    }

    //해당하는 번호의 공지 가져오기
    public Map<String,Object> getNotificationByNum(int num){
        updateHitByNum(num);
        return notificationDao.getNotificationByNum(num);
    }

    //조회수 증가
    public void updateHitByNum(int num){
        notificationDao.updateHitByNum(num);
    }

    //선택한 공지 삭제
    public void deleteNotificationByNum(int num){
        notificationDao.deleteNotificationByNum(num);
    }
}
