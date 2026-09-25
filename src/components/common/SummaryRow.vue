<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  emphasis: { type: Boolean, default: false }, // highlight (e.g. net profit)
});
</script>

<template>
  <div class="summary-row" :class="{ 'summary-row--emphasis': emphasis }">
    <span class="summary-row__label">{{ label }}</span>
    <span class="summary-row__value">{{ value }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.summary-row {
  @include flex-between;
  padding: $space-3 0;
  border-bottom: 1px solid $color-border-soft;

  &:last-child {
    border-bottom: none;
  }

  &__label {
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__value {
    font-size: $font-size-md;
    font-weight: 700;
  }

  &--emphasis {
    .summary-row__value {
      color: $color-status-done-text;
      font-size: $font-size-lg;
    }
  }
}
</style>
