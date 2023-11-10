<template>
  <Qalendar :events="events" :config="config">
    <template #monthEvent="monthEventProps">
      <span>1{{ monthEventProps.eventData.title }}</span>
    </template>
  </Qalendar>
</template>

<script setup>
import { Qalendar } from 'qalendar';
import { ref, watch } from 'vue';

const props = defineProps({
  transactions: { type: Array, required: true },
});

const events = ref([]);
// watch(props, () => {
//   if (props.transactions.length === 0) return;
//   events.value = [];
//   for (let transaction of props.transactions) {
//     events.value.push({
//       title: transaction.title,
//       time: { start: transaction.date, end: transaction.date },
//       id: transaction.id,
//       color: transaction.amount > 0 ? 'green' : 'red',
//     });
//   }
// });
watch(props, () => {
  if (props.transactions.length === 0) return;
  events.value = [];
  const sortedTransactions = props.transactions.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let runningBalance = 0;

  for (let transaction of sortedTransactions) {
    runningBalance += transaction.amount;

    events.value.push({
      title: `${transaction.title}`,
      description: runningBalance.toFixed(2),
      time: { start: transaction.date, end: transaction.date },
      id: transaction.id,
      color: transaction.amount > 0 ? 'green' : 'red',
    });
  }
});
const config = ref({
  disableModes: ['week', 'day'],
  month: {
    // Hide leading and trailing dates in the month view (defaults to true when not set)
    showTrailingAndLeadingDates: false,
  },
  // Takes any valid locale that the browser understands. However, not all locales have been thorougly tested in Qalendar
  // If no locale is set, the preferred browser locale will be used

  defaultMode: 'month',
  // The silent flag can be added, to disable the development warnings. This will also bring a slight performance boost
  isSilent: true,
  showCurrentTime: true, // Display a line indicating the current time
});
</script>

<style lang="scss">
@import 'qalendar/dist/style.css';
</style>
