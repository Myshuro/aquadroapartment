"use strict";


window.addEventListener("load", (event) => {

  const initMap = (coordinates, zoomLevel) => {
    const map = L.map("map").setView(coordinates, zoomLevel);


    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    return map;
  };


  const addMarker = (map, coordinates, popupText) => {
    L.marker(coordinates).addTo(map).bindPopup(popupText);
  };


  if (event.target.title === "Activities in Piombino") {
    const map = initMap([42.99739, 10.59686], 11);


    const markers = [
      {
        coordinates: [42.92423696772851, 10.531890377151653],
        text: "Here we have Aquadro",
      },
      { coordinates: [42.93295, 10.50892], text: "Salivoli beach" },
      { coordinates: [42.9226, 10.52708], text: "DaLuca Ristorante" },
      { coordinates: [42.98791, 10.50954], text: "I Tretruschi Srl" },
      { coordinates: [42.92514, 10.52924], text: "Pizzeria Da Egidio" },
      { coordinates: [42.93521, 10.49916], text: "Calamoresca" },
      { coordinates: [42.99424, 10.53478], text: "Tenuta Poggio Rosso" },
      { coordinates: [43.03284, 10.71007], text: "Società Agricola Petra" },
    ];


    markers.forEach((marker) =>
      addMarker(map, marker.coordinates, marker.text)
    );
  } else {

    const map = initMap([42.92423696772851, 10.531890377151653], 15);
    addMarker(
      map,
      [42.92423696772851, 10.531890377151653],
      "Here we have Aquadro"
    );
  }
});


const initializeObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          entry.target.classList.add("show");

          if (entry.target.classList.contains("right")) {
            entry.target.classList.add("slide-from-right");
          } else if (entry.target.classList.contains("left")) {
            entry.target.classList.add("slide-from-left");
          } else if (entry.target.classList.contains("fade-in")) {
            entry.target.classList.add("show");
          }
        }
      });
    },
    { root: null } 
  );


  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach((el) => observer.observe(el));
};

initializeObserver(); 


document.addEventListener("DOMContentLoaded", function () {
  const calendar = document.querySelector(".calendar");
  const yearSelect = document.getElementById("year");
  const monthSelect = document.getElementById("month");
  const apartmentSelect = document.getElementById("apartment");

  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];


  const fetchData = async (url, headers) => {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      return data.map((item) => ({ ...item, free: item.free === true }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };


  const getData = () => {
    const url = "https://naymuvktteoymrucjwrp.supabase.co/rest/v1/apartament";
    const headers = {
      apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heW11dmt0dGVveW1ydWNqd3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MjUwNTEsImV4cCI6MjAzMTEwMTA1MX0.up4qzCKgbFNqDyd9cPwwb2C8DX60m82A0sOALC3XcxA",
      authorisation:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heW11dmt0dGVveW1ydWNqd3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MjUwNTEsImV4cCI6MjAzMTEwMTA1MX0.up4qzCKgbFNqDyd9cPwwb2C8DX60m82A0sOALC3XcxA",
    };

    return fetchData(url, headers);
  };


  const populateYearOptions = async () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const data = await getData();
    const availableYears = new Set(data.map((item) => item.year));

    yearSelect.innerHTML = "<option value='' disabled>Select Year</option>";
    availableYears.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });

    yearSelect.value = currentYear;
    if (yearSelect.value === "") yearSelect.value = "";
  };


  const populateMonthOptions = async (year) => {
    const data = await getData();
    const availableMonths = new Set(
      data.filter((item) => item.year == year).map((item) => item.month)
    );

    monthSelect.innerHTML = "<option value='' disabled>Select Month</option>";
    availableMonths.forEach((month) => {
      const option = document.createElement("option");
      option.value = monthNames.indexOf(month);
      option.textContent = month.charAt(0).toUpperCase() + month.slice(1);
      monthSelect.appendChild(option);
    });

    monthSelect.selectedIndex = new Date().getMonth();
    if (monthSelect.selectedIndex === -1) monthSelect.selectedIndex = 0;
  };


  const renderCalendar = async (year, month, apartment) => {
    calendar.innerHTML = "";
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = await getData();

    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const startingDay = new Date(year, month, 1).getDay();
    const offset = startingDay === 0 ? 6 : startingDay - 1;

    const createDayElement = (content, className = "") => {
      const dayElement = document.createElement("div");
      dayElement.className = `day ${className}`;
      dayElement.innerHTML = content;
      return dayElement;
    };


    for (let i = 0; i < offset; i++) {
      calendar.appendChild(createDayElement("", "no-data"));
    }


    for (let i = 1; i <= daysInMonth; i++) {
      let dayContent = `<div class="row day-of-week">${
        daysOfWeek[(offset + i - 1) % 7]
      }</div>
                        <div class="row">${
                          monthNames[month].charAt(0).toUpperCase() +
                          monthNames[month].slice(1)
                        } ${i}</div>`;
      let className = "";

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth) ||
        (year === currentYear && month === currentMonth && i < currentDay)
      ) {
        dayContent += '<div class="row">No Data</div>';
        className = "no-data";
      } else {
        const entry = data.find(
          (item) =>
            item.year == year &&
            item.month.toLowerCase() === monthNames[month].toLowerCase() &&
            item.date == i &&
            item.apartment == apartment
        );

        if (entry) {
          const availability = entry.free ? "Available" : "Not Available";
          const price = entry.free ? `Price: € ${entry.price}` : "";
          dayContent += `<div class="row">${availability}</div><div class="row">${price}</div>`;
          className = entry.free ? "free" : "not-free";
        } else {
          dayContent += '<div class="row">No Data</div>';
        }
      }

      calendar.appendChild(createDayElement(dayContent, className));
    }
  };


  const initializeCalendar = async () => {
    await populateYearOptions();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    yearSelect.value = currentYear.toString();
    await populateMonthOptions(currentYear);
    monthSelect.value = currentMonth.toString();
    renderCalendar(currentYear, currentMonth, apartmentSelect.value);
  };

  initializeCalendar();


  yearSelect.addEventListener("change", async function () {
    const selectedYear = parseInt(this.value);
    await populateMonthOptions(selectedYear);
    const selectedMonth = parseInt(monthSelect.value);
    renderCalendar(selectedYear, selectedMonth, apartmentSelect.value);
  });


  monthSelect.addEventListener("change", function () {
    const selectedYear = parseInt(yearSelect.value);
    const selectedMonth = parseInt(this.value);
    renderCalendar(selectedYear, selectedMonth, apartmentSelect.value);
  });


  apartmentSelect.addEventListener("change", function () {
    const selectedYear = parseInt(yearSelect.value);
    const selectedMonth = parseInt(monthSelect.value);
    renderCalendar(selectedYear, selectedMonth, apartmentSelect.value);
  });
});
