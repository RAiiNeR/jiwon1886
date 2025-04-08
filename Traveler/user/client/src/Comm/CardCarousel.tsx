// 2025.01.23. 10:33 생성자:이학수, CardCarousel 컴포넌트화
import React, { useEffect, useState } from 'react';

interface CardCarouselProps {
    data: Array<any>
}

const CardCarousel: React.FC<CardCarouselProps> = ({
    data,
}) => {
    const [c_len, setC_len] = useState(0)
    const [carouselItemWidth, setCarouselItemWidth] = useState(255)
    const [currentNum, setCurrentNum] = useState(0)
    const [eventId, setEventId] = useState<NodeJS.Timer>()

    useEffect(() => {
        // 화면 크키에 따라 캐러셀 크기 및 표출 개수 조정정
        const updatecarouselItemWidth = () => {
            const windowWidth = window.innerWidth
            if (windowWidth >= 1200) {
                setCarouselItemWidth(540)
            } else if (windowWidth >= 992) {
                setCarouselItemWidth(450)
            } else if (windowWidth >= 768) {
                setCarouselItemWidth(330)
            } else if (windowWidth >= 395) {
                setCarouselItemWidth(395)
            } else {
                setCarouselItemWidth(345)
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
        const itemsLen = data.length
        setC_len(itemsLen)
    }, []);

    useEffect(() => {
        moveCarousel(currentNum)
    }, [carouselItemWidth]);

    // 캐러셀 슬라이딩
    const moveCarousel = (currentNum: number) => {
        const element = document.querySelector<HTMLElement>('.card-carousel')
        if (!element) return;
        element.style.transform = `translate3d(-${(carouselItemWidth) * (currentNum)}px, 0px, 0px)`
    }

    // dot 강조
    const drawDot = (currentNum: number) => {
        const carousel_dots = document.querySelectorAll('.card-dot')
        if (carousel_dots) {
            carousel_dots.forEach((e, i) => {
                if (i == (currentNum)) {
                    e.classList.add('active')
                } else {
                    e.classList.remove('active')
                }
            })
        }
    }

    // 캐러셀 이동 컨트롤롤
    const changeCarousel = (currentNum: number) => {
        clearTimeout(eventId)
        moveCarousel(currentNum)
        drawDot(currentNum)
        setCurrentNum(currentNum)
    }

    // dot 클릭 이벤트트
    const handleDotClick = (idx: number) => {
        changeCarousel(idx)
    }

    // 이전, 다음 버튼 클릭 이벤트
    const handlePrevNextButton = (prev: boolean = false) => {
        const changeNum = prev ? currentNum - 1 : currentNum + 1;
        const resNum = changeNum >= 0 ? (changeNum) % (data.length) : data.length - 1;
        changeCarousel(resNum);
        setCurrentNum(resNum);
    }

    return (
        <div className="carousel-testimony owl-carousel ftco-animate owl-loaded owl-drag">
            <div className="owl-stage-outer">
                <div className="owl-stage card-carousel" style={{ transform: "translate3d(0px, 0px, 0px)", transition: "0.25s", width: "3780px" }}>
                    {
                        data.map((e, i) => (
                            <div key={i} className="owl-item active" style={{ width: `${carouselItemWidth}px` }}>
                                <div className="item">
                                    <div className="testimony-wrap d-flex">
                                        <div className="user-img mb-5" style={{ backgroundImage: `url(./images/person_${e}.jpg)` }}>
                                            <span className="quote d-flex align-items-center justify-content-center">
                                                <i className="icon-quote-left"></i>
                                            </span>
                                        </div>
                                        <div className="text ml-md-4">
                                            <p className="mb-5">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                                            <p className="name">Dennis Green</p>
                                            <span className="position">Guest from italy</span>
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
                    Array.from({ length: c_len }, (_, i) => i).map((i) => (
                        <button key={i} className={`owl-dot card-dot ${i == 0 ? 'active' : ''}`} onClick={_ => handleDotClick(i)}>
                            <span></span>
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default CardCarousel;
