package kr.co.admin.systemmonitoring;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.GlobalMemory;

@RestController
public class SystemMonitorController {

    @GetMapping("/system-stats")
    public Map<String,Object> getSystemStats() {
        // OSHI SystemInfo 인스턴스를 사용하여 하드웨어 데이터 가져오기
        SystemInfo systemInfo = new SystemInfo();

        // CPU 사용량 가져오기
        CentralProcessor processor = systemInfo.getHardware().getProcessor();
        double cpuLoad = processor.getSystemCpuLoad(1000) * 100; // CPU 사용량 (%)

        // 메모리 사용량 가져오기
        GlobalMemory memory = systemInfo.getHardware().getMemory();
        long usedMemory = memory.getTotal() - memory.getAvailable(); // 사용 중인 메모리 (bytes)
        long totalMemory = memory.getTotal(); // 총 메모리 (bytes)

        Map<String,Object> m = new HashMap<>();
        m.put("cpu", cpuLoad);
        m.put("usedMemory", usedMemory / (1024 * 1024));
        m.put("totlaMemory", totalMemory / (1024 * 1024));

        // 반환할 정보
        return m;
    }
}