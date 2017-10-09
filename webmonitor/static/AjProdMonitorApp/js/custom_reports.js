var arrCompanies = [];
var arrSites = [];
var arrPlants = [];
var arrMachineGroups = [];
var arrMachines = [];

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

function trigger_company() {

  for (var n = 0; n < arrCompanies.length; n++) {
    var company = 'company-' + arrCompanies[n];
    if ($('#' + company).is(':checked')) {} else {
      $('#' + company).prop('checked', true);
      $('#' + company).trigger('change');
    }
  }
  setTimeout(function() {
    trigger_site();
  }, 300);

};

function trigger_site() {
  for (var n = 0; n < arrSites.length; n++) {
    var site = "site-" + arrSites[n];

    if ($('#' + site).is(':checked')) {} else {
      $('#' + site).prop('checked', true);
      $('#' + site).trigger('change');
    }
  }
  setTimeout(function() {
    trigger_plant();
  }, 300);
};

function trigger_plant() {
  for (var n = 0; n < arrPlants.length; n++) {
    var plant = "plant-" + arrPlants[n];

    if ($('#' + plant).is(':checked')) {} else {
      $('#' + plant).prop('checked', true);
      $('#' + plant).trigger('change');
    }
  }
  setTimeout(function() {
    trigger_machine_group();
  }, 300);

};


function trigger_machine_group() {
  for (var n = 0; n < arrMachineGroups.length; n++) {
    var machine_group = "machine-group-" + arrMachineGroups[n];
    if ($('#' + machine_group).is(':checked')) {} else {
      $('#' + machine_group).prop('checked', true);
      $('#' + machine_group).trigger('change');
    }
  }

  setTimeout(function() {
    trigger_machine();
  }, 300);

};

function trigger_machine() {
  for (var n = 0; n < arrMachines.length; n++) {
    var machine = "machine-" + arrMachines[n];

    if ($('#' + machine).is(':checked')) {} else {
      $('#' + machine).prop('checked', true);
      $('#' + machine).trigger('change');
      console.log('Set the machine... ' + machine);
    }
  }
};


function create_custom_report() {

  var csrftoken = getCookie('csrftoken');
  //console.log(csrftoken);

  var the_machines_aux = [];
  the_machines = $("input[name='machine']:checked");
  the_machines.each(function() {
     the_machines_aux.push(this.className);
   });

  var the_variables_aux = [];
  the_variables = $("option[name=variable]:selected");
  the_variables.each(function() {
     the_variables_aux.push(this.value);
   });

  $.ajax({
    url: "/webmonitor/reports/create-custom-report/",
    type: "POST",
    csrfmiddlewaretoken: csrftoken,
    data: {
      custom_report_parent: $("#custom-report-parent").val(),
      custom_report_name: $("#custom-report-name").val(),
      cbx_machine: the_machines_aux,
      cbx_variables: the_variables_aux,
      dateFrom: $("#startDttm").val(),
      startNumDays: $("#start-num-days").val(),
      dateTo: $("#endDttm").val(),
      endNumDays: $("#end-num-days").val(),
      minFlag: $("#min").prop("checked") ? 'Y' : 'N',
      maxFlag: $("#max").prop("checked") ? 'Y' : 'N',
      avgFlag: $("#avg").prop("checked") ? 'Y' : 'N',
      trendFlag: $("#trend").prop("checked") ? 'Y' : 'N'
    },


    success: function(json) {
      $("#custom-report-name").val('');
      $("#report-alert").html("Custom report was created!").toggleClass("hidden");
      $("#report-alert").fadeTo(2000, 500).slideUp(500, function() {
        $("#report-alert").slideUp(500);
      });
      //console.log(json);
      //console.log("success!");
    },

    error: function(xhr, errmsg, err) {
      $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
        " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
      console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
    },

  });
  // sanity check
  // console.log($('#report-descr').val())
};

function sync_custom_report() {
  trigger_company();

};

function create_custom_report_sync(){
  // custom report save
    event.preventDefault();
    create_custom_report();
}

function sync_user_custom_report(){
  // update report filters

    event.preventDefault();
    $(this).prop('disabled', true);
    report_id = $('#custom-report').val();

    var url = "/webmonitor/filters/custom/report/" + report_id;
    var jqxhr = $.getJSON(url, function() {});
    jqxhr.done(function(data) {
        reportMachines = data.reportMachines;
        variables = data.variables;
        for (var i = 0; i < variables.length; i++) {
            $("div.multiple select").val(variables[i]);
        }
        if (data.fixedDateFrom == 'Y'){
            $('#startDttm').val(data.dateFrom);
        }
        else{
            $today = new Date();
            $calculatedDate = new Date($today);
            $calculatedDate.setDate($today.getDate() - Number(data.numStartDate));
            var day = ("0" + $calculatedDate.getDate()).slice(-2);
            var month = ("0" + ($calculatedDate.getMonth() + 1)).slice(-2);
            var dateAux = $calculatedDate.getFullYear()+"-"+(month)+"-"+(day) ;
            $('#startDttm').val(dateAux);
        }
        if (data.fixedDateTo == 'Y'){
            $('#endDttm').val(data.dateTo);
        }
        else{
            $today = new Date();
            $calculatedDate = new Date($today);
            $calculatedDate.setDate($today.getDate() - Number(data.numEndtDate));
            var day = ("0" + $calculatedDate.getDate()).slice(-2);
            var month = ("0" + ($calculatedDate.getMonth() + 1)).slice(-2);
            var dateAux = $calculatedDate.getFullYear()+"-"+(month)+"-"+(day) ;
            $('#endDttm').val(dateAux);
        }
        if (data.minFlag == 'Y'){
            $('#min').prop('checked', true);
        }
        else{
            $('#min').prop('checked', false);
        }
        if (data.maxFlag == 'Y'){
            $('#max').prop('checked', true);
        }
        else{
            $('#max').prop('checked', false);
        }
        if (data.avgFlag == 'Y'){
            $('#avg').prop('checked', true);
        }
        else{
            $('#avg').prop('checked', false);
        }
        if (data.trendFlag == 'Y'){
            $('#trend').prop('checked', true);
        }
        else{
            $('#trend').prop('checked', false);
        }
        for (var i = 0; i < reportMachines.length; i++) {
            arrCompanies.push(reportMachines[i].company);
            arrSites.push(reportMachines[i].site);
            arrPlants.push(reportMachines[i].plant);
            arrMachineGroups.push(reportMachines[i].machine_group);
            arrMachines.push(reportMachines[i].machine);
        }
        sync_custom_report();
    });

};
