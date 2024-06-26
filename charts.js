function renderChart(attributes) {
  // attributes : hp, attack, defense, specialAttack, specialDefense, speed

  let chartStatus = Chart.getChart("myChart"); // <canvas> id
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }

  let ctx = document.getElementById("myChart");

  const chartConfigDatasets = [
    {
      label: "Attribute",
      data: [
        attributes[0]["base_stat"],
        attributes[1]["base_stat"],
        attributes[2]["base_stat"],
        attributes[3]["base_stat"],
        attributes[4]["base_stat"],
        attributes[5]["base_stat"],
      ],
    },
  ];

  const chartConfigOptions = {
    plugins: {
      legend: false,
    },
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 65,
      },
    },
  };

  const chartConfigJSON = {
    type: "radar",
    data: {
      labels: ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"],
      datasets: chartConfigDatasets,
    },
    options: chartConfigOptions,
  };
  
  const myChart = new Chart(ctx, chartConfigJSON );
}
