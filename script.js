// --- Full Moon Data (Sample) ---
// IMPORTANT: This is a *limited sample*. For a real application,
// you need a complete and accurate dataset covering a wider range of years.
// Dates are YYYY-MM-DD (assumed UTC for simplicity here).
// Names are traditional North American names.
const fullMoonData = [
    { date: "1990-01-11", name: "Wolf Moon" }, { date: "1990-02-09", name: "Snow Moon" }, { date: "1990-03-11", name: "Worm Moon" },
    { date: "1990-04-10", name: "Pink Moon" }, { date: "1990-05-09", name: "Flower Moon" }, { date: "1990-06-08", name: "Strawberry Moon" },
    { date: "1990-07-08", name: "Buck Moon" }, { date: "1990-08-06", name: "Sturgeon Moon" }, { date: "1990-09-05", name: "Corn Moon" },
    { date: "1990-10-04", name: "Hunter's Moon" }, { date: "1990-11-03", name: "Beaver Moon" }, { date: "1990-12-02", name: "Cold Moon" },
    // Add many more years...
    { date: "2023-01-06", name: "Wolf Moon" }, { date: "2023-02-05", name: "Snow Moon" }, { date: "2023-03-07", name: "Worm Moon" },
    { date: "2023-04-06", name: "Pink Moon" }, { date: "2023-05-05", name: "Flower Moon" }, { date: "2023-06-03", name: "Strawberry Moon" },
    { date: "2023-07-03", name: "Buck Moon" }, { date: "2023-08-01", name: "Sturgeon Moon" }, { date: "2023-08-30", name: "Blue Moon" }, // Example Blue Moon
    { date: "2023-09-29", name: "Harvest Moon" }, { date: "2023-10-28", name: "Hunter's Moon" }, { date: "2023-11-27", name: "Beaver Moon" },
    { date: "2023-12-26", name: "Cold Moon" },
    { date: "2024-01-25", name: "Wolf Moon" }, { date: "2024-02-24", name: "Snow Moon" }, { date: "2024-03-25", name: "Worm Moon" },
    { date: "2024-04-23", name: "Pink Moon" }, { date: "2024-05-23", name: "Flower Moon" }, { date: "2024-06-21", name: "Strawberry Moon" },
    { date: "2024-07-21", name: "Buck Moon" }, { date: "2024-08-19", name: "Sturgeon Moon" }, { date: "2024-09-17", name: "Harvest Moon" },
    { date: "2024-10-17", name: "Hunter's Moon" }, { date: "2024-11-15", name: "Beaver Moon" }, { date: "2024-12-15", name: "Cold Moon" },
    { date: "2025-01-13", name: "Wolf Moon" }, { date: "2025-02-12", name: "Snow Moon" }, { date: "2025-03-14", name: "Worm Moon" },
    { date: "2025-04-12", name: "Pink Moon" }, { date: "2025-05-12", name: "Flower Moon" }, { date: "2025-06-10", name: "Strawberry Moon" },
    { date: "2025-07-09", name: "Buck Moon" }, { date: "2025-08-08", name: "Sturgeon Moon" }, { date: "2025-09-06", name: "Harvest Moon" },
    { date: "2025-10-06", name: "Hunter's Moon" }, { date: "2025-11-04", name: "Beaver Moon" }, { date: "2025-12-04", name: "Cold Moon" },
    // Add future years (at least up to current year + 10)
    { date: "2026-01-02", name: "Wolf Moon" }, { date: "2026-02-01", name: "Snow Moon" }, { date: "2026-03-03", name: "Worm Moon" },
    // ... add many more ...
    { date: "2035-01-19", name: "Wolf Moon" }, { date: "2035-02-18", name: "Snow Moon" }, // Need data up to ~2035
];

// --- DOM Elements ---
const birthMonthEl = document.getElementById('birthMonth');
const birthDayEl = document.getElementById('birthDay');
const birthYearEl = document.getElementById('birthYear');
const calculateBtn = document.getElementById('calculateBtn');
const resultsEl = document.getElementById('results');
const displayDobEl = document.getElementById('displayDob');
const currentYearDisplayEl = document.getElementById('currentYearDisplay');
const currentLunarBirthdayEl = document.getElementById('current-lunar-birthday');
const pastListEl = document.getElementById('past-list');
const futureListEl = document.getElementById('future-list');
const errorMessageEl = document.getElementById('error-message');

// --- Global Variables ---
const today = dayjs(); // Use Day.js for current date
const currentYear = today.year();
const maxFutureYears = 10;

// --- Initialize ---
birthYearEl.max = currentYear; // Set max year for input
currentYearDisplayEl.textContent = currentYear;

// --- Functions ---

function isValidDate(year, month, day) {
    // Basic validation using Day.js parsing
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const d = dayjs(dateStr, 'YYYY-M-D', true); // Use strict parsing
    return d.isValid() && d.year() == year && d.month() + 1 == month && d.date() == day;
}

function findClosestFullMoon(targetDate) {
    let closestMoon = null;
    let minDiff = Infinity;
    const targetYear = targetDate.year();

    // Filter moons for the target year first for efficiency
    const moonsInYear = fullMoonData.filter(moon => dayjs(moon.date).year() === targetYear);

    if (moonsInYear.length === 0) {
        console.warn(`No full moon data found for year ${targetYear}`);
        return null; // No data for this year
    }

    moonsInYear.forEach(moon => {
        const moonDate = dayjs(moon.date); // Assuming UTC date from data
        const diff = Math.abs(targetDate.diff(moonDate, 'millisecond'));

        if (diff < minDiff) {
            minDiff = diff;
            closestMoon = moon;
        }
    });

    // Also check the last moon of the previous year and first of the next year
    // as they might be closer than any moon *within* the calendar year.
    const lastMoonPrevYear = fullMoonData.slice().reverse().find(moon => dayjs(moon.date).year() === targetYear - 1);
    const firstMoonNextYear = fullMoonData.find(moon => dayjs(moon.date).year() === targetYear + 1);

    [lastMoonPrevYear, firstMoonNextYear].forEach(moon => {
        if(moon) {
            const moonDate = dayjs(moon.date);
            const diff = Math.abs(targetDate.diff(moonDate, 'millisecond'));
            if (diff < minDiff) {
                minDiff = diff;
                closestMoon = moon;
            }
        }
    });


    return closestMoon;
}

function displayResults(dob, lunarBirthdays) {
    // Clear previous results
    pastListEl.innerHTML = '';
    futureListEl.innerHTML = '';
    currentLunarBirthdayEl.innerHTML = '';
    errorMessageEl.style.display = 'none';
    errorMessageEl.textContent = '';

    displayDobEl.textContent = dob.format('MMMM D, YYYY');

    const dobYear = dob.year();

    let foundCurrent = false;

    lunarBirthdays.sort((a, b) => a.year - b.year); // Ensure sorted by year

    lunarBirthdays.forEach(lb => {
        const listItem = document.createElement('li');
        if (lb.moon) {
            const moonDate = dayjs(lb.moon.date);
             listItem.innerHTML = `<strong>${lb.year}:</strong> ${moonDate.format('MMMM D, YYYY')} (${lb.moon.name})`;
        } else {
             listItem.innerHTML = `<strong>${lb.year}:</strong> No full moon data available or close enough.`;
             listItem.style.color = '#7f8c8d';
        }


        if (lb.year < currentYear) {
            pastListEl.appendChild(listItem);
        } else if (lb.year === currentYear) {
            currentLunarBirthdayEl.innerHTML = `<p>${listItem.innerHTML}</p>`; // Display prominently
            foundCurrent = true;
        } else {
            futureListEl.appendChild(listItem);
        }
    });

    if (!foundCurrent) {
         currentLunarBirthdayEl.innerHTML = `<p>No lunar birthday calculation available for ${currentYear}. Check data source.</p>`;
    }

    resultsEl.style.display = 'block';
}

function showError(message) {
    errorMessageEl.textContent = message;
    errorMessageEl.style.display = 'block';
    resultsEl.style.display = 'none'; // Hide results section on error
}

function calculateAndDisplay() {
    const month = parseInt(birthMonthEl.value, 10);
    const day = parseInt(birthDayEl.value, 10);
    const year = parseInt(birthYearEl.value, 10);

    // --- Validation ---
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
        showError("Please enter valid numbers for day and year.");
        return;
    }
    if (!isValidDate(year, month, day)) {
         showError(`Invalid date: ${month}/${day}/${year} is not a real date.`);
        return;
    }
     const dob = dayjs(`${year}-${month}-${day}`, 'YYYY-M-D', true); // Strict parse
     if (!dob.isValid()) { // Double check parsing
        showError("Could not parse the date of birth.");
        return;
    }
    if (dob.isAfter(today)) {
        showError("Date of Birth cannot be in the future.");
        return;
    }
    // Check if birth year is before available moon data
    const firstMoonYear = fullMoonData.length > 0 ? dayjs(fullMoonData[0].date).year() : currentYear;
    if (year < firstMoonYear) {
        showError(`Calculations are only supported from year ${firstMoonYear} due to available moon data.`);
        // Optionally, you could still proceed but warn the user
        // return;
    }


    // --- Calculation ---
    const lunarBirthdays = [];
    const startYear = year; // Start from the birth year
    const endYear = currentYear + maxFutureYears;

    for (let targetYear = startYear; targetYear <= endYear; targetYear++) {
        // Construct the anniversary date for the target year
        // Handle potential leap year issues if birthday is Feb 29
        let anniversaryDateStr = `${targetYear}-${month}-${day}`;
        let anniversaryDate = dayjs(anniversaryDateStr, 'YYYY-M-D', true);

        // If original was Feb 29 and target is not leap, use Feb 28
         if (month === 2 && day === 29 && !anniversaryDate.isValid()) {
             anniversaryDateStr = `${targetYear}-02-28`;
             anniversaryDate = dayjs(anniversaryDateStr, 'YYYY-M-D');
         }

        if (!anniversaryDate.isValid()) {
            console.warn(`Could not create valid anniversary date for ${targetYear}`);
            continue; // Skip this year if date is invalid
        }


        const closestMoon = findClosestFullMoon(anniversaryDate);
        lunarBirthdays.push({ year: targetYear, moon: closestMoon });
    }

    // --- Display ---
    displayResults(dob, lunarBirthdays);
}


// --- Event Listener ---
calculateBtn.addEventListener('click', calculateAndDisplay);
