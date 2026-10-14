<script setup lang="ts">
import { X } from 'lucide-vue-next';

const name = defineModel('name', { type: String, default: 'unknows' });
const color = defineModel('color', { type: String, default: '#ffffff' });
const amount = defineModel('amount', { type: Number, default: 1 });
</script>

<template>
  <div>
    <header>
      <span>
        <X />
      </span>
    </header>

    <div>
      <label>
        <p>اسم</p>
        <input v-model="name" type="text" />
      </label>
      <label>
        <p>رنگ</p>
        <input v-model="color" type="color" />
      </label>
      <label>
        <p>تعداد</p>
        <input v-model.number="amount" type="number" />
      </label>
    </div>
  </div>
</template>
<style></style>
