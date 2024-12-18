package kr.co.noorigun.comple;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.noorigun.vo.CompleBoardVO;

@Mapper
public interface CompleBoardDao {

    List<CompleBoardVO> getCompleBoardList(Map<String, Object> params);

    int getCompleBoardTotalCount(Map<String, Object> params);

    CompleBoardVO detail(Long num);

    void deleteCompleBoard(Long num);

    // 게시글 상태 및 부서 수정
    int updateCompleBoardStateAndDeptno(Long num, String state, Long deptno);

    int getCompleBoardCount();

    // 전체통계 보여주기
    List<Map<String, String>> chartData();

    // 부서별 통계 보여주기
    // 결과값이 부서 1개가 나와야하는데 그 이상의 값이 출력되기 때문에
    // 여러개의 결과값을 받아 올 수 있도록 List<>를 추가한다
    Map<String, String> detailChart(Long deptno);
}
