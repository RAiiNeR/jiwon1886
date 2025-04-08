import React from "react";

const Comm_AdminList = () => {
    const Avatar2 = require("../../assets/images/lg/avatar2.jpg");
    const Avatar3 = require("../../assets/images/lg/avatar3.jpg");
    const Avatar7 = require("../../assets/images/lg/avatar7.jpg");
    const Avatar8 = require("../../assets/images/lg/avatar8.jpg");
    const Avatar9 = require("../../assets/images/lg/avatar9.jpg");
    const Avatar12 = require("../../assets/images/lg/avatar12.jpg");

    return (
        <div className="card">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold ">담당 관리자 목록</h6>
            </div>
            <div className="card-body">
                <div className="flex-grow-1">
                    <div className="py-2 d-flex align-items-center border-bottom flex-wrap">
                        <div className="d-flex align-items-center flex-fill">
                            <img className="avatar lg rounded-circle img-thumbnail" src={Avatar2} alt="profile" />
                            <div className="d-flex flex-column ps-3">
                                <h6 className="fw-bold mb-0 small-14">전준영</h6>
                                <span className="text-muted">회원 부서</span>
                            </div>
                        </div>
                        <div className="time-block text-truncate">
                            <i className="icofont-clock-time"></i> 월 ~ 목
                        </div>
                    </div>
                    <div className="py-2 d-flex align-items-center border-bottom flex-wrap">
                        <div className="d-flex align-items-center flex-fill">
                            <img className="avatar lg rounded-circle img-thumbnail" src={Avatar9} alt="profile" />
                            <div className="d-flex flex-column ps-3">
                                <h6 className="fw-bold mb-0 small-14">조유경</h6>
                                <span className="text-muted">회원 부서</span>
                            </div>
                        </div>
                        <div className="time-block text-truncate">
                            <i className="icofont-clock-time"></i> 월 ~ 목
                        </div>
                    </div>
                    <div className="py-2 d-flex align-items-center border-bottom flex-wrap">
                        <div className="d-flex align-items-center flex-fill">
                            <img className="avatar lg rounded-circle img-thumbnail" src={Avatar12} alt="profile" />
                            <div className="d-flex flex-column ps-3">
                                <h6 className="fw-bold mb-0 small-14">장지원</h6>
                                <span className="text-muted">회원 부서</span>
                            </div>
                        </div>
                        <div className="time-block text-truncate">
                            <i className="icofont-clock-time"></i> 월 ~ 목
                        </div>
                    </div>
                    <div className="py-2 d-flex align-items-center border-bottom flex-wrap">
                        <div className="d-flex align-items-center flex-fill">
                            <img className="avatar lg rounded-circle img-thumbnail" src={Avatar8} alt="profile" />
                            <div className="d-flex flex-column ps-3">
                                <h6 className="fw-bold mb-0 small-14">이승환</h6>
                                <span className="text-muted">여행 부서</span>
                            </div>
                        </div>
                        <div className="time-block text-truncate">
                            <i className="icofont-clock-time"></i> 화 ~ 금
                        </div>
                    </div>
                    <div className="py-2 d-flex align-items-center border-bottom flex-wrap">
                        <div className="d-flex align-items-center flex-fill">
                            <img className="avatar lg rounded-circle img-thumbnail" src={Avatar7} alt="profile" />
                            <div className="d-flex flex-column ps-3">
                                <h6 className="fw-bold mb-0 small-14">민다빈</h6>
                                <span className="text-muted">여행 부서</span>
                            </div>
                        </div>
                        <div className="time-block text-truncate">
                            <i className="icofont-clock-time"></i> 화 ~ 금
                        </div>
                    </div>
                    <div className="py-2 d-flex align-items-center border-bottom flex-wrap">
                        <div className="d-flex align-items-center flex-fill">
                            <img className="avatar lg rounded-circle img-thumbnail" src={Avatar3} alt="profile" />
                            <div className="d-flex flex-column ps-3">
                                <h6 className="fw-bold mb-0 small-14">황보도연</h6>
                                <span className="text-muted">교통 부서</span>
                            </div>
                        </div>
                        <div className="time-block text-truncate">
                            <i className="icofont-clock-time"></i> 화 ~ 금
                        </div>
                    </div>
                    <div className="py-2 d-flex align-items-center  flex-wrap">
                        <div className="d-flex align-items-center flex-fill">
                            <img className="avatar lg rounded-circle img-thumbnail" src={Avatar2} alt="profile" />
                            <div className="d-flex flex-column ps-3">
                                <h6 className="fw-bold mb-0 small-14">최의진</h6>
                                <span className="text-muted">교통 부서</span>
                            </div>
                        </div>
                        <div className="time-block text-truncate">
                            <i className="icofont-clock-time"></i> 화 ~ 금
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Comm_AdminList;