package kr.co.user.tour;

import lombok.Getter;

@Getter
public class LocationTourCountDTO {
    private String location;
    private Long count;

    public LocationTourCountDTO(String location, Long count){
        this.location = location;
        this.count = count;
    }
}    

