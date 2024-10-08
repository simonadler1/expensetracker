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
  let initialBalance = 0;
  let currentDate = new Date(today);
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate <= endOfYear) {
    const dateString = currentDate.toISOString().split("T")[0];
    const matchingTransactions = transactions.filter((t) => t.date === dateString);

    if (matchingTransactions.length > 0) {
      matchingTransactions.forEach((transaction) => {
        events.push({
          title: transaction.title,
          runningBalance: initialBalance + transaction.amount,
          description: `${transaction.amount >= 0 ? "Income" : "Expense"}: $${Math.abs(transaction.amount).toFixed(2)}`,
          time: {
            start: new Date(currentDate).toISOString().split("T")[0],
            end: new Date(currentDate).toISOString().split("T")[0],
          },
          id: transaction.id,
          color: transaction.amount >= 0 ? "green" : "red",
        });
      });
      initialBalance += matchingTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    } else {
      events.push({
        runningBalance: initialBalance,
        description: `Daily Balance`,
        id: generateUniqueId(),
        time: {
          start: new Date(currentDate).toISOString().split("T")[0],
          end: new Date(currentDate).toISOString().split("T")[0],
        },
        color: "blue",
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
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
