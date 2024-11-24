package kr.co.noori.back.chat;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Files_Collection {
    private static final String LOG_Path =
    "D:\\ICTStudy\\springboot\\react\\chatbot\\back\\src\\main\\java\\kr\\co\\noori\\back\\chat\\chat.txt";

    // 질문-답변 매핑 데이터를 읽어오는 메서드
    public static Map<String, String> loadChatMapping() {
        Map<String, String> chatMap = new HashMap<>();
        try (BufferedReader br = new BufferedReader(new FileReader(LOG_Path))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println("읽은 라인: " + line);  // 추가된 로그
                // "안녕=안녕하세요" 형식의 데이터를 '='로 분리
                String[] parts = line.split("=");
                if (parts.length == 2) {
                    chatMap.put(parts[0].trim(), parts[1].trim());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return chatMap;
    }
    
}
