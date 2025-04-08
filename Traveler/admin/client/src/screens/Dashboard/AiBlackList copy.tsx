import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import { LeaveRequestData } from "../../components/Data/AppData";

const AiBlackList: React.FC = () => {
    const [isModal, setIsModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const columnT = [
        {
            name: "회원 ID",
            selector: (row:any) => row.employeeId,
            sortable: true,
            cell: (row:any) => <a href="members-profile" className="fw-bold text-secondary">{row.employeeId}</a>
        },
        {
            name: "프로필",
            selector: (row:any) => { },
            sortable: true,
            cell: (row:any) => <div> <img className="avatar rounded-circle" src={row.image} alt=""></img>
                {/* <span className="fw-bold ms-1">{row.employeeName}</span> */}
            </div>
        },
        {
            name: "신고 횟수",
            selector: (row:any) => row.leavetype,
            sortable: true
        },
        { 
            name: "가입일",
            selector: (row:any) => row.from,
            sortable: true
        },
        // {
        //     name: "REASON",
        //     selector: (row:any) => row.reason,
        //     sortable: true
        // },
        {
            name: "경고메일 전송",
            // selector: (row:any) => { },
            sortable: true,
            cell: () => <div className="btn-group" role="group" aria-label="Basic outlined example">
                <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => { setIsModal(true) }} // ✅ 모달을 띄우는 함수로 변경
                    > 신고 사유
                    </button>
            </div>
        }

    ]

   
    return (
        <div className="container-xxl">
            <PageHeader headerTitle="AI 블랙리스트 검증 목록" renderRight={() => {
                return <div className="col-auto d-flex w-sm-100">
                    {/* <button className="btn btn-dark btn-set-task w-sm-100" onClick={() => { setIsModal(true) }}><i className="icofont-plus-circle me-2 fs-6"></i>Add Leave</button> */}
                </div>
            }} />
            <div className="row clearfix g-3">
                <div className="col-sm-12">
                    <DataTable
                        title={LeaveRequestData.title}
                        columns={columnT}
                        data={LeaveRequestData.rows}
                        // defaultSortField="title"
                        pagination
                        selectableRows={false}
                        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                        highlightOnHover={true}
                    />
                </div>
            </div>
            <Modal centered show={isModal} onHide={() => { setIsModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">신고사유</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">신고된 글</label>
                        <p><a href="#">대출 500만원을 공짜로 지급해드립니다 지금당장 연락하세요</a></p>
                    </div>
                    <div className="deadline-form">
                        <form>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label htmlFor="datepickerdedass" className="form-label">작성된 날짜</label>
                                    <input type="date" className="form-control" id="datepickerdedass" />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="datepickerdedoneddsd" className="form-label">신고된 날짜</label>
                                    <input type="date" className="form-control" id="datepickerdedoneddsd" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea78d" className="form-label">신고 사유</label>
                        <p>본 글은 허위매물 및 불법 광고로 인해 신고되었습니다</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={() => { setIsModal(false) }}>취소하기 </button>
                    <button type="button" className="btn btn-primary">메일 발송하기</button>
                </Modal.Footer>
            </Modal>
            <Modal centered show={isEditModal} onHide={() => { setIsEditModal(false) }}>
                <Modal.Header closeButton><h5 className="modal-title  fw-bold" id="dremovetaskLabel"> Leave Approve</h5></Modal.Header>
                <Modal.Body className="justify-content-center flex-column d-flex">
                    <i className="icofont-simple-smile text-success display-2 text-center mt-2"></i>
                    <p className="mt-4 fs-5 text-center">Leave Approve Successfully</p>
                </Modal.Body>
            </Modal>
            <Modal centered show={isDeleteModal} onHide={() => { setIsDeleteModal(false) }}>
                <Modal.Header closeButton><h5 className="modal-title  fw-bold" id="leaverejectLabel"> Leave Reject</h5></Modal.Header>
                <Modal.Body className="justify-content-center flex-column d-flex">
                    <i className="icofont-sad text-danger display-2 text-center mt-2"></i>
                    <p className="mt-4 fs-5 text-center">Leave Reject</p>
                </Modal.Body>
            </Modal>
        </div>
    )
}


export default AiBlackList; 