document.addEventListener("DOMContentLoaded", function() {
  const txt_year = document.getElementById("revenue_year");
  const txt_month = document.getElementById("revenue_month");
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const formattedDate = `${day}/${month}`;
  const options = {month: 'numeric', day: 'numeric' };
  let data_date = [];
  const previousWeek = new Date(date);
  previousWeek.setDate(previousWeek.getDate() - 6);
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(previousWeek);
    currentDate.setDate(currentDate.getDate() + i);
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    data_date.push(formattedDate);
  }
  let data_chart_earn = [355, 390, 300, 350, 390, 180, 355];
  let data_chart_earn_month = [280, 250, 325, 215, 250, 310, 280];
  function findMaxNumber(arr) {
    let maxNumber = arr[0]; // Giả sử phần tử đầu tiên là số lớn nhất

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > maxNumber) {
        maxNumber = arr[i]; // Cập nhật số lớn nhất nếu tìm thấy số lớn hơn
      }
    }

    return maxNumber;
  }
  function calculateSum(arr) {
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }

    return sum;
  }

// Ví dụ sử dụng:
  const numbers = [2500000, 660000, 200000, 4000000, 1200000, 580000, 200000];
  const result = calculateSum(numbers);
  const formattedAmount = result.toLocaleString('en-US', {
    style: 'currency',
    currency: 'VND'
  });
  txt_month.innerText = formattedAmount.toString();
  const numbers_2 = [38, 40, 25];
  const result_2 = calculateSum(numbers_2);
  const formattedAmount2 = result_2.toLocaleString('en-US', {
    style: 'currency',
    currency: 'VND'
  });
  txt_year.innerText = formattedAmount2.toString();
// Ví dụ sử dụng:
  const max = findMaxNumber(data_chart_earn);
  let chartData = {
    series: [
      { name: "Earnings this day:", data: data_chart_earn },
      { name: "Expense this week:", data:  data_chart_earn_month},
    ],
    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#adb0bb",
      fontFamily: 'inherit',
      sparkline: { enabled: false },
    },
    colors: ["#5D87FF", "#49BEFF"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all'
      },
    },
    markers: { size: 0 },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      type: "category",
      categories: data_date,
      labels: {
        style: { cssClass: "grey--text lighten-2--text fill-color" },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: max+50,
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: "butt",
      colors: ["transparent"],
    },
    tooltip: { theme: "light" },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            }
          },
        }
      }
    ]
  };

  let chart = new ApexCharts(document.querySelector("#chart"), chartData);
  chart.render().then(r => {});

  let breakupData = {
    color: "#adb5bd",
    series: numbers_2,
    labels: ["2022", "2021", "2020"],
    chart: {
      width: 180,
      type: "donut",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
        },
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ["#5D87FF", "#ecf2ff", "#F9F9FD"],
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 150,
          },
        },
      },
    ],
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };

  let breakupChart = new ApexCharts(document.querySelector("#breakup"), breakupData);
  breakupChart.render().then(r => {});

  let earningData = {
    chart: {
      id: "sparkline3",
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    series: [
      {
        name: "Earnings",
        color: "#49BEFF",
        data: numbers,
      },
    ],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: ["#f3feff"],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    }
  };

    let earningChart = new ApexCharts(document.querySelector("#earning"), earningData);
    earningChart.render().then(r => {});
  });