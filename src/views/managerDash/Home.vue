<template>
  <div>
    <Button @click="router.push({ name: 'register' })">signup</Button>
    <Button @click="router.push({ name: 'login' })">login</Button>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>
