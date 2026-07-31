// Keep navigation usable even when an old optional script fails to load.
(function () {
  function closeReportChoice() {
    document.querySelectorAll('.report-choice').forEach(function (item) { item.remove(); });
  }

  var baseShowTab = window.showTab;
  window.showTab = function (id) {
    closeReportChoice();
    return baseShowTab(id);
  };

  var reportButton = document.querySelector('.report-nav');
  if (reportButton) {
    reportButton.onclick = function () {
      closeReportChoice();
      window.showTab('report');
      if (typeof window.getLocation === 'function') window.getLocation();
    };
  }

  document.addEventListener('click', function (event) {
    var tabButton = event.target.closest('[data-tab]');
    if (tabButton && tabButton.dataset.tab !== 'report') closeReportChoice();
  });
})();
