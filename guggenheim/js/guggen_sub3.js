$(function(){
	
		$(document).on("scroll",function(e){
			console.log($(document).scrollTop());
			if($(document).scrollTop()>300){
				$(".text-box").css({"display":"block"});
				$(".text-box").addClass("animate__slideInRight");
			} //완료

			if($(document).scrollTop()>300){
				$(".img-box").css({"display":"block"});
				$(".img-box").addClass("animate__slideInLeft");
			} //완료

			if($(document).scrollTop()>1300){
				$(".sect03 h2").css({"display":"block"});
				$(".sect03 h2").addClass("animate__fadeInDown");
			}

			if($(document).scrollTop()>1300){
				$(".sect03 p").css({"display":"block"});
				$(".sect03 p").addClass("animate__fadeInUp");
			}
		});
        
		let i = 0;
		$(".prev").on("click",function(){
			if(i>0){
			$(".big-box").animate({'left':'+=1480px'});
				i--;
			}
				
		});

		$(".next").on("click",function(){
			if(i<2){
				console.log("a");
			$(".big-box").animate({'left':'-=1480px'});
			i++;
			}
		});

	});