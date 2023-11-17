<template>
  <Header></Header>
  <div class="container">
    <Balance :total="+total" />
    <Calendar :transactions="transactions" />
    <IncomeExpenses :income="+income" :expenses="+expenses" />
    <Transactions
      :transactions="transactions"
      @transactionDeleted="handleTransactionDeleted"
    />
    <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Balance from './components/Balance.vue';
import Calendar from './components/Calendar.vue';
import IncomeExpenses from './components/IncomeExpenses.vue';
import Transactions from './components/Transactions.vue';
import AddTransaction from './components/AddTransaction.vue';
import { ref, computed, onBeforeMount } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

onBeforeMount(() => {
  let savedTransactions = JSON.parse(localStorage.getItem('transactions'));
  // remove old transactions
  // savedTransactions = savedTransactions.filter((x) => {
  //   return new Date(x.date) >= new Date();
  // });
  if (savedTransactions) {
    transactions.value = savedTransactions;
  }
});

const transactions = ref([]);
const total = computed(() => {
  return transactions.value
    .reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
    .toFixed(2);
});
const income = computed(() => {
  return transactions.value
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
    .toFixed(2);
});
const expenses = computed(() => {
  return transactions.value
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
    .toFixed(2);
});

const handleTransactionSubmitted = (transactionData) => {
  transactions.value.push({
    id: generateUniqueId(),
    title: transactionData.title,
    amount: transactionData.amount,
    date: transactionData.date ? transactionData.date : 'None Selected',
  });
  saveTransactionsToLocalStorage();
  toast.success('Transaction added');
};

const handleTransactionDeleted = (transactionId) => {
  transactions.value = transactions.value.filter(
    (transaction) => transaction.id !== transactionId
  );
  saveTransactionsToLocalStorage();
  toast.success('Transaction successfully deleted');
};

const generateUniqueId = () => {
  return Math.floor(Math.random() * 10000);
};
const saveTransactionsToLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions.value));
};
</script>

<style lang="scss" scoped></style>
