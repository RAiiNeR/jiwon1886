package kr.co.noorigun.compleboard;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class CcommService {
    @Autowired
    private CcommRepository ccommRepository;

    // 모든게시글 목록 조회(num을 가준으로 내림차순 정렬)
    // 특정 게시글 번호(fbnum)에 해당하는 모든 댓글 조회
    public List<Ccomm> getAllCcommsByCbnum(Long cbnum) {
        return ccommRepository.findAllByCbnumOrderByNumDesc(cbnum);
    }

    // 특정 게시글의 댓글 페이징 처리
    public Page<Ccomm> getAllBoards(Long cbnum, int page, int size) {
        int startRow = (page - 1) * size + 1; // 시작 번호 계산
        int endRow = page * size; // 끝 번호 계산
        System.out.println("startRow: " + startRow + ": Page" + page);
        // 데이터베이스에서 댓글 조회
        List<Ccomm> board = ccommRepository.findByCbnumContainingOrderByNumDesc(cbnum, startRow, endRow);
        // 해당 게시글 전체 댓글 수 조회
        int totalElements = ccommRepository.countByCbnumContaining(cbnum);
        // 조회된 결과를 Page객체로 반환
        return new PageImpl<>(board, PageRequest.of(page - 1, size), totalElements);
    }

    // 생성된 값을 가져오는 부분(새로운 댓글 생성)
    public Ccomm createCcomm(CcommVO vo) {
        Ccomm ccomm = new Ccomm();
        ccomm.setWriter(vo.getWriter());
        ccomm.setComments(vo.getComments());
        ccomm.setCcdate(new Date());
        ccomm.setCbnum(vo.getCbnum()); // 댓글이 속한 게시글 번호 설정
        return ccommRepository.save(ccomm);

    }

    // 직접 엔티티를 받아 새로운 댓글을 생성
    public Ccomm createCcomm(Ccomm entity) {
        entity.setCcdate(new Date());
        return ccommRepository.save(entity);
    }

    // 특정 게시글에 속한 댓글의 총 개수 반환
    public int getCommentCount(Long cbnum) {
        return ccommRepository.countByCbnum(cbnum);
    }

    // 특정 댓글 삭제
    public void delete(Long num) {
        Ccomm ccomm = ccommRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("삭제  실패했습니다."));
        ccommRepository.delete(ccomm);
    }
}
