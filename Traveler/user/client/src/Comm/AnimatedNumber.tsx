// 2025.01.23. 17:45 생성자: 이학수, 숫자 증가 애니메이션 컴포넌트
import React, { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number; // 최종 숫자
  duration?: number; // 애니메이션 지속 시간 (기본값: 7000ms)
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 7000 }) => {
  const [currentValue, setCurrentValue] = useState(0); // 현재 숫자 상태
  const startValue = useRef(0); // 초기 숫자 값
  const startTime = useRef<number | null>(null); // 애니메이션 시작 시간

  // 숫자에 콤마 추가하는 함수
  const formatNumber = (num: number): string => {
    return num.toLocaleString(); // 1,234,567 형태로 반환
  };

  // 애니메이션 함수
  const animate = (timestamp: number) => {
    if (!startTime.current) startTime.current = timestamp; // 시작 시간 설정
    const elapsed = timestamp - (startTime.current || 0); // 경과 시간 계산
    const progress = Math.min(elapsed / duration, 1); // 진행률 (0 ~ 1)
    const newValue = Math.floor(startValue.current + progress * (value - startValue.current));

    setCurrentValue(newValue); // 현재 숫자 업데이트

    if (progress < 1) {
      requestAnimationFrame(animate); // 계속 애니메이션 실행
    }
  };

  // 애니메이션 초기화 및 실행
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".number");
    if (!elements) return;
    const observer = new IntersectionObserver(_ => {
      startValue.current = currentValue; // 초기 값을 현재 값으로 설정
      startTime.current = null; // 시작 시간 초기화
      requestAnimationFrame(animate); // 애니메이션 실행
    }, { threshold: 0.1 })
    elements.forEach((el) => observer.observe(el));
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <strong className="number">{formatNumber(currentValue)}</strong>;
};

export default AnimatedNumber;
