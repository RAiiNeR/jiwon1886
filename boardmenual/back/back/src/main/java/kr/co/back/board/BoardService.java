package kr.co.back.board;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    public List<Board> getAllBoard() {
        return boardRepository.findAllByOrderByNumDesc();
    }

    //페이징처리된값을 보내주는 것
    public Page<Board> getAllBoards(String title, int page, int size) {
        //페이지 번호와 크기를 기준으로 시작행과 끝 행 번호를 계산
        int startRow = (page - 1) * size + 1;
        int endRow = page * size;
        System.out.println("startRow: " + startRow + ": Page" + page);
        //페이징된 쿼리의 결과를 받은 리스트
        List<Board> board = boardRepository.findByTitleContainingOrderByNumDesc(title, startRow, endRow);
        //이건 토탈값 - title 검색 포함 
        int totalElements = boardRepository.countByTitleContaining(title);

        return new PageImpl<>(board, PageRequest.of(page - 1, size), totalElements);
    }

    public Board createBoard(BoardVO vo) {
        Board board = new Board();
        board.setWriter(vo.getWriter());
        board.setTitle(vo.getTitle());
        board.setContent(vo.getContent());
        board.setHit(0L);
        board.setBdate(new Date());
        //이미지 가져오기 추가
        board.setImgNames(vo.getImgNames());

        return boardRepository.save(board);
    }

    public Board getBoardByNum(Long num) {
        Board board = boardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("상세보기에 실패했습니다."));
        board.setHit(board.getHit() + 1);
        boardRepository.save(board);
        return board;
    }

    public void delete(Long num) {
        Board board = boardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("삭제 실패했습니다."));
        boardRepository.delete(board);
    }
}
