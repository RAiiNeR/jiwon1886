package kr.co.noorigun.notification;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.NotificationVO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/noti")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    //새로운 공지 추가
    @PostMapping
    public ResponseEntity<?> addNoti(NotificationVO vo) {
        System.out.println("GET 호출!!!");
        notificationService.addNoti(vo);
        return ResponseEntity.ok("생성 완료");
    }

    //공지 페이징 처리
    @GetMapping
    public Page<Map<String,Object>> getList(@RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return notificationService.getList(page, size);
    }

    //선택한 공지 디테일
    @GetMapping("/{num}")
    public Map<String,Object> getNotificationByNum(@PathVariable("num") int num) {
        return notificationService.getNotificationByNum(num);
    }

    //선택한 공지 삭제
    @DeleteMapping("/{num}")
    public ResponseEntity<?> deleteNotificationByNum(@PathVariable("num") int num) {
        notificationService.deleteNotificationByNum(num);
        return ResponseEntity.ok("삭제 완료");
    }

}
