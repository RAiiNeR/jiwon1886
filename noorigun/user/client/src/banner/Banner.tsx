import axios from 'axios';
import React, { useEffect, useState } from 'react'


interface BannerData {
    num: number;
    imgname: string;
  }

const Banner: React.FC = () => {
    // 서버에서 가져온 배너 데이터를 저장
    const [banners, setBanners] = useState<BannerData[]>([]);
    const [pause, setPause] = useState(false); // 캐러셀의 재생/정지 상태를 제어 -> 기본값은 false(재생 상태)

    // .env 파일 환경 변수를 사용해 배너 이미지의 기본 경로 설정
    const filePath = `${process.env.REACT_APP_BACK_IMG_URL}/banner/`

    // 컴포넌트가 렌더링될 때 한 번 실행
    useEffect(() => {
        const getBanner = async () => {
            try {
                // 서버에서 배너 데이터 가져오기
                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/banner`);
                setBanners(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getBanner(); // 비동기 함수 호츌 
    }, []) // 빈 의존성 배열(컴포넌트 처음 래)


    return (
        <>
        {   // 데이터가 존재하는 경우만 캐러셀 렌더링(banners.length > 0)                                 // 자동 슬라이스 활성화
            banners.length > 0 && (<div id="carouselExampleInterval" className="carousel slide banner" data-bs-ride="carousel">
                {/* 캐러셀 내부 슬라이드 영역 */}
                <div className="carousel-inner">
                    {
                        banners.map((item, i) => ( // 슬라이드 항목 생성                                   // 슬라이드 간격 설정(pause가 true이면 슬라이드 정지, 기본값은 3초간격(3000))
                            <div key={i} className={(i === 0) ? "carousel-item active" : "carousel-item"} data-bs-interval={pause ? "false" : "3000"}>                                                           
                                <img src={filePath + item.imgname} className="d-block banner-img" alt="..." />  {/* ...은 대체 텍스트 */}
                            </div>
                        ))
                    }
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <i className="fa-regular fa-circle-left"></i> {/* 아이콘 */}
                    {/* <span className="carousel-control-prev-icon" aria-hidden="true"></span> */}
                    <span className="visually-hidden">Previous</span> {/* 화면 리더기용 텍스트 */}
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <i className="fa-regular fa-circle-right"></i> {/* 아이콘 */}
                    {/* <span className="carousel-control-next-icon" aria-hidden="true"></span> */}
                    <span className="visually-hidden">Next</span> {/* 화면 리더기용 텍스트 */}
                </button>
               {/* 재생/정지 버튼 */}
                <div className='banner-controller'>            {/* 상태에 따라 아이콘 변경 */} {/* 클릭시 재생/정지 토글 */}
                    <i className={!pause ? "fa-solid fa-pause" : "fa-solid fa-play"} onClick={e => setPause(!pause)}></i>
                </div>
                {/* <div className='banner'>
              <div>
                {
                  images.map((item, i) => (
                    <img src={'images/banner/' + item} alt='aa' key={i} style={{ left: position[i], zIndex: show[i] }} className='banner-img' />
                  ))
                }
              </div>*/}
            </div>)
        }
        </>
    )
}

export default Banner