
  function monitorModeMachineStatus()
  {
      setInterval(graficarMachineStatus, 10000)
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


    function graficarMaquinaMachineStatus(arrayMaq, arrayLen, actualPos, startDttm, endDttm)
    {
            var endpoint = '';
            var dates = [];
            var status = [];
            var myMainDiv = document.getElementById('machine-panel');
            var $exampleCont = $('.font-awesome-spinner-example');
            var $hideLoadingBtn =$exampleCont.find('.show-loading');
            var $panel = $exampleCont.find('.panel');

            array = arrayMaq[actualPos].split(".");
            CompanyId = array[0];
            LocationId = array[1];
            PlantId = array[2];
            MachineGroupId = array[3];
            MachineId = array[4];
            var ih3 = document.createElement('h3');
            ih3.innerHTML = MachineId;
            myMainDiv.appendChild(ih3);
            var iDiv = document.createElement('div');
            iDiv.id = MachineId;
            myMainDiv.appendChild(iDiv);
            endpoint = '';
            endpoint = 'http://172.35.5.118:8000/restapi/Request/MachineStatusFOGRequest';
            endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;
            var jqxhr = $.getJSON(endpoint, function() {});

            jqxhr.done(function(data) {
                dates = data.dates
                dates.unshift('Fechas');
                status = data.status
                status.unshift('Estado');

                var chart1 = c3.generate({
                bindto: '#'+MachineId,
                data: {
                    x: 'Fechas',
                    xFormat: '%Y-%m-%d %H:%M:%S',
                    columns: [
                        dates,
                        status,
                    ],
                    types: {
                        //data3: 'spline',
                        //data4: 'line',
                        Estado: 'area',
                    },
                    colors: {
                        Estado: '157F1F'
                    },
                },
                point: {
                    show: false
                },
                legend: {
                  position:'inset',
                  inset: {
                      anchor: 'top-right',
                      x: 20
                  }
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d %H:%M:%S',
                            rotate: 45,
                            multiline: false
                        },
                        show:false
                    },
                    y: {
                      show: false
                    }
                },
                size: {
                  height: 100
                },
                });


                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaMachineStatus(arrayMaq, arrayLen, actualPos + 1, startDttm, endDttm);
                }
                else
                {
                    $panel.ploading({action: 'hide'});

                }

            });


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

    function graficarMachineStatus()
    {
        $('.template').show();
        initSpinner();
        var $exampleCont = $('.font-awesome-spinner-example');
        var $panel = $exampleCont.find('.panel');
        var arrayReq = getParamRequest();
        startDt = document.getElementById("startDttm");
        endDt = document.getElementById("endDttm");

        fechaInicio = startDt.value;
        fechaFin = endDt.value;

         $panel.ploading
                        (
                            {
                                action: 'show',
                                spinnerHTML: '<i></i>',
                                spinnerClass: 'fa fa-spinner fa-spin p-loading-fontawesome'
                            }
                        );

        cleanHTMLPanel('machine-panel');
        graficarMaquinaMachineStatus(arrayReq, arrayReq.length, 0 , fechaInicio, fechaFin);


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

  function graficarDownTimeReasons()
  {
     $('.template').show();
     initSpinner();
     var $exampleCont = $('.font-awesome-spinner-example');
     var $panel = $exampleCont.find('.panel');

     $panel.ploading
                        (
                            {
                                action: 'show',
                                spinnerHTML: '<i></i>',
                                spinnerClass: 'fa fa-spinner fa-spin p-loading-fontawesome'
                            }
                        );

     cleanHTMLTable('tbl-body');
     extractParamRequestDownTimeReasons();
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


        array = arrayMaq[actualPos].split(".");
        CompanyId = array[0];
        LocationId = array[1];
        PlantId = array[2];
        MachineGroupId = array[3];
        MachineId = array[4];
        endpoint = 'http://172.35.5.118:8000/restapi/Request/DownTimeReasonsRequestFOG';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {

            labels = data.labels
              ocurrences = data.ocurrences
              duration = data.duration

              for(var j = 0; j<labels.length; j++)
              {
                 existe = 0;
                 k = 0;
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
                     t3 = document.createTextNode(durationConsol[h]);
                     t4 = document.createTextNode(avDurationConsol[h].toFixed(4));
                     t5 = document.createTextNode(perConsol[h].toFixed(4));

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

                             $(document).ready(function() {
                             $('#tbl-dtr').DataTable( {
                             dom: 'Bfrtip',
                             buttons: [
                                        'copy', 'csv', 'excel', 'pdf', 'print'
                                        ]
                                    } );
                             } );
                 }
                 $panel.ploading({action: 'hide'});
              }
           });
  }

  function extractParamRequestDownTimeReasons()
  {
     var arrayReq = getParamRequest();

     var labelConsol = [];
     var avDurationConsol = [];
     var durationConsol = [];
     var ocurrencesConsol = [];
     var perConsol = [];
     var ocurrencesTotal = 0, durationTotal = 0;

     startDt = document.getElementsByName("startDttm");
     endDt = document.getElementsByName("endDttm");

     fechaInicio = startDt[0].value;
     fechaFin = endDt[0].value;

     graficarMaquinaDownTimeReasons(arrayReq, arrayReq.length, 0, fechaInicio, fechaFin, labelConsol, avDurationConsol, durationConsol, ocurrencesConsol, perConsol, ocurrencesTotal, durationTotal)
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

        array = arrayMaq[actualPos].split(".");
        CompanyId = array[0];
        LocationId = array[1];
        PlantId = array[2];
        MachineGroupId = array[3];
        MachineId = array[4];

        var row, h1, h2, h3, h4, h5, t1, t2, t3, t4, t5;
        endpoint = 'http://172.35.5.118:8000/restapi/Request/ProductionMachineRollupRequestFOG';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {
                dates = data.dates1
                valuesPer = data.valuePer
                valuesAval = data.valueAva
                valuesOee = data.valueOee
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

                avgValue = 0;
                for(var j = 0; j < dates.length; j++)
                {
                    avgValue = avgValue + valuesAval[j];
                }
                if (valuesAval.length > 0)
                {
                    avgValueAval = avgValue / valuesAval.length;
                }

                t3 = document.createTextNode(avgValueAval.toFixed(4));
                avgValue = 0;
                for(var j = 0; j < dates.length; j++)
                {
                    avgValue = avgValue + valuesPer[j];
                }
                if (valuesPer.length > 0)
                {
                    avgValuePer = avgValue / valuesPer.length;
                }
                t4 = document.createTextNode(avgValuePer.toFixed(4));
                avgValue = 0;
                for(var j = 0; j < dates.length; j++)
                {
                    avgValue = avgValue + valuesOee[j];
                }
                if (valuesOee.length > 0)
                {
                    avgValueOEE = avgValue / valuesOee.length;
                }
                t5 = document.createTextNode(avgValueOEE.toFixed(4));
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
                         t3p = document.createTextNode((avalConsol[h] / machineCounter[h]).toFixed(4));
                         t4p = document.createTextNode((perConsol[h] / machineCounter[h]).toFixed(4));
                         t5p = document.createTextNode((oeeConsol[h] / machineCounter[h]).toFixed(4));
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


                         $(document).ready(function() {
                         $('#area-table').DataTable( {
                         dom: 'Bfrtip',
                         buttons: [
                                    'copy', 'csv', 'excel', 'pdf', 'print'
                                    ]
                                } );
                         } );

                         $(document).ready(function() {
                         $('#machine-table').DataTable( {
                         dom: 'Bfrtip',
                         buttons: [
                                    'copy', 'csv', 'excel', 'pdf', 'print'
                                    ]
                                } );
                         } );

                         $panel.ploading({action: 'hide'});
                }

        });
  }

    function graficarProductionRollup()
    {
         var arrayReq = getParamRequest();

         var fechaInicio, fechaFin;
         var plantConsol = [];
         var machineCounter = [];
         var avalConsol = [];
         var perConsol = [];
         var oeeConsol = [];
         var index;
         $('.template').show();
         initSpinner();
         var $exampleCont = $('.font-awesome-spinner-example');
         var $panel = $exampleCont.find('.panel');

         $panel.ploading
                        (
                            {
                                action: 'show',
                                spinnerHTML: '<i></i>',
                                spinnerClass: 'fa fa-spinner fa-spin p-loading-fontawesome'
                            }
                        );

         cleanHTMLTable('tbl-prdn-machine');
         cleanHTMLTable('tbl-prdn-area');

        startDt = document.getElementsByName("startDttm");
        endDt = document.getElementsByName("endDttm");

        fechaInicio = startDt[0].value;
        fechaFin = endDt[0].value;

        graficarMaquinaProductionRollup(arrayReq, arrayReq.length, 0, fechaInicio, fechaFin, plantConsol, avalConsol, perConsol, oeeConsol, machineCounter);

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

        array = arrayMaq[actualPos].split(".");
        CompanyId = array[0];
        LocationId = array[1];
        PlantId = array[2];
        MachineGroupId = array[3];
        MachineId = array[4];
        endpoint = 'http://172.35.5.118:8000/restapi/Request/StatusRollup';
        endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm;

        var jqxhr = $.getJSON(endpoint, function() {});

        jqxhr.done(function(data) {

              labels = data.labels
              durations = data.durations

              for(var j = 0; j<labels.length; j++)
              {
                 existe = 0;
                 k = 0;

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
                         t2 = document.createTextNode(durationsConsol[h].toFixed(4));
                         t3 = document.createTextNode(percentageConsol[h].toFixed(4));

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
                     t2 = document.createTextNode(durationsTot.toFixed(4));
                     t3 = document.createTextNode(100);

                     h1.appendChild(t1);
                     h2.appendChild(t2);
                     h3.appendChild(t3);

                     row.appendChild(h1);
                     row.appendChild(h2);
                     row.appendChild(h3);

                     myTableBody.appendChild(row);

                     $(document).ready(function() {
                     $('#tbl-machineStatus').DataTable( {
                     dom: 'Bfrtip',
                     buttons: [
                                    'copy', 'csv', 'excel', 'pdf', 'print'
                                    ]
                                } );
                     } );
                     $panel.ploading({action: 'hide'});
              }

        });
   }


function graficarStatusRollup()
  {
     var arrayReq = getParamRequest();
     var fechaInicio, fechaFin;

     var durationsTot = 0;
     var labelsConsol = [];
     var durationsConsol = [];
     var percentageConsol = [];
     var $exampleCont = $('.font-awesome-spinner-example');
     var $panel = $exampleCont.find('.panel');
     $('.template').show();
     initSpinner();
         $panel.ploading
                        (
                            {
                                action: 'show',
                                spinnerHTML: '<i></i>',
                                spinnerClass: 'fa fa-spinner fa-spin p-loading-fontawesome'
                            }
                        );

     cleanHTMLTable('tbl-body-machineStatus');

     startDt = document.getElementsByName("startDttm");
     endDt = document.getElementsByName("endDttm");

     fechaInicio = startDt[0].value;
     fechaFin = endDt[0].value;

     graficarMaquinaStatusRollup(arrayReq, arrayReq.length, 0, fechaInicio, fechaFin, durationsTot, labelsConsol, durationsConsol, percentageConsol);

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

    function graficarMaquinaVariableTrend(chart, arrayReq, arrayVar, arrayLen, actualPos, startDttm, endDttm, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray, maxLen)
    {
        var currentVar = arrayVar[actualPos]
        var endpoint = '';
        var $exampleCont = $('.font-awesome-spinner-example');
        var $hideLoadingBtn =$exampleCont.find('.show-loading');
        var $panel = $exampleCont.find('.panel');

        //esta grafica solo se aplica sobre una sola máquina, por ahora se toma la primer máquina seleccionada;
        array = arrayReq[0].split(".");
        CompanyId = array[0];
        LocationId = array[1];
        PlantId = array[2];
        MachineGroupId = array[3];
        MachineId = array[4];

        if (currentVar == 'OEE' || currentVar == 'Availability' || currentVar == 'Performance')
        {
            if (OEEFlag == 'Y')
            {
                if (currentVar == 'OEE')
                {
                    chart.load({
                        columns: [
                            oeeArray
                       ]
                    });
                    if (oeeArray.length > maxLen)
                    {
                        maxLen = oeeArray.length;
                    }
                    arrayConsol = arrayConsol.concat(oeeArray);
                }
                if (currentVar == 'Performance')
                {
                    chart.load({
                        columns: [
                            perArray
                        ]
                    });
                    if (perArray.length > maxLen)
                    {
                        maxLen = perArray.length;
                    }
                    arrayConsol = arrayConsol.concat(perArray);
                }
                if (currentVar == 'Availability')
                {
                    chart.load({
                        columns: [
                            avalArray
                        ]
                    });
                    if (avalArray.length > maxLen)
                    {
                        maxLen = avalArray.length;
                    }
                    arrayConsol = arrayConsol.concat(avalArray);
                }

                if (actualPos < arrayLen - 1)
                {
                    graficarMaquinaVariableTrend(chart, arrayReq, arrayVar, arrayLen, actualPos + 1, startDttm, endDttm, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray, maxLen);
                }
                else
                {

                    if (minFlg == 'Y')
                    {
                        graficarMin(chart, arrayConsol, maxLen)
                    }
                    if (maxFlg == 'Y')
                    {
                        graficarMax(chart, arrayConsol, maxLen)
                    }
                    if (avgFlg == 'Y')
                    {
                        graficarAvg(chart, arrayConsol, maxLen)
                    }
                    if (trendFlg == 'Y')
                    {
                        graficarTrend(chart, arrayConsol, maxLen)
                    }
                    $panel.ploading({action: 'hide'});
                }
            }
            else
            {
                endpoint = 'http://172.35.5.118:8000/restapi/Request/ProductionMachineRollupRequestFOG';
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
                        values.unshift('OEE');
                        chart.load({
                            columns: [
                                values
                            ]
                        });
                        if (valuesOee.length > maxLen)
                        {
                            maxLen = valuesOee.length;
                        }
                        arrayConsol = arrayConsol.concat(valuesOee);
                    }
                    if (currentVar == 'Performance')
                    {
                        values = valuesPer.slice();
                        values.unshift('Performance');
                        chart.load({
                            columns: [
                                values
                            ]
                        });
                        if (valuesPer.length > maxLen)
                        {
                            maxLen = valuesPer.length;
                        }
                        arrayConsol = arrayConsol.concat(valuesPer);
                    }
                    if (currentVar == 'Availability')
                    {
                        values = valuesAval.slice();
                        values.unshift('Availability')
                        chart.load({
                            columns: [
                                values
                            ]
                        });
                        if (valuesAval.length > maxLen)
                        {
                            maxLen = valuesAval.length;
                        }
                        arrayConsol = arrayConsol.concat(valuesAval);
                    }

                    if (actualPos < arrayLen - 1)
                    {
                        graficarMaquinaVariableTrend(chart, arrayReq, arrayVar, arrayLen, actualPos + 1, startDttm, endDttm, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray);
                    }
                    else
                    {

                        if (minFlg == 'Y')
                        {
                            graficarMin(chart, arrayConsol, maxLen)
                        }
                        if (maxFlg == 'Y')
                        {
                            graficarMax(chart, arrayConsol, maxLen)
                        }
                        if (avgFlg == 'Y')
                        {
                            graficarAvg(chart, arrayConsol, maxLen)
                        }
                        if (trendFlg == 'Y')
                        {
                            graficarTrend(chart, arrayConsol, maxLen)
                        }
                        $panel.ploading({action: 'hide'});
                    }

                });
            }
        }
        else
        {
            endpoint = 'http://172.35.5.118:8000/restapi/Request/VariableTrendFOGRequest';
            endpoint = endpoint + '?company='+CompanyId+'&location='+LocationId+'&plant='+PlantId+'&machineGroup='+MachineGroupId+'&machineId='+MachineId+'&startDttm='+startDttm+'&endDttm='+endDttm+'&variable='+currentVar;
            var jqxhr = $.getJSON(endpoint, function() {});
            jqxhr.done(function(data) {
                values = data.variable
                valuesVar = values.slice();;
                valuesVar.unshift('currentVar');
                chart.load({
                    columns: [
                        valuesVar
                    ]
                });
                if (values.length > maxLen)
                {
                    maxLen = values.length;
                }
                arrayConsol = arrayConsol.concat(values);
                    if (actualPos < arrayLen - 1)
                    {
                        graficarMaquinaVariableTrend(chart, arrayReq, arrayVar, arrayLen, actualPos + 1, startDttm, endDttm, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray);
                    }
                    else
                    {

                        if (minFlg == 'Y')
                        {
                            graficarMin(chart, arrayConsol, maxLen)
                        }
                        if (maxFlg == 'Y')
                        {
                            graficarMax(chart, arrayConsol, maxLen)
                        }
                        if (avgFlg == 'Y')
                        {
                            graficarAvg(chart, arrayConsol, maxLen)
                        }
                        if (trendFlg == 'Y')
                        {
                            graficarTrend(chart, arrayConsol, maxLen)
                        }
                        $panel.ploading({action: 'hide'});
                    }
            });
        }
    }

    function graficarVariableTrend()
    {
        var arrayReq = getParamRequest();
        var arrayVar = getVariables();
        var endpoint = '';
        $('.template').show();
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

         $panel.ploading
                        (
                            {
                                action: 'show',
                                spinnerHTML: '<i></i>',
                                spinnerClass: 'fa fa-spinner fa-spin p-loading-fontawesome'
                            }
                        );

        startDt = document.getElementById("startDttm");
        endDt = document.getElementById("endDttm");

        fechaInicio = startDt.value;
        fechaFin = endDt.value;

        var chart = c3.generate({
        data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                ]
              }
        });
        chart.unload({
            ids: 'data1'
        });
        graficarMaquinaVariableTrend(chart, arrayReq, arrayVar, arrayVar.length, 0, fechaInicio, fechaFin, minFlg, maxFlg, avgFlg, trendFlg, arrayConsol, OEEFlag, oeeArray, avalArray, perArray, 0);
    }

    function graficarMin(chart, arrayConsol, maxLen)
    {
        var i = 0;
        var min = 100000000;
        var data = [];
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
        data.unshift('Min');
        chart.load({
                        columns: [
                            data
                        ]
                    });
    }

    function graficarMax(chart, arrayConsol, maxLen)
    {
        var i = 0;
        var max = 0;
        var data = [];
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
        data.unshift('Max');
        chart.load({
                        columns: [
                            data
                        ]
                    });
    }

    function graficarAvg(chart, arrayConsol, maxLen)
    {
        var i = 0;
        var avg;
        var data = [];
        var sum = arrayConsol.reduce(function(a, b) { return a + b; });
        var avg = sum / arrayConsol.length;

        for (i = 0; i < maxLen; i++)
        {
            data.push(avg);
        }
        data.unshift('Avg');
        chart.load({
                        columns: [
                            data
                        ]
                    });
    }


    function graficarTrend(chart, arrayConsol, maxLen)
    {
        var xArray = [];
        var data = [];
        var x2 = 0;
        var y = 0;
        var x = 0;
        var xy = 0;
        var b = 0;
        var a = 0;
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

        data.unshift('Trend');
        chart.load({
                        columns: [
                            data
                        ]
                    });
    }

    function initFilters(){
        var path = window.location.pathname;
        var page = path.split("/");
        alert(page);
        if (page == 'machine-status'){
            $('.multiple').hide();
        }
    }

    function graficarDashboard(){
        graficarMachineStatus();
        graficarDownTimeReasons();
        graficarProductionRollup();
        graficarVariableTrend();
        graficarStatusRollup();
    }

