package kr.co.mypage.back.mypage;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage")
public class MyPageController {
    @Autowired
    private MyPageService myPageService;

    @GetMapping
    public List<MyPage> getAll() {
        return myPageService.getAll(); // 전체 사용자 데이터를 반환
    }

    @GetMapping("/detail")
    public ResponseEntity<MyPage> getList(@RequestParam("id") String id) {
        try {
            MyPage myPage = myPageService.getList(id); // MyPage 객체 반환
            return ResponseEntity.ok(myPage); // 200 OK 반환
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // 사용자 없으면 404 반환
        }
    }

    @PostMapping("/update")
public MyPageVO update(@RequestParam("id") String id, @RequestBody MyPageVO myPageVO) {
    // MyPageVO에서 받아온 나머지 정보를 사용하여 업데이트
    myPageService.update(
        id,  // URL에서 받은 id
        myPageVO.getName(),
        myPageVO.getPhone(),
        myPageVO.getEmail(),
        myPageVO.getAddr()
    );
    return myPageVO;  // 그대로 반환
}

}

