(function () {
  const slider = $(".slider").bxSlider({
    pager: false,
    controls: false,
  });

  const pagerRight = $(".shop__pager--right");
  pagerRight.click((e) => {
    e.preventDefault();
    slider.goToNextSlide();
  });

  const pagerLeft = $(".shop__pager--left");
  pagerLeft.click((e) => {
    e.preventDefault();
    slider.goToPrevSlide();
  });
})();
