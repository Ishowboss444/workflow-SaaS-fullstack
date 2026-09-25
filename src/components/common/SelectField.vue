<script setup>
import { ChevronDown } from 'lucide-vue-next';

defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  icon: { type: [Object, Function], default: null },
});
</script>

<template>
  <label class="select-field">
    <span class="select-field__label">{{ label }}</span>
    <div class="select-field__control">
      <ChevronDown :size="16" class="select-field__chevron" />
      <span class="select-field__value">{{ modelValue }}</span>
      <component :is="icon" v-if="icon" :size="18" class="select-field__icon" />
    </div>
  </label>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.select-field {
  display: block;
  margin-bottom: $space-4;

  &__label {
    display: block;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-bottom: $space-2;
  }

  &__control {
    @include flex-between;
    background: $color-bg-card;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    padding: 0 $space-4;
    height: 50px;
  }

  &__value {
    flex: 1;
    font-size: $font-size-md;
    padding: 0 $space-2;
  }

  &__chevron {
    color: $color-text-muted;
  }

  &__icon {
    color: $color-primary;
  }
}
</style>
