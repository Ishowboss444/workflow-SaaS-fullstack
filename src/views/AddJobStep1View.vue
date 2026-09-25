<script setup>
import { Shirt, Calendar } from 'lucide-vue-next';
import StepperHeader from '../components/common/StepperHeader.vue';
import FormField from '../components/common/FormField.vue';
import SelectField from '../components/common/SelectField.vue';
import AppButton from '../components/common/AppButton.vue';
</script>

<template>
  <div class="page page--no-nav">
    <StepperHeader :current-step="1" />

    <div class="form-body">
      <FormField label="کد سفارش" model-value="1000" placeholder="مثلاً 1000" />

      <SelectField label="نوع کار" model-value="تی‌شرت" :icon="Shirt" />

      <FormField
        label="توضیحات (اختیاری)"
        placeholder="مثلاً مدل، پارچه، رنگ و ..."
      />

      <FormField
        label="تعداد کل"
        model-value="10000"
        placeholder="مثلاً 10000"
      />

      <SelectField
        label="ددلاین تحویل"
        model-value="۱۴۰۳/۰۶/۲۶"
        :icon="Calendar"
      />
    </div>

    <div class="form-footer">
      <router-link :to="{ name: 'add-job-2' }" class="footer-link">
        <AppButton>ادامه</AppButton>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.form-body {
  @include page-padding;
  padding-top: $space-5;
}

.form-footer {
  @include page-padding;
  margin-top: $space-4;
}

.footer-link {
  display: block;
}
</style>
