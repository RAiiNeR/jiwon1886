package kr.co.noori.back.compleboard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompleBoardService {
    @Autowired
    private CompleBoardRepository compleBoardRepository;

    public List<CompleBoard> findAllByOrderByNumDesc() {
        return compleBoardRepository.findAllByOrderByNumDesc();
    }

    public List<CompleBoard> findByDeptnoContaining(Long deptno) {
        List<CompleBoard> cboard = compleBoardRepository.findByDeptnoContaining(deptno);
        System.out.println("deptno =========> " + deptno);
        return cboard;
    }
}