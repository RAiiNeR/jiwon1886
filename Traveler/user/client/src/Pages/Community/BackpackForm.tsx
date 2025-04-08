import React, { useEffect, useRef, useState } from 'react';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor } from '@toast-ui/react-editor';
import colorPlugin from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/toastui-editor.css';
import codeSyntaxHighlightPlugin from '@toast-ui/editor-plugin-code-syntax-highlight';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "prismjs/themes/prism.css";
import { appear_animate, handleScroll, updateHalfHeight } from '../../Comm/CommomFunc';
import { Trie } from '../../Comm/Trie';
import axios from 'axios';
import wordsData from './words.json';
import { parseJwt } from '../../Comm/jwtUtils';


const BackpackForm: React.FC = () => {
    const [backpack, setBackpack] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [roomNum, setRoomNum] = useState<number | null>(null);
    const [tag, setTag] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [image, setImage] = useState<File>();
    const [images, setImages] = useState<File[]>([]);
    const [imageName, setImageName] = useState<string>();
    const [imageNames, setImageNames] = useState<string[]>([]);
    const words: string[] = wordsData.words; // JSON 데이터 배열로 변환
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
    const editorRef = useRef<Editor>(null);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userToken, setUserToken] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = parseJwt(token); // JWT 파싱
                if (decodedToken && decodedToken.num) { // num 필드 확인
                    setIsLoggedIn(true);
                    setUserToken(decodedToken.num);
                } else {
                    console.error("토큰에서 사용자 번호를 찾을 수 없습니다.");
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("토큰 파싱 오류:", error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);


    useEffect(() => {
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        appear_animate();
    }, []);

    useEffect(() => {
        updateHalfHeight();
        window.addEventListener("resize", updateHalfHeight);
        return () => window.removeEventListener("resize", updateHalfHeight);
    }, []);


    // Trie 자동완성 기능 추가
    const trie = new Trie();
    words.forEach((word) => trie.insert(word));

    useEffect(() => {
        // 기존에 작성된 데이터를 가져오는 API 호출 (수정 모드)
        const fetchPostData = async () => {
            try {
                const postId = new URLSearchParams(window.location.search).get("id"); // URL에서 postId 가져오기
                if (!postId) return; // 새 글 작성이면 종료

                const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/backpack/${postId}`);
                const data = response.data;

                setTitle(data.title);
                setRoomNum(data.roomNum);
                setTag(data.tags);
                setImages(data.images);
                setImageNames(data.imageNames);

                // ToastUI Editor에 기존 HTML 내용 로드
                if (editorRef.current) {
                    editorRef.current.getInstance().setHTML(data.content);
                }
            } catch (error) {
                console.error("게시글 불러오기 실패:", error);
            }
        };

        fetchPostData();
    }, []);

    // Editor 내용이 변경될 때 호출되는 함수 (자동완성 기능 유지)
    const handleEditorChange = () => {
        if (editorRef.current) {
            const instance = editorRef.current.getInstance();
            const contentHtml = document.getElementsByClassName('ProseMirror')[1].innerHTML; // ProseMirror에서 HTML 읽기
            setContent(contentHtml); // 상태 업데이트

            // 자동완성 기능 유지
            const content = instance.getMarkdown();
            const words = content.split(/\s+/);
            const lastWord = words[words.length - 1];

            if (lastWord.length > 1) {
                setBackpack(trie.searchPrefix(lastWord));

                // 커서 위치 가져오기
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    const editorScrollTop = instance.getScrollTop();
                    setCursorPosition({
                        x: rect.left,
                        y: rect.top + editorScrollTop + 25
                    });
                }
            } else {
                setBackpack([]);
            }
        }
    };

    // 태그를 제거하여 순수한 텍스트만 저장
    const stripHtmlTags = (html: string): string => {
        return html.replace(/<[^>]*>/g, "").trim(); // HTML 태그 제거
    };

    // 자동완성 단어 클릭 시: 기존 단어를 대체하고 삽입
    const handleSuggestionClick = (word: string) => {
        if (editorRef.current) {
            const instance = editorRef.current.getInstance();
            const content = instance.getMarkdown();
            const words = content.split(/\s+/);
            words[words.length - 1] = word; // 기존 단어를 새로운 단어로 대체
            instance.setMarkdown(words.join(" ") + " "); // 업데이트

            setTimeout(() => {
                setBackpack([]); // 자동완성 목록 닫기 (딜레이 적용)
                instance.focus(); // 강제 포커스 유지
            }, 100); // 클릭 이벤트가 먼저 실행되도록 조정
        }
    };

    // 해시태그 추가 (5개 제한, 10자 이하 제한)
    const handleTagKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && tagInput.trim() !== "") {
            event.preventDefault();

            // 해시태그 개수 제한 (최대 5개)
            if (tag.length >= 5) {
                alert("해시태그는 최대 5개까지 추가할 수 있습니다.");
                return;
            }

            // 해시태그 길이 제한 (최대 10자)
            if (tagInput.length > 10) {
                alert("해시태그는 최대 10자까지 입력할 수 있습니다.");
                return;
            }

            // 중복 태그 방지
            if (!tag.includes(tagInput.trim())) {
                setTag([...tag, tagInput.trim()]);
            } else {
                alert("이미 추가된 태그입니다.");
            }
            setTagInput("");
        }
    };

    // 해시태그 삭제 
    const removeTag = (tagToRemove: string) => {
        setTag(tag.filter(tag => tag !== tagToRemove));
    };

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

    const contentData = changeContentData(content, 0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title || !content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        if (!userToken) { // 로그인 여부 확인
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);

            // HTML에서 태그 제거한 순수 텍스트만 저장
            const plainTextContent = stripHtmlTags(contentData);
            formData.append("content", plainTextContent);

            // formData.append("memberNum", "53");
            formData.append("memberNum", String(userToken));
            if (roomNum !== undefined && roomNum !== null) {
                formData.append("roomNum", String(roomNum));
            } else {
                formData.append("roomNum", "");
            }

            tag.forEach(tag => formData.append("tag", tag));
            images.forEach((file) => formData.append("images", file));

            const postId = new URLSearchParams(window.location.search).get("id");

            if (postId) {
                // 수정 모드 (기존 게시글 업데이트)
                const response = await axios.put(`${process.env.REACT_APP_BACK_END_URL}/api/backpack/update/${postId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log("게시글 수정 성공:", response.data);
            } else {
                // 새 게시글 등록
                const response = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/backpack/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // ✅ 비속어 감지된 경우 게시글을 등록하지 않음
                if (response.data.error) {
                    console.log("🚨 비속어 감지됨, 관리자 블랙리스트에 추가됨.");
                    return;
                }

                console.log("게시글 등록 성공:", response.data);
            }

            navigate('/traveler/community');
        } catch (error) {
            console.error("백엔드 전송 오류:", error);
            alert("게시글 저장에 실패했습니다.");
        }
    };

    return (
        <div className="like-memo">
            {/* 헤더 부분 */}
            <div className="like-memo-hero-wrap js-halfheight"
                style={{
                    backgroundImage: "url('./images/backpack.jpg')",
                    minHeight: '400px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}>
                <div className="like-memo-overlay"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.3)',
                        pointerEvents: 'none'
                    }}></div>
                <div className="like-memo-container text-center"
                    style={{ position: 'relative', zIndex: 2 }}>
                    <h1 className="like-memo-title mb-3 bread"
                        style={{ color: 'white', fontSize: '36px', fontWeight: 'bold' }}>나의 배낭</h1>
                </div>
            </div>

            {/* 입력 폼 박스 내부 정렬 */}
            <div className="like-memo-container"
                style={{ maxWidth: '900px', margin: '50px auto', padding: '20px' }}>
                <div className="like-memo-suggestion-form">
                    <h2 style={{ textAlign: 'center' }}>배낭 후기</h2>
                    <form onSubmit={handleSubmit}>
                        {/* 제목 입력 */}
                        <div className='like-memo-input-group' style={{ marginBottom: '15px' }}>
                            <label htmlFor="title" className='like-memo-label'>제목</label>
                            <input type='text'
                                name='title'
                                value={title}
                                placeholder='제목을 입력해주세요'
                                onChange={e => setTitle(e.target.value)}
                                required className="like-memo-input"
                                style={{ width: '100%', height: '40px' }} />

                            {roomNum !== null && roomNum !== undefined && (
                                <div className='like-memo-input-group' style={{ marginBottom: '15px' }}>
                                    <label htmlFor="roomNum" className='like-memo-label'>이용한 객실 번호</label>
                                    <input
                                        type='text'
                                        name='roomNum'
                                        placeholder='객실 번호를 입력해주세요'
                                        value={roomNum || ''}
                                        onChange={e => setRoomNum(Number(e.target.value))}
                                        className="like-memo-input"
                                        style={{ width: '100%', height: '40px' }}
                                    />
                                </div>
                            )}


                            {/* 해시태그 입력 */}
                            <div className='like-memo-input-group' style={{ marginBottom: '15px' }}>
                                <label htmlFor="tag" className='like-memo-label'>해시태그 (최대 5개, 10자 제한)</label>
                                <input type='text'
                                    name='tag'
                                    placeholder='해시태그 입력 후 Enter 키를 누르세요'
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleTagKeyPress}
                                    className="like-memo-input"
                                    style={{ width: '100%', height: '40px' }} />
                            </div>

                            {/* 추가된 해시태그 리스트 */}
                            <div className="like-memo-tagcloud" style={{ marginBottom: '15px' }}>
                                {tag.map((tag, index) => (
                                    <span key={index} className="like-memo-tag" onClick={() => removeTag(tag)}
                                        style={{
                                            display: 'inline-block',
                                            backgroundColor: '#FF5A5F',
                                            color: 'white',
                                            padding: '5px 10px',
                                            borderRadius: '20px',
                                            marginRight: '10px',
                                            cursor: 'pointer'
                                        }}>
                                        #{tag} ✕
                                    </span>
                                ))}
                            </div>

                            <hr />

                            {/* Toast UI Editor */}
                            <div className="like-memo-edit-wrap" style={{ position: "relative" }}>
                                <Editor
                                    ref={editorRef}
                                    previewStyle="vertical"
                                    height="500px"
                                    language='ko-KR'
                                    initialEditType="wysiwyg"
                                    usageStatistics={false}
                                    hideModeSwitch={true}
                                    plugins={[codeSyntaxHighlightPlugin, colorPlugin]}
                                    onChange={handleEditorChange}
                                    hooks={{
                                        // 이미지를 표시하기 위해 Hooks를 활용하여 blob 형식의 File 객체를 받아 img 태그에 주입한다.
                                        // callback(url, string)을 사용해 url은 src, text는 alt 속성으로 설정하여 화면에 이미지가 표시되도록 한다.
                                        addImageBlobHook: async (blob, callback) => {
                                            // console.log(blob);  //file name:
                                            const file = blob as File; //file 이라는 변수선언
                                            setImage(file); // 사진값,파일 배열 형식 선언
                                            setImageName(file.name);

                                            const reader = new FileReader();  //파일을 읽어준다.(reader로 읽어줌)
                                            reader.readAsDataURL(file);   //바이너리 코드를 url로 읽어준다
                                            reader.onloadend = () => {     //사진 읽어주는거 마치기(loadend)
                                                const f = reader.result as string
                                                callback(f, "[사진]");
                                            }
                                        },
                                    }}
                                />

                                {/* 자동완성 드롭다운 */}
                                {backpack.length > 0 && cursorPosition && (
                                    <div className="like-memo-autocomplete-dropdown"
                                        style={{
                                            position: "fixed",
                                            top: cursorPosition.y + "px",
                                            left: cursorPosition.x + "px",
                                            background: "white",
                                            border: "1px solid #ddd",
                                            borderRadius: "5px",
                                            padding: "5px",
                                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                            zIndex: 9999 // 자동완성 목록이 다른 요소 위에 올라오도록 설정
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()} // 자동완성 목록 클릭 방해 방지
                                    >
                                        {backpack.map((word, index) => (
                                            <div key={index}
                                                onMouseDown={(e) => {
                                                    e.preventDefault(); // 기본 클릭 이벤트 방지
                                                    e.stopPropagation(); // 자동완성 목록이 사라지는 것을 방지

                                                    handleSuggestionClick(word);
                                                    setTimeout(() => {
                                                        if (editorRef.current) {
                                                            editorRef.current.getInstance().focus(); // 강제 포커스 유지
                                                        }
                                                    }, 0);
                                                }}
                                                style={{
                                                    padding: "10px",
                                                    cursor: "pointer",
                                                    transition: "background 0.2s ease-in-out",
                                                    userSelect: "none" // 클릭 후 텍스트 자동 선택 방지
                                                }}
                                            >
                                                {word}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 등록하기 버튼 */}
                        <div className="like-memo-button-container" style={{ textAlign: 'center', marginTop: '40px', marginBottom: '100px' }}>
                            <button
                                type="submit"
                                className="like-memo-btn"
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: '#FF5A5F',
                                    color: 'white',
                                    padding: '12px 20px',
                                    borderRadius: '30px',
                                    textDecoration: 'none',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    transition: 'background 0.3s',
                                    cursor: 'pointer',
                                    border: 'none',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E04848'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF5A5F'}
                            >
                                {new URLSearchParams(window.location.search).get("id") ? "수정하기" : "등록하기"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div >
    );
};

export default BackpackForm;