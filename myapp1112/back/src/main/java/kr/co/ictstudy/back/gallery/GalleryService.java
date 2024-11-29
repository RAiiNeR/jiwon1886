package kr.co.ictstudy.back.gallery;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class GalleryService {
    @Autowired
    private GalleryRepository galleryRepository;

    // public List<Gallery> getAllGalleries() {
    // return galleryRepository.findAllByOrderByIdDesc();
    // }
    public Page<Gallery> getAllGalleries(String title, int page, int size) {
        // 페이지 번호와 크기를 기준으로 시작 행과 끝 행 번호를 계산
        int startRow = (page - 1) * size + 1;
        int endRow = page * size;
        System.out.println("startRow:" + startRow + ": Page" + page);
        // 페이징된 쿼리의 결과를 받은 리스트
        List<Gallery> galleries = galleryRepository.findByTitleContainingOrderByIdDesc(title, startRow, endRow);
        // 이건 토탈 값 - title 검색 포함
        int totalElements = galleryRepository.countByTitleContaining(title);

        return new PageImpl<>(galleries, PageRequest.of(page - 1, size), totalElements);
    }

    public Optional<Gallery> getGalleryById(Long id) {
        return galleryRepository.findById(id);
    }

    public Gallery createGallery(GalleryVO galleryVO) throws IOException {
        Gallery gallery = new Gallery();
        gallery.setWriter(galleryVO.getWriter());
        gallery.setTitle(galleryVO.getTitle());
        gallery.setDescription(galleryVO.getDescription());
        gallery.setGdate(new Date());
        gallery.setImageNames(galleryVO.getImgNames());
        return galleryRepository.save(gallery);
    }
}
