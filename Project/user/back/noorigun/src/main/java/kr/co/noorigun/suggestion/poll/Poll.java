package kr.co.noorigun.suggestion.poll;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import kr.co.noorigun.suggestion.Suggestion;
import lombok.Data;

@Data
@Entity
@SequenceGenerator(name = "poll_seq_gen", sequenceName = "poll_seq", initialValue = 1, allocationSize = 1)
public class Poll {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "poll_seq_gen")
    private Long id;

    private String title;

    private boolean allow_multiple;
    private boolean anonymous; 

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true ,fetch = FetchType.LAZY)
    private List<PollOption> options;

    @ManyToOne
    @JoinColumn(name = "sbnum",nullable = false)
    private Suggestion suggestion;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private Date end_date;

    private Long max_participants;
    
}
