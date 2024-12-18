package kr.co.noorigun.suggestion.poll;

import java.util.List;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.PollStatisticsVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PollStatisticsService {

    private final PollStatisticsDao pollStatisticsDao;

    //기본 투표 통계
    public List<PollStatisticsVO> getPollStatistics() {
        return pollStatisticsDao.getPollStatistics();
    }
  

    // 투표율 통계 메서드 추가
public List<PollStatisticsVO> getPollParticipationRate() {
    return pollStatisticsDao.getPollParticipationRate();
}


    //종료된 투표 통계
    public List<PollStatisticsVO> getEndedPolls() {
        return pollStatisticsDao.getEndedPolls();
    }

    //특정 기간 내 투표 통계
    public List<PollStatisticsVO> getPollRange() {
        return pollStatisticsDao.getPollRange();
    }

    //최다 득표 옵션
    public List<PollStatisticsVO> getTopVotedOptions() {
        return pollStatisticsDao.getTopVotedOptions();
    }

    //총 득표 수
    public List<PollStatisticsVO> getTotalVotes() {
        return pollStatisticsDao.getTotalVotes();
    }

    //활성 옵션 수
    public List<PollStatisticsVO> getActiveOptionCount() {
        return pollStatisticsDao.getActiveOptionCount();
    }

    //최근 2주간 핫한 투표
    public List<PollStatisticsVO> getRecentHotPollsTwoWeeks() {
        return pollStatisticsDao.getRecentHotPollsTwoWeeks();
    }

    //오래된 투표
    public List<PollStatisticsVO> getOldestPolls() {
        return pollStatisticsDao.getOldestPolls();
    }
}
