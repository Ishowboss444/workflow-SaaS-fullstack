<script setup>
import JobDetailHeader from '../components/common/JobDetailHeader.vue';
import WorkerProgressRow from '../components/common/WorkerProgressRow.vue';
import AppButton from '../components/common/AppButton.vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/useProductStore.js';
import { ref, onMounted } from 'vue';
import Loading from '@/components/common/Loading.vue';

const route = useRoute();
const product = useProductStore();
const data = ref([]);
onMounted(async () => {
  const id = route.params.id;
  const response = await product._getProduct(id);
  data.value = response.data;
  console.log(data.value.colors);
});
const workers = [
  { name: 'مریم', color: '#f7d3e3', assigned: 2000, done: 1850, percent: 92 },
  { name: 'بیتا', color: '#ffe0c2', assigned: 2000, done: 1200, percent: 60 },
  { name: 'سارا', color: '#d8d3ff', assigned: 1600, done: 1600, percent: 100 },
];
</script>

<template>
  <div class="page" v-if="!product.loading">
    <JobDetailHeader active-tab="workers" :data="data" />

    <div class="tab-body">
      <div class="worker-card">
        <WorkerProgressRow
          v-for="w in workers"
          :key="w.name"
          :name="w.name"
          :avatar-color="w.color"
          :assigned="w.assigned"
          :done="w.done"
          :percent="w.percent"
        />
      </div>

      <AppButton variant="outline">مشاهده همه کارگرها</AppButton>
    </div>
  </div>
  <Loading v-else />
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.tab-body {
  @include page-padding;
  padding-top: $space-4;
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.worker-card {
  @include card;
  padding: $space-1 $space-4;

  > * + * {
    border-top: 1px solid $color-border-soft;
  }
}
</style>
