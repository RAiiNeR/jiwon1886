package kr.co.noorigun.program;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.noorigun.vo.MemberVO;
import kr.co.noorigun.vo.ProgramVO;

@Mapper
public interface ProgramDao {
    void add(ProgramVO vo);
    List<ProgramVO> list();
    ProgramVO detail(int num);
    void delete(int num);
    void update(ProgramVO vo);
    List<MemberVO> memberlist(int num);
}