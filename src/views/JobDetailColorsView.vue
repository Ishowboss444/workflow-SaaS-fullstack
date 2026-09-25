<script setup>
import { Pencil } from 'lucide-vue-next';
import JobDetailHeader from '../components/common/JobDetailHeader.vue';
import ProgressBar from '../components/common/ProgressBar.vue';
import AppButton from '../components/common/AppButton.vue';

const colors = [
  { name: 'مشکی', qty: 7000, done: 88, hex: '#2b2130' },
  { name: 'صورتی', qty: 3000, done: 52, hex: '#e83e8c' },
];
</script>

<template>
  <div class="page">
    <JobDetailHeader active-tab="colors" />

    <div class="tab-body">
      <div v-for="c in colors" :key="c.name" class="color-card">
        <div class="color-card__top">
          <span class="color-card__swatch" :style="{ background: c.hex }" />
          <div class="color-card__info">
            <span class="color-card__name">{{ c.name }}</span>
            <span class="color-card__qty"
              >{{ c.qty.toLocaleString() }} قطعه</span
            >
          </div>
          <span class="color-card__percent">{{ c.done }}%</span>
        </div>
        <ProgressBar :percent="c.done" />
      </div>

      <AppButton variant="outline">
        <span class="edit-btn"><Pencil :size="16" /> ویرایش</span>
      </AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.tab-body {
  @include page-padding;
  padding-top: $space-4;
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.color-card {
  @include card;

  &__top {
    @include flex-between;
    margin-bottom: $space-3;
  }

  &__swatch {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-shadow: 0 0 0 1px $color-border;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 $space-3;
  }

  &__name {
    font-weight: 700;
    font-size: $font-size-md;
  }

  &__qty {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__percent {
    font-weight: 700;
    color: $color-primary;
  }
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
}
</style>
