<script setup>
import { ref, onMounted } from 'vue';
import { X } from 'lucide-vue-next';
import { Toaster } from 'vue-sonner';
</script>

<template>
  <div class="container app-shell">
    <router-view></router-view>
    <toaster position="bottom-left" />
  </div>
</template>

<style scoped></style>
