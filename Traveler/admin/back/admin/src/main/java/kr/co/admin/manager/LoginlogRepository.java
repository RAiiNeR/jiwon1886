package kr.co.admin.manager;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface LoginlogRepository extends JpaRepository<Loginlog, Long>{
    Loginlog findByManager(Manager manager);
    
    @Query("SELECT COUNT(l) FROM Loginlog l WHERE l.manager = :manager AND l.abnormal = 0")
    int countNormal(@Param("manager") Manager manager);

    @Query("SELECT COUNT(l) FROM Loginlog l WHERE l.manager = :manager AND l.abnormal = 1")
    int countAbnormal(@Param("manager") Manager manager);

    @Query("SELECT COUNT(l) FROM Loginlog l WHERE l.manager = :manager AND l.abnormal = 2")
    int countHotkey(@Param("manager") Manager manager);
}
