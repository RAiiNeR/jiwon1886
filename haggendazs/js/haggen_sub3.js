$(function(){
        let i = 0;
        $(".arrow-left").on("click",function(){
            if(i>0){
                $(".slidelist li").animate({'left':'+=25%'});
                i--;
            }
        });

        $(".arrow-right").on("click",function(){
            if(i<3){
                $(".slidelist li").animate({'left':'-=25%'});
                i++;
            }
        });

        $(document).on("scroll",function(e){
            console.log($(document).scrollTop());
            if($(document).scrollTop()>500){
                $(".wrapper span").css({"display":"block"});
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

    function togglePopup1(){
            document.getElementById("popup-1").classList.toggle("active");
        }

        function togglePopup2(){
            document.getElementById("popup-2").classList.toggle("active");
        }

        function togglePopup3(){
            document.getElementById("popup-3").classList.toggle("active");
        }

        