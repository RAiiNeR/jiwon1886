package kr.co.ictstudy.back.memo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoRepository extends JpaRepository<Memo, Long>{

    //최신순으로 정렬된 Memo목록을 반환해주는 메서드
    List<Memo> findAllByOrderByIdDesc();
    
}
