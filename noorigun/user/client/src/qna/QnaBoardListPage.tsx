import React from 'react'
import SideNav from '../SideNav'
import QnaBoardList from './QnaBoardList'

const QnaBoardListPage: React.FC = () => {
  const sidenav = {
    title: '소통⦁참여', // 사이드 네비게이션 제목
    list: [{
      link: '/noorigun/suggestion', // 제안목록 링크
      text: '제안목록'
    }, {
      link: '/noorigun/qna',
      text: '질문/답변',
      now: true // 현재 활성화된 링크 표시
    },{
      link: '/noorigun/survey',
      text: '설문조사'
    }]
  }

  return (
    <div className="main">
      {/* 왼쪽에 사이드 네비게이션 표시 */}
      <SideNav sideNavData={sidenav} />
      <div className="float-start section">
        <QnaBoardList/>
      </div>
    </div>
  )
}

export default QnaBoardListPage