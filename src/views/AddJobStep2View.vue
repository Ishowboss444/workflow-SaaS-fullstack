<script setup>
import { Plus, CircleCheck } from 'lucide-vue-next';
import StepperHeader from '../components/common/StepperHeader.vue';
import AppButton from '../components/common/AppButton.vue';

const colors = [
  { name: 'مشکی', qty: 7000, hex: '#2b2130' },
  { name: 'صورتی', qty: 3000, hex: '#e83e8c' },
];
</script>

<template>
  <div class="page page--no-nav">
    <StepperHeader :current-step="2" />

    <div class="form-body">
      <h2 class="section-title">رنگ‌ها و تنوع</h2>

      <div class="color-list">
        <div v-for="c in colors" :key="c.name" class="color-row">
          <span class="color-row__qty">{{ c.qty.toLocaleString() }} عدد</span>
          <span class="color-row__name">{{ c.name }}</span>
          <span class="color-row__swatch" :style="{ background: c.hex }" />
        </div>
      </div>

      <button class="add-color-btn">
        <Plus :size="16" />
        افزودن رنگ
      </button>

      <div class="total-field">
        <span class="total-field__label">جمع کل</span>
        <div class="total-field__control">
          <CircleCheck :size="18" class="total-field__check" />
          <span>10000 / 10000</span>
        </div>
      </div>
    </div>

    <div class="form-footer">
      <router-link :to="{ name: 'add-job-1' }" class="footer-btn">
        <AppButton variant="outline">بازگشت</AppButton>
      </router-link>
      <router-link :to="{ name: 'add-job-3' }" class="footer-btn">
        <AppButton>ادامه</AppButton>
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

.color-list {
  @include card;
  padding: 0 $space-4;
  margin-bottom: $space-4;
}

.color-row {
  @include flex-between;
  padding: $space-4 0;
  border-bottom: 1px solid $color-border-soft;

  &:last-child {
    border-bottom: none;
  }

  &__qty {
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__name {
    font-size: $font-size-md;
    font-weight: 600;
    flex: 1;
    text-align: center;
  }

  &__swatch {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid $color-bg-card;
    box-shadow: 0 0 0 1px $color-border;
  }
}

.add-color-btn {
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

.total-field {
  &__label {
    display: block;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-bottom: $space-2;
  }

  &__control {
    @include flex-center;
    gap: $space-2;
    height: 50px;
    background: $color-status-done-bg;
    border-radius: $radius-md;
    color: $color-status-done-text;
    font-weight: 700;
  }

  &__check {
    color: $color-status-done-text;
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
