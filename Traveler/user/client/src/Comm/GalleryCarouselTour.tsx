import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface GalleryCarouselProps {
    data: Array<any>;
}

interface LocationTourCount {
    location: string;
    count: number;
}

const GalleryCarouselTour: React.FC<GalleryCarouselProps> = ({
    data,
}) => {
    const [c_len, setC_len] = useState(0);
    const [carouselItemWidth, setCarouselItemWidth] = useState(255);
    const [carouselItemNum, setCarouselItemNum] = useState(4);
    const [currentNum, setCurrentNum] = useState(0);
    const [eventId, setEventId] = useState<NodeJS.Timer>();
    const [cdata, setCData] = useState<Array<number>>([1, 2, 3, 4, 5, 6]);
    const [locations, setLocations] = useState<LocationTourCount[]>([]);
    const [maxItems, setMaxItems] = useState(0); // 최대 캐러셀 아이템 개수
    const [autoSlide,setAutoSlide] = useState<NodeJS.Timeout | null>(null);

    const regions = [
        { name: "서울", image: "./images/seoul.jpg" },
        { name: "부산", image: "./images/busan.jpg" },
        { name: "강원도", image: "./images/kangwon.jpg" },
        { name: "제주도", image: "./images/jeju.jpg" },
    ];

    useEffect(() => {
        const updatecarouselItemWidth = () => {
            const windowWidth = window.innerWidth;
            if (windowWidth >= 1200) {
                setCarouselItemWidth(255);
                setCarouselItemNum(4);
            } else if (windowWidth >= 992) {
                setCarouselItemWidth(290);
                setCarouselItemNum(3);
            } else if (windowWidth >= 768) {
                setCarouselItemWidth(330);
                setCarouselItemNum(2);
            } else {
                setCarouselItemWidth(370);
                setCarouselItemNum(1);
            }
        };
        updatecarouselItemWidth();

        window.addEventListener('resize', updatecarouselItemWidth);

        return () => {
            window.removeEventListener("resize", updatecarouselItemWidth);
        };
    }, []);

    useEffect(() => {
        
        axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/tours/location-count`)
            .then(response => {
                if (response.data.length > 0) {
                    setLocations([...response.data, ...response.data]); // ✅ 리스트를 2배로 늘려 반복되도록 설정
                    setMaxItems(response.data.length);
                    console.log(response.data)
                } else {
                    setLocations([]);
                    setMaxItems(0);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLocations([]);
                setMaxItems(0);
            });
    }, []);

    // useEffect(() => {
    //     if (autoSlide) clearInterval(autoSlide);
    //     const slideInterval = setInterval(() => {
    //         moveNext();
    //     }, 2000);
    //     setAutoSlide(slideInterval);

    //     return () => clearInterval(slideInterval);
    // }, [currentNum]);

    const moveCarousel = (num: number) => {
        const element = document.querySelector<HTMLElement>('.gallery-carousel');
        if (!element) return;
        element.style.transition = 'transform 0.5s ease-in-out';
        element.style.transform = `translateX(-${(carouselItemWidth + 30) * num}px)`;
    };

    const moveNext = () => {
        if (currentNum >= maxItems) {
            setTimeout(() => {
                const element = document.querySelector<HTMLElement>('.gallery-carousel');
                if (!element) return;
                element.style.transition = 'none';
                element.style.transform = `translateX(0px)`;
            }, 500);
            setCurrentNum(0);
        } else {
            setCurrentNum(prev => prev + 1);
        }
        moveCarousel(currentNum + 1);
    };

    const movePrev = () => {
        if (currentNum <= 0) {
            setTimeout(() => {
                const element = document.querySelector<HTMLElement>('.gallery-carousel');
                if (!element) return;
                element.style.transition = 'none';
                element.style.transform = `translateX(-${(carouselItemWidth + 30) * (maxItems - 1)}px)`;
            }, 500);
            setCurrentNum(maxItems - 1);
        } else {
            setCurrentNum(prev => prev - 1);
        }
        moveCarousel(currentNum - 1);
    };

    useEffect(() => {
        if (locations.length > 0) {
            setC_len(locations.length);
            setMaxItems(Math.min(4, locations.length)); // 4개를 넘지 않도록 설정
        } else {
            setC_len(0);
            setMaxItems(0);
        }
    }, [locations]);

    useEffect(() => {
        if (carouselItemNum) {
            const itemsLen = locations.length;
            setC_len(itemsLen);
            const pages = Math.ceil(itemsLen / carouselItemNum);
            const total_item = pages * carouselItemNum;
            const reData = [...data];

            setCData(reData);
        }
    }, [carouselItemNum, locations]);

    useEffect(() => {
        moveCarousel(currentNum);
    }, [carouselItemWidth, currentNum]);


    const drawDot = (currentNum: number) => {
        const carousel_dots = document.querySelectorAll('.gallery-dot');
        if (carousel_dots) {
            carousel_dots.forEach((e, i) => {
                if (i === Math.floor((currentNum) / (carouselItemNum))) {
                    e.classList.add('active');
                } else {
                    e.classList.remove('active');
                }
            });
        }
    };

    const changeCarousel = (targetNum: number) => {
        clearTimeout(eventId);
        moveCarousel(targetNum);
        drawDot(targetNum);
        setCurrentNum(targetNum);
    };

    const handleDotClick = (idx: number) => {
        changeCarousel(idx * carouselItemNum);
    };

    const handlePrevNextButton = (prev: boolean = false) => {
        let changeNum = prev ? currentNum - 1 : currentNum + 1;
        changeNum = changeNum < 0 ? maxItems - 1 : changeNum % maxItems;
        changeCarousel(changeNum);
    };

    const getDisplayLocations = () => {
        const displayLocations = [];
        const displayCount = Math.min(maxItems, locations.length); // 표시할 아이템 개수 계산
        for (let i = 0; i < displayCount; i++) {
            displayLocations.push(locations[i % locations.length]);
        }
        return displayLocations;
    };

    return (
        <div className="destination-slider owl-carousel ftco-animate owl-loaded owl-drag">
            <div className="owl-stage-outer">
                <div className="owl-stage gallery-carousel" style={{ transform: "translate3d(0px, 0px, 0px)", transition: "0.25s", width: `${(carouselItemWidth + 30) * Math.min(maxItems, locations.length)}px` }}>
                    {
                        getDisplayLocations().map((e, i) => {
                            const region = regions.find(r => r.name === e.location);
                            return (
                                <div key={i} className="owl-item active" style={{ width: `${carouselItemWidth}px`, marginRight: "30px" }}>
                                    <div className="item">
                                        <div className="destination">
                                            <a href="/traveler/tour" className="img d-flex justify-content-center align-items-center" style={{ backgroundImage: `url(${region?.image})` }}>
                                                <div className="icon d-flex justify-content-center align-items-center">
                                                    <span className="icon-search2"></span>
                                                </div>
                                            </a>
                                            <div className="text p-3">
                                                <h3><a href="/traveler/tour">{e.location}</a></h3>
                                                <span className="listing">{e.count} 개의 리스트</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
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
                    Array.from({ length: Math.ceil(maxItems / carouselItemNum) }, (_, i) => i).map((i) => (
                        <button key={i} className={`owl-dot gallery-dot ${i === 0 ? 'active' : ''}`} onClick={_ => handleDotClick(i)}>
                            <span></span>
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default GalleryCarouselTour;