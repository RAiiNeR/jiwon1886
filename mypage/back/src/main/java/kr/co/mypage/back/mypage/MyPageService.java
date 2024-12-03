package kr.co.mypage.back.mypage;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.mypage.back.compleboard.CompleBoard;

@Service
public class MyPageService {
    @Autowired
    private MyPageRepository myPageRepository;

    public List<MyPage> getAll() {
        return myPageRepository.findAll(); // 모든 사용자 데이터를 조회
    }

    public MyPage getList(String id) {
        return myPageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다.")); // id에 해당하는 사용자 찾기
    }
    
    //name뺐었음
    public MyPage update(String id, String phone, String email, String addr) {
        // MyPage myPage = myPageRepository.findById(id) // Optional로 처리
        //     .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Optional<MyPage> myPageOptional = myPageRepository.findById(id);  // Optional로 변경
        if (!myPageOptional.isPresent()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

    MyPage myPage = myPageOptional.get();  // Optional에서 객체 꺼내기
        // myPage.setName(name);
        myPage.setPhone(phone);
        myPage.setEmail(email);
        myPage.setAddr(addr);
        return myPageRepository.save(myPage); // 수정된 사용자 저장
    }
    
    //게시글 수
    public List<CompleBoard> findCountList() {
        List<CompleBoard> count = myPageRepository.findCountList();
        return count;
    }
}