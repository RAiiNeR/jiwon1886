package kr.co.user.bus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
// http://localhost:81/userBack/api/busreservation
//2025-02-26수정 최의진
@RestController
@RequestMapping("/api/busreservation")
@RequiredArgsConstructor
public class BusController {

    @Autowired
    private BusService busService;

    // 버스 예매
    //requestbody : application/json
    @PostMapping("/add")
    public ResponseEntity<Bus> updateBus(@ModelAttribute BusVO vo) {
        System.out.println("토큰 테스트-----------------" + vo.getMembernum());
        System.out.println("테스트-------------------------------" + vo);
        try {
            Bus createBus = busService.createBus(vo);
            return ResponseEntity.ok().body(createBus);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("예외처리 ------------------");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @GetMapping("/{membernum}")
    public ResponseEntity<Map<String,Object>> getBus(@PathVariable("membernum") Long membernum) {
        try {
            List<Map<String, Object>>buslist = busService.busList(membernum);
            Map<String, Object> response = new HashMap<>();
            response.put("buslist", buslist); // 프로그램 리스트 반환
            return ResponseEntity.ok(response); // 200 OK 응답 반환
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.notFound().build(); // 예외가 발생하면 404 응답 반
        }
    }
}
    // public Page<Bus> getallBus(
    //     @RequestParam(name = "membernum", defaultValue = "") int membernum,
    //         @RequestParam(name = "page", defaultValue = "1") int page,
    //         @RequestParam(name = "size", defaultValue = "10") int size) {
    //     return busService.getBusListWithPagination(membernum, page, size);
    
    //         }
   

