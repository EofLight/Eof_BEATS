const hamburger = document.querySelector('#hamburger');
const fullscreenMenu = document.querySelector('#fmenu')

hamburger.addEventListener('click', function(){
     
    fullscreenMenu.style.display='block';
});

fullscreenMenu.querySelector('#fmenu__close').addEventListener('click', function(){
    fullscreenMenu.style.display='none';
})


