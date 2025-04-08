package kr.co.noorigun.suggestion.poll;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PollOptionRepository extends JpaRepository<PollOption,Long>{
    
}
