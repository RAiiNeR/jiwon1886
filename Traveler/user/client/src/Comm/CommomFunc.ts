// 2025.01.22. 11:32 생성자: 이학수, 공통 함수 집합


// 스크롤 이동을 감지해서 위치 변환 및 투명도 조절 함수
export const handleScroll = () => {
    const elements = document.querySelectorAll("[data-scrollax]")
    const scrollPosition = window.scrollY;
    elements.forEach((element: any) => {
        const config = JSON.parse(element.getAttribute("data-scrollax") || "{}").properties;
        const translateY = config.translateY || "0px";
        const translateX = config.translateX || "0px";
        const opacity = config.opacity || 1;

        const yValue = parseFloat(translateY) * (1 - Math.exp(-0.01 * scrollPosition));
        const xValue = parseFloat(translateX) * (1 - Math.exp(-0.01 * scrollPosition));
        const opacityValue = opacity / (opacity + scrollPosition * 0.1);

        element.style.transform = `translate(${xValue}px, ${yValue}%)`;
        element.style.opacity = opacityValue;
    });
};

// 등장 애니메이션 적용 함수
export const appear_animate = () => {
    const elements = document.querySelectorAll<HTMLElement>(".ftco-animate");
    if (!elements) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const element = entry.target as HTMLElement;

                if (entry.isIntersecting && !element.classList.contains("ftco-animated")) {
                    element.classList.add("item-animate");

                    setTimeout(() => {
                        document.querySelectorAll(".ftco-animate.item-animate").forEach((item, index) => {
                            const el = item as HTMLElement;
                            setTimeout(() => {
                                const effect = el.dataset.animateEffect || "fadeInUp"; // Default effect
                                if (effect === "fadeIn") {
                                    el.classList.add("fadeIn", "ftco-animated");
                                } else if (effect === "fadeInLeft") {
                                    el.classList.add("fadeInLeft", "ftco-animated");
                                } else if (effect === "fadeInRight") {
                                    el.classList.add("fadeInRight", "ftco-animated");
                                } else {
                                    el.classList.add("fadeInUp", "ftco-animated");
                                }
                                el.classList.remove("item-animate");
                            }, index * 50);
                        });
                    }, 100);
                }
            });
        },
        { threshold: 0.1 } // Equivalent to offset: '95%'
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
        elements.forEach((el) => observer.unobserve(el));
    };
}

// 요소의 높이를 화면의 크기로 갱신해주는 함수
export const updateHeight = () => {
    const elements = document.querySelectorAll('.js-fullheight')
    elements.forEach((element: any) => {
        element.style.height = `${window.innerHeight}px`;
    });
};

// 요소의 높이를 화면의 크기의 반으로 갱신해주는 함수
export const updateHalfHeight = () => {
    const elements = document.querySelectorAll('.js-halfheight')
    elements.forEach((element: any) => {
        element.style.height = `${Math.max(window.innerHeight/2, 100)}px`;
    });
};