document.addEventListener("DOMContentLoaded", function() {
  const txt_year = document.getElementById("revenue_year");
  const txt_month = document.getElementById("revenue_month");
  const to_input = document.getElementById("to_input");
  const save = document.getElementById("save");
  const from_input = document.getElementById("from_input");
  const select_year = document.getElementById("select_year");
  const logout = document.getElementById("logout");
  logout.addEventListener("click", function (){
    window.location.assign("/stech.manager/login");
    utils.DeleteAllCookies();
  });
  const date = new Date();
  let data_chart = [];
  async function getStatic(startDate,endDate) {
    try {
      const response = await axios.post(`/apiv2/getStatic`, {
        startDate: startDate,
        endDate: endDate
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async function GetHotSaleProducts(number) {
    try {
      const response = await axios.post(`/apiv2/getHotSaleProducts`, {
        topNumber: number
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async function GetRunOutProducts(number) {
    try {
      const response = await axios.post(`/apiv2/getRunOutProducts`, {
        topNumber: number
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
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

  let chartCustom;
  const options = {month: 'numeric', day: 'numeric'};
  const options_full = {year: 'numeric', month: 'numeric', day: 'numeric'};


  from_input.addEventListener('change', function (){
    console.log(from_input.value);
  });

  to_input.addEventListener('change', function (){
    console.log(to_input.value);
  });

  save.addEventListener('click', function (){
    getStatic(from_input.value, to_input.value).then(data =>{
      const startDate = new Date(from_input.value);
      const endDate = new Date(to_input.value);
      let dateArray = createArrayOfDates(startDate,endDate);
      console.log(data.data)
      chartCustom = {
        series: [
          { name: "Earnings this day:", data: data.data },
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
          categories: dateArray,
          labels: {
            style: { cssClass: "grey--text lighten-2--text fill-color" },
          },
        },
        yaxis: {
          show: true,
          min: 0,
          max: findMax(data.data)+150,
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
      let chart_custom = new ApexCharts(document.querySelector("#chart_custom"), chartCustom);
      chart_custom.render().then(r =>{});
    });
  });

  function reloadChart(chart) {
    chart.render();
  }
  let dataSelect = ["2023", "2024", "2025"]
  dataSelect.forEach(date =>{
    let child = document.createElement("option")
    child.value = date
    child.text = date
    select_year.appendChild(child)
  })

  let year_selected = dataSelect[0];
  select_year.addEventListener('change', function (){
    year_selected = select_year.value;
    reloadChart(data_chart)
  });

  let data_date = [];
  const previousWeek = new Date(date);
  previousWeek.setDate(previousWeek.getDate() - 6);
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(previousWeek);
    currentDate.setDate(currentDate.getDate() + i);
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    data_date.push(formattedDate);
  }
  let data_date_ui = [];
  const previousWeek_ui = new Date(date);
  previousWeek_ui.setDate(previousWeek_ui.getDate() - 6);
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(previousWeek_ui);
    currentDate.setDate(currentDate.getDate() + i);
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    data_date_ui.push(formattedDate);
  }

  const first_date = year_selected+"/"+data_date[0];
  const last_date = year_selected+"/"+data_date[data_date.length - 1];
  getStatic(first_date, last_date).then(data =>{
    if (data.code === 1){
      // data_chart = data.data;
      console.log(data.data)
      let chartData = {
        series: [
          { name: "Earnings this day:", data: data_chart},
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
          categories: data_date_ui,
          labels: {
            style: { cssClass: "grey--text lighten-2--text fill-color" },
          },
        },
        yaxis: {
          show: true,
          min: 0,
          max: findMax(data_chart),
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

//Thông kê doanh thu trong 1 năm
  //Tạo hàm rage ra 1 năm
  function getYearTime(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const days = [];
    let currentDateCopy = new Date(startDate);

    while (currentDateCopy <= endDate) {
      days.push(new Date(currentDateCopy));
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    return days;
  }

//Khởi tạo biến
  const currentYear = new Date().getFullYear();
  const yearTime = getYearTime(currentYear);
  const formattedYear = yearTime.map(date => date.toLocaleDateString('en-US', options_full));
  let data_year = [];

  //Gọi API và render ra dữ liệu
  getStatic(formattedYear[0], formattedYear[formattedYear.length-1]).then(data =>{
    if (data.code === 1){
      data_year = data.data;
      let total = calculateSum(data_year);
      const formatted = total.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
      });
      txt_year.innerText = formatted.toString();
      let breakupData = {
        color: "#adb5bd",
        series: data_year,
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
    }else {
      console.log(data.message);
    }
  });

//Thông kê doanh thu trong 1 tháng
  //Tạo hàm rage ra 1 tháng
  function getCurrentMonthTime() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const dates = [];
    let currentDateCopy = new Date(startDate);

    while (currentDateCopy <= endDate) {
      dates.push(new Date(currentDateCopy));
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    return dates;
  }

//Khởi tạo biến
  const oneMonthTime = getCurrentMonthTime();
  const formattedDates = oneMonthTime.map(date => date.toLocaleDateString('en-US', options_full));
  let data_month = [];

  //Gọi API và render ra dữ liệu
  getStatic(formattedDates[0], formattedDates[formattedDates.length - 1]).then(data =>{
    if (data.code === 1){
      data_month = data.data;
      let total = calculateSum(data_month);
      const formatted = total.toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND'
      });
      txt_month.innerText = formatted.toString();
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
            data: data_month,
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
      earningChart.render();
    }else {
      console.log(data.message);
    }
    });
  });