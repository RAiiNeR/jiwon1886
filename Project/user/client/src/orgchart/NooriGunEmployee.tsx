import React from 'react';
import { orgData } from './OrgData';
import OrgChart from './OrgChart';
import SideNav from '../SideNav';

// Job 컴포넌트
const NooriGunEmployee: React.FC = () => {
  const sidenav = {
    title: '누리소개',
    list: [{
      link: '/nooriGunEmployee',
      text: '조직도',
      now: true // 현재 활성화된 링크 표시
    }, {
      link: '/complaintprocese',
      text: '민원 접수 절차 안내'
    }]
  }

  return (
    <div className="main">
      {/* 왼쪽에 사이드 네비게이션 표시 */}
      <SideNav sideNavData={sidenav} />
      <div className="org-chart float-start section"> {/* 조직도 섹션 */}
        <OrgChart person={orgData} />
      </div>
    </div>
  );
};

export default NooriGunEmployee;