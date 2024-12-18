package kr.co.noorigun.suggestion.poll;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import kr.co.noorigun.suggestion.Suggestion;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/api/polls")
@RestController
public class PollController {
    private final PollService pollService;
    private final PollRepository pollRepository;
    // "/noorigun/uploads"
    private final String UPLOAD_DIR = "/noorigun/uploads";

    // 이미지 업로드 처리
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam MultipartFile file) {
        try {
            // 파일 저장 디렉토리 생성
            if (!Files.exists(Paths.get(UPLOAD_DIR))) {
                Files.createDirectories(Paths.get(UPLOAD_DIR).toAbsolutePath().normalize());
            }

            // 원본 파일 이름으로 저장
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null || originalFileName.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 이름이 유효하지 않습니다.");
            }

            Path filePath = Paths.get(UPLOAD_DIR, originalFileName);

            // 만약 같은 이름의 파일이 이미 존재한다면 덮어씁니다.
            Files.write(filePath, file.getBytes());

            // 업로드된 파일의 URL 반환
            String fileUrl = originalFileName;
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 투표 생성
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PollDTO createPoll(@RequestBody PollDTO pollDTO) {
        // 필수 데이터 검증 (이미지 URL은 필수에서 제외)
        if (pollDTO.getSbnum() == null || pollDTO.getOptions() == null || pollDTO.getOptions().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "필수 데이터가 누락되었습니다.");
        }

        // Poll 엔티티 생성 및 데이터 매핑
        Poll poll = new Poll();
        poll.setTitle(pollDTO.getTitle());
        poll.setAllow_multiple(pollDTO.isAllow_multiple());
        poll.setAnonymous(pollDTO.isAnonymous());
        poll.setEnd_date(pollDTO.getEnd_date());
        poll.setMax_participants(pollDTO.getMax_participants());
        System.out.println("시간" + pollDTO.getEnd_date());
        Suggestion suggestion = new Suggestion();
        suggestion.setNum(pollDTO.getSbnum());
        poll.setSuggestion(suggestion);

        // PollOption 엔티티 생성
        List<PollOption> pollOptions = pollDTO.getOptions().stream()
                .map(optionDTO -> {
                    PollOption option = new PollOption();
                    option.setText(optionDTO.getText());
                    // 이미지 URL이 null일 경우에도 처리 가능
                    option.setImage_url(optionDTO.getImage_url());
                    return option;
                }).collect(Collectors.toList());

        poll.setOptions(pollOptions);

        // Poll 생성 서비스 호출
        Poll createdPoll = pollService.createPoll(poll);

        // 생성된 Poll을 PollDTO로 변환하여 반환
        return PollMapper.toPollDTO(createdPoll);
    }

    // 모든 투표 가져오기
    @GetMapping
    public List<Poll> getAllPolls() {
        return pollService.getAllPolls();
    }

    // 특정 ID로 투표 가져오기
    @GetMapping("/{id}")
    public Poll getPollById(@PathVariable Long id) {
        return pollService.getPollById(id);
    }

    // 게시글 ID로 투표 가져오기
    @GetMapping("/byPost/{postId}")
    public PollDTO getPollByPost(@PathVariable Long postId) {
        Poll poll = pollService.findPollByPostId(postId);
        return PollMapper.toPollDTO(poll); // Poll을 PollDTO로 변환
    }

    @GetMapping("/{pollId}/status")
    public ResponseEntity<Map<String, String>> checkPollStatus(@PathVariable Long pollId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new IllegalArgumentException("해당 투표를 찾을 수 없습니다."));

        Map<String, String> response = new HashMap<>();
        if (poll.getEnd_date() != null && poll.getEnd_date().before(new Date())) {
            response.put("status", "expired");
            response.put("message", "투표가 종료되었습니다.");
        } else if (poll.getMax_participants() != null) {
            Long currentParticipants = poll.getOptions().stream()
                    .mapToLong(PollOption::getVotes)
                    .sum();
            if (currentParticipants >= poll.getMax_participants()) {
                response.put("status", "full");
                response.put("message", "최대 참여자 수에 도달했습니다.");
            }
        } else {
            response.put("status", "active");
            response.put("message", "투표가 진행 중입니다.");
        }

        return ResponseEntity.ok(response);
    }

    // 투표하기
    @PostMapping("/vote")
    public void vote(@RequestBody Map<String, List<Long>> request) {
        // 요청 데이터가 null인지 확인
        if (request == null || !request.containsKey("optionIds")) {
            throw new IllegalArgumentException("옵션 ID가 누락되었습니다.");
        }

        List<Long> optionIds = request.get("optionIds");

        if (optionIds == null || optionIds.isEmpty()) {
            throw new IllegalArgumentException("옵션 ID가 누락되었습니다.");
        }

        pollService.vote(optionIds); // 여러 옵션에 투표 가능
    }

    @DeleteMapping("/byPost/{postId}")
    public ResponseEntity<?> deletePoll(@PathVariable Long postId) {
        pollService.delete(postId);
        return ResponseEntity.ok().body(postId + "번째 투표 삭제");
    }

}
