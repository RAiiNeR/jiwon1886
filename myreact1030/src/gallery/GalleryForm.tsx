import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface FormData{
    title:string;
    writer:string;
    contents:string;
    mfiles:File[];
}

const GalleryForm: React.FC = () => {
    //자바스크립트 오브젝트형 State를 선언하고 초기화함
    //서버로 보낼 데이터값
    const [formData, setFormData] = useState<FormData>({
        title:'',
        writer:'',
        contents:'',
        mfiles:[] //여러개의 이미지 파일
    });

    const [preview, setPreview] = useState<string[]>([]);
    const navigate = useNavigate();

    //axios를 사용해서 비동기식으로 데이터 전송
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form Click");
        //Form 전송값 객체 new FormData();
        const myFormdata = new FormData();
        //State에 저장한 값을 FormData객체에 하나씩 저장
        //append(paraName, value)
        myFormdata.append('writer',formData.writer);
        myFormdata.append('title',formData.title);
        myFormdata.append('contents',formData.contents);
        formData.mfiles.forEach((file,index)=>{
            myFormdata.append('mfiles',file);
        });
        //----------------------------------------------------
        try {
            console.log(`FormData => ${myFormdata}`);
            const response = await axios.post('http://192.168.0.90/myictstudy/gallery/addGallery', myFormdata, {
                headers:{
                    'Content-Type' : 'multipart/form-data'
                }
            });
            navigate("/gallery");
        } catch (error) {
            console.error('전송오류',error);
        }
    };

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        //Change폼의 데이터를 로깅
        const {name, value, files} = e.target;
        console.log(`AllNames : ${name} : ${value}`);
        if (name === 'mfiles' && files) {
            // console.log(`ImageName : ${name} : ${value} | ${files[0]}, ${files[1]}`); 
            // console.log(`typeofFile${typeof(files)}`);
            //배열 - 파일을 하나씩 반복하면서 FileReader()로 바이너리로 읽어들인 후
            //읽어들인것을 기다린 후에 preview에 저장한다
            const fileArray = Array.from(files);
            const filePreviews = fileArray.map(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);//파일의 바이너리를 읽어서 반환
                return new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        //이미지 바이너리 값을 문자열로 전송함
                        resolve(reader.result as string);
                    };
                });
            });
            //State에 저장
            Promise.all(filePreviews).then(pUrls => {
                setPreview(pUrls);
            });
            //이미지 배열을images:[] 저장한다
            setFormData({...formData,mfiles:fileArray});
        } else {
            setFormData({...formData,[name]:value});
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
            <label htmlFor="contents" className='form-label'>설명</label>
            <input type='text' id='contents' name='contents' onChange={handleChange} className='form-control'/>
        </div>

        <div className='mb-3'>
            <label htmlFor="writer" className='form-label'>작성자</label>
            <input type='text' id='writer' name='writer' onChange={handleChange} className='form-control'/>
        </div>

        <div className='mb-3'>
            <label htmlFor="mfiles" className='form-label'>이미지 파일</label>
            <input type='file' id='mfiles' name='mfiles' onChange={handleChange} className='form-control' multiple/>
        </div>

        { preview.length > 0 && (
            <div className='mb-3'>
                {preview.map((p,index)=>(
                    <p key={index}>
                        <img src={p} alt='' className='img-thumbnail'
                        style={{marginRight:'10px', marginBottom:'10px', width:'150px', height:'150px'}}/>
                        <span>{p}</span>
                    </p>
                     
                ))}
                
            </div>
            )
        }
        
        <button type='submit' className='btn btn-primary'>등록</button>
      </form>
    </div>
  )
}

export default GalleryForm