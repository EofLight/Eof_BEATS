const hamburger = document.querySelector('#hamburger');
const fullscreenMenu = document.querySelector('#fmenu')

hamburger.addEventListener('click', function(event){
    event.preventDefault();
    
    fullscreenMenu.style.display='block';
});

fullscreenMenu.querySelector('#fmenu__close').addEventListener('click', function(event){
    event.preventDefault();
    fullscreenMenu.style.display='none';
})