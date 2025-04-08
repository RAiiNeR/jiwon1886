package kr.co.noorigun.suggestion.poll;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;

@Data
@Entity
@SequenceGenerator(name = "poll_option_seq_gen", sequenceName = "poll_option_seq", initialValue = 1, allocationSize = 1)
public class PollOption {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "poll_option_seq_gen")
    private Long id;

    private String text;

    @Column(nullable = false)
    private Long votes = 0L;

    @ManyToOne
    @JoinColumn(name = "poll_id") // 외래키 설정
    private Poll poll;

    @Column(name = "image_url")
    private String image_url;

}
