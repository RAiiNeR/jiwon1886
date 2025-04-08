import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts"; // ✅ ApexOptions 타입 import

interface ChartProps {
    title: string;
    categories: (string | number)[];
    data: number[];
    label: string;
}

const ChartComponent: React.FC<ChartProps> = ({ title, categories, data, label }) => {
    const formattedCategories: string[] = categories.map(cat => {
        if (typeof cat === "number" && !Number.isNaN(cat)) {
            return cat.toLocaleString(undefined, { maximumFractionDigits: 1 }); // ✅ 소수점 1자리까지 변환
        } else {
            return String(cat); // ✅ 문자열은 그대로 유지
        }
    });
    
    const options: ApexOptions = {
        chart: {
            type: "bar",
            fontFamily: "Poppins, sans-serif", // ✅ 차트 폰트 스타일 적용
            foreColor: "#444", // ✅ 기본 글자색
        },
        plotOptions: { 
            bar: { 
                horizontal: false,
                borderRadius: 8, // ✅ 막대 둥글게 적용
                colors: {
                    ranges: [{color: "#2f89fc" }], // ✅ 특정 값 범위 색상 지정
                },
            }  
        },
        xaxis: { 
            categories: formattedCategories, // ✅ 변환된 데이터 적용
            labels: { 
                formatter: function (value: string) {
                    return value; // ✅ X축 라벨을 그대로 사용
                },
                style: { fontSize: "14px", fontWeight: 600, colors: "#444" } 
            },
        },
        yaxis: {
            labels: { 
                formatter: function (value: number) {
                    return Number.isNaN(value) ? "0.0" : value.toFixed(1); // ✅ NaN 방지 및 소수점 1자리 적용
                },
                style: { fontSize: "14px", fontWeight: 600, colors: "#666" } 
            },
        },
        tooltip: {
            theme: "dark", // ✅ 툴팁 다크 테마 적용
            style: { fontSize: "14px", fontFamily: "Poppins, sans-serif" },
        },
        dataLabels: { 
            formatter: function (value: number) {
                return value.toFixed(1); // ✅ 소수점 1자리까지 표시
            },
            style: { fontSize: "16px", fontWeight: "bold", colors: ["#fff"] } 
        },
        colors:["#2f89fc"],
    };

    const series = [{ 
        name: label, 
        data: data.map(value => Number(value)) // ✅ 강제로 숫자로 변환
    }];

    return (
        <div style={{
            height: "270px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            transition: "all 0.3s ease-in-out",
        }}>
            <h2 style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "black",
                marginBottom: "10px",
                fontFamily: "Poppins, sans-serif"
            }}>
                {title}
            </h2>
            <Chart options={options} series={series} type="bar" height={300} width="340px"/>
        </div>
    );
};

export default ChartComponent;
