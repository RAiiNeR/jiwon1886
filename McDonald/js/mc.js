$(function(){
$("nav").on("mouseover",function(){
	$(".sub-menu").stop().slideDown(0); 	
	$(".sub-wrap").stop().slideDown(0);
});

$("nav").on("mouseout",function(){ 
	$(".sub-menu").stop().slideUp(0);
	$(".sub-wrap").stop().slideUp(0);
});


});	