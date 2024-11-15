import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, plugins } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js/dist';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { data, getChartName } from './DummyFile';
import './chart.css'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const cdata = {
  labels: ['처리', '처리중', '미처리', '보류', '폐기'],
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
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
};
const options = {
  responsive: true,
  plugins: {
    datalabels: {
      color: '#555',
      formatter: (value: number, context: any) => {
        console.log(value, context);
      }
    }
  }
}

interface ChartDataInter {
  dname: string;
  state: number;
  receipt: number;
  receipting: number;
  unreceipt: number;
  hold: number;
  throw: number;
  total: number;
}

const ChartData: React.FC = () => {
  const [chartInfo, setChartInfo] = useState<any>();
  const { dname } = useParams<{ dname: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    let cd = {
      receipt: 0,
      receipting: 0,
      unreceipt: 0,
      hold: 0,
      throw: 0
    }
    data.filter((obj) => obj.dname === dname).map((obj) => {
      if (obj.state === '처리완료') {
        cd.receipt++;
      } else if (obj.state === '처리중') {
        cd.receipting++;
      } else if (obj.state === '미처리') {
        cd.unreceipt++;
      } else if (obj.state === '보류') {
        cd.hold++;
      } else {
        cd.throw++;
      }
    });

    cdata.datasets[0].data = [cd.receipt as never, cd.receipting as never,
    cd.unreceipt as never, cd.hold as never, cd.throw as never];
  }, [])

  if (!data) {
    return <div>데이터를 가져오는 중입니다...</div>
  }

  //돌아가기
  const handleClick = () => {
    navigate('/chartAdmin');
  }

  return (
    <div>
      <div className='inner'>
        <div className='left'>
          <div className='left-box'>
            <h2>실시간 민원신청 건수</h2>
            <strong>?<span>건</span></strong>
          </div>
        </div>

        <div className='right'>
          <div className='text'>
            <h2>민원신청 건수 현황</h2>
            <p>안녕하십니까, 여기는 {dname}의 민원신청 건수입니다.</p>
            <div className='img-box'>
            <img src='/images/img1.jpg' alt='img1'/>
          </div>
          </div>
          <div className='chartbox'>
            <Doughnut data={cdata} options={options}></Doughnut>
          </div>
          
        </div>
      </div>

      <div className='btn-box'>
        <button onClick={handleClick}><Link to='/chartAdmin' className='li-back'>뒤로가기</Link></button>
      </div>
    </div>

  )
}

export default ChartData