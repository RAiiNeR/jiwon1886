import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

//json데이터임과 동시에 오라클에 있는 데이터를 나타내는 것이다.
interface BoardVO {
    num: number;
    title: string;
    writer: string;
    content: string;
    hit: number;
    bdate: string;
}

const BoardList: React.FC = () => {
    //boardvo를 배열로 받기 위해 useState를 사용
    //데이터가 많으면(100개, 200개... ) 하나하나 치기 어려우니까 배열로 받게된다
    const [boardList, setBoardList] = useState<BoardVO[]>([]);


    useEffect(() => {
        const getBoardList = async () => { //async = 비동기식으로 진행
            //예외발생하는것을 막기위해 trycatch사용
            try {
                //요구(데이터를 넣는다) & 응답
                const response = await axios.get('http://localhost:80/test/api/board'); //정상적으로 응답이 되면 이곳이 출력된다
                setBoardList(response.data);
            } catch (error) {
                console.log("오류 : ",error);
            } 
        }
        getBoardList();
    }, []);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>작성일</th>
                    </tr>
                </thead>

                <tbody>
                    {/* tbody안에 useEffect로 인해 추가된 useState(배열)내용이 반복이 된다 */}
                    {
                        boardList.map((item) => (
                            <tr key={item.num}>
                                <td>{item.num}</td>
                                {/* /뒤에 번호가 붙으면서 해당 페이지로 넘어감 */}
                                <td><Link to={`/${item.num}`}>{item.title}</Link></td>
                                <td>{item.writer}</td>
                                <td>{item.hit}</td>
                                <td>{item.bdate}</td>
                            </tr>
                        ))
                    }
                </tbody>

                <tfoot>
                    <tr>
                        <td colSpan={5}>
                            <Link to={'/boardForm'}>글쓰기</Link>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default BoardList