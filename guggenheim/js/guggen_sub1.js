$(function(){
	
		$(document).on("scroll",function(e){
			console.log($(document).scrollTop());
			if($(document).scrollTop()>300){
				$(".visit-textbox h2").css({"display":"block"});
				$(".visit-textbox h2").addClass("animate__fadeInUp");
			} //완료

			if($(document).scrollTop()>450){
				$(".textbox").css({"display":"block"});
				$(".textbox").addClass("animate__fadeInUp");
			} //완료

			if($(document).scrollTop()>1000){
				$(".two-button").css({"display":"block"});
				$(".two-button").addClass("animate__fadeInUp");
			}

			if($(document).scrollTop()>1380){
				$(".artbox").css({"display":"block"});
				$(".artbox").addClass("animate__fadeInUp");
			}

			if($(document).scrollTop()>1380){
				$(".art-textbox").css({"display":"block"});
				$(".art-textbox").addClass("animate__fadeInDown");
			}
		});

	});