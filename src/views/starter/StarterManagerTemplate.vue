```vue
<template>
  <main class="create-workplace-page" dir="rtl">
    <div class="create-workplace-container" v-if="!loading">
      <button type="button" class="back-button" @click="router.back()">
        <span>
          <ChevronRight/>
        </span>
        برگشت
      </button>

      <header class="page-header">
        <div class="icon">
          <span>⌂</span>
        </div>

        <h1>کارگاهت رو بساز</h1>

        <p>اطلاعات کارگاه رو وارد کن تا فضای کاری خودت رو راه‌اندازی کنی.</p>
      </header>

      <form class="workplace-form" @submit.prevent="createWorkplace">
        <div class="field">
          <label for="workplace-name"> نام کارگاه </label>

          <input
            id="workplace-name"
            v-model="form.name"
            type="text"
            placeholder="مثلاً کارگاه خیاطی محمد"
            autocomplete="organization"
            :disabled="loading"
          />

          <span v-if="error" class="error">
            {{ error }}
          </span>
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="loading || !form.name.trim()"
        >
          <span v-if="loading">در حال ساخت...</span>
          <span v-else>ساختن کارگاه</span>
        </button>
      </form>

      <p class="hint">بعداً می‌تونی اعضای تیم و محصولاتت رو اضافه کنی.</p>
    </div>
    <Loading v-else/>
  </main>
</template>

<script setup>
import Loading from '@/components/common/Loading.vue';
import { useGlobalStore } from '@/stores/useGlobal';
import { ChevronRight } from 'lucide-vue-next';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const global = useGlobalStore()

const loading = ref(false);
const error = ref('');

const form = reactive({
  name: '',
});

const createWorkplace = async () => {
  error.value = '';
  const token = localStorage.getItem('accessToken')
  const name = form.name.trim();

  if (!name) {
    error.value = 'نام کارگاه رو وارد کن.';
    return;
  }

  loading.value = true;

  try {
    const response = await fetch('http://localhost:3000/workplace/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization : `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
      }),
    });

    const data = await response.json();
    console.log(data);
    
    if (!response.ok) {
      throw new Error(data.message || 'ساخت کارگاه انجام نشد.');
    }

    global.workplaceChange(Number(data?.data?.id))

    global.roleChange("MANAGER")
    router.push({name : 'starter'});
  } catch (err) {
    error.value = err.message || 'خطایی رخ داد.';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as *;

.create-workplace-page {
  min-height: 100dvh;
  background: $color-bg-app;
  padding: $space-4;
  display: flex;
  justify-content: center;
}

.create-workplace-container {
  width: 100%;
  max-width: 430px;
  padding-top: 12px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 0;
  border: 0;
  background: transparent;

  color: $color-text-secondary;
  font-size: $font-size-sm;
  cursor: pointer;

  span {
    font-size: 18px;
    display: flex;
    align-items: center;
  }
}

.page-header {
  margin-top: 48px;
  text-align: center;
}

.icon {
  width: 64px;
  height: 64px;

  margin: 0 auto $space-4;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 20px;

  background: $color-primary-light;
  color: $color-primary;

  font-size: 30px;
}

.page-header h1 {
  margin: 0 0 $space-2;

  font-size: 24px;
  line-height: 1.5;
  font-weight: 800;

  color: $color-text-primary;
}

.page-header p {
  max-width: 320px;
  margin: 0 auto;

  font-size: $font-size-sm;
  line-height: 1.8;

  color: $color-text-secondary;
}

.workplace-form {
  margin-top: 40px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $color-text-primary;
}

.field input {
  width: 100%;
  box-sizing: border-box;

  padding: 14px 16px;

  border: 1px solid $color-border;
  border-radius: $radius-md;

  background: $color-bg-card;

  color: $color-text-primary;
  font-family: inherit;
  font-size: $font-size-md;

  outline: none;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: $color-text-muted;
  }

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(190, 120, 210, 0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.error {
  font-size: 13px;
  color: #d6456b;
}

.submit-button {
  width: 100%;
  margin-top: $space-5;
  padding: 14px 16px;

  border: 0;
  border-radius: $radius-md;

  background: $color-primary;
  color: white;

  font-family: inherit;
  font-size: $font-size-md;
  font-weight: 700;

  cursor: pointer;

  box-shadow: $shadow-button;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.hint {
  margin: $space-4 0 0;

  text-align: center;

  font-size: 12px;
  line-height: 1.7;

  color: $color-text-muted;
}
</style>
