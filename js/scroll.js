$(document).ready(() => {
  const headerNavScroll = () => {
    var $headerNav = $('header nav');
    var scrollTop = Math.floor($(window).scrollTop());
    if (scrollTop === 0) {
      $headerNav.removeClass('fixed');
    } else {
      if (scrollTop < $headerNav.innerHeight()) {
        return false;
      }
      if (CONFIG.theme.header.fixed) {
        $headerNav.addClass('fixed');
      }
    }
  };

  var isBack2topEnable = CONFIG.theme.back2top && CONFIG.theme.back2top.enable;
  var isBack2topShow = false;

  const back2top = () => {
    var $back2top = $('#back2top');
    if ($(window).scrollTop() > $('header').innerHeight()) {
      if (!isBack2topShow) {
        $back2top.addClass('show');
        isBack2topShow = true;
      }
    } else {
      $back2top.removeClass('show');
      isBack2topShow = false;
    }
  };

  if (isBack2topEnable) {
    back2top();
    $('#back2top').on('click', (e) => {
      e.preventDefault();
      $('html').animate({ scrollTop: 0 });
      return false;
    });
  }

  headerNavScroll();

  $(window).on(
    'scroll',
    Utils.throttle(() => {
      headerNavScroll();
      if (isBack2topEnable) {
        back2top();
      }
    }, 100)
  );
});
