import React, { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import axios from "axios";

const AbnormalAccessInfo: React.FC<{ sabun: string }> = (prop) => {
    const data: any = {
        options: {
            align: 'center',
            chart: {
                width: 200,
                height: 200,
                type: 'donut',
                align: 'center',
            },
            labels: ['정상', '비정상', '인증키'],
            dataLabels: {
                enabled: false,
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                show: true,
            },
            colors: ['var(--chart-color4)', 'var(--chart-color3)', 'var(--chart-color2)'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    }
    const [option] = useState(data.options);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        const getLogsCount = async () => {
            const result = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/manager/log/count/${prop.sabun}`);
            const normal = result.data.normal as never;
            const abnormal = result.data.abnormal as never;
            const hotkey = result.data.hotkey as never;
            setSeries([normal, abnormal, hotkey])
        }
        getLogsCount();
    }, [])

    if (series.length < 1) {
        return <></>
    }

    return (
        <div className="card">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold ">로그인 통계</h6>
            </div>

            <div className="card-body">
                <div className="row">
                    <div className="col-5">
                        <Chart
                            options={option}
                            series={series}
                            type={option ? option.chart.type : "bar"}
                            height={option ? option.chart.height : 320}
                            width={option ? option.chart.width : 200}
                        />
                    </div>
                    <div className="col-7">
                        <div className="row g-2 row-deck">
                            <div className="col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body ">
                                        <i className="icofont-chart-bar-graph fs-3"></i>
                                        <h6 className="mt-3 mb-0 fw-bold small-14">총합</h6>
                                        <span className="text-muted">{series.reduce((prev, curr) => { return prev + curr }, 0)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body ">
                                        <i className="icofont-check-circled fs-3"></i>
                                        <h6 className="mt-3 mb-0 fw-bold small-14">정상</h6>
                                        <span className="text-muted">{series[0]}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body ">
                                        <i className="icofont-key fs-3"></i>
                                        <h6 className="mt-3 mb-0 fw-bold small-14">인증키</h6>
                                        <span className="text-muted">{series[2]}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6">
                                <div className="card">
                                    <div className="card-body ">
                                        <i className="icofont-ban fs-3"></i>
                                        <h6 className="mt-3 mb-0 fw-bold small-14">비정상</h6>
                                        <span className="text-muted">{series[1]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AbnormalAccessInfo;