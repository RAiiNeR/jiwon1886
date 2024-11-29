import { configureStore } from "@reduxjs/toolkit";
import simpleReducer from './simpleSlice';
//리듀스 스토어 설정
//store.dispatch의 타입을 가져와서 AppDispatch라는 타입으로 지정
//store.getState함수의 반환값을 기준으로 RootState타입을 생성
const store = configureStore({
    reducer:{
        simple: simpleReducer, //슬라이스의 이름을 리듀서로 지정을 해놔야 한다.
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export default store;