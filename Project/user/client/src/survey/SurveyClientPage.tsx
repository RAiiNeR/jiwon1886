import React from 'react'
import SideNav from '../SideNav'
import SurveyClient from './SurveyClient'
import { useParams } from 'react-router-dom'

const SurveyClientPage: React.FC = () => {
    const sidenav = {
        title: '소통⦁참여', // 사이드 네비게이션 제목
        list: [{
          link: '/suggestion',
          text: '제안목록'
        }, {
          link: '/qna',
          text: '질문/답변'
        },{
          link: '/survey',
          text: '설문조사',
          now: true // 현재 활성화된 링크 표시
        }]
      }

  return (
    <div className="main">
      {/* 왼쪽에 사이드 네비게이션 표시 */}
      <SideNav sideNavData={sidenav} />
      {/* 오른쪽에 제안 상세 내용 표시 */}
      <div className="float-start section">
        <SurveyClient/>
      </div>
    </div>
  )
}

export default SurveyClientPage