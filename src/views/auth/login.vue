<template>
  <div class="login-page" dir="rtl">
    <main class="login-card" :class="{ isDisabled: auth.loading }">
      <!-- Header -->
      <header class="login-header">
        <div class="logo">
          <span class="logo-mark">
            <span></span>
          </span>

          <span class="logo-text">کارگاه من</span>
        </div>

        <div class="header-copy">
          <h1>خوش برگشتی 👋</h1>
          <p>برای ورود به حساب کاربری، اطلاعاتت رو وارد کن.</p>
        </div>
      </header>

      <!-- Form -->
      <form class="login-form" @submit.prevent="handleSubmit">
        <!-- Username -->
        <div class="field">
          <label for="username">نام کاربری</label>

          <div class="username-input">
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder=" @ نام کاربری"
              autocomplete="username"
              dir="ltr"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div class="field">
          <div class="field-header">
            <label for="password">رمز عبور</label>

            <button
              type="button"
              class="forgot-password"
              @click="handleForgotPassword"
            >
              رمز عبورم رو فراموش کردم
            </button>
          </div>

          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="رمز عبور"
            autocomplete="current-password"
            required
          />
        </div>

        <!-- Submit -->
        <button class="submit-button" type="submit" :disabled="!canSubmit">
          ورود به حساب
        </button>
      </form>

      <!-- Signup -->
      <div class="signup-link">
        <span>حساب کاربری نداری؟</span>

        <RouterLink :to="{ name: 'signup' }"> ثبت نام کن </RouterLink>
      </div>
    </main>
    <Loading v-if="auth.loading" />
  </div>
</template>

<script setup>
import Loading from '@/components/common/Loading.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGlobalStore } from '@/stores/useGlobal';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const router = useRouter();
const auth = useAuthStore();
const global = useGlobalStore()

const form = reactive({
  username: '',
  password: '',
});

const canSubmit = computed(() => {
  return (
    form.username.trim().length >= 3 &&
    form.username.trim().startsWith('@') &&
    form.password.length > 0
  );
});

const handleSubmit = async () => {
  if (!canSubmit.value) return;

  const data = await auth.Login({
    username: form.username,
    password: form.password,
  });

  if (!data) return;
  console.log(data.data);
  
  if(data.data.username) global.usernameChange(data.data.username)
  if(data.data.workplaceId) global.workplaceChange(Number(data.data.workplaceId))
  
  if(data.data.role) global.roleChange(data.data.role)
  if(data?.data?.field && data?.data?.role){
    global.roleChange(data.data.role)
    global.fieldChange(data.data.field)
    toast.success('خوش برگشتی 👋')
    return router.replace({name : 'workerDashboard'})
  } 

  toast.success('با موفقیت وارد شد');
  router.replace({ name: 'starter' });
};

const handleForgotPassword = () => {
  toast.info('بازیابی رمز عبور به‌زودی فعال می‌شود.');
};
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.login-page {
  min-height: 100dvh;
  background: $color-bg-app;
  display: flex;
  justify-content: center;
}
.isDisabled {
  pointer-events: none;
  opacity: 0.5;
}
.login-card {
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  padding: $space-6 $space-4;
  background: $color-bg-app;
}

/* ----------------------------------
   Header
---------------------------------- */

.login-header {
  margin-bottom: $space-6;
}

.logo {
  display: flex;
  align-items: center;
  gap: $space-2;
  margin-bottom: 36px;
}

.logo-mark {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-md;
  background: $color-primary-light;
}

.logo-mark span {
  width: 17px;
  height: 17px;
  display: block;
  border-radius: 6px;
  background: $color-primary;
  transform: rotate(-8deg);
}

.logo-text {
  color: $color-text-primary;
  font-size: $font-size-md;
  font-weight: 800;
}

.header-copy h1 {
  margin: 0 0 $space-2;
  color: $color-text-primary;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.header-copy p {
  margin: 0;
  color: $color-text-secondary;
  font-size: $font-size-sm;
  line-height: 1.9;
}

/* ----------------------------------
   Form
---------------------------------- */

.login-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.field label {
  margin-bottom: 8px;
  color: $color-text-primary;
  font-size: $font-size-sm;
  font-weight: 600;
}

.field-header label {
  margin-bottom: 0;
}

.field input {
  width: 100%;
  height: 52px;
  box-sizing: border-box;
  padding: 0 $space-3;
  border: 1px solid $color-border-soft;
  border-radius: $radius-md;
  outline: none;
  background: $color-bg-card;
  color: $color-text-primary;
  font-family: inherit;
  font-size: $font-size-sm;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field input::placeholder {
  color: $color-text-muted;
}

.field input:focus {
  border-color: $color-primary;
  box-shadow: 0 0 0 3px rgba(232, 62, 140, 0.09);
}

/* ----------------------------------
   Username
---------------------------------- */

.username-input {
  height: 52px;
  display: flex;
  align-items: center;
  padding-right: $space-3;
  border: 1px solid $color-border-soft;
  border-radius: $radius-md;
  background: $color-bg-card;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.username-input:focus-within {
  border-color: $color-primary;
  box-shadow: 0 0 0 3px rgba(232, 62, 140, 0.09);
}

.username-input span {
  color: $color-text-muted;
  font-size: 14px;
  font-weight: 600;
}

.username-input input {
  height: 100%;
  flex: 1;
  padding: 0 7px 0 12px;
  border: 0;
  box-shadow: none;
  background: transparent;
}

.username-input input:focus {
  border: 0;
  box-shadow: none;
}

/* ----------------------------------
   Forgot password
---------------------------------- */

.forgot-password {
  padding: 0;
  border: 0;
  background: transparent;
  color: $color-primary;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* ----------------------------------
   Button
---------------------------------- */

.submit-button {
  width: 100%;
  height: 52px;
  margin-top: $space-2;
  border: 0;
  border-radius: $radius-md;
  background: $color-primary;
  color: #fff;
  font-family: inherit;
  font-size: $font-size-sm;
  font-weight: 700;
  cursor: pointer;
  box-shadow: $shadow-button;
  transition:
    transform 0.15s ease,
    opacity 0.2s ease;
}

.submit-button:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

/* ----------------------------------
   Signup
---------------------------------- */

.signup-link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: $space-5;
  color: $color-text-secondary;
  font-size: 12px;
}

.signup-link a {
  color: $color-primary;
  font-weight: 700;
  text-decoration: none;
}

/* ----------------------------------
   Larger screens
---------------------------------- */

@media (min-width: 431px) {
  .login-page {
    padding: $space-5 0;
    background: $color-bg-soft;
  }

  .login-card {
    min-height: auto;
    padding: 36px $space-5;
    border-radius: $radius-lg;
    background: $color-bg-app;
  }
}
</style>
