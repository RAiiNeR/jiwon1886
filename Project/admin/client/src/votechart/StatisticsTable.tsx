import React, { useState } from 'react';
import './css/PollStatistics.css';
import { Link } from 'react-router-dom';

const formatKey = (key: string, category: string) => {
  
  const headers: Record<string, string> = {
    option_text: '항목',
    vote_count: category === '조회수 비례 투표율' ? '투표율 (%)' : '득표 수',
    poll_title: '투표 제목',
    end_date: '종료 날짜',
    allow_multiple: '복수 선택 여부',
    sbnum: '글 번호',
  };
  return headers[key] || key;
};

const formatValue = (key: string, value: any, stat: Record<string, any>) => {
  if (key === 'poll_title' && value) {
    return <Link to={`/suggest/${stat.sbnum}`}>{value}</Link>; // num을 기반으로 URL 생성
  }
  if (key === 'end_date' && value) {
    return new Date(value).toLocaleDateString();
  }
  if (key === 'allow_multiple') {
    return (
      <span style={{ color: value ? 'blue' : 'red', fontWeight: 'bold' }}>
        {value ? '가능' : '불가능'}
      </span>
    );
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value !== null && value !== undefined ? String(value) : '-';
};
const StatisticsTable = ({
  statistics,
  category,
}: {
  statistics: Record<string, any>[]; // 데이터 타입 정의
  category: string;
}) => {
  if (statistics.length === 0) return <p>데이터가 없습니다.</p>;

  const sortedStatistics = [...statistics].sort((a, b) => {
    if (category === '조회수 비례 투표율') {
      return b.vote_count - a.vote_count;
    }
    return b.vote_count - a.vote_count;
  });

  return (
    <table className="poll-statistics-table">
      <thead>
      <tr>
          {Object.keys(sortedStatistics[0])
            .filter((key) => key !== 'participation_rate') // 'participation_rate' 열 제외
            .filter((key) => key !== 'option_text' || sortedStatistics.some((stat) => stat[key] !== '옵션 없음'))
            .map((key) => (
              <th key={key}>{formatKey(key, category)}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {sortedStatistics.map((stat, index) => (
          <tr key={index}>
            {Object.entries(stat)
              .filter(([key]) => key !== 'participation_rate') // 'participation_rate' 열 제외
              .filter(([key, value]) => key !== 'option_text' || value !== '옵션 없음')
              .map(([key, value], idx) => (
                <td key={idx}>{formatValue(key, value, stat)}</td> // stat을 전달하여 num 값 활용
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StatisticsTable;
