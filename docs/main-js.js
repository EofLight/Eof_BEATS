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
;(function () {
  const hamburger = document.querySelector("#hamburger");
  const fullscreenMenu = document.querySelector("#fmenu");

  hamburger.addEventListener("click", function (event) {
    event.preventDefault();

    fullscreenMenu.style.display = "block";
  });

  fullscreenMenu
    .querySelector("#fmenu__close")
    .addEventListener("click", function (event) {
      event.preventDefault();
      fullscreenMenu.style.display = "none";
    });

  const specbutton = $(".shop__func");
  const specBlock = $(".shop__specs");

  specbutton.hover(
    function () {
      const set = $(this).siblings(".shop__specs").css({
        opacity: "1",
        top: "0",
      });
    },
    function () {
      const set = $(this).siblings(".shop__specs").css({
        opacity: "0",
        top: "-99999px",
      });
    }
  );

  specBlock.hover(
    function () {
      const set = $(this).css({
        opacity: "1",
        top: "0",
      });
    },
    function () {
      const set = $(this).css({
        opacity: "0",
        top: "-99999px",
      });
    }
  );
})();
;(function () {
  let myMap;

  const init = () => {
    myMap = new ymaps.Map("map__image", {
      center: [56.0110375, 92.87142728],
      zoom: 11,
      controls: [],
    });

    const coords = [
      [56.05100284, 92.90430406],
      [56.02214215, 92.79863689],
      [56.00997077, 92.87056493],
    ];

    const myColl = new ymaps.GeoObjectCollection(
      {},
      {
        draggable: false,
        iconLayout: "default#image",
        iconImageHref: "./img/map/map-icon.svg",
        iconImageSize: [58, 73],
      }
    );

    coords.forEach((coord) => {
      myColl.add(new ymaps.Placemark(coord));
    });

    myMap.geoObjects.add(myColl);

    myMap.behaviors.disable("scrollZoom");
  };

  ymaps.ready(init);
})();
;(function () {
  const validateFields = (form, fieldsArray) => {
    fieldsArray.forEach((field) => {
      field.removeClass("active");
      if (field.val().trim() === "") {
        field.addClass("active");
      }
    });

    const errorFields = form.find(".active");
    return errorFields.length === 0;
  };

  $(".form").submit(function (e) {
    e.preventDefault();

    const form = $(e.currentTarget);
    const name = form.find("[name='name']");
    const phone = form.find("[name='phone']");
    const comment = form.find("[name='comment']");
    const to = form.find("[name='to']");

    const modal = $("#modal");
    const content = modal.find(".modal__content");
    // console.log(form);
    // console.log(name.val(),phone.val())
    const isValid = validateFields(form, [name, phone, comment, to]);

    modal.removeClass("error-modal");

    if (isValid) {
      $.ajax({
        type: "post",
        url: "https://webdev-api.loftschool.com/sendmail",
        data: {
          name: name.val(),
          phone: phone.val(),
          comment: comment.val(),
          to: to.val(),
        },
        success: (data) => {
          content.text(data.message);

          Fancybox.show([
            {
              src: "#modal",
              type: "inline",
            },
          ]);
        },
        error: (data) => {
          const message = data.responseJSON.message;
          content.text(message);
          modal.addClass("error-modal");

          Fancybox.show([
            {
              src: "#modal",
              type: "inline",
            },
          ]);
        },
      });
    }
  });

  $(".btn-close").click(function (e) {
    e.preventDefault();
    Fancybox.close();
  });
})();
;(function () {
  const sections = $(".section");
  const display = $(".maincontent");
  const sideMenu = $(".fixed-menu");
  const menuItems = sideMenu.find(".fixed-menu__item");

  const mobileDetect = new MobileDetect(window.navigator.userAgent);

  const isMobile = mobileDetect.mobile();

  let inScroll = false;

  sections.first().addClass("active");

  const countSectionPosition = (sectionEq) => {
    const position = sectionEq * -100;
    if (isNaN(position)) {
      console.error(
        "неверный параметр,ошибка в расчётах countSectionPosition()"
      );
      return 0;
    }
    return position;
  };

  const changeMenuThemeForSection = (sectionEq) => {
    const currentSection = sections.eq(sectionEq);
    const menuTheme = currentSection.attr("data-sidemenu-theme");

    if (menuTheme === "def") {
      sideMenu.removeClass("fixed-menu--shadowed");
    }
    if (menuTheme === "white") {
      sideMenu.addClass("fixed-menu--shadowed");
    }
  };

  const resetActiveClassForItem = (items, itemEq, activeClass) => {
    items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
  };

  const performTransition = (sectionEq) => {
    if (inScroll) return;
    const trasitionOver = 1000;
    const mouseInertialOver = 300;
    inScroll = true;
    const position = countSectionPosition(sectionEq);

    changeMenuThemeForSection(sectionEq);

    display.css({
      Transform: `translateY(${position}%)`,
    });

    resetActiveClassForItem(sections, sectionEq, "active");

    setTimeout(() => {
      inScroll = false;
      resetActiveClassForItem(menuItems, sectionEq, "fixed-menu__item--active");
    }, trasitionOver + mouseInertialOver);
  };

  const viewportScroller = () => {
    const activeSection = sections.filter(".active");
    const nextSection = activeSection.next();
    const prevSection = activeSection.prev();

    return {
      next() {
        if (nextSection.length) {
          performTransition(nextSection.index());
        }
      },
      prev() {
        if (prevSection.length) {
          performTransition(prevSection.index());
        }
      },
    };
  };

  $(window).on("wheel", (e) => {
    const deltaY = e.originalEvent.deltaY;

    const scroller = viewportScroller();

    if (deltaY > 0) {
      scroller.next();
    }

    if (deltaY < 0) {
      scroller.prev();
    }
  });

  $(window).on("keydown", (e) => {
    const tagName = e.target.tagName.toLowerCase();
    const scroller = viewportScroller();
    const userTypingInInputs = tagName == "input" || tagName == "textarea";

    if (userTypingInInputs) return;

    switch (e.keyCode) {
      case 38:
        scroller.prev();
        break;
      case 40:
        scroller.next();
        break;
    }
  });

  $("[data-scroll-to]").click((e) => {
    e.preventDefault();

    const $this = $(e.currentTarget);
    const target = $this.attr("data-scroll-to");
    const reqSection = $(`[data-section-id=${target}]`);

    performTransition(reqSection.index());
  });

  if (isMobile) {
    $(".wrapper").on("touchmove", (e) => e.preventDefault());

    $("body").swipe({
      //Generic swipe handler for all directions
      swipe: function (event, direction) {
        const scroller = viewportScroller();
        let scrollDirection = "";
        if (direction === "up") scrollDirection = "next";
        if (direction === "down") scrollDirection = "prev";

        scroller[scrollDirection]();
      },
    });
  }
})();
;(function () {
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

  let player;
  const splashContainer = $(".player__splash");
  const playerStart = $(".player__start");

  let eventsInit = () => {
    playerStart.click((e) => {
      if (splashContainer.hasClass("active")) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    });
    splashContainer.click((e) => {
      player.playVideo();
    });
  };

  sliderTiming.click((e) => {
    const seekToSec = sliderTiming.slider("option", "value");
    player.seekTo(seekToSec);
  });

  sliderVolume.on("slidechange", (e) => {
    const toVolume = sliderVolume.slider("option", "value");
    player.setVolume(toVolume);
  });

  const onPlayerReady = () => {
    let interval;

    const durationSec = player.getDuration();
    sliderTiming.slider("option", "max", durationSec);

    if (typeof interval !== "undefined") {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      const completedSec = player.getCurrentTime();
      sliderTiming.slider("option", "value", completedSec);
    }, 1000);
  };

  const onPlayerStateChange = (event) => {
    /*
        Возвращает состояние проигрывателя. Возможные значения:
        -1 – воспроизведение видео не началось
        0 – воспроизведение видео завершено
        1 – воспроизведение
        2 – пауза
        3 – буферизация
        5 – видео находится в очереди 
    */
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
  };

  function onYouTubeIframeAPIReady() {
    player = new YT.Player("yt-player", {
      height: "392",
      width: "662",
      videoId: "Dd1VIeTMGQs",
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
      playerVars: {
        controls: 0,
        disablekb: 0,
        showinfo: 0,
        rel: 0,
        autoplay: 0,
        modestbranding: 0,
        fs: 0,
      },
    });
  }

  eventsInit();
})();
;(function () {
  const findBlockByAlias = (alias) => {
    return $(".review").filter((ndx, item) => {
      return $(item).attr("data-link-with") === alias;
    });
  };

  $(".review__pager-link").click((e) => {
    e.preventDefault();

    const $this = $(e.currentTarget);
    const target = $this.attr("data-user");
    const itemToShow = findBlockByAlias(target);
    const curItem = $this.closest(".review__pager-item");

    itemToShow.addClass("active").siblings().removeClass("active");
    curItem.addClass("active").siblings().removeClass("active");
  });
})();
;(function () {
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
;(function () {
  const openItem = (item) => {
    const container = item.closest(".team__item");
    //console.log(container);
    const contentBlock = container.find(".team__content");
    //console.log(contentBlock);
    const textBlock = contentBlock.find(".team__content-block");
    //console.log(textBlock);
    const reqHeight = textBlock.height();
    //console.log(reqHeight);
    const arrow = container.find(".team__title-arrow");

    container.addClass("active");
    arrow.addClass("active");
    contentBlock.height(reqHeight);
  };

  const closeEveryItem = (container) => {
    //console.log(container);
    const items = container.find(".team__content");
    //console.log(items);
    const itemContainer = container.find(".team__item");
    //console.log(itemContainer);
    const arrow = itemContainer.find(".team__title-arrow");

    itemContainer.removeClass("active");
    arrow.removeClass("active");
    items.height(0);
  };

  $(".team__title").click((e) => {
    const $this = $(e.currentTarget);
    //console.log($this);
    const container = $this.closest(".team");
    //console.log(container);
    const elemContainer = $this.closest(".team__item");
    //console.log(elemContainer);
    if (elemContainer.hasClass("active")) {
      closeEveryItem(container);
    } else {
      closeEveryItem(container);
      openItem($this);
    }
  });
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbG9ycy5qcyIsImluZGV4LmpzIiwibWFwLmpzIiwibW9kYWwuanMiLCJvcHMuanMiLCJwbGF5ZXIuanMiLCJyZXZQYWdlci5qcyIsInNsaWRlci5qcyIsInRlYW1EZXNjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0NsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0N2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0MxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0N0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLWpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gY2xvc2VFdmVyeShpdGVtcywgY3VySXRlbSkge1xyXG4gICAgaXRlbXMubm90KGN1ckl0ZW0pLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgaXRlbXMubm90KGN1ckl0ZW0pLndpZHRoKDApO1xyXG4gIH1cclxuXHJcbiAgJChcIi5jb2xvcl9fbmFtZVwiKS5jbGljaygoZSkgPT4ge1xyXG4gICAgY29uc3QgYWxsQ29udGVudCA9ICQoXCIuY29sb3JzX19jb250ZW50XCIpO1xyXG5cclxuICAgIGNvbnN0ICR0aGlzID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG5cclxuICAgIGNvbnN0IHdpbldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICBjb25zdCBuZWVkV2lkdGggPSB3aW5XaWR0aCAtICR0aGlzLndpZHRoKCkgKiAzO1xyXG4gICAgY29uc3Qgc2VjdGlvbldpZHRoID0gJHRoaXMuY2xvc2VzdChcIi5zZWN0aW9uXCIpLndpZHRoKCk7XHJcblxyXG4gICAgY29uc3QgY3VyQ29udGVudCA9ICR0aGlzLnNpYmxpbmdzKFwiLmNvbG9yc19fY29udGVudFwiKTtcclxuICAgIGNvbnN0IHRleHRCbG9jayA9IGN1ckNvbnRlbnQuZmluZChcIi5jb2xvcnNfX2NvbnRlbnQtYmxvY2tcIik7XHJcbiAgICBjb25zdCB0ZXh0V2lkdGhNb2JpbGUgPVxyXG4gICAgICBuZWVkV2lkdGggLVxyXG4gICAgICBwYXJzZUludCh0ZXh0QmxvY2suY3NzKFwicGFkZGluZy1sZWZ0XCIpKSArXHJcbiAgICAgIHBhcnNlSW50KHRleHRCbG9jay5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpKTtcclxuICAgIGNvbnN0IHRleHRXaWR0aERlc2t0b3AgPSAzNTA7XHJcbiAgICBjbG9zZUV2ZXJ5KGFsbENvbnRlbnQsIGN1ckNvbnRlbnQpO1xyXG5cclxuICAgIGlmICghY3VyQ29udGVudC5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG4gICAgICBjdXJDb250ZW50LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICB0ZXh0QmxvY2sud2lkdGgodGV4dFdpZHRoRGVza3RvcCk7XHJcbiAgICAgIGN1ckNvbnRlbnQud2lkdGgoXHJcbiAgICAgICAgdGV4dFdpZHRoRGVza3RvcCArXHJcbiAgICAgICAgICAocGFyc2VJbnQodGV4dEJsb2NrLmNzcyhcInBhZGRpbmctbGVmdFwiKSkgK1xyXG4gICAgICAgICAgICBwYXJzZUludCh0ZXh0QmxvY2suY3NzKFwicGFkZGluZy1yaWdodFwiKSkpXHJcbiAgICAgICk7XHJcbiAgICAgIGlmICh3aW5XaWR0aCA8PSA3NjgpIHtcclxuICAgICAgICB0ZXh0QmxvY2sud2lkdGgoXHJcbiAgICAgICAgICB0ZXh0V2lkdGhNb2JpbGUgLVxyXG4gICAgICAgICAgICAocGFyc2VJbnQodGV4dEJsb2NrLmNzcyhcInBhZGRpbmctbGVmdFwiKSkgK1xyXG4gICAgICAgICAgICAgIHBhcnNlSW50KHRleHRCbG9jay5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpKSlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1ckNvbnRlbnQud2lkdGgobmVlZFdpZHRoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VyQ29udGVudC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgY3VyQ29udGVudC53aWR0aCgwKTtcclxuICAgIH1cclxuICAgIC8qXHJcbiAgICBpZighJHRoaXMuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe1xyXG4gICAgICAgICR0aGlzLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgfSBlbHNle1xyXG4gICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgfVxyXG4qL1xyXG4gIH0pO1xyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gIGNvbnN0IGhhbWJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaGFtYnVyZ2VyXCIpO1xyXG4gIGNvbnN0IGZ1bGxzY3JlZW5NZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmbWVudVwiKTtcclxuXHJcbiAgaGFtYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgZnVsbHNjcmVlbk1lbnUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICB9KTtcclxuXHJcbiAgZnVsbHNjcmVlbk1lbnVcclxuICAgIC5xdWVyeVNlbGVjdG9yKFwiI2ZtZW51X19jbG9zZVwiKVxyXG4gICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZnVsbHNjcmVlbk1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfSk7XHJcblxyXG4gIGNvbnN0IHNwZWNidXR0b24gPSAkKFwiLnNob3BfX2Z1bmNcIik7XHJcbiAgY29uc3Qgc3BlY0Jsb2NrID0gJChcIi5zaG9wX19zcGVjc1wiKTtcclxuXHJcbiAgc3BlY2J1dHRvbi5ob3ZlcihcclxuICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc3Qgc2V0ID0gJCh0aGlzKS5zaWJsaW5ncyhcIi5zaG9wX19zcGVjc1wiKS5jc3Moe1xyXG4gICAgICAgIG9wYWNpdHk6IFwiMVwiLFxyXG4gICAgICAgIHRvcDogXCIwXCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc3Qgc2V0ID0gJCh0aGlzKS5zaWJsaW5ncyhcIi5zaG9wX19zcGVjc1wiKS5jc3Moe1xyXG4gICAgICAgIG9wYWNpdHk6IFwiMFwiLFxyXG4gICAgICAgIHRvcDogXCItOTk5OTlweFwiLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICApO1xyXG5cclxuICBzcGVjQmxvY2suaG92ZXIoXHJcbiAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IHNldCA9ICQodGhpcykuY3NzKHtcclxuICAgICAgICBvcGFjaXR5OiBcIjFcIixcclxuICAgICAgICB0b3A6IFwiMFwiLFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IHNldCA9ICQodGhpcykuY3NzKHtcclxuICAgICAgICBvcGFjaXR5OiBcIjBcIixcclxuICAgICAgICB0b3A6IFwiLTk5OTk5cHhcIixcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgKTtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICBsZXQgbXlNYXA7XHJcblxyXG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XHJcbiAgICBteU1hcCA9IG5ldyB5bWFwcy5NYXAoXCJtYXBfX2ltYWdlXCIsIHtcclxuICAgICAgY2VudGVyOiBbNTYuMDExMDM3NSwgOTIuODcxNDI3MjhdLFxyXG4gICAgICB6b29tOiAxMSxcclxuICAgICAgY29udHJvbHM6IFtdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgY29vcmRzID0gW1xyXG4gICAgICBbNTYuMDUxMDAyODQsIDkyLjkwNDMwNDA2XSxcclxuICAgICAgWzU2LjAyMjE0MjE1LCA5Mi43OTg2MzY4OV0sXHJcbiAgICAgIFs1Ni4wMDk5NzA3NywgOTIuODcwNTY0OTNdLFxyXG4gICAgXTtcclxuXHJcbiAgICBjb25zdCBteUNvbGwgPSBuZXcgeW1hcHMuR2VvT2JqZWN0Q29sbGVjdGlvbihcclxuICAgICAge30sXHJcbiAgICAgIHtcclxuICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgIGljb25MYXlvdXQ6IFwiZGVmYXVsdCNpbWFnZVwiLFxyXG4gICAgICAgIGljb25JbWFnZUhyZWY6IFwiLi9pbWcvbWFwL21hcC1pY29uLnN2Z1wiLFxyXG4gICAgICAgIGljb25JbWFnZVNpemU6IFs1OCwgNzNdLFxyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIGNvb3Jkcy5mb3JFYWNoKChjb29yZCkgPT4ge1xyXG4gICAgICBteUNvbGwuYWRkKG5ldyB5bWFwcy5QbGFjZW1hcmsoY29vcmQpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIG15TWFwLmdlb09iamVjdHMuYWRkKG15Q29sbCk7XHJcblxyXG4gICAgbXlNYXAuYmVoYXZpb3JzLmRpc2FibGUoXCJzY3JvbGxab29tXCIpO1xyXG4gIH07XHJcblxyXG4gIHltYXBzLnJlYWR5KGluaXQpO1xyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gIGNvbnN0IHZhbGlkYXRlRmllbGRzID0gKGZvcm0sIGZpZWxkc0FycmF5KSA9PiB7XHJcbiAgICBmaWVsZHNBcnJheS5mb3JFYWNoKChmaWVsZCkgPT4ge1xyXG4gICAgICBmaWVsZC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgaWYgKGZpZWxkLnZhbCgpLnRyaW0oKSA9PT0gXCJcIikge1xyXG4gICAgICAgIGZpZWxkLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBlcnJvckZpZWxkcyA9IGZvcm0uZmluZChcIi5hY3RpdmVcIik7XHJcbiAgICByZXR1cm4gZXJyb3JGaWVsZHMubGVuZ3RoID09PSAwO1xyXG4gIH07XHJcblxyXG4gICQoXCIuZm9ybVwiKS5zdWJtaXQoZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCBmb3JtID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgY29uc3QgbmFtZSA9IGZvcm0uZmluZChcIltuYW1lPSduYW1lJ11cIik7XHJcbiAgICBjb25zdCBwaG9uZSA9IGZvcm0uZmluZChcIltuYW1lPSdwaG9uZSddXCIpO1xyXG4gICAgY29uc3QgY29tbWVudCA9IGZvcm0uZmluZChcIltuYW1lPSdjb21tZW50J11cIik7XHJcbiAgICBjb25zdCB0byA9IGZvcm0uZmluZChcIltuYW1lPSd0byddXCIpO1xyXG5cclxuICAgIGNvbnN0IG1vZGFsID0gJChcIiNtb2RhbFwiKTtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBtb2RhbC5maW5kKFwiLm1vZGFsX19jb250ZW50XCIpO1xyXG4gICAgLy8gY29uc29sZS5sb2coZm9ybSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhuYW1lLnZhbCgpLHBob25lLnZhbCgpKVxyXG4gICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlRmllbGRzKGZvcm0sIFtuYW1lLCBwaG9uZSwgY29tbWVudCwgdG9dKTtcclxuXHJcbiAgICBtb2RhbC5yZW1vdmVDbGFzcyhcImVycm9yLW1vZGFsXCIpO1xyXG5cclxuICAgIGlmIChpc1ZhbGlkKSB7XHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgdXJsOiBcImh0dHBzOi8vd2ViZGV2LWFwaS5sb2Z0c2Nob29sLmNvbS9zZW5kbWFpbFwiLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIG5hbWU6IG5hbWUudmFsKCksXHJcbiAgICAgICAgICBwaG9uZTogcGhvbmUudmFsKCksXHJcbiAgICAgICAgICBjb21tZW50OiBjb21tZW50LnZhbCgpLFxyXG4gICAgICAgICAgdG86IHRvLnZhbCgpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgIGNvbnRlbnQudGV4dChkYXRhLm1lc3NhZ2UpO1xyXG5cclxuICAgICAgICAgIEZhbmN5Ym94LnNob3coW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiBcIiNtb2RhbFwiLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW5saW5lXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGRhdGEucmVzcG9uc2VKU09OLm1lc3NhZ2U7XHJcbiAgICAgICAgICBjb250ZW50LnRleHQobWVzc2FnZSk7XHJcbiAgICAgICAgICBtb2RhbC5hZGRDbGFzcyhcImVycm9yLW1vZGFsXCIpO1xyXG5cclxuICAgICAgICAgIEZhbmN5Ym94LnNob3coW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiBcIiNtb2RhbFwiLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW5saW5lXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJChcIi5idG4tY2xvc2VcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIEZhbmN5Ym94LmNsb3NlKCk7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgc2VjdGlvbnMgPSAkKFwiLnNlY3Rpb25cIik7XHJcbiAgY29uc3QgZGlzcGxheSA9ICQoXCIubWFpbmNvbnRlbnRcIik7XHJcbiAgY29uc3Qgc2lkZU1lbnUgPSAkKFwiLmZpeGVkLW1lbnVcIik7XHJcbiAgY29uc3QgbWVudUl0ZW1zID0gc2lkZU1lbnUuZmluZChcIi5maXhlZC1tZW51X19pdGVtXCIpO1xyXG5cclxuICBjb25zdCBtb2JpbGVEZXRlY3QgPSBuZXcgTW9iaWxlRGV0ZWN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbiAgY29uc3QgaXNNb2JpbGUgPSBtb2JpbGVEZXRlY3QubW9iaWxlKCk7XHJcblxyXG4gIGxldCBpblNjcm9sbCA9IGZhbHNlO1xyXG5cclxuICBzZWN0aW9ucy5maXJzdCgpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cclxuICBjb25zdCBjb3VudFNlY3Rpb25Qb3NpdGlvbiA9IChzZWN0aW9uRXEpID0+IHtcclxuICAgIGNvbnN0IHBvc2l0aW9uID0gc2VjdGlvbkVxICogLTEwMDtcclxuICAgIGlmIChpc05hTihwb3NpdGlvbikpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihcclxuICAgICAgICBcItC90LXQstC10YDQvdGL0Lkg0L/QsNGA0LDQvNC10YLRgCzQvtGI0LjQsdC60LAg0LIg0YDQsNGB0YfRkdGC0LDRhSBjb3VudFNlY3Rpb25Qb3NpdGlvbigpXCJcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY2hhbmdlTWVudVRoZW1lRm9yU2VjdGlvbiA9IChzZWN0aW9uRXEpID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnRTZWN0aW9uID0gc2VjdGlvbnMuZXEoc2VjdGlvbkVxKTtcclxuICAgIGNvbnN0IG1lbnVUaGVtZSA9IGN1cnJlbnRTZWN0aW9uLmF0dHIoXCJkYXRhLXNpZGVtZW51LXRoZW1lXCIpO1xyXG5cclxuICAgIGlmIChtZW51VGhlbWUgPT09IFwiZGVmXCIpIHtcclxuICAgICAgc2lkZU1lbnUucmVtb3ZlQ2xhc3MoXCJmaXhlZC1tZW51LS1zaGFkb3dlZFwiKTtcclxuICAgIH1cclxuICAgIGlmIChtZW51VGhlbWUgPT09IFwid2hpdGVcIikge1xyXG4gICAgICBzaWRlTWVudS5hZGRDbGFzcyhcImZpeGVkLW1lbnUtLXNoYWRvd2VkXCIpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlc2V0QWN0aXZlQ2xhc3NGb3JJdGVtID0gKGl0ZW1zLCBpdGVtRXEsIGFjdGl2ZUNsYXNzKSA9PiB7XHJcbiAgICBpdGVtcy5lcShpdGVtRXEpLmFkZENsYXNzKGFjdGl2ZUNsYXNzKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKGFjdGl2ZUNsYXNzKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBwZXJmb3JtVHJhbnNpdGlvbiA9IChzZWN0aW9uRXEpID0+IHtcclxuICAgIGlmIChpblNjcm9sbCkgcmV0dXJuO1xyXG4gICAgY29uc3QgdHJhc2l0aW9uT3ZlciA9IDEwMDA7XHJcbiAgICBjb25zdCBtb3VzZUluZXJ0aWFsT3ZlciA9IDMwMDtcclxuICAgIGluU2Nyb2xsID0gdHJ1ZTtcclxuICAgIGNvbnN0IHBvc2l0aW9uID0gY291bnRTZWN0aW9uUG9zaXRpb24oc2VjdGlvbkVxKTtcclxuXHJcbiAgICBjaGFuZ2VNZW51VGhlbWVGb3JTZWN0aW9uKHNlY3Rpb25FcSk7XHJcblxyXG4gICAgZGlzcGxheS5jc3Moe1xyXG4gICAgICBUcmFuc2Zvcm06IGB0cmFuc2xhdGVZKCR7cG9zaXRpb259JSlgLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmVzZXRBY3RpdmVDbGFzc0Zvckl0ZW0oc2VjdGlvbnMsIHNlY3Rpb25FcSwgXCJhY3RpdmVcIik7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGluU2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgIHJlc2V0QWN0aXZlQ2xhc3NGb3JJdGVtKG1lbnVJdGVtcywgc2VjdGlvbkVxLCBcImZpeGVkLW1lbnVfX2l0ZW0tLWFjdGl2ZVwiKTtcclxuICAgIH0sIHRyYXNpdGlvbk92ZXIgKyBtb3VzZUluZXJ0aWFsT3Zlcik7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgdmlld3BvcnRTY3JvbGxlciA9ICgpID0+IHtcclxuICAgIGNvbnN0IGFjdGl2ZVNlY3Rpb24gPSBzZWN0aW9ucy5maWx0ZXIoXCIuYWN0aXZlXCIpO1xyXG4gICAgY29uc3QgbmV4dFNlY3Rpb24gPSBhY3RpdmVTZWN0aW9uLm5leHQoKTtcclxuICAgIGNvbnN0IHByZXZTZWN0aW9uID0gYWN0aXZlU2VjdGlvbi5wcmV2KCk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmV4dCgpIHtcclxuICAgICAgICBpZiAobmV4dFNlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgICBwZXJmb3JtVHJhbnNpdGlvbihuZXh0U2VjdGlvbi5pbmRleCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHByZXYoKSB7XHJcbiAgICAgICAgaWYgKHByZXZTZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgcGVyZm9ybVRyYW5zaXRpb24ocHJldlNlY3Rpb24uaW5kZXgoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICAkKHdpbmRvdykub24oXCJ3aGVlbFwiLCAoZSkgPT4ge1xyXG4gICAgY29uc3QgZGVsdGFZID0gZS5vcmlnaW5hbEV2ZW50LmRlbHRhWTtcclxuXHJcbiAgICBjb25zdCBzY3JvbGxlciA9IHZpZXdwb3J0U2Nyb2xsZXIoKTtcclxuXHJcbiAgICBpZiAoZGVsdGFZID4gMCkge1xyXG4gICAgICBzY3JvbGxlci5uZXh0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRlbHRhWSA8IDApIHtcclxuICAgICAgc2Nyb2xsZXIucHJldigpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKHdpbmRvdykub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XHJcbiAgICBjb25zdCB0YWdOYW1lID0gZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgY29uc3Qgc2Nyb2xsZXIgPSB2aWV3cG9ydFNjcm9sbGVyKCk7XHJcbiAgICBjb25zdCB1c2VyVHlwaW5nSW5JbnB1dHMgPSB0YWdOYW1lID09IFwiaW5wdXRcIiB8fCB0YWdOYW1lID09IFwidGV4dGFyZWFcIjtcclxuXHJcbiAgICBpZiAodXNlclR5cGluZ0luSW5wdXRzKSByZXR1cm47XHJcblxyXG4gICAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgICAgY2FzZSAzODpcclxuICAgICAgICBzY3JvbGxlci5wcmV2KCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgNDA6XHJcbiAgICAgICAgc2Nyb2xsZXIubmV4dCgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAkKFwiW2RhdGEtc2Nyb2xsLXRvXVwiKS5jbGljaygoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0ICR0aGlzID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gJHRoaXMuYXR0cihcImRhdGEtc2Nyb2xsLXRvXCIpO1xyXG4gICAgY29uc3QgcmVxU2VjdGlvbiA9ICQoYFtkYXRhLXNlY3Rpb24taWQ9JHt0YXJnZXR9XWApO1xyXG5cclxuICAgIHBlcmZvcm1UcmFuc2l0aW9uKHJlcVNlY3Rpb24uaW5kZXgoKSk7XHJcbiAgfSk7XHJcblxyXG4gIGlmIChpc01vYmlsZSkge1xyXG4gICAgJChcIi53cmFwcGVyXCIpLm9uKFwidG91Y2htb3ZlXCIsIChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCkpO1xyXG5cclxuICAgICQoXCJib2R5XCIpLnN3aXBlKHtcclxuICAgICAgLy9HZW5lcmljIHN3aXBlIGhhbmRsZXIgZm9yIGFsbCBkaXJlY3Rpb25zXHJcbiAgICAgIHN3aXBlOiBmdW5jdGlvbiAoZXZlbnQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbGVyID0gdmlld3BvcnRTY3JvbGxlcigpO1xyXG4gICAgICAgIGxldCBzY3JvbGxEaXJlY3Rpb24gPSBcIlwiO1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwidXBcIikgc2Nyb2xsRGlyZWN0aW9uID0gXCJuZXh0XCI7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJkb3duXCIpIHNjcm9sbERpcmVjdGlvbiA9IFwicHJldlwiO1xyXG5cclxuICAgICAgICBzY3JvbGxlcltzY3JvbGxEaXJlY3Rpb25dKCk7XHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgc2xpZGVyVGltaW5nID0gJChcIi5wbGF5ZXJfX3NsaWRlci10aW1pbmdcIik7XHJcbiAgY29uc3Qgc2xpZGVyVm9sdW1lID0gJChcIi5zbGlkZXJfX3ZvbHVtZVwiKTtcclxuXHJcbiAgc2xpZGVyVm9sdW1lLnNsaWRlcih7XHJcbiAgICByYW5nZTogXCJtaW5cIixcclxuICAgIHZhbHVlOiAzMyxcclxuICB9KTtcclxuXHJcbiAgc2xpZGVyVGltaW5nLnNsaWRlcih7XHJcbiAgICByYW5nZTogXCJtaW5cIixcclxuICAgIHZhbHVlOiAwLFxyXG4gIH0pO1xyXG5cclxuICBsZXQgcGxheWVyO1xyXG4gIGNvbnN0IHNwbGFzaENvbnRhaW5lciA9ICQoXCIucGxheWVyX19zcGxhc2hcIik7XHJcbiAgY29uc3QgcGxheWVyU3RhcnQgPSAkKFwiLnBsYXllcl9fc3RhcnRcIik7XHJcblxyXG4gIGxldCBldmVudHNJbml0ID0gKCkgPT4ge1xyXG4gICAgcGxheWVyU3RhcnQuY2xpY2soKGUpID0+IHtcclxuICAgICAgaWYgKHNwbGFzaENvbnRhaW5lci5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG4gICAgICAgIHBsYXllci5wYXVzZVZpZGVvKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcGxheWVyLnBsYXlWaWRlbygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHNwbGFzaENvbnRhaW5lci5jbGljaygoZSkgPT4ge1xyXG4gICAgICBwbGF5ZXIucGxheVZpZGVvKCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBzbGlkZXJUaW1pbmcuY2xpY2soKGUpID0+IHtcclxuICAgIGNvbnN0IHNlZWtUb1NlYyA9IHNsaWRlclRpbWluZy5zbGlkZXIoXCJvcHRpb25cIiwgXCJ2YWx1ZVwiKTtcclxuICAgIHBsYXllci5zZWVrVG8oc2Vla1RvU2VjKTtcclxuICB9KTtcclxuXHJcbiAgc2xpZGVyVm9sdW1lLm9uKFwic2xpZGVjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgIGNvbnN0IHRvVm9sdW1lID0gc2xpZGVyVm9sdW1lLnNsaWRlcihcIm9wdGlvblwiLCBcInZhbHVlXCIpO1xyXG4gICAgcGxheWVyLnNldFZvbHVtZSh0b1ZvbHVtZSk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IG9uUGxheWVyUmVhZHkgPSAoKSA9PiB7XHJcbiAgICBsZXQgaW50ZXJ2YWw7XHJcblxyXG4gICAgY29uc3QgZHVyYXRpb25TZWMgPSBwbGF5ZXIuZ2V0RHVyYXRpb24oKTtcclxuICAgIHNsaWRlclRpbWluZy5zbGlkZXIoXCJvcHRpb25cIiwgXCJtYXhcIiwgZHVyYXRpb25TZWMpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgaW50ZXJ2YWwgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbXBsZXRlZFNlYyA9IHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xyXG4gICAgICBzbGlkZXJUaW1pbmcuc2xpZGVyKFwib3B0aW9uXCIsIFwidmFsdWVcIiwgY29tcGxldGVkU2VjKTtcclxuICAgIH0sIDEwMDApO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uUGxheWVyU3RhdGVDaGFuZ2UgPSAoZXZlbnQpID0+IHtcclxuICAgIC8qXHJcbiAgICAgICAg0JLQvtC30LLRgNCw0YnQsNC10YIg0YHQvtGB0YLQvtGP0L3QuNC1INC/0YDQvtC40LPRgNGL0LLQsNGC0LXQu9GPLiDQktC+0LfQvNC+0LbQvdGL0LUg0LfQvdCw0YfQtdC90LjRjzpcclxuICAgICAgICAtMSDigJMg0LLQvtGB0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1INCy0LjQtNC10L4g0L3QtSDQvdCw0YfQsNC70L7RgdGMXHJcbiAgICAgICAgMCDigJMg0LLQvtGB0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1INCy0LjQtNC10L4g0LfQsNCy0LXRgNGI0LXQvdC+XHJcbiAgICAgICAgMSDigJMg0LLQvtGB0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1XHJcbiAgICAgICAgMiDigJMg0L/QsNGD0LfQsFxyXG4gICAgICAgIDMg4oCTINCx0YPRhNC10YDQuNC30LDRhtC40Y9cclxuICAgICAgICA1IOKAkyDQstC40LTQtdC+INC90LDRhdC+0LTQuNGC0YHRjyDQsiDQvtGH0LXRgNC10LTQuCBcclxuICAgICovXHJcbiAgICBzd2l0Y2ggKGV2ZW50LmRhdGEpIHtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHNwbGFzaENvbnRhaW5lci5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICBwbGF5ZXJTdGFydC5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHNwbGFzaENvbnRhaW5lci5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICBwbGF5ZXJTdGFydC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBvbllvdVR1YmVJZnJhbWVBUElSZWFkeSgpIHtcclxuICAgIHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoXCJ5dC1wbGF5ZXJcIiwge1xyXG4gICAgICBoZWlnaHQ6IFwiMzkyXCIsXHJcbiAgICAgIHdpZHRoOiBcIjY2MlwiLFxyXG4gICAgICB2aWRlb0lkOiBcIkRkMVZJZVRNR1FzXCIsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIG9uUmVhZHk6IG9uUGxheWVyUmVhZHksXHJcbiAgICAgICAgb25TdGF0ZUNoYW5nZTogb25QbGF5ZXJTdGF0ZUNoYW5nZSxcclxuICAgICAgfSxcclxuICAgICAgcGxheWVyVmFyczoge1xyXG4gICAgICAgIGNvbnRyb2xzOiAwLFxyXG4gICAgICAgIGRpc2FibGVrYjogMCxcclxuICAgICAgICBzaG93aW5mbzogMCxcclxuICAgICAgICByZWw6IDAsXHJcbiAgICAgICAgYXV0b3BsYXk6IDAsXHJcbiAgICAgICAgbW9kZXN0YnJhbmRpbmc6IDAsXHJcbiAgICAgICAgZnM6IDAsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGV2ZW50c0luaXQoKTtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICBjb25zdCBmaW5kQmxvY2tCeUFsaWFzID0gKGFsaWFzKSA9PiB7XHJcbiAgICByZXR1cm4gJChcIi5yZXZpZXdcIikuZmlsdGVyKChuZHgsIGl0ZW0pID0+IHtcclxuICAgICAgcmV0dXJuICQoaXRlbSkuYXR0cihcImRhdGEtbGluay13aXRoXCIpID09PSBhbGlhcztcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gICQoXCIucmV2aWV3X19wYWdlci1saW5rXCIpLmNsaWNrKChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgJHRoaXMgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICBjb25zdCB0YXJnZXQgPSAkdGhpcy5hdHRyKFwiZGF0YS11c2VyXCIpO1xyXG4gICAgY29uc3QgaXRlbVRvU2hvdyA9IGZpbmRCbG9ja0J5QWxpYXModGFyZ2V0KTtcclxuICAgIGNvbnN0IGN1ckl0ZW0gPSAkdGhpcy5jbG9zZXN0KFwiLnJldmlld19fcGFnZXItaXRlbVwiKTtcclxuXHJcbiAgICBpdGVtVG9TaG93LmFkZENsYXNzKFwiYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBjdXJJdGVtLmFkZENsYXNzKFwiYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgc2xpZGVyID0gJChcIi5zbGlkZXJcIikuYnhTbGlkZXIoe1xyXG4gICAgcGFnZXI6IGZhbHNlLFxyXG4gICAgY29udHJvbHM6IGZhbHNlLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBwYWdlclJpZ2h0ID0gJChcIi5zaG9wX19wYWdlci0tcmlnaHRcIik7XHJcbiAgcGFnZXJSaWdodC5jbGljaygoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgc2xpZGVyLmdvVG9OZXh0U2xpZGUoKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgcGFnZXJMZWZ0ID0gJChcIi5zaG9wX19wYWdlci0tbGVmdFwiKTtcclxuICBwYWdlckxlZnQuY2xpY2soKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNsaWRlci5nb1RvUHJldlNsaWRlKCk7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgb3Blbkl0ZW0gPSAoaXRlbSkgPT4ge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gaXRlbS5jbG9zZXN0KFwiLnRlYW1fX2l0ZW1cIik7XHJcbiAgICAvL2NvbnNvbGUubG9nKGNvbnRhaW5lcik7XHJcbiAgICBjb25zdCBjb250ZW50QmxvY2sgPSBjb250YWluZXIuZmluZChcIi50ZWFtX19jb250ZW50XCIpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhjb250ZW50QmxvY2spO1xyXG4gICAgY29uc3QgdGV4dEJsb2NrID0gY29udGVudEJsb2NrLmZpbmQoXCIudGVhbV9fY29udGVudC1ibG9ja1wiKTtcclxuICAgIC8vY29uc29sZS5sb2codGV4dEJsb2NrKTtcclxuICAgIGNvbnN0IHJlcUhlaWdodCA9IHRleHRCbG9jay5oZWlnaHQoKTtcclxuICAgIC8vY29uc29sZS5sb2cocmVxSGVpZ2h0KTtcclxuICAgIGNvbnN0IGFycm93ID0gY29udGFpbmVyLmZpbmQoXCIudGVhbV9fdGl0bGUtYXJyb3dcIik7XHJcblxyXG4gICAgY29udGFpbmVyLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgYXJyb3cuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBjb250ZW50QmxvY2suaGVpZ2h0KHJlcUhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY2xvc2VFdmVyeUl0ZW0gPSAoY29udGFpbmVyKSA9PiB7XHJcbiAgICAvL2NvbnNvbGUubG9nKGNvbnRhaW5lcik7XHJcbiAgICBjb25zdCBpdGVtcyA9IGNvbnRhaW5lci5maW5kKFwiLnRlYW1fX2NvbnRlbnRcIik7XHJcbiAgICAvL2NvbnNvbGUubG9nKGl0ZW1zKTtcclxuICAgIGNvbnN0IGl0ZW1Db250YWluZXIgPSBjb250YWluZXIuZmluZChcIi50ZWFtX19pdGVtXCIpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhpdGVtQ29udGFpbmVyKTtcclxuICAgIGNvbnN0IGFycm93ID0gaXRlbUNvbnRhaW5lci5maW5kKFwiLnRlYW1fX3RpdGxlLWFycm93XCIpO1xyXG5cclxuICAgIGl0ZW1Db250YWluZXIucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBhcnJvdy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgIGl0ZW1zLmhlaWdodCgwKTtcclxuICB9O1xyXG5cclxuICAkKFwiLnRlYW1fX3RpdGxlXCIpLmNsaWNrKChlKSA9PiB7XHJcbiAgICBjb25zdCAkdGhpcyA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgIC8vY29uc29sZS5sb2coJHRoaXMpO1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdChcIi50ZWFtXCIpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhjb250YWluZXIpO1xyXG4gICAgY29uc3QgZWxlbUNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoXCIudGVhbV9faXRlbVwiKTtcclxuICAgIC8vY29uc29sZS5sb2coZWxlbUNvbnRhaW5lcik7XHJcbiAgICBpZiAoZWxlbUNvbnRhaW5lci5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG4gICAgICBjbG9zZUV2ZXJ5SXRlbShjb250YWluZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2xvc2VFdmVyeUl0ZW0oY29udGFpbmVyKTtcclxuICAgICAgb3Blbkl0ZW0oJHRoaXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KSgpO1xyXG4iXX0=
