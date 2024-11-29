import React from 'react'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from './store';
import { useDispatch } from 'react-redux';
import { likePost } from './likesSlice';

const ReduxDemo1: React.FC = () => {
    //useSelector라는 함수를 써서 리듀스에 접근을 해서 변경된 state를 가져온다.
    const likes = useSelector((state:RootState) => state.likes.likes);
    const dispatch = useDispatch<AppDispatch>();
  return (
    <div>
      <div>
        <p>Likes : {likes}</p>
        <button onClick={()=> dispatch(likePost())}>Like</button>
      </div>
    </div>
  )
}

export default ReduxDemo1