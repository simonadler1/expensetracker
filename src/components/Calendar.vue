<template>
  <CalendarMonth :events="events" />
</template>

<script setup>
import CalendarMonth from './homemadecalendar/CalendarMonth.vue';
import { ref, watch, defineProps } from 'vue';
import { format } from 'date-fns'; // Import date-fns for date formatting
import { generateUniqueId } from '../utils/generateUniqueId';

const props = defineProps({
  transactions: { type: Array, required: true },
});

const events = ref([]);

function generateEventsForEmptyDays(transactions) {
  const events = [];
  const today = new Date(); // Start of next year
  const endOfYear = new Date(new Date().getFullYear(), 11, 31); // End of next year

  let runningBalance = 0;

  while (today <= endOfYear) {
    const formattedDate = format(today, 'yyyy-MM-dd'); // Format the date

    const matchingTransaction = transactions.find(
      (transaction) => transaction.date === formattedDate
    );

    if (matchingTransaction) {
      runningBalance += matchingTransaction.amount;
    }

    events.push({
      title: `Balance: ${runningBalance.toFixed(2)}`,
      description: `Balance: ${runningBalance.toFixed(2)}`,
      id: generateUniqueId(),
      time: { start: formattedDate, end: formattedDate },
    });

    today.setDate(today.getDate() + 1);
  }

  return events;
}

watch(props, () => {
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
});

const config = ref({
  disableModes: ['week', 'day'],
  month: {
    showTrailingAndLeadingDates: false,
  },
  defaultMode: 'month',
  isSilent: true,
  showCurrentTime: true,
});
</script>

<style lang="scss">
@import 'qalendar/dist/style.css';
</style>
