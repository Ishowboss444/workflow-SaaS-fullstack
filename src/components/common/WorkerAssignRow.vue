<script setup>
defineProps({
  name: { type: String, required: true },
  avatarColor: { type: String, default: '#f7d3e3' },
  qty: { type: [Number, String], default: '' },
  price: { type: [Number, String], default: '' },
  remainingLabel: { type: String, default: '' }, // e.g. "باقی‌مانده: 0"
});
</script>

<template>
  <div class="assign-row">
    <div class="assign-row__avatar" :style="{ background: avatarColor }">
      {{ name.charAt(0) }}
    </div>

    <div class="assign-row__info">
      <span class="assign-row__name">{{ name }}</span>
      <span v-if="remainingLabel" class="assign-row__remaining">{{
        remainingLabel
      }}</span>
    </div>

    <div class="assign-row__field">
      <label>تعداد</label>
      <input type="text" :value="qty" placeholder="۰" inputmode="numeric" />
    </div>

    <div class="assign-row__field">
      <label>قیمت هر قطعه</label>
      <input type="text" :value="price" placeholder="۰" inputmode="numeric" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.assign-row {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 0;
  border-bottom: 1px solid $color-border-soft;

  &:last-child {
    border-bottom: none;
  }

  &__avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    @include flex-center;
    font-weight: 700;
    font-size: $font-size-sm;
    color: $color-primary-dark;
  }

  &__info {
    display: flex;
    flex-direction: column;
    width: 56px;
    flex-shrink: 0;
  }

  &__name {
    font-size: $font-size-sm;
    font-weight: 600;
    @include truncate;
  }

  &__remaining {
    font-size: 10px;
    color: $color-text-muted;
  }

  &__field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    label {
      font-size: 10px;
      color: $color-text-muted;
    }

    input {
      border: 1px solid $color-border;
      border-radius: $radius-sm;
      height: 34px;
      padding: 0 $space-2;
      font-size: $font-size-sm;
      background: $color-bg-app;
      color: $color-text-primary;
      width: 100%;

      &:focus {
        outline: none;
        border-color: $color-primary;
      }
    }
  }
}
</style>
