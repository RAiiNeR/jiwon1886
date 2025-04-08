package kr.co.noorigun.member;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.MemberVO;

@Mapper
public interface MemberDao {

    List<MemberVO> list();//전체 회원 목록
    void delete(int num);//회원 삭제
    int count();//회원 전체 수 
    Map<String,String> incrementChart(); // 회원 증가량 차트용

    // 이메일로 회원 조회
    // @Select("SELECT num,name,email,id FROM member WHERE num = #{userid}")
    // EmailVO findByEmail(String reuid);
}
