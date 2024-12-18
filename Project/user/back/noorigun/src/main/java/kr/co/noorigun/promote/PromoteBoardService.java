package kr.co.noorigun.promote;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class PromoteBoardService {
    // byname으로 autowired
    @Autowired
    private PromoteBoardRepository promoteRepository;

    // public void add(PromoteVO vo){
    // promoteDao.add(vo);
    // }

    // public List<PromoteVO> list(){
    // return promoteDao.list();
    // }

    // public PromoteVO detail(int num){
    // hit(num);
    // return promoteDao.detail(num);
    // }

    // public void hit(int num){
    // promoteDao.hit(num);
    // }

    // public void delete(int num){
    // promoteDao.delete(num);
    // }

    public List<PromoteBoard> getAllBoard() {
        return promoteRepository.findAllByOrderByNumDesc();
    }

    public Page<PromoteBoard> getAllPromotes(String title, int page, int size) {
        // 페이지 번호와 크기를 기준으로 시작 행과 끝 행 번호를 계산
        int startRow = (page - 1) * size + 1;// 시작행
        int endRow = page * size;// 끝행
        System.out.println("startRow:" + startRow + ": Page" + page);
        // 페이징된 쿼리의 결과를 받은 리스트
        List<PromoteBoard> board = promoteRepository.findByTitleContainingOrderByNumDesc(title, startRow, endRow);
        // 이건 토탈 값 - title 검색 포함
        int totalElements = promoteRepository.countByTitleContaining(title);

        return new PageImpl<>(board, PageRequest.of(page - 1, size), totalElements);
    }

    public PromoteBoard createPromote(PromoteBoardVO vo) {
        PromoteBoard promote = new PromoteBoard();
        promote.setWriter(vo.getWriter());
        promote.setTitle(vo.getTitle());
        promote.setContent(vo.getContent());
        promote.setHit(0L);
        promote.setPdate(new Date());
        promote.setImgNames(vo.getImgNames());
        return promoteRepository.save(promote);
    }

    public PromoteBoard getPromoteByNum(Long num) { // detail
        PromoteBoard promote = promoteRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("상세보기에 실패했습니다."));
        promote.setHit(promote.getHit() + 1);
        promoteRepository.save(promote);
        return promote;
    }

    public void delete(Long num) {
        PromoteBoard promote = promoteRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("삭제 실패했습니다."));
        promoteRepository.delete(promote);
    }

}
