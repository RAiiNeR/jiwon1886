import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface HotelType {
    num: number;
    name: string;
    rating: number;
    content: string;
    location: string;
    thumbnail: string;
    hit: number;
    hdate: string;
    img_names: string[];
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

interface ReservationType {
    num: number;
    memberemail: string;
    roomname: string;
    checkindate: string;
    checkoutdate: string;
    totalprice: number;
    numguests: number;
    membername: string;
}

const HotelListDetail: React.FC = () => {
    const { num } = useParams<{ num: string }>();
    const [hotel, setHotel] = useState<HotelType | null>(null);
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [usedRooms, setUsedRooms] = useState(0);
    const [availableRooms, setAvailableRooms] = useState(0);
    const [reservations, setReservations] = useState<ReservationType[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/hotels/${num}`);
                console.log("Hotel Data:", response.data);
                setHotel(response.data);

                console.log("FILES_URL:", process.env.REACT_APP_FILES_URL);
                console.log("Thumbnail:", response.data.thumbnail);

                const roomsResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/hotels/${num}/rooms/availability`);
                console.log("Rooms Data:", roomsResponse.data);
                setRooms(roomsResponse.data.rooms);
                setUsedRooms(roomsResponse.data.usedRooms);
                setAvailableRooms(roomsResponse.data.availableRooms);

                const reservationsResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/hotels/${num}/reservations`);
                console.log("Reservations Data:", reservationsResponse.data);
                setReservations(reservationsResponse.data);
            } catch (error) {
                console.error("Error fetching hotel:", error);
            }
        };

        fetchHotel();
    }, [num]);

    if (!hotel) {
        return <div>Loading...</div>;
    }

    const handleGoBack = () => {
        navigate(-1);
    };

    const getImageUrl = (hotel: HotelType): string => {
        console.log("image URL:", `${process.env.REACT_APP_FILES_URL}/img/hotels/${hotel.thumbnail}`);
        if (hotel.thumbnail) {
            return `${process.env.REACT_APP_FILES_URL}/img/hotels/${hotel.thumbnail}`;
        }
        if (hotel.img_names && hotel.img_names.length > 0) {
            return `${process.env.REACT_APP_FILES_URL}/img/hotels/${hotel.img_names[0]}`;
        }
        return "/imgs/default-image.jpg";
    };

    return (
        <div className="container mt-5">
            <button onClick={handleGoBack} className="btn btn-secondary mb-3">
                이전 페이지로 돌아가기
            </button>
            <div className="row">
                <div className="col-md-6">
                    <div
                        style={{
                            backgroundImage: `url(${getImageUrl(hotel)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '300px',

                        }}
                    />
                </div>
                <div className="col-md-6">
                    <h2>{hotel.name}</h2>
                    <p><strong>주소:</strong> {hotel.location}</p>
                    <p><strong>평점:</strong> {hotel.rating}</p>
                    <p><strong>설명:</strong> {hotel.content}</p>
                    <p><strong>등록일:</strong> {hotel.hdate}</p>
                </div>
            </div>
            <div className="mt-4">
                <h3>호텔 정보</h3>
                <p>{hotel.content}</p>
            </div>
            <div className="mt-4">
                <h3>객실 정보</h3>
                <p>사용 중인 객실 수: {usedRooms}</p>
                <p>예약 가능 객실 수: {availableRooms}</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th>객실 종류</th>
                            <th>객실 가격</th>
                            <th>최대 인원</th>
                            <th>객실 수</th>
                            <th>객실 설명</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room.num}>
                                <td>{room.name}</td>
                                <td>{room.price.toLocaleString()}원</td>
                                <td>{room.max_person}</td>
                                <td>{room.num_rooms}</td>
                                <td>{room.content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <h3>예약 목록</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>예약 번호</th>
                            <th>회원 이메일</th>
                            <th>객실 이름</th>
                            <th>체크인 날짜</th>
                            <th>체크아웃 날짜</th>
                            <th>총 가격</th>
                            <th>예약 인원</th>
                            <th>회원 이름</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.num}>
                                <td>{reservation.num}</td>
                                <td>{reservation.memberemail}</td>
                                <td>{reservation.roomname}</td>
                                <td>{reservation.checkindate}</td>
                                <td>{reservation.checkoutdate}</td>
                                <td>{reservation.totalprice}</td>
                                <td>{reservation.numguests}</td>
                                <td>{reservation.membername}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HotelListDetail;