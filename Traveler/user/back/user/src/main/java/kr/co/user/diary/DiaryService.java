package kr.co.user.diary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import kr.co.user.hotel.entity.Hotel;
import kr.co.user.member.MemberRepository;
import kr.co.user.member.MemberVO;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class DiaryService {

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private DiaryPageRepository diarypageRepository;

    // 파일 저장 경로
    private final Path uploadDir = Paths.get("./files/img/diary").toAbsolutePath().normalize();

    public DiaryService() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

   // 감정 값을 Double로 변환하는 메소드
private Double convertToDouble(Object value, String key) {
    if (value != null) {
        try {
            // 값 확인 및 로그 추가
            String valueStr = value.toString().trim();
            if (!valueStr.isEmpty()) {
                return Double.parseDouble(valueStr);
            } else {
                System.out.println(key + " 값이 빈 문자열입니다.");
            }
        } catch (NumberFormatException e) {
            System.out.println(key + " 값 변환 실패: " + e.getMessage());
        }
    } else {
        System.out.println(key + " 값이 null입니다.");
    }
    return null;  // 값이 없거나 변환 실패 시 null 반환
}

public void createDiary(Map<String, Object> map, String thumbnail, List<MultipartFile> imgnameFiles) {
    try {
        // pages 데이터를 변환
        List<Map<String, Object>> pages = extractPagesFromMap(map);
        System.out.println("변환된 pages 리스트: " + pages);

        // 다이어리 생성
        Diary diary = new Diary();
        diary.setTitle((String) map.get("title"));
        diary.setThumbnail(thumbnail);  // 텍스트로 받은 thumbnail 저장
        diary.setHit(0);
        diary.setHeart(0);
        diary.setIsshare(convertToInteger(map.get("isshare")));
        diary.setDdate(convertToDate((String) map.get("ddate")));
        // diary.setMembernum(MemberVO num);

        
        // membernum 값 가져와 설정
        try {
            String membernumStr = (String) map.get("membernum"); // map에서 "membernum" 키 가져오기
            if (membernumStr != null) {
                Long membernum = Long.parseLong(membernumStr); // String -> Long 변환
                diary.setMembernum(membernum);
            } else {
                throw new RuntimeException("membernum 값이 없습니다.");
            }
        } catch (NumberFormatException e) {
            throw new RuntimeException("membernum 값을 Long으로 변환하는 데 실패했습니다: " + e.getMessage(), e);
        }

        System.out.println("Diary: " + diary);

        // 다이어리 저장
        diary = diaryRepository.save(diary);

        double totalHappy = 0;
        double totalUpset = 0;
        double totalEmbressed = 0;
        double totalSad = 0;
        double totalNeutrality = 0;
        
        int pageCount = pages.size();

        // 다이어리 페이지 저장
        for (int i = 0; i < pageCount; i++) {
            Map<String, Object> pageData = pages.get(i);
            MultipartFile imgnameFile = (imgnameFiles != null && imgnameFiles.size() > i) ? imgnameFiles.get(i) : null;
            String imgnamePath = (imgnameFile != null && !imgnameFile.isEmpty()) ? saveFile(imgnameFile) : null;

            System.out.println("Page Data: " + pageData);

            // 다이어리 페이지 생성
            DiaryPage diaryPage = new DiaryPage();
            diaryPage.setDiary(diary);
            diaryPage.setPage(i + 1);
            diaryPage.setPtitle((String) pageData.get("ptitle"));
            diaryPage.setImgname(imgnamePath);
            diaryPage.setContent((String) pageData.get("content"));
            diaryPage.setLocation((String) pageData.get("location"));
            diaryPage.setEmotion((String) pageData.get("emotion"));

            // 감정 값 변환
            double happy = convertToDouble(pageData.get("happy"), "happy");
            double upset = convertToDouble(pageData.get("upset"), "upset");
            double embressed = convertToDouble(pageData.get("embressed"), "embressed");
            double sad = convertToDouble(pageData.get("sad"), "sad");
            double neutrality = convertToDouble(pageData.get("neutrality"), "neutrality");

            diaryPage.setHappy(happy);
            diaryPage.setUpset(upset);
            diaryPage.setEmbressed(embressed);
            diaryPage.setSad(sad);
            diaryPage.setNeutrality(neutrality);

            // 감정 값 누적
            totalHappy += happy;
            totalUpset += upset;
            totalEmbressed += embressed;
            totalSad += sad;
            totalNeutrality += neutrality;

            System.out.println("DiaryPage: " + diaryPage);
            diarypageRepository.save(diaryPage);
        }

       // 종합 감정 계산 후 `diaryemotion` 설정
        String overallEmotion = calculateOverallEmotion(
            totalHappy, totalUpset, totalEmbressed, totalSad, totalNeutrality
        );
        diary.setDiaryemotion(overallEmotion);
        diaryRepository.save(diary);

        System.out.println("다이어리 및 페이지 저장 완료! 종합 감정: " + overallEmotion);
    } catch (Exception e) {
        throw new RuntimeException("파일 저장 중 오류 발생: " + e.getMessage(), e);
    }
}


    private List<Map<String, Object>> extractPagesFromMap(Map<String, Object> map) {
        List<Map<String, Object>> pagesList = new ArrayList<>();
        int i = 0;

        while (map.containsKey("pages[" + i + "].ptitle")) {
            Map<String, Object> pageData = new HashMap<>();
            pageData.put("ptitle", map.get("pages[" + i + "].ptitle"));
            pageData.put("content", map.get("pages[" + i + "].content"));
            pageData.put("location", map.get("pages[" + i + "].location"));
            pageData.put("happy", map.get("pages[" + i + "].happy"));
            pageData.put("upset", map.get("pages[" + i + "].upset"));
            pageData.put("embressed", map.get("pages[" + i + "].embressed"));
            pageData.put("sad", map.get("pages[" + i + "].sad"));
            pageData.put("neutrality", map.get("pages[" + i + "].neutrality"));
            pageData.put("emotion", map.get("pages[" + i + "].emotion"));

            pagesList.add(pageData);
            i++;
        }

        return pagesList;
    }


    private String calculateOverallEmotion(double happy, double upset, double embressed, double sad, double neutrality) {
        // 감정 값 중 가장 높은 확률을 가진 감정을 선택
        Map<String, Double> emotions = new HashMap<>();
        emotions.put("happy", happy);
        emotions.put("upset", upset);
        emotions.put("embressed", embressed);
        emotions.put("sad", sad);
        emotions.put("neutral", neutrality);
    
        return emotions.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .get()
            .getKey();
    }
    
    
    // 파일 저장
    private String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // 파일 저장 경로가 존재하지 않으면 생성
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String fileName = file.getOriginalFilename();
            Path targetLocation = uploadDir.resolve(fileName);
            int count = 1;

            while (Files.exists(targetLocation)) {
                String newFileName = fileName.substring(0, fileName.lastIndexOf('.')) 
                        + "_" + count++ + fileName.substring(fileName.lastIndexOf('.'));
                targetLocation = uploadDir.resolve(newFileName);
            }

            Files.copy(file.getInputStream(), targetLocation);
            return targetLocation.getFileName().toString(); 
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류 발생: " + e.getMessage(), e);
        }
    }


    private Date convertToDate(String value) {
        if (value != null && !value.isEmpty()) {
            try {
                return new SimpleDateFormat("yyyy-MM-dd").parse(value);
            } catch (Exception e) {
                throw new RuntimeException("잘못된 날짜 형식입니다: " + value, e);
            }
        }
        return null;
    }

    private Integer convertToInteger(Object value) {
        if (value instanceof Integer) {
            return (Integer) value;
        } else if (value instanceof String) {
            return Integer.parseInt((String) value);
        }
        throw new RuntimeException("잘못된 타입의 값이 전달되었습니다: " + value);
    }

    private Long convertToLong(Object value) {
        if (value instanceof Long) {
            return (Long) value;
        } else if (value instanceof String) {
            return Long.parseLong((String) value);
        }
        throw new RuntimeException("잘못된 타입의 값이 전달되었습니다: " + value);
    }

    //다이어리 리스트
    public List<DiaryVO> getAllDiary() {
        List<Diary> diaries = diaryRepository.findAllByOrderByNumDesc();
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

            // if (diary.getMember() != null) {
            //     diaryVO.setMembernum(diary.getMember().getNum());

            //     MemberVO memberVO = new MemberVO();
            //     memberVO.setNum(diary.getMember().getNum());
            //     memberVO.setName(diary.getMember().getName());
            //     diaryVO.setMember(memberVO);
            // } else {
            //     diaryVO.setMembernum(null);
            //     diaryVO.setMember(new MemberVO());
            // }

            diaryVOList.add(diaryVO);
        }

        return diaryVOList;
    }


//다이어리 리스트
public List<DiaryVO> getOneDiary() {
    List<Diary> diaries = diaryRepository.findAllByOrderByNumDesc();
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

        diaryVOList.add(diaryVO);
    }

    return diaryVOList;
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


    //공유 다이어리 9개
    public List<Diary> getShareDiaryList() {
      return diaryRepository.shareDiaryList();
    }
    

   
    //다이어리 삭제
    public void deleteDiary(Long num) {
        Diary diary = diaryRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("Diary not found with ID: " + num));
        diaryRepository.delete(diary);
    }


     // 선택된 다이어리들의 isshare 값을 1로 업데이트
     public void updateShareStatus(List<Integer> selectedDiaries) {
        // 데이터베이스 업데이트 처리
        diaryRepository.updateShareStatus(selectedDiaries);
    }

    //isshare 0으로
    public void updateNotShareStatus(List<Integer> selectedDiaries) {
        // 데이터베이스 업데이트 처리
        diaryRepository.updateNotShareStatus(selectedDiaries);
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

    


    //페이징(나의 공유 다이어리)
    public Page<Diary> getMyshareDiarysWithPagination(int membernum, int page, int size) {
        // page가 1보다 작을 경우 1로 설정
        if (page < 1) {
            page = 1;
        }
    
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
    
        // membernum을 쿼리에 추가
        List<Diary> entity = diaryRepository.findByIsshareAndMembernumOrderByNumDesc(membernum, startRow, endRow);
        int totalElements = diaryRepository.countByIsshareAndMembernum(membernum);
    
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }
    
    
    
    //페이징(나의 다이어리)
    public Page<Diary> getMyDiarysWithPagination(int membernum, int page, int size) {
        // page가 1보다 작을 경우 1로 설정
        if (page < 1) {
            page = 1;
        }
    
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
    
        // membernum을 쿼리에 추가
        List<Diary> entity = diaryRepository.findByIsMyAndMembernumOrderByNumDesc(membernum, startRow, endRow);
        int totalElements = diaryRepository.countByIsMyAndMembernum(membernum);
    
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }
    

}
