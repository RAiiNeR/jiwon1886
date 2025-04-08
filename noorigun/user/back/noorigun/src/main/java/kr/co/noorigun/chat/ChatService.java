package kr.co.noorigun.chat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private static final String ANSWERS_PATH = "noorigun/chat/res.properties";

    // properties에 있는 파일을 로드
    private Properties answers() throws IOException {
        Properties ans = new Properties();
        ans.load(Files.newBufferedReader(Paths.get(ANSWERS_PATH).toAbsolutePath().normalize()));
        return ans;
    }

    // properties에서 chat.keywords에 매칭되는 단어를 찾는 메서드
    private Set<String> findKeyWords(String userMessage, Properties ans) {
        return ans.stringPropertyNames().stream()
                .filter(key -> key.startsWith("chat.keywords."))
                .map(key -> key.substring("chat.keywords.".length()))  // chat.keywords. 접두사 제거
                .filter(keywords -> {
                    // 쉼표로 구분된 키워드들에 대해 메시지가 포함되어 있는지 체크
                    String[] keywordList = keywords.split(",");
                    for (String keyword : keywordList) {
                        if (userMessage.contains(keyword.trim())) {
                            return true;
                        }
                    }
                    return false;
                })
                .collect(Collectors.toSet());
    }

    // properties에서 chat.keywords에 매칭된 값을 찾는 메서드
    private String findKeyWordMessage(Properties ans, String keyword) {
        return ans.getProperty("chat.keywords." + keyword);
    }

    // chat.keyword가 포함된 키에 대응하는 value 반환
    public String reply(String userMessage) throws IOException {
        Properties ans = answers();

        // key값에 있는 특정단어를 찾아서 value값을 출력함
        Set<String> keyWords = findKeyWords(userMessage, ans);

        if (!keyWords.isEmpty()) {
            // 첫 번째 매칭된 키워드를 반환
            return findKeyWordMessage(ans, keyWords.iterator().next());
        }

        return "음, 답을 찾기 어려운 질문이네요. \n누리봇에 부족한 점이 있었다면 \n콜센터(📞02-1234-5678)로 문의해주세요.";
    }
}
