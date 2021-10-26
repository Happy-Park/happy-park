const { Litepicker } = require('litepicker')

const picker = new Litepicker({
    element: document.getElementById('datepicker'),
    allowRepick: true,
    singleMode: false,
    tooltipText: {
      one: 'night',
      other: 'nights'
    },
    tooltipNumber: (totalDays) => {
      return totalDays - 1;
    }
})





  


