package kr.co.noorigun.suggestion.poll;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.noorigun.suggestion.Suggestion;
import kr.co.noorigun.suggestion.SuggestionRepository;

@Service
@RequiredArgsConstructor
public class PollService {

    private final PollOptionRepository pollOptionRepository;
    private final PollRepository pollRepository;
    private final SuggestionRepository suggestionRepository;

    // 현재 참여자 수 계산
    @Transactional(readOnly = true)
    public Long getCurrentParticipants(Long pollId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new IllegalArgumentException("Poll not found with id: " + pollId));

        return poll.getOptions().stream()
                .mapToLong(PollOption::getVotes)
                .sum();
    }

    // 투표 생성
    @Transactional
    public Poll createPoll(Poll poll) {
        // CompleBoard와 Poll 연결
        Suggestion suggestion = suggestionRepository.findById(poll.getSuggestion().getNum())
                .orElseThrow(
                        () -> new IllegalArgumentException("게시글을 찾을 수 없습니다. id: " + poll.getSuggestion().getNum()));

        poll.setSuggestion(suggestion);

        // PollOption 저장
        poll.getOptions().forEach(option -> option.setPoll(poll));
        return pollRepository.save(poll);
    }

    // 모든 투표 가져오기
    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }

    // 특정 ID로 투표 가져오기
    public Poll getPollById(Long id) {
        return pollRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Poll not found with id: " + id));
    }

    // 게시글 ID로 투표 가져오기
    public Poll findPollByPostId(Long postId) {
        Suggestion suggestion = suggestionRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid postId: " + postId));
        return pollRepository.findBySuggestion(suggestion);
    }

    // 투표 가능 여부 확인
    @Transactional(readOnly = true)
    public void checkIfPollIsActive(Long pollId) {
        System.out.println("투표 ID: " + pollId); // 디버그 로그
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new IllegalArgumentException("해당 투표를 찾을 수 없습니다. ID: " + pollId));

        if (poll.getEnd_date() != null) {
            LocalDateTime endDateTime = poll.getEnd_date().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            System.out.println("투표 종료 시간: " + endDateTime); // 디버그 로그
            if (endDateTime.isBefore(LocalDateTime.now())) {
                throw new IllegalStateException("투표가 종료되었습니다.");
            }
        }

        if (poll.getMax_participants() != null) {
            Long currentParticipants = getCurrentParticipants(pollId);
            if (currentParticipants >= poll.getMax_participants()) {
                throw new IllegalStateException("최대 참여자 수를 초과했습니다.");
            }
        }
    }

    // 투표하기
    @Transactional
    public void vote(List<Long> optionIds) {
        // 디버그 로그 추가
        System.out.println("전송받은 옵션 ID: " + optionIds);

        // 옵션 ID로 Poll ID 가져오기
        Long pollId = pollOptionRepository.findById(optionIds.get(0))
                .orElseThrow(() -> new IllegalArgumentException("옵션 ID를 찾을 수 없습니다: " + optionIds.get(0)))
                .getPoll().getId();

        System.out.println("투표에 대한 Poll ID: " + pollId);

        // 투표 가능 여부 확인
        checkIfPollIsActive(pollId);

        // 투표 처리
        for (Long optionId : optionIds) {
            PollOption option = pollOptionRepository.findById(optionId)
                    .orElseThrow(() -> new IllegalArgumentException("옵션 ID를 찾을 수 없습니다: " + optionId));
            option.setVotes(option.getVotes() + 1); // 투표 수 증가
            pollOptionRepository.save(option); // 변경 사항 저장
        }
    }

    @Transactional
    public void delete(Long postId) {
        // CompleBoard를 먼저 찾습니다.
        Suggestion suggestion = suggestionRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글을 찾을 수 없습니다: " + postId));

        // CompleBoard와 연결된 Poll을 찾습니다.
        Poll poll = pollRepository.findBySuggestion(suggestion);
        if (poll == null) {
            throw new IllegalArgumentException("해당 게시글에 연결된 투표가 없습니다: " + postId);
        }

        // Poll 삭제
        pollRepository.delete(poll);
    }
}
