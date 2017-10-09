var chart1 = c3.generate({
    bindto: '#machine1',
    data: {
        x: 'x',
        xFormat: '%Y-%m-%d %H:%M:%S',
        columns: [
            ['x','2015-09-17 00:05:00', '2015-09-17 00:10:00', '2015-09-17 00:15:00', '2015-09-17 00:20:00', '2015-09-17 00:25:00', '2015-09-17 00:30:00', '2015-09-17 00:35:00', '2015-09-17 00:40:00', '2015-09-17 00:45:00', '2015-09-17 00:50:00', '2015-09-17 00:55:00', '2015-09-17 01:00:00', '2015-09-17 01:05:00', '2015-09-17 01:10:00', '2015-09-17 01:15:00', '2015-09-17 01:20:00', '2015-09-17 01:25:00', '2015-09-17 01:30:00', '2015-09-17 01:35:00', '2015-09-17 01:40:00', '2015-09-17 01:45:00', '2015-09-17 01:50:00', '2015-09-17 01:55:00', '2015-09-17 02:00:00', '2015-09-17 02:05:00', '2015-09-17 02:10:00', '2015-09-17 02:15:00', '2015-09-17 02:20:00', '2015-09-17 02:25:00', '2015-09-17 02:30:00', '2015-09-17 02:35:00', '2015-09-17 02:40:00', '2015-09-17 02:45:00', '2015-09-17 02:50:00', '2015-09-17 02:55:00', '2015-09-17 03:00:00', '2015-09-17 03:05:00', '2015-09-17 03:10:00', '2015-09-17 03:15:00', '2015-09-17 03:20:00', '2015-09-17 03:25:00', '2015-09-17 03:30:00', '2015-09-17 03:35:00', '2015-09-17 03:40:00', '2015-09-17 03:45:00', '2015-09-17 03:50:00', '2015-09-17 03:55:00', '2015-09-17 04:00:00', '2015-09-17 04:05:00', '2015-09-17 04:10:00', '2015-09-17 04:15:00', '2015-09-17 04:20:00', '2015-09-17 04:25:00', '2015-09-17 04:30:00', '2015-09-17 04:35:00', '2015-09-17 04:40:00', '2015-09-17 04:45:00', '2015-09-17 04:50:00', '2015-09-17 04:55:00', '2015-09-17 05:00:00', '2015-09-17 05:05:00', '2015-09-17 05:10:00', '2015-09-17 05:15:00', '2015-09-17 05:20:00', '2015-09-17 05:25:00', '2015-09-17 05:30:00', '2015-09-17 05:35:00', '2015-09-17 05:40:00', '2015-09-17 05:45:00', '2015-09-17 05:50:00', '2015-09-17 05:55:00', '2015-09-17 06:00:00', '2015-09-17 06:05:00', '2015-09-17 06:10:00', '2015-09-17 06:15:00', '2015-09-17 06:20:00', '2015-09-17 06:25:00', '2015-09-17 06:30:00', '2015-09-17 06:35:00', '2015-09-17 06:40:00', '2015-09-17 06:45:00', '2015-09-17 06:50:00', '2015-09-17 06:55:00', '2015-09-17 07:00:00', '2015-09-17 07:05:00', '2015-09-17 07:10:00', '2015-09-17 07:15:00', '2015-09-17 07:20:00', '2015-09-17 07:25:00', '2015-09-17 07:30:00', '2015-09-17 07:35:00', '2015-09-17 07:40:00', '2015-09-17 07:45:00', '2015-09-17 07:50:00', '2015-09-17 07:55:00', '2015-09-17 08:00:00', '2015-09-17 08:05:00', '2015-09-17 08:10:00', '2015-09-17 08:15:00', '2015-09-17 08:20:00', '2015-09-17 08:25:00', '2015-09-17 08:30:00', '2015-09-17 08:35:00', '2015-09-17 08:40:00', '2015-09-17 08:45:00', '2015-09-17 08:50:00', '2015-09-17 08:55:00', '2015-09-17 09:00:00', '2015-09-17 09:05:00', '2015-09-17 09:10:00', '2015-09-17 09:15:00', '2015-09-17 09:20:00', '2015-09-17 09:25:00', '2015-09-17 09:30:00', '2015-09-17 09:35:00', '2015-09-17 09:40:00', '2015-09-17 09:45:00', '2015-09-17 09:50:00', '2015-09-17 09:55:00', '2015-09-17 10:00:00', '2015-09-17 10:05:00', '2015-09-17 10:10:00', '2015-09-17 10:15:00', '2015-09-17 10:20:00', '2015-09-17 10:25:00', '2015-09-17 10:30:00', '2015-09-17 10:35:00', '2015-09-17 10:40:00', '2015-09-17 10:45:00', '2015-09-17 10:50:00', '2015-09-17 10:55:00', '2015-09-17 11:00:00', '2015-09-17 11:05:00', '2015-09-17 11:10:00', '2015-09-17 11:15:00', '2015-09-17 11:20:00', '2015-09-17 11:25:00', '2015-09-17 11:30:00', '2015-09-17 11:35:00', '2015-09-17 11:40:00', '2015-09-17 11:45:00', '2015-09-17 11:50:00', '2015-09-17 11:55:00'],
            ['machine1', 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 100, 0, 100, 100, 0, 100, 100, 0, 100, 100, 0, 100, 100, 100, 100, 100, 0, 100, 100, 100, 100, 0, 100, 100, 100, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        ],
        types: {
            //data3: 'spline',
            //data4: 'line',
            machine1: 'area',
        },
        colors: {
            machine1: '157F1F'
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

var chart1 = c3.generate({
    bindto: '#machine2',
    data: {
        x: 'x',
        xFormat: '%Y-%m-%d %H:%M:%S',
        columns: [
            ['x','2015-09-17 00:05:00', '2015-09-17 00:10:00', '2015-09-17 00:15:00', '2015-09-17 00:20:00', '2015-09-17 00:25:00', '2015-09-17 00:30:00', '2015-09-17 00:35:00', '2015-09-17 00:40:00', '2015-09-17 00:45:00', '2015-09-17 00:50:00', '2015-09-17 00:55:00', '2015-09-17 01:00:00', '2015-09-17 01:05:00', '2015-09-17 01:10:00', '2015-09-17 01:15:00', '2015-09-17 01:20:00', '2015-09-17 01:25:00', '2015-09-17 01:30:00', '2015-09-17 01:35:00', '2015-09-17 01:40:00', '2015-09-17 01:45:00', '2015-09-17 01:50:00', '2015-09-17 01:55:00', '2015-09-17 02:00:00', '2015-09-17 02:05:00', '2015-09-17 02:10:00', '2015-09-17 02:15:00', '2015-09-17 02:20:00', '2015-09-17 02:25:00', '2015-09-17 02:30:00', '2015-09-17 02:35:00', '2015-09-17 02:40:00', '2015-09-17 02:45:00', '2015-09-17 02:50:00', '2015-09-17 02:55:00', '2015-09-17 03:00:00', '2015-09-17 03:05:00', '2015-09-17 03:10:00', '2015-09-17 03:15:00', '2015-09-17 03:20:00', '2015-09-17 03:25:00', '2015-09-17 03:30:00', '2015-09-17 03:35:00', '2015-09-17 03:40:00', '2015-09-17 03:45:00', '2015-09-17 03:50:00', '2015-09-17 03:55:00', '2015-09-17 04:00:00', '2015-09-17 04:05:00', '2015-09-17 04:10:00', '2015-09-17 04:15:00', '2015-09-17 04:20:00', '2015-09-17 04:25:00', '2015-09-17 04:30:00', '2015-09-17 04:35:00', '2015-09-17 04:40:00', '2015-09-17 04:45:00', '2015-09-17 04:50:00', '2015-09-17 04:55:00', '2015-09-17 05:00:00', '2015-09-17 05:05:00', '2015-09-17 05:10:00', '2015-09-17 05:15:00', '2015-09-17 05:20:00', '2015-09-17 05:25:00', '2015-09-17 05:30:00', '2015-09-17 05:35:00', '2015-09-17 05:40:00', '2015-09-17 05:45:00', '2015-09-17 05:50:00', '2015-09-17 05:55:00', '2015-09-17 06:00:00', '2015-09-17 06:05:00', '2015-09-17 06:10:00', '2015-09-17 06:15:00', '2015-09-17 06:20:00', '2015-09-17 06:25:00', '2015-09-17 06:30:00', '2015-09-17 06:35:00', '2015-09-17 06:40:00', '2015-09-17 06:45:00', '2015-09-17 06:50:00', '2015-09-17 06:55:00', '2015-09-17 07:00:00', '2015-09-17 07:05:00', '2015-09-17 07:10:00', '2015-09-17 07:15:00', '2015-09-17 07:20:00', '2015-09-17 07:25:00', '2015-09-17 07:30:00', '2015-09-17 07:35:00', '2015-09-17 07:40:00', '2015-09-17 07:45:00', '2015-09-17 07:50:00', '2015-09-17 07:55:00', '2015-09-17 08:00:00', '2015-09-17 08:05:00', '2015-09-17 08:10:00', '2015-09-17 08:15:00', '2015-09-17 08:20:00', '2015-09-17 08:25:00', '2015-09-17 08:30:00', '2015-09-17 08:35:00', '2015-09-17 08:40:00', '2015-09-17 08:45:00', '2015-09-17 08:50:00', '2015-09-17 08:55:00', '2015-09-17 09:00:00', '2015-09-17 09:05:00', '2015-09-17 09:10:00', '2015-09-17 09:15:00', '2015-09-17 09:20:00', '2015-09-17 09:25:00', '2015-09-17 09:30:00', '2015-09-17 09:35:00', '2015-09-17 09:40:00', '2015-09-17 09:45:00', '2015-09-17 09:50:00', '2015-09-17 09:55:00', '2015-09-17 10:00:00', '2015-09-17 10:05:00', '2015-09-17 10:10:00', '2015-09-17 10:15:00', '2015-09-17 10:20:00', '2015-09-17 10:25:00', '2015-09-17 10:30:00', '2015-09-17 10:35:00', '2015-09-17 10:40:00', '2015-09-17 10:45:00', '2015-09-17 10:50:00', '2015-09-17 10:55:00', '2015-09-17 11:00:00', '2015-09-17 11:05:00', '2015-09-17 11:10:00', '2015-09-17 11:15:00', '2015-09-17 11:20:00', '2015-09-17 11:25:00', '2015-09-17 11:30:00', '2015-09-17 11:35:00', '2015-09-17 11:40:00', '2015-09-17 11:45:00', '2015-09-17 11:50:00', '2015-09-17 11:55:00'],
            ['machine2', 100, 100, 100, 100, 100, 0, 100, 100, 100, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 100, 0, 100, 100, 0, 100, 100, 0, 100, 100, 0, 100, 100, 100, 100, 100, 0, 100, 100, 100, 100, 100, 100],
        ],
        types: {
            //data3: 'spline',
            //data4: 'line',
            machine2: 'area',
        },
        colors: {
            machine2: '157F1F'
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

var chart1 = c3.generate({
    bindto: '#machine3',
    data: {
        x: 'x',
        xFormat: '%Y-%m-%d %H:%M:%S',
        columns: [
            ['x','2015-09-17 00:05:00', '2015-09-17 00:10:00', '2015-09-17 00:15:00', '2015-09-17 00:20:00', '2015-09-17 00:25:00', '2015-09-17 00:30:00', '2015-09-17 00:35:00', '2015-09-17 00:40:00', '2015-09-17 00:45:00', '2015-09-17 00:50:00', '2015-09-17 00:55:00', '2015-09-17 01:00:00', '2015-09-17 01:05:00', '2015-09-17 01:10:00', '2015-09-17 01:15:00', '2015-09-17 01:20:00', '2015-09-17 01:25:00', '2015-09-17 01:30:00', '2015-09-17 01:35:00', '2015-09-17 01:40:00', '2015-09-17 01:45:00', '2015-09-17 01:50:00', '2015-09-17 01:55:00', '2015-09-17 02:00:00', '2015-09-17 02:05:00', '2015-09-17 02:10:00', '2015-09-17 02:15:00', '2015-09-17 02:20:00', '2015-09-17 02:25:00', '2015-09-17 02:30:00', '2015-09-17 02:35:00', '2015-09-17 02:40:00', '2015-09-17 02:45:00', '2015-09-17 02:50:00', '2015-09-17 02:55:00', '2015-09-17 03:00:00', '2015-09-17 03:05:00', '2015-09-17 03:10:00', '2015-09-17 03:15:00', '2015-09-17 03:20:00', '2015-09-17 03:25:00', '2015-09-17 03:30:00', '2015-09-17 03:35:00', '2015-09-17 03:40:00', '2015-09-17 03:45:00', '2015-09-17 03:50:00', '2015-09-17 03:55:00', '2015-09-17 04:00:00', '2015-09-17 04:05:00', '2015-09-17 04:10:00', '2015-09-17 04:15:00', '2015-09-17 04:20:00', '2015-09-17 04:25:00', '2015-09-17 04:30:00', '2015-09-17 04:35:00', '2015-09-17 04:40:00', '2015-09-17 04:45:00', '2015-09-17 04:50:00', '2015-09-17 04:55:00', '2015-09-17 05:00:00', '2015-09-17 05:05:00', '2015-09-17 05:10:00', '2015-09-17 05:15:00', '2015-09-17 05:20:00', '2015-09-17 05:25:00', '2015-09-17 05:30:00', '2015-09-17 05:35:00', '2015-09-17 05:40:00', '2015-09-17 05:45:00', '2015-09-17 05:50:00', '2015-09-17 05:55:00', '2015-09-17 06:00:00', '2015-09-17 06:05:00', '2015-09-17 06:10:00', '2015-09-17 06:15:00', '2015-09-17 06:20:00', '2015-09-17 06:25:00', '2015-09-17 06:30:00', '2015-09-17 06:35:00', '2015-09-17 06:40:00', '2015-09-17 06:45:00', '2015-09-17 06:50:00', '2015-09-17 06:55:00', '2015-09-17 07:00:00', '2015-09-17 07:05:00', '2015-09-17 07:10:00', '2015-09-17 07:15:00', '2015-09-17 07:20:00', '2015-09-17 07:25:00', '2015-09-17 07:30:00', '2015-09-17 07:35:00', '2015-09-17 07:40:00', '2015-09-17 07:45:00', '2015-09-17 07:50:00', '2015-09-17 07:55:00', '2015-09-17 08:00:00', '2015-09-17 08:05:00', '2015-09-17 08:10:00', '2015-09-17 08:15:00', '2015-09-17 08:20:00', '2015-09-17 08:25:00', '2015-09-17 08:30:00', '2015-09-17 08:35:00', '2015-09-17 08:40:00', '2015-09-17 08:45:00', '2015-09-17 08:50:00', '2015-09-17 08:55:00', '2015-09-17 09:00:00', '2015-09-17 09:05:00', '2015-09-17 09:10:00', '2015-09-17 09:15:00', '2015-09-17 09:20:00', '2015-09-17 09:25:00', '2015-09-17 09:30:00', '2015-09-17 09:35:00', '2015-09-17 09:40:00', '2015-09-17 09:45:00', '2015-09-17 09:50:00', '2015-09-17 09:55:00', '2015-09-17 10:00:00', '2015-09-17 10:05:00', '2015-09-17 10:10:00', '2015-09-17 10:15:00', '2015-09-17 10:20:00', '2015-09-17 10:25:00', '2015-09-17 10:30:00', '2015-09-17 10:35:00', '2015-09-17 10:40:00', '2015-09-17 10:45:00', '2015-09-17 10:50:00', '2015-09-17 10:55:00', '2015-09-17 11:00:00', '2015-09-17 11:05:00', '2015-09-17 11:10:00', '2015-09-17 11:15:00', '2015-09-17 11:20:00', '2015-09-17 11:25:00', '2015-09-17 11:30:00', '2015-09-17 11:35:00', '2015-09-17 11:40:00', '2015-09-17 11:45:00', '2015-09-17 11:50:00', '2015-09-17 11:55:00'],
            ['machine3', 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 100, 0, 100, 100, 0, 100, 100, 0, 100, 100, 0, 100, 100, 100, 100, 100, 0, 100, 100, 100, 100, 0, 100, 100, 100, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        ],
        types: {
            //data3: 'spline',
            //data4: 'line',
            machine3: 'area',
        },
        colors: {
            machine3: '157F1F'
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

var chart1 = c3.generate({
    bindto: '#machine4',
    data: {
        x: 'x',
        xFormat: '%Y-%m-%d %H:%M:%S',
        columns: [
            ['x','2015-09-17 00:05:00', '2015-09-17 00:10:00', '2015-09-17 00:15:00', '2015-09-17 00:20:00', '2015-09-17 00:25:00', '2015-09-17 00:30:00', '2015-09-17 00:35:00', '2015-09-17 00:40:00', '2015-09-17 00:45:00', '2015-09-17 00:50:00', '2015-09-17 00:55:00', '2015-09-17 01:00:00', '2015-09-17 01:05:00', '2015-09-17 01:10:00', '2015-09-17 01:15:00', '2015-09-17 01:20:00', '2015-09-17 01:25:00', '2015-09-17 01:30:00', '2015-09-17 01:35:00', '2015-09-17 01:40:00', '2015-09-17 01:45:00', '2015-09-17 01:50:00', '2015-09-17 01:55:00', '2015-09-17 02:00:00', '2015-09-17 02:05:00', '2015-09-17 02:10:00', '2015-09-17 02:15:00', '2015-09-17 02:20:00', '2015-09-17 02:25:00', '2015-09-17 02:30:00', '2015-09-17 02:35:00', '2015-09-17 02:40:00', '2015-09-17 02:45:00', '2015-09-17 02:50:00', '2015-09-17 02:55:00', '2015-09-17 03:00:00', '2015-09-17 03:05:00', '2015-09-17 03:10:00', '2015-09-17 03:15:00', '2015-09-17 03:20:00', '2015-09-17 03:25:00', '2015-09-17 03:30:00', '2015-09-17 03:35:00', '2015-09-17 03:40:00', '2015-09-17 03:45:00', '2015-09-17 03:50:00', '2015-09-17 03:55:00', '2015-09-17 04:00:00', '2015-09-17 04:05:00', '2015-09-17 04:10:00', '2015-09-17 04:15:00', '2015-09-17 04:20:00', '2015-09-17 04:25:00', '2015-09-17 04:30:00', '2015-09-17 04:35:00', '2015-09-17 04:40:00', '2015-09-17 04:45:00', '2015-09-17 04:50:00', '2015-09-17 04:55:00', '2015-09-17 05:00:00', '2015-09-17 05:05:00', '2015-09-17 05:10:00', '2015-09-17 05:15:00', '2015-09-17 05:20:00', '2015-09-17 05:25:00', '2015-09-17 05:30:00', '2015-09-17 05:35:00', '2015-09-17 05:40:00', '2015-09-17 05:45:00', '2015-09-17 05:50:00', '2015-09-17 05:55:00', '2015-09-17 06:00:00', '2015-09-17 06:05:00', '2015-09-17 06:10:00', '2015-09-17 06:15:00', '2015-09-17 06:20:00', '2015-09-17 06:25:00', '2015-09-17 06:30:00', '2015-09-17 06:35:00', '2015-09-17 06:40:00', '2015-09-17 06:45:00', '2015-09-17 06:50:00', '2015-09-17 06:55:00', '2015-09-17 07:00:00', '2015-09-17 07:05:00', '2015-09-17 07:10:00', '2015-09-17 07:15:00', '2015-09-17 07:20:00', '2015-09-17 07:25:00', '2015-09-17 07:30:00', '2015-09-17 07:35:00', '2015-09-17 07:40:00', '2015-09-17 07:45:00', '2015-09-17 07:50:00', '2015-09-17 07:55:00', '2015-09-17 08:00:00', '2015-09-17 08:05:00', '2015-09-17 08:10:00', '2015-09-17 08:15:00', '2015-09-17 08:20:00', '2015-09-17 08:25:00', '2015-09-17 08:30:00', '2015-09-17 08:35:00', '2015-09-17 08:40:00', '2015-09-17 08:45:00', '2015-09-17 08:50:00', '2015-09-17 08:55:00', '2015-09-17 09:00:00', '2015-09-17 09:05:00', '2015-09-17 09:10:00', '2015-09-17 09:15:00', '2015-09-17 09:20:00', '2015-09-17 09:25:00', '2015-09-17 09:30:00', '2015-09-17 09:35:00', '2015-09-17 09:40:00', '2015-09-17 09:45:00', '2015-09-17 09:50:00', '2015-09-17 09:55:00', '2015-09-17 10:00:00', '2015-09-17 10:05:00', '2015-09-17 10:10:00', '2015-09-17 10:15:00', '2015-09-17 10:20:00', '2015-09-17 10:25:00', '2015-09-17 10:30:00', '2015-09-17 10:35:00', '2015-09-17 10:40:00', '2015-09-17 10:45:00', '2015-09-17 10:50:00', '2015-09-17 10:55:00', '2015-09-17 11:00:00', '2015-09-17 11:05:00', '2015-09-17 11:10:00', '2015-09-17 11:15:00', '2015-09-17 11:20:00', '2015-09-17 11:25:00', '2015-09-17 11:30:00', '2015-09-17 11:35:00', '2015-09-17 11:40:00', '2015-09-17 11:45:00', '2015-09-17 11:50:00', '2015-09-17 11:55:00'],
            ['machine4', 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 100, 0, 100, 100, 0, 100, 100, 0, 100, 100, 0, 100, 100, 100, 100, 100, 0, 100, 100, 100, 100, 0, 100, 100, 100, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        ],
        types: {
            //data3: 'spline',
            //data4: 'line',
            machine4: 'area',
        },
        colors: {
            machine4: '157F1F'
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
/*setTimeout(function () {
    chart.load({
        columns: [
            ['machine2', 100, 0, 100, 0, 100, 0, 100, 0, 100]
        ]
    });
}, 1000);*/
