const WEEK = [
  "DOMINGO",
  "SEGUNDA-FEIRA",
  "TERÇA-FEIRA",
  "QUARTA-FEIRA",
  "QUINTA-FEIRA",
  "SEXTA-FEIRA",
  "SÁBADO",
];

const MONTHS = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

const HOLIDAYS = [
  {
    day: 1,
    month: 0,
    title: "Dia da Confraternização Universal",
    type: "holiday",
  },
  { day: 28, month: 1, title: "Carnaval", type: "optional" },
  { day: 1, month: 2, title: "Carnaval", type: "optional" },
  { day: 2, month: 2, title: "Quarta-feira de Cinzas", type: "optional" },
  { day: 15, month: 3, title: "Sexta-feira Santa", type: "holiday" },
  { day: 21, month: 3, title: "Tiradentes", type: "holiday" },
  { day: 1, month: 4, title: "Dia do Trabalho", type: "holiday" },
  { day: 16, month: 5, title: "Corpus Christi", type: "optional" },
  {
    day: 7,
    month: 8,
    title: "Dia da Independência do Brasil",
    type: "holiday",
  },
  {
    day: 12,
    month: 9,
    title: "Dia de Nossa Senhora Aparecida",
    type: "holiday",
  },
  { day: 28, month: 9, title: "Dia do Servidor Público", type: "optional" },
  { day: 2, month: 10, title: "Dia de Finados", type: "holiday" },
  { day: 15, month: 10, title: "Proclamação da República", type: "holiday" },
  { day: 25, month: 11, title: "Natal", type: "holiday" },
];

const CURRENT_DATE = new Date();
const CURRENT_DAY = CURRENT_DATE.getDate();
const CURRENT_WEEK_DAY = CURRENT_DATE.getDay();
const CURRENT_MONTH = CURRENT_DATE.getMonth();
const CURRENT_YEAR = CURRENT_DATE.getFullYear();

let selectedYear = CURRENT_DATE.getFullYear();
let selectedMonth = CURRENT_DATE.getMonth();

window.onload = function () {
  // set current day
  document.getElementsByClassName("day")[0].innerText = CURRENT_DAY;

  // set current week day
  document.getElementsByClassName("weekday")[0].innerText =
    WEEK[CURRENT_WEEK_DAY];

  setCalendar(selectedMonth, selectedYear);

  let container = document.getElementsByClassName("container")[0];
  container.setAttribute("class", "container animate");

  setInterval(() => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const hour = hours < 10 ? `0${hours}` : hours;
    const minute = minutes < 10 ? `0${minutes}` : minutes;
    const second = seconds < 10 ? `0${seconds}` : seconds;

    document.getElementsByClassName(
      "time-value"
    )[0].innerText = `${hour}:${minute}:${second}`;
  }, 1000);
};

function prevMonth() {
  if (selectedMonth > 0) {
    selectedMonth -= 1;
  } else {
    selectedMonth = 11;
    selectedYear -= 1;
  }

  setCalendar(selectedMonth, selectedYear);
}

function nextMonth() {
  if (selectedMonth < 11) {
    selectedMonth += 1;
  } else {
    selectedMonth = 0;
    selectedYear += 1;
  }

  setCalendar(selectedMonth, selectedYear);
}

function prevYear() {
  selectedYear -= 1;
  setCalendar(selectedMonth, selectedYear);
}

function nextYear() {
  selectedYear += 1;
  setCalendar(selectedMonth, selectedYear);
}

function getLastDayInMonth(month, year) {
  // returns the last day of the month
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayMonth(month, year) {
  // returns the day of the week that the month starts
  return new Date(year, month, 1).getDay();
}

function setCalendar(month, year) {
  const MONTH_IS_PAST = selectedMonth < CURRENT_MONTH;
  const YEAR_IS_PAST = selectedYear < CURRENT_YEAR;

  const MONTH_IS_CURRENT = selectedMonth === CURRENT_MONTH;
  const YEAR_IS_CURRENT = selectedYear === CURRENT_YEAR;

  const IS_CURRENT =
    CURRENT_MONTH === selectedMonth && CURRENT_YEAR === selectedYear;

  // set current month
  document.getElementsByClassName("month-name")[0].innerText = MONTHS[month];

  // set current year
  document.getElementsByClassName("year-value")[0].innerText = year;

  const tbody = document.getElementById("days");
  tbody.innerHTML = "";
  const section = document.getElementsByClassName("holidays")[0];
  section.innerHTML = "";
  const daysInMonth = getLastDayInMonth(month, year);
  const startMonth = getStartDayMonth(month, year);

  let tr = document.createElement("tr");

  for (let d = 1; d <= daysInMonth; d++) {
    if (startMonth > 0 && d === 1) {
      let tdColspan = document.createElement("td");
      tdColspan.setAttribute("colspan", startMonth);
      tr.append(tdColspan);
    }

    let td = document.createElement("td");
    td.innerHTML = `<span>${d}</span>`;

    // mark weekend days
    if ((d + startMonth + 6) % 7 === 0 || (d + startMonth) % 7 === 0) {
      td.setAttribute("class", "weekend");
    }

    // mark current day
    if (d === CURRENT_DAY && MONTH_IS_CURRENT && YEAR_IS_CURRENT) {
      td.classList.add("current");
    }

    // mark days in past
    if (
      YEAR_IS_PAST ||
      (YEAR_IS_CURRENT && MONTH_IS_PAST) ||
      (YEAR_IS_CURRENT && MONTH_IS_CURRENT && d < CURRENT_DAY)
    ) {
      td.classList.add("past");
    }

    const holiday = HOLIDAYS.find(
      (holiday) => holiday.day === d && holiday.month === month
    );
    if (holiday) {
      td.classList.add(holiday.type);

      let div = document.createElement("div");
      div.setAttribute("class", "holiday-details");
      div.innerHTML = `<i class="circle ${holiday.type}"></i><div><span>${d}</span><span class="title">${holiday.title}</span></div>`;
      section.append(div);
    }

    tr.append(td);

    if ((d + startMonth) % 7 === 0) {
      tbody.append(tr);
      tr = document.createElement("tr");
    }
  }

  tbody.append(tr);
}
