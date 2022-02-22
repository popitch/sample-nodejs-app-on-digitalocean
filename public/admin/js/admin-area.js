// highlight for current path link
$(() => $('a[href="' + $.escapeSelector(location.pathname) + '"]').addClass('admin-area-link_current'));
