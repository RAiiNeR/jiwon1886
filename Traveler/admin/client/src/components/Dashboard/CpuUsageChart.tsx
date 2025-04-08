import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const CpuUsageChart: React.FC = () => {
    const [cpuData, setCpuData] = useState<number[]>([]);
    const [memoryData, setMemoryData] = useState<number[]>([]);
    const [maxMemory, setMaxMemory] = useState<number>(0);

    useEffect(() => {
        const getCpuData = async () => {
            const result = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/system-stats`)
            const data = result.data
            setMaxMemory(data.totlaMemory);
            setCpuData((prevData) => {
                const updatedData = [...prevData, data.cpu];
                if (updatedData.length > 30) {
                    updatedData.shift(); // 데이터가 30개를 초과하면 앞의 값을 제거
                }
                return updatedData;
            });
            setMemoryData((prevData) => {
                const updatedData = [...prevData, data.usedMemory];
                if (updatedData.length > 30) {
                    updatedData.shift(); // 데이터가 30개를 초과하면 앞의 값을 제거
                }
                return updatedData;
            });
        }
        getCpuData();
        setInterval(() => {
            getCpuData();
        }, 5000);
    }, []);

    const cpuChartOptions = {
        chart: {
            id: 'cpu-usage',
            height: 350,
            type: "area" as 'area',
            zoom: { enabled: false }
        },
        xaxis: {
            categories: Array.from({ length: cpuData.length }, (_, index) => index + 1),
            labels: {
                show: false, // x축의 레이블(글씨) 숨기기
            }
        },
        yaxis: {
            min: 0, // 최소값 0
            max: 100, // 최대값 100
            labels: {
                formatter: function (value: number) {
                    return value.toFixed(2); // 값 포맷팅: 소수점 둘째 자리까지
                }
            }
        },
        dataLabels: {
            enabled: false // ✅ 데이터 라벨 제거
        },
        stroke: {
            width: 3
        },
        fill: {
            opacity: 0.3 // 영역 차트의 채우기 색상과 투명도
        }
    };

    const cpuChartSeries = [
        {
            name: 'CPU Usage',
            data: cpuData
        }
    ];

    const memoryChartOptions = {
        chart: {
            id: 'memory-usage',
            height: 350,
            type: "area" as 'area',
            zoom: { enabled: false }
        },
        xaxis: {
            categories: Array.from({ length: cpuData.length }, (_, index) => index + 1),
            labels: {
                show: false, // x축의 레이블(글씨) 숨기기
            }
        },
        yaxis: {
            min: 0, // 최소값 0
            max: maxMemory,
        },
        stroke: {
            width: 3
        },
        dataLabels: {
            enabled: false // ✅ 데이터 라벨 제거
        },
        fill: {
            opacity: 0.3 // 영역 차트의 채우기 색상과 투명도
        }
    };

    const memoryChartSeries = [
        {
            name: 'Memory Usage',
            data: memoryData
        }
    ];

    return (
        <div className="card h-100">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold ">서버 정보</h6>
            </div>
            <div className="card-body" >
                <div className='row'>
                    <div className='col-6'>
                        <h6 className="mb-0 fw-bold ">CPU Usage (%)</h6>
                        <Chart options={cpuChartOptions} series={cpuChartSeries} type="area" height={350} />
                    </div>
                    <div className='col-6'>
                        <h6 className="mb-0 fw-bold ">Memory Usage (MB)</h6>
                        <Chart options={memoryChartOptions} series={memoryChartSeries} type="area" height={350} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CpuUsageChart;