// 2025.01.22. 18:20 생성자:이학수, GalleryCarousel 컴포넌트화
import React, { useEffect, useState } from 'react';

interface GalleryCarouselProps {
    data: Array<any>
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
    data,
}) => {
    const [c_len, setC_len] = useState(0)
    const [carouselItemWidth, setCarouselItemWidth] = useState(255)
    const [carouselItemNum, setCarouselItemNum] = useState(4)
    const [currentNum, setCurrentNum] = useState(0)
    const [eventId, setEventId] = useState<NodeJS.Timer>()
    const [cdata, setCData] = useState<Array<number>>([1, 2, 3, 4, 5, 6])

    useEffect(() => {
        // 화면 크키에 따라 캐러셀 크기 및 표출 개수 조정정
        const updatecarouselItemWidth = () => {
            const windowWidth = window.innerWidth
            if (windowWidth >= 1200) {
                setCarouselItemWidth(255)  // (.container width - (30 * n)) / n
                setCarouselItemNum(4)
            } else if (windowWidth >= 992) {
                setCarouselItemWidth(290)
                setCarouselItemNum(3)
            } else if (windowWidth >= 768) {
                setCarouselItemWidth(330)
                setCarouselItemNum(2)
            } else {
                setCarouselItemWidth(370)
                setCarouselItemNum(1)
            }
        }
        updatecarouselItemWidth();

        window.addEventListener('resize', updatecarouselItemWidth);

        return () => {
            window.removeEventListener("resize", updatecarouselItemWidth);
        };
    }, []);

    useEffect(() => {
        // 캐러셀 자동 슬라이딩 함수수
        const slideEvent = () => {
            const eventId = setTimeout(() => {
                moveCarousel(currentNum)
                drawDot(currentNum)
                setCurrentNum((currentNum + 1) % (data.length))
            }, 2000)
            setEventId(eventId)
        }
        slideEvent()
    }, [carouselItemWidth, currentNum])

    useEffect(() => {
        // 캐러셀 데이터 재조정
        if (carouselItemNum) {
            const itemsLen = data.length
            setC_len(itemsLen)
            const pages = Math.ceil(itemsLen / carouselItemNum)
            const total_item = pages * carouselItemNum
            const reData = [...data]
            for (let i = 0; i < (total_item - itemsLen + 2); i++) {
                reData.push(data[i])
            }
            setCData(reData)
        }
    }, [carouselItemNum]);

    useEffect(() => {
        moveCarousel(currentNum)
    }, [carouselItemWidth]);

    // 캐러셀 슬라이딩
    const moveCarousel = (currentNum: number) => {
        const element = document.querySelector<HTMLElement>('.gallery-carousel')
        if (!element) return;
        element.style.transform = `translate3d(-${(carouselItemWidth  + 30) * (currentNum)}px, 0px, 0px)`
    }

    // dot 강조
    const drawDot = (currentNum: number) => {
        const carousel_dots = document.querySelectorAll('.gallery-dot')
        if (carousel_dots) {
            carousel_dots.forEach((e, i) => {
                if (i == Math.floor((currentNum) / (carouselItemNum))) {
                    e.classList.add('active')
                } else {
                    e.classList.remove('active')
                }
            })
        }
    }

    // 캐러셀 이동 컨트롤롤
    const changeCarousel = (currentNum:number) => {
        clearTimeout(eventId)
        moveCarousel(currentNum)
        drawDot(currentNum)
        setCurrentNum(currentNum)
    }

    // dot 클릭 이벤트트
    const handleDotClick = (idx: number) => {
        changeCarousel(idx * carouselItemNum)
    }

    // 이전, 다음 버튼 클릭 이벤트
    const handlePrevNextButton = (prev:boolean = false) => {
        const changeNum = prev ? currentNum - 1 : currentNum + 1;
        const resNum = changeNum >= 0 ? (changeNum) % (data.length) : data.length - 1;
        changeCarousel(resNum);
        setCurrentNum(resNum);
    }

    return (
        <div className="destination-slider owl-carousel ftco-animate owl-loaded owl-drag">
            <div className="owl-stage-outer">
                <div className="owl-stage gallery-carousel" style={{ transform: "translate3d(0px, 0px, 0px)", transition: "0.25s", width: "4320px" }}>
                    {
                        cdata.map((e, i) => (
                            <div key={i} className="owl-item active" style={{ width: `${carouselItemWidth}px`, marginRight: "30px" }}>
                                <div className="item">
                                    <div className="destination">
                                        <a href="#" className="img d-flex justify-content-center align-items-center" style={{ backgroundImage: `url(/images/destination-${e}.jpg)` }}>
                                            <div className="icon d-flex justify-content-center align-items-center">
                                                <span className="icon-search2"></span>
                                            </div>
                                        </a>
                                        <div className="text p-3">
                                            <h3><a href="#">Lion, Singapore</a></h3>
                                            <span className="listing">3 Listing</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
            <div className="owl-nav">
                <button role="presentation" className="owl-prev" onClick={_ => handlePrevNextButton(true)}>
                    <span className="ion-ios-arrow-back"></span>
                </button>
                <button role="presentation" className="owl-next" onClick={_ => handlePrevNextButton()}>
                    <span className="ion-ios-arrow-forward"></span>
                </button>
            </div>
            <div className="owl-dots">
                {
                    Array.from({ length: Math.ceil(c_len / carouselItemNum) }, (_, i) => i).map((i) => (
                        <button key={i} className={`owl-dot gallery-dot ${i == 0 ? 'active' : ''}`} onClick={_ => handleDotClick(i)}>
                            <span></span>
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default GalleryCarousel;
