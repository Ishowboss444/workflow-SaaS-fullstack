<script setup>
import { Plus } from 'lucide-vue-next';
import StepperHeader from '../components/common/StepperHeader.vue';
import WorkerAssignRow from '../components/common/WorkerAssignRow.vue';
import AppButton from '../components/common/AppButton.vue';

const workers = [
  { name: 'مریم', color: '#f7d3e3', qty: 2000, price: 50000 },
  { name: 'بیتا', color: '#ffe0c2', qty: 2000, price: 50000 },
  { name: 'سارا', color: '#d8d3ff', qty: 2000, price: 50000 },
];
</script>

<template>
  <div class="page page--no-nav">
    <StepperHeader :current-step="4" />

    <div class="form-body">
      <h2 class="section-title">تقسیم کار</h2>

      <div class="worker-card">
        <WorkerAssignRow
          v-for="w in workers"
          :key="w.name"
          :name="w.name"
          :avatar-color="w.color"
          :qty="w.qty"
          :price="w.price"
        />
      </div>

      <button class="add-worker-btn">
        <Plus :size="16" />
        افزودن کارگر
      </button>

      <div class="totals">
        <div class="totals__row">
          <span>جمع اختصاص داده شده</span>
          <strong>6000</strong>
        </div>
        <div class="totals__row totals__row--muted">
          <span>باقی‌مانده</span>
          <strong>4000</strong>
        </div>
      </div>
    </div>

    <div class="form-footer">
      <router-link :to="{ name: 'add-job-3' }" class="footer-btn">
        <AppButton variant="outline">بازگشت</AppButton>
      </router-link>
      <router-link :to="{ name: 'success' }" class="footer-btn">
        <AppButton>ثبت سفارش</AppButton>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.form-body {
  @include page-padding;
  padding-top: $space-5;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  margin: 0 0 $space-4;
}

.worker-card {
  @include card;
  padding: 0 $space-4;
  margin-bottom: $space-4;
}

.add-worker-btn {
  width: 100%;
  height: 46px;
  border-radius: $radius-md;
  border: 1.5px dashed $color-primary-light;
  background: $color-bg-card;
  color: $color-primary;
  font-size: $font-size-md;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  margin-bottom: $space-5;
  cursor: pointer;
}

.totals {
  &__row {
    @include flex-between;
    font-size: $font-size-md;
    font-weight: 700;
    padding: $space-1 0;

    &--muted {
      color: $color-text-muted;
      font-weight: 600;
      font-size: $font-size-sm;
    }
  }
}

.form-footer {
  @include page-padding;
  margin-top: $space-4;
  display: flex;
  gap: $space-3;
}

.footer-btn {
  flex: 1;
  display: block;
}
</style>
