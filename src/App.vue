<script setup>
import { ref , onMounted } from 'vue'
import {X} from 'lucide-vue-next'
import { Toaster } from 'vue-sonner';
</script>

<template>
  <div class="container">
    <router-view></router-view>
  </div>
  <toaster
  position="bottom-left"
  />
</template>

<style scoped></style>
