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

const gearButton = document.querySelector(".shop__func");
const specsListElement = document.querySelector(".shop__specs");
gearButton.addEventListener("mouseover", e => {
  specsListElement.style.opacity = "1";
  specsListElement.style.top = "0";
  
})
gearButton.addEventListener("mouseout", e => {
  specsListElement.style.opacity = "0"
  specsListElement.style.top = "-999999px"
})
specsListElement.addEventListener("mouseover", e => {
  specsListElement.style.opacity = "1";
  specsListElement.style.top = "0";
})
specsListElement.addEventListener("mouseout", e => {
  specsListElement.style.opacity = "0"
  specsListElement.style.top = "-999999px"
})