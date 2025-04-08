import React from 'react'
import SideNav from '../SideNav'
import SurveyList from './SurveyList';

const SurveyListPage: React.FC = () => {
  const sidenav = {
    title: '소통⦁참여', // 사이드 네비게이션 제목
    list: [{
      link: '/noorigun/suggestion',
      text: '제안목록'
    }, {
      link: '/noorigun/qna',
      text: '질문/답변'
    },{
      link: '/noorigun/survey',
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
        <SurveyList/>
      </div>
    </div>
  )
}

export default SurveyListPage