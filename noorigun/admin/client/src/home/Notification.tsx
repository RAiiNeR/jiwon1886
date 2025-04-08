import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
//공지사항 데이터
interface NotificationData {
  NUM: number;// 공지사항 고유 번호
  DNAME: string; // 게시 부서명
  TYPE: number; // 공지 유형 (1: 긴급, 2: 일반, 3: 조치)
  TITLE: string; // 공지 제목
  NDATE: string;  // 공지 게시일
}

const Notification: React.FC = () => {
  const [notiDatas, setNotiDatas] = useState<NotificationData[]>([]);  // 공지사항 데이터 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
//마운트 시 최근 5개 공지사항 가져오기
  useEffect(() => {
    const getNotiLastFive = async () => {
      try {
        //서버에서 공지사항 리스트 가져오기
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/noti`, {
          params: {
            size: 5//마지막 5개 공지사항만
          }
        });
        setNotiDatas(response.data.content);
      } catch (error) {
        console.log('Error Massage => ' + error)
      }
    }
    getNotiLastFive();
  }, []);
 // 날짜 문자열을 로컬 날짜 형식으로 변환
  const changeDate = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  // 제목이 길면 잘라서 표시
  const changeTitle = (title:string) => {
    if(title.length > 20){
      return title.substring(0,15)+".....";
    }
    return title;
  }
  // 공지사항 유형에 따라 스타일 변경
  const changeType = (type:number) => {
    if(type === 1){
      return <div className='noti-type bg-danger text-white'>긴급</div>
    }else if(type === 2){
      return <div className='noti-type bg-info'>일반</div>
    }else{
      return <div className='noti-type bg-success text-white'>조치</div>
    }
  }
  // 공지사항 목록 전체 보기 페이지로 이동
  const handleNotiList = () => {
    navigate("/noorigun/noti")
  }

  return (
    <div className='notification'>
      <div className='border-bottom noti-header'>
        <h2>공지사항</h2>
        <h2 onClick={handleNotiList}> + </h2>{/* 전체 보기 버튼 */}
      </div>
      <div>
        <table className='table table-border'>
          <thead>
            <tr>
              <th>구분</th>
              <th>제목</th>              
              <th>게시부서</th>
              <th>게시일</th>
            </tr>
          </thead>
          <tbody>
            {
              notiDatas.map((item)=>(
                <tr key={item.NUM}>
                  <td>{changeType(item.TYPE)}</td>
                       {/* 공지 제목 클릭 시 상세 페이지 이동 */}
                  <td><Link to={`/noorigun/noti/${item.NUM}`}>{changeTitle(item.TITLE)}</Link></td>
                  <td>{item.DNAME}</td>
                  <td>{changeDate(item.NDATE)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Notification