<template>
  <h3>History</h3>
  <ul id="list" class="list">
    <li v-for="transaction in transactions" :class="transaction.amount < 0 ? 'minus' : 'plus'" :key="transaction.id">
      {{ transaction.title }} <span>${{ transaction.amount }}</span>
      <span>{{ dayjs(transaction.date).format("YYYY-MM-DD") }}</span>
      <button @click="deleteTransaction(transaction.id)" class="delete-btn">x</button>
    </li>
  </ul>
</template>

<script setup>
import dayjs from "dayjs";

const props = defineProps({
  transactions: { type: Array, required: true },
});

const emits = defineEmits(["transactionDeleted"]);

const deleteTransaction = (transactionId) => {
  emits("transactionDeleted", transactionId);
};
</script>
