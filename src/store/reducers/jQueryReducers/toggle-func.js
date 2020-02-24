import $ from 'jquery';

// remove all .show-case classes when clicked anywhere
let hide = true;
$('body').on("click", function () {
    if (hide) $('.toggle-case').removeClass('show-case');
    hide = true;
});

// add and remove .show-case
$('body').on('click', '.toggle-case', function () {

    let self = $(this);

    if (self.hasClass('show-case')) {
        $('.toggle-case').removeClass('show-case');
        return false;
    }

    $('.toggle-case').removeClass('show-case');

    self.toggleClass('show-case');
    hide = false;
  });
