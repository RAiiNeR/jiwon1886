import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './css/VoteModal.css';

interface PollOption { // 투표 옵션
    id: number;
    text: string;
    votes: number; // 해당 옵션 투표 수
    image_url?: string; // 옵션에 포함된 이미지URL(선택)
}

interface PollProps {
    poll: {
        title: string;
        allow_multiple: boolean; // 다중선택 여부
        options: PollOption[]; // 투표옵션 배열
        max_participants?: number; // 최대 참여자 수(선택)
    };
    onVote: (selectedOptionIds: number[]) => void;  // 투표 시 호출되는 함수
    pollExpired: boolean; // 투표 종료 여부
}

const PollSection: React.FC<PollProps> = ({ poll, onVote, pollExpired }) => {
    const [selectedOptions, setSelectedOptions] = React.useState<number[]>([]); // 선택된 항목 상태

    const handleOptionChange = (optionId: number) => {
        setSelectedOptions((prev) => {
            if (poll.allow_multiple) {
                // 다중 선택 처리
                if (prev.includes(optionId)) {
                    // 이미 선택된 경우 해제
                    return prev.filter((id) => id !== optionId);
                } else {
                    // 새로 선택된 경우 추가
                    return [...prev, optionId];
                }
            } else {
                // 단일 선택 처리 (같은 항목 클릭 시 해제)
                return prev.includes(optionId) ? [] : [optionId];
            }
        });
    };


    const handleVote = () => { // 투표하기 버튼 클릭시
        if (pollExpired) {
            alert('투표가 종료되었습니다.');
            return;

        }
        // 최대 참여자 수 검사
        const currentParticipants = poll.options.reduce((sum, option) => sum + option.votes, 0);
        if (poll.max_participants != null && currentParticipants >= poll.max_participants) {
            alert('참여자 수가 초과되어 투표할 수 없습니다.');
            return;
        }
        // 선택 항목이 없을 경우
        if (selectedOptions.length === 0) {
            alert('투표할 항목을 선택하세요!');
            return;
        }
        // 투표가 완료되었을 때 onVote 콜백 함수 호출
        onVote(selectedOptions);
    };
    // 총 투표수 계산
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    // 차트 설정 옵션
    const chartOptions = {
        chart: { type: 'bar' },
        title: { text: poll.title },
        xAxis: {
            categories: poll.options.map((option) => option.text), // X축에 옵션 이름 표시
            title: { text: null },
        },
        yAxis: {
            min: 0,
            title: { text: '투표 수' }, // Y축 제목
        },
        series: [
            {
                name: '투표수', // 데이터 이름
                data: poll.options.map((option) => option.votes), // 각 옵션의 투표 수 데이터
            },
        ],
        plotOptions: {
            bar: {
                dataLabels: { enabled: true }, // 막대에 데이터 값 표시
            },
        },
    };

    return (
        <div className="poll-section">
            <h4>
                {poll.title}{' '}
                {pollExpired && <span style={{ fontSize: '0.8em', color: 'gray' }}>(종료된 투표입니다)</span>}
            </h4>
            {/* 투표 옵션 및 결과 표시 */}
            <ul className="poll-results">
                {poll.options.map((option) => {
                    const percentage = totalVotes
                        ? ((option.votes / totalVotes) * 100).toFixed(2)
                        : '0';

                    return (
                        <li key={option.id} className="poll-result-item">
                            <label>
                                <input
                                    type={poll.allow_multiple ? "checkbox" : "checkbox"} // allow_multiple에 따라 동적으로 타입 설정
                                    name='pollOption' // 옵션 그룹화
                                    value={option.id}
                                    checked={selectedOptions.includes(option.id)}
                                    onChange={() => handleOptionChange(option.id)}
                                    disabled={pollExpired} // 투표 종료 시 비활성화
                                />
                            </label>
                            <div className="result-item-content">
                                <div className="result-item-text">
                                    {/* 옵션 텍스트 및 투표 수, 비율 */}
                                    {option.text} ({option.votes}표, {percentage}%)
                                </div>
                                {option.image_url && (
                                    // 옵션에 이미지가 있으면 표시
                                    <img
                                        src={`${process.env.REACT_APP_BACK_IMG_URL}/${option.image_url}`}
                                        alt={option.text}
                                        className="result-item-image"
                                    />
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
            {!pollExpired && (
                <button onClick={handleVote} disabled={selectedOptions.length === 0} className='voteup'>
                    투표하기
                </button>
            )}
            {/* 투표 결과 차트 */}
            <div className="chart-container" style={{ width: '100%', height: '400px' }}>
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </div>
        </div>
    );
};

export default PollSection;