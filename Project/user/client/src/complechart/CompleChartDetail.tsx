import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useNavigate } from 'react-router-dom';
import './css/chart.css'
import axios from 'axios';

// Chart.js에 플러그인 등록
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// 차트 데이터 기본 구조
export const cdata = {
  labels: ['처리완료', '처리중', '담장부서 지정', '접수중'],
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

const options = {
  responsive: true, // 반응형
  plugins: {
    datalabels: { // 데이터 라벨 플러그인 설정
      color: '#555',
    }
  }
}

interface ChartData {
  DNAME: string; // 부서이름
  RECEIPT: number; // 처리완료 건수
  RECEIPTING: number; // 처리중 건수  
  DESIGNATEDEPT: number; // 담당부서 지정 건수
  ACCEPTING: number; // 접수중 건수
  TOTAL: number; // 총 건수
}

const CompleChartDetail: React.FC<{ deptno: string }> = ({ deptno }) => {
  const [chartData, setChartData] = useState<ChartData>(); // API 데이터 저장
  const navigate = useNavigate();

  useEffect(() => {
    const getChartData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/compleboard/chart/` + deptno)
        cdata.datasets[0].data = [
          response.data.RECEIPT as never, // 처리 완료 건수
          response.data.RECEIPTING as never, // 처리 중 건수
          response.data.DESIGNATEDEPT as never, // 담당 부서 지정 건수
          response.data.ACCEPTING as never]; // 접수 중 건수
        console.log(response.data)
        setChartData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getChartData();
  }, []);


  if (!chartData) {
    return <div>데이터가 없습니다.</div>
  }

  //돌아가기
  const handleClick = () => {
    navigate(-1); // 이전 페이지 이동
  }

  return (
    <div className='compleChart'>
      <div className='inner'>
        <div className='left'>
          <div className='left-box'>
            <h2>실시간 민원신청 건수</h2>
            <strong>{chartData?.TOTAL}<span>건</span></strong> {/* 총 건수 출력 */}
          </div>
        </div>

        <div className='right'>
          <div className='text'>
            <h2>민원신청 건수 현황</h2>
            <p>안녕하십니까, 여기는 {chartData?.DNAME}의 민원신청 건수입니다.</p> {/* 부서명 출력 */}
            <div className='img-box'>
              <img src='/images/complechart/img1.jpg' alt='img1' />
            </div>
          </div>
          <div className='chartbox'>
            {
              <Doughnut data={cdata} options={options} /> // 도넛차트 랜더링
            }
          </div>

        </div>
      </div>

      <div className='btn-box'>
        <button onClick={handleClick} className='li-back'>뒤로가기</button>
      </div>
    </div>
  )
}

export default CompleChartDetail