<script setup>
import ProgressBar from './ProgressBar.vue';

defineProps({
  name: { type: String, required: true },
  avatarColor: { type: String, default: '#f7d3e3' },
  assigned: { type: Number, required: true },
  done: { type: Number, required: true },
  percent: { type: Number, required: true },
});
</script>

<template>
  <div class="worker-row">
    <div class="worker-row__avatar" :style="{ background: avatarColor }">
      {{ name.charAt(0) }}
    </div>
    <div class="worker-row__body">
      <div class="worker-row__top">
        <span class="worker-row__name">{{ name }}</span>
        <span class="worker-row__percent">{{ percent }}%</span>
      </div>
      <ProgressBar :percent="percent" />
      <div class="worker-row__meta">
        <span>{{ assigned.toLocaleString() }} تخصیص داده شده</span>
        <span>{{ done.toLocaleString() }} انجام شده</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;

.worker-row {
  display: flex;
  gap: $space-3;
  align-items: flex-start;
  padding: $space-3 0;

  &__avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: $color-primary-dark;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: $space-2;
  }

  &__name {
    font-size: $font-size-md;
    font-weight: 600;
  }

  &__percent {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    font-weight: 600;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    margin-top: $space-2;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }
}
</style>
