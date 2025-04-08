package kr.co.admin.manager;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Long> {
    @Query("SELECT m.loginlog FROM Manager m WHERE m.sabun = :sabun ORDER BY m.num DESC")
    Page<Loginlog> getLoginLog(@Param("sabun") String sabun, Pageable pageable);

    @Query("SELECT m.email FROM Manager m WHERE m.sabun = :sabun")
    String getEmail(@Param("sabun") String sabun);

    Optional<Manager> findBySabun(String sabun);

    @Query("SELECT COUNT(m) FROM Manager m")
    Long countAllManagers();

    // 2025-03-03전준영 추가
    // 특정 직원 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM Manager m WHERE m.sabun =: sabun")
    void dedeleteBySabun(@Param("sabun") String sabun);

    // 전체직원 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM Manager m")
    void deleteAllManager();
}
