debugger;
let data = JSON.parse(document.querySelectorAll('pre')[0].innerHTML).values;
let sprints = getSprints(data);
clearBody();
addStyles(
  `span.sprint-letter {
    position: absolute;
    top: 0;
    left: 0.5em;
    font-size: 0.6em;
    color: white;
  }
  
  .day > span.label {
    text-transform: uppercase;
    font-size: 0.75em;
  }
  
  .day.sprint.today:after {
    display: none;
  }
  
  .day.sprint:before {
    background-color: #0000001c;
    right: 0;
    width: 1px;
    top: 0;
    height: 100%;
    position: absolute;
    content: "";
  }
  span.day-number {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  
  @property --darkness {
    syntax: "<percentage>";
    initial-value: 13%;
    inherits: false;
  }
  @property --lightness {
    syntax: "<percentage>";
    initial-value: 37%;
    inherits: false;
  }
  @keyframes fadeIn {
    0% {
      --darkness: 18%;
      --lightness: 32%;
    }
    100% {
      --darkness: 10%;
      --lightness: 42%;
    }
  }
  html body {
    margin: 0;
    height: 100vh;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    animation: 20s fadeIn ease-in-out infinite;
    animation-direction: alternate;
    background: linear-gradient(
      45deg,
      hsl(294deg 25% var(--darkness)) 15%,
      hsl(294deg 25% 19%) 50%,
      hsl(330deg 34% 29%) 50%,
      hsl(330deg 37% var(--lightness)) 85%
    );
  }
  body > div {
    background: linear-gradient( 135deg, hsl(0deg 0% 91%) 0%, hsl(0deg 0% 78%) 100% );
    padding: 2em;
    border-radius: 0.5rem;
    margin-top: 0;
    box-shadow: 15px 15px 15px #0000000f;
    border-bottom: #666666 0.25rem solid;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  body > div > h1, h1 {
    text-align: center;
    margin-bottom: 0.5em !important;
    font-weight: 100;
    color: #383838;
    font-size: 3rem !important;
}
  .calendar-headers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 0.5em 0;
    margin-bottom: 0.5em;
    font-weight: bold;
    padding: 0 0.5em;
  }
  .header {
    color: #505050;
    font-size: 1em;
    text-transform: uppercase;
    padding: 0.5em 0.5em 0.5em 0;
    text-align: right;
    font-weight: 400;
  }
  
  .calendar-container {
    font-size: 1rem;
  }
  
  .calendar {
    --cal-grid-space: 0.75em;
    --cal-full-pct: (100% - (var(--cal-grid-space) * 2));
    --cal-sun-left: calc((var(--cal-full-pct) / 7 * 0) + var(--cal-grid-space));
    --cal-mon-left: calc((var(--cal-full-pct) / 7 * 1) + var(--cal-grid-space));
    --cal-tue-left: calc((var(--cal-full-pct) / 7 * 2) + var(--cal-grid-space));
    --cal-wed-left: calc((var(--cal-full-pct) / 7 * 3) + var(--cal-grid-space));
    --cal-thu-left: calc((var(--cal-full-pct) / 7 * 4) + var(--cal-grid-space));
    --cal-fri-left: calc((var(--cal-full-pct) / 7 * 5) + var(--cal-grid-space));
    --cal-sat-left: calc((var(--cal-full-pct) / 7 * 6) + var(--cal-grid-space));
    --cal-sat-right: calc((var(--cal-full-pct) / 7 * 7) + var(--cal-grid-space));
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: var(--cal-grid-space) 0;
    padding: var(--cal-grid-space);
    border-radius: 0.5rem;
    --calendar-white: hsl(0deg 0% 73%);
    --calendar-black: hsl(0deg 0% 65%);
    background: linear-gradient(
      90deg,
      var(--calendar-white) var(--cal-sun-left),
      var(--calendar-white) var(--cal-mon-left),
      var(--calendar-black) var(--cal-mon-left),
      var(--calendar-black) var(--cal-tue-left),
      var(--calendar-white) var(--cal-tue-left),
      var(--calendar-white) var(--cal-wed-left),
      var(--calendar-black) var(--cal-wed-left),
      var(--calendar-black) var(--cal-thu-left),
      var(--calendar-white) var(--cal-thu-left),
      var(--calendar-white) var(--cal-fri-left),
      var(--calendar-black) var(--cal-fri-left),
      var(--calendar-black) var(--cal-sat-left),
      var(--calendar-white) var(--cal-sat-left),
      var(--calendar-white) var(--cal-sat-right)
    );
  }
  .day {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0.5em 0.5em 0.5em 0;
    justify-content: space-between;
    min-width: 4.4em;
    min-height: 3.5em;
    align-items: flex-end;
    line-height: 1em;
}
  
  .day.sprint {    
    border-radius: 0;
  
    --bottom-pct: calc(100% - 0.25em);
    background: linear-gradient(
      180deg,
      hsl(0deg 0% 0% / 0%) var(--bottom-pct),
      hsl(0deg 0% 0% / 14%) var(--bottom-pct),
      hsl(0deg 0% 0% / 13%) 100%
    );
    background-color: hsl(0deg 0% 96%);
    box-shadow: 0.125rem 0.125rem 0 0 hsl(0deg 0% 60%);
  }
  .off-month {
    color: gray;
  }
  .day.sprint.start {
    color: white;
    background-color: hsl(106deg 40% 37%);
    border-radius: 0.25rem 0 0 0.25rem;
    margin-left: 0.5em;
  }

  .day.sat.sprint:before,
  .day.sprint.start:before,
  .day.sprint.end:before {
    display: none;
  }
  
  .day.today {
    color: hsl(0deg 0% 80%);
    background: linear-gradient(217deg, #646363, #2e2e2e);
    background-size: 400% 400%;
    animation: today-bg-scroll 7s ease infinite;
  }

  .day.today:before {
    display: none;
  }
  
  @keyframes today-bg-scroll {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  * {
    --border-dark: #a1a1a1;
    --border-light: #bdbdbd;
  }
  .day.sprint.end {
    color: white;
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: hsl(0deg 40% 53%);
    margin-right: 0.5em;
  }
  .day.sun.sprint {
    border-radius: 0.25rem 0 0 0.25rem;
    margin-left: -1em;
  }
  .day.sun.sprint:after {
    content: '⮞';
    position: absolute;
    top: 0;
    left: 0;
    width: 1rem;
    background-color: #0000001d;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    color: var(--border-dark);
    align-items: center;
    font-size: 0.5em;
}
  .day.sat.sprint {
    border-radius: 0 0.25rem 0.25rem 0;
    padding-right: 1.5em;
    margin-right: -1em;
  }
  .day.sat.sprint:after {
    content: '⮞';
    position: absolute;
    top: 0;
    right: 0;
    width: 1rem;
    background-color: #0000001d;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    color: var(--border-dark);
    align-items: center;
    font-size: 0.5em;
}

  `
);
addCss(runPage);

function getSprints(allSprints) {
  let sprints = getCurrentSprints(allSprints);
  let activeSprint = getActiveSprint(sprints);
  return getActiveSprints(sprints, activeSprint);

  function getActiveSprints(allSprints, activeSprint) {
    return allSprints.filter(
      (sprint) =>
        sprint.number === activeSprint.number &&
        sprint.year === activeSprint.year
    );
  }

  function getCurrentSprints(allSprints) {
    return allSprints
      .filter((sprint) =>
        /^[12][0-9]{3}-[0-9][0-9][a-zA-Z]$/g.test(sprint.name)
      )
      .map((sprint) => buildSprintModel(sprint));
  }

  function getActiveSprint(allSprints) {
    let now = new Date();
    return allSprints.filter(
      (sprint) => now > sprint.startDate && now < sprint.endDate
    )[0];
  }

  function buildSprintModel(sprint) {
    let year = sprint.name.substring(0, 4);
    let number = sprint.name.substring(5, 7);
    let letter = sprint.name.substring(7, 8);
    let startDate = truncateHours(new Date(sprint.startDate));
    let endDate = truncateHours(new Date(sprint.endDate));
    let firstMonday = getFirstMonday(startDate);
    let lastFriday = getLastFriday(endDate);
    let state = sprint.state;
    let name = `Sprint ${year}-${number}`;

    return {
      year,
      number,
      letter,
      startDate,
      endDate,
      firstMonday,
      lastFriday,
      state,
      name,
    };

    function getFirstMonday(d) {
      let output;

      if (d.getDay() === 1) {
        return d;
      }
      output = new Date(d.getTime());
      output.setDate(output.getDate() + ((1 + 7 - output.getDay()) % 7 || 7));

      return output;
    }

    function getLastFriday(d) {
      if (d.getDay() === 5) {
        return d;
      }
      const t = d.getDate() + (6 - d.getDay() - 1) - 7;
      const lastFriday = new Date(d.getTime());
      lastFriday.setDate(t);
      return lastFriday;
    }

    function truncateHours(date) {
      let output = new Date(date.getTime());
      output.setHours(0, 0, 0, 0);

      return output;
    }
  }
}

function runPage() {
  let sprintDiv = buildSprintInfoDiv(sprints);
  getBody().appendChild(sprintDiv);

  sprintDiv.animate(
    [
      {
        opacity: 0,
        transform: 'scale(1.05) translate(0, -20px)',
        filter: 'blur(10px)',
      },
      {
        opacity: 0,
        transform: 'scale(1.05) translate(0, -20px)',
        filter: 'blur(10px)',
      },
      {
        opacity: 1,
        transform: 'scale(1.00) translate(0, 0)',
        filter: 'blur(0px)',
      },
    ],
    {
      duration: 333,
      iterations: 1,
      easing: 'ease-in-out',
    }
  );

  function buildSprintInfoDiv(sprints) {
    let mainContentDiv = buildDiv();
    addHeader(mainContentDiv, sprints);
    addCalendar(mainContentDiv, sprints);

    return mainContentDiv;

    function buildDiv() {
      return buildElement({
        tag: 'div',
      });
    }

    function addHeader(mainContentDiv, sprints) {
      mainContentDiv.appendChild(
        buildElement({
          tag: 'h1',
          innerHtml: sprints[0].name,
        })
      );
    }

    function addCalendar(mainContentDiv, sprints) {
      let calendarContainerElement = document.createElement('div');
      calendarContainerElement.classList.add('calendar-container');
      calendarContainerElement.appendChild(buildHeaderElement(sprints));
      calendarContainerElement.appendChild(buildCalendar(sprints));
      mainContentDiv.appendChild(calendarContainerElement);

      function buildHeaderElement(calendarElement) {
        let header = document.createElement('div');
        header.classList.add('calendar-headers');
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((x) => {
          let dayElement = document.createElement('div');
          dayElement.classList.add('header');
          dayElement.innerHTML = x;

          header.appendChild(dayElement);
        });

        return header;
      }

      function buildCalendar(sprints) {
        let firstMonday = sprints.reduce(
          (earliestDate, sprint) =>
            Date.parse(earliestDate) > Date.parse(sprint.firstMonday)
              ? sprint.firstMonday
              : earliestDate,
          sprints[0].firstMonday
        );
        let lastFriday = sprints.reduce(
          (latestDate, sprint) =>
            Date.parse(latestDate) <= Date.parse(sprint.lastFriday)
              ? sprint.lastFriday
              : latestDate,
          sprints[0].lastFriday
        );
        let calendarElement = buildElement({ tag: 'div' });
        calendarElement.classList.add('calendar');

        let currentDate = new Date(firstMonday.getTime());
        currentDate.setDate(currentDate.getDate() - 1);

        let endSunday = getNextSunday(lastFriday);

        while (currentDate.getTime() < endSunday.getTime()) {
          let dayElement = document.createElement('div');
          let sprintLetterLabel = '';
          let label = '';

          dayElement.classList.add('day');
          dayElement.classList.add(
            currentDate
              .toLocaleDateString('en-US', { weekday: 'short' })
              .toLowerCase()
          );
          if (currentDate.getMonth() !== getToday().getMonth()) {
            dayElement.classList.add('off-month');
          }

          if (currentDate.getTime() === getToday().getTime()) {
            dayElement.classList.add('today');
            label = 'Today';
          }

          if (
            sprints.some(
              (sprint) =>
                currentDate.getTime() >= sprint.firstMonday.getTime() &&
                currentDate.getTime() <= sprint.lastFriday.getTime()
            )
          ) {
            let currentSprint = sprints.filter(
              (sprint) =>
                currentDate.getTime() >= sprint.firstMonday.getTime() &&
                currentDate.getTime() <= sprint.lastFriday.getTime()
            )[0];
            dayElement.classList.add('sprint');
            dayElement.classList.add(`sprint-${currentSprint.letter}`);
          }

          if (
            sprints.some(
              (sprint) => sprint.firstMonday.getTime() === currentDate.getTime()
            )
          ) {
            dayElement.classList.add('start');
            sprintLetterLabel = sprints.filter(
              (sprint) => sprint.firstMonday.getTime() === currentDate.getTime()
            )[0].letter;
            label = 'Start';
          }

          if (
            sprints.some(
              (sprint) => sprint.lastFriday.getTime() === currentDate.getTime()
            )
          ) {
            dayElement.classList.add('end');
            sprintLetterLabel = sprints.filter(
              (sprint) => sprint.lastFriday.getTime() === currentDate.getTime()
            )[0].letter;
            label = 'End';
          }

          if (sprintLetterLabel !== '') {
            let sprintLetterElement = document.createElement('span');
            sprintLetterElement.classList.add('sprint-letter');
            sprintLetterElement.innerHTML = sprintLetterLabel;
            dayElement.appendChild(sprintLetterElement);
          }

          if (label !== '') {
            let labelElement = document.createElement('span');
            labelElement.classList.add('label');
            labelElement.innerHTML = label;
            dayElement.appendChild(labelElement);
          }

          let dayNumberElement = document.createElement('span');
          dayNumberElement.classList.add('day-number');
          dayNumberElement.innerHTML = currentDate.getDate();
          dayElement.appendChild(dayNumberElement);

          calendarElement.appendChild(dayElement);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return calendarElement;

        function getNextSunday(d) {
          let output = new Date(d.getTime());

          output.setHours(0, 0, 0, 0);
          while (output.getDay() !== 0) {
            output.setDate(output.getDate() + 1);
          }

          return output;
        }
      }
    }

    function buildElement({ tag, innerHtml, children }) {
      const element = document.createElement(tag);
      if (innerHtml) {
        element.innerHTML = innerHtml;
      }
      if (children) {
        element.appendChild(children);
      }
      return element;
    }
  }

  function getToday() {
    let output = new Date();
    output.setHours(0, 0, 0, 0);

    return output;
  }
}
function getBody() {
  return document.querySelectorAll('body')[0];
}
function clearBody() {
  let parent = getBody();
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function addCss(funcOnLoad) {
  var head = document.head;
  var link = document.createElement('link');

  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href =
    'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css';
  link.integrity =
    'sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh';
  link.crossOrigin = 'anonymous';
  link.onload = funcOnLoad;

  head.appendChild(link);
}

function addStyles(styles) {
  var styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
