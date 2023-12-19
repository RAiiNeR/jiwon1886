$(document).ready(function(){
    let d_width = 0; // 브라우저 가로
    let d_height = 0; // 문서 전체의 높이

    function tmp() {
        // container의 가로사이즈(화면가로 * box 개수)
        let con_width = $(window).outerWidth() * $('.box').length; 

        $('.container').css({
            width: con_width,
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0
        });

        // css에서 해도 상관없다.
        $('.box').css({
            width: con_width / $('.box').length,
            height: '100vh',
            float: 'left'
        });

        $('body').css({
            height: '100vh'
        });

        let w_width = $(window).width(); // 화면가로
        let w_height = $(window).height() // 화면세로

        d_width = con_width - w_width;
        d_height = $('body').height() - w_height
    }

    tmp();

    let array = [];
    for(let i=0; i<$('.box').length; i++) {
        array[i] = $('.box').eq(i).offset().left
    }

    let chk = true;
    $('.box').on('mousewheel DOMMouseScroll', function(){

        if(chk) {
            chk = false;
            setTimeout(function(){
                chk = true;
            }, 500)


            let w_delta = event.wheelDelta / 120;
            
            //휠 아래
            if(w_delta < 0 && $(this).next().length > 0) {
                $('.container').animate({
                    left: -array[$(this).index()+1]
                }, 500)
            }
            //휠 위
            else if(w_delta > 0 && $(this).prev().length > 0) {
                $('.container').animate({
                    left: -array[$(this).index()-1]
                }, 500)
            }
        }
    });

    $(window).resize(function(){
        for(let i=0; i<$('.box').length; i++) {
            array[i] = $('.box').eq(i).offset().left
        }

        tmp();
    })

    //원형메뉴
    let menuToggle = document.querySelector('.menuToggle');
    menuToggle.onclick = function(){
    menuToggle.classList.toggle('active')
    }

});
