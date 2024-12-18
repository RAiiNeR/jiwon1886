package kr.co.noorigun.compleboard;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class CompleBoardService {
    @Autowired
    private CompleBoardRepository compleBoardRepository;

    public List<CompleBoard> findAllByOrderByNumDesc() { // 모든 게시글을 번호 내림차순으로 조회
        return compleBoardRepository.findAllByOrderByNumDesc();
    }

    // 제목과 내용을 포함하는 게시글을 검색하고 페이징하여 조회
    public Page<CompleBoard> getAllBoards(String title, String writer, int page, int size) {
        // startRow와 endRow 계산
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        System.out.println("시작과 끝=====>" + startRow + "/" + endRow);
        // 제목과 작성자가 비어있을 경우 null로 처리
        title = (title == null || title.trim().isEmpty()) ? null : title;
        writer = (writer == null || writer.trim().isEmpty()) ? null : writer;

        // 검색 결과와 총 개수 가져오기
        List<CompleBoard> entity = compleBoardRepository.findByTitleAndWriterContainingOrderByNumDesc(title, writer,
                startRow, endRow);
        System.out.println("리스트 사이즈 : " + entity.size());
        int totalElements = compleBoardRepository.countByTitleAndWriterContaining(title, writer);

        // PageImp을 사용하여 Page 객체로 반환
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }

    // 새로운 게시글 생성하고 저장
    public CompleBoard creatCompleBoard(CompleBoardVO vo) {
        CompleBoard compleBoard = new CompleBoard();
        compleBoard.setMnum(vo.getMnum());
        compleBoard.setTitle(vo.getTitle());
        compleBoard.setContent(vo.getContent());
        compleBoard.setWriter(vo.getWriter());
        compleBoard.setCdate(new Date());
        compleBoard.setState(vo.getState());
        compleBoard.setPri(vo.getPri());
        compleBoard.setHit(0L);
        compleBoard.setPwd(vo.getPwd());
        compleBoard.setImgNames(vo.getImgNames());
        compleBoard.setDeptno(vo.getDeptno());
        return compleBoardRepository.save(compleBoard);
    }

    // 특정 번호의 게시글을 조회하며 조회수를 증가
    public CompleBoard getBoardByNum(Long num) {
        CompleBoard compleBoard = compleBoardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("상세보기에 실패했습니다."));
        compleBoard.setHit(compleBoard.getHit() + 1);
        compleBoardRepository.save(compleBoard);
        compleBoard.setWriter(compleBoard.getWriter().substring(0,1)+"**");
        return compleBoard;
    }

    // 특정 게시글을 삭제
    public void delete(Long num) {
        CompleBoard compleBoard = compleBoardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("삭제 실패했습니다."));
        compleBoardRepository.delete(compleBoard);
    }

    // 조회수 증가 없이 게시글을 조회
    public CompleBoard getBoardWithoutHit(Long num) {
        return compleBoardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    // 게시글을 업데이트
    @Transactional
    public CompleBoard updateCompleBoard(Long num, CompleBoardVO updatedBoard) {
        // 기존 게시글 조회
        CompleBoard existingBoard = compleBoardRepository.findById(num)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 수정 가능한 필드 업데이트
        existingBoard.setTitle(updatedBoard.getTitle());
        existingBoard.setWriter(updatedBoard.getWriter());
        existingBoard.setContent(updatedBoard.getContent());
        existingBoard.setPri(updatedBoard.getPri());
        existingBoard.setPwd(updatedBoard.getPwd());
        // state는 수정하지 않음

        // 저장
        return compleBoardRepository.save(existingBoard);
    }

    // 부서별 처리상태(통계)
    public List<Map<String, String>> findByContainingByState() {
        List<Map<String, String>> cboard = compleBoardRepository.findByContainingByState();
        return cboard;
    }

    // 특정 부서에 대한 처리상태 반환
    public Map<String, String> findByDeptnoContainingByState(Long deptno) {
        Map<String, String> cboard = compleBoardRepository.findByDeptnoContainingByState(deptno);
        Map<String, String> resMap = new HashMap<>();
        for (Map.Entry<String, String> e : cboard.entrySet()) {
            resMap.put(e.getKey(), String.valueOf(e.getValue()));
        }
        return resMap;
    }
}