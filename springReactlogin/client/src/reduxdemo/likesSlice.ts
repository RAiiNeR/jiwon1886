import { createSlice } from '@reduxjs/toolkit';
//createSlice : 원래는 createReducer를 만든다던지, createAction등을 포함한 메서드이다.
//하나로 관리가 되는 메서드이다.
const likesSlice = createSlice({
    name:'likes', //슬라이스의 이름 - 리듀스에서 사용할 이름
    initialState:{likes : 0}, //상태값을 초기화
    reducers:{ //리듀스 안에서 정의한 액션 likePost라는 이름으로 액션되는 것. [dispatch(likePost())] --> 상태감지를 하다가 상태가 변하면 어떻게 실행하겠다는 것을 정의
        likePost:(state) => {
            state.likes += 1; // 리듀스가 store에서 지정한 상태를 받아서 새로운 state값을 반환. 즉 스토어에 저장한 값이 0이라면 움직일때마다 1, 2,3... 1씩 증가를 해줌
        }
    }
});

export const {likePost} = likesSlice.actions; //likePost를 호출할 수 있도록 액션을 정의한 것
export default likesSlice.reducer;