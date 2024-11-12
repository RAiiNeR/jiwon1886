import React, { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors, plugins } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js/dist';
import { useNavigate, useParams } from 'react-router-dom';
import { getChartName } from './DummyFile';
import './chart.css'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const data = {
    labels: ['처리', '처리중', '미처리', '보류', '폐기'],
    datasets: [
      {
        label: '민원현황',
        data: [12, 19, 3, 5, 3],
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
    responsive:true,
    plugins:{
        datalabels:{
        color:'#555',
        formatter:(value:number, context:any) => {
            console.log(value,context);
        }
    }
    }
  }

  interface ChartDataInter{
    num: number;
    dname:string;
    state:string;
    public:boolean;
  }

const ChartData: React.FC = () => {
    const [chartInfo, setChartInfo] = useState<ChartDataInter | null>(null);
    const { dname } = useParams<{dname:string}>();
    const navigate = useNavigate();

    useEffect(()=>{
        setChartInfo(getChartName(dname));
    },[dname]);

    if (!data) {
        return <div>데이터를 가져오는 중입니다...</div>
    }

    //돌아가기
  const handleClick = () => {
    navigate('/');
  }

  return (
    <div>
      <h2>도넛 차트 샘플</h2>
      <div className='chartbox'>
        <Doughnut data={data} options={options}></Doughnut>
      </div>
    </div>
  )
}

export default ChartData