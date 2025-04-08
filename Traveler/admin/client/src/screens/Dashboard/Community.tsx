import React, { useEffect, useState } from "react";
import GeneralChartCard from "../../components/Dashboard/GeneralChartCard";
import { EmployeeInfoChartData, TotalEmployeesChartData, TopHiringSourcesChartData } from "../../screens/Dashboard/DashboardData";
// import { EmployeeInfoChartData, TotalEmployeesChartData, TopHiringSourcesChartData } from "../../components/Data/DashboardData";
// import GeneralChartCard_C from "../../components/Dashboard/GeneralChartCard_C";
import GeneralChartCard_C from "../../screens/Dashboard/GeneralChartCard_C";
import BoardAdmin from "../../components/Dashboard/BoardAdmin";
import Comm_AdminList from "../../components/Dashboard/Comm_AdminList";
// import BlackList from "../../components/Dashboard/BlackList";
import BestUser from "../../components/Dashboard/BestUser";
import BlacklistStatus from "./BlacklistStatus";
import BlackList from "./BlackList";
import { chartOverView } from "../../components/Data/TourChart";

const Community: React.FC = () => {
  const [wordCloud, setWordCloud] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:9000/chatbotwordcloud/api")
      .then(response => response.json())
      .then(data => {
        if (data.wordcloud) {
          setWordCloud(`data:image/png;base64,${data.wordcloud}`);
        }
      })
      .catch(error => console.error("Error fetching wordcloud:", error));
  }, []);

  return (
    <div className="container-xxl">
      <div className="row clearfix g-3">
        <div className="col-xl-8 col-lg-12 col-md-12 flex-column">
          <div className="row g-3">
            <div className="col-md-12">
              <GeneralChartCard Title="월간 사용자 수" data={EmployeeInfoChartData} />
            </div>
            <div className="community-flexBox" style={{ "display": "flex" }}>
              <div className="col-md-6">
                {/* <BlackList /> */}
                <GeneralChartCard_C Title="블랙리스트 현황" data={TotalEmployeesChartData} TitleRight="256" identity="totalemployee" />
              </div>
              <div className="col-md-6">
                {/* <GeneralChartCard_C Title="가장 많이 사용된 단어" data={TotalEmployeesChartData} TitleRight="423" identity="totalemployee" /> */}
                {wordCloud ? (
                  <img src={wordCloud} alt="Word Cloud" style={{ width: "100%", height:"540px",objectFit: "contain"}} />
                ) : (
                  <p>워드클라우드 생성 중...</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-12 col-md-12">
          <div className="row g-3">
            <div className="col-md-6 col-lg-6 col-xl-12"><BoardAdmin /></div>
            <div className="col-md-12 col-lg-12 col-xl-12"><Comm_AdminList /></div>
          </div>
        </div>
        {/* <div className="col-md-12">
          <BestUser />
        </div> */}
      </div>
    </div>
  )
}


export default Community;