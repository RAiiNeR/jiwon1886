package kr.co.noorigun.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.noorigun.vo.MemberVO;

@Service
public class MemberService {
    @Autowired
    private MemberDao memberDao;

    //회원 전체 목록보기
    public List<MemberVO> list() {
        return memberDao.list();
    }

    //선택한 회원 삭제
    public void delete(int num) {
        memberDao.delete(num);
    }

    //전체 회원 수
    public int count(){
        return memberDao.count();
    }

    // 회원 증가량 차트용
    public Map<String,String> incrementChart(){
        Map<String,String> map = memberDao.incrementChart();
        Map<String,String> m = new HashMap<>();
        for (Map.Entry<String,String> e : map.entrySet()) {
            m.put(e.getKey(), String.valueOf(e.getValue()));
        }
        return m;
    } 
}
