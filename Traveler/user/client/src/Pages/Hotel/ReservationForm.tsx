import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '../../css/hotel.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { updateHalfHeight } from '../../Comm/CommomFunc';
import { ko } from 'date-fns/locale';  // 한국어 로케일 import
import { parseJwt } from '../../Comm/jwtUtils';

interface ReservationData {
    checkindate: Date | null;
    checkoutdate: Date | null;
    memberemail: string;
    numguests: number;
    status: string;
    totalprice: number | null;
    membernum: number;
    roomnum: number | null;
    roomname?: string;
}

interface RoomType {
    num: number;
    hotelNum: number;
    name: string;
    price: number;
    max_person: number;
    num_rooms: number;
    num_per_rooms: number;
    content: string;
    thumbnail: string;
    img_names: string[];
}

const ReservationForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryParams = new URLSearchParams(location.search);
    const roomNum = queryParams.get("roomNum");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userToken, setUserToken] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userNum = parseJwt(token as string).num;

            setIsLoggedIn(true);
            setUserToken(userNum);
        } else {
            setIsLoggedIn(false);
        }
    }, [])

    const [roomdata, setRoomdata] = useState<RoomType>({
        num: 0,
        hotelNum: 0,
        name: '',
        price: 0,
        max_person: 0,
        num_rooms: 0,
        num_per_rooms: 0,
        content: '',
        thumbnail: '',
        img_names: [],
    });
    const [totalprice, setTotalprice] = useState(0);

    const [reservationData, setReservationData] = useState<ReservationData>({
        checkindate: null,
        checkoutdate: null,
        memberemail: '',
        membernum: 1,
        numguests: 1,
        status: 'C',
        totalprice: null,
        roomnum: parseInt(roomNum as string) || null,
    });

    useEffect(() => {
        if (roomNum) {
            axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/rooms/${roomNum}`).then(response => {
                console.log("객실 정보:", response.data);
                setRoomdata(response.data);
                setReservationData((prev) => ({
                    ...prev,
                    roomnum: response.data.num,
                    roomname: response.data.name,
                }));
            }).catch(error => {
                console.error("객실 정보 불러오기 실패:", error);
            });
        }
    }, [roomNum]);

    useEffect(() => {
        console.log("Reservation data state:", reservationData);
    }, [reservationData]);

    useEffect(() => {
        const checkoutdate = reservationData.checkoutdate?.getTime() as number;
        const checkindate = reservationData.checkindate?.getTime() as number;

        const differenceInTime = checkoutdate - checkindate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        setTotalprice(differenceInDays * roomdata?.price as number);
    }, [reservationData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setReservationData((prev) => ({
            ...prev,
            [name]: name === 'totalprice' || name === 'numguests' ? Number(value) : value,
        }));
    };

    const handleDateChange = (date: Date | null, field: 'checkindate' | 'checkoutdate') => {
        setReservationData((prev) => ({ ...prev, [field]: date }));
    };

    const handleReservation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reservationData.checkindate || !reservationData.checkoutdate) {
            alert("체크인과 체크아웃 날짜를 모두 선택해주세요.");
            return;
        }

        if (reservationData.checkindate >= reservationData.checkoutdate) {
            alert("체크아웃 날짜는 체크인 날짜 이후여야 합니다.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/reservation`, {
                ...reservationData,
                checkindate: reservationData.checkindate.toISOString().split('T')[0],
                checkoutdate: reservationData.checkoutdate.toISOString().split('T')[0],
                totalprice: totalprice,
                roomnum: reservationData.roomnum,
                membernum: userToken,
            });

            alert("예약이 완료되었습니다!");
            navigate('/traveler/hotels');
        } catch (error) {
            console.error("예약 실패:", error);
        }
    };

    const calculateNights = () => {
        if (!reservationData.checkindate || !reservationData.checkoutdate) return null;

        const checkIn = new Date(reservationData.checkindate);
        const checkOut = new Date(reservationData.checkoutdate);

        const nights = Math.floor((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

        return nights > 0 ? `${nights}박 ${nights + 1}일` : null;
    };

    useEffect(() => {
        if (reservationData.checkindate && reservationData.checkoutdate) {
            const nights = calculateNights()?.split("박")[0] || 0;
            setTotalprice((nights as number) * (roomdata?.price || 0));
        }
    }, [reservationData, roomdata]);

    useEffect(() => {
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => {
            window.removeEventListener("resize", updateHalfHeight);
        };
    }, []);

    return (
        <div>
            <div className="hero-wrap js-halfheight" style={{ backgroundImage: "url('../images/hotels/ho.png')" }}>
                <div className="container">
                    <div className="row no-gutters slider-text js-halfheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax='{"properties": {"translateY": "70%"}}'>
                            <p className="breadcrumbs" data-scrollax='{"properties": {"translateY": "30%", "opacity": 1.6}}'>
                                <span className="mr-2"><Link to="/traveler/home">Home</Link></span>
                                <span className="mr-2"><Link to="/traveler/hotels">Hotel</Link></span>
                                <span>Hotel Single</span>
                            </p>
                            <h1 className="mb-3 bread" data-scrollax='{"properties": {"translateY": "30%", "opacity": 1.6}}'>예약</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className="hotel-reservForm">
                    <h4 className="hotel-reservForm__title">예약</h4>
                    {reservationData.roomnum && (
                        <div className="form-group">
                            {roomdata.thumbnail ? (
                                <img
                                    src={`${process.env.REACT_APP_FILES_URL}/img/hotels/${roomdata.thumbnail}`}
                                    alt={roomdata.name}
                                    style={{
                                        width: '90%',
                                        height: 'auto',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                />
                            ) : roomdata.img_names && roomdata.img_names.length > 0 ? (
                                <img
                                    src={`${process.env.REACT_APP_FILES_URL}/img/hotels/${roomdata.img_names[0]}`}
                                    alt={roomdata.name}
                                    style={{ maxWidth: '200%', maxHeight: '300px', display: 'block', margin: '0 auto' }}
                                />
                            ) : (
                                <img
                                    src="./images/hotels/room1.jpg"
                                    alt="기본 객실 이미지"
                                    style={{ maxWidth: '300%', maxHeight: '300px', display: 'block', margin: '0 auto' }}
                                />
                            )}
                        </div>
                    )}

                    <form onSubmit={handleReservation}>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="이메일"
                                name="memberemail"
                                value={reservationData.memberemail}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <DatePicker
                                selected={reservationData.checkindate}
                                onChange={(date) => handleDateChange(date, 'checkindate')}
                                dateFormat="yyyy년 MM월 dd일"
                                className="form-control"
                                placeholderText="체크인 날짜"
                                minDate={new Date()}
                                locale={ko}
                            />
                        </div>
                        <div className="form-group">
                            <DatePicker
                                selected={reservationData.checkoutdate}
                                onChange={(date) => {
                                    if (reservationData.checkindate && date && date <= reservationData.checkindate) {
                                        alert("체크아웃 날짜는 체크인 날짜 이후여야 합니다.");
                                        setReservationData((prev) => ({ ...prev, checkoutdate: null }));
                                        return;
                                    }
                                    handleDateChange(date, 'checkoutdate');
                                }}
                                dateFormat="yyyy년 MM월 dd일"
                                className="form-control"
                                placeholderText="체크아웃 날짜"
                                minDate={reservationData.checkindate || new Date()}
                                locale={ko}
                            />
                        </div>
                        <div className="form-group">
                            <label>인원:</label>
                            <select
                                className="form-control"
                                name="numguests"
                                value={reservationData.numguests}
                                onChange={handleInputChange}
                            >
                                {roomdata && Array.from({ length: roomdata.max_person }, (_, i) => i + 1).map((num) => (
                                    <option value={num} key={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        {reservationData.roomnum && (
                            <div className="form-group">
                                <p><strong>선택한 객실:</strong> {reservationData.roomname ?? "정보 없음"}</p>
                                <p><strong>가격:</strong> {totalprice ? `${totalprice.toLocaleString()} 원` : "가격 미정"}</p>
                                {calculateNights() && (
                                    <p><strong>숙박 기간:</strong> {calculateNights()}</p>
                                )}
                            </div>
                        )}
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                지금 예약
                            </button>
                        </div>
                        <div className="form-group">
                            <Link to="/traveler/hotels" className="btn btn-secondary">
                                이전 으로
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReservationForm;
