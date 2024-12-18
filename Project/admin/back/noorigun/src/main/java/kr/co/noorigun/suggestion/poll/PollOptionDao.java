package kr.co.noorigun.suggestion.poll;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.noorigun.vo.PollOptionVO;

@Mapper
public interface PollOptionDao {
    //투표 옵션 삭제
    int deletePollOptionByPollId(Long sbnum);

    // 특정 Poll ID로 투표 옵션 가져오기
    List<PollOptionVO> getPollOptionsByPollId(@Param("pollId") Long pollId);
}
