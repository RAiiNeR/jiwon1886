import React, { useEffect, useState } from "react";
import axios from "axios";

const BlacklistStatus: React.FC = () => {
    const [blacklistCount, setBlacklistCount] = useState<number>(0);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlacklistStatus = async () => {
            try {
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
        <div className="blacklist-status">
            <h3>📌 블랙리스트 현황</h3>
            {loading ? (
                <p>로딩 중...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="card p-3 text-center">
                            <h5>🚨 블랙리스트 회원</h5>
                            <h2>{blacklistCount}</h2>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card p-3 text-center">
                            <h5>⏳ 미처리</h5>
                            <h2>{pendingCount}</h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlacklistStatus;
