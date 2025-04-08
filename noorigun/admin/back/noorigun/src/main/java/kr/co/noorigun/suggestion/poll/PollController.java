package kr.co.noorigun.suggestion.poll;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.noorigun.vo.PollVO;

@RestController
@RequestMapping("/api/admin/polls")
public class PollController {

    @Autowired
    private PollService pollService;
    
    @GetMapping("/{sbnum}")
    public ResponseEntity<PollVO> getPollByPostId(@PathVariable Long sbnum) {
        PollVO poll = pollService.getPollByPostId(sbnum);
        if (poll == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(poll);
    }
}
