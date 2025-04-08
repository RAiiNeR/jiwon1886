package kr.co.admin.systemmonitoring;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class SystemInfoService {

    public Map<String, Object> getSystemUsage() {
        Map<String, Object> usage = new HashMap<>();

        double cpuUsage = getCpuUsage();
        double memoryUsage = getMemoryUsage();
        double diskUsage = getDiskUsage(); // 디스크 사용량

        usage.put("cpuUsage", cpuUsage);
        usage.put("memoryUsage", memoryUsage);
        usage.put("diskUsage", diskUsage);

        return usage;
    }

    private double getCpuUsage() {
        // CPU 사용량 계산 로직
        return 7.1;
    }

    private double getMemoryUsage() {
        // 메모리 사용량 계산 로직
        return 57.2;
    }

    private double getDiskUsage() {
        try {
            // 루트 디렉토리의 디스크 사용량 계산
            File file = new File("/");
            long totalSpace = file.getTotalSpace(); // 총 용량
            long usableSpace = file.getUsableSpace(); // 사용 가능한 공간
            long usedSpace = totalSpace - usableSpace; // 사용된 공간

            // 사용 비율 계산
            double diskUsage = (double) usedSpace / totalSpace * 100;
            return diskUsage;
        } catch (Exception e) {
            e.printStackTrace();
            return 0.0; // 오류 발생 시 0으로 처리
        }
    }
}
