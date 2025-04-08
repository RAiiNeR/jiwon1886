import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './css/PollSection.css';

interface PollOption {
    id: number;
    text: string;
    votes: number;
    image_url?: string;
}

interface Poll {
    title: string;
    options: PollOption[];
    allow_multiple: boolean;
    max_participants?: number;
}

interface PollSectionProps {
    poll: Poll;
    onVote: (selectedOptionIds: number[]) => void;
    pollExpired: boolean;
}

const PollSection: React.FC<PollSectionProps> = ({ poll, onVote, pollExpired }) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

    const handleOptionChange = (optionId: number) => {
        setSelectedOptions((prev) => {
            if (poll.allow_multiple) {
                return prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId];
            } else {
                return prev.includes(optionId) ? [] : [optionId];
            }
        });
    };

    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    const chartOptions = {
        chart: { type: 'bar' },
        title: { text: poll.title },
        xAxis: {
            categories: poll.options.map((option) => option.text),
        },
        yAxis: {
            min: 0,
            title: { text: '투표 수' },
        },
        series: [
            {
                name: '투표수',
                data: poll.options.map((option) => option.votes),
            },
        ],
        plotOptions: {
            bar: {
                dataLabels: { enabled: true },
            },
        },
    };

    return (
        <div className="poll-section">
            <h4>
                {poll.title}
                {pollExpired && <span style={{ fontSize: '0.8em', color: 'gray' }}>(종료된 투표입니다)</span>}
            </h4>
            <ul className="poll-options">
                {poll.options.map((option) => {
                    const percentage = totalVotes ? ((option.votes / totalVotes) * 100).toFixed(2) : '0';
                    return (
                        <li key={option.id} className="poll-option">
                            <label>
                                <input
                                    type={poll.allow_multiple ? 'checkbox' : 'radio'}
                                    value={option.id}
                                    checked={selectedOptions.includes(option.id)}
                                    onChange={() => handleOptionChange(option.id)}
                                    disabled={pollExpired}
                                />
                                {option.text} ({option.votes}표, {percentage}%)
                            </label>
                            {option.image_url && (
                                <div className="poll-option-image">
                                    <img
                                        src={`${process.env.REACT_APP_BACK_IMG_URL}/${option.image_url}`}
                                        alt={option.text}
                                        className="poll-image"
                                    />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
           
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};

export default PollSection;
