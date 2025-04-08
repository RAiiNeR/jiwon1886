package kr.co.noorigun.program;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegistryService {
    @Autowired
    private RegistryRepository registryRepository;
    // Registry 추가및 회원이 하나의 강좌에 중복신청 안되게 하는곳
    public Registry addRegistry(RegistryVO vo)throws Exception {
        List<Registry> existingRegistries = registryRepository.findByMembernum(vo.getMembernum());
        for (Registry registry : existingRegistries) {
            if (registry.getClassnum().equals(vo.getClassnum())) {
                throw new Exception("이미 등록된 강좌입니다.");
            }
        }
        Registry registry = new Registry();
        registry.setClassnum(vo.getClassnum());
        registry.setMembernum(vo.getMembernum());
        return registryRepository.save(registry);
    }


}