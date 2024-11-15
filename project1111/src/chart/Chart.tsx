import React, { useEffect, useState, PureComponent } from 'react'
import './chart.css'
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { data, getChartName } from './DummyFile';
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
  throw: number;
}

export const options = {
  plugins: {
    title: {
      display: true,
      text: '각 부서 민원 통계 현황',
    },
  },
  responsive: true,
  scales: {
    x: { stacked: true },
    y: { stacked: true },
  },
};

const labels = ["민원토지관", '감사담당관', '기획예산담당관', "안전복지정책관",  "홍보담당관", "일자리 경제과", "정원산림과"];

export const cdata = {

  labels,
  datasets: [
    {
      label: '미처리',
      backgroundColor: '#53a7d8',
      data: [],
      borderColor: '#2d82b5',
      borderWidth: 2,
    },
    {
      label: '처리완료',
      backgroundColor: '#bce6ff',
      data: [],
      borderColor: '#88cdf6',
      borderWidth: 2,
    }
  ]

}

const Chart: React.FC = () => {
  const [chart, setChart] = useState<ChartDataInter[]>([]);
  const [chartData, setChartData] = useState(null);
  const [count, setCount] = useState(1);

  let arr1 = [0, 0];
  let arr2 = [0, 0];
  let arr3 = [0, 0];
  let arr4 = [0, 0];
  let arr5 = [0, 0];
  let arr6 = [0, 0];

  useEffect(() => {
    let d1 = {
      dname: "민원토지관",
      receipt: 0,
      throw: 0,
    }
    data.filter((obj) => obj.dname === '민원토지관').map((obj) => {
      if (obj.state === '처리중') {
        d1.receipt++;
      } else {
        d1.throw++;
      }
    });
    let d2 = {
      dname: "감사담당관",
      receipt: 0,
      throw: 0,
    }
    data.filter((obj) => obj.dname === '감사담당관').map((obj) => {
      if (obj.state === '처리중') {
        d2.receipt++;
      } else {
        d2.throw++;
      }
    });
    let d3 = {
      dname: "기획예산담당관",
      receipt: 0,
      throw: 0,
    }
    data.filter((obj) => obj.dname === '기획예산담당관').map((obj) => {
      if (obj.state === '처리중') {
        d3.receipt++;
      } else {
        d3.throw++;
      }
    });
    let d4 = {
      dname: "안전복지정책관",
      receipt: 0,
      throw: 0,
    }
    data.filter((obj) => obj.dname === '안전복지정책관').map((obj) => {
      if (obj.state === '처리중') {
        d4.receipt++;
      } else {
        d4.throw++;
      }
    });
    let d5 = {
      dname: "홍보담당관",
      receipt: 0,
      throw: 0,
    }
    data.filter((obj) => obj.dname === '홍보담당관').map((obj) => {
      if (obj.state === '처리중') {
        d5.receipt++;
      } else {
        d5.throw++;
      }
    });
    let d6 = {
      dname: "일자리 경제과",
      receipt: 0,
      throw: 0,
    }
    data.filter((obj) => obj.dname === '일자리 경제과').map((obj) => {
      if (obj.state === '처리중') {
        d6.receipt++;
      } else {
        d6.throw++;
      }
    });
    let d7 = {
      dname: "정원산림과",
      receipt: 0,
      throw: 0,
    }
    data.filter((obj) => obj.dname === '정원산림과').map((obj) => {
      if (obj.state === '처리중') {
        d7.receipt++;
      } else {
        d7.throw++;
      }
    });
    setChart([d1,d2,d3,d4,d5,d6,d7]);
    cdata.datasets[0].data = [d1.receipt as never, d2.receipt as never, d3.receipt as never, d4.receipt as never,
      d5.receipt as never, d6.receipt as never, d7.receipt as never
    ];
    cdata.datasets[1].data = [d1.throw as never, d2.throw as never, d3.throw as never, d4.throw as never,
      d5.throw as never, d6.throw as never, d7.throw as never
    ];
  }, [])


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
            <table className='chart-tt'>
              <thead>
                <tr>
                  <th className='dname'>부서</th>
                  <th className='in'>접수</th>
                  <th className='trash'>폐기</th>
                  <th className='total'>통합</th>
                </tr>
              </thead>

              <tbody>
                {chart.map((item, index) => (
                  <tr key={index}>
                    <td className='dname'>{item.dname}</td>
                    <td>{item.receipt}</td>
                    <td>{item.throw}</td>
                    <td>{item.receipt + item.throw}</td>
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