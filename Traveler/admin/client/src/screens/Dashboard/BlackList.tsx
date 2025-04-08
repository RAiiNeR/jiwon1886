import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ✅ 페이지 이동을 위한 useNavigate 추가

const BlackList: React.FC = () => {
    const [blacklistCount, setBlacklistCount] = useState<number>(0);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();  // ✅ 페이지 이동을 위한 훅

    useEffect(() => {
        const fetchBlacklistStatus = async () => {
            try {
                // const response = await axios.get(`http://localhost:9000/community/blacklist/status/`);
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/blacklist/status/`);
                setBlacklistCount(response.data.blacklist_members);
                setPendingCount(response.data.pending_reviews);
            } catch (err) {
                setError("블랙리스트 현황을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlacklistStatus();
    }, []);

    return (
        <div className="card" style={{"height":"545px"}}>
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold">블랙리스트 현황</h6>
            </div>
            <div className="card-body">
                {loading ? (
                    <p>로딩 중...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <div className="row g-2 row-deck" style={{"height":"100%"}}>

                        {/* 블랙리스트 회원 */}
                        <div className="col-md-6 col-sm-6">
                            <div className="card" style={{cursor: "pointer"}} onClick={() => navigate("/travelerAdmin/blacklist")}>  
                                <div className="card-body">
                                    <i className="icofont-people fs-3"></i>
                                    <h6 className="mt-3 mb-0 fw-bold small-14">블랙리스트 회원</h6>
                                    <span className="text-muted">{blacklistCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* 미처리 */}
                        <div className="col-md-6 col-sm-6">
                            <div className="card">  
                                <div className="card-body">
                                    <i className="icofont-stopwatch fs-3"></i>
                                    <h6 className="mt-3 mb-0 fw-bold small-14">미처리</h6>
                                    <span className="text-muted">{pendingCount}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default BlackList;
