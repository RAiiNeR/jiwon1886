import React from "react";


const BlackList:React.FC = () => {

    return (
        <div className="card" style={{"height":"545px"}}>
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold ">블랙리스트 현황</h6>
            </div>
            <div className="card-body">
                <div className="row g-2 row-deck" style={{"height":"100%"}}>
                    <div className="col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-body ">
                                <i className="icofont-checked fs-3"></i>
                                <h6 className="mt-3 mb-0 fw-bold small-14">AI 검증 수</h6>
                                <span className="text-muted">400</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-body ">
                                <i className="icofont-stopwatch fs-3"></i>
                                <h6 className="mt-3 mb-0 fw-bold small-14">미처리</h6>
                                <span className="text-muted">17</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-body ">
                                <i className="icofont-ban fs-3"></i>
                                <h6 className="mt-3 mb-0 fw-bold small-14">처리된 게시물 수</h6>
                                <span className="text-muted">06</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-body ">
                                <i className="icofont-people fs-3"></i>
                                <h6 className="mt-3 mb-0 fw-bold small-14">블랙리스트 회원</h6>
                                <span className="text-muted">14</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default BlackList;