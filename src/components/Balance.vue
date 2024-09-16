<template>
  <h4>Your Current Balance</h4>
  <h1 id="balance">${{ total }}</h1>
</template>
<script setup>
const props = defineProps({
  total: String,
});
</script>
