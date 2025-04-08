package kr.co.noorigun.program;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistryRepository extends JpaRepository<Registry, Long> {

  // 모든 등록을 내림차순으로 정렬하여 반환
  List<Registry> findAllByOrderByNumDesc();

  // membernum에 해당하는 등록 리스트 반환
  List<Registry> findByMembernum(Long membernum);

}
