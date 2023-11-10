<template>
  <h3>Add new transaction</h3>
  <form id="form" @submit.prevent="onSubmit">
    <div class="form-control">
      <label for="text">Title</label>
      <input
        type="text"
        v-model="title"
        id="text"
        placeholder="Enter text..."
      />
    </div>
    <div class="form-control">
      <label for="date">Date</label>
      <input
        type="date"
        v-model="date"
        id="date"
        placeholder="Enter Event Date"
      />
    </div>
    <div class="form-control">
      <label for="amount"
        >Amount <br />
        (negative - expense, positive - income)</label
      >
      <input
        type="text"
        id="amount"
        v-model="amount"
        placeholder="Enter amount..."
      />
    </div>
    <button class="btn">Add transaction</button>
  </form>
</template>
<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const emit = defineEmits('transactionSubmitted');

const title = ref('');
const date = ref('');
const amount = ref('');

const onSubmit = () => {
  if (!title.value || !amount.value) {
    toast.error('Transaction must have a title and an amount');
    return;
  }
  const transactionData = {
    title: title.value,
    date: date.value,
    amount: parseFloat(amount.value),
  };
  emit('transactionSubmitted', transactionData);

  title.value = '';
  amount.value = '';
};
</script>
