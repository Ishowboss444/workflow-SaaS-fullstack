<script setup>
defineProps({
  status: { type: String, required: true }, // active | new | progress | done
  label: { type: String, required: true },
});
</script>

<template>
  <span class="badge" :class="`badge--${status}`">{{ label }}</span>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: $radius-pill;
  font-size: $font-size-xs;
  font-weight: 600;
  white-space: nowrap;

  &--active {
    background: $color-status-active-bg;
    color: $color-status-active-text;
  }
  &--new {
    background: $color-status-new-bg;
    color: $color-status-new-text;
  }
  &--progress {
    background: $color-status-progress-bg;
    color: $color-status-progress-text;
  }
  &--done {
    background: $color-status-done-bg;
    color: $color-status-done-text;
  }
}
</style>
