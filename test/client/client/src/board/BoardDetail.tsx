import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

interface BoardVO {
    num: number;
    title: string;
    writer: string;
    content: string;
    hit: number;
    bdate: string;
}

const BoardDetail: React.FC = () => {
    const { num } = useParams();
    const [board, setBoard] = useState<BoardVO | null>(null); //인터페이스로 자료형을 선언해놓으면 가끔 에러나는 경우가 있어서 null값으로 초기화해준다
    const navigate = useNavigate();

    const getDetail = async () => {
        try {
            const response = await axios.get('http://localhost:80/test/api/board/detail?num=' + num);
            setBoard(response.data);
        } catch (error) {
            console.log('Error Message: ' + error);
        }
    }

    useEffect(() => {
        //서버로부터 /api/detail/:num을 받음
        getDetail();
    },[]);

    //보드에 내용이 없을때는 이게 실행되므로 밑에 board?.title같은 물음표가 나타나지 않는다
    //이게 출력되면 디테일이 잘못된것을 의미한다
    if (!board) {
        return <div>로딩중입니다...</div>
    }

    const handleDeleteClick = async() => {
        try {
            const response = await axios.delete('http://localhost:80/test/api/board?num='+num);
            setBoard(response.data);
            navigate('/');
        } catch (error) {
            console.log('error',error);
        }
    }

    return (
        <div>
            <h3>{board.title}</h3>
            <p>번호 : {board.num}</p>
            <p>작성자 : {board.writer}</p>
            <p>내용 : {board.content}</p>
            <p>작성일 : {board.bdate}</p>
            <button onClick={handleDeleteClick}>삭제</button>
        </div>
    )
}

export default BoardDetail