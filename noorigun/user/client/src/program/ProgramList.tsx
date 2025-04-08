import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import "./css/Program.css";

interface ProgramVO {
  num: number;
  title: string;
  age: number;
  content: string;  //내용
  place: string;  //장소
  category: string;  //종류
  teacher: string;  //강사
  education: number; //교육 정원
  student: number;  //수강생
  img: string;//단일
  starttime: string;
  endtime: string;
  hit: number; //조회수
  pdate: string; //게시글 작성일
}

const ProgramList: React.FC = () => {
  const [program, setProgram] = useState<ProgramVO[]>([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/`;


  const getProgramList = async (page: number, title: string) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/program`, {

        params: {
          page: page,
          size,
          title,
        }
      });
      console.log(response.data.content)
      setProgram(response.data.content);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.log('Error Message: ' + error);
    }
  }

  useEffect(() => {

    getProgramList(page, content);
  }, [page, content]);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  }

  return (
    <div className='programlist'>
      <h2>누리군 강좌 클래스 목록</h2>
      <div className='row'>
        <table className="programlist-table">
          <thead>
            <tr>
              <th>강좌명</th>
              <th>종류</th>
              <th>수강대상</th>
              <th>인원수</th>
              <th>강사명</th>
              <th>이미지</th>
              <th>시작시간</th>
              <th>종료시간</th>
              <th>조회수</th>
              <th>게시글 작성일</th>
            </tr>
          </thead>
          <tbody>
            {program.map((item) => (
              <tr key={item.num}>
                
                <td>
                  <Link to={`/noorigun/program/${item.num}`}>{item.title}</Link>
                </td>
                <td>{item.category}</td>
                <td>{getAgeCategory(item.age)}</td>
                <td>{item.student}/{item.education}</td>
                <td>{item.teacher}</td>
                <td><img src={filePath + item.img} alt={item.img}
                  style={{ width: '100px', height: 'auto' }} /></td>
                <td>{item.starttime}</td>
                <td>{item.endtime}</td>
                <td>{item.hit}</td>
                <td>{item.pdate}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/**추가 13 페이징 처리  */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${i + 1 === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default ProgramList