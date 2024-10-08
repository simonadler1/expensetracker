<template>
  <div class="calendar-month">
    <div class="calendar-month-header">
      <CalendarDateIndicator :selected-date="selectedDate" class="calendar-month-header-selected-month" />

      <CalendarDateSelector :current-date="today" :selected-date="selectedDate" @dateSelected="selectDate" />
    </div>

    <CalendarWeekdays />

    <ol class="days-grid">
      <CalendarMonthDayItem
        v-for="day in days"
        :key="day.date"
        :day="day"
        :isToday="day.date === today"
        :isCurrentMonth="day.isCurrentMonth"
        :events="getEventsForDay(day.date)"
      />
    </ol>
  </div>
</template>

<script>
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import utc from "dayjs/plugin/utc";

import CalendarMonthDayItem from "./CalendarMonthDayItem.vue";
import CalendarDateIndicator from "./CalendarDateIndicator.vue";
import CalendarDateSelector from "./CalendarDateSelector.vue";
import CalendarWeekdays from "./CalendarWeekdays.vue";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(utc);
export default {
  name: "CalendarMonth",
  props: {
    events: Array,
  },

  components: {
    CalendarMonthDayItem,
    CalendarDateIndicator,
    CalendarDateSelector,
    CalendarWeekdays,
  },

  data() {
    return {
      selectedDate: dayjs(),
    };
  },

  computed: {
    days() {
      return [...this.previousMonthDays, ...this.currentMonthDays, ...this.nextMonthDays];
    },

    today() {
      return dayjs().format("YYYY-MM-DD");
    },

    month() {
      return Number(this.selectedDate.format("M"));
    },

    year() {
      return Number(this.selectedDate.format("YYYY"));
    },

    numberOfDaysInMonth() {
      return dayjs(this.selectedDate).daysInMonth();
    },

    currentMonthDays() {
      return [...Array(this.numberOfDaysInMonth)].map((day, index) => {
        return {
          date: dayjs(`${this.year}-${this.month}-${index + 1}`)
            .toISOString()
            .split("T")[0],
          isCurrentMonth: true,
        };
      });
    },

    previousMonthDays() {
      const firstDayOfTheMonthWeekday = this.getWeekday(this.currentMonthDays[0].date);
      const previousMonth = dayjs(`${this.year}-${this.month}-01`).subtract(1, "month");

      // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
      const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;

      const previousMonthLastMondayDayOfMonth = dayjs(this.currentMonthDays[0].date)
        .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
        .date();

      return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
        return {
          date: dayjs(
            `${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`
          ).format("YYYY-MM-DD"),
          isCurrentMonth: false,
        };
      });
    },

    nextMonthDays() {
      const lastDayOfTheMonthWeekday = this.getWeekday(`${this.year}-${this.month}-${this.currentMonthDays.length}`);

      const nextMonth = dayjs(`${this.year}-${this.month}-01`).add(1, "month");

      const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
        ? 7 - lastDayOfTheMonthWeekday
        : lastDayOfTheMonthWeekday;

      return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
        return {
          date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format("YYYY-MM-DD"),
          isCurrentMonth: false,
        };
      });
    },
  },

  methods: {
    getEventsForDay(date) {
      return this.events.filter((event) => {
        return dayjs.utc(event.time.start).format("YYYY-MM-DD") === dayjs.utc(date).format("YYYY-MM-DD");
      });
    },
    getWeekday(date) {
      return dayjs(date).weekday();
    },

    selectDate(newSelectedDate) {
      this.selectedDate = newSelectedDate;
    },
  },
};
</script>

<style scoped>
.calendar-month {
  position: relative;
  background-color: var(--grey-200);
  border: solid 1px var(--grey-300);
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.day-of-week {
  color: var(--grey-800);
  font-size: 18px;
  background-color: #fff;
  padding-bottom: 5px;
  padding-top: 10px;
}

.day-of-week,
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-of-week > * {
  text-align: right;
  padding-right: 5px;
}

.days-grid {
  height: 100%;
  position: relative;
  grid-column-gap: var(--grid-gap);
  grid-row-gap: var(--grid-gap);
  border-top: solid 1px var(--grey-200);
}

/* Responsive styles */
@media screen and (min-width: 768px) {
  .calendar-month {
    max-width: 90%;
  }

  .day-of-week,
  .days-grid {
    font-size: 1.1em;
  }

  .days-grid {
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }
}

@media screen and (min-width: 1024px) {
  .calendar-month {
    max-width: 95%;
  }

  .day-of-week,
  .days-grid {
    font-size: 1.2em;
  }

  .days-grid {
    grid-column-gap: 15px;
    grid-row-gap: 15px;
  }
}

@media screen and (min-width: 1440px) {
  .calendar-month {
    max-width: 1400px;
  }

  .day-of-week,
  .days-grid {
    font-size: 1.3em;
  }

  .days-grid {
    grid-column-gap: 20px;
    grid-row-gap: 20px;
  }
}
</style>
