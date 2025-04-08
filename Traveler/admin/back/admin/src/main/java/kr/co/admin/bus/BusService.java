package kr.co.admin.bus;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
//2025-02-26 최의진 수정
@Service
public class BusService {
    @Autowired
    private BusRepository busRepository;

    // 버스 내역 리스트
    public List<Bus> getallBusinformation() {
        return busRepository.findAllByOrderByNumDesc();
    }
    //버스 예매 목록
    public Page<Bus> getBusListWithPagination(String departure, int page, int size) {
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        System.out.println("startRow" + startRow + ":Page" + page);
        List<Bus> bus = busRepository.findByContentContainingOrderByNumDesc(departure, startRow, endRow);
        int totalElements = busRepository.countByContentContaining(departure);
        return new PageImpl<>(bus, PageRequest.of(page - 1, size), totalElements);
    }

      // 개인 버스 예매 내역 디테일
    public Bus getBusByNum(Long num) {
        Bus bus = busRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("상세보기 실패"));
        busRepository.save(bus);
        return bus;
    }

    public void delete(Long num) {
        Bus bus = busRepository.findById(num)
        .orElseThrow(() -> new RuntimeException("삭제 실패 했습니다."));
        busRepository.delete(bus);
    }
}
