<script setup>
import { CircleCheck } from 'lucide-vue-next';
import AppButton from '../components/common/AppButton.vue';
</script>

<template>
  <div class="page page--no-nav success-page">
    <div class="success-page__icon">
      <CircleCheck :size="56" />
    </div>

    <h1 class="success-page__title">کار با موفقیت ثبت شد!</h1>
    <p class="success-page__desc">سفارش #1000 با موفقیت اضافه شد.</p>

    <div class="success-page__actions">
      <router-link
        :to="{ name: 'job-detail-colors', params: { id: 1000 } }"
        class="footer-link"
      >
        <AppButton>مشاهده سفارش</AppButton>
      </router-link>
      <router-link :to="{ name: 'add-job-1' }" class="footer-link">
        <AppButton variant="outline">افزودن کار جدید</AppButton>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.success-page {
  @include page-padding;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;

  &__icon {
    @include flex-center;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: $color-status-done-bg;
    color: $color-status-done-text;
    margin-bottom: $space-6;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: 800;
    margin: 0 0 $space-2;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin: 0 0 $space-7;
  }

  &__actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }
}

.footer-link {
  display: block;
}
</style>
