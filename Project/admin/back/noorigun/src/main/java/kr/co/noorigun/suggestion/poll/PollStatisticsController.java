package kr.co.noorigun.suggestion.poll;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.PollStatisticsVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class PollStatisticsController {

    private final PollStatisticsService pollStatisticsService;

    //기본 투표 통계
    @GetMapping("/statistics")
    public List<PollStatisticsVO> getPollStatistics() {
        return pollStatisticsService.getPollStatistics();
    }

    //투표 상태별 통계
    // 투표율 통계 API 추가
@GetMapping("/statistics/participation-rate")
public List<PollStatisticsVO> getPollParticipationRate() {
    return pollStatisticsService.getPollParticipationRate();
}
    //종료된 투표 통계
    @GetMapping("/statistics/ended")
    public List<PollStatisticsVO> getEndedPolls() {
        return pollStatisticsService.getEndedPolls();
    }

    //특정 기간 내 투표 통계
    @GetMapping("/statistics/range")
    public List<PollStatisticsVO> getPollRange() {
        return pollStatisticsService.getPollRange();
    }

    //최다 득표 옵션
    @GetMapping("/statistics/top-options")
    public List<PollStatisticsVO> getTopVotedOptions() {
        return pollStatisticsService.getTopVotedOptions();
    }

    //총 득표 수
    @GetMapping("/statistics/total-votes")
    public List<PollStatisticsVO> getTotalVotes() {
        return pollStatisticsService.getTotalVotes();
    }

    //활성 옵션 수
    @GetMapping("/statistics/active-options")
    public List<PollStatisticsVO> getActiveOptionCount() {
        return pollStatisticsService.getActiveOptionCount();
    }

    //최근 2주간 핫한 투표
    @GetMapping("/statistics/recent-hot-2weeks")
public ResponseEntity<List<PollStatisticsVO>> getRecentHotPollsTwoWeeks() {
    List<PollStatisticsVO> polls = pollStatisticsService.getRecentHotPollsTwoWeeks();
    return ResponseEntity.ok(polls);
}

//활성 옵션 수
@GetMapping("/statistics/oldest-polls")
public List<PollStatisticsVO> getOldestPolls() {
    return pollStatisticsService.getOldestPolls();
}

}
