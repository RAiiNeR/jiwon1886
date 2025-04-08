import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { memberData, MemberVo } from './MemberData';

ChartJS.register(ArcElement, Tooltip, Legend);

// 성별 분류 함수
const getGenderCount = (data: MemberVo[]) => {
  let maleCount = 0;
  let femaleCount = 0;

  data.forEach((member) => {
    const ssnParts = member.ssn.split('-'); // '-'로 주민등록번호 분리
    const ssnLastDigit = ssnParts[1]?.[0]; // 분리된 뒷자리의 첫 번째 값

    if (ssnLastDigit) {
      if (parseInt(ssnLastDigit) % 2 === 1) {
        maleCount++; // 홀수는 남성
      } else {
        femaleCount++; // 짝수는 여성
      }
    }
  });

  return { maleCount, femaleCount };
};


memberData().then(e => {
  const { maleCount, femaleCount } = getGenderCount(e)
  genderData.datasets[0].data = [maleCount as never, femaleCount as never]
});

// Chart.js 데이터 설정
export const genderData = {
  labels: ['남성', '여성'],
  datasets: [
    {
      label: '성별 분포',
      data: [],
      backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'], // 남성: 파란색, 여성: 빨간색
      borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
      borderWidth: 1,
    },
  ],
};

export const genderOptions = {
  responsive: true, // 반응형 차트(화면 크기에 맞게 차트 크기 자동 조절)
};