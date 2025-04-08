package kr.co.user.mypage;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Clob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.user.member.MemberVO;

@Service
public class MypageService {
    @Autowired
    private MypageRepository mypageRepository;

    // 채팅로그 경로
    private static Path UPLOAD_PATH = Paths.get("./files/logs").toAbsolutePath().normalize();

    public Map<String, Object> getUser(Integer num) {
        MemberVO member = mypageRepository.findUserByNum(num);
        if (member == null) {
            return null; // 사용자가 존재하지 않는 경우 null 반환
        }
        // 필요한 필드만 포함된 Map 생성
        Map<String, Object> filteredUserInfo = new HashMap<>();
        filteredUserInfo.put("name", member.getName());
        filteredUserInfo.put("email", member.getEmail());
        filteredUserInfo.put("phone", member.getPhone());
        filteredUserInfo.put("mdate", member.getMdate());
        filteredUserInfo.put("intro", member.getIntro());

        return filteredUserInfo;
    }

    // 사용자 정보 수정
    @Transactional
    public void updateUserInfo(Integer num, String name, String phone, String email, String intro) {
        MemberVO member = mypageRepository.findUserByNum(num);
        if (member != null) {
            member.setName(name);
            member.setPhone(phone);
            member.setEmail(email);
            member.setIntro(intro);
            mypageRepository.save(member);
        } else {
            throw new RuntimeException("존재하는 회원이 아님");
        }
    }

    public List<Map<String, Object>> getRecentDiaries(Integer num) {
        List<Object[]> results = mypageRepository.findRecentDiaries(num);
        List<Map<String, Object>> diaries = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> diary = new HashMap<>();
            diary.put("id", row[0]); // 다이어리 ID
            diary.put("title", row[1]); // 다이어리 제목
            diaries.add(diary);
        }

        return diaries;
    }

    // 사용자가 올린 여행 블로그 글 최신 3개 조회
    public List<String> findRecentBackPack(Integer num) {
        return mypageRepository.findRecentBackPack(num);
    }

    // 예약 내역 5개 조회
    public List<String> getHotelReserve(String email) {
        List<Object[]> results = mypageRepository.findLatestHotelContentsByEmail(email);
        return results.stream()
                .map(obj -> convertClobToString(obj[0]))
                .collect(Collectors.toList());
    }

    // 최근 본 여행 콘텐츠 3개 조회
    public List<String> getRecentTourContents(Integer num) {
        List<Object[]> results = mypageRepository.findTourContents();
        return results.stream()
                .map(obj -> convertClobToString(obj[0]))
                .collect(Collectors.toList());
    }

    // 최근 본 호텔 콘텐츠 3개 조회
    public List<String> getRecentHotelContents(Integer num) {
        List<Object[]> results = mypageRepository.findHotelContents();
        return results.stream()
                .map(obj -> convertClobToString(obj[0]))
                .collect(Collectors.toList());
    }

    //개인 버스 예매 내역
    // public List<String> getBusList(Integer num) {
    //     List<Object[]> results = mypageRepository.findBusList();
    //     return results.stream()
    //             .map(obj -> convertClobToString(obj[0]))
    //             .collect(Collectors.toList());
    // }

    // 🔹 CLOB을 String으로 변환하는 유틸리티 메서드
    private String convertClobToString(Object clobObj) {
        if (clobObj instanceof Clob) {
            try {
                Clob clob = (Clob) clobObj;
                Reader reader = clob.getCharacterStream();
                StringBuilder sb = new StringBuilder();
                char[] buffer = new char[1024];
                int bytesRead;
                while ((bytesRead = reader.read(buffer)) != -1) {
                    sb.append(buffer, 0, bytesRead);
                }
                return sb.toString();
            } catch (SQLException | java.io.IOException e) {
                e.printStackTrace();
            }
        }
        return clobObj != null ? clobObj.toString() : "";
    }

    // 특정 사용자의 최신 5개 질문 가져오기 (isBot = true: 챗봇과의 대화, isBot = false: 관리자와의 대화)
    // ✅ 특정 사용자의 최신 5개 질문 가져오기 (num 사용)
    public List<String> getRecentUserQuestionsFromLogs(Integer num, boolean isBot) {
        // 1. num을 기반으로 username 조회
        String username = mypageRepository.findUsernameByNum(num);

        if (username == null || username.isEmpty()) {
            return Collections.emptyList(); // username이 없으면 빈 리스트 반환
        }

        // 2. 기존 로직 유지 (username 기반으로 로그 검색)
        File logDir = UPLOAD_PATH.toFile();
        if (!logDir.exists() || !logDir.isDirectory()) {
            return Collections.emptyList(); // 로그 디렉토리가 없으면 빈 리스트 반환
        }

        List<String> userQuestions = new ArrayList<>();
        File[] logFiles = logDir.listFiles((dir, name) -> isBot
                ? name.startsWith("Log_Bot_") && name.contains(username) // 챗봇과의 대화
                : name.startsWith("Log_") && !name.contains("Bot") && name.contains(username)); // 관리자와의 대화

        if (logFiles != null) {
            for (File logFile : logFiles) {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(new FileInputStream(logFile), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (line.contains("||user||")) { // 사용자의 질문만 추출
                            String[] parts = line.split("\\|\\|");
                            if (parts.length == 3) {
                                userQuestions.add(parts[2].trim()); // 질문 부분만 저장 & 공백 제거
                            }
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        // 최신 5개만 반환
        return userQuestions.stream()
                .limit(5)
                .collect(Collectors.toList());
    }

}