var myGetRandomColor1 = function () {
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
};

var myGetRandomColor2 = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
};
var myColorIterator = function(count) {
        var data =[];
        for (var i = 0; i < count; i++) {
            data.push(myGetRandomColor2());
        }
        return data;
};
//////PIE SAMPLE//////////
var data_pie = {
    labels: [
        "Red",
        "Blue",
        "Yellow"
    ],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
};

// For a pie chart
var ctx_pie = document.getElementById('chartjs_pie').getContext('2d');
var my_pie_chart = new Chart(ctx_pie, {
    type: 'pie',
    data: data_pie
});
////////////LINE SAMPLE////////////
var data_line = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        }
    ]
};

var ctx_line = document.getElementById('chartjs_line').getContext('2d');
var my_line_chart = new Chart(ctx_line, {
    type: 'line',
    data: data_line
});

//////////// HORIZONTAL BAR ///////////////
var ctx_horizontalbar = document.getElementById("chartjs_horizontalbar").getContext('2d');
var my_horizontalbar_chart = new Chart(ctx_horizontalbar, {
  type: 'horizontalBar',
  data: {
    labels: ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Reason 5", "Reason 6", "Reason 7"],
    datasets: [{
      label: 'option 1',
      data: [100, 20, 30, 70, 5, 5, 25],
      backgroundColor: myColorIterator(7),
      //hoverBackgroundColor: myColorIterator(7)
    }
  ]}
});

///////////// POLAR //////////////////////
var data_polar = {
    datasets: [{
        data: [
            11,
            16,
            7,
            3,
            14
        ],
        backgroundColor: [
            "#FF6384",
            "#4BC0C0",
            "#FFCE56",
            "#E7E9ED",
            "#36A2EB"
        ],
        label: 'My dataset'
    }],
    labels: [
        "Red",
        "Green",
        "Yellow",
        "Grey",
        "Blue"
    ]
};
var ctx_polar = document.getElementById('chartjs_polar').getContext('2d');
var polar_chart = new Chart(ctx_polar, {
    data: data_polar,
    type: 'polarArea'
});
////////////////// RADAR /////////////////////
var data_radar = {
    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [
        {
            label: "My First dataset",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
};
var ctx_radar = document.getElementById('chartjs_radar').getContext('2d');
var radar_chart = new Chart(ctx_radar, {
    type: 'radar',
    data: data_radar
});

////////////////// BAR ///////////////////////////
var data_bar = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
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
            data: [65, 59, 80, 81, 56, 55, 40],
        }
    ]
};
var ctx_bar = document.getElementById('chartjs_bar').getContext('2d');
var bar_chart = new Chart(ctx_bar, {
    type: 'bar',
    data: data_bar
});
