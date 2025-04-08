package kr.co.noorigun.notification;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.NotificationVO;

@Mapper
public interface NotificationDao {
    void addNoti(NotificationVO vo);//공지 추가
    List<Map<String,Object>> getList(Map<String,Integer> map);//전체 목록조회
    Map<String,Object> getNotificationByNum(int num);//특정번호 목록조회
    void updateHitByNum(int num);//공지 조회수 증가
    void deleteNotificationByNum(int num);//공지 삭제
    int count();//공지 총 개수조회
}
