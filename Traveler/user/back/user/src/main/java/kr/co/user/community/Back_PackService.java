package kr.co.user.community;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.sql.Clob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.user.member.MemberRepository;
import kr.co.user.member.MemberVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class Back_PackService {
    @Autowired
    private Back_PackRepository backpackRepository;

    @Autowired
    private MemberRepository memberRepository; // 회원정보 조회

    // 변경 사항
    public List<Back_Pack> getAllBackPackList() {
        return backpackRepository.findAllByOrderByNumDesc();
    }

    private String convertClobToString(Clob clob) {
        StringBuilder sb = new StringBuilder();
        try (Reader reader = clob.getCharacterStream();
            BufferedReader br = new BufferedReader(reader)) {
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line).append("\n");  // 여러 줄이면 줄바꿈 추가
            }
        } catch (SQLException | IOException e) {
            e.printStackTrace();
            return "";  // 변환 실패 시 빈 문자열 반환
        }
        return sb.toString().trim();  // 불필요한 공백 제거 후 반환
    }

    public Page<Map<String, Object>> getBackPackListWithPagination(String title, int page, int size) {
        // startRow와 endRow 계산
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        System.out.println("시작과 끝 =====>" + startRow + "/" + endRow);
        List<Map<String, Object>> entity = backpackRepository.findByTitleContainingOrderByNumDesc(title, startRow, endRow);
        System.out.println("리스트 사이즈 =====> : " + entity.size());
        for (String k : entity.get(0).keySet()) {
            if (entity.get(0).get(k) instanceof Clob) {
                System.out.println(k + " / " + convertClobToString((Clob) entity.get(0).get(k)));
            } else {
                System.out.println(k + " / " + entity.get(0).get(k));
            }
        }
        // 전체 게시글 수 계산 (페이징을 위한)
        int totalElements = backpackRepository.countByTitleContaining(title);

        // PageImpl을 사용하여 Page 객체로 반환
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }

    // 게시글 작성
    @Transactional
    public Back_Pack createPost(Long memberNum, String title, String content, List<String> imgNames,
            List<String> tags) {
        // 1. 회원 정보 조회
        MemberVO member = memberRepository.findById(memberNum)
                .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다."));

        // 2. 게시글 생성
        Back_Pack post = new Back_Pack();
        post.setMember(member); // 작성자 정보
        post.setTitle(title);
        post.setContent(content);
        post.setCdate(new Date());
        post.setHit(0L); // 조회수 기본값
        post.setHeart(0L); // 좋아요 기본값
        post.setImgNames(imgNames != null ? imgNames : new ArrayList<>()); // 이미지 리스트 저장
        post.setTag(tags != null ? tags : new ArrayList<>()); // 태그 리스트 저장

        // 3. 저장
        return backpackRepository.save(post);
    }

    public Optional<Back_Pack> getPostById(Long num) {
        return backpackRepository.findByNum(num);
    }

    // 게시글 수정
    public Back_Pack updateBackPack(Back_Pack vo) {
        Back_Pack backpack = getBackPackByNum(vo.getNum()); // 기존 게시글 조회(X 예외)
        backpack.setTitle(vo.getTitle()); // 제목 수정
        backpack.setContent(vo.getContent()); // 내용 수정
        return backpackRepository.save(backpack); // 수정된 데이터 저장
    }

    // 특정 게시글 상세 조회
    public Back_Pack getBackPackByNum(Long num) {
        Back_Pack backpack = backpackRepository.findById(num) // 기존 게시글 조회(X 예외)
                .orElseThrow(() -> new RuntimeException("상세보기에 실패했습니다."));
        backpack.setHit(backpack.getHit() + 1); // 조회수 증가
        return backpackRepository.save(backpack); // 업데이트된 데이터 저장 후 반환
    }

    // 게시글 삭제(게시글 번호(num)로 조회 후 삭제)
    public void delete(Long num) {
        Back_Pack backpack = backpackRepository.findById(num) // 기존 게시글 조회(X 예외)
                .orElseThrow(() -> new RuntimeException("삭제 실패했습니다."));
        backpackRepository.delete(backpack);
    }

}