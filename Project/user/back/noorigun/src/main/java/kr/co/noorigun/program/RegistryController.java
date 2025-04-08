package kr.co.noorigun.program;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/registry")
public class RegistryController {
    
@Autowired
private RegistryService registryService;

@PostMapping  //추가 부분
    public ResponseEntity<Registry> createRegistry(@RequestBody RegistryVO vo){
        try {
            // 새로운 등록 들어가기 
            Registry registry = registryService.addRegistry(vo);
            return ResponseEntity.ok(registry);
        } catch (Exception e) {
          
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
}
