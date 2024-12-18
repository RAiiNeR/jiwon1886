import React, { useEffect, useRef, useState } from 'react';
import '@toast-ui/editor/dist/i18n/ko-kr'; // 한국어 번역
import { Editor } from '@toast-ui/react-editor';
import colorPlugin from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/toastui-editor.css';
import { EditorType } from '@toast-ui/editor'; // Editor 타입 정의
import codeSyntaxHighlightPlugin from '@toast-ui/editor-plugin-code-syntax-highlight';
import { Link, useNavigate } from 'react-router-dom';
import "tui-color-picker/dist/tui-color-picker.css"; // TUI 컬러 피커 스타일
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "prismjs/themes/prism.css"; // 코드 하이라이트 테마
import axios from 'axios';
import './css/SuggestionForm.css';  // CSS 파일 import
import VoteModal from './VoteModal'; // 투표 모달 컴포넌트
import { parseJwt } from '../comp/jwtUtils';

const SuggestionForm: React.FC = () => {
  const [mNum, setMNum] = useState('');
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File>();
  const [images, setImages] = useState<File[]>([]);
  const [imageName, setImageName] = useState<string>();
  const [imageNames, setImageNames] = useState<string[]>([]);
  const editorRef = useRef<Editor>(null);    //editor 초기값 null 설정
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      setWriter(decodedToken.name); // 작성자
      setMNum(decodedToken.num); // 사용자 번호
    }
  }, []);

  /*----------------------------투표관련-------------------------------*/
  const [voteData, setVoteData] = useState<any>(null); // 투표 데이터를 임시로 저장
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false); // 투표 모달 상태
  // 투표 모달 열기
  const handleVoteModalOpen = () => setIsVoteModalOpen(true);

  // 투표 모달 닫기
  const handleVoteModalClose = () => setIsVoteModalOpen(false);

  // 투표 데이터 저장
  const handleSaveVote = (data: any) => {
    console.log('임시 저장된 투표 데이터:', data);
    // 유효성 검사
    if (!data || !Array.isArray(data.options)) {
      console.error("유효하지 않은 데이터:", data);
      alert("투표 데이터가 올바르지 않습니다. 다시 시도해주세요.");
      return;
    }
    // 각 옵션 데이터 확인
    data.options.forEach((option: any, index: number) => {
      console.log(`옵션 ${index} - 텍스트: ${option.text}, 이미지 URL: ${option.image_url}`);
    });
    console.log("서버로보내기전 확인: " + data.end_date);
    setVoteData(data); // 투표 데이터를 임시로 저장
    setIsVoteModalOpen(false); // 모달 닫기
  };
  /*----------------------------------------------------------------------------*/

  // 에디터 내용이 변경될 때
  const handleEditorChange = (e: EditorType) => {
    const data = document.getElementsByClassName('ProseMirror')[1].innerHTML; //prosemirror클래스를 읽어서 data에 넣는다.
    setContent(data);
  }

  useEffect(() => {
    // 1. DB에서 가져온 HTML이라고 가정
    const htmlString = '';
    // 2. Editor DOM 내용에 HTML 주입
    editorRef.current?.getInstance().setHTML(htmlString);
  }, []);

  useEffect(() => {
    if (image !== undefined) setImages([...images, image as File]);
  }, [image])

  useEffect(() => {
    if (imageName !== undefined) setImageNames([...imageNames, imageName as string]);
  }, [imageName])

  // 에디터 내용에서 이미지 경로 업데이트
  const changeContentData = (data: string, fileIndex: number): string => {
    let start = data.indexOf(`src="data:`); // 이미지 시작 위치
    let end = data.indexOf(`" alt="[사진]"`) + 12; // 이미지 끝 위치
    if (start === -1) return data; // 이미지가 없으면 종료
    else {
      let dataFront = data.substring(0, start) + "IMG_PATH_" + imageNames[fileIndex] // 이미지 경로 변경
      let dataElse = data.substring(end);
      return dataFront + changeContentData(dataElse, fileIndex + 1);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 검증
    if (!title || !writer || !content) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const contentData = changeContentData(content, 0); // 이미지 경로 변환 : 이미지를 Base64 인코딩된 데이터 URL 형태로 저장해서 변환해줘야 함

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("writer", writer);
      formData.append("content", contentData);
      formData.append("mnum", mNum as string);
      images.forEach((file, index) => {
        formData.append(`images`, file); // 이미지 파일 추가
      })

      const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/suggestion`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      /*------------------------------------------------------------------*/
      const createdBoardId = response.data.num; // 생성된 게시글 ID
      // 투표 데이터가 존재하면 함께 저장
      if (voteData && Array.isArray(voteData.options)) {
        const pollData = {
          ...voteData,
          sbnum: createdBoardId, // 게시글 ID와 연결
          options: voteData.options.map((option: any) => ({
            text: option.text,
            image_url: option.image_url,
          })), // 객체 배열로 변환
        };

        console.log("투표 데이터 전송:", pollData);
        try {
          const pollResponse = await axios.post(
            `${process.env.REACT_APP_BACK_END_URL}/api/polls`, pollData);
          console.log('투표 데이터 저장 성공:', pollResponse.data);
        } catch (poollError) {
          console.error("투표 데이터 저장 중 오류 발생:", poollError);
          alert("투표 저장중 오류가 발생했습니다")
        }
      }
      /*------------------------------------------------------------------*/
      navigate('/suggestion'); // 제안 목록으로 이동
    } catch (error) {
      console.log('Error Message:' + error);
    }
  };

  return (
    <div className="SuggestionForm">
      <h2>제안 신청</h2>
      <form onSubmit={handleSubmit}>
        <div className='center'>
          <label htmlFor="title" className='col-sm-1 col-form-label'>제목</label>
          <input type='text' name='title'
            value={title}
            placeholder=' 제목을 입력해주세요'
            onChange={e => setTitle(e.target.value)}
            required
            style={{
              width: '500px', height: '35px'
            }}
          />
        </div>
        <div className='writer'>
          <label htmlFor="title" className='col-sm-1 col-form-label'>작성자</label>
          <input type='text'
            value={writer}
            readOnly
            required
            style={{
              width: '500px', height: '35px'
            }} />
        </div>

        <hr />
        {/* <div className='charCnt' style={{
          display: 'flex',
          justifyContent: 'center',
          margin: 'auto',
          float: 'right'
        }}>0/200</div> */}
        <div className='edit-wrap'>
          <Editor
            ref={editorRef} // useRef로 DOM 연결
            previewStyle="vertical"
            height="500px"  //
            language='ko-KR'  //언어 설정 한국어
            initialEditType="wysiwyg"
            usageStatistics={false}
            hideModeSwitch={true}
            plugins={[codeSyntaxHighlightPlugin, colorPlugin]}
            onChange={handleEditorChange}
            hooks={{  //사진을 읽어주기 위하여 hooks 활요하기
              //blob:첨부된 이미지를 File 객체 형태로 받는다.
              //callback(url,string):img 태그를 만들어 화면에 이미지를 표시한다.
              //- 인자로 받은 url(이미지 경로)를 img태그의 src에 주입하고, 
              //text인자로 받은 값은 alt에 주입
              addImageBlobHook: async (blob, callback) => {
                // console.log(blob);  //file name:
                const file = blob as File; //file 이라는 변수선언
                setImage(file); // 사진값,파일 배열 형식 선언
                setImageName(file.name);
                // console.log(file)   //바이너리 코드 출력
                const reader = new FileReader();  //파일을 읽어준다.(reader로 읽어줌)
                reader.readAsDataURL(file);   //바이너리 코드를 url로 읽어준다
                reader.onloadend = () => {     //사진 읽어주는거 마치기(loadend)
                  const f = reader.result as string
                  // console.log(1,f);
                  callback(f, "[사진]");
                  //사진주소, file이름
                }
              },
            }}
          />
        </div>
        <div className='d-flex justify-content-end'>
          {/* ------------------투표관련-------------------------- */}
          <button type="button" onClick={handleVoteModalOpen} className='btn btn-primary'>
            투표 추가
          </button>&nbsp;
          <VoteModal
            isOpen={isVoteModalOpen}
            onClose={handleVoteModalClose}
            onSave={handleSaveVote}
            cbnum={0} // 게시글 번호 전달
          />
          {/* ------------------------------------------------- */}
          <button type='submit' className='btn btn-primary'>제출</button>&nbsp;
          <Link to={"/suggestion"} className='btn btn-primary'>리스트</Link>
        </div>
      </form>
    </div>
  );
};


export default SuggestionForm