$(document).ready(function() {

  // collpase filter panels
  $('h3.collapse-filter').click(function(e) {
    var $this = $(this);
    var $this_parents = $this.parents('.panel');
    var $collpased_panel = $this_parents.find('.panel-collapse');
    var $panel_cookie = $collpased_panel.attr('id');

    if ($collpased_panel.hasClass('in')) {
      $this_parents.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');

    } else {
      $this_parents.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');

    }

  });
});


