import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from './store'
import { useSelector } from 'react-redux';
import { increment } from './simpleSlice';

const ReduxDemo2: React.FC = () => {
    // <button onClick={handleStoreUpdate}>Redux 스토어 값만 증가</button>
    //할때 동작됨. 초기값이 0에서 버튼이 클릭되면 1씩 증가하고 리듀스 스토어 값은 새로고침하면 초기화됨
    const dispatch = useDispatch<AppDispatch>(); //호출할때

    //state값을 받아오기
    const reduxValue = useSelector((state:RootState) => state.simple.value); //값 가져올때

    const [localValue, setLocalValue] = useState<number>(0);
    useEffect(()=>{
        const storedValue = localStorage.getItem('localValue');
        if (storedValue) {
            setLocalValue(Number(storedValue)); //로컬스토리지의 값을 useState에 저장한다.
        }
    },[]);

    //Redux의 스토어 값만 증가시키려고 한다.
    const handleStoreUpdate = () => {
        dispatch(increment()); //얘가 Redux의 스토어 값을 증가시킨다.
    }

    const handleLocalStorageUpdate = () => {
        const newValue = localValue + 1;
        setLocalValue(newValue);
        localStorage.setItem('localValue', newValue.toString()); //로컬스토리지의 값을 갱신한다.
    }
  return (
    <div>
      <h2>Simple Redux and Local Storage Demo</h2>
      <p>Redux Store Value: {reduxValue}</p>
      <p>Local Storage Value: {localValue}</p>
      {/* handleStoreUpdate: Redux 스토어 값만 증가 */}
      {/* 순서 : 1. onClick={handleStoreUpdate} */}
      <button onClick={handleStoreUpdate}>Redux 스토어 값만 증가</button>
      {/* handleLocalStorageUpdate: 로컬 스토리지 값만 증가. */}
      <button onClick={handleLocalStorageUpdate}>로컬 스토리지 값만 증가</button>
    </div>
  )
}

export default ReduxDemo2

/* 
Redux가 실행되는 순서
1. onClick={handleStoreUpdate} 
2. const dispatch = useDispatch<AppDispatch>();
3. dispatch(increment()); //Redux 스토어 값 증가
호출할 수 있는 정의
=> store.ts
4. export type AppDispatch = typeof store.dispatch;
=> simpleSlice.ts
5. reducer
*/