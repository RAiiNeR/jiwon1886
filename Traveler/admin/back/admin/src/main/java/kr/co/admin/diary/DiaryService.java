package kr.co.admin.diary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import kr.co.admin.member.MemberRepository;
import kr.co.admin.member.MemberVO;

import java.util.*;

@Service
public class DiaryService {

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private DiaryPageRepository diarypageRepository;



    public Map<String, Object> getPagedDiaries(int page, int size) {
        if (page < 1) {
            page = 1;
        }
        
        int startRow = (page - 1) * size + 1;
        int endRow = page * size;
    
        // 페이징된 다이어리 리스트 조회
        List<Diary> diaries = diaryRepository.findByAllshareAndMembernumOrderByNumDesc(startRow, endRow);
        List<DiaryVO> diaryVOList = new ArrayList<>();
    
        for (Diary diary : diaries) {
            DiaryVO diaryVO = new DiaryVO();
            diaryVO.setNum(diary.getNum());
            diaryVO.setTitle(diary.getTitle());
            diaryVO.setDdate(diary.getDdate());
            diaryVO.setHeart(diary.getHeart());
            diaryVO.setHit(diary.getHit());
            diaryVO.setIsshare(diary.getIsshare());
            diaryVO.setThumbnail(diary.getThumbnail());
            diaryVO.setMembernum(diary.getMembernum());
            diaryVO.setDiaryemotion(diary.getDiaryemotion());
    
            // 멤버 이름 설정 (MemberVO 사용)
            if (diaryVO.getMembernum() != null) {
                MemberVO memberVO = memberRepository
                                    .findById(diaryVO.getMembernum()).orElse(null);
                if (memberVO != null) {
                    diaryVO.setMembername(memberVO.getName());
                }
            }
    
            diaryVOList.add(diaryVO);
        }
    
        // 전체 게시글 개수 조회
        int totalDiaries = diaryRepository.countByAllshareAndMembernum();
        int totalPages = (int) Math.ceil((double) totalDiaries / size);
    
        // 응답 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("diaries", diaryVOList);
        response.put("totalPages", totalPages);
    
        return response;
    }
    






    //다이어리 상세보기
    public Diary getDiaryPages(Long num) { 
    System.out.println("Looking for diary with ID: " + num);
    Optional<Diary> optionalDiary = diaryRepository.findById(num);
    if (optionalDiary.isPresent()) {
        Diary diary = optionalDiary.get();
        diary.setHit(diary.getHit() + 1);
        diaryRepository.save(diary);
        return diary;
    } else {
        throw new RuntimeException("ID " + num + "에 해당하는 다이어리를 찾을 수 없습니다.");
    }
}


    

   
    // 하나의 다이어리 삭제
    public void deleteDiary(Long num) {
        // 해당 다이어리가 존재하는지 확인
        Diary diary = diaryRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("Diary not found with ID: " + num));
        
        // 다이어리 삭제
        diaryRepository.delete(diary);
    }
    






    //페이징(전체체 공유 다이어리)
    public Page<Diary> getAllshareDiarysWithPagination(int page, int size) {
        // page가 1보다 작을 경우 1로 설정
        if (page < 1) {
            page = 1;
        }
    
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
    
        // membernum을 쿼리에 추가
        List<Diary> entity = diaryRepository.findByAllshareAndMembernumOrderByNumDesc(startRow, endRow);
        int totalElements = diaryRepository.countByAllshareAndMembernum();
    
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }

    

    public long getDiaryCount() {
        return diaryRepository.countDiaries();
    }
   
    public long getShareDiaryCount() {
        return diaryRepository.countShareDiaries();
    }
    
    public long getMyDiaryCount() {
        return diaryRepository.countMyDiaries();
    }

}
