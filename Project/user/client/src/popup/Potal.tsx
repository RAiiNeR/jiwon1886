import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
    children: ReactNode; // children은 ReactNode 타입으로 지정
    elementId: string;   // elementId는 string 타입으로 지정
}

const Portal: React.FC<PortalProps> = ({ children, elementId }) => {
    // elementId로 지정된 DOM 요소를 찾습니다.
    const rootElement = document.getElementById(elementId);

    // 지정된 DOM 요소가 있으면 children을 렌더링, 없으면 null 반환
    return rootElement ? ReactDOM.createPortal(children, rootElement) : null;
};

export default Portal;
