<script setup>
import StepperHeader from '../components/common/StepperHeader.vue';
import FormField from '../components/common/FormField.vue';
import SummaryRow from '../components/common/SummaryRow.vue';
import AppButton from '../components/common/AppButton.vue';
import { useProductStore } from '@/stores/useProductStore.js';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

const product = useProductStore()
const router = useRouter()
const salary = ref({
  worker : 0,
  manager : 0,
})
const calculation = computed(()=>{
  const amount = product.newProduct.amount
  console.log(amount);
  const result = {
    all : amount * salary.value.manager,
    worker : amount * salary.value.worker,
    pure : (amount  * salary.value.manager) - (amount * salary.value.worker)
  }
  return result
})
function setSalary (){
  product.newProduct.salary = salary.value
  console.log(product.newProduct.salary);
}

async function createProduction(){
  setSalary()
  const p = product.newProduct
  const plus = p.mid_tailor + p.top_tailor + p.right_tailor 
  if(p.amount === 0 ){
    alert('you need fill it again ')
    return router.push({name : 'add-job-1'})
  }
  if(plus !== p.lines){
    toast.error('the combinding of lines is not equal with what it is ! ')
    return alert('the combinding of lines is not equal with what it is ! ')
  }
  const data = await product._addProduct(p)
  console.log(data);
}
</script>

<template>
  <div class="page page--no-nav">
    <StepperHeader :current-step="3" />
    <div class="form-body form-body-lines">
      <h2 class="section-title">خط گذاری</h2>

      <FormField
        type="number"
        label="تعداد خط راسته دوز"
        suffix="خط"
        v-model="product.newProduct.right_tailor"
      />
      <FormField
        type="number"
        label="تعداد خط میان دوز"
        suffix="خط"
        v-model="product.newProduct.mid_tailor"
      />
      <FormField
        type="number"
        label="تعداد خط سر دوز"
        suffix="خط"
        v-model="product.newProduct.top_tailor"
      />
    </div>
    <div class="form-body">
      <h2 class="section-title">قیمت‌گذاری</h2>

      <FormField
        type="number"
        label="قیمت فروش هر قطعه (از مشتری)"
        model-value="100,000"
        suffix="تومان"
        v-model="salary.manager"
      />
      <FormField
        type="number"
        label="دستمزد کارگر (هر قطعه)"
        model-value="50,000"
        suffix="تومان"
        v-model="salary.worker"
      />

      <div class="summary-card">
        <h3 class="summary-card__title">خلاصه مالی (پیش‌بینی)</h3>
        <SummaryRow label="درآمد کل" :value="`${calculation.all} تومان`" />
        <SummaryRow label="هزینه کارگر" :value="`${calculation.worker} تومان`"/>
        <SummaryRow label="سود خالص" :value="`${calculation.pure} تومان`" emphasis />
      </div>
    </div>

    <div class="form-footer">
      <router-link :to="{ name: 'add-job-2' }" class="footer-btn">
        <AppButton variant="outline">بازگشت</AppButton>
      </router-link>
      <div class="footer-btn">
        <AppButton @click="createProduction">ادامه</AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.form-body {
  @include page-padding;
  padding-top: $space-5;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  margin: 0 0 $space-4;
}

.summary-card {
  @include card;
  padding: $space-4;
  margin-top: $space-2;

  &__title {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    font-weight: 600;
    margin: 0 0 $space-2;
  }
}

.form-footer {
  @include page-padding;
  margin-top: $space-4;
  display: flex;
  gap: $space-3;
}

.footer-btn {
  flex: 1;
  display: block;
}
</style>
