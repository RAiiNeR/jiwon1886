import React from 'react'
import styled from 'styled-components'
// 구조 :
{/* <main>
      <ul>
        <li> => 해당 데이터 map을 사용해서 반복할 내용
*/}
const Container = styled.main`
    max-width: 1200px; /*컨테이너의 최대 넓이를 1200px로 고정시킴으로 더이상 늘어나는것을 방지*/
    margin:0 auto;
    padding: 20px; /*컨테이너 안에 안쪽 20으로 주는 이유는 공간 확보를 위해서*/
`
const ProductList = styled.ul`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap:20px;
    list-style:none;
    padding:0;

    @media screen and (max-width:1024px){
        grid-template-columns: repeat(2, 1fr);
    }
    @media screen and (max-width:768px){
        grid-template-columns: 1fr;
    }
`
const ProductItem = styled.li`
    background-color:#f9f9f9;
    border-radius:8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding:15px;
    text-align:center;
    /* 이렇게 img주는것 : li하위에 img태그를 넣는다는 뜻 */
    img{
        max-width:100%;
        border-radius:8px;
    }
    /* div classname */
    .caption{
        margin-top:15px;
    }
    h2{
        font-size:1.2rem; /* rem : 상대적인 크기로 조정한다는 뜻(반응형웹으로 쓸때 좋다)*/
        margin-bottom:10px;
    }
    p{
        font-size:1rem;
        margin:5px 0;
    }
    
    @media screen and (max-width:480px){
        h2{
            font-size:1.1rem;
        }
        p{
            font-size:0.9rem;
        }
    }
`
interface Product{
    num:number;
    ptitle:string;
    pcont:string;
    price:number;
    img:string;
    pdate:string;
}

const Home: React.FC = () => {
    //인터페이스 배열형 자료형
    const products: Product[] = [];
    //가상데이터
    // [{첫번째 상품}, {두번째 상품} ....{마지막 상품}] 이런식으로 오브젝트들이 배열로 만들어짐
    for (let i = 1; i <= 6; i++) {
        // 오브젝트 부분
        products.push({
            num:i,
            ptitle:`상품${i}`,
            pcont:`상품${i} : 설명 텍스트`,
            price:10000 + i + 20000,
            img:`images/prod${i}.jpg`,
            pdate:'2024-10-11',
        });
    }
    
    return (
        <Container>
            <ProductList>
                {products.map((product)=>(
                    <ProductItem key={product.num}>
                        <img src={product.img} alt={product.ptitle}/>
                        <div className='caption'>
                            <h2>{product.ptitle}</h2>
                            <p>{product.ptitle}</p>
                            <p>가격 : {product.price}</p>
                            <p>출시일 : {product.pdate}</p>
                        </div>
                    </ProductItem>
                ))}
            </ProductList>
        </Container>
    )
}

export default Home