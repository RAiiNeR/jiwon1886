package kr.co.noorigun.suggestion.poll;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.noorigun.vo.PollOptionVO;
import kr.co.noorigun.vo.PollVO;

@Service
public class PollService {
    
    @Autowired
    private PollDao pollDao;

    @Autowired
    private PollOptionService pollOptionService;

    public void deletePollsAndOptions(Long sbnum) {
        try {
            //PollOption 삭제
            System.out.println("PollOption 삭제 시작");
            pollOptionService.deletePollOptions(sbnum);
            System.out.println("PollOption 삭제 완료");

            //Poll 삭제
            System.out.println("Poll 삭제 시작");
            pollDao.deletePollByBoardNum(sbnum);
            System.out.println("Poll 삭제 완료");
        } catch (Exception e) {
            System.err.println("POLL 삭제 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

     // 특정 게시글 번호로 투표 데이터 가져오기
    public PollVO getPollByPostId(Long sbnum) {
        PollVO poll = pollDao.getPollByPostId(sbnum);
        if (poll != null) {
            List<PollOptionVO> options = pollOptionService.getPollOptionsByPollId(poll.getId());
            poll.setOptions(options);
        }
        return poll;
    }

   
}