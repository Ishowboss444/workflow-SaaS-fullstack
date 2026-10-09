<script setup>
import JobDetailHeader from '@/components/common/JobDetailHeader.vue';
import SummaryRow from '@/components/common/SummaryRow.vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/useProductStore.js';
import { ref, onMounted } from 'vue';
import Loading from '@/components/common/Loading.vue';

const route = useRoute();
const product = useProductStore();
const data = ref([]);

onMounted(async () => {
  const id = route.params.id;
  const response = await product._getProduct(id);
  data.value = response.data;
});
</script>

<template>
  <div class="page" v-if="!product.loading">
    <JobDetailHeader active-tab="finance" :data="data" />

    <div class="tab-body">
      <div class="finance-card">
        <h3 class="finance-card__title">خلاصه مالی</h3>
        <SummaryRow label="درآمد کل" :value="`${String(data.amount * data.salary.manager).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} تومان`" />
        <SummaryRow label="هزینه کارگرها" :value="`${String(data.amount * data.salary.worker).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} تومان`" />
        <SummaryRow label="هزینه‌های دیگر" :value="`${String(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} تومان`" />
        <SummaryRow label="سود خالص" :value="`${String((data.amount * data.salary.manager)-(data.amount * data.salary.worker) ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} تومان`" emphasis />
      </div>

      <div class="finance-card">
        <h3 class="finance-card__title">جزئیات هزینه‌ها</h3>
        <SummaryRow label="نخ و لوازم مصرفی" value="0 تومان" />
        <SummaryRow label="کرایه کارگاه" value="0 تومان" />
        <SummaryRow label="سایر هزینه‌ها" value="0 تومان" />
      </div>
    </div>
  </div>

  <Loading v-else />
</template>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

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
