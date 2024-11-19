package kr.co.back.board;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/board")
public class BoardController {
    @Autowired
    private BoardService boardService;

    //해당 경로를 절대경로로 바꾸고 저장한다음
    private final Path uploadDir =
        Paths.get("back\\back\\src\\main\\resources\\static\\resources\\imgfile")
        .toAbsolutePath().normalize();
    //BoardController가 불릴때 createDirectories에 폴더를 만들어준다
    public BoardController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory.", e);
        }
    }

    // @PostMapping
    // public ResponseEntity<?> postMethodName(BoardVO vo) {
    //     boardService.createBoard(vo);        
    //     return ResponseEntity.ok().body(vo);
    // }
    @PostMapping
    public Board createBoard(@ModelAttribute BoardVO vo) throws IOException {
        List<String> imageNames = new ArrayList<>();
        System.out.println("Logs================>" + uploadDir);
        for (MultipartFile multipartFile : vo.getImages()) {
            if (!multipartFile.isEmpty()) {
                String originalFileName = multipartFile.getOriginalFilename();
                System.out.println(originalFileName);
                String extension = originalFileName;
                String newFileName = extension;
                Path destinationFile = uploadDir.resolve(newFileName).normalize();
                Files.copy(multipartFile.getInputStream(), destinationFile);
                imageNames.add(newFileName);
            }
        }
        vo.setImgNames(imageNames);
        return boardService.createBoard(vo);
    }

    
    // @GetMapping
    // public List<Board> getAllBoard(){
    //     return boardService.getAllBoard();
    // }
    @GetMapping
    public Page<Board> getAllBoards(@RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "size", defaultValue = "9") int size,
        @RequestParam(name = "title", defaultValue = "") String title){
            return boardService.getAllBoards(title, page, size);
    }

    @GetMapping("/detail")
    public Board getBoardByNum(@RequestParam("num") Long num){
        return boardService.getBoardByNum(num);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteBoard(@RequestParam("num") Long num){
        boardService.delete(num);
        return ResponseEntity.ok().body(num+"번째 데이터 삭제 완료");
    }
    
}
