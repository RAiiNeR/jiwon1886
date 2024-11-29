import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//상태 인터페이스를 정의한다.
interface SimpleState{
    value:number
}

//초기값을 0으로 초기화한것
const initialState: SimpleState = {
    value: 0
}

const simpleSlice = createSlice({
    name:'simple',
    initialState,
    reducers:{
        //리듀스 안에서 정의한 액션
        //상태값을 통해서 1씩 증가시키는 것
        //리듀스를 통해서 스토어에서 전달받은 값을 변화값을 스토어로 전달한다.
        increment:(state) => {
            state.value += 1;
        },
        // PayloadAction => Redux액션에서 데이터(payload)는 상태 변경을 위해 전달된다.
        //type을 명시하는 목적
        //redux toolkit은 PayloadAction을 통해 액션 생성과 타입 안전성을 동시에 제공 하는데
        //typescript를 사용해서 타입을 명확하게 하자는 것이다.
        updateValue:(state,action : PayloadAction<number>) => {
            //새로운 상태를 지정한다.
            state.value = action.payload;
        }
    }
});

export const {increment, updateValue} = simpleSlice.actions;
export default simpleSlice.reducer;