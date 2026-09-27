<template>
    <h1 v-if="products.loading">loading...</h1>
    <div v-else>
        <button @click="data">add product</button>
        <button @click="get">get product</button>
    </div>
</template>
<script setup lang="ts">
import { useProductStore } from '@/stores/useProductStore';
const products = useProductStore()

const colors = [
  {
    color: 'blue',
    amount: 2000,
  },
  {
    color: 'yellow',
    amount: 2000,
  },
  {
    color: 'red',
    amount: 2000,
  },
];
const data = async () => {
  const data = await products._addProduct({
    name: 't-shirt',
    description: 'yh',
    colors: colors,
    amount: 6000,
    workplaceId: 8,
  });
  console.log(data);
};
const get = async () => {
  const data = await products._getProduct();
  console.log(data);
};


</script>
