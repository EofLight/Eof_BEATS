;(function () {
  function closeEvery(items, curItem) {
    items.not(curItem).removeClass("active");
    items.not(curItem).width(0);
  }

  $(".color__name").click((e) => {
    const allContent = $(".colors__content");

    const $this = $(e.currentTarget);
    const parent = $this.closest('.colors__item');

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
      parent.addClass('colors__item--active');
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
      if (winWidth <= 480) {
        textBlock.width(
          winWidth - $this.width() -
            (parseInt(textBlock.css("padding-left")) +
              parseInt(textBlock.css("padding-right")))
        );
        curContent.width(winWidth-$this.width());
      }
    } else {
      curContent.removeClass("active");
      parent.removeClass('colors__item--active');
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
    $('body').addClass('locked');
  });

  fullscreenMenu
    .querySelector("#fmenu__close")
    .addEventListener("click", function (event) {
      event.preventDefault();
      fullscreenMenu.style.display = "none";
      $('body').removeClass('locked');
    });

  fullscreenMenu.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("menu__link")) {
      fullscreenMenu.style.display = "none";
      $('body').removeClass('locked');
    }
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

  $(".form").on("submit", function (e) {
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
      $('body').addClass('locked');
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

  $(".btn-close").on("click", function (e) {
    e.preventDefault();
    Fancybox.close();
    $('body').removeClass('locked');
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
    if (inScroll ||$('body').hasClass('locked')) return;
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
    $('body').removeClass('locked');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbG9ycy5qcyIsImluZGV4LmpzIiwibWFwLmpzIiwibW9kYWwuanMiLCJvcHMuanMiLCJwbGF5ZXIuanMiLCJyZXZQYWdlci5qcyIsInNsaWRlci5qcyIsInRlYW1EZXNjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0NoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0M1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4tanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBjbG9zZUV2ZXJ5KGl0ZW1zLCBjdXJJdGVtKSB7XHJcbiAgICBpdGVtcy5ub3QoY3VySXRlbSkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBpdGVtcy5ub3QoY3VySXRlbSkud2lkdGgoMCk7XHJcbiAgfVxyXG5cclxuICAkKFwiLmNvbG9yX19uYW1lXCIpLmNsaWNrKChlKSA9PiB7XHJcbiAgICBjb25zdCBhbGxDb250ZW50ID0gJChcIi5jb2xvcnNfX2NvbnRlbnRcIik7XHJcblxyXG4gICAgY29uc3QgJHRoaXMgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICBjb25zdCBwYXJlbnQgPSAkdGhpcy5jbG9zZXN0KCcuY29sb3JzX19pdGVtJyk7XHJcblxyXG4gICAgY29uc3Qgd2luV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgIGNvbnN0IG5lZWRXaWR0aCA9IHdpbldpZHRoIC0gJHRoaXMud2lkdGgoKSAqIDM7XHJcbiAgICBjb25zdCBzZWN0aW9uV2lkdGggPSAkdGhpcy5jbG9zZXN0KFwiLnNlY3Rpb25cIikud2lkdGgoKTtcclxuXHJcbiAgICBjb25zdCBjdXJDb250ZW50ID0gJHRoaXMuc2libGluZ3MoXCIuY29sb3JzX19jb250ZW50XCIpO1xyXG4gICAgY29uc3QgdGV4dEJsb2NrID0gY3VyQ29udGVudC5maW5kKFwiLmNvbG9yc19fY29udGVudC1ibG9ja1wiKTtcclxuICAgIGNvbnN0IHRleHRXaWR0aE1vYmlsZSA9XHJcbiAgICAgIG5lZWRXaWR0aCAtXHJcbiAgICAgIHBhcnNlSW50KHRleHRCbG9jay5jc3MoXCJwYWRkaW5nLWxlZnRcIikpICtcclxuICAgICAgcGFyc2VJbnQodGV4dEJsb2NrLmNzcyhcInBhZGRpbmctcmlnaHRcIikpO1xyXG4gICAgY29uc3QgdGV4dFdpZHRoRGVza3RvcCA9IDM1MDtcclxuICAgIGNsb3NlRXZlcnkoYWxsQ29udGVudCwgY3VyQ29udGVudCk7XHJcblxyXG4gICAgaWYgKCFjdXJDb250ZW50Lmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcbiAgICAgIGN1ckNvbnRlbnQuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgIHBhcmVudC5hZGRDbGFzcygnY29sb3JzX19pdGVtLS1hY3RpdmUnKTtcclxuICAgICAgdGV4dEJsb2NrLndpZHRoKHRleHRXaWR0aERlc2t0b3ApO1xyXG4gICAgICBjdXJDb250ZW50LndpZHRoKFxyXG4gICAgICAgIHRleHRXaWR0aERlc2t0b3AgK1xyXG4gICAgICAgICAgKHBhcnNlSW50KHRleHRCbG9jay5jc3MoXCJwYWRkaW5nLWxlZnRcIikpICtcclxuICAgICAgICAgICAgcGFyc2VJbnQodGV4dEJsb2NrLmNzcyhcInBhZGRpbmctcmlnaHRcIikpKVxyXG4gICAgICApO1xyXG4gICAgICBpZiAod2luV2lkdGggPD0gNzY4KSB7XHJcbiAgICAgICAgdGV4dEJsb2NrLndpZHRoKFxyXG4gICAgICAgICAgdGV4dFdpZHRoTW9iaWxlIC1cclxuICAgICAgICAgICAgKHBhcnNlSW50KHRleHRCbG9jay5jc3MoXCJwYWRkaW5nLWxlZnRcIikpICtcclxuICAgICAgICAgICAgICBwYXJzZUludCh0ZXh0QmxvY2suY3NzKFwicGFkZGluZy1yaWdodFwiKSkpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdXJDb250ZW50LndpZHRoKG5lZWRXaWR0aCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHdpbldpZHRoIDw9IDQ4MCkge1xyXG4gICAgICAgIHRleHRCbG9jay53aWR0aChcclxuICAgICAgICAgIHdpbldpZHRoIC0gJHRoaXMud2lkdGgoKSAtXHJcbiAgICAgICAgICAgIChwYXJzZUludCh0ZXh0QmxvY2suY3NzKFwicGFkZGluZy1sZWZ0XCIpKSArXHJcbiAgICAgICAgICAgICAgcGFyc2VJbnQodGV4dEJsb2NrLmNzcyhcInBhZGRpbmctcmlnaHRcIikpKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3VyQ29udGVudC53aWR0aCh3aW5XaWR0aC0kdGhpcy53aWR0aCgpKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VyQ29udGVudC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgcGFyZW50LnJlbW92ZUNsYXNzKCdjb2xvcnNfX2l0ZW0tLWFjdGl2ZScpO1xyXG4gICAgICBjdXJDb250ZW50LndpZHRoKDApO1xyXG4gICAgfVxyXG4gICAgLypcclxuICAgIGlmKCEkdGhpcy5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7XHJcbiAgICAgICAgJHRoaXMuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICB9IGVsc2V7XHJcbiAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICB9XHJcbiovXHJcbiAgfSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3QgaGFtYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNoYW1idXJnZXJcIik7XHJcbiAgY29uc3QgZnVsbHNjcmVlbk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2ZtZW51XCIpO1xyXG5cclxuICBoYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBmdWxsc2NyZWVuTWVudS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdsb2NrZWQnKTtcclxuICB9KTtcclxuXHJcbiAgZnVsbHNjcmVlbk1lbnVcclxuICAgIC5xdWVyeVNlbGVjdG9yKFwiI2ZtZW51X19jbG9zZVwiKVxyXG4gICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZnVsbHNjcmVlbk1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2xvY2tlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gIGZ1bGxzY3JlZW5NZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIm1lbnVfX2xpbmtcIikpIHtcclxuICAgICAgZnVsbHNjcmVlbk1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2xvY2tlZCcpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBzcGVjYnV0dG9uID0gJChcIi5zaG9wX19mdW5jXCIpO1xyXG4gIGNvbnN0IHNwZWNCbG9jayA9ICQoXCIuc2hvcF9fc3BlY3NcIik7XHJcblxyXG4gIHNwZWNidXR0b24uaG92ZXIoXHJcbiAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IHNldCA9ICQodGhpcykuc2libGluZ3MoXCIuc2hvcF9fc3BlY3NcIikuY3NzKHtcclxuICAgICAgICBvcGFjaXR5OiBcIjFcIixcclxuICAgICAgICB0b3A6IFwiMFwiLFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IHNldCA9ICQodGhpcykuc2libGluZ3MoXCIuc2hvcF9fc3BlY3NcIikuY3NzKHtcclxuICAgICAgICBvcGFjaXR5OiBcIjBcIixcclxuICAgICAgICB0b3A6IFwiLTk5OTk5cHhcIixcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgKTtcclxuXHJcbiAgc3BlY0Jsb2NrLmhvdmVyKFxyXG4gICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICBjb25zdCBzZXQgPSAkKHRoaXMpLmNzcyh7XHJcbiAgICAgICAgb3BhY2l0eTogXCIxXCIsXHJcbiAgICAgICAgdG9wOiBcIjBcIixcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICBjb25zdCBzZXQgPSAkKHRoaXMpLmNzcyh7XHJcbiAgICAgICAgb3BhY2l0eTogXCIwXCIsXHJcbiAgICAgICAgdG9wOiBcIi05OTk5OXB4XCIsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IG15TWFwO1xyXG5cclxuICBjb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgbXlNYXAgPSBuZXcgeW1hcHMuTWFwKFwibWFwX19pbWFnZVwiLCB7XHJcbiAgICAgIGNlbnRlcjogWzU2LjAxMTAzNzUsIDkyLjg3MTQyNzI4XSxcclxuICAgICAgem9vbTogMTEsXHJcbiAgICAgIGNvbnRyb2xzOiBbXSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGNvb3JkcyA9IFtcclxuICAgICAgWzU2LjA1MTAwMjg0LCA5Mi45MDQzMDQwNl0sXHJcbiAgICAgIFs1Ni4wMjIxNDIxNSwgOTIuNzk4NjM2ODldLFxyXG4gICAgICBbNTYuMDA5OTcwNzcsIDkyLjg3MDU2NDkzXSxcclxuICAgIF07XHJcblxyXG4gICAgY29uc3QgbXlDb2xsID0gbmV3IHltYXBzLkdlb09iamVjdENvbGxlY3Rpb24oXHJcbiAgICAgIHt9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcclxuICAgICAgICBpY29uTGF5b3V0OiBcImRlZmF1bHQjaW1hZ2VcIixcclxuICAgICAgICBpY29uSW1hZ2VIcmVmOiBcIi4vaW1nL21hcC9tYXAtaWNvbi5zdmdcIixcclxuICAgICAgICBpY29uSW1hZ2VTaXplOiBbNTgsIDczXSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBjb29yZHMuZm9yRWFjaCgoY29vcmQpID0+IHtcclxuICAgICAgbXlDb2xsLmFkZChuZXcgeW1hcHMuUGxhY2VtYXJrKGNvb3JkKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBteU1hcC5nZW9PYmplY3RzLmFkZChteUNvbGwpO1xyXG5cclxuICAgIG15TWFwLmJlaGF2aW9ycy5kaXNhYmxlKFwic2Nyb2xsWm9vbVwiKTtcclxuICB9O1xyXG5cclxuICB5bWFwcy5yZWFkeShpbml0KTtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICBjb25zdCB2YWxpZGF0ZUZpZWxkcyA9IChmb3JtLCBmaWVsZHNBcnJheSkgPT4ge1xyXG4gICAgZmllbGRzQXJyYXkuZm9yRWFjaCgoZmllbGQpID0+IHtcclxuICAgICAgZmllbGQucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgIGlmIChmaWVsZC52YWwoKS50cmltKCkgPT09IFwiXCIpIHtcclxuICAgICAgICBmaWVsZC5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZXJyb3JGaWVsZHMgPSBmb3JtLmZpbmQoXCIuYWN0aXZlXCIpO1xyXG4gICAgcmV0dXJuIGVycm9yRmllbGRzLmxlbmd0aCA9PT0gMDtcclxuICB9O1xyXG5cclxuICAkKFwiLmZvcm1cIikub24oXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCBmb3JtID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgY29uc3QgbmFtZSA9IGZvcm0uZmluZChcIltuYW1lPSduYW1lJ11cIik7XHJcbiAgICBjb25zdCBwaG9uZSA9IGZvcm0uZmluZChcIltuYW1lPSdwaG9uZSddXCIpO1xyXG4gICAgY29uc3QgY29tbWVudCA9IGZvcm0uZmluZChcIltuYW1lPSdjb21tZW50J11cIik7XHJcbiAgICBjb25zdCB0byA9IGZvcm0uZmluZChcIltuYW1lPSd0byddXCIpO1xyXG5cclxuICAgIGNvbnN0IG1vZGFsID0gJChcIiNtb2RhbFwiKTtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBtb2RhbC5maW5kKFwiLm1vZGFsX19jb250ZW50XCIpO1xyXG4gICAgLy8gY29uc29sZS5sb2coZm9ybSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhuYW1lLnZhbCgpLHBob25lLnZhbCgpKVxyXG4gICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlRmllbGRzKGZvcm0sIFtuYW1lLCBwaG9uZSwgY29tbWVudCwgdG9dKTtcclxuXHJcbiAgICBtb2RhbC5yZW1vdmVDbGFzcyhcImVycm9yLW1vZGFsXCIpO1xyXG5cclxuICAgIGlmIChpc1ZhbGlkKSB7XHJcbiAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbG9ja2VkJyk7XHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgdXJsOiBcImh0dHBzOi8vd2ViZGV2LWFwaS5sb2Z0c2Nob29sLmNvbS9zZW5kbWFpbFwiLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIG5hbWU6IG5hbWUudmFsKCksXHJcbiAgICAgICAgICBwaG9uZTogcGhvbmUudmFsKCksXHJcbiAgICAgICAgICBjb21tZW50OiBjb21tZW50LnZhbCgpLFxyXG4gICAgICAgICAgdG86IHRvLnZhbCgpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgIGNvbnRlbnQudGV4dChkYXRhLm1lc3NhZ2UpO1xyXG5cclxuICAgICAgICAgIEZhbmN5Ym94LnNob3coW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiBcIiNtb2RhbFwiLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW5saW5lXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGRhdGEucmVzcG9uc2VKU09OLm1lc3NhZ2U7XHJcbiAgICAgICAgICBjb250ZW50LnRleHQobWVzc2FnZSk7XHJcbiAgICAgICAgICBtb2RhbC5hZGRDbGFzcyhcImVycm9yLW1vZGFsXCIpO1xyXG5cclxuICAgICAgICAgIEZhbmN5Ym94LnNob3coW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiBcIiNtb2RhbFwiLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW5saW5lXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJChcIi5idG4tY2xvc2VcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgRmFuY3lib3guY2xvc2UoKTtcclxuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbG9ja2VkJyk7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgc2VjdGlvbnMgPSAkKFwiLnNlY3Rpb25cIik7XHJcbiAgY29uc3QgZGlzcGxheSA9ICQoXCIubWFpbmNvbnRlbnRcIik7XHJcbiAgY29uc3Qgc2lkZU1lbnUgPSAkKFwiLmZpeGVkLW1lbnVcIik7XHJcbiAgY29uc3QgbWVudUl0ZW1zID0gc2lkZU1lbnUuZmluZChcIi5maXhlZC1tZW51X19pdGVtXCIpO1xyXG5cclxuICBjb25zdCBtb2JpbGVEZXRlY3QgPSBuZXcgTW9iaWxlRGV0ZWN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbiAgY29uc3QgaXNNb2JpbGUgPSBtb2JpbGVEZXRlY3QubW9iaWxlKCk7XHJcblxyXG4gIGxldCBpblNjcm9sbCA9IGZhbHNlO1xyXG5cclxuICBzZWN0aW9ucy5maXJzdCgpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cclxuICBjb25zdCBjb3VudFNlY3Rpb25Qb3NpdGlvbiA9IChzZWN0aW9uRXEpID0+IHtcclxuICAgIGNvbnN0IHBvc2l0aW9uID0gc2VjdGlvbkVxICogLTEwMDtcclxuICAgIGlmIChpc05hTihwb3NpdGlvbikpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihcclxuICAgICAgICBcItC90LXQstC10YDQvdGL0Lkg0L/QsNGA0LDQvNC10YLRgCzQvtGI0LjQsdC60LAg0LIg0YDQsNGB0YfRkdGC0LDRhSBjb3VudFNlY3Rpb25Qb3NpdGlvbigpXCJcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY2hhbmdlTWVudVRoZW1lRm9yU2VjdGlvbiA9IChzZWN0aW9uRXEpID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnRTZWN0aW9uID0gc2VjdGlvbnMuZXEoc2VjdGlvbkVxKTtcclxuICAgIGNvbnN0IG1lbnVUaGVtZSA9IGN1cnJlbnRTZWN0aW9uLmF0dHIoXCJkYXRhLXNpZGVtZW51LXRoZW1lXCIpO1xyXG5cclxuICAgIGlmIChtZW51VGhlbWUgPT09IFwiZGVmXCIpIHtcclxuICAgICAgc2lkZU1lbnUucmVtb3ZlQ2xhc3MoXCJmaXhlZC1tZW51LS1zaGFkb3dlZFwiKTtcclxuICAgIH1cclxuICAgIGlmIChtZW51VGhlbWUgPT09IFwid2hpdGVcIikge1xyXG4gICAgICBzaWRlTWVudS5hZGRDbGFzcyhcImZpeGVkLW1lbnUtLXNoYWRvd2VkXCIpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlc2V0QWN0aXZlQ2xhc3NGb3JJdGVtID0gKGl0ZW1zLCBpdGVtRXEsIGFjdGl2ZUNsYXNzKSA9PiB7XHJcbiAgICBpdGVtcy5lcShpdGVtRXEpLmFkZENsYXNzKGFjdGl2ZUNsYXNzKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKGFjdGl2ZUNsYXNzKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBwZXJmb3JtVHJhbnNpdGlvbiA9IChzZWN0aW9uRXEpID0+IHtcclxuICAgIGlmIChpblNjcm9sbCB8fCQoJ2JvZHknKS5oYXNDbGFzcygnbG9ja2VkJykpIHJldHVybjtcclxuICAgIGNvbnN0IHRyYXNpdGlvbk92ZXIgPSAxMDAwO1xyXG4gICAgY29uc3QgbW91c2VJbmVydGlhbE92ZXIgPSAzMDA7XHJcbiAgICBpblNjcm9sbCA9IHRydWU7XHJcbiAgICBjb25zdCBwb3NpdGlvbiA9IGNvdW50U2VjdGlvblBvc2l0aW9uKHNlY3Rpb25FcSk7XHJcblxyXG4gICAgY2hhbmdlTWVudVRoZW1lRm9yU2VjdGlvbihzZWN0aW9uRXEpO1xyXG5cclxuICAgIGRpc3BsYXkuY3NzKHtcclxuICAgICAgVHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgke3Bvc2l0aW9ufSUpYCxcclxuICAgIH0pO1xyXG5cclxuICAgIHJlc2V0QWN0aXZlQ2xhc3NGb3JJdGVtKHNlY3Rpb25zLCBzZWN0aW9uRXEsIFwiYWN0aXZlXCIpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpblNjcm9sbCA9IGZhbHNlO1xyXG4gICAgICByZXNldEFjdGl2ZUNsYXNzRm9ySXRlbShtZW51SXRlbXMsIHNlY3Rpb25FcSwgXCJmaXhlZC1tZW51X19pdGVtLS1hY3RpdmVcIik7XHJcbiAgICB9LCB0cmFzaXRpb25PdmVyICsgbW91c2VJbmVydGlhbE92ZXIpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHZpZXdwb3J0U2Nyb2xsZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBhY3RpdmVTZWN0aW9uID0gc2VjdGlvbnMuZmlsdGVyKFwiLmFjdGl2ZVwiKTtcclxuICAgIGNvbnN0IG5leHRTZWN0aW9uID0gYWN0aXZlU2VjdGlvbi5uZXh0KCk7XHJcbiAgICBjb25zdCBwcmV2U2VjdGlvbiA9IGFjdGl2ZVNlY3Rpb24ucHJldigpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5leHQoKSB7XHJcbiAgICAgICAgaWYgKG5leHRTZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgcGVyZm9ybVRyYW5zaXRpb24obmV4dFNlY3Rpb24uaW5kZXgoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwcmV2KCkge1xyXG4gICAgICAgIGlmIChwcmV2U2VjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICAgIHBlcmZvcm1UcmFuc2l0aW9uKHByZXZTZWN0aW9uLmluZGV4KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgJCh3aW5kb3cpLm9uKFwid2hlZWxcIiwgKGUpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhWSA9IGUub3JpZ2luYWxFdmVudC5kZWx0YVk7XHJcblxyXG4gICAgY29uc3Qgc2Nyb2xsZXIgPSB2aWV3cG9ydFNjcm9sbGVyKCk7XHJcblxyXG4gICAgaWYgKGRlbHRhWSA+IDApIHtcclxuICAgICAgc2Nyb2xsZXIubmV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkZWx0YVkgPCAwKSB7XHJcbiAgICAgIHNjcm9sbGVyLnByZXYoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gICAgY29uc3QgdGFnTmFtZSA9IGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgIGNvbnN0IHNjcm9sbGVyID0gdmlld3BvcnRTY3JvbGxlcigpO1xyXG4gICAgY29uc3QgdXNlclR5cGluZ0luSW5wdXRzID0gdGFnTmFtZSA9PSBcImlucHV0XCIgfHwgdGFnTmFtZSA9PSBcInRleHRhcmVhXCI7XHJcblxyXG4gICAgaWYgKHVzZXJUeXBpbmdJbklucHV0cykgcmV0dXJuO1xyXG5cclxuICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XHJcbiAgICAgIGNhc2UgMzg6XHJcbiAgICAgICAgc2Nyb2xsZXIucHJldigpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDQwOlxyXG4gICAgICAgIHNjcm9sbGVyLm5leHQoKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJChcIltkYXRhLXNjcm9sbC10b11cIikuY2xpY2soKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBjb25zdCAkdGhpcyA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgIGNvbnN0IHRhcmdldCA9ICR0aGlzLmF0dHIoXCJkYXRhLXNjcm9sbC10b1wiKTtcclxuICAgIGNvbnN0IHJlcVNlY3Rpb24gPSAkKGBbZGF0YS1zZWN0aW9uLWlkPSR7dGFyZ2V0fV1gKTtcclxuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbG9ja2VkJyk7XHJcbiAgICBwZXJmb3JtVHJhbnNpdGlvbihyZXFTZWN0aW9uLmluZGV4KCkpO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoaXNNb2JpbGUpIHtcclxuICAgICQoXCIud3JhcHBlclwiKS5vbihcInRvdWNobW92ZVwiLCAoZSkgPT4gZS5wcmV2ZW50RGVmYXVsdCgpKTtcclxuXHJcbiAgICAkKFwiYm9keVwiKS5zd2lwZSh7XHJcbiAgICAgIC8vR2VuZXJpYyBzd2lwZSBoYW5kbGVyIGZvciBhbGwgZGlyZWN0aW9uc1xyXG4gICAgICBzd2lwZTogZnVuY3Rpb24gKGV2ZW50LCBkaXJlY3Rpb24pIHtcclxuICAgICAgICBjb25zdCBzY3JvbGxlciA9IHZpZXdwb3J0U2Nyb2xsZXIoKTtcclxuICAgICAgICBsZXQgc2Nyb2xsRGlyZWN0aW9uID0gXCJcIjtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBcInVwXCIpIHNjcm9sbERpcmVjdGlvbiA9IFwibmV4dFwiO1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwiZG93blwiKSBzY3JvbGxEaXJlY3Rpb24gPSBcInByZXZcIjtcclxuXHJcbiAgICAgICAgc2Nyb2xsZXJbc2Nyb2xsRGlyZWN0aW9uXSgpO1xyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgfVxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gIGNvbnN0IHNsaWRlclRpbWluZyA9ICQoXCIucGxheWVyX19zbGlkZXItdGltaW5nXCIpO1xyXG4gIGNvbnN0IHNsaWRlclZvbHVtZSA9ICQoXCIuc2xpZGVyX192b2x1bWVcIik7XHJcblxyXG4gIHNsaWRlclZvbHVtZS5zbGlkZXIoe1xyXG4gICAgcmFuZ2U6IFwibWluXCIsXHJcbiAgICB2YWx1ZTogMzMsXHJcbiAgfSk7XHJcblxyXG4gIHNsaWRlclRpbWluZy5zbGlkZXIoe1xyXG4gICAgcmFuZ2U6IFwibWluXCIsXHJcbiAgICB2YWx1ZTogMCxcclxuICB9KTtcclxuXHJcbiAgbGV0IHBsYXllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyXCIpO1xyXG5cclxuICBjb25zdCBzcGxhc2hDb250YWluZXIgPSAkKFwiLnBsYXllcl9fc3BsYXNoXCIpO1xyXG4gIGNvbnN0IHBsYXllclN0YXJ0ID0gJChcIi5wbGF5ZXJfX3N0YXJ0XCIpO1xyXG5cclxuICBsZXQgZXZlbnRzSW5pdCA9ICgpID0+IHtcclxuICAgIHBsYXllclN0YXJ0Lm9uKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgaWYgKHNwbGFzaENvbnRhaW5lci5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG4gICAgICAgIHBsYXllci5wYXVzZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHBsYXllci5wbGF5KCk7XHJcbiAgICAgIH1cclxuICAgICAgc3BsYXNoQ29udGFpbmVyLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICBwbGF5ZXJTdGFydC50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgIH0pO1xyXG4gICAgc3BsYXNoQ29udGFpbmVyLm9uKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIC8vaWYgKGV2ZW50LnRhcmdldCA9PT0gcGxheWVyU3RhcnQgfHwgZXZlbnQudGFyZ2V0ID09PSBzcGxhc2hDb250YWluZXIpIHtcclxuICAgICAgc3BsYXNoQ29udGFpbmVyLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICBwbGF5ZXJTdGFydC50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgY29uc29sZS5sb2cocGxheWVyLnBhdXNlZCk7XHJcbiAgICAgIGlmIChwbGF5ZXIucGF1c2VkKSB7XHJcbiAgICAgICAgcGxheWVyLnBsYXkoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwbGF5ZXIucGF1c2UoKTtcclxuICAgICAgfVxyXG4gICAgICAvL31cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHNsaWRlclRpbWluZy5vbihcImNsaWNrXCIsKGUpID0+IHtcclxuICAgIGNvbnN0IHNlZWtUb1NlYyA9IHNsaWRlclRpbWluZy5zbGlkZXIoXCJvcHRpb25cIiwgXCJ2YWx1ZVwiKTtcclxuICAgIHBsYXllci5jdXJyZW50VGltZSA9IHNlZWtUb1NlYztcclxuICB9KTtcclxuXHJcbiAgc2xpZGVyVm9sdW1lLm9uKFwic2xpZGVjaGFuZ2VcIiwgKGUpID0+IHtcclxuICAgIGNvbnN0IHRvVm9sdW1lID0gc2xpZGVyVm9sdW1lLnNsaWRlcihcIm9wdGlvblwiLCBcInZhbHVlXCIpO1xyXG4gICAgcGxheWVyLnZvbHVtZSA9IHRvVm9sdW1lIC8gMTAwO1xyXG4gIH0pO1xyXG5cclxuICBwbGF5ZXIub25jYW5wbGF5ID0gKCkgPT4ge1xyXG4gICAgbGV0IGludGVydmFsO1xyXG5cclxuICAgIGNvbnN0IGR1cmF0aW9uU2VjID0gcGxheWVyLmR1cmF0aW9uO1xyXG4gICAgc2xpZGVyVGltaW5nLnNsaWRlcihcIm9wdGlvblwiLCBcIm1heFwiLCBkdXJhdGlvblNlYyk7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBpbnRlcnZhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgY29uc3QgY29tcGxldGVkU2VjID0gcGxheWVyLmN1cnJlbnRUaW1lO1xyXG4gICAgICBzbGlkZXJUaW1pbmcuc2xpZGVyKFwib3B0aW9uXCIsIFwidmFsdWVcIiwgY29tcGxldGVkU2VjKTtcclxuICAgIH0sIDEwMDApO1xyXG4gIH07XHJcbiAgLypcclxuICBzcGxhc2hDb250YWluZXIub24oXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcclxuICAgIFxyXG4gICAgLypcclxuICAgIHN3aXRjaCAoZXZlbnQuZGF0YSkge1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgc3BsYXNoQ29udGFpbmVyLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIHBsYXllclN0YXJ0LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgc3BsYXNoQ29udGFpbmVyLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIHBsYXllclN0YXJ0LnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH0pOyovXHJcblxyXG4gIGV2ZW50c0luaXQoKTtcclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICBjb25zdCBmaW5kQmxvY2tCeUFsaWFzID0gKGFsaWFzKSA9PiB7XHJcbiAgICByZXR1cm4gJChcIi5yZXZpZXdcIikuZmlsdGVyKChuZHgsIGl0ZW0pID0+IHtcclxuICAgICAgcmV0dXJuICQoaXRlbSkuYXR0cihcImRhdGEtbGluay13aXRoXCIpID09PSBhbGlhcztcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gICQoXCIucmV2aWV3X19wYWdlci1saW5rXCIpLmNsaWNrKChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgJHRoaXMgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICBjb25zdCB0YXJnZXQgPSAkdGhpcy5hdHRyKFwiZGF0YS11c2VyXCIpO1xyXG4gICAgY29uc3QgaXRlbVRvU2hvdyA9IGZpbmRCbG9ja0J5QWxpYXModGFyZ2V0KTtcclxuICAgIGNvbnN0IGN1ckl0ZW0gPSAkdGhpcy5jbG9zZXN0KFwiLnJldmlld19fcGFnZXItaXRlbVwiKTtcclxuXHJcbiAgICBpdGVtVG9TaG93LmFkZENsYXNzKFwiYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBjdXJJdGVtLmFkZENsYXNzKFwiYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgc2xpZGVyID0gJChcIi5zbGlkZXJcIikuYnhTbGlkZXIoe1xyXG4gICAgcGFnZXI6IGZhbHNlLFxyXG4gICAgY29udHJvbHM6IGZhbHNlLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBwYWdlclJpZ2h0ID0gJChcIi5zaG9wX19wYWdlci0tcmlnaHRcIik7XHJcbiAgcGFnZXJSaWdodC5jbGljaygoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgc2xpZGVyLmdvVG9OZXh0U2xpZGUoKTtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgcGFnZXJMZWZ0ID0gJChcIi5zaG9wX19wYWdlci0tbGVmdFwiKTtcclxuICBwYWdlckxlZnQuY2xpY2soKGUpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNsaWRlci5nb1RvUHJldlNsaWRlKCk7XHJcbiAgfSk7XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgb3Blbkl0ZW0gPSAoaXRlbSkgPT4ge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gaXRlbS5jbG9zZXN0KFwiLnRlYW1fX2l0ZW1cIik7XHJcbiAgICAvL2NvbnNvbGUubG9nKGNvbnRhaW5lcik7XHJcbiAgICBjb25zdCBjb250ZW50QmxvY2sgPSBjb250YWluZXIuZmluZChcIi50ZWFtX19jb250ZW50XCIpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhjb250ZW50QmxvY2spO1xyXG4gICAgY29uc3QgdGV4dEJsb2NrID0gY29udGVudEJsb2NrLmZpbmQoXCIudGVhbV9fY29udGVudC1ibG9ja1wiKTtcclxuICAgIC8vY29uc29sZS5sb2codGV4dEJsb2NrKTtcclxuICAgIGNvbnN0IHJlcUhlaWdodCA9IHRleHRCbG9jay5oZWlnaHQoKTtcclxuICAgIC8vY29uc29sZS5sb2cocmVxSGVpZ2h0KTtcclxuICAgIGNvbnN0IGFycm93ID0gY29udGFpbmVyLmZpbmQoXCIudGVhbV9fdGl0bGUtYXJyb3dcIik7XHJcblxyXG4gICAgY29udGFpbmVyLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgYXJyb3cuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBjb250ZW50QmxvY2suaGVpZ2h0KHJlcUhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY2xvc2VFdmVyeUl0ZW0gPSAoY29udGFpbmVyKSA9PiB7XHJcbiAgICAvL2NvbnNvbGUubG9nKGNvbnRhaW5lcik7XHJcbiAgICBjb25zdCBpdGVtcyA9IGNvbnRhaW5lci5maW5kKFwiLnRlYW1fX2NvbnRlbnRcIik7XHJcbiAgICAvL2NvbnNvbGUubG9nKGl0ZW1zKTtcclxuICAgIGNvbnN0IGl0ZW1Db250YWluZXIgPSBjb250YWluZXIuZmluZChcIi50ZWFtX19pdGVtXCIpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhpdGVtQ29udGFpbmVyKTtcclxuICAgIGNvbnN0IGFycm93ID0gaXRlbUNvbnRhaW5lci5maW5kKFwiLnRlYW1fX3RpdGxlLWFycm93XCIpO1xyXG5cclxuICAgIGl0ZW1Db250YWluZXIucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICBhcnJvdy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgIGl0ZW1zLmhlaWdodCgwKTtcclxuICB9O1xyXG5cclxuICAkKFwiLnRlYW1fX3RpdGxlXCIpLmNsaWNrKChlKSA9PiB7XHJcbiAgICBjb25zdCAkdGhpcyA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgIC8vY29uc29sZS5sb2coJHRoaXMpO1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gJHRoaXMuY2xvc2VzdChcIi50ZWFtXCIpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhjb250YWluZXIpO1xyXG4gICAgY29uc3QgZWxlbUNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoXCIudGVhbV9faXRlbVwiKTtcclxuICAgIC8vY29uc29sZS5sb2coZWxlbUNvbnRhaW5lcik7XHJcbiAgICBpZiAoZWxlbUNvbnRhaW5lci5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xyXG4gICAgICBjbG9zZUV2ZXJ5SXRlbShjb250YWluZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2xvc2VFdmVyeUl0ZW0oY29udGFpbmVyKTtcclxuICAgICAgb3Blbkl0ZW0oJHRoaXMpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KSgpO1xyXG4iXX0=
