package kr.co.noorigun.suggestion;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ScommService {
    @Autowired
    private ScommRepository scommRepository;

    public List<Scomm> getAllScomm(){
        return scommRepository.findAllByOrderByNumDesc();
    }
    // 페이징 처리하는 부분
    public Page<Scomm> getAllFcomms(int num, int page, int size) {
        int startRow = (page - 1) * size + 1;
        int endRow = page * size;
        System.out.println("startRow: " + startRow + ": Page" + page);
        List<Scomm> board = scommRepository.findByTitleContainingOrderByNumDesc(num, startRow,endRow);
        int totalElements = scommRepository.countByTitleContaining(num);
        return new PageImpl<>(board, PageRequest.of(page - 1, size), totalElements);
    }

    // 생성된 값을 가져오는 부분
    public Scomm createFcomm(ScommVO vo) {
        Scomm scomm = new Scomm();
        scomm.setWriter(vo.getWriter());
        scomm.setComments(vo.getComments());
        scomm.setScdate(new Date());
        scomm.setSbnum(vo.getSbnum());
        return scommRepository.save(scomm);
    }

    //삭제하는 부분
    public void delete(Long num){
        Scomm fcomm = scommRepository.findById(num)
        .orElseThrow(()-> new RuntimeException("삭제 실패했습니다."));
        scommRepository.delete(fcomm);
    }

}
