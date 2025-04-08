import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../../components/common/PageHeader";
import ClientProfileCard from "../../components/Clients/ClientProfileCard";
import StatusCard from "../../components/Ticket/StatusCard";

interface ReservationData {
    checkindate: string | null;
    checkoutdate: string | null;
    memberemail: string;
    numguests: number;
    status: string;
    totalprice: number | null;
    membernum: number;
    roomnum: number | null;
    roomname?: string;
    hotelname?: string;
    membername?: string;
}

function HotelReservationDetail() {
    const { num } = useParams<{ num: string }>(); // 'num'을 URL 파라미터로 받아옴
    const [reservation, setReservation] = useState<ReservationData | null>(null);
    const navigate = useNavigate();  // useNavigate 훅 사용

    // 🔹 예약 세부 정보 가져오기
    const getReservationDetails = async () => {
        if (!num) return;

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACK_END_URL}/api/reservations/${num}`
            );
            setReservation(response.data);
        } catch (error) {
            console.error("Error fetching reservation details:", error);
        }
    };

    useEffect(() => {
        getReservationDetails();
    }, [num]);

    // 예약 정보가 로딩 중일 때 처리
    if (!reservation) {
        return <div>로딩 중...</div>;
    }

    // 날짜 포맷팅 함수
    const formatDate = (date: string | null): string => {
        if (!date) return "N/A";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        return `${year}. ${month < 10 ? `0${month}` : month}. ${day < 10 ? `0${day}` : day}`;
    };

    // 이전 페이지로 돌아가기
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="예약자 프로필" />
            <div className="row g-3">
                <div className="col-xl-8 col-lg-12 col-md-12">
                    <ClientProfileCard
                        designation={reservation.membername}
                        details={`이메일: ${reservation.memberemail}`}
                    />
                </div>
            </div>

            <div className="container-xxl">
                <PageHeader headerTitle="예약 내역" />
                <div className="row g-3">
                    <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12">
                        <div className="row g-3 mb-3">
                            <div className="col-md-4">
                                <StatusCard
                                    progress="예약 중"
                                    progressBg="bg-success"
                                    iconClass="icofont-page fs-4"
                                    iconbg="bg-lightgreen"
                                    title="예약 상태"
                                />
                            </div>
                            <div className="col-md-4">
                                <StatusCard
                                    progress={reservation.hotelname || "N/A"}
                                    progressBg="bg-info"
                                    iconClass="icofont-5-star-hotel fs-4"
                                    iconbg="bg-lightgreen"
                                    title="호텔명"
                                />
                            </div>
                            <div className="col-md-4">
                                <StatusCard
                                    progress={reservation.checkindate && reservation.checkoutdate
                                        ? `${formatDate(reservation.checkindate)} ~ ${formatDate(reservation.checkoutdate)}`
                                        : "N/A"}
                                    progressBg="bg-warning"
                                    iconClass="icofont-calendar fs-4"
                                    iconbg="bg-lightgreen"
                                    title="예약 날짜"
                                />
                            </div>
                            <div className="col-md-4">
                                <StatusCard
                                    progress={reservation.roomname || "N/A"}
                                    progressBg="bg-warning"
                                    iconClass="icofont-bed fs-4"
                                    iconbg="bg-lightgreen"
                                    title="객실"
                                />
                            </div>
                            <div className="col-md-4">
                                <StatusCard
                                    progress={reservation.numguests || ""}
                                    progressBg="bg-primary"
                                    iconClass="icofont-people fs-4"
                                    iconbg="bg-lightgreen"
                                    title="인원수"
                                />
                            </div>
                            <div className="col-md-4">
                                <StatusCard
                                    progress={reservation.totalprice ? reservation.totalprice.toString() : "N/A"}
                                    progressBg="bg-secondary"
                                    iconClass="icofont-dollar fs-4"
                                    iconbg="bg-lightgreen"
                                    title="금액"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 이전 페이지로 돌아가는 버튼 */}
            <div className="mb-3">
                <button className="btn btn-secondary" onClick={handleGoBack}>
                    이전 페이지로 돌아가기
                </button>
            </div>
        </div>
    );
}

export default HotelReservationDetail;
