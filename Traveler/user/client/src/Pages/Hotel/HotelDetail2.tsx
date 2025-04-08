import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { appear_animate, handleScroll, updateHalfHeight } from '../../Comm/CommomFunc';
import { Link } from 'react-router-dom';
import ImgCarousel from '../../Comm/ImgCarousel';
import '../../css/hotel.css';
import axios from 'axios';
import Map from './Map';
import ImgCarouselHotel from '../../Comm/ImgCarouselHotel';

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

interface Map {
    placename: string; // 장소 이름
    placeaddr: string; // 장소 주소
    latitude: number;  // 위도
    longitude: number; // 경도
}

const HotelDetail2: React.FC = () => {
    const { num } = useParams<{ num: string }>();
    const [hotel, setHotel] = useState<HotelType | null>(null);
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    // 지도 데이터 상태
    const [mapData, setMapData] = useState<Map | null>(null);

    async function getRoomsByHotel(hotelNum: number): Promise<RoomType[]> {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/rooms/hotel/${hotelNum}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching rooms", error);
            return [];
        }
    }

    // 호텔 정보 및 지도 데이터 불러오기
    useEffect(() => {
        if (num) {
            const fetchData = async () => {
                try {
                    const hotelResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/hotels/${num}`);
                    if (hotelResponse.data) {
                        console.log(hotelResponse.data);
                        setHotel(hotelResponse.data);

                        // 호텔 주소를 기반으로 위도와 경도 정보 설정
                        const map = {
                            placename: hotelResponse.data.name,
                            placeaddr: hotelResponse.data.location,
                            latitude: hotelResponse.data.latitude,  // 실제 위도
                            longitude: hotelResponse.data.longitude,  // 실제 경도
                        };

                        setMapData(map);
                    }

                    const roomsResponse = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/rooms/hotel/${num}`);
                    const updatedRooms = roomsResponse.data.map((room: RoomType) => ({
                        ...room,
                        imgNames: room.img_names && room.img_names.length > 0
                            ? room.img_names.map(img => `./images/hotels/${img}`)
                            : [`./images/hotels/room1.jpg`]
                    }));
                    setRooms(updatedRooms);
                } catch (error) {
                    console.error("Error fetching data", error);
                }
            };

            fetchData();
        }

        if (location.state && location.state.reservationCompleted && num) {
            getRoomsByHotel(parseInt(num));
        }
    }, [num, location.state]);

    // 페이지 스크롤 처리
    useEffect(() => {
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        appear_animate();
    }, []);

    useEffect(() => {
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => {
            window.removeEventListener("resize", updateHalfHeight);
        };
    }, []);

    useEffect(() => {
        console.log(mapData);
    }, [mapData]);

    return (
        <div>
            <div className="hero-wrap js-halfheight" style={{ backgroundImage: "url('../images/hotels/ho.png')" }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-halfheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax={"{\"properties\": {\"translateY\": \"70%\"}}"}>
                            <p className="breadcrumbs" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}><span className="mr-2"><Link to="/traveler/home">Home</Link></span> <span className="mr-2"><Link to="/traveler/hotels">Hotel</Link></span> <span>Hotel Single</span></p>
                            <h1 className="mb-3 bread" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}>호텔 소개</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hotel-detail-col-lg-9">
                <div className="row">
                    {/* ImgCarouselHotel을 간격 조정 용도로 추가 */}
                    <div className='container'>
                        <div className="col-md-12 ftco-animate">
                            <div style={{
                                maxWidth: '825px',
                                margin: '0 auto',
                            }}>
                                <ImgCarouselHotel data={hotel?.img_names || []} />
                            </div>
                        </div>
                    </div>
                    <div className='container'>
                        <div className="col-md-12 hotel-single mt-4 mb-5 ftco-animate">
                            <span>베스트 호텔 & 객실</span>
                            {hotel ? (
                                <div>
                                    <h2>{hotel.name}</h2>
                                    <div className="hotel-info mb-5">
                                        <div className="hotel-detail-rate">
                                            <i className="hotel-icon-star fa fa-star"></i>
                                            <span>{hotel.rating.toFixed(1)}</span>
                                        </div>
                                        <div>
                                            <span className='hotel-detail-content'>{hotel.content}</span>
                                        </div>
                                        <div className="hotel-address">
                                            {/* <p><strong>위치:</strong> {hotel.location}</p> */}
                                            <div className="hotel-detail-map" style={{ width: '80%', height: '304px' }}>
                                                {mapData ? (
                                                    <Map map={mapData} />
                                                ) : (
                                                    <p>지도 정보가 없습니다.</p>
                                                )}
                                            </div>
                                        </div>
                                        <p><strong>등록일:</strong> {hotel.hdate}</p>
                                        <p><strong>조회수:</strong> {hotel.hit}</p>
                                    </div>
                                </div>
                            ) : (
                                <p>호텔 정보가 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='container'>
                    <div className="d-md-flex mt-5 mb-5">
                        <div className="col-md-12 hotel-single ftco-animate mb-5 mt-4">
                            <h4 className="mb-4">객실 안내</h4>
                            <div className="row">
                                {rooms.length > 0 ? (
                                    rooms.map((room) => (
                                        <div key={room.num} className="col-md-4">
                                            <div className="destination">
                                                {/* 이미지 경로를 서버 폴더에서 가져오는 형태로 수정 */}
                                                <Link to={`/traveler/hotels/ReservationForm?roomNum=${room.num}`}>
                                                    <img
                                                        src={room.thumbnail
                                                            ? `${process.env.REACT_APP_FILES_URL}/img/hotels/${room.thumbnail}` // 썸네일을 사용
                                                            : `./images/hotels/room1.jpg`} // 기본 이미지 (썸네일이 없을 경우)
                                                        alt={room.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '200px',
                                                            objectFit: 'cover',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </Link>
                                                <div className="text p-3">
                                                    <div className="d-flex">
                                                        <div className="one">
                                                            <h3>
                                                                <Link to={`/traveler/hotels/${room.num}`}>{room.name}</Link>
                                                            </h3>
                                                            <span className="hotel-detail-price per-price">
                                                                {room.price.toLocaleString()}
                                                                <br />
                                                                <small>/박</small>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p>{room.content}</p>
                                                    <p><strong>최대 인원:</strong> {room.max_person}명</p>
                                                    <hr />
                                                    {(room.num_rooms - room.num_per_rooms) > 0 ? (
                                                        <div>
                                                            <span style={{ color: 'green' }}>예약 가능</span>
                                                            <p>남은 객실: {room.num_rooms - room.num_per_rooms}개</p>
                                                            <Link to={`/traveler/hotels/ReservationForm?roomNum=${room.num}`} className="btn btn-primary">예약하기</Link>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span style={{ color: 'red' }}>예약 마감</span>
                                                            <button className="btn btn-secondary" disabled>예약 마감</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>객실 정보가 없습니다.</p>
                                )}
                            </div>
                            <button className='btn btn-primary py-3 px-5' onClick={() => navigate(-1)}>이전 페이지로 돌아가기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetail2;
