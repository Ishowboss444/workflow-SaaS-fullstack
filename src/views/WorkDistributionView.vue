<script setup>
import { Search } from 'lucide-vue-next';
import PageHeader from '../components/common/PageHeader.vue';
import WorkerAssignRow from '../components/common/WorkerAssignRow.vue';
import AppButton from '../components/common/AppButton.vue';

const workers = [
  {
    name: 'مریم',
    color: '#f7d3e3',
    remaining: 'باقی‌مانده: 0',
    qty: 1000,
    price: 50000,
  },
  {
    name: 'بیتا',
    color: '#ffe0c2',
    remaining: 'باقی‌مانده: 1000',
    qty: 1000,
    price: 50000,
  },
  {
    name: 'نگار',
    color: '#d8d3ff',
    remaining: 'باقی‌مانده: 2000',
    qty: 2000,
    price: 50000,
  },
];
</script>

<template>
  <div class="page page--no-nav">
    <PageHeader title="پخش کار" />

    <div class="search-bar">
      <Search :size="18" />
      <input type="text" placeholder="جستجوی کارگر..." />
    </div>

    <div class="worker-card">
      <WorkerAssignRow
        v-for="w in workers"
        :key="w.name"
        :name="w.name"
        :avatar-color="w.color"
        :remaining-label="w.remaining"
        :qty="w.qty"
        :price="w.price"
      />
    </div>

    <div class="form-footer">
      <router-link :to="{ name: 'success' }" class="footer-link">
        <AppButton>ثبت و ارسال</AppButton>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.search-bar {
  @include page-padding;
  display: flex;
  align-items: center;
  gap: $space-2;
  margin: 0 $space-4 $space-4;
  background: $color-bg-card;
  border-radius: $radius-md;
  padding: $space-3 $space-4;
  color: $color-text-muted;

  input {
    flex: 1;
    border: none;
    background: none;
    font-size: $font-size-sm;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $color-text-muted;
    }
  }
}

.worker-card {
  @include card;
  margin: 0 $space-4;
  padding: 0 $space-4;
}

.form-footer {
  @include page-padding;
  margin-top: $space-6;
}

.footer-link {
  display: block;
}
</style>
