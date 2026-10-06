<template>
  <div class="signup-page" dir="rtl">
    <main class="signup-card" :class="{'isDisabled' : auth.loading}">
      <!-- Header -->
      <header class="signup-header">
        <div class="logo">
          <span class="logo-mark">
            <span></span>
          </span>

          <span class="logo-text">کارگاه من</span>
        </div>

        <div class="header-copy">
          <h1>خوش اومدی 👋</h1>
          <p>برای شروع، حساب کاربری خودت رو بساز.</p>
        </div>
      </header>

      <!-- Form -->
      <form class="signup-form" @submit.prevent="handleSubmit">
        <!-- Name -->
        <div class="field">
          <label for="name">نام و نام خانوادگی</label>

          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="مثلاً علی رضایی"
            autocomplete="name"
            required
          />
        </div>

        <!-- Username -->
        <div class="field">
          <label for="username">نام کاربری</label>

          <div class="username-input">
            <span>@</span>

            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="نام کاربری"
              autocomplete="username"
              dir="ltr"
              required
            />
          </div>

          <small>
            نام کاربری باید حداقل ۳ کاراکتر باشد.
          </small>
        </div>

        <!-- Password -->
        <div class="field">
          <label for="password">رمز عبور</label>

          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="رمز عبور"
            autocomplete="new-password"
            minlength="8"
            required
          />
        </div>

        <!-- Password confirmation -->
        <div class="field">
          <label for="password-confirm">تکرار رمز عبور</label>

          <input
            id="password-confirm"
            v-model="form.passwordConfirm"
            type="password"
            placeholder="رمز عبور را دوباره وارد کنید"
            autocomplete="new-password"
            minlength="8"
            required
            :class="{ invalid: passwordMismatch }"
          />

          <small
            v-if="passwordMismatch"
            class="error"
          >
            رمزهای عبور یکسان نیستند.
          </small>
        </div>

        <!-- Submit -->
        <button
          class="submit-button"
          type="submit"
          :disabled="!canSubmit"
        >
          ساخت حساب
        </button>
      </form>

      <!-- Login -->
      <div class="login-link">
        <span>قبلاً حساب داری؟</span>

        <RouterLink :to="{name : 'login'}">
          وارد شو
        </RouterLink>
      </div>
    </main>
    <Loading v-if="auth.loading"/>
  </div>
</template>

<script setup>
import Loading from '@/components/common/Loading.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  name: '',
  username: '',
  password: '',
  passwordConfirm: '',
})

const passwordMismatch = computed(() => {
  return (
    form.passwordConfirm.length > 0 &&
    form.password !== form.passwordConfirm
  )
})

const canSubmit = computed(() => {
  return (
    form.name.trim().length >= 2 &&
    form.username.trim().length >= 3 &&
    form.username.trim().startsWith('@') &&
    form.password.length >= 8 &&
    form.password === form.passwordConfirm
  )
})

const handleSubmit = async () => {
  if (!canSubmit.value) return toast.error('با دقت فرم را پر کنید')

  try{
    const data = await auth.Signup({
      name : form.name,
      username : form.username,
      password : form.passwordConfirm,
    })

    if(data){
      toast.success('حساب کاربری با موفقیت ساخته شد.')
      console.log(data);
      router.push({name : 'login'})
    }
    return data 
  }

  catch(err){
    toast.error('there is an error' , err)
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;
.isDisabled {
  pointer-events: none;
  opacity: 0.5;
}
.signup-page {
  min-height: 100dvh;
  background: $color-bg-app;
  display: flex;
  justify-content: center;
}

.signup-card {
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  padding: $space-6 $space-4;
  background: $color-bg-app;
}

/* ----------------------------------
   Header
---------------------------------- */

.signup-header {
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

.signup-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  margin-bottom: 8px;
  color: $color-text-primary;
  font-size: $font-size-sm;
  font-weight: 600;
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

.field input.invalid {
  border-color: #e25555;
}

.field small {
  margin-top: 7px;
  color: $color-text-muted;
  font-size: 11px;
}

.field small.error {
  color: #e25555;
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
   Login
---------------------------------- */

.login-link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: $space-5;
  color: $color-text-secondary;
  font-size: 12px;
}

.login-link a {
  color: $color-primary;
  font-weight: 700;
  text-decoration: none;
}

/* ----------------------------------
   Larger screens
---------------------------------- */

@media (min-width: 431px) {
  .signup-page {
    padding: $space-5 0;
    background: $color-bg-soft;
  }

  .signup-card {
    min-height: auto;
    padding: 36px $space-5;
    border-radius: $radius-lg;
    background: $color-bg-app;
  }
}
</style>
