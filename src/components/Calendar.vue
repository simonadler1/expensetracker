<template>
  <CalendarMonth :events="events" />
</template>

<script setup>
import CalendarMonth from './homemadecalendar/CalendarMonth.vue';
import { ref, watch, defineProps } from 'vue';
import { generateUniqueId } from '../utils/generateUniqueId';

const props = defineProps({
  transactions: { type: Array, required: true },
});

const events = ref([]);

function generateEventsForEmptyDays(transactions) {
  const events = [];
  const today = new Date();
  const endOfYear = new Date(new Date().getFullYear(), 11, 31); // End of year

  let runningBalance = 0;

  while (today <= endOfYear) {
    const matchingTransaction = transactions.find(
      (transaction) => transaction.date === today
    );

    if (matchingTransaction) {
      runningBalance += matchingTransaction.amount;
    }

    events.push({
      title: `Balance: ${runningBalance.toFixed(2)}`,
      description: `Balance: ${runningBalance.toFixed(2)}`,
      id: generateUniqueId(),
      time: { start: today, end: today },
    });

    today.setDate(today.getDate() + 1);
  }

  return events;
}

watch(
  props,
  () => {
    if (props.transactions.length === 0) return;
    const sortedTransactions = props.transactions.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let runningBalance = 0;

    events.value = [];

    for (let transaction of sortedTransactions) {
      runningBalance += transaction.amount;
      events.value.push({
        title: `${transaction.title} \n ${runningBalance.toFixed(2)}`,
        description: runningBalance.toFixed(2),
        time: { start: transaction.date, end: transaction.date },
        id: transaction.id,
        color: transaction.amount > 0 ? 'green' : 'red',
      });
    }
    const balanceEvents = generateEventsForEmptyDays(sortedTransactions);

    events.value.push(...balanceEvents);
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss">
@import 'qalendar/dist/style.css';
</style>
