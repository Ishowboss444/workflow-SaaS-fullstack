<script setup lang="ts">
import { Shirt, Calendar } from 'lucide-vue-next';
import StepperHeader from '../components/common/StepperHeader.vue';
import FormField from '../components/common/FormField.vue';
import SelectField from '../components/common/SelectField.vue';
import AppButton from '../components/common/AppButton.vue';
import { useProductStore } from '@/stores/useProductStore.js';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

const product = useProductStore()
const router = useRouter()

function nextRoute(){
  const p = product.newProduct
  if(p.amount > 1 && p.name.trim() && p.lines > 1 ){
    router.push({name : 'add-job-2'})
  }else{
    toast.warning("لطفا با دقت کادر هارا پر کنید")
  }
}
</script>

<template>
  <div class="page page--no-nav">
    <StepperHeader :current-step="1" />

    <div class="form-body">
      <FormField 
        v-model="product.newProduct.lines" 
        type="number" 
        label="تعداد خط ها" 
        placeholder="مثلاً 1000" 
      />

      <SelectField 
        type="text" 
        label="نوع کار" 
        placeholder="تی‌شرت"
        :icon="Shirt" 
        v-model="product.newProduct.name"
      />

      <FormField
        label="توضیحات (اختیاری)"
        placeholder="مثلاً مدل، پارچه، رنگ و ..."
        v-model="product.newProduct.description"
      />

      <FormField
        type="number"
        label="تعداد کل"
        v-model="product.newProduct.amount"
        placeholder="مثلاً 10000"
      />

      <SelectField
        label="ددلاین تحویل"
        model-value="۱۴۰۳/۰۶/۲۶"
        :icon="Calendar"
      />
    </div>

    <div class="form-footer">
      <div class="footer-link">
        <AppButton @click="nextRoute">ادامه</AppButton>
      </div>
      <router-link :to="{ name: 'add-job-2' }" class="footer-link">
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
