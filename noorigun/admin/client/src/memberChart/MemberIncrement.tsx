import { Chart as ChartJS, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { incrementMemberData } from "./MemberData";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

incrementMemberData().then(e => {
    incrementData.datasets[0].data = [
        e.D_FIVE as never,
        e.D_FORE as never,
        e.D_THREE as never,
        e.D_TWO as never,
        e.D_ONE as never,
        e.D_DAY as never,
    ]
    
})

// Chart.js 데이터 설정
export const incrementData = {
    labels: ['5일전', '4일전', '3일전', '2일전', '1일전', '오늘'],
    datasets: [
      {
        label: '이용자 누적 그래프',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  
  export const incrementOptions = {
    responsive: true, // 반응형 차트(화면 크기에 맞게 차트 크기 자동 조절)
    plugins: {
      legend: {
        position: 'top' as const, // 범례 위치(왼쪽으로 설정)
        // top 외에도 'bottom', 'left', 'right' 등 범례 위치 변경 가능
      },
      title: {
        display: false, // 차트 제목 표시 여부
      },
    },
    // scales: {
    //   y: {
    //     beginAtZero: true, // Y축을 0부터 시작
    //     min: 0, // 최소값
    //     max: 50, // 최대값
    //     ticks: {
    //       stepSize: 5, // 눈금 간격 
    //     },
    //   },
    // },
  };