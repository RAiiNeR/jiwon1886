package kr.co.user.hotel.vo;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomVO {
    private Long num;
    private Long hotelNum;
    private String name;
    private int price;
    private int maxPerson;
    private int numRooms;
    private int numPerRooms;
    private String content;
    private MultipartFile thumbnail;
    private List<MultipartFile> images;
}