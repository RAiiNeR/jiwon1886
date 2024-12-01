package kr.co.mypage.back.mypage;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MyPageService {
    @Autowired
    private MyPageRepository myPageRepository;

    public List<MyPage> getList(String id) {
        return myPageRepository.findAll();
    }

    public List<MyPage> updatePage() {
        return null;
    }
}
