import { match } from 'assert';
import React from 'react'

const JwtEncodingAtobDemo1: React.FC = () => {
    const encodeDemo = (str:string) => {
        return btoa(str);
    }

    const decodeDemo = (encodedStr:string) => {
        return atob(encodedStr);
    }

    const encodeDemo2 = (obj: any) => {
        const jsonStr = JSON.stringify(obj);
        return btoa(jsonStr);
    }

    const decodeDemo2 = (encodedStr: string) => {
        const jsonStr = atob(encodedStr);
        return JSON.parse(jsonStr);
    }

    // Base64 인코딩 함수 - 객체를 JSON 문자열로 변환 후 인코딩
       //유니코드 일경우는 오류가 난다. 그래서 혹시라도 인코딩된  권한 부분이 한글일 경우는 유니코드 처리를 해야 한다
       const encodeDemo3 = (obj: any) => {
        //JSON.stringify()로 객체를 JSON 문자열로 변환
        const jsonStr = JSON.stringify(obj);
        return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g,
          (match, p1) =>  String.fromCharCode(parseInt(p1, 16))
      ));
    }

    const decodeDemo3 = (encodedStr: string) => {
        const jsonStr = atob(encodedStr);
        return JSON.parse(decodeURIComponent(jsonStr));
    }

    const decodeDemoLast = (encodedStr: string) => {
        //JSON.parse()로 JSON 문자열을 다시 객체로 변환
        return JSON.parse(decodeURIComponent(
          atob(encodedStr)
          .split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''))
      );
    }

    
  return (
    <div>
      <h2>atob() Demo1</h2>
      <p>encodeDemo : {encodeDemo('teacher@naver.com')}</p>
      <p>decodeDemo : {decodeDemo(encodeDemo('teacher@naver.com'))}</p>
      <h2>atob() Demo2 : json</h2>
      <p>encodeDemo : {encodeDemo2({sub:'teacher01@naver.com', role:'TEACHER'})}</p>
      <p>encodeDemo : {JSON.stringify(decodeDemo2(encodeDemo2({sub:'teacher01@naver.com', role:'TEACHER'})))}</p>
      <h2>atob() Demo3 : json </h2>
        <p>btoa() - Base64 Encoding = encodeDemo3(객체) : {encodeDemo3({sub:"teacher01@gmail.com",role:"티쳐",iat:1732783559,exp:1732787159})}</p>
        <p>atob() - 한글은 깨져서 디코딩이 된다. = decodeDemo3(인코딩된 문자열) : {JSON.stringify(decodeDemo3(encodeDemo3({sub:"teacher01@gmail.com",role:"티쳐",iat:1732783559,exp:1732787159})))}</p>

      <h2>atob(), decodeURIComponent() ,  퍼센트 인코딩</h2>
        <p>atob() - 한글등이 된다. = decodeDemoLast(인코딩된 문자열) : {JSON.stringify(decodeDemoLast(encodeDemo3({sub:"teacher01@gmail.com",role:"티쳐",iat:1732783559,exp:1732787159})))}</p>
    
        
    </div>
  )
}

export default JwtEncodingAtobDemo1