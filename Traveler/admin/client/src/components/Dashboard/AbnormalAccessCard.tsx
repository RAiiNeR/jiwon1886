import axios from "axios";
import React, { useEffect, useState } from "react";

const AbnormalAccessCard:React.FC<{ sabun: string }> = (prop) => {
    const InterviewImg = require("../../assets/images/interview.svg");
    const [count, setCount] = useState(0);

    useEffect(() => {
        const getCount = async () => {
            const result = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/manager/logging/${prop.sabun}`)
            setCount(result.data);
        } 
        getCount();
    },[])

    return (
        <div className="card bg-primary">
            <div className="card-body row">
                <div className="col">
                    <span className="avatar lg bg-white rounded-circle text-center d-flex align-items-center justify-content-center"><i className="icofont-file-text fs-5"></i></span>
                    <h1 className="mt-3 mb-0 fw-bold text-white">{count}</h1>
                    <span className="text-white">비정상 접근 기록</span>
                </div>
                <div className="col">
                    <img className="img-fluid" src={InterviewImg.default} alt="interview" />
                </div>
            </div>
        </div>
    )
}


export default AbnormalAccessCard;