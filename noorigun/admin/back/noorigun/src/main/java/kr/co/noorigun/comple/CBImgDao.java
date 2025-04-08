package kr.co.noorigun.comple;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CBImgDao {
    void deleteCBImgByBoardNum(Long cbnum);// 특정 게시글에 첨부된 이미지 삭제
}
