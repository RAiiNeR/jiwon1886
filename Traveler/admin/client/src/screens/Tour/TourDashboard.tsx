import React, { useEffect, useState } from "react";
import BrandInfoSmallcard from "../../components/Dashboard/BrandInfoSmallcard";
import DylanHunter from "../../components/Dashboard/DylanHunter";
import GeneralChartCard from "../../components/Dashboard/GeneralChartCard";
import ProjectCredentials from "../../components/Dashboard/ProjectCredentials";
import Top5TourInfo from "../../components/Dashboard/Top5TourInfo";
import TourStatsCard from "../../components/Dashboard/TaskCard";
import { IncomeAnalyticsChartData, ProjectTimelineChartData } from "../../components/Data/DashboardData";
import { chartOverView } from "../../components/Data/TourChart";
import OverviewTile from "../../components/Pages/OverviewTile";
import PodiumChart, { type PodiumItem } from "./TourTop3";
import TourTop3 from "./TourTop3";
import MusicChart from "./MusicChart";
import axios from "axios";


const TourDashboard: React.FC = () => {

  const salesData: PodiumItem[] = [
    { name: "서울", value: 120 },
    { name: "부산", value: 80 },
    { name: "제주", value: 40 },
  ]

  const[diarycount, setDiaryCount] = useState(0);


  const DiaryCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_URL}/api/diary/count`
      );
      console.log(response.data);
      setDiaryCount(response.data);
    } catch (error) {
      console.log("Error Message: " + error);
  }
}

useEffect(() => {
  DiaryCount();
}, []);

  const musicData = [
    {
      id: '1',
      title: '달라달라',
      artist: 'ITZY',
      albumCover: "/imgs/dalladalla.jpg",
      duration: '3:19'
    },
    {
      id: '2',
      title: 'APT',
      artist: '로제',
      albumCover: '/imgs/APT.jpg',
      duration: '2:44'
    },
    {
      id: '3',
      title: 'Celebrity',
      artist: 'IU',
      albumCover: '/imgs/celebrity.jpg',
      duration: '3:15'
    },
  ];

  return (
    <div className="container-xxl">
      <div className="row g-3 mb-3 row-deck">
        <div className="col-md-12 col-lg-4 col-xl-4 col-xxl-4">
          <TourStatsCard label="투어 등록 수" value="122" iconClass="bi bi-journal-check fs-4" />
        </div>
        <div className="col-md-12 col-lg-4 col-xl-4 col-xxl-4">
          <TourStatsCard label="투어 매칭 수" value="376" iconClass="bi bi-list-check fs-4" />
        </div>
        <div className="col-md-12 col-lg-4 col-xl-4 col-xxl-4">
          <TourStatsCard label="다이어리 등록 수" value={diarycount} iconClass="bi bi-clipboard-data fs-4" />
        </div>
      </div>
      <div className="row g-3 mb-3 row-deck">
        {/* <div className="col-md-12 col-lg-8 col-xl-7 col-xxl-7">
          <DylanHunter />
        </div>
        <div className="col-md-12 col-lg-4 col-xl-5 col-xxl-5">
          <ProjectCredentials />
        </div> */}

      </div>
      

      {/* 차트 */}
      <div className="row g-3 mb-3 row-deck">
        <div className="col-md-12 col-lg-8">
          {
            chartOverView.map((data, i) => {
              return <OverviewTile data={data} key={"OverviewTile" + i} index={i} />
            })
          }
        </div>

        <div className="col-md-12 col-lg-4">
          <GeneralChartCard
            Title="가장 매칭률 높은 지역"
            data={IncomeAnalyticsChartData}
            identity="IncomeAnalytics"
            extraDivBody={() => {
              return (
                <div className="d-flex justify-content-end text-center">
                  <div className="p-1">
                    <h6 className="mb-0 fw-bold">KR</h6>
                    <small>1889건</small>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>


          



      {/* <div className="row g-3 mb-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 row-cols-xxl-4">
        <div className="col">
          <BrandInfoSmallcard title="Total Projects" value="550" iconClass="icofont-data fs-3" />
        </div>
        <div className="col">
          <BrandInfoSmallcard title="Coming Projects" value="210" iconClass="icofont-chart-flow fs-3" />
        </div>
        <div className="col">
          <BrandInfoSmallcard title="Progress Projects" value="8456 Files" iconClass="icofont-chart-flow-2 fs-3" />
        </div>
        <div className="col">
          <BrandInfoSmallcard title="Finished Projects" value="88 Files" iconClass="icofont-tasks fs-3" />
        </div>
      </div> */}
    

      
      <div className="row g-3 mb-3 row-deck">
        <div className="col-md-12 col-lg-6">
          <PodiumChart
            data={salesData}
            title="Top3 여행지"
            colors={["#3b82f6", "#10b981", "#ef4444"]} // blue, green, red에 해당하는 HEX 값
          />
        </div>

        <div className="col-md-12 col-lg-6">
          <MusicChart songs={musicData} title="가장 많이 추천된 노래" />
        </div>
      </div>


    </div>
  )
}


export default TourDashboard;