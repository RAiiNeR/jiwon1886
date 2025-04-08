import React from 'react'
import ComplaintProcese from './ComplaintProcese'
import SideNav from '../SideNav'

const ComplaintProcesePage: React.FC = () => {
  const sidenav = {
    title: '누리소개',
    list: [{
      link: '/noorigun/nooriGunEmployee',
      text: '조직도'
    }, {
      link: '/noorigun/complaintprocese',
      text: '민원 접수 절차 안내',
      now: true // 현재 활성화된 링크 표시
    }]
  }

  return (
    <div className="main">
      {/* 왼쪽에 사이드 네비게이션 표시 */}
      <SideNav sideNavData={sidenav} />
      <div className="float-start section">
        <ComplaintProcese/>
      </div>
    </div>
  )
}

export default ComplaintProcesePage