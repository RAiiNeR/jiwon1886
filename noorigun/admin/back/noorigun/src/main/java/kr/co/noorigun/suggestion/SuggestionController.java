package kr.co.noorigun.suggestion;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.noorigun.vo.SuggestionVO;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/suggestion")
public class SuggestionController {
    @Autowired
    private SuggestionService suggestionService;

    @GetMapping
    public Page<SuggestionVO> listSuggestion(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "") String searchValue
    ) {
        return suggestionService.list(page, size, searchValue);
    }

    @GetMapping("/{num}")
    public SuggestionVO detailSuggestionVO(@PathVariable int num) {
        return suggestionService.detail(num);
    }

    // @DeleteMapping
    // public ResponseEntity<?> deleteSuggestion(@RequestParam int num) {
    //     suggestionService.delete(num);
    //     return ResponseEntity.ok().body("Delete Success");
    // }

    //  @DeleteMapping
    //  public ResponseEntity<?> deleteSuggestions(@RequestBody List<Integer> ids) {
    //  suggestionService.deleteSuggestions(ids);
    //  return ResponseEntity.ok().body("Delete Success");
    // }
    @DeleteMapping
    public ResponseEntity<?> deleteSuggestions(@RequestParam(required = false) Integer num, 
                                               @RequestBody(required = false) List<Integer> ids) {
        if (num != null) {
            // 단일 삭제: num 파라미터가 있을 경우
            suggestionService.delete(num);
            return ResponseEntity.ok().body("Single delete success");
        } else if (ids != null && !ids.isEmpty()) {
            // 여러 항목 삭제: ids가 있을 경우
            suggestionService.deleteSuggestions(ids);
            return ResponseEntity.ok().body("Multiple delete success");
        }
        // num과 ids가 모두 없을 경우
        return ResponseEntity.badRequest().body("Invalid request: no num or ids provided");
    }

    //상태값 선택
    @PutMapping("state")
    public ResponseEntity<?> putMethodName(@RequestBody Map<String,String> entity) {
        suggestionService.updateState(entity);
        return ResponseEntity.ok().body(entity);
    }
}


