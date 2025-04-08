import React from "react";

const BoardAdmin:React.FC = () => {
    const InterviewImg = require("../../assets/images/interview.svg");

    return (
        <div className="card bg-primary">
            <div className="card-body row">
                <div className="col">
                    <span className="avatar lg bg-white rounded-circle text-center d-flex align-items-center justify-content-center"><i className="icofont-file-text fs-5"></i></span>
                    <h1 className="mt-3 mb-0 fw-bold text-white">사원</h1>
                    <span className="text-white">오늘도 힘찬 하루!😊</span>
                </div>
                <div className="col">
                    <img className="img-fluid" src={InterviewImg.default} alt="interview" />
                </div>
            </div>
        </div>
    )
}


export default BoardAdmin;