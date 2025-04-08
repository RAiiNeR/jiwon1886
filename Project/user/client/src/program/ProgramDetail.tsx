import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { parseJwt } from '../comp/jwtUtils';
import "./css/Program.css";


interface Program {
  num: number;
  title: string;
  age: number;
  content: string;
  place: string;
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
}
const ProgramDetail: React.FC = () => {
  const [program, setProgram] = useState<Program | null>(null); //강좌 데이터 상태
  const { num } = useParams();
  const navigate = useNavigate();
  const [isApplied, setIsApplied] = useState(false); // 신청 여부 상태
  const filePath = 'http://localhost:81/noorigun/uploads/';

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:81/noorigun/api/program/${num}`);
        console.log(response.data);
        setProgram(response.data);
      } catch (error) {
        console.log('Error Message: ' + error);

      }
    }
    getDetail();
  }, [num])

  const changeDateForm = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
  }



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
      const response = await axios.post('http://localhost:81/noorigun/api/registry', applicationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 신청 성공 시
      setIsApplied(true);  // 신청 완료 상태로 업데이트
      window.alert('신청이 되었습니다.');
      console.log(response);
      // 서버에서 수강생 수 감소 요청 보내기
      await axios.patch(`http://localhost:81/noorigun/api/program/enroll/${num}`);
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


      navigate('/program');  // 신청 후 홈 페이지로 리다이렉트

    } catch (error) {
      console.log('Error Message: ' + error);
      window.alert('이미 신청한 강좌입니다.');
    }
  };

  const handleListClick = () => {
    navigate('/program');
  }

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