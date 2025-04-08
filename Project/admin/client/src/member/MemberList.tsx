import React, { useState, useEffect } from 'react';
import './css/MemberList.css'
import { memberData } from '../memberChart/MemberData';
import RequireAuth from '../comp/RequireAuth';

// 회원 데이터 타입 정의
interface Member {
  num: number;
  id: string;
  name: string;
  ssn: string;
  phone: string;
  email: string;
  addr: string;
  mdate: string;
}

const MemberList = () => {
  // 상태 변수: 회원 목록
  const [members, setMembers] = useState<Member[]>([]);

  // 선택된 회원을 추적할 상태
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());

  // 데이터 초기화 (예시 데이터: 추후 삭제예정)
  useEffect(() => {
    const getMember = async () => {
      try {
        //예시 데이터 가져오기
        memberData()
          .then(e => setMembers(e));
      } catch (error) {
        console.log("Error => " + error)
      }
    }
    getMember();

  }, []);

  //특정 회원 선택,해제 처리 함수
  const handleSelect = (id: number) => {
    const newSelectedMembers = new Set(selectedMembers);
    if (newSelectedMembers.has(id)) {
      newSelectedMembers.delete(id);
    } else {
      newSelectedMembers.add(id);
    }
    setSelectedMembers(newSelectedMembers);
  };

  // 전체 선택 처리 함수
  const handleSelectAll = () => {
    if (selectedMembers.size === members.length) {
      //전체 선택 해제
      setSelectedMembers(new Set());
    } else {
      //전체 선택
      const allMemberIds = new Set(members.map((member) => member.num));
      setSelectedMembers(allMemberIds);
    }
  };

  // 선택된 회원 삭제 함수
  const handleDeleteSelected = () => {
    //선택되지 않은 회원 목록 설정
    const remainingMembers = members.filter(member => !selectedMembers.has(member.num));
    setMembers(remainingMembers);
    setSelectedMembers(new Set());//선택 상태 초기화
  };

  return (
    <RequireAuth>
      <div style={{ padding: "50px" }}>
        <div className='memberlist'>
          <h1>회원 목록</h1>
          <div>
            <button onClick={handleDeleteSelected} disabled={selectedMembers.size === 0}>
              선택된 회원 삭제
            </button>
          </div>
          <table>
            <thead>
              <tr>
                {/* 전체 선택/선택 해제 체크박스 */}
                <th>
                  <input
                    type="checkbox"
                    checked={selectedMembers.size === members.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>번호</th>
                <th>아이디</th>
                <th>이름</th>
                <th>주민등록번호</th>
                <th>폰번호</th>
                <th>이메일</th>
                <th>주소</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {/* 회원 목록 데이터를 테이블에 렌더링 */}
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    {/* 개별 회원 선택 체크박스 */}
                    <input
                      type="checkbox"
                      checked={selectedMembers.has(member.num)}
                      onChange={() => handleSelect(member.num)}
                    />
                  </td>
                  <td>{member.num}</td>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.ssn}</td>
                  <td>{member.phone}</td>
                  <td>{member.email}</td>
                  <td>{member.addr}</td>
                  <td>{member.mdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RequireAuth>
  );
};

export default MemberList;
