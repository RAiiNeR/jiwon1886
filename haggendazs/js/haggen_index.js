$(function(){
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

		$(document).on("scroll",function(e){
			console.log($(document).scrollTop());
			if($(document).scrollTop()>500){
                $(".effect-box").css({"display":"block"});
				$(".effect-box").addClass("animate__fadeInDown");
            }
		});


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