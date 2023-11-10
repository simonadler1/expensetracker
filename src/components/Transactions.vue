<template>
  <h3>History</h3>
  <ul id="list" class="list">
    <li
      v-for="transaction in transactions"
      :class="transaction.amount < 0 ? 'minus' : 'plus'"
    >
      {{ transaction.title }} <span>${{ transaction.amount }}</span
      ><span>{{ transaction.date }}</span
      ><button @click="deleteTransaction(transaction.id)" class="delete-btn">
        x
      </button>
    </li>
  </ul>
</template>
<script setup>
const props = defineProps({
  transactions: { type: Array, required: true },
});
const emits = defineEmits('transactionDeleted');
const deleteTransaction = (transactionId) => {
  emits('transactionDeleted', transactionId);
};
</script>
