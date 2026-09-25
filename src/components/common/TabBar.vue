<script setup>
defineProps({
  tabs: { type: Array, required: true }, // [{ key, label, to? }] — "to" is an optional router-link target
  active: { type: String, required: true },
});
</script>

<template>
  <div class="tab-bar">
    <component
      :is="tab.to ? 'router-link' : 'button'"
      v-for="tab in tabs"
      :key="tab.key"
      :to="tab.to"
      class="tab-bar__item"
      :class="{ 'tab-bar__item--active': active === tab.key }"
    >
      {{ tab.label }}
    </component>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.tab-bar {
  @include page-padding;
  display: flex;
  gap: $space-5;
  border-bottom: 1px solid $color-border-soft;

  &__item {
    background: none;
    border: none;
    padding: $space-3 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
    cursor: pointer;
    position: relative;
    font-family: inherit;
    text-decoration: none;
    display: inline-block;

    &--active {
      color: $color-primary;
      font-weight: 700;

      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: $color-primary;
        border-radius: $radius-pill;
      }
    }
  }
}
</style>
