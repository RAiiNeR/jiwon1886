import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

interface BoardVO {
    num: number;
    title: string;
    writer: string;
    content: string;
    img_names:string[];
    hit: number;
    bdate: string;
}

const BoardDetail: React.FC = () => {
    const {num} = useParams();
    const [board, setBoard] = useState<BoardVO>();
    const navigate = useNavigate();
    //파일을 찾을 경로를 추가
    const filePath = 'http://localhost:81/back/resources/imgfile/';

    useEffect(()=>{
        const getDetail = async () => {
            try {
                // 서버로부터 /api/board/detail 을 호출해서 정보를 받아온다.
                const response = await axios.get('http://localhost:81/back/api/board/detail?num=' + num);
                setBoard(response.data);
            } catch (error) {
                console.log('Error Message: ' + error);
            }
        }
        getDetail();
    },[num]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete('http://localhost:81/back/api/board?num=' + num);
            console.log(response.data);
            navigate("/");
        } catch (error) {
            console.log('Error Message: ' + error);
        }
    }

    if(!board){
        return <div>로딩 중~</div>
    }

    return (
        <div>
            <h3>{board.title}</h3>
            <p>번호: {board.num}</p>
            <p>작성자: {board.writer}</p>
            <p>내용: {board.content}</p>
            <p>작성일: {board.bdate}</p>
            {
                board.img_names.map((item,index)=> (
                    <img key={index} src={filePath + item} alt={board.title}
                    style={{width:'150px', height:'150px'}}/>
                ))
            }
            <p></p>
            <Link to={'/'}>리스트</Link>
            <button type='button' onClick={handleDelete}>삭제</button>
        </div>
    )
}

export default BoardDetail