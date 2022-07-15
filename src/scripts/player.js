(function () {
  const sliderTiming = $(".player__slider-timing");
  const sliderVolume = $(".slider__volume");

  sliderVolume.slider({
    range: "min",
    value: 33,
  });

  sliderTiming.slider({
    range: "min",
    value: 0,
  });

  let player = document.getElementById("player");

  const splashContainer = $(".player__splash");
  const playerStart = $(".player__start");

  let eventsInit = () => {
    playerStart.on("click", (e) => {
      if (splashContainer.hasClass("active")) {
        player.pause();
      } else {
        player.play();
      }
      splashContainer.toggleClass("active");
      playerStart.toggleClass("active");
    });
    splashContainer.on("click", (event) => {
      //if (event.target === playerStart || event.target === splashContainer) {
      splashContainer.toggleClass("active");
      playerStart.toggleClass("active");
      console.log(player.paused);
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
      //}
    });
  };

  sliderTiming.on("click",(e) => {
    const seekToSec = sliderTiming.slider("option", "value");
    player.currentTime = seekToSec;
  });

  sliderVolume.on("slidechange", (e) => {
    const toVolume = sliderVolume.slider("option", "value");
    player.volume = toVolume / 100;
  });

  player.oncanplay = () => {
    let interval;

    const durationSec = player.duration;
    sliderTiming.slider("option", "max", durationSec);

    if (typeof interval !== "undefined") {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      const completedSec = player.currentTime;
      sliderTiming.slider("option", "value", completedSec);
    }, 1000);
  };
  /*
  splashContainer.on("click", (event) => {
    
    /*
    switch (event.data) {
      case 1:
        splashContainer.addClass("active");
        playerStart.addClass("active");
        break;
      case 2:
        splashContainer.removeClass("active");
        playerStart.removeClass("active");
        break;
    }
  });*/

  eventsInit();
})();
