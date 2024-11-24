package kr.co.noori.back.chat;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Files_Collection {
    private static final String LOG_Path=
    "D:\\ICTStudy\\springboot\\react\\chatbot\\back\\src\\main\\java\\kr\\co\\noori\\back\\chat\\chat2.txt";

    public static List<String> fileReader() {
        List<String> chList = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(LOG_Path))){
            String line;
            while ((line = br.readLine()) != null) {
                chList.add(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return chList;
    }

    public static List<String> filesCollection() {
        try {
            return Files.lines(Paths.get(LOG_Path)).collect(Collectors.toList());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void main(String[] args) {
        List<String> resList = fileReader();
        for (String e : resList) {
            System.out.println(e);
        }
    }
}
