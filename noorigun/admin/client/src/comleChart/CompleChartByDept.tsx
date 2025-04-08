import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


// Chart.js 데이터 설정
// Chart.js에 플러그인 등록
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// 차트 데이터 기본 구조
export const compleByDeptData = {
  labels: ['처리완료', '처리중', '담장부서 지정'],
  datasets: [
    {
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)', //배열의 첫번째. 즉 매우 만족의 배경색
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [ // 테두리 색상
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1, // 두께
    },
  ],
};

export const compleByDeptOptions = {
  responsive: true, // 반응형
  plugins: {
    datalabels: { // 데이터 라벨 플러그인 설정
      color: '#555',
    }
  }
}