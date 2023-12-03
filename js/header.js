$(document).ready(function () {
  var $menuBtn = $('.header-nav-menubtn');
  var isMobile = $menuBtn.is(':visible');
  var $mode = $('.mode');
  var dark = false;

  Util.initHeader = () => {
    if (CONFIG.theme.dark_mode.enable) {
      $mode = $('.mode');
      if (getDarkMode()) {
        $('.mode-button-sun').fadeToggle('fast');
        dark = true;
      } else {
        dark = false;
        $('.mode-button-moon').fadeToggle('fast');
      }
      $('.dark-mode').on('click', (e) => {
        e.stopPropagation();
        useTransition(e.clientX, e.clientY, () => {
          dark = !dark;
          localStorage.setItem('dark', dark ? '1' : '0');
          $('html').toggleClass('dark');
          $('.mode-button-moon').toggle();
          $('.mode-button-sun').toggle();
        });
      });
    }
  };

  const useTransition = (x, y, callback) => {
    const isAppearanceTransition = document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isAppearanceTransition) {
      callback();
      return;
    }

    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => {
      callback();
    });
    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
      document.documentElement.animate(
        {
          clipPath: dark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 300,
          easing: 'ease-out',
          pseudoElement: dark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      );
    });
  };
  Util.initHeader();
});
