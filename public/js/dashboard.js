document.addEventListener("DOMContentLoaded", function() {
  const txt_year = document.getElementById("revenue_year");
  const txt_month = document.getElementById("revenue_month");
  const to_input = document.getElementById("to_input");
  const save = document.getElementById("save");
  const from_input = document.getElementById("from_input");
  const select_year = document.getElementById("select_year");
  const token = utils.GetCookie("token");
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const formattedDate = `${year}-${month}-${day}`;


  let data_chart_earn = [];
  async function GetStatisticsCusTom(from_date,to_date) {
    try {
      const response = await axios.post(`/api/getOrderFromDateToDate`, {
        fromDate: from_date,
        toDate: to_date
      }, {
        headers: {
          'Authorization': `${token}`
        }
      });
      console.log("data:" + response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async function GetTop10Product() {
    try {
      const response = await axios.post(`/api/getOrderTop10`,
        {
        headers: {
          'Authorization': `${token}`
        }
      });
      console.log("data:" + response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
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
  function createArrayOfDates(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(currentDate.toLocaleDateString());
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }
  let year_selected = "2023";
  select_year.addEventListener('change', function (){
      year_selected = select_year.value;
      console.log(year_selected);
  });

  // Ví dụ sử dụng:
  // const formattedAmount = result.toLocaleString('en-US', {
  //   style: 'currency',
  //   currency: 'VND'
  // });
  // txt_month.innerText = formattedAmount.toString();

  // txt_year.innerText = formattedAmount2.toString();
// Ví dụ sử dụng:
  let chartCustom;
  const options = {month: 'numeric', day: 'numeric'};
  let data_date = [];
  const previousWeek = new Date(date);
  previousWeek.setDate(previousWeek.getDate() - 6);
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(previousWeek);
    currentDate.setDate(currentDate.getDate() + i);
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    data_date.push(formattedDate);
  }
  const first_date = year_selected+"/"+data_date[0];
  const last_date = year_selected+"/"+data_date[data_date.length - 1];

  from_input.addEventListener('change', function (){
    console.log(from_input.value);
  });

  to_input.addEventListener('change', function (){
    console.log(to_input.value);
  })

  save.addEventListener('click', function (){
    GetStatisticsCusTom(from_input.value, to_input.value).then(data =>{
      const startDate = new Date(from_input.value);
      const endDate = new Date(to_input.value);
      const dateArray = createArrayOfDates(startDate,endDate);
      console.log(dateArray);
      chartCustom = {
        series: [
          { name: "Earnings this day:", data: data.data.reverse() },
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
        colors: ["#e1a25b", "#49BEFF"],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "25%",
            borderRadius: [8],
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
          categories: dateArray.reverse(),
          labels: {
            style: { cssClass: "grey--text lighten-2--text fill-color" },
          },
        },
        yaxis: {
          show: true,
          min: 0,
          max: findMaxNumber(data.data)+50,
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
  });
    let chart_custom = new ApexCharts(document.querySelector("#chart_custom"), chartCustom);
    // chart_custom.render().then(r =>{});
    reloadChart(chart_custom);
  });

  function reloadChart(chart) {
    chart.render();
  }
  GetStatisticsCusTom(first_date, last_date).then(data =>{
    if (data.code === 1){
      data_chart_earn = data.data;
      console.log(data.data);

      let chartData = {
        series: [
          { name: "Earnings this day:", data: data_chart_earn},
          // { name: "Expense this week:", data:  data_chart_earn_month},
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
          categories: data_date.reverse(),
          labels: {
            style: { cssClass: "grey--text lighten-2--text fill-color" },
          },
        },
        yaxis: {
          show: true,
          min: 0,
          max: findMaxNumber(data_chart_earn),
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
      chart.render();
    }else {
      console.log(data.message);
    }

  });

  let breakupData = {
    color: "#adb5bd",
    series: [],
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
        data: [],
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