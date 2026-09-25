<script setup>
defineProps({
  percent: { type: Number, required: true },
  height: { type: Number, default: 6 },
});
</script>

<template>
  <div class="progress" :style="{ height: `${height}px` }">
    <div
      class="progress__fill"
      :style="{ width: `${Math.min(percent, 100)}%` }"
    />
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;

.progress {
  width: 100%;
  border-radius: $radius-pill;
  background: $color-bg-soft;
  overflow: hidden;

  &__fill {
    height: 100%;
    border-radius: $radius-pill;
    background: $color-primary;
    transition: width 0.3s ease;
  }
}
</style>
