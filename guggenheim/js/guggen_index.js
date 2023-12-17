$(function(){
		//버튼
		let i = 0;
		$(".prev").on("click",function(){
			if(i>0){
			$(".gallery-img").animate({'left':'+=1400px'});
				i--;
			}
				
		});


		$(".next").on("click",function(){
			if(i<2){
			$(".gallery-img").animate({'left':'-=1400px'});
			i++;
			}
		});



		$(document).ready(function(){
			//const offset = $("#sect02").offset();
			//$('html, body').animate({scrollTop: offset.top}, 500);

		});
		$(document).on("scroll",function(e){
			console.log($(document).scrollTop());
			if($(document).scrollTop()>300){
				$(".right-ex").css({"display":"block"});
				$(".right-ex").addClass("animate__slideInDown");
			}

			if($(document).scrollTop()>500){
				$(".gallery").css({"display":"block"});
				$(".gallery").addClass("animate__slideInUp");
			}

			if($(document).scrollTop()>1200){
				$(".text-box h2").css({"display":"block"});
				$(".text-box h2").addClass("animate__fadeInUp");
			}

			if($(document).scrollTop()>1200){
				$(".text-box p").css({"display":"block"});
				$(".text-box p").addClass("animate__fadeInUp");
			}

			if($(document).scrollTop()>1200){
				$(".text-box a").css({"display":"block"});
				$(".text-box a").addClass("animate__fadeInUp");
			}

			if($(document).scrollTop()>2000){
				$(".sect-text").css({"display":"block"});
				$(".sect-text").addClass("animate__fadeInLeft");
			}

			if($(document).scrollTop()>2000){
				$(".project").css({"display":"block"});
				$(".project").addClass("animate__fadeInRight");
			}
		});

	});