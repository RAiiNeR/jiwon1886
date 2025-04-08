package kr.co.noorigun.suggestion.poll;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.PollStatisticsVO;


@Mapper
public interface PollStatisticsDao {

    //기본 투표 통계
    List<PollStatisticsVO> getPollStatistics();

    //투표율
    List<PollStatisticsVO> getPollParticipationRate();

    //종료된 투표 통계
    List<PollStatisticsVO> getEndedPolls();

    //특정 기간 내 투표 통계
    List<PollStatisticsVO> getPollRange();

    //최다 득표 옵션
    List<PollStatisticsVO> getTopVotedOptions();

    //총 득표 수
    List<PollStatisticsVO> getTotalVotes();

    //활성 옵션 수
    List<PollStatisticsVO> getActiveOptionCount();

    //최근2주간 핫한 투표
    List<PollStatisticsVO> getRecentHotPollsTwoWeeks();

    //오래된 투표
    List<PollStatisticsVO>getOldestPolls();

}
