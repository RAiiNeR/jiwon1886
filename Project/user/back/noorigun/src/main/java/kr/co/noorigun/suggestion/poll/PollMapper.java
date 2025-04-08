package kr.co.noorigun.suggestion.poll;

import java.util.stream.Collectors;

public class PollMapper {
    // Poll 엔티티를 PollDTO로 변환
    public static PollDTO toPollDTO(Poll poll) {
        if (poll == null) {
            return null; // null 처리
        }

        PollDTO pollDTO = new PollDTO();
        pollDTO.setId(poll.getId());
        pollDTO.setTitle(poll.getTitle());
        pollDTO.setAllow_multiple(poll.isAllow_multiple());
        pollDTO.setAnonymous(poll.isAnonymous());
        pollDTO.setEnd_date(poll.getEnd_date());
        pollDTO.setMax_participants(poll.getMax_participants());
        pollDTO.setOptions(
            poll.getOptions().stream()
                .map(PollMapper::toOptionDTO) // 각 Option을 OptionDTO로 변환
                .collect(Collectors.toList())
        );

        return pollDTO;
    }

    // PollOption 엔티티를 OptionDTO로 변환
    public static OptionDTO toOptionDTO(PollOption option) {
        OptionDTO optionDTO = new OptionDTO();
        optionDTO.setId(option.getId());
        optionDTO.setText(option.getText());
        optionDTO.setVotes(option.getVotes()); // votes 필드 매핑
        optionDTO.setImage_url(option.getImage_url());
        return optionDTO;
    }
}
