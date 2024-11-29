package kr.co.ictstudy.back.demo;

import java.nio.file.Path;
import java.nio.file.Paths;

public class NormalizeExample {
    public static void main(String[] args) {
        Path pathNormalize = Paths.get("back/uploads/../uploads/./file.txt").toAbsolutePath().normalize();
        Path nonpathNormalize = Paths.get("back/uploads/../uploads/./file.txt").toAbsolutePath();

        System.out.println(pathNormalize);
        System.out.println(nonpathNormalize);
    }
}
