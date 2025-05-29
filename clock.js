// makes all the clock tick marks show up
function cloneTicks() {
	// make the big ticks (for every 5 minutes, so 12 total)
	for (let i = 1; i <= 12; i++) {
		const el = document.querySelector(".fiveminutes");
		const clone = el.cloneNode(true);
		clone.className = `fiveminutes f${i}`;
		document.getElementById("clockface").appendChild(clone);
		clone.style.transform = `rotate(${30 * i}deg)`; // 360/12 = 30 deg per tick
	}

	// make the small ticks (for every minute, so 60 total)
	for (let i = 1; i <= 60; i++) {
		const el = document.querySelector(".minutes");
		const clone = el.cloneNode(true);
		clone.className = `minutes m${i}`;
		document.getElementById("clockface").appendChild(clone);
		clone.style.transform = `rotate(${6 * i}deg)`; // 360/60 = 6 deg per tick
	}
}

cloneTicks(); // run so ticks actually show up

// grabbing all the stuff from the html we need to work with
const sechand = document.querySelector('.sec');
const minhand = document.querySelector('.min');
const hourhand = document.querySelector('.hour');
const timezoneSelect = document.getElementById('timezone-select');
const digitalTime = document.getElementById('digital-time');
const dateDisplay = document.getElementById('date-display');

const hourInput = document.getElementById('hour');
const minuteInput = document.getElementById('minute');
const ampmInput = document.getElementById('ampm');
const setTimeBtn = document.getElementById('set-time-btn');
const clearTimeBtn = document.getElementById('clear-time-btn');

// this holds the timezone we’re using, or a custom time if set
let currentTimeZone = timezoneSelect.value;
let customTime = null;
let customTimeInterval = null; // used later when ticking the custom time

// put 1-12 into the hour dropdown
for (let h = 1; h <= 12; h++) {
	hourInput.innerHTML += `<option value="${h}">${h}</option>`;
}

// put 00-59 into the minute dropdown
for (let m = 0; m < 60; m++) {
	minuteInput.innerHTML += `<option value="${m}">${m.toString().padStart(2, '0')}</option>`;
}

// this gets the current time in the selected timezone
function getTimeInZone(zone) {
	const now = new Date();

	// if we're using the computer's local time
	if (zone === "local") {
		return {
			hour: now.getHours(),
			minute: now.getMinutes(),
			second: now.getSeconds(),
			date: now.toDateString()
		};
	}

	// if picked real timezone, get the time parts from it
	const timeFormatter = new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: false,
		timeZone: zone
	});

	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: zone
	});

	const parts = timeFormatter.formatToParts(now);
	const getPart = (type) => parts.find(p => p.type === type).value;

	// returns an object with time info and date string
	return {
		hour: parseInt(getPart("hour")),
		minute: parseInt(getPart("minute")),
		second: parseInt(getPart("second")),
		date: dateFormatter.format(now)
	};
}

// updates both the analog and digital clock
function setTime() {
	let hour, minute, second, date;

	// if we're using a custom time, use that
	if (customTime) {
		({ hour, minute, second, date } = customTime);
	} else {
		// otherwise use regular time
		({ hour, minute, second, date } = getTimeInZone(currentTimeZone));
	}

	// rotate clock hands to match current time
	sechand.style.transform = `rotate(${(second / 60) * 360}deg)`;
	minhand.style.transform = `rotate(${(minute / 60) * 360}deg)`;
	hourhand.style.transform = `rotate(${((hour + minute / 60) / 12) * 360}deg)`;

	// set digital time
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const displayHour = (hour % 12) || 12;
	const displayMinute = minute.toString().padStart(2, '0');
	const displaySecond = second.toString().padStart(2, '0');

	digitalTime.textContent = `${displayHour}:${displayMinute}:${displaySecond} ${ampm}`;
	dateDisplay.textContent = date;
}

// if you change timezone from the dropdown
timezoneSelect.addEventListener('change', function () {
	currentTimeZone = this.value;
	customTime = null; // stop using custom time if it's active
	clearInterval(customTimeInterval); // also stop its ticking
});

// clicking set time
setTimeBtn.addEventListener('click', () => {
	// grab the hour, minute, and am/pm from the inputs
	const hour = parseInt(hourInput.value);
	const minute = parseInt(minuteInput.value);
	const ampm = ampmInput.value;

	// convert to 24 hr format
	let hour24 = ampm === "PM" ? (hour % 12) + 12 : (hour % 12);

	// make custom time object
	customTime = {
		hour: hour24,
		minute: minute,
		second: 0,
		date: "custom time"
	};

	// stop any existing custom interval before starting new one
	if (customTimeInterval) {
		clearInterval(customTimeInterval);
	}

	// every second, tick custom clock forward
	customTimeInterval = setInterval(() => {
		customTime.second++;

		if (customTime.second === 60) {
			customTime.second = 0;
			customTime.minute++;
		}

		if (customTime.minute === 60) {
			customTime.minute = 0;
			customTime.hour++;
		}

		if (customTime.hour === 24) {
			customTime.hour = 0;
		}

		setTime();
	}, 1000);

	setTime();
});

// clicking clear custom time button
clearTimeBtn.addEventListener('click', () => {
	customTime = null;
	clearInterval(customTimeInterval);
	setTime();
});

// update the clock every second
setInterval(setTime, 1000);
setTime(); // set right away on load
