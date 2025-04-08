import React, { useEffect, useRef, useState } from 'react'
import { appear_animate, handleScroll, updateHalfHeight } from '../../Comm/CommomFunc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ModalVideo from 'react-modal-video';
import axios from 'axios';
import { parseJwt } from '../../Comm/jwtUtils';
//2025-03-05 전준영

const CoalitionForm: React.FC = () => {
    const { pathname } = useLocation();
    const [userNum, setUserNum] = useState();
    const [name, setName] = useState(""); // 이름
    const [content, setContent] = useState("");
    const [addr, setAddr] = useState('대한민국'); // 기본주소
    const [postcode, setPostcode] = useState(''); // 우편번호
    const [detailAddress, setDetailAddress] = useState(''); // 상세 주소
    const [thumbnailFile, setThumbnailFile] = useState<File>();
    const [thumbnailImg, setThumbnailImg] = useState<string | ArrayBuffer | null>();
    const [imgFiles, setImgFiles] = useState<File[]>([]);
    const [imgs, setImgs] = useState<string[]>([]);
    // input에 연결해주기 위한 useRef 훅 사용
    const imgInputRef = useRef<HTMLInputElement | null>(null);
    const imgsInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(token){
          const decodeToken = parseJwt(token);
          setUserNum(decodeToken.num);
        }
      }, [])

    const handlePostcodeSearch = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert('우편번호 API 로드에 실패했습니다. 페이지를 새로고침해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data: any) {
                let addr = ''; // 기본 주소 변수
                let extraAddr = ''; // 참고 항목 변수

                // 도로명 주소와 지번 주소 처리
                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress; // 도로명 주소
                } else {
                    addr = data.jibunAddress; // 지번 주소
                }

                // 도로명 주소일 때 참고 항목 추가
                if (data.userSelectedType === 'R') {
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname; // 법정동 추가
                    }
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName); // 건물명 추가
                    }
                    if (extraAddr !== '') {
                        extraAddr = ` (${extraAddr})`; // 형식 조합
                    }
                }

                console.log(data);
                // 상태 업데이트
                setPostcode(data.zonecode + data.buildingName); // 우편번호
                setAddr(data.address); // 기본 주소
                setDetailAddress(''); // 상세 주소 초기화
            },
        }).open();
    };

    useEffect(() => {
        // 현재 경로에 따라 사이드 네이게이션 버튼의 색깔이 동적 변화
        const entitys = document.querySelectorAll<HTMLLinkElement>('div.list-group .list-group-item-action');
        entitys.forEach((entity, i) => {
            const e = entity.children[0] as HTMLElement
            if (entity.getAttribute('href') === pathname) {
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
    }, []);

    useEffect(() => {
        // js-halfheight 클래스를 가진 요소의 높이를 화면의 크기로 갱신
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => {
            window.removeEventListener("resize", updateHalfHeight);
        };
    }, []);



    // 버튼 클릭 시 호출하는 함수 (클릭 이벤트) 
    const onCickImageUploadHandler = (): void => {
        imgInputRef.current?.click();
    };

    // 버튼 클릭 시 호출하는 함수 (클릭 이벤트) 
    const onCickImagesUploadHandler = (): void => {
        imgsInputRef.current?.click();
    };

    // 단일 이미지 업로드
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            setThumbnailFile(files[0])
            const reader = new FileReader();
            reader.readAsDataURL(files[0])
            reader.onloadend = () => {
                setThumbnailImg(reader.result)
            }
        }
    }

    // 다중 이미지 업로드
    const handleImgsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            const fileArray = Array(...files)
            setImgFiles(fileArray)
            fileArray.forEach((file, _) => {
                const reader = new FileReader();
                reader.readAsDataURL(file)
                reader.onloadend = () => {
                    const img = reader.result as string
                    setImgs((prev) => {
                        const images = prev ? [...prev, img] : [img]
                        return images
                    })
                }
            })
        }
    }

    // 이미지 제거 이벤트
    const onClickImageDeleteHandler = (idx: number) => {
        const imageFiles = imgFiles
        const images = imgs
        setImgFiles(imageFiles.slice(0, idx).concat(imageFiles.slice(idx + 1, imageFiles.length)))
        setImgs(images.slice(0, idx).concat(images.slice(idx + 1, images.length)))
    }

    const navigate = useNavigate();

    //formdata로 데이터 전송
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('rating', '0');
        formData.append('content', content);
        formData.append('location', addr + detailAddress);
        formData.append("membernum", `${userNum}`);

        if (thumbnailFile) {
            formData.append('thumbnail', thumbnailFile);
        }

        imgFiles.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/hotels`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('호텔 등록 성공!');
            // console.log(response.data);
            navigate("/traveler/coalition");
        } catch (error) {
            console.error('호텔 등록 실패', error);
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
                                <div className='row'>
                                    <div className='col-md-3'>
                                        <p>대표사진</p>
                                        <div className='d-inline-block position-relative'>
                                            <button
                                                className={`btn position-relative ${thumbnailImg ? "" : "border"}`}
                                                onClick={() => {
                                                    onCickImageUploadHandler();
                                                }}
                                                style={{
                                                    width: "150px",
                                                    height: "150px"
                                                }}
                                                title={thumbnailImg ? '대표이미지 변경' : '대표이미지 추가'}
                                            >
                                                {
                                                    thumbnailImg ? (
                                                        <img src={thumbnailImg as string} alt="" width={'100%'} height={'100%'} />
                                                    ) : (
                                                        <i className='icon-plus' />
                                                    )
                                                }
                                                <input
                                                    // input의 ref 속성을 이용해 버튼 클릭 이벤트를 input과 연결
                                                    ref={imgInputRef}
                                                    type="file"
                                                    name="file"
                                                    accept='image/*'
                                                    onChange={handleThumbnailChange}
                                                    style={{ display: "none" }}
                                                />
                                            </button>
                                            {
                                                thumbnailImg && <>
                                                    <i
                                                        className='icon-plus btn border-danger bg-danger rounded-circle p-1 text-white position-absolute'
                                                        style={{
                                                            bottom: -10,
                                                            right: 0
                                                        }}
                                                        onClick={onCickImagesUploadHandler}
                                                        title='이미지 추가'
                                                    />
                                                    <input
                                                        // input의 ref 속성을 이용해 버튼 클릭 이벤트를 input과 연결
                                                        ref={imgsInputRef}
                                                        type="file"
                                                        name="file"
                                                        accept='image/*'
                                                        multiple
                                                        onChange={handleImgsChange}
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
                                                <input type="text" name='name' className='form-control' value={name} onChange={e => setName(e.target.value)}/>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-2'>
                                                <label htmlFor="name" className='col-form-label-lg'>위치</label>
                                            </div>
                                            <div className='col-md-9'>
                                                <input
                                                    type="text"
                                                    className="form-control input-container"
                                                    id="postcode"
                                                    placeholder="우편번호"
                                                    value={postcode}
                                                    readOnly
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={handlePostcodeSearch}
                                                >
                                                    우편번호 찾기
                                                </button>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-2'>
                                                <label htmlFor="name" className='col-form-label-lg m-0 p-0'>상세<br />주소</label>
                                            </div>
                                            <div className='col-md-9 d-flex align-items-center'>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="detailAddress"
                                                    placeholder="상세주소 입력"
                                                    value={detailAddress}
                                                    onChange={(e) => setDetailAddress(e.target.value)}
                                                />
                                            </div>
                                        </div>



                                    </div>
                                </div>
                                {
                                    imgs.length > 0 && (
                                        <>
                                            <p>이미지</p>
                                            <div className='row flex-nowrap'
                                                style={{
                                                    overflowX: "auto"
                                                }}
                                            >
                                                {
                                                    imgs.map((img, idx) => (
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
                                                                onClick={_ => onClickImageDeleteHandler(idx)}
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
                                        <textarea name="" id="" className='w-100 form-control-lg' value={content} onChange = {e => setContent(e.target.value)} style={{ height: "200px", resize: "none" }} />
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
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div>
    )
}

export default CoalitionForm
