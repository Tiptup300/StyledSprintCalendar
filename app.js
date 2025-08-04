let sprints;

async function initialize() {
  try {
    const response = await fetch('./sprints.json');
    const jsonData = await response.json();
    const data = jsonData.values;
    sprints = getSprints(data);
    clearBody();
    runPage();
  } catch (error) {
    console.error('Error loading sprints.json:', error);
  }
}

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
    let now = new Date(2025, 02, 01);
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

// Start the application
initialize();




