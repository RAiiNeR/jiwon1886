import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import "./css/ProgramStudentList.css";
import RequireAuth from '../comp/RequireAuth';

interface StudentList {
  num: number;
  name: string;
  id: string;
  email: string;
  phone: string;
}

const ProgramStudentList: React.FC = () => {
  const { num } = useParams<{ num: string }>();
  const [studentList, setStudentList] = useState<StudentList[]>([]); // 전체 수강생 목록
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set()); // 선택된 항목
  const [error, setError] = useState<string | null>(null); // 오류 메시지 상태

  // 프로그램 목록을 API에서 가져오는 함수
  const getProgramList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/program/memberlist?num=${num}`);
      setStudentList(response.data); // 전체 프로그램 목록 업데이트
      setError(null); // 오류 상태 초기화
    } catch (error) {
      console.error("프로그램 목록을 가져오는 중 오류 발생:", error);
      setError('수강생 목록을 가져오는 데 오류가 발생했습니다.'); // 오류 메시지 설정
    }
  };

  useEffect(() => {
    getProgramList();
  }, []);

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (num: number) => {
    const updatedSelectedItems = new Set(selectedItems);
    if (updatedSelectedItems.has(num)) {
      updatedSelectedItems.delete(num);
    } else {
      updatedSelectedItems.add(num);
    }
    setSelectedItems(updatedSelectedItems); // 선택된 항목 업데이트
  };

  // 선택된 학생들의 이메일을 가져오는 함수
  const getSelectedEmails = () => {
    return studentList
      .filter(student => selectedItems.has(student.num))
      .map(student => student.email);
  };

  return (
    <RequireAuth>
      <div className='StudentList'>
        {error && <p className="error">{error}</p>} {/* 오류 메시지 표시 */}
        <h3>수강생 리스트</h3>
        <table className='studenttable'>
          <thead>
            <tr>
              <th>선택</th>
              <th>이름</th>
              <th>아이디</th>
              <th>이메일</th>
              <th>전화번호</th>
            </tr>
          </thead>
          <tbody>
            {studentList.length === 0 ? (
              <tr>
                <td colSpan={5}>수강생이 없습니다</td>
              </tr>
            ) : (
              studentList.map((item) => (
                <tr key={item.num}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.num)}
                      onChange={() => handleCheckboxChange(item.num)}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Link className="btn btn-success" to="/noorigun/program">메인페이지</Link>
        <Link className='btn btn-primary' to={`/noorigun/program/mail/${num}`} state={{ emails: getSelectedEmails() }}>메일발송</Link>
      </div>
    </RequireAuth>
  );
};

export default ProgramStudentList;
