import React, { useState } from 'react'

interface FormData{
    gno:number;
    writer:string;
    title:string;
    description:string;
    //https://developer.mozilla.org/ko/docs/Web/API/File
    //File Interface는 자바스크립트에서 파일을 접근할 수 있는 자바스크립트 객체이다.
    images:File | null;
}

const GalleryFormBack: React.FC = () => {
    //자바스크립트 오브젝트형 State를 선언하고 초기화함
    const [formData, setFormData] = useState<FormData>({
        gno:0,
        writer:'',
        title:'',
        description:'',
        images:null
    });

    //File객체를 사용해서 미리보기 State를 초기화한다
    //파일을 받아올때 string이나 ArrayBuffer로 들어옴
    //속도를 보장하기 위해 용량을 가지고 있는 것 : ArrayBuffer
    //<>이 세가지 타입중에 하나를 받아올 수 있게 
    const [preview, setPreview] = useState<string|ArrayBuffer|null>(null);

    const handleSubmit = () => {
        //이곳에서 formData state를 전송하는것이 목표!!!
    };

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        //Change폼의 데이터를 로깅
        const {name, value, files} = e.target;
        console.log(`AllNames : ${name} : ${value}`);
        if (name === 'images' && files && files[0]) { //file이 존재할 경우
            console.log(`ImageName : ${name} : ${value} | ${files[0]}`); 
            //자바스크립트 FileReader()를 사용해서 읽어온다. value는 문자열이고, files은 오브젝트
            const file = files[0];

            //이미지를 스크립트에서 읽어오기 위한 문법 ----------------<file객체 읽어들임>-------------------------
            const reader = new FileReader();
            //자기자신을 읽는것 : 파일리더
            reader.onloadend = () => { //여기가 파일스트림이 읽어오는 영역이다 ----------<file객체처리영역>-----------
                setPreview(reader.result);
            }
            reader.readAsDataURL(file); //읽어오기 위해서 파일객체를 지정함
            // -------------------------------<file처리>------------------------------------
            setFormData({...formData,[name]:file}); //name: images일 경우에 file obj 저장
        } else { //파일이 존재하지 않을때
            setFormData({...formData,[name]:value});//name: images가 아닐 경우에 일반 string 저장
        }
    }

  return (
    <div className='container mt-4'>
      <h1 className='mb-4'>갤러리 등록 폼</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
            <label htmlFor="title" className='form-label'>제목</label>
            <input type='text' id='title' name='title' onChange={handleChange} className='form-control'/>
        </div>

        <div className='mb-3'>
            <label htmlFor="description" className='form-label'>설명</label>
            <input type='text' id='description' name='description' onChange={handleChange} className='form-control'/>
        </div>

        <div className='mb-3'>
            <label htmlFor="writer" className='form-label'>작성자</label>
            <input type='text' id='writer' name='writer' onChange={handleChange} className='form-control'/>
        </div>

        {/* file업로드 처리 */}
        <div className='mb-3'>
            <label htmlFor="images" className='form-label'>이미지 파일</label>
            <input type='file' id='images' name='images' onChange={handleChange} className='form-control'/>
        </div>

        {/* 이미지 미리보기 */}
        { preview && (
            <div className='mb-3'>
                {/* <label className='form-label'>이미지 미리보기</label> */}
                {/* 이미지의 바이너리 자체를 src에 string으로 선언해서 이미지가 읽어들이도록 구현한다 (src="이미지경로", url, 바이너리)*/}
                <img src={preview as string} alt='' className='img-thumbnail'
                style={{marginRight:'10px', marginBottom:'10px', width:'150px', height:'150px'}}/>
            </div>
            )
        }
        <button type='submit' className='btn btn-primary'>등록</button>
      </form>
    </div>
  )
}

export default GalleryFormBack