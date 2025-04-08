import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './css/ProgramDetail.css';

interface Program {
  num: number;
  title: string;
  age: number;
  category: string;
  place: string;
  content: string;
  teacher: string;
  student: number;
  education: number;
  startperiod: string;
  endperiod: string;
  startdeadline: string;
  enddeadline: string;
  starttime: string;
  endtime: string;
  hit: number;
  pdate: string;
  img: string;
}

const ProgramDetail: React.FC = () => {
  const { num } = useParams<{ num: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const navigate = useNavigate();

  const currentNum = parseInt(num as string);

  const filePath = 'http://localhost:82/noorigun/uploads/';

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:82/noorigun/api/program/detail?num=${currentNum}`);
        console.log('Fetched Data:', response.data);
        setProgram(response.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };
    fetchDetail();
  }, [currentNum]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:82/noorigun/api/program?num=${currentNum}`);
      navigate('/program');
    } catch (error) {
      console.log('Error Message: ' + error);
    }
  };

  const handleUpdate = () => {
    navigate(`/program/update/${currentNum}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getAgeCategory = (age: number) => {
    switch (age) {
      case 1:
        return '아동';
      case 2:
        return '학생';
      case 3:
        return '노년';
      default:
        return '';
    }
  };

  if (!program) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ProgramDetail">
      <div className="container">
        <div className="title-session">
          <h3>{program.title}</h3>
        </div>
        <div className="program-meta">
            <p>조회수 : {program.hit}</p>
            <p>작성일 : {program.pdate}</p>
             
        </div>
        {/* 표 형식으로 정보를 나열 */}
        <table className="program-content">
          <tbody>
            <tr>
              <th>강사명</th>
              <td>{program.teacher}</td>
            </tr>
            <tr>
              <th>수강대상</th>
              <td>{getAgeCategory(program.age)}</td>
            </tr>
            <tr>
              <th>종류</th>
              <td>{program.category}</td>
            </tr>
            <tr>
              <th>장소</th>
              <td>{program.place}</td>
            </tr>
            <tr>
              <th>수강생</th>
              <td>
                {program.student}/{program.education}
              </td>
            </tr>
            <tr>
              <th>강의 기간</th>
              <td>{formatDate(program.startperiod).substring(0, 12)} - {formatDate(program.endperiod).substring(0, 12)}</td>
            </tr>
            <tr>
              <th>신청 기간</th>
              <td>{formatDate(program.startdeadline).substring(0, 12)} - {formatDate(program.enddeadline).substring(0, 12)}</td>
            </tr>
            <tr>
              <th>강의 시간</th>
              <td>{program.starttime} - {program.endtime}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{program.content}</td>
            </tr>
            
            <tr>
              <th>이미지</th>
              <td><img src={filePath + program.img} alt={program.title} /></td>
            </tr>
          </tbody>
        </table>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleUpdate}>수정</button>
          <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
          <Link className="btn btn-success" to={`/program/student/${num}`}>
            수강생 리스트
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
