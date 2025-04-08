package kr.co.user.hotel.service;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.user.hotel.entity.Hotel;
import kr.co.user.hotel.repository.HotelRepository;
import kr.co.user.hotel.vo.HotelVO;

// 2025-02-16 황보도연 추가
@Service
@Transactional
public class HotelService {
    @Autowired
    private HotelRepository hotelRepository;

    // 호텔 목록 조회 (리스트)
    public List<Hotel> getHotelList() {
        return hotelRepository.findAll();
    }

    // 호텔 목록 및 페이징 처리
    // 특정 게시글 상세조회
    public Hotel getHotelByNum(Long num) {
        Hotel hotel = hotelRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("상세보기 실패했습니다."));
        hotel.setHit(hotel.getHit() + 1); // 조회수 증가
        return hotelRepository.save(hotel);
    }

    // // 해당 호텔에 관련된 이미지 정보 조회
    // List<HotelImage> hotelImages = hotelImageRepository.findByHotel(hotel); // 호텔
    // 이미지를 가져옴
    // hotel.setHotelImages(hotelImages); // 호텔 엔티티에 이미지 정보를 설정 (필드 추가 필요)
    // return hotel;
    // }

    // 제목, 지역명 포함하는 게시글 페이징 조회
    public Page<Hotel> getHotelsWithPagination(String searchQuery, int page, int size) {
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        List<Hotel> entity = hotelRepository.findByNameOrLocationContainingOrderByNumDesc(searchQuery, startRow,
                endRow);
        int totalElements = hotelRepository.countByNameOrLocationContaining(searchQuery);
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }

    public Page<Hotel> getHotelsWithPaginationByNum(int page, int size, int num) {
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        List<Hotel> entity = hotelRepository.findByMemberumOrderByNumDesc(startRow,
                endRow, num);
        int totalElements = hotelRepository.countByMembernumContaining(num);
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }

    // 2025-02-27 전준영 추가

    // 게시글 생성
    public Hotel createHotel(Hotel vo) {
        return hotelRepository.save(vo); // 데이터베이스에 저장
    }

    // 게시글 수정
    public Hotel updateHotel(Long num, Hotel updateHotel) {
        Hotel existingHotel = hotelRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("수정할 호텔을 찾을 수 없습니다."));
        // 변경된 필드만 업데이트
        existingHotel.setName(updateHotel.getName());
        existingHotel.setContent(updateHotel.getContent());
        existingHotel.setLocation(updateHotel.getLocation());
        existingHotel.setThumbnail(updateHotel.getThumbnail());
        existingHotel.setImgNames(updateHotel.getImgNames());

        return hotelRepository.save(existingHotel);
    }

    // 삭제하는 부분
    public void delete(Long num) {
        Hotel hotel = hotelRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("삭제  실패했습니다."));
        hotelRepository.delete(hotel);
    }

}
