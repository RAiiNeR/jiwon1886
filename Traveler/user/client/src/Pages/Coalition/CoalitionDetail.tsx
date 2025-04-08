// 2025.02.10. 11:00 생성자: 이학수, 제휴업체 호텔 룸 등록 및 수정
import React, { useEffect, useRef, useState } from 'react'
import { appear_animate, handleScroll, updateHalfHeight } from '../../Comm/CommomFunc';
import { Link, useLocation, useParams } from 'react-router-dom';
import { parseJwt } from '../../Comm/jwtUtils';
import axios from 'axios';

interface Rooms {
    thumbnail: string;
    img_names: string[];
    name: string;
    price: number;
    content: string;
    num_per_rooms: number;
    num_rooms: number;
    max_person: number;
}

const CoalitionDetail: React.FC = () => {
    const { num } = useParams();
    const { pathname } = useLocation();
    const [userNum, setUserNum] = useState();
    const [hotel, setHotel] = useState<any>();
    const [newRoom, setNewRoom] = useState<Rooms>({
        thumbnail: '',
        img_names: [],
        name: '',
        price: 0,
        content: '',
        num_per_rooms: 0,
        num_rooms: 0,
        max_person: 0,
    });
    const [rooms, setRooms] = useState<Rooms[]>([]);

    // input에 연결해주기 위한 useRef 훅 사용
    const roomImgInputRef = useRef<HTMLInputElement | null>(null);
    const roomImgsInputRef = useRef<HTMLInputElement | null>(null);

    const [isAdd, setIsAdd] = useState(false)

    const [thumbnail, setThumbnail] = useState<File | null>()
    const [imgs, setImgs] = useState<File[]>([])
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [maxPerson, setMaxPerson] = useState(0)
    const [numRooms, setNumRooms] = useState(0)
    const [numPerRooms, setNumPerRooms] = useState(0)
    const [content, setContent] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            const decodeToken = parseJwt(token);
            setUserNum(decodeToken.num);
        }
    }, [])

    useEffect(() => {
        const getHotel = async () => {
            const result = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/hotels/${num}`)
            setHotel(result.data);
            // console.log(result.data)
        }
        getHotel();
    }, [])

    const getRooms = async () => {
        const result = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/rooms/hotel/${num}`)
        setRooms(result.data)
        // console.log(result.data)
    }

    useEffect(() => {
        getRooms();
    }, [])

    useEffect(() => {
        // 현재 경로에 따라 사이드 네이게이션 버튼의 색깔이 동적 변화
        const entitys = document.querySelectorAll<HTMLLinkElement>('div.list-group .list-group-item-action');
        entitys.forEach((entity, i) => {
            const e = entity.children[0] as HTMLElement
            if (pathname.includes(entity.getAttribute('href') as string)) {
                e.style.color = '#f85959'
            } else {
                e.style.color = 'black'
            }
        })
    }, [pathname])

    useEffect(() => {
        // 요소의 [data-scrollax] 옵션을 분석 적용
        handleScroll()
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        // ftco-animate 클래스를 가진 요소에 등장 효과 적용
        appear_animate()
    }, [rooms]);

    useEffect(() => {
        // js-halfheight 클래스를 가진 요소의 높이를 화면의 크기로 갱신
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => {
            window.removeEventListener("resize", updateHalfHeight);
        };
    }, []);

    // 버튼 클릭 시 호출하는 함수 (클릭 이벤트) 
    const onCickRoomImageUploadHandler = (): void => {
        roomImgInputRef.current?.click();
    };

    // 버튼 클릭 시 호출하는 함수 (클릭 이벤트) 
    const onCickRoomImagesUploadHandler = (): void => {
        roomImgsInputRef.current?.click();
    };

    // 단일 이미지 업로드
    const handleRoomThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            setThumbnail(files[0])
            const reader = new FileReader();
            reader.readAsDataURL(files[0])
            reader.onloadend = () => {
                setNewRoom({ ...newRoom, thumbnail: reader.result as string })
            }
        }
    }

    // 다중 이미지 업로드
    const handleRoomImgsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            const fileArray = Array(...files)
            setImgs(fileArray)
            fileArray.forEach((file, _) => {
                const reader = new FileReader();
                reader.readAsDataURL(file)
                reader.onloadend = () => {
                    const img = reader.result as string
                    setNewRoom((prev) => {
                        const images = prev ? { ...prev, img_names: prev.img_names.concat([img]) } : {
                            thumbnail: './images/hotel-6.jpg',
                            img_names: [],
                            name: '스텐다드',
                            price: 10000,
                            content: '멀쩡한 방입니다.',
                            num_per_rooms: 0,
                            num_rooms: 0,
                            max_person: 0,
                        }
                        return images
                    })
                }
            })
        }
    }

    // 이미지 제거 이벤트
    const onCickRoomImageDeleteHandler = (idx: number) => {
        const images = newRoom?.img_names
        if (images) setNewRoom({ ...newRoom, img_names: images.slice(0, idx).concat(images.slice(idx + 1, images.length)) })
    }

    //formdata로 데이터 전송
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('hotelNum', `${num}`);
        formData.append('price', `${price}`);
        formData.append('maxPerson', `${maxPerson}`);
        formData.append('numRooms', `${numRooms}`);
        formData.append("numPerRooms", `${numPerRooms}`);
        formData.append("content", content);

        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        imgs.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/rooms`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('룸 등록 성공!');
            // console.log(response.data);
            getRooms();
        } catch (error) {
            console.error('룸 등록 실패', error);
            alert('등록 실패');
        }
    };

    return (
        <div>
            <div className="hero-wrap js-halfheight" style={{ backgroundImage: "url('../images/coalition.jpg')" }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-halfheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax={"{\"properties\": {\"translateY\": \"70%\"}}"}>
                            <p className="breadcrumbs" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}><span className="mr-2"><Link to="/traveler/home">홈</Link></span> <span>제휴</span></p>
                            <h1 className="mb-3 bread" data-scrollax={"{\"properties\": {\"translateY\": \"30%\", \"opacity\": 1.6}}"}>제휴</h1>
                        </div>
                    </div>
                </div>
            </div>
            <section className="ftco-section ftco-degree-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 sidebar">
                            <div className="sidebar-wrap bg-light ftco-animate">
                                <h3 className="heading mb-4">제휴 업체</h3>
                                <div className="fields list-group">
                                    <Link to="/traveler/coalition" className='list-group-item-action'><h4><i className='ion-md-clipboard' /> 관리</h4></Link>
                                    <hr />
                                    <Link to="/traveler/coalition/new" className='list-group-item-action'><h4><i className='icon-plus' /> 등록</h4></Link>
                                    <hr />
                                    <Link to="/traveler/coalition/account" className='list-group-item-action'><h4><i className='icon-user' /> 계정 관리</h4></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className='testimony-wrap ftco-animate'>
                                {
                                    hotel && <div className='row'>
                                        <div className='col-6'>
                                            <img src={`${process.env.REACT_APP_FILES_URL}/img/hotels/${hotel.thumbnail}`} alt="" width={'100%'} />
                                        </div>
                                        <div className='col-6'>
                                            <table className='table'>
                                                <thead>
                                                    <tr className='text-center'>
                                                        <th>이름</th>
                                                        <th>위치</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className='text-center'>
                                                        <td>{hotel.name}</td>
                                                        <td>{hotel.location}</td>
                                                    </tr>
                                                    <tr className='text-center'>
                                                        <td colSpan={2}>{hotel.content}</td>
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr className='text-center'>
                                                        <td colSpan={2}>
                                                            <div style={{
                                                                width: "100%",
                                                                overflowX: 'scroll',
                                                                display: "flex"
                                                            }}>
                                                                {
                                                                    hotel.img_names.map((img: string, idx: number) => (
                                                                        <img key={idx} src={`${process.env.REACT_APP_FILES_URL}/img/hotels/${img}`} alt="" width={"60%"} />
                                                                    ))
                                                                }
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                }

                                <div>
                                    <div className='row justify-content-between pe-4 mb-3'>
                                        <span className='col-md-3'>룸 추가</span>
                                        <button
                                            className='btn btn-danger col-md-1 me-4 align-items-center'
                                            onClick={_ => setIsAdd(!isAdd)}
                                        >
                                            {
                                                isAdd ? <><i className='icon-remove' /> 취소</> : <><i className='icon-plus' /> 추가</>
                                            }
                                        </button>
                                    </div>

                                    {
                                        isAdd && (
                                            <>
                                                <div className='row'>
                                                    <div className='col-md-3'>
                                                        <p>대표사진</p>
                                                        <div className='d-inline-block position-relative'>
                                                            <button
                                                                className={`btn position-relative ${newRoom?.thumbnail ? "" : "border"}`}
                                                                onClick={() => {
                                                                    onCickRoomImageUploadHandler();
                                                                }}
                                                                style={{
                                                                    width: "150px",
                                                                    height: "150px"
                                                                }}
                                                                title={newRoom?.thumbnail ? '대표이미지 변경' : '대표이미지 추가'}
                                                            >
                                                                {
                                                                    newRoom?.thumbnail ? (
                                                                        <img src={newRoom?.thumbnail} alt="" width={'100%'} height={'100%'} />
                                                                    ) : (
                                                                        <i className='icon-plus' />
                                                                    )
                                                                }
                                                                <input
                                                                    // input의 ref 속성을 이용해 버튼 클릭 이벤트를 input과 연결
                                                                    ref={roomImgInputRef}
                                                                    type="file"
                                                                    name="file"
                                                                    accept='image/*'
                                                                    onChange={handleRoomThumbnailChange}
                                                                    style={{ display: "none" }}
                                                                />
                                                            </button>
                                                            {
                                                                newRoom?.thumbnail && <>
                                                                    <i
                                                                        className='icon-plus btn border-danger bg-danger rounded-circle p-1 text-white position-absolute'
                                                                        style={{
                                                                            bottom: -10,
                                                                            right: 0
                                                                        }}
                                                                        onClick={onCickRoomImagesUploadHandler}
                                                                        title='이미지 추가'
                                                                    />
                                                                    <input
                                                                        // input의 ref 속성을 이용해 버튼 클릭 이벤트를 input과 연결
                                                                        ref={roomImgsInputRef}
                                                                        type="file"
                                                                        name="file"
                                                                        accept='image/*'
                                                                        multiple
                                                                        onChange={handleRoomImgsChange}
                                                                        style={{ display: "none" }}
                                                                    />
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='col-md-9 pt-4'>
                                                        <div className='row'>
                                                            <div className='col-md-2'>
                                                                <label htmlFor="name" className='col-form-label-lg'>이름</label>
                                                            </div>
                                                            <div className='col-md-9'>
                                                                <input type="text" name='name' className='form-control'
                                                                    value={name} onChange={e => setName(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-md-2'>
                                                                <label htmlFor="name" className='col-form-label-lg m-0 p-0'>1박당<br />가격</label>
                                                            </div>
                                                            <div className='col-md-9 d-flex align-items-center'>
                                                                <input type="number" name='name' value={price}
                                                                    onChange={e => { setPrice(parseInt(e.target.value)) }}
                                                                    className='form-control' step={1000} min={0} />
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-md-2'>
                                                                <label htmlFor="name" className='col-form-label-lg m-0 p-0'>최대<br />인원</label>
                                                            </div>
                                                            <div className='col-md-9'>
                                                                <input type="number" name='name' className='form-control' placeholder='방에 들어올 수 있는 인원 수'
                                                                    value={maxPerson} onChange={e => setMaxPerson(parseInt(e.target.value))} min={0}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-md-2'>
                                                                <label htmlFor="name" className='col-form-label-lg'>방 갯수</label>
                                                            </div>
                                                            <div className='col-md-9'>
                                                                <input type="number" name='name' className='form-control' placeholder='총 방 갯수'
                                                                    value={numRooms} onChange={e => setNumRooms(parseInt(e.target.value))} min={0}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    newRoom.img_names.length > 0 && (
                                                        <>
                                                            <p>이미지</p>
                                                            <div className='row flex-nowrap'
                                                                style={{
                                                                    overflowX: "auto"
                                                                }}
                                                            >
                                                                {
                                                                    newRoom.img_names.map((img, idx) => (
                                                                        <div key={idx}
                                                                            className='border rounded mx-2 position-relative'
                                                                            style={{
                                                                                width: "150px",
                                                                                height: "150px"
                                                                            }}
                                                                        >
                                                                            <i
                                                                                className='icon-remove btn text-danger h5 position-absolute p-0'
                                                                                style={{
                                                                                    top: 0,
                                                                                    right: 0
                                                                                }}
                                                                                onClick={_ => onCickRoomImageDeleteHandler(idx)}
                                                                                title='이미지 제거'
                                                                            />
                                                                            <img src={img} alt="" width={'100%'} height={'100%'} />
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                <div className='row my-4'>
                                                    <p>세부 내용</p>
                                                    <div className='col-md-11'>
                                                        <textarea name="" id="" className='w-100 form-control-lg' style={{ height: "200px", resize: "none" }}
                                                            value={content} onChange={e => setContent(e.target.value)} />
                                                    </div>
                                                </div>

                                                <div
                                                    className='text-end px-4'
                                                >
                                                    <button
                                                        className='btn btn-danger mx-4'
                                                        onClick={handleSubmit}
                                                    >
                                                        등록
                                                    </button>
                                                </div>
                                            </>
                                        )
                                    }

                                    <div className='row flex-nowrap mb-3'
                                        style={{
                                            overflowX: "auto"
                                        }}
                                    >

                                        <div className="row">
                                            {
                                                rooms.map((room, idx) => (
                                                    <div className="col-md-4 ftco-animate" key={idx} >
                                                        <div className='border'>
                                                            <img src={`${process.env.REACT_APP_FILES_URL}/img/hotels/${room.thumbnail}`} alt="" width={'100%'} style={{
                                                                maxHeight: '150px'
                                                            }} />
                                                        </div>
                                                        <div className="destination">

                                                            <div className="text p-3 w-100">
                                                                <div className="d-flex">
                                                                    <div className="one">
                                                                        <h3>{room.name}</h3>
                                                                        <span>{room.max_person}인실</span>
                                                                    </div>
                                                                    <div className="two">
                                                                        <span className="price per-price">${room.price}<br /><small>/night</small></span>
                                                                    </div>
                                                                </div>
                                                                <div style={{
                                                                    height: '50px',
                                                                    overflow: 'hidden'
                                                                }} >
                                                                    <p>{room.content}</p>
                                                                </div>
                                                                <hr />
                                                                <span className='d-block text-end'>{room.num_rooms - room.num_per_rooms}/{room.num_rooms}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    )
}

export default CoalitionDetail