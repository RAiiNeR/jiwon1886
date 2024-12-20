package kr.co.noori.back.compleboard;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comple")
public class CompleBoardController {
    @Autowired
    private CompleBoardService compleBoardService;

    @GetMapping
    public List<CompleBoard> getCompleBoardByDeptno() {
        return compleBoardService.findAllByOrderByNumDesc();
    }
}