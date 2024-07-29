<template>
  <div class="calendar-wrapper">
    <CalendarMonth :events="events" />
  </div>
</template>

<script setup>
import CalendarMonth from "./homemadecalendar/CalendarMonth.vue";
import { ref, watch, computed } from "vue";
import { generateUniqueId } from "../utils/generateUniqueId";

const props = defineProps({
  transactions: { type: Array, required: true },
});

const events = ref([]);

const sortedTransactions = computed(() => {
  return props.transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
});

function generateEvents(transactions) {
  const events = [];
  const today = new Date();
  const endOfYear = new Date(new Date().getFullYear(), 11, 31);
  let runningBalance = 0;
  let dateIdx = new Date(today.getFullYear(), today.getMonth(), 1);
  dateIdx.setHours(0, 0, 0, 0);

  // Calculate daily balance
  transactions.forEach((transaction) => {
    if (new Date(transaction.date) < dateIdx) {
      runningBalance += transaction.amount;
    }
  });

  while (dateIdx <= endOfYear) {
    const dateString = dateIdx.toISOString().split("T")[0];
    const matchingTransactions = transactions.filter((t) => {
      const transactionDateWithoutTime = t.date.split("T")[0];
      return transactionDateWithoutTime === dateString;
    });

    let dailyIncome = 0;
    let dailyExpense = 0;

    matchingTransactions.forEach((transaction) => {
      runningBalance += transaction.amount;
      if (transaction.amount >= 0) {
        dailyIncome += transaction.amount;
      } else {
        dailyExpense += Math.abs(transaction.amount);
      }
    });

    // Add a single event for the day with all necessary information
    events.push({
      title: `Daily Summary`,
      balance: runningBalance,
      income: dailyIncome,
      expense: dailyExpense,
      time: { start: new Date(dateIdx), end: new Date(dateIdx) },
      id: generateUniqueId(),
    });

    dateIdx.setDate(dateIdx.getDate() + 1);
  }

  return events;
}

watch(
  sortedTransactions,
  (newTransactions) => {
    events.value = generateEvents(newTransactions);
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss">
@import "qalendar/dist/style.css";

.calendar-wrapper {
  max-width: 100%;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .qalendar__month-view {
    min-width: 600px;
  }
}
</style>
