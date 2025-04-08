package kr.co.noorigun.program;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class ProgramService {

    @Autowired
    private ProgramRepository programRepository;

    // 프로그램 신청 목록 조회
    public List<Program> getallProgram() {

        return programRepository.findAllByOrderByNumDesc();
    }

    // 백 추가 4: (페이징 처리와 관련된)
    public Page<Program> getProgramListWithPagination(String title, int page, int size) {
        // 페이지 번호와 크기를 기준으로 시작행과 끝 행 번호를 계산
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        System.out.println("startRow:" + startRow + ":Page" + page);
        // 페이징된 쿼리의 결과를 받은 리스트
        List<Program> program = programRepository.findByContentContainingOrderByNumDesc(title, startRow, endRow);
        // 이거는 토탈 값: -title 검색 포함
        int totalElements = programRepository.countByContentContaining(title);
        return new PageImpl<>(program, PageRequest.of(page - 1, size), totalElements);
    }

    // 프로그램 추가하기
    public Program createProgram(ProgramVO vo) {
        Program program = new Program();

        program.setTitle(vo.getTitle());
        program.setAge(vo.getAge());
        program.setContent(vo.getContent());
        program.setPlace(vo.getPlace());
        program.setCategory(vo.getCategory());
        program.setTeacher(vo.getTeacher());
        program.setEducation(vo.getEducation());
        program.setStudent(vo.getStudent());
        program.setStartperiod(new Date());
        program.setEndperiod(new Date());
        program.setStartdeadline(new Date());
        program.setEnddeadline(new Date());
        program.setStarttime(vo.getStarttime());
        program.setEndtime(vo.getEndtime());
        program.setHit(0L);
        program.setPdate(vo.getPdate());

        // 사진 업로드 위한
        program.setImg(vo.getImg());
        return programRepository.save(program);
    }

    // 디테일
    public Program getProgramByNum(Long num) {
        Program program = programRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("상세 보기 실패했습니다."));
        program.setHit(program.getHit() + 1);
        programRepository.save(program);
        return program;
    }

    // 최신 3개의 프로그램을 가져오는 서비스 메서드
    public List<Program> getLatestPrograms() {
        return programRepository.findTop3Programs(); // 최신 3개 프로그램을 가져옵니다.
    }

    // 강좌 신청 시 학생 수 감소
    @Transactional
    public String enrollProgram(Long num) {
        // 강좌 찾기
        Program program = programRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("해당 강좌를 찾을 수 없습니다."));

        // 수강생이 존재할 경우 수강생 수 감소
        if (program.getStudent() > 0) {
            program.setStudent(program.getStudent() - 1); // 수강생 수 감소
            programRepository.save(program); // 변경 사항 저장
            return "강좌 신청 완료";
        } else {
            return "수강생 정원이 모두 찼습니다.";
        }
    }
}
