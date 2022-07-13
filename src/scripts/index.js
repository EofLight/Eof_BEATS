(function () {
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
