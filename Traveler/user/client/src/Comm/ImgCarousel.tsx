import React, { useEffect, useState } from 'react'

interface ImgCarouselProps {
    data: Array<any>
}

const ImgCarousel: React.FC<ImgCarouselProps> = ({
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
                setCarouselItemWidth(825)
            } else if (windowWidth >= 768) {
                setCarouselItemWidth(690)
            } else {
                setCarouselItemWidth(windowWidth)
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
                carouselFadeInOut(currentNum)
                setTimeout(() => {
                    moveCarousel(currentNum)
                    drawDot(currentNum)
                    setCurrentNum((currentNum + 1) % (data.length))
                }, 300)
            }, 3000)
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
        const element = document.querySelector<HTMLElement>('.img-carousel')
        if (!element) return;
        element.style.transform = `translate3d(-${(carouselItemWidth) * (currentNum)}px, 0px, 0px)`
    }

    // 캐러셀 페이드 인/아웃
    const carouselFadeInOut = (currentNum: number) => {
        const carousel_dots = document.querySelectorAll('.img-item')
        if (carousel_dots) {
            carousel_dots.forEach((e, i) => {
                if (i === (currentNum)) {
                    e.classList.add('active')
                    e.classList.add('animated')
                    e.classList.add('owl-animated-in')
                    e.classList.add('fadeIn')
                    setTimeout(() => {
                        e.classList.remove('animated')
                        e.classList.remove('owl-animated-in')
                        e.classList.remove('fadeIn')
                    }, 1000)
                } else {
                    if (e.classList.contains('active')) {
                        e.classList.remove('active')
                        e.classList.add('animated')
                        e.classList.add('owl-animated-out')
                        e.classList.add('fadeOut')
                        setTimeout(() => {
                            e.classList.remove('animated')
                            e.classList.remove('owl-animated-out')
                            e.classList.remove('fadeOut')
                        }, 1000)
                    }
                }
            })
        }
    }

    // dot 강조
    const drawDot = (currentNum: number) => {
        const carousel_dots = document.querySelectorAll('.img-dot')
        if (carousel_dots) {
            carousel_dots.forEach((e, i) => {
                if (i === (currentNum)) {
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
        <div>
            <div className="single-slider owl-carousel owl-loaded owl-drag">
                <div className="owl-stage-outer">
                    <div className="owl-stage img-carousel" style={{ transform: "translate3d(0px, 0px, 0px)", transition: "all", width: "4830px" }}>
                        {
                            data.map((e, i) => (
                                <div key={i} className={`owl-item img-item ${i == 0 ? 'active' : ''}`} style={{ width: `${carouselItemWidth}px` }}>
                                    <div className="item">
                                        <div className="hotel-img" style={{ backgroundImage: `url(/images/hotel-${e}.jpg)` }}></div>
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
                            <button key={`dot-${i}`} className={`owl-dot img-dot ${i == 0 ? 'active' : ''}`} onClick={_ => handleDotClick(i)}>
                                <span></span>
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default ImgCarousel