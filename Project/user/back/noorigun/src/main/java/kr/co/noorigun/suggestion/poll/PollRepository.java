package kr.co.noorigun.suggestion.poll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.co.noorigun.suggestion.Suggestion;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    // 게시글 번호를 기반으로 투표 검색
    //Optional<Poll> findByCompleBoardNum(Long compleBoardNum);
    //Poll findByPostId(Long postId);
    // 기존 방식 유지 (객체를 직접 검색)
    Poll findBySuggestion(Suggestion suggestion);
    //Poll findByCompleBoardId(Long postId);
    //Optional<Poll> findByCompleBoard(CompleBoard compleBoard);
}