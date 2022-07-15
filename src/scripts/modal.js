(function () {
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
