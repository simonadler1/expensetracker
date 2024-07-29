<template>
  <li
    class="calendar-day"
    :class="{
      'calendar-day--not-current': !day.isCurrentMonth,
      'calendar-day--today': isToday,
    }"
  >
    <span>{{ label }}</span>
    <div class="day-content">
      <div class="balance">Balance: {{ formattedBalance }}</div>
      <div v-if="hasTransactions" class="transactions">
        <div v-if="income > 0" class="income">Income: {{ formattedIncome }}</div>
        <div v-if="expense > 0" class="expense">Expense: {{ formattedExpense }}</div>
      </div>
    </div>
  </li>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "CalendarMonthDayItem",

  props: {
    events: {
      type: Array,
      required: true
    },
    day: {
      type: Object,
      required: true,
    },
    isCurrentMonth: {
      type: Boolean,
      default: false,
    },
    isToday: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    label() {
      return dayjs(this.day.date).format("D");
    },
    dayEvents() {
      return this.events.filter((event) => dayjs(event.time.start).isSame(this.day.date, "day"));
    },
    balance() {
      return this.dayEvents.length > 0 ? this.dayEvents[this.dayEvents.length - 1].balance : 0;
    },
    income() {
      return this.dayEvents.reduce((total, event) => total + event.income, 0);
    },
    expense() {
      return this.dayEvents.reduce((total, event) => total + event.expense, 0);
    },
    formattedBalance() {
      return `$${this.balance.toFixed(2)}`;
    },
    formattedIncome() {
      return `$${this.income.toFixed(2)}`;
    },
    formattedExpense() {
      return `$${this.expense.toFixed(2)}`;
    },
    hasTransactions() {
      return this.income > 0 || this.expense > 0;
    },
  },
};
</script>

<style scoped>
.calendar-day {
  position: relative;
  min-height: 120px;
  font-size: 14px;
  background-color: #fff;
  color: var(--grey-800);
  padding: 5px;
  display: flex;
  flex-direction: column;
}

.calendar-day > span {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 2px;
  width: var(--day-label-size);
  height: var(--day-label-size);
}

.calendar-day--not-current {
  background-color: var(--grey-100);
  color: var(--grey-300);
}

.calendar-day--today {
  padding-top: 4px;
}

.calendar-day--today > span {
  color: #fff;
  border-radius: 9999px;
  background-color: var(--grey-800);
}

.day-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  padding-top: 20px;
}

.balance {
  font-weight: bold;
  margin-bottom: 5px;
}

.transactions {
  font-size: 12px;
}

.income {
  color: green;
}

.expense {
  color: red;
}

@media screen and (min-width: 768px) {
  .calendar-day {
    font-size: 16px;
    min-height: 140px;
  }

  .transactions {
    font-size: 14px;
  }
}

@media screen and (min-width: 1024px) {
  .calendar-day {
    min-height: 160px;
  }
}
</style>