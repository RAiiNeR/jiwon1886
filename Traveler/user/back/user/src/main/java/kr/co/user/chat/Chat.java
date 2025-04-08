package kr.co.user.chat;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Embeddable
public class Chat {
    @Column(name = "LOGFILE", columnDefinition = "varchar2(150)", nullable = false)
    private String logfile;

    @Column(name = "TYPE", columnDefinition = "number(1)", nullable = false)
    private Long type;

    @Column(name = "CDATE", columnDefinition = "date default sysdate", nullable = false)
    private Date cdate; 
}
