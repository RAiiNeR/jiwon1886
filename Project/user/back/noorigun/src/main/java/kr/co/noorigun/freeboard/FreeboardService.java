package kr.co.noorigun.freeboard;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class FreeboardService {
    @Autowired
    private FreeboardRepository freeboardRepository;

    // 모든게시글 목록 조회(num을 가준으로 내림차순 정렬)
    public List<Freeboard> getAllFreeboardList() {
        return freeboardRepository.findAllByOrderByNumDesc();
    }

    // 제목을 포함하는 게시글을 페이징하여 조회
    public Page<Freeboard> getFreeboardListWithPagination(String title, int page, int size) {
        // startRow와 endRow 계산
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        System.out.println("시작과 끝=====>" + startRow + "/" + endRow);
        List<Freeboard> entity = freeboardRepository.findByTitleContainingOrderByNumDesc(title, startRow, endRow);
        System.out.println("리스트 사이즈 : " + entity.size());
        // 전체 게시글 수 계산 (페이징을 위한)
        int totalElements = freeboardRepository.countByTitleContaining(title);

        // PageImpl을 사용하여 Page 객체로 반환
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }

    // 게시글 생성
    public Freeboard createFreeboard(FreeBoardVO vo) {
        Freeboard freeboard = new Freeboard();
        freeboard.setTitle(vo.getTitle());
        freeboard.setWriter(vo.getWriter());
        freeboard.setContent(vo.getContent());
        freeboard.setHit(0L); // 초기 조회수는 0
        freeboard.setFdate(new Date()); // 작성일 현재 날짜로 설정
        freeboard.setImgNames(vo.getImgNames());

        return freeboardRepository.save(freeboard); // 데이터베이스에 저장
    }

    // 특정 게시글 조회
    public Optional<Freeboard> getFreeboardByNum(Long num) {
        return freeboardRepository.findById(num);
    }

    // 게시글 수정
    public Freeboard updateFreeboard(Freeboard vo) {
        Optional<Freeboard> entity = getFreeboardByNum(vo.getNum());
        Freeboard board = entity.get();
        return freeboardRepository.save(board);
    }

     // 특정 게시글 조회 후 조회수 증가
    public Freeboard getBoardByNum(Long num) {
        Freeboard Freeboard = freeboardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("상세보기에 실패했습니다."));
        Freeboard.setHit(Freeboard.getHit() + 1);
        freeboardRepository.save(Freeboard);
        return Freeboard;
    }

    // 삭제하는 부분
    public void delete(Long num) {
        Freeboard freeboard = freeboardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("삭제  실패했습니다."));
        freeboardRepository.delete(freeboard);
    }

    // 조회수 변경 없이 특정 게시글 조회
    public Freeboard getBoardWithoutHit(Long num) {
        return freeboardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    }

    @Transactional // 게시글 수정
    public Freeboard updateCompleBoard(Long num, FreeBoardVO updatedBoard) {
        // 기존 게시글 조회
        Freeboard existingBoard = freeboardRepository.findById(num)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 수정 가능한 필드 업데이트
        existingBoard.setTitle(updatedBoard.getTitle());
        existingBoard.setWriter(updatedBoard.getWriter());
        existingBoard.setContent(updatedBoard.getContent());

        // 업데이트된 게시글 저장
        return freeboardRepository.save(existingBoard);
    }

}

