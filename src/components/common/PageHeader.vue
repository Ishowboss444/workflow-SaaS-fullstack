<script setup>
import { ArrowRight, MoreVertical } from 'lucide-vue-next';

defineProps({
  title: { type: String, required: true },
  showMenu: { type: Boolean, default: false },
});
</script>

<template>
  <header class="page-header">
    <button class="page-header__icon-btn" aria-label="بازگشت">
      <ArrowRight :size="20" />
    </button>
    <h1 class="page-header__title">{{ title }}</h1>
    <button v-if="showMenu" class="page-header__icon-btn" aria-label="گزینه‌ها">
      <MoreVertical :size="20" />
    </button>
    <span v-else class="page-header__spacer" />
  </header>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.page-header {
  @include page-padding;
  @include flex-between;
  padding-top: $space-5;
  padding-bottom: $space-4;

  &__title {
    font-size: $font-size-lg;
    font-weight: 700;
    margin: 0;
  }

  &__icon-btn {
    @include flex-center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    background: $color-bg-card;
    color: $color-text-primary;
    cursor: pointer;
  }

  &__spacer {
    width: 34px;
  }
}
</style>
