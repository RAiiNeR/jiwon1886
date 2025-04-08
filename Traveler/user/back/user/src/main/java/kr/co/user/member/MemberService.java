package kr.co.user.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 일반 회원가입
    @Transactional
    public void registerUser(MemberVO vo) {
        validateMemberInfo(vo); // 입력값 검증
        String encodePass = passwordEncoder.encode(vo.getPwd());
        vo.setPwd(encodePass);

        // 사용자 정보 저장
        // MemberVO entity = MemberVO.builder()
        //         .username(vo.getUsername())
        //         .pwd(vo.getPwd())
        //         .name(vo.getName())
        //         .code(vo.getCode()) // 주민번호
        //         .phone(vo.getPhone())
        //         .email(vo.getEmail())
        //         .role("USER")
        //         .socialUser(false)
        //         .mdate(new Date()) // 가입일 설정
        //         .build();
        memberRepository.save(vo);
    }

    // 제휴회사 회원가입
    @Transactional
    public void registerCompany(MemberVO vo) {
        validateCompanyInfo(vo); // 입력값 검증

        // // 제휴회사 정보 저장
        // MemberVO entity = MemberVO.builder()
        //         .username(vo.getUsername())
        //         .pwd(vo.getPwd())
        //         .name(vo.getName()) // 담당자 이름
        //         .companyName(vo.getCompanyName()) // 회사명
        //         .companyType(vo.getCompanyType()) // 기업군 선택 (숙소, 교통, 기타)
        //         .code(vo.getCode()) // 사업자등록번호
        //         .phone(vo.getPhone()) // 대표 전화번호
        //         .email(vo.getEmail()) // 회사 이메일
        //         .role("COMPANY")
        //         .socialUser(false)
        //         .mdate(new Date()) // 가입일 설정
        //         .build();
        vo.setMdate(new Date());
        memberRepository.save(vo);
    }

    public void changePwd(String username, String newPwd) {
        MemberVO entity = findByUsername(username).get();
        String encodePass = passwordEncoder.encode(newPwd);
        entity.setPwd(encodePass);
        memberRepository.save(entity);
    }

    public Optional<MemberVO> findByUsername(String username) {
        return memberRepository.findByUsername(username);
    }

    // 아이디 중복 확인
    public boolean isUsernameDuplicate(String username) {
        int cnt = memberRepository.existsByUsername(username);
        System.out.println("Cnt =>" + cnt);
        if (cnt > 0) {
            return true;
        } else {
            return false;
        }

    }

    // 이메일 중복 확인
    public boolean isEmailDuplicate(String email) {
        int cnt = memberRepository.existsByEmail(email);
        System.out.println("Cnt =>" + cnt);
        if (cnt > 0) {
            return true;
        } else {
            return false;
        }
    }

    public boolean isCodeDuplicate(String code) {
        return findByCode(code).isPresent();
    }

    public Optional<MemberVO> findByCode(String code) {
        return memberRepository.findByCode(code);
    }

    // 일반 회원 가입 시 입력값 검증
    private void validateMemberInfo(MemberVO vo) {
        if (isUsernameDuplicate(vo.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        if (isEmailDuplicate(vo.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        // if (isCodeDuplicate(vo.getCode())) { // 주민등록번호 전체를 받는게 아니라서 중복 발생해도 상관 없음. 확인 되면 지울 것
        //     throw new IllegalArgumentException("이미 등록된 주민등록번호입니다.");
        // }
        if (!isValidPassword(vo.getPwd())) {
            throw new IllegalArgumentException("비밀번호는 영문 대문자, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.");
        }
        if (!isValidPhoneNumber(vo.getPhone())) {
            throw new IllegalArgumentException("전화번호는 -를 제외한 11자리여야 합니다.");
        }
    }

    // 제휴회사 회원 가입 시 입력값 검증
    private void validateCompanyInfo(MemberVO vo) {
        if (isUsernameDuplicate(vo.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        if (isEmailDuplicate(vo.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        if (isCodeDuplicate(vo.getCode())) {
            throw new IllegalArgumentException("이미 등록된 사업자등록번호입니다.");
        }
        if (!isValidPassword(vo.getPwd())) {
            throw new IllegalArgumentException("비밀번호는 영문 대문자, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.");
        }
        if (!isValidPhoneNumber(vo.getPhone())) {
            throw new IllegalArgumentException("전화번호는 -를 제외한 11자리여야 합니다.");
        }
        if (!isValidCompanyType(vo.getCompanyType())) {
            throw new IllegalArgumentException("기업군을 선택해야 합니다. (숙소, 교통, 기타 중 하나)");
        }
    }

    // 비밀번호 검증 (영문 대문자, 숫자, 특수문자 포함 8자리 이상)
    private boolean isValidPassword(String password) {
        String pattern = "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*+=-]).{8,}$";
        return password.matches(pattern);
    }

    // 전화번호 검증 (- 제외, 11자리)
    private boolean isValidPhoneNumber(String phone) {
        return phone.matches("^\\d{11}$");
    }

    // 기업군 선택 검증 (숙소, 교통, 기타 중 하나)
    private boolean isValidCompanyType(String companyType) {
        return companyType.equals("숙소") || companyType.equals("교통") || companyType.equals("기타");
    }

    
    public void changepwd(MemberVO vo) {
        memberRepository.save(vo);
    }

}
