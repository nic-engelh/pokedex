
function renderChart (hp, attack, defense, specialAttack, specialDefense, speed) {

  const ctx = document.getElementById('myChart');

  const myChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'],
        datasets: [{
          label: "Attribute",
          data: [hp, attack, defense, specialAttack, specialDefense, speed],
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