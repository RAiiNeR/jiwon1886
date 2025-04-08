package kr.co.user.bus;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;


//2025-02-26수정 최의진
@Service
public class BusService {
    @Autowired
    private BusRepository busRepository;
    
    // 버스 내역 리스트
    public List<Bus> getallBusinformation() {
        return busRepository.findAllByOrderByNumDesc();
    }

    // 버스 정보 추가
    public Bus createBus(BusVO vo)throws Exception {
        Bus businformation = new Bus();
        businformation.setSchedule(new Date());
        businformation.setDeparture(vo.getDeparture());
        businformation.setDestination(vo.getDestination());
        businformation.setDepartureoftime(vo.getDepartureoftime());
        businformation.setDestinationoftime(vo.getDestinationoftime());
        businformation.setSitnum(vo.getSitnum());
        businformation.setMembernum(vo.getMembernum());
        // MemberVO member = memberRepository.findById(vo.getMembernum()).get(); // member 받아오기
        //  member = memberRepository.findById(vo.getMembernum()).orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
        return busRepository.save(businformation);
    }
    //개인 버스 예매 내역
     //버스 예매 목록
    // public Page<Bus> getBusListWithPagination(int membernum, int page, int size) {
    //     int startRow = (page - 1) * size + 1;
    //     int endRow = startRow + size - 1;
    //     System.out.println("startRow" + startRow + ":Page" + page);
    //     List<Bus> bus = busRepository.findByContainingOrderByNumDesc(membernum, startRow, endRow);
    //      int totalElements = busRepository.countByContentContaining(membernum);
    //     return new PageImpl<>(bus, PageRequest.of(page - 1, size), totalElements);
    // }
     // 버스 예약 내역을 가져오는 메서드
     public List<Map<String, Object>> busList(Long membernum) {
        try {
            // membernum을 기준으로 버스 예약 내역을 조회
            return busRepository.findBusListByMembernum(membernum);
        } catch (Exception e) {
            // 예외 발생 시, 에러 로그를 출력하고 예외를 던집니다.
            System.err.println("Error in busList: " + e.getMessage());
            throw new RuntimeException("버스 예약 내역을 가져오는 중 오류 발생", e);
        }
    }
    
}
    