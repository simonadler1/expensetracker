<template>
  <div class="inc-exp-container">
    <div>
      <h4>Upcoming Income</h4>
      <p id="money-plus" class="money plus">+${{ income }}</p>
    </div>
    <div>
      <h4>Upcoming Expenses</h4>
      <p id="money-minus" class="money minus">-${{ expenses }}</p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  income: String,
  expenses: String,
});
</script>
