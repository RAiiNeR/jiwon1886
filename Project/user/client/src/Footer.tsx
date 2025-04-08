import React from 'react'
import styled from 'styled-components'

const Icon = styled.div`
    @media screen and (max-width: 962px){
        display:none !important;
    }
`
const TextP = styled.p`
    margin-bottom: 0px;
    display:inline;

    @media screen and (max-width: 779px){
        display:inlineblock;
    }
`

const Footer: React.FC = () => {
    return (
        <footer className='bg-light text-center text-md-start footer-div'>
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <Icon className='d-flex align-items-center text-black mx-4 mt-3'>
                    <i className="fa-solid fa-otter"></i>
                    &nbsp;&nbsp;누리군
                </Icon>
                <div className='mx-auto'>
                    <ul className='my-2 p-0 d-flex flex-wrap align-items-center justify-content-center list-unstyled '>
                        <li className='float-start me-1 my-1'><a href="/" className='text-decoration-none'>개인정보처리방침</a></li>|
                        <li className='float-start m-1'><a href="/" className='text-decoration-none'>저작권정책</a></li>|
                        <li className='float-start m-1'><a href="/" className='text-decoration-none'>접근성정책</a></li>|
                        <li className='float-start m-1'><a href="/faq" className='text-decoration-none'>자주하는질문</a></li>|
                        <li className='float-start m-1'><a href="/" className='text-decoration-none'>이메일무단수집거부</a></li>|
                        <li className='float-start m-1'><a href="/directions" className='text-decoration-none'>오시는길</a></li>|
                        <li className='float-start m-1'><button className='btn btn-warning p-1' style={{ fontSize: "14px" }}>누리군 채널추가</button></li>
                    </ul>
                    <div>
                        <div className='mb-0'>
                            <TextP>05782 서울특별시 송파구 문정로 11(가락2동) </TextP>
                            <TextP>전화: 02-1234-5678, </TextP>
                            <TextP>02-2222-3333(당직실/야간,공휴일)</TextP>
                        </div>
                        <p className='mb-0'>팩스: 02-111-7777(종합상황실)</p>
                        <p className='mb-0'>&copy; Noori-gun Office. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer