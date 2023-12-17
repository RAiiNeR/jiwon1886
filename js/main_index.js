$(function(){
    $(document).on("scroll",function(e){
        console.log($(document).scrollTop());
        if($(document).scrollTop()>500){
            $(".animation-box").css({"display":"block"});
            $(".animation-box").addClass("animate__fadeInDown");
        }

        if($(document).scrollTop()>500){
            $(".animation-box2").css({"display":"block"});
            $(".animation-box2").addClass("animate__fadeInUp");
        }

        if($(document).scrollTop()>1375){
            $(".animation-box3").css({"display":"block"});
            $(".animation-box3").addClass("animate__fadeInUp");
        }

        if($(document).scrollTop()>2000){
            $(".anibox").css({"display":"block"});
            $(".anibox").addClass("animate__fadeIn");
        }
    });
    
    let preveiwContainer = document.querySelector('.products-preview');
    let previewBox = preveiwContainer.querySelectorAll('.preview');

    document.querySelectorAll('.anibox .product').forEach(product =>{
    product.onclick = () =>{
        preveiwContainer.style.display = 'flex';
        let name = product.getAttribute('data-name');
        previewBox.forEach(preview =>{
        let target = preview.getAttribute('data-target');
        if(name == target){
            preview.classList.add('active');
        }
        });
    };
    });

    previewBox.forEach(close =>{
    close.querySelector('.fa-times').onclick = () =>{
        close.classList.remove('active');
        preveiwContainer.style.display = 'none';
    };
    });
});


//스르륵 슬라이드
let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('header nav a');
    window.onscroll = () => {
        sections.forEach(sec => {
            let top = window.scrollY;
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('class');
            if(top >= offset && top < offset + height) {
                navLinks.forEach(links => {
                    links.classList.remove('active');
                    document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
                });
            };
        });
    };