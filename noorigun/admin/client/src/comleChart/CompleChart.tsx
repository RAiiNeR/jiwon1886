import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { compleChart } from './CompleData';

// Chart.js의 필요한 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

compleChart().then(e => {
  compleChartData.datasets[0].data = [
    (e[0].TOTAL - e[0].RECEIPT) as never,
    (e[1].TOTAL - e[1].RECEIPT) as never,
    (e[2].TOTAL - e[2].RECEIPT) as never,
    (e[3].TOTAL - e[3].RECEIPT) as never,
    (e[4].TOTAL - e[4].RECEIPT) as never,
    (e[5].TOTAL - e[5].RECEIPT) as never,
    (e[6].TOTAL - e[6].RECEIPT) as never,
  ]
  compleChartData.datasets[1].data = [
    e[0].RECEIPT as never,
    e[1].RECEIPT as never,
    e[2].RECEIPT as never,
    e[3].RECEIPT as never,
    e[4].RECEIPT as never,
    e[5].RECEIPT as never,
    e[6].RECEIPT as never,
  ]
});

// Chart.js 데이터 설정
// 차트 옵션 설정
export const compleChartOptions = {
  plugins: {
    title: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: { stacked: true }, // x축: 데이터 누적 표시
    y: { stacked: true }, // y축: 데이터 누적 표시
  },
};

// 차드 데이터 구조
export const compleChartData = {

  labels: ['감사담당관','기획예산담당관','홍보담당관','안전복지정책관','민원토지관','일자리경제관','정원산림관'], // 부서명
  datasets: [
    {
      label: '미처리',
      backgroundColor: '#53a7d8',
      data: [], // 미처리 데이터
      borderColor: '#2d82b5',
      borderWidth: 2,
    },
    {
      label: '처리완료',
      backgroundColor: '#bce6ff',
      data: [], // 처리완료 데이터
      borderColor: '#88cdf6',
      borderWidth: 2,
    }
  ]

}