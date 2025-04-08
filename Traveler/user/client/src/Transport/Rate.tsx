import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { appear_animate, updateHalfHeight } from '../Comm/CommomFunc';
import '../css/rate.css'
// Chart.js 설정
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Rate = () => {
    const [exchangeData, setExchangeData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isLocal, setIsLocal] = useState(true);  // 내국인인지 외국인인지 상태 관리
    const [recommendation, setRecommendation] = useState("");  // 추천 결과를 상태로 관리

    const getPastMonths = () => {
        const months = [];
        const baseDate = new Date(2025, 3); // 2025년 2월로 설정 (월은 0부터 시작하므로 1 입력)

        for (let i = 0; i < 6; i++) {
            months.push(`${baseDate.getFullYear()}${String(baseDate.getMonth() + 1).padStart(2, '0')}`);
            baseDate.setMonth(baseDate.getMonth() - 1); // 한 달씩 감소
        }

        return months.reverse(); // 오래된 순으로 정렬 (8월 → 2월)
    };

    // API 호출 함수
    const fetchExchangeRates = async () => {
        try {
            const months = getPastMonths();
            const currencies = ['USD', 'EUR', 'JPY', 'CNY'];

            const dataPromises = months.map((month) =>
                axios.get('https://apis.data.go.kr/B190021/mmavXrtInfoInq/getmmavXrtInfoInq', {
                    params: {
                        serviceKey: 'XDMNsafrFJZRccQEUvJz2OG9IvqT7nEe/NjC6Twlm5H+WSJnH69syP9Su+lWuAGnG1DfL9/jHAHo6H0YXTMQ9g==',
                        inqYm: month,  //달별로 출력
                        cocuCd: 'KRW',   //원화 기준
                    }
                })
            );

            const responses = await Promise.all(dataPromises);

            responses.forEach((response, index) => {
                console.log(`응답 데이터 (${months[index]}):`, response.data);
            });   //데이터 콘솔상에 출력

            const allData = responses.flatMap((response, index) => {
                const items = response.data?.avrgXrtGrid || [];
                return items
                    .filter((item: any) => currencies.includes(item.baseCrcd))
                    .map((item: any) => ({
                        inqYm: months[index],
                        currency: item.baseCrcd,
                        rate: item.spcfMmavBltnXrt ?? item.spcfYavrBltnXrt ?? 0
                    }));
            });

            console.log("최종 변환된 데이터:", allData);

            setExchangeData(allData);
            setLoading(false);
        } catch (err) {
            console.error('API 호출 에러:', err);
            setError('환율 데이터를 가져오는 데 실패했습니다.');
            setLoading(false);
        }
    };
    const fetchPrediction = async (currency: string) => {
        try {
            const response = await fetch(`http://localhost:9000/exchangerate/exchangerate/?currency=${currency}`);
            const data = await response.json();
    
            // data 객체를 문자열로 변환하여 출력
            alert(`추천 결과: ${JSON.stringify(data.recommendation)}`);
        } catch (error) {
            console.error("API 호출 에러:", error);
        }
    };
    
    useEffect(() => {
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => {
            window.removeEventListener("resize", updateHalfHeight);
        };
    }, []);

    useEffect(() => {
        appear_animate();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    // x축 labels (중복 제거 및 정렬)
    const labels = [...new Set(exchangeData.map((item) => item.inqYm))].sort();

    //  따른 환율 데이터셋 생성
    const datasets = ['USD', 'EUR', 'JPY', 'CNY'].map((currency, idx) => {
        const exchangeRates = labels.map(
            (label) => {
                const dataForMonth = exchangeData.filter(item => item.inqYm === label && item.currency === currency);
                const averageRate = dataForMonth.length > 0
                    ? dataForMonth.reduce((sum, item) => sum + item.rate, 0) / dataForMonth.length
                    : null;
                    return averageRate
                // if (isLocal) {
                //     // 내국인일 경우, 원화 -> 외화 (환율 그대로)
                //     return averageRate;
                // } else {
                //     // 외국인일 경우, 외화 -> 원화 (환율의 역산)
                //     return averageRate ? 1 / averageRate : null;
                // }
            }
        );

        return {
            label: `${currency} -> KRW 환율`,
            data: exchangeRates,
            borderColor: `rgb(${75 + idx * 50}, ${192 - idx * 30}, 192)`,
            backgroundColor: `rgba(${75 + idx * 50}, ${192 - idx * 30}, 192, 0.2)`,
            fill: false,
            tension: 0.1,
        };
    });

    // 차트 데이터
    const data = { labels, datasets };

    return (
        <div>
            <div
                className="js-halfheight mb-4 rateTitle"
                style={{
                    position: 'relative',
                    overflow:'hidden',
                    width: "100%",
                    height: "455px",
                    zIndex:"-2"
                }}
            >
            <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.3)", // 검은색 배경에 50% 투명도 적용
                    zIndex: 1, // 이미지 아래에 배치
                }}>
                <img src="./images/rate/globalmoney.jpg" style={{"width":"100%", "top":"50%","position":"absolute","transform":"translateY(-68%)","zIndex":"0"}}/>
            </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%" }}>
                <h1>환율 비교</h1>
{/* 
                체크박스 추가
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isLocal}
                            onChange={() => setIsLocal(!isLocal)} // 체크박스 변경 시 상태 업데이트
                        />
                        내국인 (원화에서 외화) 
                    </label>
                </div> */}
                <button onClick={() => fetchPrediction("USD")}>환율 구매 추천</button>
                {recommendation && <h3>추천 결과: {recommendation}</h3>} {/* 추천 결과 화면에 표시 */}

                <div style={{ width: "80%", maxWidth: "900px", height: "500px" }}>
                    <Line data={data} options={{ responsive: true, plugins: { title: { display: true, text: '여러 통화 환율 비교' } } }} />
                </div>
            </div>
        </div>
    );
};

export default Rate;
