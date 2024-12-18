import React, { useEffect, useState } from 'react'
import './css/chart.css'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Bar } from "react-chartjs-2";
import axios from 'axios';

// Chart.js의 필요한 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataInter {
  DNAME: string; // 부서명
  DEPTNO: number; // 부서번호
  RECEIPT: number; // 처리완료된 건수
  RECEIPTING: number; // 처리중인 건수
  DESIGNATEDEPT: number; // 지정된 부서
  ACCEPTING: number; // 접수 건수
  TOTAL: number; // 총 건수
}

// 차트 옵션 설정
export const options = {
  plugins: {
    title: {
      display: true,
      text: '각 부서 민원 통계 현황',
    },
  },
  responsive: true,
  scales: {
    x: { stacked: true }, // x축: 데이터 누적 표시
    y: { stacked: true }, // y축: 데이터 누적 표시
  },
};

// 차드 데이터 구조
export const cdata = {

  labels: [], // 부서명
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


//컨테이너 컴포넌트
const Container = styled.main`
max-width: 1200px; margin: auto; padding: 30px 0;
`


const CompleChart: React.FC = () => {
  const [chart, setChart] = useState<ChartDataInter[]>([]); // 차트 데이터

  useEffect(() => {
    const getChartData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/compleboard/chart`);
        const result = response.data; // API 응답 
        const labels: never[] = [];
        const receipt: never[] = [];
        const unreceipt: never[] = [];
        // 데이터를 차트 구조에 매핑
        result.map((item: ChartDataInter) => {
          labels.push(item.DNAME as never); // 부서명 추가
          receipt.push(item.RECEIPT as never); // 처리완료 건수 추가
          unreceipt.push((item.TOTAL - item.RECEIPT) as never); // 미처리 건수 추가
        });
        console.log(receipt);
        console.log(unreceipt);
        // 차트 데이터 설정
        cdata.labels = labels;
        cdata.datasets[0].data = unreceipt; // 미처리
        cdata.datasets[1].data = receipt; // 처리완료
        setChart(result);
      } catch (error) {
        console.log(error);
      }
    }
    getChartData(); // 차트 데이터 가져오기 호출
  }, []);

  if (!chart[0]) {
    return <div>로딩 중~</div>
  }

  return (
    <div className='compleChart'>
      <Container>
        <div>
          <div className='chart-container'>
            <div className='chart-box'>
              <Bar options={options} data={cdata} />
            </div>
            <div className='tb-container'>
              <h2>부서별 통계</h2>
              <table className='chart-tt'>
                <thead>
                  <tr>
                    <th className='dname'>부서</th>
                    <th className='in'>처리완료</th>
                    <th className='trash'>미처리</th>
                    <th className='total'>통합</th>
                    <th className='present'>자세히</th>
                  </tr>
                </thead>

                <tbody>
                  {chart.map((item, index) => (
                    <tr key={index}>
                      <td className='dname'>{item.DNAME}</td>
                      <td>{item.RECEIPT}</td>
                      <td>{item.TOTAL - item.RECEIPT}</td>
                      <td>{/*item.total*/}{item.TOTAL}</td>
                      <td className='present'>{
                        item.TOTAL > 0 &&
                        (<Link to={`/comple/chart/${item.DEPTNO}`}><button>통계</button></Link>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default CompleChart