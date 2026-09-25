<script setup>
import { ArrowRight, MoreVertical } from 'lucide-vue-next';
import ProgressBar from './ProgressBar.vue';
import StatusBadge from './StatusBadge.vue';
import TabBar from './TabBar.vue';

const props = defineProps({
  activeTab: { type: String, required: true },
});

const tabs = [
  {
    key: 'colors',
    label: 'رنگ‌ها',
    to: { name: 'job-detail-colors', params: { id: 1000 } },
  },
  {
    key: 'workers',
    label: 'کارگرها',
    to: { name: 'job-detail-workers', params: { id: 1000 } },
  },
  { key: 'history', label: 'تاریخچه' }, // no dedicated screen yet — visual only
  {
    key: 'finance',
    label: 'مالی',
    to: { name: 'job-detail-finance', params: { id: 1000 } },
  },
];
</script>

<template>
  <header class="job-header">
    <div class="job-header__top">
      <button class="icon-btn" aria-label="بازگشت">
        <ArrowRight :size="20" />
      </button>
      <div class="job-header__title-wrap">
        <span class="job-header__order">#1000</span>
        <StatusBadge status="active" label="فعال" />
      </div>
      <button class="icon-btn" aria-label="گزینه‌ها">
        <MoreVertical :size="20" />
      </button>
    </div>

    <div class="job-header__summary">
      <div class="job-header__thumb" />
      <div class="job-header__info">
        <h1>تی‌شرت</h1>
        <p>10,000 قطعه</p>
        <span class="job-header__deadline">۷ روز تا تحویل</span>
      </div>
    </div>

    <div class="job-header__progress">
      <div class="job-header__progress-top">
        <span>پیشرفت کلی</span>
        <strong>78%</strong>
      </div>
      <ProgressBar :percent="78" :height="8" />
      <span class="job-header__progress-count">7,800 / 10,000</span>
    </div>
  </header>

  <TabBar :tabs="tabs" :active="activeTab" />
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.job-header {
  @include page-padding;
  padding-top: $space-5;
  padding-bottom: $space-4;

  &__top {
    @include flex-between;
    margin-bottom: $space-4;
  }

  &__title-wrap {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__order {
    font-size: $font-size-lg;
    font-weight: 800;
  }

  &__summary {
    display: flex;
    gap: $space-3;
    margin-bottom: $space-4;
  }

  &__thumb {
    width: 56px;
    height: 56px;
    border-radius: $radius-md;
    background: $color-primary-light;
    flex-shrink: 0;
  }

  &__info {
    h1 {
      font-size: $font-size-lg;
      font-weight: 700;
      margin: 0 0 2px;
    }

    p {
      font-size: $font-size-sm;
      color: $color-text-secondary;
      margin: 0 0 4px;
    }
  }

  &__deadline {
    font-size: $font-size-xs;
    color: $color-status-new-text;
    background: $color-status-new-bg;
    padding: 2px 8px;
    border-radius: $radius-pill;
  }

  &__progress {
    &-top {
      @include flex-between;
      font-size: $font-size-sm;
      margin-bottom: $space-2;
      color: $color-text-secondary;

      strong {
        color: $color-primary;
      }
    }

    &-count {
      display: block;
      text-align: left;
      font-size: $font-size-xs;
      color: $color-text-muted;
      margin-top: $space-1;
    }
  }
}

.icon-btn {
  @include flex-center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: $color-bg-card;
  color: $color-text-primary;
}
</style>
