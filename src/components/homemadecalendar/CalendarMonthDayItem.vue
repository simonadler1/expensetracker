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
    events: Array,
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
      const lastEvent = this.dayEvents[this.dayEvents.length - 1];
      return lastEvent ? this.getBalanceFromEvent(lastEvent) : 0;
    },
    income() {
      return this.dayEvents.reduce((total, event) => {
        const amount = this.getAmountFromEvent(event);
        return amount > 0 ? total + amount : total;
      }, 0);
    },
    expense() {
      return this.dayEvents.reduce((total, event) => {
        const amount = this.getAmountFromEvent(event);
        return amount < 0 ? total - amount : total;
      }, 0);
    },
    formattedBalance() {
      return this.balance.toFixed(2);
    },
    formattedIncome() {
      return this.income.toFixed(2);
    },
    formattedExpense() {
      return this.expense.toFixed(2);
    },
    hasTransactions() {
      return this.income > 0 || this.expense > 0;
    },
  },

  methods: {
    getBalanceFromEvent(event) {
      const balancePart = event.title.split("\n").find((part) => part.startsWith("Balance:"));
      if (balancePart) {
        return parseFloat(balancePart.split(":")[1].trim()) || 0;
      }
      return 0;
    },
    getAmountFromEvent(event) {
      return 0;
      const amount = parseFloat(event.description.split(":")[1].trim()) || 0;
      return event.description.startsWith("Income") ? amount : -amount;
    },
  },
};
</script>

<style scoped>
/* ... (styles remain unchanged) ... */
</style>
