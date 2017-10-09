var chart = c3.generate({
    data: {
        x : 'x',
        columns: [
            ['x', 'reason1', 'reason2', 'reason3', 'reason4', 'reason5', 'reason6', 'reason7', 'reason8', 'reason9', 'reason10', 'reason11', 'reason12'],
            ['value', 50, 100, 30, 50, 22, 55, 77, 99, 36, 45, 69, 74],
        ],
        type: 'bar',
        color: function() {
          return '#'+Math.random().toString(16).substr(2,6);
        },
        labels: true
    },
    axis: {
      x: {
        //max: 100,
        type: 'category' // this needed to load string x value
      },
      y: {
        max: 100
      },
      rotated: true
    },
    size: {
      height: 500
    },
    bar: {
        width: {
            ratio: 0.7 // this makes bar width 50% of length between ticks
        }
        //width: 100 // this makes bar width 100px
    },
    legend: {
      show: false
    },
    tooltip: {
        show: false
    }
});

setTimeout(function () {
    chart.load({
        columns: [
            ['x', 'reason1', 'reason2', 'reason3', 'reason4', 'reason5', 'reason6', 'reason7', 'reason8', 'reason9', 'reason10', 'reason11', 'reason12'],
            ['value', 10, 20, 50, 100, 5, 70, 60, 40, 45, 78, 63, 12],
        ],
    });
}, 1000);

setTimeout(function () {
    chart.load({
        columns: [
            ['x', 'reason1', 'reason2', 'reason3', 'reason4', 'reason5', 'reason6', 'reason7', 'reason8', 'reason9', 'reason10', 'reason11', 'reason12'],
            ['value', 56, 89, 12, 45, 36, 58, 14, 69, 56, 87, 45, 36],
        ],
    });
}, 2000);