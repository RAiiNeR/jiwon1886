import React, { useEffect, useState } from "react";
import CpuUsageChart from "../../components/Dashboard/CpuUsageChart";
import ManagerCard from "../../components/Dashboard/ManagerCard";
import AbnormalAccessCard from "../../components/Dashboard/AbnormalAccessCard";
import AbnormalAccessInfo from "../../components/Dashboard/AbnormalAccessInfo";
import { parseJwt } from "../../components/common/jwtUtils";
import RequireAuth from "../../components/common/RequireAuth";



const MyDashboard: React.FC = () => {

  const [sabun, setSabun] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      // console.log(token)
      const decodeToken = parseJwt(token)
      // console.log(decodeToken)
      const username = decodeToken.sabun
      setSabun(username);
    }
  }, []);

  if (!sabun) {
    return <RequireAuth><></></RequireAuth>
  }

  return (
    <RequireAuth>
      <div className="container-xxl">
        <div className="row clearfix g-3">
          <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
            <div className="row g-3">
              <div className="col-xl-3 col-lg-4 col-md-4">
                <ManagerCard sabun={sabun} />
              </div>
              <div className="col-xl-5 col-lg-8 col-md-8 px-2">
                <div className="col-md-12">
                  <AbnormalAccessCard sabun={sabun} />
                </div>
                <div className="col-md-12">
                  <AbnormalAccessInfo sabun={sabun} />
                </div>
              </div>
              <div className="col-xl-4 col-lg-12">
                <div className="row h-100">
                  <div className="col-md-12 h-100">
                    <CpuUsageChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}


export default MyDashboard;
