<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | outline
  block: { type: Boolean, default: true },
});
</script>

<template>
  <button
    class="app-btn"
    :class="[`app-btn--${variant}`, { 'app-btn--block': block }]"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;

.app-btn {
  height: 48px;
  padding: 0 $space-5;
  border-radius: $radius-pill;
  font-size: $font-size-md;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:active {
    transform: scale(0.97);
  }

  &--block {
    width: 100%;
  }

  &--primary {
    background: $color-primary;
    color: $color-text-on-primary;
    box-shadow: $shadow-button;
  }

  &--outline {
    background: $color-bg-card;
    color: $color-text-primary;
    border: 1px solid $color-border;
  }
}
</style>
