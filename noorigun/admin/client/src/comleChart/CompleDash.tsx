import React, { useEffect, useRef, useState } from 'react'
import "./css/user.css";
import { Bar, Doughnut, getElementAtEvent } from 'react-chartjs-2';
import RequireAuth from '../comp/RequireAuth';
import { compleChartData, compleChartOptions } from './CompleChart';
import { compleChartByDept } from './CompleData';
import { compleByDeptData, compleByDeptOptions } from './CompleChartByDept';
import axios from 'axios';


//대시보드 화면
const CompleDash: React.FC = () => {
    const [dept, setDept] = useState('11');
    const [isData, setIsData] = useState('');
    const [dname, setDname] = useState('');
    const [counting, setCounting] = useState(0);
    const [rerandering, setRerandering] = useState(1);
    const chartRef = useRef();

    const deptnoArray = ['11', '12', '21', '22', '23', '31', '32'];

    
    const handleChartClick = (e:React.MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
        const chart = chartRef.current;
        if(chart){
            try {
                const i = getElementAtEvent(chart,e)[0].index;
                setDept(deptnoArray[i]);
            } catch (error) {
                
            }
        }
    }

    const getCount = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/comple/chart/count`);
            setCounting(response.data);
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        getCount()
    },[])

    const reranderer = () => {
        setTimeout(() => {
            if (compleChartData.datasets[0].data.length === 0) {
                reranderer();
            } else {
                setRerandering(rerandering * -1);
            }
        }, 1)
    }

    useEffect(()=>{
        reranderer();
    },[compleChartData.datasets[0].data])

    useEffect(() => {
        compleChartByDept(dept).then(e => {
            setDname(e.DNAME);
            if(e.TOTAL === '0'){
                setIsData('');
            }else{
                setIsData(dept);
                compleByDeptData.datasets[0].data = [
                    e.RECEIPT as never,
                    e.RECEIPTING as never,
                    e.DESIGNATEDEPT as never
                ]
            }
        });        
    }, [dept]);

    return (
        <RequireAuth>
            <div style={{ paddingTop: "20px" }}>
                {/* 메인 컨테이너 */}
                <div className="user-container">
                    <div className="user-header">
                        <div>
                            <p className="user-text">&nbsp;Comple DashBoard</p>
                        </div>
                    </div>
                    <br></br>
                    {/* 회원수 정보 */}
                    <div className="user-dash">
                        <div className="user-info1">
                            <div>
                                <h3 className="user-info-text">누적 민원수</h3>
                                <div>
                                    {/* 누적 회원수 표시 */}
                                    <p className="user-info-textinfo">{counting}개</p>
                                </div>
                            </div>
                            {/* SVG 이미지 */}
                            <div className="user-info2">
                                <img src="../img/memberdash/people.svg" className="user-svg"></img>
                            </div>
                        </div>
                    </div>
                    {/* 그래프 영역 */}
                    <div className="user-chart">
                        {/* 연령대, 성별, 이용 현황 차트 */}
                        <div className="user-chart-col">
                            {/* 연령별 이용자 통계 */}
                            <div className="user-chart-row" style={{ width: "calc(62% - 16px)" }}>
                                <div className="chart-name">각 부서별 민원 통계</div>
                                {/* Line 차트 렌더링 */}
                                <Bar key={rerandering} ref={chartRef} data={compleChartData} options={compleChartOptions} onClick={handleChartClick}/>
                            </div>
                            <div className="user-chart-row" style={{ width: "calc(38% - 16px)" }}>
                                <div className="chart-name">{isData?dname:'세부 통계'}</div>
                                {/* Doughnut 차트 렌더링 */}
                                {
                                    isData !== ''?(
                                        <Doughnut key={isData} data={compleByDeptData} options={compleByDeptOptions} />
                                    ):(
                                        <div>{dname}의 데이터가 없습니다.</div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RequireAuth>
    )
}

export default CompleDash