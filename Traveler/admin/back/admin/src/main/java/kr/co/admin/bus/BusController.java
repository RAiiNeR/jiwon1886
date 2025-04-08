package kr.co.admin.bus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
//2025-02-26 최의진 수정
//http://localhost:82/adminBack/api/busreservation
@RestController
@RequestMapping("/api/busreservation")
@RequiredArgsConstructor
public class BusController {
    
    @Autowired
    private BusService busService;

    // 개인 예매내역 목록
    @GetMapping
    public Page<Bus> getallBus(
            @RequestParam(name = "departure", defaultValue = "") String departure,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return busService.getBusListWithPagination(departure, page, size);
    }

        //개인 예매 버스 정보
    @GetMapping("/detail")
    public Bus getBusByNum(@RequestParam("num") Long num) {
        return busService.getBusByNum(num);
    }
    @DeleteMapping
    public ResponseEntity<?> deleteBus(@RequestParam("num")Long num) {
        busService.delete(num); //개인 예매내역 삭제
        return ResponseEntity.ok().body(num + "번 예매내역 삭제 완료");
        }
}
