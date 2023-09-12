
function renderChart (attributes) {

  // attributes : hp, attack, defense, specialAttack, specialDefense, speed

  const ctx = document.getElementById('myChart');

  const myChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'],
        datasets: [{
          label: "Attribute",
          data: [attributes[0], attributes[1], attributes[2], attributes[3], attributes[4], attributes[5]],
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