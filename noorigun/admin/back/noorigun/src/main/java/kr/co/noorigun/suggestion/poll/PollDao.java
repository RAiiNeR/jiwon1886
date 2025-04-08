package kr.co.noorigun.suggestion.poll;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.noorigun.vo.PollVO;

@Mapper
public interface PollDao {
    
    // 투표 삭제
    int deletePollByBoardNum(Long sbnum);

  
    // 특정 게시글 번호로 투표 데이터 가져오기
    PollVO getPollByPostId(@Param("sbnum") Long sbnum);




}
