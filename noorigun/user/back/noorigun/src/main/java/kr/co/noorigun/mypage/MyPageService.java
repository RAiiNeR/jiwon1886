package kr.co.noorigun.mypage;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.noorigun.member.Member;


@Service
public class MyPageService {
    @Autowired
    private MyPageRepository myPageRepository;

    public List<Member> getAll() {
        return myPageRepository.findAll(); // 모든 사용자 데이터를 조회
    }

    public Member getList(String id) {
        return myPageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다.")); // id에 해당하는 사용자 찾기
    }
    
    //name뺐었음
    public Member update(String id, String phone, String email, String addr) {
        // MyPage myPage = myPageRepository.findById(id) // Optional로 처리
        //     .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Optional<Member> myPageOptional = myPageRepository.findById(id);  // Optional로 변경
        if (!myPageOptional.isPresent()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        Member myPage = myPageOptional.get();  // Optional에서 객체 꺼내기
            // myPage.setName(name);
            myPage.setPhone(phone);
            myPage.setEmail(email);
            myPage.setAddr(addr);
            return myPageRepository.save(myPage); // 수정된 사용자 저장
    }
    
    //게시글 수 ===> 데이터 가져오는 쿼리문에 포함
    // public Long findCountList() {
    //     return myPageRepository.findCountList();
    // }

    //사용자의 각 민원 게시글 수
    public Map<String, String> myComple(String id){
        Map<String, String> state = myPageRepository.findByIdCountingState(id);
        return state;
    }

    //사용자의 제안 게시글 수
    public Map<String, String> mySuggestion(String id){
        Map<String, String> suggestion = myPageRepository.findByIdCountingSuggestion(id);
        return suggestion;
    }

    // 사용자가 지원한 프로그램 확인->2024-12-11
    public List<Map<String, String>> programList(Long num) {
        List<Map<String, String>> program = myPageRepository.findByIdCountingProgram(num);
        return program;
    }
}