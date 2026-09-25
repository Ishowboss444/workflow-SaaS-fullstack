<script setup>
import { Wallet, Briefcase, Users, Home } from 'lucide-vue-next';

defineProps({
  active: { type: String, default: 'jobs' }, // profit | jobs | workers | home
});

const tabs = [
  { key: 'profit', label: 'سود', icon: Wallet },
  { key: 'jobs', label: 'کارها', icon: Briefcase },
  { key: 'workers', label: 'کارگرها', icon: Users },
  { key: 'home', label: 'خانه', icon: Home },
];
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': active === tab.key }"
    >
      <component :is="tab.icon" :size="20" />
      <span>{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.bottom-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: $color-bg-card;
  border-top: 1px solid $color-border-soft;
  padding: $space-2 $space-3 $space-4;
  z-index: $z-bottom-nav;

  &__item {
    flex: 1;
    @include flex-center;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    color: $color-text-muted;
    font-size: $font-size-xs;
    padding: $space-2 0;
    cursor: pointer;

    &--active {
      color: $color-primary;
      font-weight: 600;
    }
  }
}
</style>
