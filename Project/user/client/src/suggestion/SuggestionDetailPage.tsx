import React from 'react'
import SideNav from '../SideNav'
import SuggestionDetail from './SuggestionDetail'
import { useParams } from 'react-router-dom'
// SuggestionDetailPage는 URL에서 num 값을 가져와 SuggestionDetail에 전달
const SuggestionDetailPage: React.FC = () => {
  const { num } = useParams(); // URL에서 'num' 파라미터를 가져옴 (제안 ID)
  const sidenav = {
    title: '소통⦁참여', // 사이드 네비게이션 제목
    list: [{
      link: '/suggestion',
      text: '제안목록',
      now: true // 현재 활성화된 링크 표시
    }, {
      link: '/qna',
      text: '질문/답변'
    },{
      link: '/survey',
      text: '설문조사'
    }]
  }

  return (
    <div className="main">
      {/* 왼쪽에 사이드 네비게이션 표시 */}
      <SideNav sideNavData={sidenav} />
      {/* 오른쪽에 제안 상세 내용 표시 */}
      <div className="float-start section">
        {/* SuggestionDetail 컴포넌트를 호출하며 num을 props로 전달 */}
        <SuggestionDetail num={num as string} />
      </div>
    </div>
  )
}

export default SuggestionDetailPage