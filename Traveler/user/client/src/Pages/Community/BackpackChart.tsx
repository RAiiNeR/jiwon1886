import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, ChartData, ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS_Pie, ArcElement } from "chart.js";

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);
ChartJS_Pie.register(ArcElement, Tooltip, Legend);

// 여행 스타일 분석 (막대 그래프 + 꺾은선 그래프)
export const BackpackChart = () => {
  const data: ChartData<"bar" | "line"> = {
    labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
    datasets: [
      {
        type: "bar" as const,
        label: "솔로 여행 비율 (%)",
        data: [40, 42, 45, 50, 55, 60],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        type: "bar" as const,
        label: "그룹 여행 비율 (%)",
        data: [60, 58, 55, 50, 45, 40],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "월별 솔로 여행 증가",
        data: [30, 35, 40, 50, 55, 65],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.4,
        yAxisID: "y1",
      },
      {
        type: "line" as const,
        label: "월별 그룹 여행 감소",
        data: [70, 65, 60, 50, 45, 35],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "비율 (%)",
        },
        ticks: {
          beginAtZero: true,
        },
      } as any,
      y1: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "증가/감소 추이",
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          beginAtZero: true,
        },
      } as any,
    },
  };

  return (
    <div>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
};

// 감정 태그 분석 (파이 차트)
export const BackpackPieChart = () => {
  const data = {
    labels: ["행복", "설렘", "신남", "우울", "슬픔"],
    datasets: [
      {
        data: [80, 60, 55, 30, 25],
        backgroundColor: ["#FFB3B3", "#FFEB99", "#99CCFF", "#99FF99", "#D9A0D6"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div>
      <h4>감정 태그 분석 (파이 차트)</h4>
      <Pie data={data} />
    </div>
  );
};