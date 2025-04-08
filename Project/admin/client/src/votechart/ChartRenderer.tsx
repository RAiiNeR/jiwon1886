import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ChartRenderer = ({ statistics, category }: { statistics: any[]; category: string }) => {
  if (!statistics || statistics.length === 0) {
    return <p>데이터가 없습니다.</p>;
  }

  const options = {
    chart: { type: 'pie' },
    title: { text: `${category} 통계` },
    tooltip: { pointFormat: '{series.name}: <b>{point.y}표</b>' },
    series: [
      {
        name: category === '조회수 비례 투표율' ? '투표율 (%)' : '득표수',
        colorByPoint: true,
        data: statistics.map((stat) => ({
          name: `${stat.poll_title || '알 수 없음'} - ${stat.option_text || '옵션 없음'}`,
          y: category === '조회수 비례 투표율' ? stat.participation_rate : stat.vote_count,
        })),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ChartRenderer;
