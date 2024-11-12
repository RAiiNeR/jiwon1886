import React, { useEffect, useState, PureComponent } from 'react'
import './chart.css'
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {data, getChartName} from './DummyFile';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataInter {
    dname: string;
    receipt: number;
    accept: number;
    throw: number;
    total: number;
    state: string;
}

export const options = {
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Bar Chart - Stacked',
    },
  },
  responsive: true,
  scales: {
    x: { stacked: true },
    y: { stacked: true },
  },
};

const labels = ['감사담당관','기획예산담당관', "홍보담당관", "안전복지정책관", "민원토지관", "일자리 경제과", "정원산림과"];

export const cdata = {
  labels,
  datasets:[
    {
      label:'처리완료',
      backgroundColor: 'rgb(255, 99, 132)',
      data:[],
      borderColor: 'red',
      borderWidth: 2,
    },
    {
      label:'미처리',
      backgroundColor: 'rgb(75, 192, 192)',
      data:[],
      borderColor: 'red',
      borderWidth: 2,
    },
  ]

}


const Chart: React.FC = () => {
    const [chart, setChart] = useState<ChartDataInter[]>([]);
    const [chartData, setChartData] = useState(null);
    const [count, setCount] = useState(1);

    const arr1 = new Array<any>(2);
    arr1[0] = 0
    arr1[1] = 0

    const arr2 = new Array(2);
    arr2[0] = 0
    arr2[1] = 0

    const arr3 = new Array(2);
    arr3[0] = 0
    arr3[1] = 0

    const arr4 = new Array(2);
    arr4[0] = 0
    arr4[1] = 0

    const arr5 = new Array(2);
    arr5[0] = 0
    arr5[1] = 0

    const arr6 = new Array(2);
    arr6[0] = 0
    arr6[1] = 0

    useEffect(()=>{ //데이터를 가공하는 방법. 가져온 데이터의 길이를 for문으로 계산해서 총합을 각 구하는 것
      for (let i = 0; i < chart.length; i++) {
        if(chart[i].dname === '민원토지관'){
          if(chart[i].state === '처리완료'){
            arr1[0]++;
          } else {
            arr1[1]++;
          }
        } else if(chart[i].dname === '감사담당관') {
          if(chart[i].state === '처리완료'){
            arr2[0]++;
          } else {
            arr2[1]++;
          }
        } else if(chart[i].dname === '기획예산담당관') {
          if(chart[i].state === '처리완료'){
            arr3[0]++;
          } else {
            arr3[1]++;
          }
        } else if(chart[i].dname === '안전복지정책관') {
          if(chart[i].state === '처리완료'){
            arr4[0]++;
          } else {
            arr4[1]++;
          }
        } else if(chart[i].dname === '홍보담당관') {
          if(chart[i].state === '처리완료'){
            arr5[0]++;
          } else {
            arr5[1]++;
          }
        } else if(chart[i].dname === '일자리 경제과') {
          if(chart[i].state === '처리완료'){
            arr5[0]++;
          } else {
            arr5[1]++;
          }
        }
      }
cdata.datasets[0].data = [arr1[0], arr2[0], arr3[0], arr4[0], arr5[0], arr6[0]];
    cdata.datasets[1].data = [arr1[1], arr2[1], arr3[1], arr4[1], arr5[1], arr6[1]];
    },[chart])

    useEffect(() => {
        setChart([...chart, { dname: `부서${count}`, receipt: count, accept: count, throw: count, total: count, state:`상태` }])
        if (count < 7) setCount(count + 1)
    }, [count])

    useEffect(() => {
        setCount(count + 1)
    }, []);

    //컨테이너 컴포넌트
    const Container = styled.main`
      max-width: 1200px; margin: auto; padding: 30px 0;
    `


    return (
        <Container>
          
            <div>
                <div className='chart-container'>
                    <div className='chart-box'>
                      <Bar options={options} data={cdata} />
                    </div>
                    <div className='tb-container'>
                        <h2>부서별 통계</h2>
                        <p>감사담당관 / 기획예산담당관 / 홍보담당관 / 안전복지정책관 / 민원토지관 / 일자리 경제과 / 정원산림관리관</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>부서</th>
                                    <th>접수</th>
                                    <th>채택</th>
                                    <th>폐기</th>
                                    <th>계</th>
                                    <th>통합</th>
                                </tr>
                            </thead>

                            <tbody>
                                {chart.map((item, index) => (
                                    <tr key={index}>
                                        <th>{item.dname}</th>
                                        <td>{item.receipt}</td>
                                        <td>{item.accept}</td>
                                        <td>{item.throw}</td>
                                        <td>{item.total}</td>
                                        <td><a href={`/chart/${item.dname}`}>현황보기</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </Container>

    )
}

export default Chart