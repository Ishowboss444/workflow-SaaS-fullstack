<script setup lang="ts">
import { X } from 'lucide-vue-next';

// defineProps({
//     name : {type : String , require : true},
//     color : {type : String , require : true},
//     amount : {type : Number , require : true},
// })
const name = defineModel('name', { default: 'unknows' });
const color = defineModel('color', { default: '#ffffff' });
const amount = defineModel('amount', { default: 1 });
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
