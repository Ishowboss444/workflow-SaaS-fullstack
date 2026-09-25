<script setup>
import { Check, X } from 'lucide-vue-next';

const props = defineProps({
  currentStep: { type: Number, required: true }, // 1-based
  title: { type: String, default: 'افزودن کار جدید' },
});

const steps = [
  { n: 1, label: 'مشخصات کار' },
  { n: 2, label: 'رنگ‌ها' },
  { n: 3, label: 'قیمت' },
  { n: 4, label: 'تقسیم کار' },
];
</script>

<template>
  <header class="stepper-header">
    <div class="stepper-header__top">
      <h1 class="stepper-header__title">{{ title }}</h1>
      <button class="stepper-header__close" aria-label="بستن">
        <X :size="20" />
      </button>
    </div>

    <div class="stepper-header__steps">
      <div
        v-for="step in steps"
        :key="step.n"
        class="step"
        :class="{
          'step--done': step.n < currentStep,
          'step--active': step.n === currentStep,
        }"
      >
        <span class="step__circle">
          <Check v-if="step.n < currentStep" :size="14" />
          <template v-else>{{ step.n }}</template>
        </span>
        <span class="step__label">{{ step.label }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.stepper-header {
  @include page-padding;
  padding-top: $space-5;
  padding-bottom: $space-4;
  background: $color-bg-card;
  border-bottom-left-radius: $radius-lg;
  border-bottom-right-radius: $radius-lg;

  &__top {
    @include flex-between;
    margin-bottom: $space-5;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 700;
    margin: 0;
  }

  &__close {
    @include flex-center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    background: $color-bg-soft;
    color: $color-text-secondary;
    cursor: pointer;
  }

  &__steps {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  flex: 1;

  &__circle {
    @include flex-center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: $color-bg-soft;
    color: $color-text-muted;
    font-size: $font-size-xs;
    font-weight: 700;
    border: 2px solid transparent;
  }

  &__label {
    font-size: $font-size-xs;
    color: $color-text-muted;
    white-space: nowrap;
  }

  &--active {
    .step__circle {
      background: $color-primary;
      color: $color-text-on-primary;
      border-color: $color-primary-light;
    }
    .step__label {
      color: $color-primary;
      font-weight: 600;
    }
  }

  &--done {
    .step__circle {
      background: $color-primary-light;
      color: $color-primary-dark;
    }
    .step__label {
      color: $color-text-secondary;
    }
  }
}
</style>
