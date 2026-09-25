<script setup>
import JobDetailHeader from '../components/common/JobDetailHeader.vue';
import WorkerProgressRow from '../components/common/WorkerProgressRow.vue';
import AppButton from '../components/common/AppButton.vue';

const workers = [
  { name: 'مریم', color: '#f7d3e3', assigned: 2000, done: 1850, percent: 92 },
  { name: 'بیتا', color: '#ffe0c2', assigned: 2000, done: 1200, percent: 60 },
  { name: 'سارا', color: '#d8d3ff', assigned: 1600, done: 1600, percent: 100 },
];
</script>

<template>
  <div class="page">
    <JobDetailHeader active-tab="workers" />

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
