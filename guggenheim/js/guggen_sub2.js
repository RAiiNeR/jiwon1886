$(function(){
	
		$(document).on("scroll",function(e){
			console.log($(document).scrollTop());
			if($(document).scrollTop()>300){
				$(".explain-box").css({"display":"block"});
				$(".explain-box").addClass("animate__fadeInLeft");
			} //완료

			if($(document).scrollTop()>300){
				$(".pic").css({"display":"block"});
				$(".pic").addClass("animate__fadeInRight");
			} //완료
		});


	});