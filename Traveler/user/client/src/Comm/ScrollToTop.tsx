// 2025.01.24. 09:24 생성자: 이학수, 페이지 이동시 스크롤 상단 이동
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // 스크롤 상단으로 이동
  }, [pathname]); // 경로(pathname)가 변경될 때마다 실행

  return null;
};

export default ScrollToTop;
