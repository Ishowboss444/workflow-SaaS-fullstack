<script setup>
import JobDetailHeader from '../components/common/JobDetailHeader.vue';
import SummaryRow from '../components/common/SummaryRow.vue';
</script>

<template>
  <div class="page">
    <JobDetailHeader active-tab="finance" />

    <div class="tab-body">
      <div class="finance-card">
        <h3 class="finance-card__title">خلاصه مالی</h3>
        <SummaryRow label="درآمد کل" value="1,000,000,000 تومان" />
        <SummaryRow label="هزینه کارگرها" value="500,000,000 تومان" />
        <SummaryRow label="هزینه‌های دیگر" value="120,000,000 تومان" />
        <SummaryRow label="سود خالص" value="380,000,000 تومان" emphasis />
      </div>

      <div class="finance-card">
        <h3 class="finance-card__title">جزئیات هزینه‌ها</h3>
        <SummaryRow label="نخ و لوازم مصرفی" value="50,000,000 تومان" />
        <SummaryRow label="کرایه کارگاه" value="30,000,000 تومان" />
        <SummaryRow label="سایر هزینه‌ها" value="40,000,000 تومان" />
      </div>
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
  gap: $space-4;
}

.finance-card {
  @include card;

  &__title {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    font-weight: 600;
    margin: 0 0 $space-2;
  }
}
</style>
