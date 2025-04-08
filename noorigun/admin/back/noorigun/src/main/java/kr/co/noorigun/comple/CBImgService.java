package kr.co.noorigun.comple;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CBImgService {
    @Autowired
    private CBImgDao cbImgDao;

    // 특정 게시글의 이미지 삭제
    public void deleteCBImgs(Long cbnum) {
        cbImgDao.deleteCBImgByBoardNum(cbnum);
    }

}
