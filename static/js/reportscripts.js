var idInterval;
var tableControl = [];
var tableNameControl = [];
var classAttribute;
var chartStatusControl = [];
var chartNameStatusControl = [];
var chartPlantStatusControl = [];

  function formatDurations(minutes){
     var hrs = Math.floor(minutes / 60);
     var minT = ((minutes / 60) - hrs) * 60;
     var min = Math.floor(minT);
     var seg = Math.floor((minT - min) * 60);
     var durFormat = hrs.toString() + ':' + min.toString() + ':' + seg + '.000';
     return durFormat;
  }

  function formatPercentage(per){
     return per.toFixed(2);
  }

  function formatValue(num){
     return num.toFixed(2);
  }

  function graficarDownTimeReasons(start_date, end_date)
  {
     var arrayReq = getParamRequest();

     var labelConsol = [];
     var avDurationConsol = [];
     var durationConsol = [];
     var ocurrencesConsol = [];
     var perConsol = [];
     var ocurrencesTotal = 0, durationTotal = 0;

     $('.main-template').show();
     //initSpinner();
     var $exampleCont = $('.font-awesome-spinner-example');
     var $panel = $exampleCont.find('.panel');

     var startDt = document.getElementsByName("startDttm");
     var endDt = document.getElementsByName("endDttm");

     var fechaInicio = startDt[0].value;
     var fechaFin = endDt[0].value;

     if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
         if (typeof start_date != 'undefined')
        {
            fechaInicio = start_date;
        }
        if (typeof end_date != 'undefined')
        {
            fechaFin = end_date;
        }

        var startTime = document.getElementById("startTime").value;
        var endTime = document.getElementById("endTime").value;
         fechaInicio = fechaInicio + 'T' + startTime;
         fechaFin = fechaFin + 'T' + endTime;
         cleanHTMLTable('tbl-body');
         graficarMaquinaDownTimeReasons(arrayReq, arrayReq.length, 0, fechaInicio, fechaFin, labelConsol, avDurationConsol, durationConsol, ocurrencesConsol, perConsol, ocurrencesTotal, durationTotal)
     }
  }

  function graficarMaquinaDownTimeReasons(arrayMaq, arrayLen, actualPos, startDttm, endDttm, labelConsol, avDurationConsol, durationConsol, ocurrencesConsol, perConsol, ocurrencesTotal, durationTotal)
  {
     var array = [];
     var company, location, plant, machineGroup, machineId, startDt, endDt;
     var fechaInicio, fechaFin;
     var endpoint = '';
     var defaultData = [];
     var labels = [];
     var ocurrences = [];
     var duration = [];
     var existe;
     var $exampleCont = $('.font-awesome-spinner-example');
     var $hideLoadingBtn =$exampleCont.find('.show-loading');
     var $panel = $exampleCont.find('.panel');


        var array = arrayMaq[actualPos].split(".");
        var CompanyId = array[0];
        var LocationId = array[1];
        var PlantId = array[2];
        var MachineGroupId = array[3];
        var MachineId = array[4];
        var endpoint = '/iot/restapi/Request/DownTimeReasonsRequestFOG';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {

            labels = data.labels
              var ocurrences = data.ocurrences
              var duration = data.duration

              for(var j = 0; j<labels.length; j++)
              {
                 var existe = 0;
                 var k = 0;
                 while(existe == 0 && k < ocurrencesConsol.length)
                 {
                    if (labelConsol[k] == labels[j])
                    {
                       ocurrencesConsol[k] = ocurrencesConsol[k] + ocurrences[j];
                       durationConsol[k] = durationConsol[k] + duration[j];
                       ocurrencesTotal = ocurrencesTotal + ocurrences[j];
                       existe = 1;
                    }
                    k++;
                 }
                 if (existe == 0)
                 {
                     labelConsol.push(labels[j]);
                     ocurrencesConsol.push(ocurrences[j]);
                     durationConsol.push(duration[j]);
                     ocurrencesTotal = ocurrencesTotal + ocurrences[j];
                 }
              }

             for (var l = 0; l < labelConsol.length; l++)
             {
                perConsol.push((ocurrencesConsol[l]/ocurrencesTotal)*100);
                avDurationConsol.push(durationConsol[l]/ocurrencesConsol[l]);
             }

            if (actualPos < arrayLen - 1)
            {
                graficarMaquinaDownTimeReasons(arrayMaq, arrayLen, actualPos + 1, startDttm, endDttm, labelConsol, avDurationConsol, durationConsol, ocurrencesConsol, perConsol, ocurrencesTotal, durationTotal)
            }
            else
            {
                drawBarChartDownTimeReasons(labelConsol, ocurrencesConsol);

                var myTableBody = document.getElementById('tbl-body');
                var row, h1, h2, h3, h4, h5, t1, t2, t3, t4, t5;

                for (var h = 0; h < labelConsol.length; h++)
                 {
                    row = document.createElement("tr");
                     h1 = document.createElement("td");
                     h2 = document.createElement("td");
                     h3 = document.createElement("td");
                     h4 = document.createElement("td");
                     h5 = document.createElement("td");
                     t1 = document.createTextNode(labelConsol[h]);
                     t2 = document.createTextNode(ocurrencesConsol[h]);
                     t3 = document.createTextNode(formatDurations(durationConsol[h]));
                     t4 = document.createTextNode(formatDurations(avDurationConsol[h]));
                     t5 = document.createTextNode(formatPercentage(perConsol[h]));

                     h1.appendChild(t1);
                     h2.appendChild(t2);
                     h3.appendChild(t3);
                     h4.appendChild(t4);
                     h5.appendChild(t5);

                     row.appendChild(h1);
                     row.appendChild(h2);
                     row.appendChild(h3);
                     row.appendChild(h4);
                     row.appendChild(h5);

                     myTableBody.appendChild(row);

                             /*$(document).ready(function() {
                             $('#tbl-dtr').DataTable( {
                             dom: 'Bfrtip',
                             buttons: [
                                        'copy', 'csv', 'excel', 'pdf', 'print'
                                        ]
                                    } );
                             } );*/
                 }
                 //$panel.ploading({action: 'hide'});
                 var table = $('#tbl-dtr').DataTable();
                 tableControl.push(table);
                 tableNameControl.push('table-downtime');
              }
           });
  }

  function drawBarChartDownTimeReasons(labels, defaultData) {
        var ctx_bar = document.getElementById('chartjs_bar').getContext('2d');
        var bar_chart = new Chart(ctx_bar, {
              type: 'horizontalBar',
              data: {
                labels: labels,
                datasets: [{
                  label: "My First dataset",
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1,
                  data: defaultData,
                }]
              },
            });
  }

  /*MACHINE STATUS*/
    function graficarMachineStatus(start_date, end_date)
    {
        $('.main-template').show();
        //initSpinner();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayReq = getParamRequest();
        var startDt = document.getElementById("startDttm");
        var endDt = document.getElementById("endDttm");

        var fechaInicio = startDt.value;
        var fechaFin = endDt.value;

        if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
            if (typeof start_date != 'undefined')
            {
                fechaInicio = start_date;
            }
            if (typeof end_date != 'undefined')
            {
                fechaFin = end_date;
            }
            var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
            graficarMaquinaMachineStatus(arrayReq, arrayReq.length, 0 , fechaInicio, fechaFin);
        }

    }

    function processClick(e, elements){
        var value;
        var x_;
        var xNext;
        var y_;
        var chartStatus;
        var label;
        var idChart;
        var datasetIndex;
        var i ;
        var machineName;
        var index = chartNameStatusControl.indexOf(e.target.id);
        console.log('dd');
        /*if (index >= 0){
            machineName = e.target.id.split("-")[0];
            chartStatus = chartStatusControl[index];
            idChart = chartStatus.id;
            idPlanta = chartPlantStatusControl[index];
            var endpoint = '';
            endpoint = '/iot/webmonitor/reports/post-user-temp-data/';
            endpoint = endpoint + '?key='+idPlanta;
            console.log(idPlanta);
            var jqxhr = $.getJSON(endpoint, function() {});
            jqxhr.done(function(data) {
                for (i = 0 ; i < chartStatus.data.datasets.length; i++    ){
                    if (chartStatus.data.datasets[i].label == 'UnScheduleDown'){
                        datasetIndex = i;
                        break;
                    }
                }
                for (i = 0 ; i < chartStatus.data.datasets[0].data.length - 1; i++    )
                {
                    label = chartStatus.data.labels[i];
                    value = chartStatus.data.datasets[0].data[i];
                    x_ = chartStatus.data.datasets[0]._meta[idChart].data[i]._model.x;
                    xNext = chartStatus.data.datasets[0]._meta[idChart].data[i+1]._model.x;
                    y_ = chartStatus.data.datasets[0]._meta[idChart].data[i]._model.y;
                    if (value == 100){
                        if (x_ <= e.offsetX && e.offsetX <= xNext && e.offsetY >= y_){
                            console.log(label + ' - ' +value + '- ' + x_ + '- ' + xNext + '- ' +  y_+ '- ' +e.offsetX+ '- ' +chartNameStatusControl[index]);
                            $("#machine-reason").val(machineName);
                            $("#startDttm-reason").val(label);
                            $("#DowntimeReasonChange").modal()
                            break;
                        }
                    }
                }
            });

        }*/
    }

    function graficarMaquinaMachineStatus(arrayMaq, arrayLen, actualPos, startDttm, endDttm)
    {
            var endpoint = '';
            var dates = [];
            var status = [];
            var myMainDiv = document.getElementById('card-body');
            var $exampleCont = $('.font-awesome-spinner-example');
            var $hideLoadingBtn =$exampleCont.find('.show-loading');
            var $panel = $exampleCont.find('.panel');

            var array = arrayMaq[actualPos].split(".");
            var CompanyId = array[0];
            var LocationId = array[1];
            var PlantId = array[2];
            var MachineGroupId = array[3];
            var MachineId = array[4];

            var endpoint = '';
            endpoint = '/iot/restapi/Request/MachineStatusFOGRequest';
            endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;
            var jqxhr = $.getJSON(endpoint, function() {});

            jqxhr.done(function(data) {
                var dates = data.dates
                var status = data.status
                var config = {
                        type: 'line',
                        data: {labels: [],
                            datasets: []
                        },
                        options: {
                            onClick: processClick,
                            tooltips: {
                                intersect: false
                            },
                            maintainAspectRatio: false,
                            spanGaps: false,
                            elements: {
                                line: {
                                    tension: 0.000001,
                                    stepped: true
                                },
                                point: { radius: 0 }
                            },
                            plugins: {
                                filler: {
                                    propagate: false
                                }
                            },
                            scales: {
                                xAxes: [{
                                    type: "time",
                                    display: false,
                                    scaleLabel: {
                                        display: false,
                                        labelString: 'Date'
                                    }
                                }]
                            },
                            title: {
                                display: true,
                                text: MachineId,
                                position: 'left'
                            }
                        }
                    };
                    if (document.contains(document.getElementById(MachineId+'-div'))) {
                                document.getElementById(MachineId+'-div').remove();
                    }
                    var newDiv = $('<div/>',{
                            id: MachineId+'-status-div'
                        });
                    $('#machine-panel').append(newDiv);
                    var newCanvas = $('<canvas/>',{
                            id: MachineId + '-status-canvas'
                        }).prop({
                            width: 400,
                            height: 100
                        });
                    newCanvas.addClass('m-status');
                    $('#'+MachineId+'-status-div').append(newCanvas);
                    chart = new Chart(MachineId + '-status-canvas', config);
                    chartStatusControl.push(chart);
                    chartNameStatusControl.push(MachineId + '-status-canvas');
                    chartPlantStatusControl.push(CompanyId+'.'+LocationId+'.'+PlantId);
                for (i = 0; i < status.length; i++){
                    values = status[i].slice(1, status[i].length);
                    if (status[i][0] != 'none'){
                        if (status[i][0] == 'UnScheduleDown'){
                            agregarSerieTrend(chart, config, dates, status[i][0], values, 'db4343', 'db4343', 0, true);
                        }else if(status[i][0] == 'Operating'){
                            agregarSerieTrend(chart, config, dates, status[i][0], values, '8adb43', '8adb43', 0, true);
                        }else{
                            agregarSerieTrend(chart, config, dates, status[i][0], values, '4380db', '4380db', 0, true);
                        }
                    }
                }
                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaMachineStatus(arrayMaq, arrayLen, actualPos + 1, startDttm, endDttm);
                }
                else
                {
                    //$panel.ploading({action: 'hide'});
                }
            });
    }

    /*MACHINE JOB OEE SCATTER*/
    function graficarMachineJobOeeScatter(start_date, end_date)
    {
        $('.main-template').show();
        //initSpinner();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayReq = getParamRequest();
        var startDt = document.getElementById("startDttm");
        var endDt = document.getElementById("endDttm");

        var fechaInicio = startDt.value;
        var fechaFin = endDt.value;
        if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
            if (typeof start_date != 'undefined')
            {
                fechaInicio = start_date;
            }
            if (typeof end_date != 'undefined')
            {
                fechaFin = end_date;
            }
            var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
            graficarMaquinaMachineJobOeeScatter(arrayReq, arrayReq.length, 0 , fechaInicio, fechaFin);
        }

    }

    function graficarMaquinaMachineJobOeeScatter(arrayMaq, arrayLen, actualPosScatter, startDttm, endDttm)
    {
            var endpoint = '';
            var dates = [];
            var status = [];
            var myMainDiv = document.getElementById('card-body');
            var $exampleCont = $('.font-awesome-spinner-example');
            var $hideLoadingBtn =$exampleCont.find('.show-loading');
            var $panel = $exampleCont.find('.panel');

            var array = arrayMaq[actualPosScatter].split(".");
            var CompanyId = array[0];
            var LocationId = array[1];
            var PlantId = array[2];
            var MachineGroupId = array[3];
            var MachineId = array[4];

            var endpoint = '';
            endpoint = '/iot/restapi/Request/MachineJobScatterFOGRequest';
            endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;
            var jqxhr = $.getJSON(endpoint, function() {});

            jqxhr.done(function(data) {


                /*Este vector me devuelve un arreglo de 6 vectores que tiene los ids clasificados (el arreglo de la pos 5 tiene los tooltips y el de la 6 las fechas).
                La primera posición tiene los ids con desempeño menor a 40%, el segundo vector tiene los ids con desempeño mayor a 40% y
                menor a 60%, el tercer vector tiene los ids con desempeño mayor a 60% y menor a 80% y el cuarto vector tiene los ids con
                desempeño mayor a 80%.*/
                var dates = data.status[5]
                var status = data.status

                var options = {
                    tooltips: {
                        intersect: false,
                        callbacks: {
                            label: function (tooltipItems, data) {
                                return status[4][tooltipItems.index];
                            }
                        }
                    },
                    maintainAspectRatio: false,
                    spanGaps: false,
                    elements: {
                        line: {
                            tension: 0.000001,
                            stepped: true
                        },
                        point: { radius: 0 }
                    },
                    scales: {
                        xAxes: [{
                                    type: "time",
                                    display: false,
                                    scaleLabel: {
                                        display: false,
                                        labelString: 'Date'
                                    }
                                }],
                        yAxes: [{
                            stacked: false,
                            display: false,
                        }]
                    },
                    title: {
                                display: true,
                                text: MachineId,
                                position: 'left'
                    },
                    plugins: {
                        filler: {
                            propagate: false
                        }
                    }
                };

                var config = {
                        type: 'line',
                        data: {labels: [],
                            datasets: []
                        },
                        options: options
                    };

                var newDiv = $('<div/>',{
                            id: MachineId+'-scatter-div'
                        });
                $('#machine-panel-scatter').append(newDiv);
                var newCanvas = $('<canvas/>',{
                            id: MachineId + '-scatter-canvas'
                        }).prop({
                            width: 400,
                            height: 160
                });
                $('#'+MachineId+'-scatter-div').append(newCanvas);

                chart = new Chart(MachineId + '-scatter-canvas', config);

                var scaleNumUn = 0, scaleNumAb = 40
                for (var i = 0; i < status.length; i++){
                    values = status[i];
                    if (i==0){
                        newValues = scaleSerieTrend(scaleNumUn, scaleNumAb, values);
                        agregarSerieTrend(chart, config, dates, '40%-', newValues, 'db4343', 'ffffff', 1 , true);
                        scaleNumAb = scaleNumAb + 10;
                        agregarSerieTrend(chart, config, dates, '.', createLimitTrend(scaleNumAb, newValues) , 'ffffff', 'ffffff', 0 , '-1');
                        scaleNumUn = scaleNumAb;
                        scaleNumAb = scaleNumAb + 40;
                    }else if (i==1){
                        newValues = scaleSerieTrend(scaleNumUn, scaleNumAb, values);
                        agregarSerieTrend(chart, config, dates, '40% - 60%', newValues, 'ffd700', 'ffffff', 1 , '-1');
                        scaleNumAb = scaleNumAb + 10;
                        agregarSerieTrend(chart, config, dates, '.', createLimitTrend(scaleNumAb, newValues) , 'ffffff', 'ffffff', 0 , '-1');
                        scaleNumUn = scaleNumAb;
                        scaleNumAb = scaleNumAb + 40;
                    }else if (i==2){
                        newValues = scaleSerieTrend(scaleNumUn, scaleNumAb, values);
                        agregarSerieTrend(chart, config, dates, '60% - 80%', newValues, 'aedf24', 'ffffff', 1 , '-1');
                        scaleNumAb = scaleNumAb + 10;
                        agregarSerieTrend(chart, config, dates, '.', createLimitTrend(scaleNumAb, newValues) , 'ffffff', 'ffffff', 0 , '-1');
                        scaleNumUn = scaleNumAb;
                        scaleNumAb = scaleNumAb + 40;
                    }else if (i==3){
                        newValues = scaleSerieTrend(scaleNumUn, scaleNumAb, values);
                        agregarSerieTrend(chart, config, dates, '80%+', newValues, '8adb43', 'ffffff', 1 , '-1');
                        scaleNumAb = scaleNumAb + 10;
                        agregarSerieTrend(chart, config, dates, '.', createLimitTrend(scaleNumAb, newValues) , 'ffffff', 'ffffff', 0 , '-1');
                        scaleNumUn = scaleNumAb;
                        scaleNumAb = scaleNumAb + 40;
                    }
                }

                if (actualPosScatter < arrayLen - 1)
                {
                    graficarMaquinaMachineJobOeeScatter(arrayMaq, arrayLen, actualPosScatter + 1, startDttm, endDttm);
                }
                else
                {
                    //$panel.ploading({action: 'hide'});
                }
            });

    }


        /*MACHINE STATUS CHRONOLOGICAL*/
    function graficarMachineStatusChronological(start_date, end_date)
    {
        $('.main-template').show();
        //initSpinner();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayReq = getParamRequest();
        var startDt = document.getElementById("startDttm");
        var endDt = document.getElementById("endDttm");

        var fechaInicio = startDt.value;
        var fechaFin = endDt.value;
        if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
            if (typeof start_date != 'undefined')
            {
                fechaInicio = start_date;
            }
            if (typeof end_date != 'undefined')
            {
                fechaFin = end_date;
            }
            var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
            graficarMaquinaMachineStatusChronological(arrayReq, arrayReq.length, 0 , fechaInicio, fechaFin);
        }

    }

    function graficarMaquinaMachineStatusChronological(arrayMaq, arrayLen, actualPosChro, startDttm, endDttm)
    {

            var endpoint = '';
            var dates = [];
            var status = [];
            var myMainDiv = document.getElementById('card-body');
            var $exampleCont = $('.font-awesome-spinner-example');
            var $hideLoadingBtn =$exampleCont.find('.show-loading');
            var $panel = $exampleCont.find('.panel');

            var array = arrayMaq[actualPosChro].split(".");
            var CompanyId = array[0];
            var LocationId = array[1];
            var PlantId = array[2];
            var MachineGroupId = array[3];
            var MachineId = array[4];

            var endpoint = '';
            endpoint = '/iot/restapi/Request/MachineStatusFOGRequest';
            endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;
            var jqxhr = $.getJSON(endpoint, function() {});

            jqxhr.done(function(data) {
                var dates = data.dates
                var status = data.status

                var options = {
                    tooltips: {
                                intersect: false
                    },
                    maintainAspectRatio: false,
                    spanGaps: false,
                    elements: {
                        line: {
                            tension: 0.000001,
                            stepped: true
                        },
                        point: { radius: 0 }
                    },
                    scales: {
                        xAxes: [{
                                    type: "time",
                                    display: false,
                                    scaleLabel: {
                                        display: false,
                                        labelString: 'Date'
                                    }
                                }],
                        yAxes: [{
                            stacked: false,
                            display: false,
                        }]
                    },
                    title: {
                                display: true,
                                text: MachineId,
                                position: 'left'
                    },
                    plugins: {
                        filler: {
                            propagate: false
                        }
                    }
                };

                var config = {
                        type: 'line',
                        data: {labels: [],
                            datasets: []
                        },
                        options: options
                    };

                var newDiv = $('<div/>',{
                            id: MachineId+'-chro-div'
                        });
                $('#machine-panel-chro').append(newDiv);
                var newCanvas = $('<canvas/>',{
                            id: MachineId + '-chro-canvas'
                        }).prop({
                            width: 400,
                            height: 160
                });
                $('#'+MachineId+'-chro-div').append(newCanvas);

                chart = new Chart(MachineId + '-chro-canvas', config);

                var scaleNumUn = 0, scaleNumAb = 40
                var fillOpt = true;
                var first = true;
                for (var i = 0; i < status.length; i++){
                    values = status[i].slice(1, status[i].length);
                    if (status[i][0] != 'none'){
                        if (first == true){
                            first = false;
                            fillOpt = true;
                        }else{
                            fillOpt = '-1';
                        }
                        if (status[i][0] == 'UnScheduleDown'){
                            newValues = scaleSerieTrend(scaleNumUn, scaleNumAb, values);
                            agregarSerieTrend(chart, config, dates, status[i][0], newValues, 'db4343', 'db4343', 0, fillOpt);
                            scaleNumAb = scaleNumAb + 10;
                            agregarSerieTrend(chart, config, dates, '.', createLimitTrend(scaleNumAb, newValues) , 'ffffff', 'ffffff', 0, '-1');
                            scaleNumUn = scaleNumAb;
                            scaleNumAb = scaleNumAb + 40;
                        }else if(status[i][0] == 'Operating'){
                            newValues = scaleSerieTrend(scaleNumUn, scaleNumAb, values);
                            agregarSerieTrend(chart, config, dates, status[i][0], newValues, '8adb43', '8adb43', 0, fillOpt);
                            scaleNumAb = scaleNumAb + 10;
                            agregarSerieTrend(chart, config, dates, '.', createLimitTrend(scaleNumAb, newValues) , 'ffffff', 'ffffff', 0, '-1');
                            scaleNumUn = scaleNumAb;
                            scaleNumAb = scaleNumAb + 40;
                        }else{
                            newValues = scaleSerieTrend(scaleNumUn, scaleNumAb, values);
                            agregarSerieTrend(chart, config, dates, status[i][0], newValues, '4380db', '4380db', 0, fillOpt);
                            scaleNumAb = scaleNumAb + 10;
                            agregarSerieTrend(chart, config, dates, '.', createLimitTrend(scaleNumAb, newValues) , 'ffffff', 'ffffff', 0, '-1');
                            scaleNumUn = scaleNumAb;
                            scaleNumAb = scaleNumAb + 40;
                        }
                    }
                }

                if (actualPosChro < arrayLen - 1)
                {
                    graficarMaquinaMachineStatusChronological(arrayMaq, arrayLen, actualPosChro + 1, startDttm, endDttm);
                }
                else
                {
                    //$panel.ploading({action: 'hide'});
                }
            });

    }

    function scaleSerieTrend(limitUnder, limitAbove, values){
        var newValues = [];
        for (var i=0; i < values.length; i++){
            if (values[i] == 0){
                newValues.push(limitUnder);
            }else{
                newValues.push(limitAbove);
            }
        }
        return newValues;
    }


    function createLimitTrend(limitValue, values){
        var limit = [];
        for (var i=0; i < values.length; i++){
            limit.push(limitValue);
        }
        return limit;
    }


   function graficarMaquinaProductionRollup(arrayMaq, arrayLen, actualPos, startDttm, endDttm, plantConsol, avalConsol, perConsol, oeeConsol, machineCounter)
  {
        var myTableBody = document.getElementById('tbl-prdn-machine');
        var myTableConsol = document.getElementById('tbl-prdn-area');
        var array = [];
        var company, location, plant, machineGroup, machineId, startDt, endDt;
        var endpoint = '';
        var avgValue = 0, avgValueAval = 0, avgValuePer = 0, avgValueOEE = 0;
        var rowp, h1p, h2p, h3p, h4p, h5p, t1p, t2p, t3p, t4p, t5p;
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var dates = [];
        var valuesPer = [];
        var valuesAval = [];
        var valuesOee = [];

        var array = arrayMaq[actualPos].split(".");
        var CompanyId = array[0];
        var LocationId = array[1];
        var PlantId = array[2];
        var MachineGroupId = array[3];
        var MachineId = array[4];

        var row, h1, h2, h3, h4, h5, t1, t2, t3, t4, t5;
        var endpoint = '/iot/restapi/Request/ProductionMachineRollupRequestFOG';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {
                var dates = data.dates
                var valuesPer = data.valuePer
                var valuesAval = data.valueAva
                var valuesOee = data.valueOee
                row = document.createElement("tr");

                h1 = document.createElement("td");
                h2 = document.createElement("td");
                h3 = document.createElement("td");
                h4 = document.createElement("td");
                h5 = document.createElement("td");

                t1 = document.createTextNode(PlantId);
                t2 = document.createTextNode(MachineId);

                h1.appendChild(t1);
                h2.appendChild(t2);

                row.appendChild(h1);
                row.appendChild(h2);

                var avgValue = 0;
                for(var j = 0; j < dates.length; j++)
                {
                    avgValue = avgValue + valuesAval[j];
                }
                if (valuesAval.length > 0)
                {
                    avgValueAval = avgValue / valuesAval.length;
                }

                t3 = document.createTextNode(formatPercentage(avgValueAval));
                avgValue = 0;
                for(var j = 0; j < dates.length; j++)
                {
                    avgValue = avgValue + valuesPer[j];
                }
                if (valuesPer.length > 0)
                {
                    avgValuePer = avgValue / valuesPer.length;
                }
                t4 = document.createTextNode(formatPercentage(avgValuePer));
                avgValue = 0;
                for(var j = 0; j < dates.length; j++)
                {
                    avgValue = avgValue + valuesOee[j];
                }
                if (valuesOee.length > 0)
                {
                    avgValueOEE = avgValue / valuesOee.length;
                }
                t5 = document.createTextNode(formatPercentage(avgValueOEE));
                h3.appendChild(t3);
                h4.appendChild(t4);
                h5.appendChild(t5);
                row.appendChild(h3);
                row.appendChild(h4);
                row.appendChild(h5);
                myTableBody.appendChild(row);

                index = plantConsol.indexOf(PlantId);
                if (index == -1)
                {
                   plantConsol.push(PlantId);
                   machineCounter.push(1);
                   avalConsol.push(avgValueAval);
                   perConsol.push(avgValuePer);
                   oeeConsol.push(avgValueOEE);
                }else{
                   machineCounter[index] = machineCounter[index] + 1;
                   avalConsol[index] = avalConsol[index] + avgValueAval;
                   perConsol[index] = perConsol[index] + avgValuePer;
                   oeeConsol[index] = oeeConsol[index] + avgValueOEE;
                }

                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaProductionRollup(arrayMaq, arrayLen, actualPos+1, startDttm, endDttm, plantConsol, avalConsol, perConsol, oeeConsol, machineCounter);
                }
                else
                {
                    for (var h = 0; h < plantConsol.length; h++)
                     {
                         rowp = document.createElement("tr");
                         h1p = document.createElement("td");
                         h2p = document.createElement("td");
                         h3p = document.createElement("td");
                         h4p = document.createElement("td");
                         h5p = document.createElement("td");
                         t1p = document.createTextNode(plantConsol[h]);
                         t2p = document.createTextNode(machineCounter[h]);
                         t3p = document.createTextNode(formatPercentage(avalConsol[h] / machineCounter[h]));
                         t4p = document.createTextNode(formatPercentage(perConsol[h] / machineCounter[h]));
                         t5p = document.createTextNode(formatPercentage(oeeConsol[h] / machineCounter[h]));
                         h1p.appendChild(t1p);
                         h2p.appendChild(t2p);
                         h3p.appendChild(t3p);
                         h4p.appendChild(t4p);
                         h5p.appendChild(t5p);
                         rowp.appendChild(h1p);
                         rowp.appendChild(h2p);
                         rowp.appendChild(h3p);
                         rowp.appendChild(h4p);
                         rowp.appendChild(h5p);
                         myTableConsol.appendChild(rowp);
                     }
                     var table1 = $('#area-table').DataTable();
                     tableControl.push(table1);
                     tableNameControl.push('table-prdn-area');
                     var table2 = $('#machine-table').DataTable();
                     tableControl.push(table2);
                     tableNameControl.push('table-prdn-mach');
                }

        });
    }

    function graficarProductionRollup(start_date, end_date)
    {
         var arrayReq = getParamRequest();

         var fechaInicio, fechaFin;
         var plantConsol = [];
         var machineCounter = [];
         var avalConsol = [];
         var perConsol = [];
         var oeeConsol = [];
         var index;
         $('.main-template').show();
         //initSpinner();
         var $exampleCont = $('.font-awesome-spinner-example');
         var $panel = $exampleCont.find('.panel');
         var startDt = document.getElementsByName("startDttm");
         var endDt = document.getElementsByName("endDttm");

         var fechaInicio = startDt[0].value;
         var fechaFin = endDt[0].value;
         if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
             if (typeof start_date != 'undefined')
            {
                fechaInicio = start_date;
            }
            if (typeof end_date != 'undefined')
            {
                fechaFin = end_date;
            }
            var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
             cleanHTMLTable('tbl-prdn-machine');
             cleanHTMLTable('tbl-prdn-area');
             graficarMaquinaProductionRollup(arrayReq, arrayReq.length, 0, fechaInicio, fechaFin, plantConsol, avalConsol, perConsol, oeeConsol, machineCounter);
         }
    }

       function graficarMaquinaStatusRollup(arrayMaq, arrayLen, actualPos, startDttm, endDttm, durationsTot, labelsConsol, durationsConsol, percentageConsol)
   {
         var CompanyId, LocationId, PlantId, MachineGroupId, MachineId, startDt, endDt, color;
         var labels = [];
         var durations = [];
         var colores = [];
         var existe, k;
         var myTableBody = document.getElementById('tbl-body-machineStatus');
         var row, h1, h2, h3, t1, t2, t3;
         var count = 0;
         var endpoint = '';
         var $exampleCont = $('.font-awesome-spinner-example');
         var $panel = $exampleCont.find('.panel');

        var array = arrayMaq[actualPos].split(".");
        var CompanyId = array[0];
        var LocationId = array[1];
        var PlantId = array[2];
        var MachineGroupId = array[3];
        var MachineId = array[4];
        var endpoint = '/iot/restapi/Request/StatusRollup';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {

              var labels = data.labels
              var durations = data.durations

              for(var j = 0; j<labels.length; j++)
              {
                 var existe = 0;
                 var k = 0;

                 while(existe == 0 && k < durationsConsol.length)
                 {
                    if (labelsConsol[k] == labels[j])
                    {
                       durationsConsol[k] = durationsConsol[k] + durations[j];
                       durationsTot = durationsTot + durations[j];
                       existe = 1;
                    }
                    k++;
                 }
                 if (existe == 0)
                 {
                     labelsConsol.push(labels[j]);
                     durationsConsol.push(durations[j]);
                     durationsTot = durationsTot + durations[j];
                 }
              }

              if (actualPos < arrayLen - 1)
              {
                  graficarMaquinaStatusRollup(arrayMaq, arrayLen, actualPos+1, startDttm, endDttm, durationsTot, labelsConsol, durationsConsol, percentageConsol);
              }
              else
              {
                    for (var l = 0; l < labelsConsol.length; l++)
                    {
                        percentageConsol.push((durationsConsol[l]*100)/durationsTot);
                        color =  colorAleatorio();
                        color = '#'+color;
                        colores.push(color);
                    }

                    drawBarChartStatusRollup(labelsConsol, durationsConsol, colores);

                    for (var h = 0; h < labelsConsol.length; h++)
                    {
                         row = document.createElement("tr");
                         h1 = document.createElement("td");
                         h2 = document.createElement("td");
                         h3 = document.createElement("td");
                         t1 = document.createTextNode(h.toString()+'.'+labelsConsol[h]);
                         t2 = document.createTextNode(formatDurations(durationsConsol[h]));
                         t3 = document.createTextNode(formatPercentage(percentageConsol[h]));

                         h1.appendChild(t1);
                         h2.appendChild(t2);
                         h3.appendChild(t3);

                         row.appendChild(h1);
                         row.appendChild(h2);
                         row.appendChild(h3);

                         myTableBody.appendChild(row);
                    }


                     row = document.createElement("tr");
                     h1 = document.createElement("td");
                     h2 = document.createElement("td");
                     h3 = document.createElement("td");
                     t1 = document.createTextNode('Total');
                     t2 = document.createTextNode(formatDurations(durationsTot));
                     t3 = document.createTextNode(formatPercentage(100));

                     h1.appendChild(t1);
                     h2.appendChild(t2);
                     h3.appendChild(t3);

                     row.appendChild(h1);
                     row.appendChild(h2);
                     row.appendChild(h3);

                     myTableBody.appendChild(row);

                     var table = $('#tbl-machineStatus').DataTable({
                        "bFilter": false,
                        "bPaginate": false,
                        "bInfo": false
                     });
                     tableControl.push(table);
                     tableNameControl.push('table-status-rollup');
              }

        });
   }


  function graficarStatusRollup(start_date, end_date)
  {
     var arrayReq = getParamRequest();
     var fechaInicio, fechaFin;

     var durationsTot = 0;
     var labelsConsol = [];
     var durationsConsol = [];
     var percentageConsol = [];
     var $exampleCont = $('.font-awesome-spinner-example');
     var $panel = $exampleCont.find('.panel');
     $('.main-template').show();

     var startDt = document.getElementsByName("startDttm");
     var endDt = document.getElementsByName("endDttm");

     var fechaInicio = startDt[0].value;
     var fechaFin = endDt[0].value;

     if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
        if (typeof start_date != 'undefined')
        {
            fechaInicio = start_date;
        }
        if (typeof end_date != 'undefined')
        {
            fechaFin = end_date;
        }
        var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
         cleanHTMLTable('tbl-body-machineStatus');
         graficarMaquinaStatusRollup(arrayReq, arrayReq.length, 0, fechaInicio, fechaFin, durationsTot, labelsConsol, durationsConsol, percentageConsol);
     }
  }

  function drawBarChartStatusRollup(labelsConsol, durationsConsol, colores) {
     var data6 = {
        labels: labelsConsol,
        datasets: [{
            data: durationsConsol,
            backgroundColor: colores,
            hoverBackgroundColor: colores
        }]
     };
     var ctx6 = document.getElementById('myChart6').getContext('2d');
     var myChart6 = new Chart(ctx6, {
        type: 'pie',
        data: data6
     });
  }

      function graficarMachineVariableStatus()
    {
        $('.main-template').show();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayReq = getParamRequest();

        if ( arrayReq.length > 0 ) {
            cleanHTMLTable('tbl-variables');
            graficarMaquinaMachineVariableStatus(arrayReq, arrayReq.length, 0 );
        }

    }

    function graficarKPIDaily(start_date, end_date)
    {
        $('.main-template').show();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayReq = getParamRequest();
        var fechaInicio, fechaFin;

            if (typeof start_date != 'undefined')
            {
                fechaInicio = start_date;
            }
            if (typeof end_date != 'undefined')
            {
                fechaFin = end_date;
            }

        var startDt = document.getElementsByName("startDttm");
        var endDt = document.getElementsByName("endDttm");

        var fechaInicio = startDt[0].value;
        var fechaFin = endDt[0].value;

        var f = fechaInicio.split("-");
        var year = f[0];
        var month = f[1];
        var day = f[2];
        f = new Date(year, month, day);
        fechaInicio = f.getFullYear() + "-" + ("0"+f.getMonth()).slice(-2) + "-" + ("0"+(f.getDate()-1)).slice(-2);

        if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
            var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
            cleanHTMLTable('tbl-kpi-daily');
            graficarMaquinaKPIDaily(arrayReq, arrayReq.length, 0 , fechaInicio, fechaFin);
        }
    }

    function graficarMaquinaKPIDaily(arrayMaq, arrayLen, actualPos, fechaInicio, fechaFin)
  {
        var myTableBody = document.getElementById('tbl-kpi-daily');
        var array = [];
        var company, location, plant, machineGroup, machineId;
        var endpoint = '';
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');

        var array = arrayMaq[actualPos].split(".");
        var CompanyId = array[0];
        var LocationId = array[1];
        var PlantId = array[2];
        var MachineGroupId = array[3];
        var MachineId = array[4];

        var per = [];
        var ava = [];
        var oee = [];
        var machine;
        var row, h1, h2, h3, h4, h5, h6, h7, h8, t1, t2, t3, t4, t5, t6, t7, t8;
        var endpoint = '/iot/restapi/Request/MachineKPIFOGRequest';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&reqInterval='+'D'+'&startDttm='+fechaInicio+'&endDttm='+fechaFin;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {
                var fInit = data.startDttm
                var per = data.valuePer
                var ava = data.valueAva
                var oee = data.valueOee
                var machine = data.machineId

                var f = fInit.split("-");
                var year = f[0];
                var month = f[1];
                var day = f[2];
                var i = 1;

                for(var j = 1; j < per.length; j++)
                {
                    f = new Date(year, month, day);
                    //f.setDate(f.getDate()+i);
                    row = document.createElement("tr");
                    h1 = document.createElement("td");
                    h2 = document.createElement("td");
                    h3 = document.createElement("td");
                    h4 = document.createElement("td");
                    h5 = document.createElement("td");
                    h6 = document.createElement("td");
                    h7 = document.createElement("td");
                    h8 = document.createElement("td");
                    t1 = document.createTextNode(machine);
                    t2 = document.createTextNode(f.getFullYear() + "-" + ("0"+f.getMonth()).slice(-2) + "-" + ("0"+(f.getDate()+i)).slice(-2));
                    t3 = document.createTextNode(formatPercentage(ava[j-1]));
                    t4 = document.createTextNode(formatPercentage(ava[j]));
                    t5 = document.createTextNode(formatPercentage(per[j-1]));
                    t6 = document.createTextNode(formatPercentage(per[j]));
                    t7 = document.createTextNode(formatPercentage(oee[j-1]));
                    t8 = document.createTextNode(formatPercentage(oee[j]));
                    h1.appendChild(t1);
                    h2.appendChild(t2);
                    h3.appendChild(t3);
                    h4.appendChild(t4);
                    h5.appendChild(t5);
                    h6.appendChild(t6);
                    h7.appendChild(t7);
                    h8.appendChild(t8);
                    row.appendChild(h1);
                    row.appendChild(h2);
                    row.appendChild(h3);
                    row.appendChild(h4);
                    row.appendChild(h5);
                    row.appendChild(h6);
                    row.appendChild(h7);
                    row.appendChild(h8);
                    myTableBody.appendChild(row);
                    i++;
                }

                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaKPIDaily(arrayMaq, arrayLen, actualPos+1, fechaInicio, fechaFin)
                }else{
                    var table = $('#tbl-kpi-daily-h').DataTable();
                    tableControl.push(table);
                    tableNameControl.push('table-kpis-da');
                }
        });

    }

    function graficarKPIMonthly(start_date, end_date)
    {
        $('.main-template').show();
        //initSpinner();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayReq = getParamRequest();
        var fechaInicio, fechaFin;

            if (typeof start_date != 'undefined')
            {
                fechaInicio = start_date;
            }
            if (typeof end_date != 'undefined')
            {
                fechaFin = end_date;
            }

        var startDt = document.getElementsByName("startDttm");
        var endDt = document.getElementsByName("endDttm");
        fechaInicio = startDt[0].value;
        fechaFin = endDt[0].value;

        var f = fechaInicio.split("-");
        var year = f[0];
        var month = f[1];
        var day = f[2];
        f = new Date(year, month, day);
        fechaInicio = f.getFullYear() + "-" + ("0"+(f.getMonth()-1)).slice(-2) + "-" + ("0"+f.getDate()).slice(-2);
        if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
            var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
            cleanHTMLTable('tbl-kpi-monthly');
            graficarMaquinaKPIMonthly(arrayReq, arrayReq.length, 0 , fechaInicio, fechaFin);
        }
    }


     function graficarMaquinaKPIMonthly(arrayMaq, arrayLen, actualPos, fechaInicio, fechaFin)
  {
        var myTableBody = document.getElementById('tbl-kpi-monthly');
        var array = [];
        var company, location, plant, machineGroup, machineId;
        var endpoint = '';
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');

        var array = arrayMaq[actualPos].split(".");
        var CompanyId = array[0];
        var LocationId = array[1];
        var PlantId = array[2];
        var MachineGroupId = array[3];
        var MachineId = array[4];

        var per = [];
        var ava = [];
        var oee = [];
        var machine;
        var row, h1, h2, h3, h4, h5, h6, h7, h8, t1, t2, t3, t4, t5, t6, t7, t8;
        var endpoint = '/iot/restapi/Request/MachineKPIFOGRequest';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&reqInterval='+'M'+'&startDttm='+fechaInicio+'&endDttm='+fechaFin;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {
                var fInit = data.startDttm
                var per = data.valuePer
                var ava = data.valueAva
                var oee = data.valueOee
                var machine = data.machineId

                var f = fInit.split("-");
                var year = f[0];
                var month = f[1];
                var day = f[2];
                var i = 1;

                for(var j = 1; j < per.length; j++)
                {
                    f = new Date(year, month, day);
                    row = document.createElement("tr");
                    h1 = document.createElement("td");
                    h2 = document.createElement("td");
                    h3 = document.createElement("td");
                    h4 = document.createElement("td");
                    h5 = document.createElement("td");
                    h6 = document.createElement("td");
                    h7 = document.createElement("td");
                    h8 = document.createElement("td");
                    t1 = document.createTextNode(machine);
                    t2 = document.createTextNode(f.getFullYear() + "-" + ("0"+(f.getMonth()+i)).slice(-2));
                    t3 = document.createTextNode(formatPercentage(ava[j-1]));
                    t4 = document.createTextNode(formatPercentage(ava[j]));
                    t5 = document.createTextNode(formatPercentage(per[j-1]));
                    t6 = document.createTextNode(formatPercentage(per[j]));
                    t7 = document.createTextNode(formatPercentage(oee[j-1]));
                    t8 = document.createTextNode(formatPercentage(oee[j]));
                    h1.appendChild(t1);
                    h2.appendChild(t2);
                    h3.appendChild(t3);
                    h4.appendChild(t4);
                    h5.appendChild(t5);
                    h6.appendChild(t6);
                    h7.appendChild(t7);
                    h8.appendChild(t8);
                    row.appendChild(h1);
                    row.appendChild(h2);
                    row.appendChild(h3);
                    row.appendChild(h4);
                    row.appendChild(h5);
                    row.appendChild(h6);
                    row.appendChild(h7);
                    row.appendChild(h8);
                    myTableBody.appendChild(row);
                    i++;
                }

                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaKPIMonthly(arrayMaq, arrayLen, actualPos+1, fechaInicio, fechaFin)
                }else{
                    var table = $('#tbl-kpi-monthly-h').DataTable();
                    tableControl.push(table);
                    tableNameControl.push('table-kpis-mo');
                }
        });
    }


    function graficarKPIWeekly(start_date, end_date)
    {
        $('.main-template').show();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayReq = getParamRequest();
        var fechaInicio, fechaFin;

        if (typeof start_date != 'undefined')
            {
                fechaInicio = start_date;
            }
            if (typeof end_date != 'undefined')
            {
                fechaFin = end_date;
            }

        var startDt = document.getElementsByName("startDttm");
        var endDt = document.getElementsByName("endDttm");
        fechaInicio = startDt[0].value;
        fechaFin = endDt[0].value;

        var f = fechaInicio.split("-");
        var year = f[0];
        var month = f[1];
        var day = f[2];
        f = new Date(year, month, day);
        fechaInicio = f.getFullYear() + "-" + ("0"+f.getMonth()).slice(-2) + "-" + ("0"+(f.getDate()-7)).slice(-2);

        if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
            var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
            cleanHTMLTable('tbl-kpi-weekly');
            graficarMaquinaKPIWeekly(arrayReq, arrayReq.length, 0 , fechaInicio, fechaFin);
        }
    }


    function graficarMaquinaKPIWeekly(arrayMaq, arrayLen, actualPos, fechaInicio, fechaFin)
  {
        var myTableBody = document.getElementById('tbl-kpi-weekly');
        var array = [];
        var company, location, plant, machineGroup, machineId;
        var endpoint = '';
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');

        var array = arrayMaq[actualPos].split(".");
        var CompanyId = array[0];
        var LocationId = array[1];
        var PlantId = array[2];
        var MachineGroupId = array[3];
        var MachineId = array[4];

        var per = [];
        var ava = [];
        var oee = [];
        var machine;
        var row, h1, h2, h3, h4, h5, h6, h7, h8, t1, t2, t3, t4, t5, t6, t7, t8;
        endpoint = '/iot/restapi/Request/MachineKPIFOGRequest';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&reqInterval='+'W'+'&startDttm='+fechaInicio+'&endDttm='+fechaFin;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {
                fInit = data.startDttm
                per = data.valuePer
                ava = data.valueAva
                oee = data.valueOee
                machine = data.machineId

                var f = fInit.split("-");
                var year = f[0];
                var month = f[1];
                var day = f[2];
                var i = 1;
                var numWeek;

                for(var j = 1; j < per.length; j++)
                {
                    f = new Date(year, month, day);
                    f.setDate(f.getDate()+i);
                    numWeek = moment(f).week();
                    row = document.createElement("tr");
                    h1 = document.createElement("td");
                    h2 = document.createElement("td");
                    h3 = document.createElement("td");
                    h4 = document.createElement("td");
                    h5 = document.createElement("td");
                    h6 = document.createElement("td");
                    h7 = document.createElement("td");
                    h8 = document.createElement("td");
                    t1 = document.createTextNode(machine);
                    t2 = document.createTextNode(f.getFullYear() + "-" + numWeek);
                    t3 = document.createTextNode(formatPercentage(ava[j-1]));
                    t4 = document.createTextNode(formatPercentage(ava[j]));
                    t5 = document.createTextNode(formatPercentage(per[j-1]));
                    t6 = document.createTextNode(formatPercentage(per[j]));
                    t7 = document.createTextNode(formatPercentage(oee[j-1]));
                    t8 = document.createTextNode(formatPercentage(oee[j]));
                    h1.appendChild(t1);
                    h2.appendChild(t2);
                    h3.appendChild(t3);
                    h4.appendChild(t4);
                    h5.appendChild(t5);
                    h6.appendChild(t6);
                    h7.appendChild(t7);
                    h8.appendChild(t8);
                    row.appendChild(h1);
                    row.appendChild(h2);
                    row.appendChild(h3);
                    row.appendChild(h4);
                    row.appendChild(h5);
                    row.appendChild(h6);
                    row.appendChild(h7);
                    row.appendChild(h8);
                    myTableBody.appendChild(row);
                    i = i + 7;
                }

                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaKPIWeekly(arrayMaq, arrayLen, actualPos+1, fechaInicio, fechaFin)
                }else{
                    var table = $('#tbl-kpi-weekly-h').DataTable();
                    tableControl.push(table);
                    tableNameControl.push('table-kpis-we');
                }
        });
    }


    function graficarJobSummary(start_date, end_date)
    {
        $('.main-template').show();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayReq = getParamRequest();
        var fechaInicio, fechaFin;
        var startDt, endDt;

        startDt = document.getElementsByName("startDttm");
        endDt = document.getElementsByName("endDttm");
        fechaInicio = startDt[0].value;
        fechaFin = endDt[0].value;

        if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
            if (typeof start_date != 'undefined')
            {
                fechaInicio = start_date;
            }
            if (typeof end_date != 'undefined')
            {
                fechaFin = end_date;
            }
            var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
            cleanHTMLTable('tbl-job-summary');
            graficarMachineJobSummary(arrayReq, arrayReq.length, 0 , fechaInicio, fechaFin);
        }
    }


    function graficarMachineJobSummary(arrayMaq, arrayLen, actualPos, fechaInicio, fechaFin)
  {
        var myTableBody = document.getElementById('tbl-job-summary');
        var array = [];
        var company, location, plant, machineGroup, machineId;
        var endpoint = '';
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');

        array = arrayMaq[actualPos].split(".");
        CompanyId = array[0];
        LocationId = array[1];
        PlantId = array[2];
        MachineGroupId = array[3];
        MachineId = array[4];

        var Job = [];
        var Description = [];
        var Article = [];
        var Start = [];
        var End = [];
        var Duration = [];
        var Availability = [];
        var Performance = [];
        var OEE = [];
        var Expected = [];
        var Actual = [];
        var machine;
        var row, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11;
        endpoint = '/iot/restapi/Request/JobSummaryFOGRequest';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+fechaInicio+'&endDttm='+fechaFin;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {
                Job = data.prodId
                Description = data.prodDescr
                Article = data.itemId
                Start = data.fechaInit
                End = data.fechaFin
                Duration = data.durations
                Availability = data.availabilities
                Performance = data.performance
                OEE = data.oee
                Expected = data.expected
                Actual = data.actual
                machine = data.machineId

                for(var j = 1; j < Job.length; j++)
                {
                    row = document.createElement("tr");
                    h1 = document.createElement("td");
                    h2 = document.createElement("td");
                    h3 = document.createElement("td");
                    h4 = document.createElement("td");
                    h5 = document.createElement("td");
                    h6 = document.createElement("td");
                    h7 = document.createElement("td");
                    h8 = document.createElement("td");
                    h9 = document.createElement("td");
                    h10 = document.createElement("td");
                    h11 = document.createElement("td");
                    h12 = document.createElement("td");
                    t1 = document.createTextNode(machine);
                    t2 = document.createTextNode(Job[j]);
                    t3 = document.createTextNode(Description[j]);
                    t4 = document.createTextNode(Article[j]);
                    t5 = document.createTextNode(Start[j]);
                    t6 = document.createTextNode(End[j]);
                    t7 = document.createTextNode(formatDurations(Duration[j]));
                    t8 = document.createTextNode(formatPercentage(Availability[j]));
                    t9 = document.createTextNode(formatPercentage(Performance[j]));
                    t10 = document.createTextNode(formatPercentage(OEE[j]));
                    t11 = document.createTextNode(formatValue(Expected[j]));
                    t12 = document.createTextNode(formatValue(Actual[j]));
                    h1.appendChild(t1);
                    h2.appendChild(t2);
                    h3.appendChild(t3);
                    h4.appendChild(t4);
                    h5.appendChild(t5);
                    h6.appendChild(t6);
                    h7.appendChild(t7);
                    h8.appendChild(t8);
                    h9.appendChild(t9);
                    h10.appendChild(t10);
                    h11.appendChild(t11);
                    h12.appendChild(t12);
                    row.appendChild(h1);
                    row.appendChild(h2);
                    row.appendChild(h3);
                    row.appendChild(h4);
                    row.appendChild(h5);
                    row.appendChild(h6);
                    row.appendChild(h7);
                    row.appendChild(h8);
                    row.appendChild(h9);
                    row.appendChild(h10);
                    row.appendChild(h11);
                    row.appendChild(h12);
                    myTableBody.appendChild(row);
                }

                if (actualPos < arrayLen - 1)
                {
                    graficarMachineJobSummary(arrayMaq, arrayLen, actualPos+1, fechaInicio, fechaFin)
                }else{
                    var table = $('#tbl-job-summary-h').DataTable();
                    tableControl.push(table);
                    tableNameControl.push('table-job-sum');
                }
        });
    }


function graficarProductionSummary(start_date, end_date)
  {
     $('.main-template').show();
     var $exampleCont = $('.font-awesome-spinner-example');
     var $panel = $exampleCont.find('.panel');
     var arrayReq = getParamRequest();
     var startDt = document.getElementsByName("startDttm");
     var endDt = document.getElementsByName("endDttm");

     var fechaInicio = startDt[0].value;
     var fechaFin = endDt[0].value;
     if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 ) {
        if (typeof start_date != 'undefined')
        {
            fechaInicio = start_date;
        }
        if (typeof end_date != 'undefined')
        {
            fechaFin = end_date;
        }
        var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;
         graficarShiftProductionSummary(arrayReq, arrayReq.length, 0, fechaInicio, fechaFin);
     }
  }


    function graficarShiftProductionSummary(arrayMaq, arrayLen, actualPos, startDttm, endDttm)
  {
         var endpoint = '';
         var labels = [];
         var durations = [];
         var colores = [];
         var $exampleCont = $('.font-awesome-spinner-example');
         var $hideLoadingBtn =$exampleCont.find('.show-loading');
         var $panel = $exampleCont.find('.panel');
         var color;

         var array = arrayMaq[actualPos].split(".");
         var CompanyId = array[0];
         var LocationId = array[1];
         var PlantId = array[2];
         var MachineGroupId = array[3];
         var MachineId = array[4];

         var endpoint = '/iot/restapi/Request/ProductionSummaryFOGRequest';
         endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;

         var jqxhr = $.getJSON(endpoint, function() {});

         jqxhr.done(function(data) {
              var shifts = data.shift
              var totals = data.total
              var avpercents = data.avpercent
              var avuptimes = data.avuptime
              var perpercents = data.perpercent
              var peractrates = data.peractrate
              var perexprates = data.perexprate
              var oees = data.oee
              var labels = []
              var durations = []

              for (var a = 0; a < shifts.length-1; a++)
              {
                 labels[a] = shifts[a];
                 durations[a] = totals[a];
              }

              for (var l = 0; l < labels.length; l++)
                    {
                        color =  colorAleatorio();
                        color = '#'+color;
                        colores.push(color);
                    }

                var newDivT = $('<div/>',{
                            id: MachineId+'-shift-title-div'
                        });
                    $('#prod-summary-panel').append(newDivT);
                    $('#'+MachineId+'-shift-title-div').append($("<h5>" + MachineId + "</h5>"));

                var newDivR = $('<div/>',{
                            id: MachineId+'-shift-div-row',
                            class: 'row'
                        });
                    $('#prod-summary-panel').append(newDivR);

                var data10 = {
                    labels: labels,
                    datasets: [{
                        data: durations,
                        backgroundColor: colores,
                        hoverBackgroundColor: colores
                    }]
                 };

                var config = {
                        type: 'pie',
                        data: data10
                    };

                var newDiv = $('<div/>',{
                            id: MachineId+'-shift-div',
                            class: 'mixwidget-canvas col-lg-5'
                        });
                    $('#'+MachineId+'-shift-div-row').append(newDiv);
                    var newCanvas = $('<canvas/>',{
                            id: MachineId + '-shift-canvas',
                            class: 'img-responsive'
                        }).prop({
                            width: 175,
                            height: 100
                        });

                    $('#'+MachineId+'-shift-div').append(newCanvas);
                    chart = new Chart(MachineId + '-shift-canvas', config);
                    //chart.update();

                var myNewDiv = $('<div/>',{
                            id: MachineId+'-shift-table-div',
                            class: 'mixwidget-table col-lg-7'
                        });
                var myNewDiv2 = $('<div/>',{
                            id: MachineId+'-shift-table-div2',
                            class: 'table-responsive'
                        });
                $('#'+MachineId+'-shift-div-row').append(myNewDiv);
                $('#'+MachineId+'-shift-table-div').append(myNewDiv2);
                var myNewTable = document.createElement('table');
                myNewTable.style.width = '100%';
                myNewTable.cellSpacing = "0";
                myNewTable.className = "table table-bordered";
                myNewTable.setAttribute("id", MachineId+'-table-shift');

                $('#'+MachineId+'-shift-table-div2').append(myNewTable);
                var myNewThead = myNewTable.createTHead();
                var myRowHead = myNewThead.insertRow(0);
                var myCell1 = myRowHead.insertCell(0);
                var myCell2 = myRowHead.insertCell(1);
                var myCell3 = myRowHead.insertCell(2);
                var myCell4 = myRowHead.insertCell(3);
                var myCell5 = myRowHead.insertCell(4);
                var myCell6 = myRowHead.insertCell(5);
                var myCell7 = myRowHead.insertCell(6);
                var myCell8 = myRowHead.insertCell(7);
                myCell1.innerHTML = "<b>Shift</b>";
                myCell2.innerHTML = "<b>Total</b>";
                myCell3.innerHTML = "<b>Percent</b>";
                myCell4.innerHTML = "<b>Uptime</b>";
                myCell5.innerHTML = "<b>Percent</b>";
                myCell6.innerHTML = "<b>Actual Rate</b>";
                myCell7.innerHTML = "<b>Expected Rate</b>";
                myCell8.innerHTML = "<b>OEE</b>";
                var myNewTfoot = document.createElement('tfoot');
                var myNewTbody = document.createElement('tbody');
                var myRow = document.createElement("tr");
                var myTh1 = document.createElement("th");
                var myTh2 = document.createElement("th");
                var myTh3 = document.createElement("th");
                var myTh4 = document.createElement("th");
                var myTh5 = document.createElement("th");
                var myTh6 = document.createElement("th");
                var myTh7 = document.createElement("th");
                var myTh8 = document.createElement("th");
                var myTn1 = document.createTextNode('Shift');
                var myTn2 = document.createTextNode('Total');
                var myTn3 = document.createTextNode('Percent');
                var myTn4 = document.createTextNode('Uptime');
                var myTn5 = document.createTextNode('Percent');
                var myTn6 = document.createTextNode('Actual Rate');
                var myTn7 = document.createTextNode('Expected Rate');
                var myTn8 = document.createTextNode('OEE');
                myTh1.appendChild(myTn1);
                myTh2.appendChild(myTn2);
                myTh3.appendChild(myTn3);
                myTh4.appendChild(myTn4);
                myTh5.appendChild(myTn5);
                myTh6.appendChild(myTn6);
                myTh7.appendChild(myTn7);
                myTh8.appendChild(myTn8);
                myRow.appendChild(myTh1);
                myRow.appendChild(myTh2);
                myRow.appendChild(myTh3);
                myRow.appendChild(myTh4);
                myRow.appendChild(myTh5);
                myRow.appendChild(myTh6);
                myRow.appendChild(myTh7);
                myRow.appendChild(myTh8);
                myNewTfoot.appendChild(myRow);

                    for (var h = 0; h < shifts.length; h++)
                    {
                         var row = document.createElement("tr");
                         var h1 = document.createElement("td");
                         var h2 = document.createElement("td");
                         var h3 = document.createElement("td");
                         var h4 = document.createElement("td");
                         var h5 = document.createElement("td");
                         var h6 = document.createElement("td");
                         var h7 = document.createElement("td");
                         var h8 = document.createElement("td");
                         var t1 = document.createTextNode(shifts[h]);
                         var t2 = document.createTextNode(totals[h]);
                         var t3 = document.createTextNode(formatPercentage(avpercents[h]));
                         var t4 = document.createTextNode(formatDurations(avuptimes[h]));
                         var t5 = document.createTextNode(formatPercentage(perpercents[h]));
                         var t6 = document.createTextNode(formatPercentage(peractrates[h]));
                         var t7 = document.createTextNode(formatPercentage(perexprates[h]));
                         var t8 = document.createTextNode(formatPercentage(oees[h]));
                         h1.appendChild(t1);
                         h2.appendChild(t2);
                         h3.appendChild(t3);
                         h4.appendChild(t4);
                         h5.appendChild(t5);
                         h6.appendChild(t6);
                         h7.appendChild(t7);
                         h8.appendChild(t8);
                         row.appendChild(h1);
                         row.appendChild(h2);
                         row.appendChild(h3);
                         row.appendChild(h4);
                         row.appendChild(h5);
                         row.appendChild(h6);
                         row.appendChild(h7);
                         row.appendChild(h8);
                         myNewTbody.appendChild(row);
                    }
                    //myNewTable.appendChild(myNewTfoot);
                    myNewTable.appendChild(myNewTbody);
                    //$panel.ploading({action: 'hide'});
                    var table = $('#'+MachineId+'-table-shift').DataTable({
                        "bFilter": false,
                        "bPaginate": false,
                        "bInfo": false
                     });

                     tableControl.push(table);
                     tableNameControl.push('table-shift');

              if (actualPos < arrayLen - 1)
              {
                  graficarShiftProductionSummary(arrayMaq, arrayLen, actualPos+1, startDttm, endDttm);
              }
              else
              {
                    ajustarTamanoWidgets();
              }
        });
    }


  function graficarMaquinaMachineVariableStatus(arrayMaq, arrayLen, actualPos)
  {
        var myTableBody = document.getElementById('tbl-variables');
        var array = [];
        var company, location, plant, machineGroup, machineId;
        var endpoint = '';
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');

        var array = arrayMaq[actualPos].split(".");
        var CompanyId = array[0];
        var LocationId = array[1];
        var PlantId = array[2];
        var MachineGroupId = array[3];
        var MachineId = array[4];

        var row, h1, h2, h3, h4, t1, t2, t3, t4;
        endpoint = '/iot/restapi/Request/MachineVariableStatusFOGRequest';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {
                var array = data.variables

                for(var j = 0; j < array.length; j++)
                {
                    row = document.createElement("tr");
                    h1 = document.createElement("td");
                    h2 = document.createElement("td");
                    h3 = document.createElement("td");
                    h4 = document.createElement("td");
                    t1 = document.createTextNode(PlantId);
                    t2 = document.createTextNode(MachineId);
                    t3 = document.createTextNode(array[j][0]);
                    t4 = document.createTextNode(array[j][1]);
                    h1.appendChild(t1);
                    h2.appendChild(t2);
                    h3.appendChild(t3);
                    h4.appendChild(t4);
                    row.appendChild(h1);
                    row.appendChild(h2);
                    row.appendChild(h3);
                    row.appendChild(h4);
                    myTableBody.appendChild(row);
                }

                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaMachineVariableStatus(arrayMaq, arrayLen, actualPos+1 )
                }else{
                    var table = $('#tbl-variables-h').DataTable();
                    tableControl.push(table);
                    tableNameControl.push('table-var-status');
                }
        });

    }


     function graficarMaquinaVariableTrend(chart, config, arrayReq, arrayVar, arrayLen, actualPos, startDttm, endDttm, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray, maxLen)
    {
        var currentVar = arrayVar[actualPos]
        var endpoint = '';
        var $exampleCont = $('.font-awesome-spinner-example');
        var $hideLoadingBtn =$exampleCont.find('.show-loading');
        var $panel = $exampleCont.find('.panel');

        var CompanyId = arrayReq[0];
        var LocationId = arrayReq[1];
        var PlantId = arrayReq[2];
        var MachineGroupId = arrayReq[3];
        var MachineId = arrayReq[4];
        var dates = [], values = [], valuesVar = [], valuesOee = [], valuesAval = [], valuesPer = [];
        var maxLen;
        var arrayConsol;
        if (currentVar == 'OEE' || currentVar == 'Availability' || currentVar == 'Performance')
        {
            if (OEEFlag == 'Y')
            {
                if (currentVar == 'OEE')
                {
                    /*chart.load({
                        columns: [
                            oeeArray
                       ]
                    });*/
                    agregarSerieTrend(chart, config, dates, 'OEE', oeeArray, 'none', '', 0, false);
                    if (oeeArray.length > maxLen)
                    {
                        maxLen = oeeArray.length;
                    }
                    arrayConsol = arrayConsol.concat(oeeArray);
                }
                if (currentVar == 'Performance')
                {
                    agregarSerieTrend(chart, config, dates, 'Performance', perArray, 'none', '', 0, false);
                    if (perArray.length > maxLen)
                    {
                        maxLen = perArray.length;
                    }
                    arrayConsol = arrayConsol.concat(perArray);
                }
                if (currentVar == 'Availability')
                {
                    agregarSerieTrend(chart, config, dates, 'Availability', avalArray, 'none', '', 0, false);
                    if (avalArray.length > maxLen)
                    {
                        maxLen = avalArray.length;
                    }
                    arrayConsol = arrayConsol.concat(avalArray);
                }

                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaVariableTrend(chart, config, arrayReq, arrayVar, arrayLen, actualPos + 1, startDttm, endDttm, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray, maxLen);
                }
                else
                {

                    if (minFlg == 'Y')
                    {
                        graficarMin(chart, config, arrayConsol, maxLen)
                    }
                    if (maxFlg == 'Y')
                    {
                        graficarMax(chart, config, arrayConsol, maxLen)
                    }
                    if (avgFlg == 'Y')
                    {
                        graficarAvg(chart, config, arrayConsol, maxLen)
                    }
                    if (trendFlg == 'Y')
                    {
                        graficarTrend(chart, config, arrayConsol, maxLen)
                    }
                    //$panel.ploading({action: 'hide'});
                }
            }
            else
            {
                endpoint = '/iot/restapi/Request/ProductionMachineRollupRequestFOG';
                endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;
                var jqxhr = $.getJSON(endpoint, function() {});
                jqxhr.done(function(data) {
                    dates = data.dates
                    valuesPer = data.valuePer;
                    valuesAval = data.valueAva;
                    valuesOee = data.valueOee;
                    if (currentVar == 'OEE')
                    {
                        values = valuesOee.slice();
                        /*values.unshift('OEE');
                        chart.load({
                            columns: [
                                values
                            ]
                        });*/
                        agregarSerieTrend(chart, config, dates, 'OEE', values, 'none', '', 0, false);
                        if (valuesOee.length > maxLen)
                        {
                            maxLen = valuesOee.length;
                        }
                        arrayConsol = arrayConsol.concat(valuesOee);
                    }
                    if (currentVar == 'Performance')
                    {
                        values = valuesPer.slice();
                        agregarSerieTrend(chart, config, dates, 'Performance', values, 'none', '', 0, false);
                        if (valuesPer.length > maxLen)
                        {
                            maxLen = valuesPer.length;
                        }
                        arrayConsol = arrayConsol.concat(valuesPer);
                    }
                    if (currentVar == 'Availability')
                    {
                        values = valuesAval.slice();
                        agregarSerieTrend(chart, config, dates, 'Availability', values, 'none', '', 0, false);
                        if (valuesAval.length > maxLen)
                        {
                            maxLen = valuesAval.length;
                        }
                        arrayConsol = arrayConsol.concat(valuesAval);
                    }

                    if (actualPos < arrayLen - 1)
                    {
                        graficarMaquinaVariableTrend(chart, config, arrayReq, arrayVar, arrayLen, actualPos + 1, startDttm, endDttm, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray);
                    }
                    else
                    {

                        if (minFlg == 'Y')
                        {
                            graficarMin(chart, config, arrayConsol, maxLen)
                        }
                        if (maxFlg == 'Y')
                        {
                            graficarMax(chart, config, arrayConsol, maxLen)
                        }
                        if (avgFlg == 'Y')
                        {
                            graficarAvg(chart, config, arrayConsol, maxLen)
                        }
                        if (trendFlg == 'Y')
                        {
                            graficarTrend(chart, config, arrayConsol, maxLen)
                        }
                        //$panel.ploading({action: 'hide'});
                    }

                });
            }
        }
        else
        {
            endpoint = '/iot/restapi/Request/VariableTrendFOGRequest';
            endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm+'&variable='+currentVar;
            var jqxhr = $.getJSON(endpoint, function() {});
            jqxhr.done(function(data) {
                dates = data.date
                values = data.variable
                valuesVar = values.slice();
                agregarSerieTrend(chart, config, dates, 'currentVar', valuesVar, 'none', '', 0, false);
                if (values.length > maxLen)
                {
                    maxLen = values.length;
                }
                arrayConsol = arrayConsol.concat(values);
                    if (actualPos < arrayLen - 1)
                    {
                        graficarMaquinaVariableTrend(chart, config, arrayReq, arrayVar, arrayLen, actualPos + 1, startDttm, endDttm, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray);
                    }
                    else
                    {

                        if (minFlg == 'Y')
                        {
                            graficarMin(chart, config, arrayConsol, maxLen)
                        }
                        if (maxFlg == 'Y')
                        {
                            graficarMax(chart, config, arrayConsol, maxLen)
                        }
                        if (avgFlg == 'Y')
                        {
                            graficarAvg(chart, config, arrayConsol, maxLen)
                        }
                        if (trendFlg == 'Y')
                        {
                            graficarTrend(chart, config, arrayConsol, maxLen)
                        }
                        //$panel.ploading({action: 'hide'});
                    }
            });
        }
    }

    function graficarVariableTrend(start_date, end_date)
    {
        var arrayReq = getParamRequest();
        var arrayVar = getVariables();
        var endpoint = '';
        $('.main-template').show();
        initSpinner();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayConsol = [];
        var oeeArray = [];
        var avalArray = [];
        var perArray = [];
        var minFlg = 'N', maxFlg = 'N', avgFlg = 'N', trendFlg = 'N', OEEFlag = 'N';
        var minVar = document.getElementById('min');
        var maxVar = document.getElementById('max');
        var avgVar = document.getElementById('avg');
        var trendVar = document.getElementById('trend');
        if (minVar.checked == true)
        {
            minFlg = 'Y';
        }
        if (maxVar.checked == true)
        {
            maxFlg = 'Y';
        }
        if (avgVar.checked == true)
        {
            avgFlg = 'Y';
        }
        if (trendVar.checked == true)
        {
            trendFlg = 'Y';
        }
        startDt = document.getElementById("startDttm");
        endDt = document.getElementById("endDttm");

        fechaInicio = startDt.value;
        fechaFin = endDt.value;
        if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 && arrayVar.length > 0 ) {

            for (var k = 0; k < arrayReq.length; k++){
                var array = arrayReq[k].split(".");
                var CompanyId = array[0];
                var LocationId = array[1];
                var PlantId = array[2];
                var MachineGroupId = array[3];
                var MachineId = array[4];
                var arrayData = [CompanyId, LocationId, PlantId, MachineGroupId, MachineId];
                var config = {
                    type: 'line',
                    data: {labels: [],
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        title:{
                            display:true,
                            text: MachineId
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                            elements: {
                                point: { radius: 0 }
                            },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Time'
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Value'
                                }
                            }]
                        }
                    }
                };
                var newDiv = $('<div/>',{
                                id: MachineId+'-trend-div'
                            });
                    $('#machine-panel-variable-trend').append(newDiv);
                    var newCanvas = $('<canvas/>',{
                                id: MachineId + '-trend-canvas'
                            });
                    $('#'+MachineId+'-trend-div').append(newCanvas);

                    var chart = new Chart(MachineId + '-trend-canvas', config);

                //var ctx = document.getElementById("canvas").getContext("2d");
                //window.myLine = new Chart(ctx, config);
                if (typeof start_date != 'undefined')
                {
                    fechaInicio = start_date;
                }
                if (typeof end_date != 'undefined')
                {
                    fechaFin = end_date;
                }
                var startTime = document.getElementById("startTime").value;
                var endTime = document.getElementById("endTime").value;
                 fechaInicio = fechaInicio + 'T' + startTime;
                 fechaFin = fechaFin + 'T' + endTime;
                graficarMaquinaVariableTrend(chart, config, arrayData, arrayVar, arrayVar.length, 0, fechaInicio, fechaFin, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray, 0);
            }
        }
    }

    function graficarMin(chart, config, arrayConsol, maxLen)
    {
        var i = 0;
        var min = 100000000;
        var data = [];
        var dates = [];
        for (i = 0; i < arrayConsol.length; i++)
        {
            if(arrayConsol[i] < min)
            {
                min = arrayConsol[i];
            }
        }

        for (i = 0; i < maxLen; i++)
        {
            data.push(min);
        }
        agregarSerieTrend(chart, config, dates, 'Min', data, 'none', '', 0, false);
    }

    function graficarMax(chart, config, arrayConsol, maxLen)
    {
        var i = 0;
        var max = 0;
        var data = [];
        var dates = [];
        dates.push(1);
        for (i = 0; i < arrayConsol.length; i++)
        {
            if(arrayConsol[i] > max)
            {
                max = arrayConsol[i];
            }
        }

        for (i = 0; i < maxLen; i++)
        {
            data.push(max);
        }
        agregarSerieTrend(chart, config, dates, 'Max', data, 'none', '', 0, false);
    }

    function graficarAvg(chart, config, arrayConsol, maxLen)
    {
        var i = 0;
        var avg;
        var data = [];
        var dates = [];
        var sum = arrayConsol.reduce(function(a, b) { return a + b; });
        var avg = sum / arrayConsol.length;

        for (i = 0; i < maxLen; i++)
        {
            data.push(avg);
        }
        agregarSerieTrend(chart, config, dates, 'Avg', data, 'none', '', 0, false);
    }


    function graficarTrend(chart, config, arrayConsol, maxLen)
    {
        var xArray = [];
        var data = [];
        var x2 = 0;
        var y = 0;
        var x = 0;
        var xy = 0;
        var b = 0;
        var a = 0;
        var dates = [];
        for (i = 0; i < maxLen; i++)
        {
            xArray.push(i);
        }

        for (i = 0; i < maxLen; i++)
        {
            x2 += xArray[i]*xArray[i];
            y  += arrayConsol[i];
            x  += xArray[i];
            xy += xArray[i]*arrayConsol[i];
        }

        //Coeficiente parcial de regresion
        b=(maxLen*xy-x*y)/(maxLen*x2-x*x);

        //Calculo del intercepto
        a=(y-b*x)/maxLen;

        for (i = 0; i < maxLen; i++)
        {
            data.push(a + (b * xArray[i]));
        }

        agregarSerieTrend(chart, config, dates, 'Trend', data, 'none', '', 0, false);
    }


    function graficarVariableGauge(start_date, end_date)
    {
        var arrayReq = getParamRequest();
        var arrayVar = getVariables();
        var endpoint = '';
        $('.main-template').show();
        initSpinner();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayConsol = [];
        var oeeArray = [];
        var avalArray = [];
        var perArray = [];

        startDt = document.getElementById("startDttm");
        endDt = document.getElementById("endDttm");

        fechaInicio = startDt.value;
        fechaFin = endDt.value;

        if ((typeof fechaInicio != 'undefined' && fechaInicio) && (typeof fechaFin != 'undefined' && fechaFin) && arrayReq.length > 0 && arrayVar.length > 0 ) {

        if (typeof start_date != 'undefined')
        {
            fechaInicio = start_date;
        }
        if (typeof end_date != 'undefined')
        {
            fechaFin = end_date;
        }
        var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
             fechaInicio = fechaInicio + 'T' + startTime;
             fechaFin = fechaFin + 'T' + endTime;

            for (var k = 0; k < arrayReq.length; k++){
                var array = arrayReq[k].split(".");
                var CompanyId = array[0];
                var LocationId = array[1];
                var PlantId = array[2];
                var MachineGroupId = array[3];
                var MachineId = array[4];
                var arrayData = [CompanyId, LocationId, PlantId, MachineGroupId, MachineId];

                /*var newDiv = $('<div/>',{
                                id: MachineId+'-gauge-div'
                            });
                    $('#gauge-panel').append(newDiv);*/
                graficarMaquinaVariableGauge(arrayData, arrayVar, arrayVar.length, 0, fechaInicio, fechaFin);
            }
        }
    }

    function graficarMaquinaVariableGauge(arrayReq, arrayVar, arrayLen, actualPos, startDttm, endDttm)
    {
        var currentVar = arrayVar[actualPos]
        var endpoint = '';
        var $exampleCont = $('.font-awesome-spinner-example');
        var $hideLoadingBtn =$exampleCont.find('.show-loading');
        var $panel = $exampleCont.find('.panel');

        var CompanyId = arrayReq[0];
        var LocationId = arrayReq[1];
        var PlantId = arrayReq[2];
        var MachineGroupId = arrayReq[3];
        var MachineId = arrayReq[4];
        var data;

        if (currentVar == 'OEE' || currentVar == 'Availability' || currentVar == 'Performance')
        {
                endpoint = '/iot/restapi/Request/ProductionMachineRollupRequestFOG';
                endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;
                var jqxhr = $.getJSON(endpoint, function() {});
                jqxhr.done(function(data) {
                    dates = data.dates
                    valuesPer = data.valuePer;
                    valuesAval = data.valueAva;
                    valuesOee = data.valueOee;
                    if (currentVar == 'OEE')
                    {
                        data = valuesOee[valuesOee.length - 1]
                    }
                    if (currentVar == 'Performance')
                    {
                        data = valuesPer[valuesPer.length - 1]
                    }
                    if (currentVar == 'Availability')
                    {
                        data = valuesAval[valuesAval.length - 1]
                    }
                    var newDiv = $('<div/>',{
                                id: MachineId+'-'+currentVar+'-gauge-div'
                     });
                     $('#gauge-panel').append(newDiv);
                     $('#'+MachineId+'-'+currentVar+'-gauge-div').addClass('gauge-div col-md-6');
                     var newCanvas = $('<canvas/>',{
                                id: MachineId +'-'+currentVar+'-gauge-canvas'
                            });
                    //$('#'+MachineId+'-'+currentVar+'-gauge-div').append(newCanvas);
                    $('#'+MachineId+'-'+currentVar+'-gauge-div').append(newCanvas);
                     var dataPrint = data.toString().slice(0,3);
                     dataPrint = dataPrint + '%';
                     var remData = 0;
                     var color = 'db4343'
                     if (data < 100){
                        remData = 100 - data;
                        if (data > 40){
                            color = 'ffd700'
                        }
                        if (data > 60){
                            color = 'aedf24'
                        }
                        if (data > 80){
                            color = '8adb43'
                        }
                     }
                     else
                     {
                        color = '8adb43'
                     }

                     var data = {
                          labels: [
                            "Red",
                            "Blue"
                          ],
                          datasets: [
                            {
                              data: [data, remData],
                              backgroundColor: [
                                "#"+color,
                                'rgba(0, 0, 0, 0)'
                              ],
                              borderColor: [
                                "#"+color,
                                "#"+color
                              ]
                            }]
                        };

                        var promisedDeliveryChart = new Chart(document.getElementById(MachineId +'-'+currentVar+'-gauge-canvas'), {
                          type: 'doughnut',
                          data: data,
                          options: {
                            responsive: true,
                            legend: {
                              display: false
                            },
                            title: {
                                display: true,
                                text: MachineId +'-'+currentVar,
                                position: 'top'
                            },
                            layout: {
                                padding: {
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0
                                }
                            }
                          }
                        });

                        Chart.pluginService.register({
                          beforeDraw: function(chart) {
                            if (chart.chart.canvas.id == MachineId +'-'+currentVar+'-gauge-canvas'){
                                var width = chart.chart.width,
                                    height = chart.chart.height,
                                    ctx = chart.chart.ctx;
                                ctx.restore();
                                var fontSize = (height / 114).toFixed(2);
                                ctx.font = fontSize + "em sans-serif";
                                ctx.textBaseline = "middle";
                                var text = dataPrint,
                                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                                    textY = height / 1.7;
                                ctx.fillText('', textX, textY);
                                ctx.save();
                                ctx.fillText(text, textX, textY);
                                ctx.save();
                            }
                          }
                        });
                    if (actualPos < arrayLen - 1)
                    {
                        graficarMaquinaVariableGauge(arrayReq, arrayVar, arrayLen, actualPos + 1, startDttm, endDttm);
                    }
            });

        }
        else
        {
            endpoint = '/iot/restapi/Request/VariableTrendFOGRequest';
            endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm+'&variable='+currentVar;
            var jqxhr = $.getJSON(endpoint, function() {});
            jqxhr.done(function(data) {
                dates = data.date
                values = data.variable
                data = values[values.length - 1]
                var newDiv = $('<div/>',{
                                id: MachineId+'-'+currentVar+'-gauge-div'
                     });
                     $('#'+MachineId+'-gauge-div').append(newDiv);
                var data = {
                      labels: [
                        "Red",
                        "Blue"
                      ],
                      datasets: [
                        {
                          data: [30, 70],
                          backgroundColor: [
                            "#FF6384",
                            'rgba(0, 0, 0, 0)'
                          ],
                          hoverBackgroundColor: [
                            "#FF6384",
                            'rgba(0, 0, 0, 0)'
                          ]
                        }]
                    };

                    var promisedDeliveryChart = new Chart(document.getElementById(MachineId+'-'+currentVar+'-gauge-div'), {
                      type: 'doughnut',
                      data: data,
                      options: {
                        responsive: true,
                        legend: {
                          display: false
                        },
                        rotation: 1 * Math.PI,
                        circumference: 1 * Math.PI
                      }
                    });

                    Chart.pluginService.register({
                      beforeDraw: function(chart) {
                        var width = chart.chart.width,
                            height = chart.chart.height,
                            ctx = chart.chart.ctx;

                        ctx.restore();
                        var fontSize = (height / 114).toFixed(2);
                        ctx.font = fontSize + "em sans-serif";
                        ctx.textBaseline = "middle";

                        var text = "30%",
                            textX = Math.round((width - ctx.measureText(text).width) / 2),
                            textY = height / 1.3;

                        ctx.fillText(text, textX, textY);
                        ctx.save();
                      }
                    });
                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaVariableGauge(arrayReq, arrayVar, arrayLen, actualPos + 1, startDttm, endDttm);
                }
            });
        }
    }


  function cleanHTMLPanel(id)
   {
        var list = document.getElementById(id);
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
   }

  function getParamRequest()
  {
       var i;
       var arrayMachine = [];
       var optionMachine;

       optionMachine = document.getElementsByName("machine");
       for (i = 0; i < optionMachine.length; i++)
       {
          if (optionMachine[i].checked == true && optionMachine[i].value != "Z")
          {
             arrayMachine.push(optionMachine[i].className);
          }
       }
        return arrayMachine;
  }

    function initSpinner()
    {
      (
        function($)
        {
    	    "use strict";
            var task = {};
            var action = {};

            task.defineActions = function ()
            {

                action.setFontAwesometSpinnerExample = function ()
                {
                    var $exampleCont = $('.font-awesome-spinner-example');
                    var $showLoadingBtn =$exampleCont.find('.show-loading');
                    var $hideLoadingBtn =$exampleCont.find('.hide-loading');
                    var $panel = $exampleCont.find('.panel');
                 };
            };

          task.runActions = function () {
            action.setFontAwesometSpinnerExample();
          };

          task.initialize = function () {
            task.defineActions();
            task.runActions();
          };

          task.initialize();
        })(jQuery);
    }

  function cleanHTMLTable(id)
   {
        var elmtTable = document.getElementById(id);
        var tableRows = elmtTable.getElementsByTagName('tr');
        var rowCount = tableRows.length;

        for (var x=rowCount-1; x>=0; x--) {
            elmtTable.removeChild(tableRows[x]);
        }
   }


   function colorAleatorio(){
       var colors = new Array(14);
       colors[0]="0";
       colors[1]="1";
       colors[2]="2";
       colors[3]="3";
       colors[4]="4";
       colors[5]="5";
       colors[5]="6";
       colors[6]="7";
       colors[7]="8";
       colors[8]="9";
       colors[9]="a";
       colors[10]="b";
       colors[11]="c";
       colors[12]="d";
       colors[13]="e";
       colors[14]="f";

       var digit = new Array(5);
       var colorResult = '';

       for (i=0;i<6;i++){
          colorResult+= colors[Math.round(Math.random()*14)];
       }
       return colorResult;
   }

    function getVariables()
  {
       var i;
       var arrayVariables = [];
       var optionVariable;

       optionVariable = document.getElementById("variable");
       for (i = 0; i < optionVariable.length; i++)
       {
          if (optionVariable[i].selected == true)
          {
             arrayVariables.push(optionVariable[i].className);
          }
       }
        return arrayVariables;
  }



    function agregarSerieTrend(chart, config, labels, label, data, colorSet, newBorderColor, borderWidth, fillOpt){
        if (config.data.labels.length == 0){
            for (var index = 0; index < labels.length; ++index) {
                config.data.labels.push(labels[index]);
            }
        }
        if (colorSet == 'none'){
            color =  colorAleatorio();
            newColor = '#'+color;
            newBorderColor = '#'+newColor
            var newDataset = {
                    label: label,
                    data: [],
                    backgroundColor: newColor,
                    borderColor: newColor,
                    fill: false
            };
        }else{
            color = colorSet
            newColor = '#'+color;
            newBorderColor = '#'+newBorderColor;
            var newDataset = {
                    label: label,
                    data: [],
                    backgroundColor: newColor,
                    borderColor: newBorderColor,
                    borderWidth: borderWidth,
                    fill: fillOpt
            };
        }

        for (var index = 0; index < data.length; ++index) {
                newDataset.data.push(data[index]);
        }
        config.data.datasets.push(newDataset);
        chart.update();
    }



    function initFilters(){
        var path = window.location.pathname;
        var page = path.split("/");
        alert(page);
        if (page == 'machine-status'){
            $('.multiple').hide();
        }
    }

    function procesarWidgetsBlocks(arrayBlocks, maxLen, actualPos, arrayFuncs, start_date, end_date, id_start_date, id_end_date, maintemplate){
        var rem;
        var endpoint = '';
        endpoint = '/iot/startbootstrap/widgets/render-widget';
        endpoint = endpoint + '?reportId='+arrayBlocks[actualPos];
        $.get( endpoint, function( data ) {
            var sizeOpt = $('input[name="optradio"]:checked').val();
            if (sizeOpt == 'large')
            {
                if (typeof maintemplate != 'undefined')
                {
                    maintemplate.append(data);
                }
                else
                {
                    $( "#main-content-lg" ).append(data);
                    //$( "#main-content" ).append('<br />').addClass("template");
                    //$( "#main-content" ).append('<br />').addClass("template");
                }
            }
            else if (sizeOpt == 'medium')
            {
                rem = (actualPos + 1) % 2;
                if (rem == 1)
                {
                    if (typeof maintemplate != 'undefined')
                    {
                        maintemplate.append(data);
                    }
                    else
                    {
                        $( "#main-content-md-1" ).append(data);
                        //$( "#main-content-md-1" ).append('<br />').addClass("template");
                        //$( "#main-content-md-1" ).append('<br />').addClass("template");
                    }
                }
                else if (rem == 0)
                {
                    if (typeof maintemplate != 'undefined')
                    {
                        maintemplate.append(data);
                    }
                    else
                    {
                        $( "#main-content-md-2" ).append(data);
                        //$( "#main-content-md-2" ).append('<br class = "template brtemp"/>');
                        //$( "#main-content-md-2" ).append('<br class = "template brtemp"/>');
                    }
                }
            }
            else if (sizeOpt == 'small')
            {
                rem = (actualPos + 1) % 3;
                if (rem == 1)
                {
                    if (typeof maintemplate != 'undefined')
                    {
                        maintemplate.append(data);
                    }
                    else
                    {
                        $( "#main-content-sm-1" ).append(data);
                        //$( "#main-content-sm-1" ).append('<br class = "template brtemp"/>');
                        //$( "#main-content-sm-1" ).append('<br class = "template brtemp"/>');
                    }
                }
                else if (rem == 2)
                {
                    if (typeof maintemplate != 'undefined')
                    {
                        maintemplate.append(data);
                    }
                    else
                    {
                        $( "#main-content-sm-2" ).append(data);
                        //$( "#main-content-sm-2" ).append('<br class = "template brtemp"/>');
                        //$( "#main-content-sm-2" ).append('<br class = "template brtemp"/>');
                    }
                }
                else if (rem == 0)
                {
                    if (typeof maintemplate != 'undefined')
                    {
                        maintemplate.append(data);
                    }
                    else
                    {
                        $( "#main-content-sm-3" ).append(data);
                        //$( "#main-content-sm-3" ).append('<br class = "template brtemp"/>');
                        //$( "#main-content-sm-3" ).append('<br class = "template brtemp"/>');
                    }
                }
            }
            else
            {
                if (typeof maintemplate != 'undefined')
                    {
                        maintemplate.append(data);
                    }
                    else
                    {
                        $( "#main-content-lg" ).append(data);
                        //$( "#main-content" ).append('<br class = "template brtemp"/>');
                        //$( "#main-content" ).append('<br class = "template brtemp"/>');
                    }
            }

            if (actualPos < maxLen - 1){
                procesarWidgetsBlocks(arrayBlocks, maxLen, actualPos + 1, arrayFuncs, start_date, end_date, id_start_date, id_end_date, maintemplate);
            }
            else{
                procesarWidgetsFunctions(arrayFuncs, start_date, end_date, id_start_date, id_end_date);
            }
         });
    }

    function procesarWidgetsFunctions(arrayFuncs, start_date, end_date, id_start_date, id_end_date){
        var arrayReq = getParamRequest();
        $('.main-template').hide();
        ajustarTamanoWidgets();
        executeFunctionsCalls(arrayFuncs, start_date, end_date);
        //siempre se crea un favorito marcado como la última consula;
        if ((typeof start_date != 'undefined' && start_date) && (typeof end_date != 'undefined' && end_date) && arrayReq.length > 0 ) {
            $("#custom-report-name").val('Last Query')
            create_custom_report();
            //$('.card-header').append(start_date + ' - ' + end_date).show();
            if (typeof id_start_date == 'undefined' && typeof id_end_date == 'undefined')
            {
                $('.card-start-date').append(start_date).show();
                $('.card-end-date').append(end_date).show();
            }
            else {
            $('#'+id_start_date).append(start_date).show();
            $('#'+id_end_date).append(end_date).show();
            }
        }
        if ($('#monitorFlag').is(':checked')){
            monitorModeMachine(arrayFuncs);
        }else{
            window.clearInterval(idInterval);
        }
    }

    function executeFunctionsCalls(arrayFuncs, start_date, end_date){
        var dttm = new Date().toLocaleString();
        for (var i = 0; i < arrayFuncs.length; i++) {
                func = arrayFuncs[i];
                window[func](start_date, end_date);
        }
    }
    function monitorModeMachine(arrayFuncs)
    {
          idInterval = setInterval(function(){ executeFunctionsCalls(arrayFuncs); }, 10000);
    }

    function ajustarTamanoWidgets(){
        var sizeOpt = $('input[name="optradio"]:checked').val();
        if (sizeOpt == 'large'){
            $(".mixwidget-canvas").removeClass("col-lg-12");
            $(".mixwidget-canvas").removeClass("col-lg-5");
            $(".mixwidget-canvas").addClass("col-lg-5");
            $(".mixwidget-table").removeClass("col-lg-12");
            $(".mixwidget-table").removeClass("col-lg-7");
            $(".mixwidget-table").addClass("col-lg-7");
        }
        if (sizeOpt == 'medium'){
            $(".mixwidget-canvas").removeClass("col-lg-12");
            $(".mixwidget-canvas").removeClass("col-lg-5");
            $(".mixwidget-canvas").addClass("col-lg-5");
            $(".mixwidget-table").removeClass("col-lg-12");
            $(".mixwidget-table").removeClass("col-lg-7");
            $(".mixwidget-table").addClass("col-lg-7");
        }
        if (sizeOpt == 'small'){
            $(".mixwidget-canvas").removeClass("col-lg-12");
            $(".mixwidget-canvas").removeClass("col-lg-5");
            $(".mixwidget-canvas").addClass("col-lg-12");
            $(".mixwidget-table").removeClass("col-lg-12");
            $(".mixwidget-table").removeClass("col-lg-7");
            $(".mixwidget-table").addClass("col-lg-12");
        }
    }

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

  function create_custom_report() {

      var csrftoken = getCookie('csrftoken');

      var the_machines_aux = [];
      var the_machines = $("input[name='machine']:checked");
      the_machines.each(function() {
         the_machines_aux.push(this.className);
       });

      var the_widgets_aux = [];
      var the_widgets = $("input[name='widget']:checked");
      the_widgets.each(function() {
         the_widgets_aux.push(this.id);
       });

      var the_variables_aux = [];
      var the_variables = $("option[name=variable]:selected");
      the_variables.each(function() {
         the_variables_aux.push(this.value);
       });

      $.ajax({
        url: "/iot/webmonitor/reports/create-custom-report/",
        type: "POST",
        csrfmiddlewaretoken: csrftoken,
        data: {
          custom_report_name: $("#custom-report-name").val(),
          cbx_machine: the_machines_aux,
          cbx_variables: the_variables_aux,
          cbx_widgets: the_widgets_aux,
          dateFrom: $("#startDttm").val(),
          timeFrom: $('#startTime').val(),
          startNumDays: $("#start-num-days").val(),
          dateTo: $("#endDttm").val(),
          timeTo: $('#endTime').val(),
          endNumDays: $("#end-num-days").val(),
          minFlag: $("#min").prop("checked") ? 'Y' : 'N',
          maxFlag: $("#max").prop("checked") ? 'Y' : 'N',
          avgFlag: $("#avg").prop("checked") ? 'Y' : 'N',
          trendFlag: $("#trend").prop("checked") ? 'Y' : 'N',
          today: $("#today").val(),
          lastWeek: $("#lastweek").val(),
          thisWeek: $("#thisweek").val(),
          lastMonth: $("#lastmonth").val(),
          thisMonth: $("#thismonth").val(),
          widgetSize: $('input[name="optradio"]:checked').val(),
          monitorFlag: $("#monitorFlag").prop("checked") ? 'Y' : 'N',
          hour: $('#hour').prop("checked") ? 'Y' : 'N',
          day: $('#day').prop("checked") ? 'Y' : 'N',
          week: $('#week').prop("checked") ? 'Y' : 'N',
          month: $('#month').prop("checked") ? 'Y' : 'N'
        },


        success: function(json) {
          $("#custom-report-name").val('');
          $("#report-alert").html("Custom report was created!").toggleClass("hidden");
          $("#report-alert").fadeTo(2000, 500).slideUp(500, function() {
            $("#report-alert").slideUp(500);
          });
        },

        error: function(xhr, errmsg, err) {
          $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
            " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        },

      });
      // sanity check
   };

  function sync_user_custom_report(){
      // update report filters
        var arrCompanies = [];
        var arrSites = [];
        var arrPlants = [];
        var arrMachineGroups = [];
        var arrMachines = [];
        //event.preventDefault();
        $(this).prop('disabled', true);
        custom_report_name = $('#custom-report').val();

        var url = "/iot/webmonitor/filters/custom/report/" + custom_report_name;
        var jqxhr = $.getJSON(url, function() {});
        jqxhr.done(function(data) {
            var reportMachines = data.reportMachines;
            var variables = data.variables;
            var reportWidgets = data.widgets;
            var sizeOpt = data.widgetSize;
            if (sizeOpt == 'large'){
                $("#large").prop('checked', true);
            }
            if (sizeOpt == 'medium'){
                $("#medium").prop('checked', true);
            }
            if (sizeOpt == 'small'){
                $("#small").prop('checked', true);
            }

            $("div.multiple select").prop('selected', false);
            for (var i = 0; i < variables.length; i++) {
                $('option[value="'+variables[i]+'"]', $('#variable')).prop('selected', true);
            }
            $('#variable').multiselect('refresh');

            $('#startTime').val(data.horaInicial);
            $('#endTime').val(data.horaFinal);

            $("input[name='widget']").prop('checked', false);
            for (var i = 0; i < reportWidgets.length; i++) {
                $('#'+reportWidgets[i]).prop('checked', true);
            }
            if (data.today == 'Y'){
                setToday();
            }
            if (data.lastWeek == 'Y'){
                setLastWeek();
            }
            if (data.currentWeek == 'Y'){
                setThisWeek();
            }
            if (data.lastMonth == 'Y'){
                setLastMonth();
            }
            if (data.currentMonth == 'Y'){
                setThisMonth();
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
            if (data.monitorFlag == 'Y'){
                $('#monitorFlag').prop('checked', true);
            }
            else{
                $('#monitorFlag').prop('checked', false);
            }
            for (var i = 0; i < reportMachines.length; i++) {
                arrCompanies.push(reportMachines[i].company);
                arrSites.push(reportMachines[i].site);
                arrPlants.push(reportMachines[i].plant);
                arrMachineGroups.push(reportMachines[i].machine_group);
                arrMachines.push(reportMachines[i].machine);
            }
            if (data.hour == 'Y')
            {
                $('#hour').prop('checked', true);
            } else {
                $('#hour').prop('checked', false);
            }
            if (data.day == 'Y')
            {
                $('#day').prop('checked', true);
            } else {
                $('#day').prop('checked', false);
            }
            if (data.week == 'Y')
            {
                $('#week').prop('checked', true);
            } else {
                $('#week').prop('checked', false);
            }
            if (data.month == 'Y')
            {
                $('#month').prop('checked', true);
            } else {
                $('#month').prop('checked', false);
            }
            sync_custom_report(arrCompanies, arrSites, arrPlants, arrMachineGroups, arrMachines);
        });

  };

  function sync_custom_report(arrCompanies, arrSites, arrPlants, arrMachineGroups, arrMachines) {
        trigger_company(arrCompanies, arrSites, arrPlants, arrMachineGroups, arrMachines);
  };

  function trigger_company(arrCompanies, arrSites, arrPlants, arrMachineGroups, arrMachines) {

    $("input[name='cbx-company']").prop('checked', false);
    $('div.cbx-site').remove();
    $('div.cbx-plant').remove();
    $('div.cbx-machineGroup').remove();
    $('div.cbx-machine').remove();
    for (var n = 0; n < arrCompanies.length; n++) {
        var company = 'company-' + arrCompanies[n];
        if ($('#' + company).is(':checked')) {} else {
          $('#' + company).prop('checked', true);
          $('#' + company).trigger('change');
        }
      }
      setTimeout(function() {
        trigger_site(arrSites, arrPlants, arrMachineGroups, arrMachines);
      }, 800);

  };

  function trigger_site(arrSites, arrPlants, arrMachineGroups, arrMachines) {
      for (var n = 0; n < arrSites.length; n++) {
        var site = "site-" + arrSites[n];

        if ($('#' + site).is(':checked')) {} else {
          $('#' + site).prop('checked', true);
          $('#' + site).trigger('change');
        }
      }
      setTimeout(function() {
        trigger_plant(arrPlants, arrMachineGroups, arrMachines);
      }, 800);
  };

  function trigger_plant(arrPlants, arrMachineGroups, arrMachines) {
      for (var n = 0; n < arrPlants.length; n++) {
        var plant = "plant-" + arrPlants[n];

        if ($('#' + plant).is(':checked')) {} else {
          $('#' + plant).prop('checked', true);
          $('#' + plant).trigger('change');
        }
      }
      setTimeout(function() {
        trigger_machine_group(arrMachineGroups, arrMachines);
      }, 800);

  };


  function trigger_machine_group(arrMachineGroups, arrMachines) {
      for (var n = 0; n < arrMachineGroups.length; n++) {
        var machine_group = "machine-group-" + arrMachineGroups[n];
        if ($('#' + machine_group).is(':checked')) {} else {
          $('#' + machine_group).prop('checked', true);
          $('#' + machine_group).trigger('change');
        }
      }

      setTimeout(function() {
        trigger_machine(arrMachines);
      }, 800);

  };

  function trigger_machine(arrMachines) {
      for (var n = 0; n < arrMachines.length; n++) {
        var machine = "machine-" + arrMachines[n];

        if ($('#' + machine).is(':checked')) {} else {
          $('#' + machine).prop('checked', true);
          $('#' + machine).trigger('change');
        }
      }
      processBtnPrimary();
  };

  function setToday(){
        $today = new Date();
        $calculatedDate = new Date($today);
        var day = ("0" + $calculatedDate.getDate()).slice(-2);
        var month = ("0" + ($calculatedDate.getMonth() + 1)).slice(-2);
        var dateAux = $calculatedDate.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#endDttm').val(dateAux);
        $('#startDttm').val(dateAux);
        $( "#today" ).val('Y');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');
  }

  function setLastWeek(){
        var end = Date.today().moveToDayOfWeek(0, -1);
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#endDttm').val(dateAux);
        var start = end.add({ days: -6});
        var day = ("0" + start.getDate()).slice(-2);
        var month = ("0" + (start.getMonth() + 1)).slice(-2);
        var dateAux = start.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#startDttm').val(dateAux);
        $( "#today" ).val('N');
        $( "#lastweek" ).val('Y');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');
  }

  function setThisWeek(){
        var end = new Date();
        var start = Date.today().moveToDayOfWeek(0, -1);
        var start = start.add({ days: 1});
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#endDttm').val(dateAux);
        var day = ("0" + start.getDate()).slice(-2);
        var month = ("0" + (start.getMonth() + 1)).slice(-2);
        var dateAux = start.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#startDttm').val(dateAux);
        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('Y');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');
  }

  function setLastMonth(){
        var today = new Date();
        var n = today.getDate() * -1;
        var config = {days: n};
        var end = today.add(config);
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#endDttm').val(dateAux);
        start = end.moveToFirstDayOfMonth();
        var day = ("0" + start.getDate()).slice(-2);
        var month = ("0" + (start.getMonth() + 1)).slice(-2);
        var dateAux = start.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#startDttm').val(dateAux);
        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('Y');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');
  }

  function setThisMonth(){
        var end = new Date();
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#endDttm').val(dateAux);
        var start = end.moveToFirstDayOfMonth();
        var day = ("0" + start.getDate()).slice(-2);
        var month = ("0" + (start.getMonth() + 1)).slice(-2);
        var dateAux = start.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#startDttm').val(dateAux);
        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('Y');
        $('#end-num-days').val('');
        $('#start-num-days').val('');
  }

  function processBtnPrimary(start_date, end_date){
        /*si el OK es del menú de los widgets, tengo que insertar el html correspondiente*/
        $(".brtemp").remove();
        if (typeof start_date == 'undefined')
        {
            fecha_inicio = document.getElementById("startDttm");
            start_date = fecha_inicio.value;
        }
        if (typeof end_date == 'undefined')
        {
            fecha_fin = document.getElementById("endDttm");
            end_date = fecha_fin.value;
        }
        /*selecciono todos los inputs hidden que se insertaron con los widgets seleccionados para llamar su función correspondiente*/
        var arrayBlocks = [];
        var arrayFuncs = [];
        var widgets = document.getElementsByClassName('widget-option');
        for (var i = 0; i < widgets.length; i++) {
            widget = widgets[i].getElementsByClassName('checkbox');
            if (widget[0].checked){
                func = widgets[i].getElementsByClassName('function');
                reportId = widgets[i].getElementsByClassName('report');
                arrayBlocks.push(reportId[0].value);
                arrayFuncs.push(func[0].value);
            }
        }

        if (arrayBlocks.length > 0){
                $( ".main-template" ).remove();
            }
        procesarWidgetsBlocks(arrayBlocks, arrayBlocks.length, 0, arrayFuncs, start_date, end_date);
  }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("src", ev.target.id);
    }

    function drop(ev) {
          ev.preventDefault ();
          var src = document.getElementById (ev.dataTransfer.getData ("src"));
          var srcParent = src.parentNode;
          var tgt = ev.currentTarget.firstElementChild;

          ev.currentTarget.replaceChild (src, tgt);
          srcParent.appendChild (tgt);
    }

    function setMonthBackward(){
        var n = $('#startDttm').val();
        var anio = n.slice(0,4);
        var mes = n.slice(5,7);
        var dia = n.slice(-2);
        var date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {months: -1};
        end = date.add(config);
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#startDttm').val(dateAux);
        n = $('#endDttm').val();
        anio = n.slice(0,4);
        mes = n.slice(5,7);
        dia = n.slice(-2);
        date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {months: -1};
        end = date.add(config);
        day = ("0" + end.getDate()).slice(-2);
        month = ("0" + (end.getMonth() + 1)).slice(-2);
        dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#endDttm').val(dateAux);
        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');
    }
    function setDayBackward(){
        var n = $('#startDttm').val();
        var anio = n.slice(0,4);
        var mes = n.slice(5,7);
        var dia = n.slice(-2);
        var date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {days: -1};
        end = date.add(config);
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#startDttm').val(dateAux);
        n = $('#endDttm').val();
        anio = n.slice(0,4);
        mes = n.slice(5,7);
        dia = n.slice(-2);
        date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {days: -1};
        end = date.add(config);
        day = ("0" + end.getDate()).slice(-2);
        month = ("0" + (end.getMonth() + 1)).slice(-2);
        dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#endDttm').val(dateAux);
        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');
    }
    function setDayForward(){
        var n = $('#startDttm').val();
        var anio = n.slice(0,4);
        var mes = n.slice(5,7);
        var dia = n.slice(-2);
        var date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {days: 1};
        end = date.add(config);
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#startDttm').val(dateAux);
        n = $('#endDttm').val();
        anio = n.slice(0,4);
        mes = n.slice(5,7);
        dia = n.slice(-2);
        date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {days: 1};
        end = date.add(config);
        day = ("0" + end.getDate()).slice(-2);
        month = ("0" + (end.getMonth() + 1)).slice(-2);
        dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#endDttm').val(dateAux);
        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');
    }
    function setMonthForward(){
        var n = $('#startDttm').val();
        var anio = n.slice(0,4);
        var mes = n.slice(5,7);
        var dia = n.slice(-2);
        var date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {months: 1};
        end = date.add(config);
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#startDttm').val(dateAux);
        n = $('#endDttm').val();
        anio = n.slice(0,4);
        mes = n.slice(5,7);
        dia = n.slice(-2);
        date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {months: 1};
        end = date.add(config);
        day = ("0" + end.getDate()).slice(-2);
        month = ("0" + (end.getMonth() + 1)).slice(-2);
        dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        $('#endDttm').val(dateAux);
        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');
    }

     $( "#month-backward" ).click(function() {
        setMonthBackward();
        processBtnPrimary();
    });

    $( "#day-backward" ).click(function() {
        setDayBackward();
        processBtnPrimary();
    });

    $( "#day-forward" ).click(function() {
        setDayForward();
        processBtnPrimary();
    });

    $( "#month-forward" ).click(function() {
        setMonthForward();
        processBtnPrimary();
    });



    $('body').on('click', '.month-backward', function () {
            timeline = $(this);
            var report = timeline.closest(".content-time-line").find(".report").val();
            var funct = timeline.closest(".content-time-line").find(".function").val();
            var startdtid = timeline.closest(".row-time-line").find(".card-start-date").attr('id');
            var enddtid = timeline.closest(".row-time-line").find(".card-end-date").attr('id');
            var maintemplate = timeline.closest(".main-template");
            var dates = setMonthBackward2(timeline);
            processBtnPrimary2(dates.newstartdt, dates.newenddt, startdtid, enddtid, report, funct, maintemplate);
    });

    $('body').on('click', '.day-backward', function () {
            timeline = $(this);
            var report = timeline.closest(".content-time-line").find(".report").val();
            var funct = timeline.closest(".content-time-line").find(".function").val();
            var startdtid = timeline.closest(".row-time-line").find(".card-start-date").attr('id');
            var enddtid = timeline.closest(".row-time-line").find(".card-end-date").attr('id');
            var maintemplate = timeline.closest(".main-template");
            var dates = setDayBackward2(timeline);
            processBtnPrimary2(dates.newstartdt, dates.newenddt, startdtid, enddtid, report, funct, maintemplate);
    });

    $('body').on('click', '.day-forward', function () {
            timeline = $(this);
            var report = timeline.closest(".content-time-line").find(".report").val();
            var funct = timeline.closest(".content-time-line").find(".function").val();
            var startdtid = timeline.closest(".row-time-line").find(".card-start-date").attr('id');
            var enddtid = timeline.closest(".row-time-line").find(".card-end-date").attr('id');
            var maintemplate = timeline.closest(".main-template");
            var dates = setDayForward2(timeline);
            processBtnPrimary2(dates.newstartdt, dates.newenddt, startdtid, enddtid, report, funct, maintemplate);
    });

    $('body').on('click', '.month-forward', function () {
            timeline = $(this);
            var report = timeline.closest(".content-time-line").find(".report").val();
            var funct = timeline.closest(".content-time-line").find(".function").val();
            var startdtid = timeline.closest(".row-time-line").find(".card-start-date").attr('id');
            var enddtid = timeline.closest(".row-time-line").find(".card-end-date").attr('id');
            var maintemplate = timeline.closest(".main-template");
            var dates = setMonthForward2(timeline);
            processBtnPrimary2(dates.newstartdt, dates.newenddt, startdtid, enddtid, report, funct, maintemplate);
    });

    $('body').on('click', '.mixwidget-table-hide', function () {
            var opt = $(this);
            opt.closest(".template").find(".mixwidget-table" ).hide();
            opt.closest(".template").find(".mixwidget-canvas" ).removeClass("col-lg-12");
            opt.closest(".template").find(".mixwidget-canvas" ).removeClass("col-lg-5");
            opt.closest(".template").find(".mixwidget-canvas" ).addClass("col-lg-12");
            opt.closest(".template").find(".mixwidget-canvas" ).show();
    });

    $('body').on('click', '.mixwidget-canvas-hide', function () {
            var opt = $(this);
            opt.closest(".template").find(".mixwidget-canvas" ).hide();
            opt.closest(".template").find(".mixwidget-table" ).removeClass("col-lg-12");
            opt.closest(".template").find(".mixwidget-table" ).removeClass("col-lg-7");
            opt.closest(".template").find(".mixwidget-table" ).addClass("col-lg-12");
            opt.closest(".template").find(".mixwidget-table" ).show();
    });

    $('body').on('click', '.mixwidget-show', function () {
            var opt = $(this);
            opt.closest(".template").find(".mixwidget-canvas" ).show();
            opt.closest(".template").find(".mixwidget-table" ).show();
            ajustarTamanoWidgets();
    });

    $('body').on('click', '.columns', function () {
            $(".per").hide();
    });

    function processBtnPrimary2(start_date, end_date, id_start_date, id_end_date, report_block, report_func, maintemplate){
        /*si el OK es del menú de los widgets, tengo que insertar el html correspondiente*/
        /*selecciono todos los inputs hidden que se insertaron con los widgets seleccionados para llamar su función correspondiente*/
        $(".brtemp").remove();
        var arrayBlocks = [];
        var arrayFuncs = [];
        arrayBlocks.push(report_block);
        arrayFuncs.push(report_func);
        var widgets = document.getElementsByClassName('widget-option');
        procesarWidgetsBlocks(arrayBlocks, arrayBlocks.length, 0, arrayFuncs, start_date, end_date, id_start_date, id_end_date, maintemplate);
  }

        function setMonthBackward2(object)
        {
            var startdt = object.closest(".row-time-line").find(".card-start-date").html();
            var enddt = object.closest(".row-time-line").find(".card-end-date").html();
            var temp = object.closest(".template");

            var n = startdt.trim();
            var anio = n.slice(0,4);
            var mes = n.slice(5,7);
            var dia = n.slice(-2);
            var date = new Date(Number(anio),Number(mes)-1,Number(dia))
            config = {months: -1};
            end = date.add(config);
            var day = ("0" + end.getDate()).slice(-2);
            var month = ("0" + (end.getMonth() + 1)).slice(-2);
            var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
            var newstartdt = dateAux;
            //$('#startDttm').val(dateAux);

            n = enddt.trim();
            anio = n.slice(0,4);
            mes = n.slice(5,7);
            dia = n.slice(-2);
            date = new Date(Number(anio),Number(mes)-1,Number(dia))
            config = {months: -1};
            end = date.add(config);
            day = ("0" + end.getDate()).slice(-2);
            month = ("0" + (end.getMonth() + 1)).slice(-2);
            dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
            var newenddt = dateAux;
            //$('#endDttm').val(dateAux);

            temp.remove();

            $( "#today" ).val('N');
            $( "#lastweek" ).val('N');
            $( "#thisweek" ).val('N');
            $( "#lastmonth" ).val('N');
            $( "#thismonth" ).val('N');
            $( '#end-num-days').val('');
            $( '#start-num-days').val('');

            return {newstartdt:newstartdt, newenddt:newenddt}
          }

      function setDayBackward2(object){
        var startdt = object.closest(".row-time-line").find(".card-start-date").html();
        var enddt = object.closest(".row-time-line").find(".card-end-date").html();
        var temp = object.closest(".template");

        var n = startdt.trim();
        var anio = n.slice(0,4);
        var mes = n.slice(5,7);
        var dia = n.slice(-2);
        var date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {days: -1};
        end = date.add(config);
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        var newstartdt = dateAux;
        //$('#startDttm').val(dateAux);

        n = enddt.trim();
        anio = n.slice(0,4);
        mes = n.slice(5,7);
        dia = n.slice(-2);
        date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {days: -1};
        end = date.add(config);
        day = ("0" + end.getDate()).slice(-2);
        month = ("0" + (end.getMonth() + 1)).slice(-2);
        dateAux = end.getFullYear()+"-"+(month)+"-"+(day);
        var newenddt = dateAux;
        //$('#endDttm').val(dateAux);

        temp.remove();

        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');

        return {newstartdt:newstartdt, newenddt:newenddt}
    }


    function setDayForward2(object){
        var startdt = object.closest(".row-time-line").find(".card-start-date").html();
        var enddt = object.closest(".row-time-line").find(".card-end-date").html();
        var temp = object.closest(".template");

        var n = startdt.trim();
        var anio = n.slice(0,4);
        var mes = n.slice(5,7);
        var dia = n.slice(-2);
        var date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {days: 1};
        end = date.add(config);
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        var newstartdt = dateAux;
        //$('#startDttm').val(dateAux);

        n = enddt.trim();
        anio = n.slice(0,4);
        mes = n.slice(5,7);
        dia = n.slice(-2);
        date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {days: 1};
        end = date.add(config);
        day = ("0" + end.getDate()).slice(-2);
        month = ("0" + (end.getMonth() + 1)).slice(-2);
        dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        var newenddt = dateAux;
        //$('#endDttm').val(dateAux);

        temp.remove();

        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');

        return {newstartdt:newstartdt, newenddt:newenddt}
    }


    function setMonthForward2(object){
        var startdt = object.closest(".row-time-line").find(".card-start-date").html();
        var enddt = object.closest(".row-time-line").find(".card-end-date").html();
        var temp = object.closest(".template");

        var n = startdt.trim();
        var anio = n.slice(0,4);
        var mes = n.slice(5,7);
        var dia = n.slice(-2);
        var date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {months: 1};
        end = date.add(config);
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        var dateAux = end.getFullYear()+"-"+(month)+"-"+(day) ;
        var newstartdt = dateAux;
        //$('#startDttm').val(dateAux);

        n = enddt.trim();
        anio = n.slice(0,4);
        mes = n.slice(5,7);
        dia = n.slice(-2);
        date = new Date(Number(anio),Number(mes)-1,Number(dia))
        config = {months: 1};
        end = date.add(config);
        day = ("0" + end.getDate()).slice(-2);
        month = ("0" + (end.getMonth() + 1)).slice(-2);
        dateAux = end.getFullYear()+"-"+(month)+"-"+(day);
        var newenddt = dateAux;
        //$('#endDttm').val(dateAux);

        temp.remove();

        $( "#today" ).val('N');
        $( "#lastweek" ).val('N');
        $( "#thisweek" ).val('N');
        $( "#lastmonth" ).val('N');
        $( "#thismonth" ).val('N');
        $('#end-num-days').val('');
        $('#start-num-days').val('');

        return {newstartdt:newstartdt, newenddt:newenddt}
    }



     $('body').on('click', '#tight-fit', function () {
        $(".gauge-div").removeClass("col-lg-12");
        $(".gauge-div").removeClass("col-lg-6");
        $(".gauge-div").removeClass("col-lg-4");
        $(".gauge-div").addClass("col-lg-4");
    });

    $('body').on('click', '#loose-fit', function () {
        $(".gauge-div").removeClass("col-lg-12");
        $(".gauge-div").removeClass("col-lg-6");
        $(".gauge-div").removeClass("col-lg-4");
        $(".gauge-div").addClass("col-lg-6");
    });

    $('body').on('click', '#full-fit', function () {
        $(".gauge-div").removeClass("col-lg-12");
        $(".gauge-div").removeClass("col-lg-6");
        $(".gauge-div").removeClass("col-lg-4");
        $(".gauge-div").addClass("col-lg-12");
    });



    /*con esta función capturo el ok de los filtros para actualizar las gráficas*/
    $( ".btn-primary" ).click(function() {
        processBtnPrimary();
     });

    $( "#today" ).click(function() {
        setToday();
    });

    $( "#lastweek" ).click(function() {
        setLastWeek();
    });

    $( "#thisweek" ).click(function() {
        setThisWeek();
    });

    $( "#lastmonth" ).click(function() {
        setLastMonth();
    });

    $( "#thismonth" ).click(function() {
        setThisMonth();
    });

    $('body').on('click', '.toggle-vis-col', function (e) {
        //e.preventDefault();
        var tableName = $(this).attr('table-name')
        var table;
        for (var i=0; i < tableNameControl.length; i++){
            if (tableName == tableNameControl[i]){
                table = tableControl[i];
                // Get the column API object
                var column = table.column( $(this).attr('data-column') );
                if(this.checked) {
                    // Toggle the visibility
                    column.visible( true);
                }else{
                    column.visible( false);
                }
            }
        }
    });



  $(document).ready(
    function() {

        $(".main-container.collapse").on('shown.bs.collapse', function () {
           $(".main-container.collapse").not($(this)).collapse('hide');
        });

        widgets = document.getElementsByClassName('widget-option');
        for (var i = 0; i < widgets.length; i++) {
            widget = widgets[i].getElementsByClassName('widget');
            text = widgets[i].getElementsByClassName('tooltip-text');
            icon = widgets[i].getElementsByClassName('tooltip-icon');
            var content = "<table class='tooltip-icon'><tr><th><img src='/" + icon[0].value + "'/></th><th>" + text[0].value +"</th></tr></table>";
            labelClass = $("label[for='"+widget[0].id+"']").attr("class");
            $("label[for='"+widget[0].id+"']").tooltip({title: content, html: true, placement: "right"});
        }

        var reportId = $('#query-id').val();
        if (reportId != 'none'){
            $("option[name='" + reportId +"']").prop('selected', true);
            sync_user_custom_report();
        }

        $('#end-num-days').change(function(e) {
            $today = new Date();
            $calculatedDate = new Date($today);
            $calculatedDate.setDate($today.getDate() - $('#end-num-days').val());
            var day = ("0" + $calculatedDate.getDate()).slice(-2);
            var month = ("0" + ($calculatedDate.getMonth() + 1)).slice(-2);
            var dateAux = $calculatedDate.getFullYear()+"-"+(month)+"-"+(day) ;
            $('#endDttm').val(dateAux);
            $( "#today" ).val('N');
            $( "#lastweek" ).val('N');
            $( "#thisweek" ).val('N');
            $( "#lastmonth" ).val('N');
            $( "#thismonth" ).val('N');
        });

        $('#start-num-days').change(function(e) {
            $today = new Date();
            $calculatedDate = new Date($today);
            $calculatedDate.setDate($today.getDate() - $('#start-num-days').val());
            var day = ("0" + $calculatedDate.getDate()).slice(-2);
            var month = ("0" + ($calculatedDate.getMonth() + 1)).slice(-2);
            var dateAux = $calculatedDate.getFullYear()+"-"+(month)+"-"+(day) ;
            $('#startDttm').val(dateAux);
            $( "#today" ).val('N');
            $( "#lastweek" ).val('N');
            $( "#thisweek" ).val('N');
            $( "#lastmonth" ).val('N');
            $( "#thismonth" ).val('N');
        });

        $('#startDttm').change(function(e) {
            $( "#today" ).val('N');
            $( "#lastweek" ).val('N');
            $( "#thisweek" ).val('N');
            $( "#lastmonth" ).val('N');
            $( "#thismonth" ).val('N');
        });

        $('#endDttm').change(function(e) {
            $( "#today" ).val('N');
            $( "#lastweek" ).val('N');
            $( "#thisweek" ).val('N');
            $( "#lastmonth" ).val('N');
            $( "#thismonth" ).val('N');
        });

      /* Company is selected */
      $("input[name='cbx-company']").change(function() {
        var parentClass = $(this).val();
        if ($(this).is(':checked')) {
          var company_id = $(this).val();
          var url = "/iot/webmonitor/filters/company/" + company_id + "/sites/";

          $.getJSON(url, function(sites) {
            var options = '';
            for (var i = 0; i < sites.length; i++) {
              options += '<div class="checkbox checkbox-info checkbox-circle cbx-site" name="' + parentClass + '">';
              options += '<input type="checkbox" id="site-' + sites[i].fields['siteId'] + '" value="' + sites[i].fields['siteId'] + '" name="cbx-site" class="' + company_id + '.' + sites[i].fields['siteId'] + '"/>';
              options += '<label for="site-' + sites[i].fields['siteId'] + '" class = "' + company_id + '.' + sites[i].fields['siteId'] + '">' + sites[i].fields['siteDescr'] + '</label>';
              options += '</div>';
            }
            $("#site").append(options);
            //$("select#site option:first").attr('selected', 'selected');
            //$("select#site").attr('disabled', false);
          });
        } else {
          $('div[name="' + parentClass + '"]').remove();
        }
      });

      /* Site is selected */
      $("#site").on("change", "input[type=checkbox]", function() {
        var parentClass = $(this).attr("class");
        if ($(this).is(':checked')) {
          var site_id = $(this).val();
          var index = parentClass.split(".");
          var url = "/iot/webmonitor/filters/site/" + index[0] + "/" + index[1] + "/plants/";
          $.getJSON(url, function(plants) {
            var options = '';
            for (var i = 0; i < plants.length; i++) {
              options += '<div class="checkbox checkbox-info checkbox-circle cbx-plant" name="' + parentClass + '">';
              options += '<input type="checkbox" id="plant-' + plants[i]['plantId'] + '" value="' + plants[i]['plantId'] + '" name="cbx-plant" class="' + parentClass + '.' + plants[i]['plantId'] + '">';
              options += '<label for="plant-' + plants[i]['plantId'] + '" class = "' + classAttribute + '.' + plants[i]['plantId'] + '">' + plants[i]['plantDescr'] + '</label>';
              classAttribute = classAttribute + '.' + plants[i]['plantId'];
              options += '</div>';
            }
            $("#plant").append(options);
            //$("select#site option:first").attr('selected', 'selected');
            //$("select#site").attr('disabled', false);
          });
        } else {
          $('div[name="' + parentClass + '"]').remove();
        }
      });

      /* Plant is selected */
      $("#plant").on("change", "input[type=checkbox]", function() {
        var parentClass = $(this).attr("class");
        if ($(this).is(':checked')) {
          var plant_id = $(this).val();
          var index = $(this).attr("class").split(".");
          var url = "/iot/webmonitor/filters/plant/" + index[0] + "/" + index[1] + "/" + index[2] + "/machine_groups/";

          $.getJSON(url, function(machine_groups) {
            var options = '';
            for (var i = 0; i < machine_groups.length; i++) {
              options += '<div class="checkbox checkbox-info checkbox-circle cbx-machineGroup" name="' + parentClass + '">';
              options += '<input type="checkbox" id="machine-group-' + machine_groups[i]['machineGroupId'] + '" value="' + machine_groups[i]['machineGroupId'] + '" name="cbx-machine-group" class="' + parentClass + '.' +
                machine_groups[i]['machineGroupId'] + '">';
              options += '<label for="machine-group-' + machine_groups[i]['machineGroupId'] + '" class = "' + classAttribute + '.' + machine_groups[i]['machineGroupId'] + '">' + machine_groups[i]['machineGroupDescr'] +
                '</label>';
              classAttribute = classAttribute + '.' + machine_groups[i]['machineGroupId'];
              options += '</div>';
            }
            $("#machine-group").append(options);
            //$("select#plant option:first").attr('selected', 'selected');
            //$("select#plant").attr('disabled', false);
          });
        } else {
          $('div[name="' + parentClass + '"]').remove();
        }
      });

      /* machine group is selected */
      $("#machine-group").on("change", "input[type=checkbox]", function() {
        var parentClass = $(this).attr("class");
        if ($(this).is(':checked')) {
          var machine_group_id = $(this).val();
          var index = $(this).attr("class").split(".");
          var url = "/iot/webmonitor/filters/machine-group/" + index[0] + "/" + index[1] + "/" + index[2] + "/" + index[3] + "/machines/";

          $.getJSON(url, function(machines) {
            var options = '';
            for (var i = 0; i < machines.length; i++) {
              options += '<div class="checkbox checkbox-info checkbox-circle cbx-machine ' + machine_group_id + '" name="' + parentClass + '">';
              options += '<input type="checkbox" name = "machine" id="machine-' + machines[i]['machineId'] + '" value="' + machines[i]['machineId'] + '" name="cbx-machine" class="' + parentClass + '.' + machines[i]['machineId'] + '">';
              options += '<label for="machine-' + machines[i]['machineId'] + '" class = "' + classAttribute + '.' + machines[i]['machineId'] + '">' + machines[i]['machineDescr'] + '</label>';

              options += '</div>';
            }
            $("#machine").append(options);
            //$("select#machine option:first").attr('selected', 'selected');
            //$("select#machine").attr('disabled', false);
          });
        } else {
          $('div[name="' + parentClass + '"]').remove();
        }
      });

      /* machine selected */
      $("#machine").on("change", "input[type=checkbox]", function() {
        if ($(this).is(':checked')) {
        } else {

        }
      });
    });