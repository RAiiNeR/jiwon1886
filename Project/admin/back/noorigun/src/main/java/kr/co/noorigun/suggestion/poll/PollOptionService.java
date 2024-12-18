package kr.co.noorigun.suggestion.poll;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.noorigun.vo.PollOptionVO;

@Service
public class PollOptionService {

    @Autowired
    private PollOptionDao pollOptionDao;

    //투표 옵션 삭제
    public void deletePollOptions(Long sbnum) {
        pollOptionDao.deletePollOptionByPollId(sbnum);
    }

    // 특정 Poll ID로 투표 옵션 가져오기
    public List<PollOptionVO> getPollOptionsByPollId(Long pollId) {
        return pollOptionDao.getPollOptionsByPollId(pollId);
    }
}
