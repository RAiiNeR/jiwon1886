$(function(){
        //버튼클릭시 박스전환 
        $(".click-button .btn1").on("click",function(e){
            let idx = $(this).index();
            $(".big-box .box").hide();
            //$(".big-box .box").eq(idx).show();
            $(".big-box .box").eq(idx).fadeIn();
            $(".big-box .box").eq(idx).fadeIn("slow");
            $(".btn1 p").hide();
            $(this).find("p").css({"display":"block"});
            
        });
        
        
    
    //부모박스에 eq사용 후 children 사용해도됨
    //혹은 find
        $(document).on("scroll",function(e){
            console.log($(document).scrollTop());
            if($(document).scrollTop()>420){
                $(".sect02 .click-button").animate({'top':'220px'});
            }
        });
        
        // 헤더 스크롤 시 나타났다 사라지기
        var didScroll;
        var lastScrollTop = 0;
        var delta = 5;
        var navbarHeight = $('header').outerHeight();

        $(window).scroll(function(event){
            didScroll = true;
        });

        setInterval(function() {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 250);


        function hasScrolled() {
            var st = $(this).scrollTop();
            if(Math.abs(lastScrollTop - st) <= delta){
                return;
            }
            if (st > lastScrollTop && st > navbarHeight){
                //내렸을때
                $('header').removeClass('nav-down').addClass('nav-up');
            } else {
                //올렸을때
                if(st + $(window).height() < $(document).height()) {
                    $('header').removeClass('nav-up').addClass('nav-down');
                }
            }
            
            lastScrollTop = st;
        }

    });