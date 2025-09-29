(function ($) {
  'use strict';

  // --- 搜索功能 ---
  const $searchWrap = $('.search-form-wrap');
  const $searchBtn = $('.search-btn');
  const $searchInput = $('.local-search-input');
  const searchAnimDuration = 200;
  let isSearchAnim = false;

  const withAnimationLock = (callback) => {
    if (isSearchAnim) return;
    isSearchAnim = true;
    callback();
    setTimeout(() => { isSearchAnim = false; }, searchAnimDuration);
  };

  // 点击搜索按钮显示
  $searchBtn.on('click', () => {
    withAnimationLock(() => {
      $searchWrap.addClass('on');
      setTimeout(() => $searchInput.focus(), 50);
    });
  });

  // 点击外部区域隐藏
  $(document).on('click.searchBlur', function (e) {
    if (!$searchWrap.is(e.target) && $searchWrap.has(e.target).length === 0 && $searchWrap.hasClass('on')) {
      withAnimationLock(() => {
        $searchWrap.removeClass('on');
      });
    }
  });

  // 阻止内部点击冒泡
  // $searchWrap.on('click', function (e) {
  //   e.stopPropagation();
  // });


  // --- 移动端检测 ---
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // --- 搜索初始化 (非移动端) ---
  if ($('.local-search').length && !isMobile) {
    $.getScript('/js/search.js')
      .done(() => {
        if (typeof searchFunc === 'function') {
          searchFunc('/search.xml', 'local-search-input', 'local-search-result');
        } else {
          console.warn('searchFunc 未定义，请检查 search.js 是否正确暴露函数');
        }
      })
      .fail((jqxhr, settings, exception) => {
        console.error('加载 search.js 失败:', exception);
      });
  }

  // --- 图片 Caption 与 Fancybox ---
  $('.article-entry').each(function () {
    const $entry = $(this);

    $entry.find('img').each(function () {
      const $img = $(this);
      const alt = $img.attr('alt');
      const src = $img.attr('src');

      if ($img.parent().is('a') || $img.parent().hasClass('fancybox')) return;

      if (alt) {
        $img.after(`<span class="caption">${$.escape(alt)}</span>`);
      }

      $img.wrap(`<a href="${src}" data-fancybox="gallery" data-caption="${$.escape(alt)}"></a>`);
    });

    $entry.find('.fancybox').attr('data-fancybox', 'gallery');
  });

  if ($.fancybox) {
    $('[data-fancybox]').fancybox({
      animationDuration: 360,
      buttons: ['close']
    });
  }


  // --- 移动端导航 ---
  const $container = $('#container');
  const $mainNavToggle = $('#main-nav-toggle');
  const $wrap = $('#wrap');
  let isMobileNavAnim = false;
  const mobileNavAnimDuration = 200;

  const withNavAnimation = (callback) => {
    if (isMobileNavAnim) return;
    isMobileNavAnim = true;
    callback();
    setTimeout(() => { isMobileNavAnim = false; }, mobileNavAnimDuration);
  };

  $mainNavToggle.on('click', (e) => {
    e.stopPropagation();
    withNavAnimation(() => {
      $container.toggleClass('mobile-nav-on');
    });
  });

  $wrap.on('click', () => {
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;
    withNavAnimation(() => {
      $container.removeClass('mobile-nav-on');
    });
  });

})(jQuery);