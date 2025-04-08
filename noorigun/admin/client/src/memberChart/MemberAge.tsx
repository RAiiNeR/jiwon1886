import { memberData, MemberVo } from './MemberData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 연령대 분류 함수
const getAgeGroups = (data: MemberVo[]) => {
  const ageGroups = {
    teens: 0, // 10대
    twenties: 0, // 20대
    thirties: 0, // 30대
    forties: 0, // 40대
    fifties: 0, // 50대
    others: 0, // 기타
  };

  data.forEach((member) => {
    const birthYear = parseInt(member.ssn.slice(0, 2)); // 주민등록번호의 첫 2자리를 가져옵니다.
    const currentYear = new Date().getFullYear(); // 현재 연도
    const century = birthYear <= new Date().getFullYear() % 100 ? 2000 : 1900; // 00~99 기준으로 1900년대/2000년대 결정
    const fullBirthYear = century + birthYear; // 완전한 출생 연도 계산
    const age = currentYear - fullBirthYear; // 나이 계산

    // 나이에 따른 연령대 분류
    if (age >= 0 && age < 20) {
      ageGroups.teens++;
    } else if (age >= 20 && age < 30) {
      ageGroups.twenties++;
    } else if (age >= 30 && age < 40) {
      ageGroups.thirties++;
    } else if (age >= 40 && age < 50) {
      ageGroups.forties++;
    } else if (age >= 50 && age < 60) {
      ageGroups.fifties++;
    } else {
      ageGroups.others++;
    }
  });

  return ageGroups;
};

memberData().then(e => {
  // 연령대 데이터 계산
  const ageGroups = getAgeGroups(e)
  // console.log(ageData.datasets[0].data)
  ageData.datasets[0].data = [
    ageGroups.teens as never,
    ageGroups.twenties as never,
    ageGroups.thirties as never,
    ageGroups.forties as never,
    ageGroups.fifties as never,
    ageGroups.others as never,
  ]
  // console.log(ageData.datasets[0].data)
});

// Chart.js 데이터 설정
export const ageData = {
  labels: ['10대', '20대', '30대', '40대', '50대', '기타'],
  datasets: [
    {
      label: '연령대 분포',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
};

export const ageOptions = {
  responsive: true, // 반응형 차트(화면 크기에 맞게 차트 크기 자동 조절)
  plugins: {
    legend: {
      position: 'top' as const, // 범례 위치(왼쪽으로 설정)
      // top 외에도 'bottom', 'left', 'right' 등 범례 위치 변경 가능
    },
    title: {
      display: true, // 차트 제목 표시 여부
      text: '연령대 분포 차트',
    },
  },
  scales: {
    y: {
      beginAtZero: true, // Y축을 0부터 시작
      min: 0, // 최소값
      max: 50, // 최대값
      ticks: {
        stepSize: 5, // 눈금 간격 
      },
    },
  },
};