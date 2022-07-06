const sliderTiming=$(".player__slider-timing");
const sliderVolume=$('.slider__volume');

sliderVolume.slider({
    range:"min",
    value:33
});

sliderTiming.slider({
    range:"min",
    value:0
});




let player;
const splashContainer=$(".player__splash");
const playerStart=$(".player__start");




let eventsInit = () =>{

    playerStart.click(e=>{
        if(splashContainer.hasClass("active")){
            player.pauseVideo();
        } else {
            
            player.playVideo();
        }
    });
    splashContainer.click(e=>{
        player.playVideo();
    })
};

sliderTiming.click(e=>{
    const seekToSec = sliderTiming.slider("option","value");
    player.seekTo(seekToSec); 
})

sliderVolume.on("slidechange",e=>{
    const toVolume = sliderVolume.slider("option","value");
    player.setVolume(toVolume);
})

const onPlayerReady = () => {

    let interval;

    const durationSec = player.getDuration();
    sliderTiming.slider("option","max",durationSec);


    if(typeof interval !== 'undefined'){
        clearInterval(interval);
    }

    interval= setInterval(()=>{
        const completedSec = player.getCurrentTime();
        sliderTiming.slider("option","value",completedSec)
    },1000);

}


const onPlayerStateChange=event=>{
    /*
        Возвращает состояние проигрывателя. Возможные значения:
        -1 – воспроизведение видео не началось
        0 – воспроизведение видео завершено
        1 – воспроизведение
        2 – пауза
        3 – буферизация
        5 – видео находится в очереди 
    */
   switch(event.data){
    case 1:
        splashContainer.addClass("active");
        playerStart.addClass("active");
        break;
    case 2:
        splashContainer.removeClass("active");
        playerStart.removeClass("active");
        break;
   }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-player', {
        height: '392',
        width: '662',
        videoId: 'Dd1VIeTMGQs',
        events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        },
        playerVars:{
        controls:0,
        disablekb:0,
        showinfo:0,
        rel:0,
        autoplay:0,
        modestbranding:0,
        fs:0
        }
    });
    }

 eventsInit();