(function () {
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
