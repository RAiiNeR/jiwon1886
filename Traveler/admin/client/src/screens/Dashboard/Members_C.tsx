import React, { useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import OurClients from "../../components/Clients/OurClients";
import PageHeader from "../../components/common/PageHeader";
import { MembersData as initialMembersData } from "../../components/Data/AppData";

const Members_C: React.FC = () => {
  const [isModal, setIsModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set()); // ✅ 선택된 직원 목록 (Set 사용)
  const [members, setMembers] = useState(initialMembersData); // ✅ 직원 목록 상태로 관리

  // 체크박스 선택 핸들러 (Companyname 기준)
  const handleCheckboxChange = (companyName: string) => {
    setSelectedEmployees((prev) => {
      const updated = new Set(prev);
      if (updated.has(companyName)) {
        updated.delete(companyName);
      } else {
        updated.add(companyName);
      }
      return new Set(updated);
    });
  };

  // 선택된 직원 삭제
  const handleDelete = () => {
    if (selectedEmployees.size === 0) {
      alert("삭제할 직원을 선택해주세요!");
      return;
    }

    console.log("삭제할 직원:", Array.from(selectedEmployees));

    // ✅ 선택된 직원들을 제외한 새로운 목록 생성 (중복 제거)
    const updatedMembers = members.filter((member) => !selectedEmployees.has(member.Companyname));

    setMembers([...updatedMembers]); // 상태 업데이트 → 화면에서 즉시 반영됨
    setSelectedEmployees(new Set()); // 선택된 목록 초기화
  };

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="누리다원 직원관리"
        renderRight={() => (
          <div className="col-auto d-flex w-sm-100">
            <button className="btn btn-dark btn-set-task w-sm-100 me-2" onClick={handleDelete}>
              직원삭제
            </button>
            <button className="btn btn-dark btn-set-task w-sm-100 me-2" onClick={() => setIsModal(true)}>
              <i className="icofont-plus-circle me-2 fs-6"></i>Add Employee
            </button>
            <button className="btn btn-dark btn-set-task w-sm-100 me-2">
              <i className="icofont-plus-circle me-2 fs-6"></i>Add Employees
            </button>
          </div>
        )}
      />

      <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
        {members.map((data, i) => (
          <div key={`${data.Companyname}-${i}`} className="col position-relative"> {/* ✅ 중복 방지 */}
            {/* 개별 체크박스 선택 (Companyname 기준) */}
            <input
              type="checkbox"
              className="position-absolute"
              style={{
                top: "10px",
                left: "10px",
                width: "18px",
                height: "18px",
                zIndex: 100, // 체크박스가 위에 보이도록 설정
                cursor: "pointer",
              }}
              checked={selectedEmployees.has(data.Companyname)}
              onChange={() => handleCheckboxChange(data.Companyname)}
            />
            <OurClients avatar={data.avatar} post={data.post} name={data.Companyname} Companyname={data.Companyname} isMember={true} />
          </div>
        ))}
      </div>

      {/* 직원 추가 모달 */}
      <Modal centered show={isModal} size="lg" onHide={() => setIsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Add Employee</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput877" className="form-label">직원 이름</label>
              <input type="text" className="form-control" id="exampleFormControlInput877" placeholder="이름을 입력해주세요." />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput977" className="form-label">직원 직급</label>
              <input type="text" className="form-control" id="exampleFormControlInput977" placeholder="직급을 입력해주세요." />
            </div>
            <div className="mb-3">
              <label htmlFor="formFileMultipleoneone" className="form-label">사진</label>
              <input className="form-control" type="file" id="formFileMultipleoneone" />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={() => setIsModal(false)}>나가기</button>
          <button type="button" className="btn btn-primary">저장</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Members_C;
