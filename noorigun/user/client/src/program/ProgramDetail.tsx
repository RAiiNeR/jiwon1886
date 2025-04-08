import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { parseJwt } from '../comp/jwtUtils';
import "./css/Program.css";
import Map from './Map';

interface Program {
  num: number;
  title: string;
  age: number;
  content: string;
  place: string; //장소 주소
  category: string;
  teacher: string;  //강사
  education: number; //교육 정원
  student: number;  //수강생
  img: string;//단일
  startperiod: string;
  endperiod: string;
  startdeadline: string;
  enddeadline: string;
  starttime: string;
  endtime: string;
  hit: number; //조회수
  pdate: string; //게시글 작성일
  placename: string; // 장소 이름
  latitude: number; // 위도
  longitude: number; // 경도
}
const ProgramDetail: React.FC = () => {
  const [program, setProgram] = useState<Program | null>(null); //강좌 데이터 상태
  const { num } = useParams();
  const navigate = useNavigate();
  const [isApplied, setIsApplied] = useState(false); // 신청 여부 상태
  const [mapData, setMapData] = useState<any>(); // 지도

  const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`; //사진 파일 경로  

  //강좌목록에 대한 정보 가져오기
  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/program/detail?num=${num}`);
        console.log(response.data);
        setProgram(response.data);
      } catch (error) {
        console.log('Error Message: ' + error);

      }
    }
    getDetail();
  }, [num])
  //date string으로 변환
  const changeDateForm = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
  }

  //지도정보 가져오기
  useEffect(() => {
    if (program) {
      setMapData({
        // detail이 null 또는 undefined일 경우 에러를 방지(detail이 값이 없으면 undefined를 반환)
        placename: program?.placename, // 장소 이름
        latitude: program?.latitude, // 위도
        longitude: program?.longitude, // 경도

      })
    }
  }, [program]);

  //클릭시 신청할 수 있는 비동기식방식
  const handleClick = async () => {
    // 신청 확인 팝업
    const confirmApply = window.confirm('정말로 신청을 하시겠습니까?');
    if (!confirmApply) return;  // 사용자가 취소하면 더 이상 진행하지 않음
    // 로컬 스토리지에서 JWT 토큰을 가져옴
    const token = localStorage.getItem('token');
    if (!token) {
      window.alert('로그인 후 신청이 가능합니다.');
      return;
    }
    // JWT 토큰을 디코딩하여 사용자 정보 추출
    const decodedToken = parseJwt(token as string);
    const membernum = decodedToken.num; // 사용자 ID (num)
    // 신청할 데이터 객체 만들기
    const applicationData = {
      membernum: membernum.toString(), // 사용자 번호 추가
      classnum: num
    };
    try {
      // 서버로 POST 요청 보내기
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/registry`, applicationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // 신청 성공 시
      setIsApplied(true);  // 신청 완료 상태로 업데이트
      window.alert('신청이 되었습니다.');
      console.log(response);
      // 서버에서 수강생 수 감소 요청 보내기
      await axios.patch(`${process.env.REACT_APP_BACK_END_URL}/api/program/enroll/${num}`);
      // 로컬에서 프로그램의 학생 수 감소
      setProgram(prevProgram => {
        if (prevProgram) {
          return {
            ...prevProgram,
            student: prevProgram.student - 1,  // 수강생 수 감소
          };
        }
        return prevProgram;
      });
      navigate('/noorigun/program');  // 신청 후 홈 페이지로 리다이렉트

    } catch (error) {
      console.log('Error Message: ' + error);
      window.alert('이미 신청한 강좌입니다.');
    }
  };

  //클릭시 강좌 목록으로 이동
  const handleListClick = () => {
    navigate('/noorigun/program');
  }

  //나이 숫자별로 분류하여 3가지 종류로 반환
  const getAgeCategory = (age: number) => {
    switch (age) {
      case 1:
        return "아동";
      case 2:
        return "학생";
      case 3:
        return "노년";
    }
  };

  if (!program) {
    return <div>로딩 중~</div>
  }
  return (
    <div className='programdetailform'>
      <div className='detail-header'>
        <h3>제목:{program.title}</h3>
        <div className='detail-meta'>
          <span><strong>번호:</strong> {program.num}</span>
          <span><strong>연령대:</strong> {getAgeCategory(program.age)}</span>
          <span><strong>장소:</strong> {program.place}</span>
          <span><strong>수강인원:</strong> {program.student}</span>
          <span><strong>강사명:</strong> {program.teacher}</span>
          <span><strong>교육정원:</strong> {program.education}</span>
          <span><strong>게시글 작성일:</strong> {program.pdate}</span>
        </div>
      </div>
      <div className='detail-content'>
        <p>내용:{program.content}</p>
        <p>장소:{program.place}</p>    {/**장소에 대한 지도 구현 */}
        {
          mapData && (
            <Map map={mapData} />
          )
        }
        {
          program.img && (
            <div className='mb-3'>
              <strong>이미지:</strong>
              <img src={`${filePath}${program.img}`}
                alt={program.img}
                style={{ width: '100px', height: 'auto' }} />
            </div>
          )}
        <p>신청 기한: {changeDateForm(program.startdeadline)} ~ {changeDateForm(program.enddeadline)}</p>
        <p>수강 기간: {changeDateForm(program.startperiod)} ~ {changeDateForm(program.endperiod)}</p>
        <p>강좌 시작 시간:{program.starttime} / 강좌 종료 시간:{program.endtime}</p>
        <p></p>
        <p>조회수:{program.hit}</p>
      </div>
      <div className='d-flex'>
        <button type='submit' onClick={handleClick} disabled={isApplied} className='submit-btn'>강좌신청</button>
        <button onClick={handleListClick} className='list-btn'>리스트</button>
      </div>
    </div>
  )
}

export default ProgramDetail