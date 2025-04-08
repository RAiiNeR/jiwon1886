package kr.co.noorigun.suggestion.poll;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class PollDTO {
    private Long id;
    private String title;
    private boolean allow_multiple;
    private boolean anonymous;
    private List<OptionDTO> options;
    private Long sbnum;
    private Date end_date;
    private Long max_participants;
}
