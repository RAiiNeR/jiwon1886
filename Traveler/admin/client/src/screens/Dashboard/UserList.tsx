import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import { BlackListMember } from "../../components/Data/BlackMail";
import axios from "axios";

interface MemberData {
  num: number;
  name: string;
  email: string;
  mdate: string;
}

interface Friend {
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [isModal, setIsModal] = useState(false); // 모달 열기/닫기 상태
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]); // 선택된 회원 ID 상태
  const [members, setMembers] = useState<MemberData[]>([]); // 회원 목록 상태
  const [friends, setFriends] = useState<Friend[]>([]); // 친구 목록 상태
  const [selectedUserNum, setSelectedUserNum] = useState<number | null>(null); // 선택된 회원의 번호

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // 날짜 문자열을 Date 객체로 변환
    return date.toLocaleDateString("ko-KR"); // 한국 날짜 형식으로 포맷
  };

  // 체크박스 클릭 이벤트
  const handleCheckboxChange = (id: number) => {
    // 이미 선택된 항목이라면 제거, 아니면 추가
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)  // 이미 선택된 항목이면 제거
        : [...prev, id]  // 선택되지 않은 항목이면 추가
    );
  };


  // 선택된 회원 삭제
  const handleDeleteSelected = () => {
    setSelectedMembers([]); // 선택 목록 초기화
  };

  // 전체 회원목록 불러오기
  const getMembers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/userList`);
      const memberData: MemberData[] = response.data.map((member: any[]) => ({
        num: member[0], // 번호
        name: member[1], // 이름
        email: member[2], // 이메일
        mdate: member[3], // 가입일
      }));
      setMembers(memberData);
    } catch (error) {
      console.error("회원불러오기 오류: ", error);
    }
  };

  useEffect(() => {
    getMembers(); // 컴포넌트가 렌더링 될 때 전체 회원목록 불러오기
  }, []);

  // 친구목록 불러오기 (선택한 회원의 userNum)
  const getFriends = async (userNum: number) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/userList/friends?num=${userNum}`);
      console.log(response.data); // 응답 데이터 확인
      setFriends(response.data); // 친구 목록을 상태에 저장
      setIsModal(true); // 친구 목록 모달 열기
    } catch (error) {
      console.error("친구목록 오류 발생 : ", error);
    }
  };

  // 친구 목록을 보여주는 버튼 클릭 시
  const handleShowFriends = (userNum: number) => {
    setSelectedUserNum(userNum); // 선택된 회원 번호 설정
    getFriends(userNum); // 친구 목록 가져오기
  };

  // 친구 목록이 변경되면 모달 열기
  useEffect(() => {
    if (friends.length > 0) {
      setIsModal(true); // 친구 목록이 있으면 모달 열기
    }
  }, [friends]);

  // 단일 회원 삭제 처리
  const handleDeleteSingle = async (num: number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/userList/delete?num=${num}`);
      setMembers(members.filter((member) => member.num !== num)); // 상태 업데이트
      alert("회원이 삭제되었습니다.");
    } catch (error) {
      console.error("회원 삭제 오류:", error);
      alert("회원 삭제 실패");
    }
  };
  

  // 다중 회원 삭제 처리
  const handleDeleteMultiple = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_END_URL}/api/userList/deleteMultiple`, {
        data: selectedMembers, // 선택된 회원들의 num 리스트를 서버로 전달
      });

      // 다중 회원 삭제 후 목록에서 해당 회원들을 제거
      const remainingMembers = members.filter(
        (member) => !selectedMembers.includes(member.num)
      );
      setMembers(remainingMembers); // 상태 업데이트
      setSelectedMembers([]); // 선택된 회원 목록 초기화
      alert("선택된 회원들이 삭제되었습니다.");
    } catch (error) {
      console.error("회원 삭제 오류:", error);
      alert("회원 삭제 실패");
    }
  };

  const columnsT = [
    {
      name: "번호",
      selector: (row: MemberData) => row.num,
      sortable: true,
    },
    {
      name: "회원 ID",
      selector: (row: MemberData) => row.name,
      sortable: true,
    },
    {
      name: "이메일",
      selector: (row: MemberData) => row.email,
      sortable: true,
    },
    {
      name: "가입일",
      selector: (row: MemberData) => formatDate(row.mdate), // 가입일을 포맷팅하여 표시
      sortable: true,
    },
    {
      name: "친구",
      sortable: true,
      cell: (row: any) => (
        <div>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => handleShowFriends(row.num)} // 친구 목록 버튼 클릭 시
            style={{ justifyContent: "center" }}
          >
            친구목록
          </button>
        </div>
      ),
    },
    {
      name: "회원 삭제",
      sortable: true,
      cell: (row: any) => (
        <div className="btn-group" role="group" aria-label="Basic outlined example">
          <button type="button" className="btn btn-outline-secondary deleterow" onClick={() => handleDeleteSingle(row.num)}>
            <i className="icofont-ui-delete text-danger"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="회원 목록" renderRight={() => <div className="col-auto d-flex w-sm-100"></div>} />

      <div className="row clearfix g-3">
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <Button
                variant="danger"
                onClick={handleDeleteMultiple}
                disabled={selectedMembers.length === 0}
              >
                선택한 회원 삭제
              </Button>
            </div>

            <DataTable
              title="회원 목록"
              columns={columnsT}
              data={members} // 동적 데이터 적용
              pagination
              selectableRows
              onSelectedRowsChange={({ selectedRows }) => {
                // selectedRows는 선택된 행들의 배열입니다.
                const selectedIds = selectedRows.map((row: any) => row.num); // 선택된 회원들의 num 값을 가져옵니다.
                setSelectedMembers(selectedIds); // 선택된 회원들의 ID로 selectedMembers를 업데이트합니다.
              }}
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              highlightOnHover={true}
            />

          </div>
        </div>
      </div>

      {/* 친구 목록 모달 */}
      <Modal centered show={isModal} onHide={() => setIsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>친구 목록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <ul style={{ listStyle: "none", padding: 0 }}>
              {friends.length > 0 ? (
                friends.map((friend, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginLeft: "20px" }}>
                      <p style={{ margin: 0 }}>{friend.name}</p>
                      <span>{friend.email}</span>
                    </div>
                  </li>
                ))
              ) : (
                <p>친구 목록이 없습니다.</p>
              )}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={() => setIsModal(false)}>
            닫기
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserList;
