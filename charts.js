
function renderChart () {

  const ctx = document.getElementById('myChart');

  const myChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'],
        datasets: [{
          label: "Attribute",
          data: [45, 60, 48, 65, 65, 45],
        }]
      },
      options: {
        plugins: {
          legend: false,
        },
        responsive: true,
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 65,
            }
        }
    
      }
  });
}