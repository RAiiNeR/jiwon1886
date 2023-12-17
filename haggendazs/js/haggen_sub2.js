$(function(){
        let i = 0;
        $(".highlight").on("click",function(){
            $(this).parent().parent().next().animate({'left':'0px'},1000);
        });

        let k = 0;
        $(".highlight-close").on("click",function(){
            $(this).parent().parent().animate({'left':'-625px'},1000);
        });

        $(document).on("scroll",function(e){
            console.log($(document).scrollTop());
            if($(document).scrollTop()>500){
                $(".box-img").css({"display":"block"});
                $(".box-img").addClass("animate__slideInUp");
            }

            if($(document).scrollTop()>500){
                $(".text").css({"display":"block"});
                $(".text").addClass("animate__slideInUp");
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