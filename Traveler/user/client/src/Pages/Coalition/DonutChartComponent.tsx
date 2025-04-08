import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// Chart.js 모듈 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["가성비", "디자인", "조식", "주변시설 인접도", "내부시설", "룸서비스"],
  datasets: [
    {
      label: "호텔 인기 이유",
      data: [25, 15, 20, 18, 12, 10], // 더미 데이터
      backgroundColor: [
        "rgba(255, 99, 132, 0.5)", // 가성비
        "rgba(54, 162, 235, 0.5)", // 디자인
        "rgba(255, 206, 86, 0.5)", // 조식
        "rgba(75, 192, 192, 0.5)", // 주변시설 인접도
        "rgba(153, 102, 255, 0.5)", // 내부시설
        "rgba(255, 159, 64, 0.5)" // 룸서비스
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ],
      borderWidth: 1
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const
    },
    title: {
      display: true,
      text: "호텔 인기 이유"
    }
  }
};

const DonutChartComponent: React.FC = () => {
  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChartComponent;
