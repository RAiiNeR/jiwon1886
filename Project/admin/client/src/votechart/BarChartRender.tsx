import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarChartRenderer = ({ statistics }: { statistics: any[] }) => {
  if (!statistics || statistics.length === 0) {
    return <p>데이터가 없습니다.</p>;
  }

  const options = {
    chart: {
      type: 'bar',
      height: Math.max(statistics.length * 40, 400), // 데이터 길이에 따라 높이 조정, 최소 400px
    },
    title: {
      text: '득표수 상위 20개 통계',
    },
    xAxis: {
      categories: statistics.map((stat) => stat.poll_title || '알 수 없음'), // 투표 제목
      title: {
        text: '투표 제목',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '득표 수',
        align: 'high',
      },
    },
    tooltip: {
      valueSuffix: '표', // 툴팁에 "표" 추가
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true, // 데이터 레이블 활성화
        },
      },
    },
    series: [
      {
        name: '득표 수',
        data: statistics.map((stat) => stat.vote_count || 0), // 득표 수
      },
    ],
  };

  return (
    <div className="chart-container">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChartRenderer;
