```vue
<template>
  <main class="worker-page" dir="rtl">
    <div class="worker-container">
      <button type="button" class="back-button" @click="router.back()">
        <span>→</span>
        برگشت
      </button>

      <header class="page-header">
        <div class="icon">✦</div>

        <h1>پروفایلت رو آماده کن</h1>

        <p>مهارتت رو انتخاب کن تا کارگاه‌ها بتونن برای همکاری پیدات کنن.</p>
      </header>

      <form class="worker-form" @submit.prevent="saveProfile">
        <!-- Field -->
        <div class="field">
          <label> زمینه کاری </label>

          <div class="field-options">
            <button
              v-for="option in fields"
              :key="option.value"
              type="button"
              class="field-option"
              :class="{ selected: form.field === option.value }"
              :disabled="loading"
              @click="form.field = option.value"
            >
              <span class="option-icon">
                {{ option.icon }}
              </span>

              <span class="option-content">
                <strong>{{ option.label }}</strong>
                <small>{{ option.description }}</small>
              </span>

              <span v-if="form.field === option.value" class="check"> ✓ </span>
            </button>
          </div>
        </div>

        <p v-if="error" class="error">
          {{ error }}
        </p>

        <button
          type="submit"
          class="submit-button"
          :disabled="loading || !form.field"
        >
          <span v-if="loading"> در حال ذخیره... </span>

          <span v-else> آماده‌ام برای کار </span>
        </button>
      </form>

      <p class="hint">بعداً می‌تونی اطلاعات پروفایلت رو تغییر بدی.</p>
    </div>
  </main>
  <RouterView></RouterView>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const router = useRouter();

const loading = ref(false);
const error = ref('');

const form = reactive({
  field: '',
});

const fields = [
  {
    value: 'rightTailor',
    label: 'خیاط راسته‌دوز',
    description: 'دوخت و تولید با چرخ راسته',
    icon: '✂️',
  },
  {
    value: 'topTailor',
    label: 'خیاط سردوز',
    description: 'دوخت تخصصی و ظریف',
    icon: '🧵',
  },
  {
    value: 'midTailor',
    label: 'خیاط میان‌دوز',
    description: 'دوخت و تکمیل لباس',
    icon: '🪡',
  },
  {
    value: 'general',
    label: 'کمک خیاط',
    description: 'دوخت و تکمیل لباس',
    icon: '🧶',
  },
];

const saveProfile = async () => {
  error.value = '';
  const token = localStorage.getItem('accessToken');
  if (!form.field) {
    error.value = 'زمینه کاری رو انتخاب کن.';
    return;
  }

  loading.value = true;

  try {
    const response = await fetch('http://localhost:3000/users/workerProfile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        field: form.field,
      }),
    });

    const data = await response.json();
    console.log(data);
    localStorage.setItem(
      'field',
      form.field
    );
    localStorage.setItem(
      'role',
      'WORKER'
    );
    localStorage.setItem(
      'username',
      data.username
    );
    if (!response.ok) {
      throw new Error(data.message || 'ذخیره پروفایل انجام نشد.');
    }
    toast.success('پروفایل شما تکمیل شد')
    router.push({ name: 'starter' });
  } catch (err) {
    error.value = err.message || 'خطایی رخ داد.';
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as *;

.worker-page {
  min-height: 100dvh;
  padding: $space-4;

  display: flex;
  justify-content: center;

  background: $color-bg-app;
}

.worker-container {
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
  font-family: inherit;
  font-size: $font-size-sm;

  cursor: pointer;

  span {
    font-size: 18px;
  }
}

.page-header {
  margin-top: 40px;
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

  font-size: 28px;
}

.page-header h1 {
  margin: 0 0 $space-2;

  color: $color-text-primary;

  font-size: 24px;
  line-height: 1.5;
  font-weight: 800;
}

.page-header p {
  max-width: 330px;
  margin: 0 auto;

  color: $color-text-secondary;

  font-size: $font-size-sm;
  line-height: 1.8;
}

.worker-form {
  margin-top: 36px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 9px;

  & + .field {
    margin-top: $space-5;
  }
}

.field > label {
  color: $color-text-primary;

  font-size: $font-size-sm;
  font-weight: 600;
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
  }
}

.field-options {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.field-option {
  width: 100%;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 13px;

  border: 1px solid $color-border-soft;
  border-radius: $radius-md;

  background: $color-bg-card;

  font-family: inherit;
  text-align: right;

  cursor: pointer;

  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.15s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.selected {
    border-color: $color-primary;
    background: $color-primary-light;
  }
}

.option-icon {
  width: 40px;
  height: 40px;

  flex: 0 0 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: $color-bg-soft;

  font-size: 19px;
}

.option-content {
  min-width: 0;
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-content strong {
  color: $color-text-primary;

  font-size: $font-size-sm;
  font-weight: 700;
}

.option-content small {
  color: $color-text-secondary;

  font-size: 12px;
}

.check {
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 24px;

  border-radius: 50%;

  background: $color-primary;
  color: white;

  font-size: 13px;
  font-weight: 700;
}

.error {
  margin: $space-3 0 0;

  color: #d6456b;
  font-size: 13px;
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

  color: $color-text-muted;

  font-size: 12px;
  line-height: 1.7;
}
</style>
``` And add: ```js { path: '/profile/worker', name: 'worker-profile', component:
() => import('@/views/auth/worker-profile.vue'), } ``` ### One thing I'd change
in the backend Since this is an existing `User`, `PATCH` is appropriate: ```http
PATCH /api/users/worker-profile ``` The server should **not** accept `role`,
`workplaceId`, or `userId` from the frontend. It should derive the user from
authentication and set: ```js { name, field, role: 'WORKER', workplaceId: null }
``` This also means a worker who later gets invited to a workplace can simply
have `workplaceId` updated when they accept the invitation. For your current
schema, that gives you a clean onboarding flow: ```text /start │ ├── ایجاد
کارگاه │ └── /workplace/create │ └── فعالیت به عنوان نیروی کار └──
/profile/worker ``` Would you like the next piece to be the **Express + Prisma
`PATCH /api/users/worker-profile` endpoint** or the **invite/search API that
finds these workers by username/field**?
