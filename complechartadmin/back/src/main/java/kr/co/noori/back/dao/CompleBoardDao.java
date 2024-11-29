package kr.co.noori.back.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import kr.co.noori.back.vo.CompleBoardVO;

@Mapper
public interface CompleBoardDao {
    //전체통계 보여주기
    List<Map<String,String>> list();

    //부서별 통계 보여주기
    //결과값이 부서 1개가 나와야하는데 그 이상의 값이 출력되기 때문에
    //여러개의 결과값을 받아 올 수 있도록 List<>를 추가한다
    List<CompleBoardVO> detail(Long deptno);
}
