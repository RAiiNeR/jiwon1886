// comp/jwtUtils.ts

import axios from "axios";

/*
   JWT란?
   - 클라이언트와 서버 간에 정보를 안전하게 전송하기 위한 JSON 기반의 토큰
   - Header: 토큰의 유형(JWT)과 해싱 알고리즘 정보
   - Payload: 실제 데이터(예: 사용자 ID, 권한 등)를 포함
   - Signature: 토큰이 변조되지 않았음을 증명하기 위해 서명된 값
   - .으로 구분된 세 부분으로 이루어져 있고, 각각 Base64(텍스트 데이터)로 인코딩
   -> header.payload.signature
*/ 
export const parseJwt = (token: string) => {  
    try {
      // . 으로 나눠 배열을 만들고 payload 가져옴
      // payLoad는 배열에서 1번째에 해당이 된다.
      const payLoad = token.split('.')[1];
      // console.log("**payLoad**");
      // console.log(`payLoad : ${payLoad}`);
      const jsonPayload = decodeURIComponent( // payLoad 부분 읽을 수 있게 JSON문자열로 변환
        atob(payLoad) 
          .split('') // 문자열 -> 문자자배열
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)) // 문자를 URL 형식으로 변환
          .join('') // 변환된 문자를 다시 문자열로 합침
      );

      // console.log(`jsonPayload : ${jsonPayload}`);
      // console.log(`JSON.parse(jsonPayload):${JSON.parse(jsonPayload).sub}, Role: ${JSON.parse(jsonPayload).role}`);
      // console.log("**payLoad**");

      return JSON.parse(jsonPayload); // payload 문자열을 JavaScript 객체로 변환
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };