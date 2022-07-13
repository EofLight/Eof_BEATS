;(function () {
  function closeEvery(items, curItem) {
    items.not(curItem).removeClass("active");
    items.not(curItem).width(0);
  }

  $(".color__name").click((e) => {
    const allContent = $(".colors__content");

    const $this = $(e.currentTarget);

    const winWidth = $(window).width();
    const needWidth = winWidth - $this.width() * 3;
    const sectionWidth = $this.closest(".section").width();

    const curContent = $this.siblings(".colors__content");
    const textBlock = curContent.find(".colors__content-block");
    const textWidthMobile =
      needWidth -
      parseInt(textBlock.css("padding-left")) +
      parseInt(textBlock.css("padding-right"));
    const textWidthDesktop = 350;
    closeEvery(allContent, curContent);

    if (!curContent.hasClass("active")) {
      curContent.addClass("active");
      textBlock.width(textWidthDesktop);
      curContent.width(
        textWidthDesktop +
          (parseInt(textBlock.css("padding-left")) +
            parseInt(textBlock.css("padding-right")))
      );
      if (winWidth <= 768) {
        textBlock.width(
          textWidthMobile -
            (parseInt(textBlock.css("padding-left")) +
              parseInt(textBlock.css("padding-right")))
        );
        curContent.width(needWidth);
      }
    } else {
      curContent.removeClass("active");
      curContent.width(0);
    }
    /*
    if(!$this.hasClass("active")){
        $this.addClass("active");
    } else{
        $this.removeClass("active");
    }
*/
  });
})();
