package kr.co.admin.userList;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class FriendVO {
    private Long friendId;
    private boolean areWeFriend;
    private int toUserId;
    private String toUserName;
    private Date requestDate;
}
