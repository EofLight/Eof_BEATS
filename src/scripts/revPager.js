(function () {
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
