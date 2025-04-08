import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import PageHeader from "../../components/common/PageHeader";
import { ApexOptions } from 'apexcharts';

interface ChartConfig {
  options: ApexOptions;
  series: { name: string; data: [number, number][] }[];
}

const ServerManagement: React.FC = () => {
  const [chartData, setChartData] = useState<{ [key: string]: ChartConfig } | null>(null);
  const [cpuData, setCpuData] = useState<[number, number][]>([]);
  const [memoryData, setMemoryData] = useState<[number, number][]>([]);
  const [diskData, setDiskData] = useState<[number, number][]>([]);

  const fetchSystemUsage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/api/system/usage`);
      const data = await response.json();
      const baseTime = new Date().getTime();

      setCpuData(prevData => updateChartData(prevData, baseTime, data.cpuUsage));
      setMemoryData(prevData => updateChartData(prevData, baseTime, data.memoryUsage));
      setDiskData(prevData => updateChartData(prevData, baseTime, data.diskUsage));
    } catch (error) {
      console.error('Error fetching system usage data:', error);
    }
  };

  const updateChartData = (prevData: [number, number][], baseTime: number, newData: number): [number, number][] => {
    const updatedData: [number, number][] = [...prevData, [baseTime, newData]];
    if (updatedData.length > 30) {
      updatedData.shift();
    }
    return updatedData;
  };

  useEffect(() => {
    fetchSystemUsage();
    const interval = setInterval(fetchSystemUsage, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cpuData.length > 0) {
      const chartTypes = [
        { name: 'CPU', color: '#ffd55d', data: cpuData },
        { name: '메모리', color: '#ff8c00', data: memoryData },
        { name: '디스크', color: '#28a745', data: diskData }
      ];

      const charts = chartTypes.reduce((acc, { name, color, data }) => {
        acc[name] = {
          options: {
            chart: {
              height: 350,
              type: 'area',
              toolbar: { show: false },
              zoom: { enabled: false },
              animations: { enabled: false },
            },
            colors: [color],
            dataLabels: { enabled: false },
            fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.8 } },
            legend: { position: 'top', horizontalAlign: 'right', show: true, labels: { colors: ['#333'] } },
            xaxis: {
              type: 'datetime',
              labels: {
                style: { colors: '#333', fontSize: '12px' },
                formatter: (value: string) => {
                  const date = new Date(parseInt(value));
                  if (date.getSeconds() % 5 === 0) {
                    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                  }
                  return `${date.getMinutes()}:${date.getSeconds()}`;
                },
              },
              title: { text: '시간', style: { color: '#333' } },
            },
            yaxis: { title: { text: '사용량 (%)', style: { color: '#333' } }, labels: { style: { colors: '#333', fontSize: '12px' } } },
            grid: { yaxis: { lines: { show: false } }, padding: { top: 20, right: 0, bottom: 0, left: 0 } },
            stroke: { show: true, curve: 'smooth', width: 2 },
            title: { text: `${name} 사용량`, align: 'center', style: { fontSize: '16px', color: '#333' } },
          },
          series: [{ name, data }]
        };
        return acc;
      }, {} as { [key: string]: ChartConfig });

      setChartData(charts);
    }
  }, [cpuData, memoryData, diskData]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="서버 모니터링" />
      <div className="row clearfix mb-3">
        {Object.keys(chartData).map((key, index) => (
          <div key={index} className="col-md-12 mb-4">
            <Chart
              options={chartData[key].options}
              series={chartData[key].series}
              type="area"
              height={350}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerManagement;