<script setup>
defineProps({
  label: { type: String, required: true },
  placeholder: { type: String, default: '' },
  suffix: { type: String, default: '' }, // e.g. "تومان"
  type: { type: String, default: 'text' },
});
const model = defineModel({ type: [String, Number], default: '' });
</script>

<template>
  <label class="form-field">
    <span class="form-field__label">{{ label }}</span>
    <div class="form-field__control">
      <input
        v-model="model"
        :type="type"
        :placeholder="placeholder"
      />
      <span v-if="suffix" class="form-field__suffix">{{ suffix }}</span>
    </div>
  </label>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;

.form-field {
  display: block;
  margin-bottom: $space-4;

  &__label {
    display: block;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-bottom: $space-2;
  }

  &__control {
    display: flex;
    align-items: center;
    background: $color-bg-card;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    padding: 0 $space-4;
    height: 50px;

    input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: $font-size-md;
      color: $color-text-primary;
      min-width: 0;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: $color-text-muted;
      }
    }
  }

  &__suffix {
    font-size: $font-size-sm;
    color: $color-text-muted;
    flex-shrink: 0;
  }
}
</style>
