import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './css/ProgramDetail.css';
import Map from './Map';
import RequireAuth from '../comp/RequireAuth';

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

  // placeaddr: string;
  placename: string;
  latitude: number;// 위도
  longitude: number;      // 경도
}

const ProgramDetail: React.FC = () => {
  const { num } = useParams<{ num: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const navigate = useNavigate();
  const [mapData, setMapData] = useState<any>(); // 지도에 표시할 데이터
  const currentNum = parseInt(num as string);
  const mapRef = useRef<HTMLDivElement>(null);// 지도 렌더링할 div 참조

  const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/program/detail?num=${currentNum}`);
        console.log('Fetched Data:', response.data);
        setProgram(response.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };
    fetchDetail();
  }, [currentNum]);

  useEffect(() => {
    setMapData({
      place: program?.place,
      // placename: program?.place,
      latitude: program?.latitude,
      longitude: program?.longitude,
    })
  }, [program])

  useEffect(() => {
    console.log(mapData)
  }, [mapData])

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/program?num=${currentNum}`);
      navigate('/noorigun/program');
    } catch (error) {
      console.log('Error Message: ' + error);
    }
  };

  const handleUpdate = () => {
    navigate(`/noorigun/program/update/${currentNum}`);
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
    <RequireAuth>
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
                <td>
                  {
                    mapData && (
                      <Map map={mapData} />
                    )
                  }
                </td>
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
            <Link className="btn btn-success" to={`/noorigun/program/student/${num}`}>
              수강생 리스트
            </Link>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default ProgramDetail;
