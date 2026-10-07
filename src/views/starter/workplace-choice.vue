```vue
<template>
  <main class="choice-page" dir="rtl">
    <div class="choice-container">
      <header class="page-header">
        <div class="logo">کارگاه من</div>

        <h1>چطور می‌خوای شروع کنی؟</h1>
        <p>مسیرت رو انتخاب کن تا پروفایلت رو آماده کنیم.</p>
      </header>

      <section class="choices">
        <!-- Create workplace -->
        <button type="button" class="choice-card" @click="goToCreateWorkplace">
          <div class="choice-icon workplace-icon">
            <span>⌂</span>
          </div>

          <div class="choice-content">
            <h2>می‌خوام کارگاه داشته باشم</h2>
            <p>
              کارگاه خودت رو بساز، محصولاتت رو مدیریت کن و نیروی کار اضافه کن.
            </p>
          </div>

          <span class="choice-arrow">←</span>
        </button>

        <!-- Worker -->
        <button type="button" class="choice-card" @click="goToWorkerProfile">
          <div class="choice-icon worker-icon">
            <span>✦</span>
          </div>

          <div class="choice-content">
            <h2>می‌خوام به عنوان نیروی کار فعالیت کنم</h2>
            <p>مهارتت رو ثبت کن تا کارگاه‌ها بتونن برای همکاری دعوتت کنن.</p>
          </div>

          <span class="choice-arrow">←</span>
        </button>
      </section>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToCreateWorkplace = () => {
  router.push({ name: 'managerDashboard' });
};

const goToWorkerProfile = () => {
  router.push({ name: 'workerDashboard' });
};
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as *;

.choice-page {
  min-height: 100dvh;
  background: $color-bg-app;
  padding: $space-5 $space-4;
  display: flex;
  justify-content: center;
}

.choice-container {
  width: 100%;
  max-width: 430px;
  padding-top: 8vh;
}

.page-header {
  text-align: center;
  margin-bottom: $space-6;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-bottom: $space-5;

  font-size: 20px;
  font-weight: 800;
  color: $color-primary;
}

.page-header h1 {
  margin: 0 0 $space-2;

  font-size: 24px;
  line-height: 1.5;
  font-weight: 800;
  color: $color-text-primary;
}

.page-header p {
  margin: 0;

  font-size: $font-size-sm;
  line-height: 1.8;
  color: $color-text-secondary;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.choice-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $space-3;

  padding: $space-4;

  border: 1px solid $color-border-soft;
  border-radius: $radius-lg;

  background: $color-bg-card;
  box-shadow: $shadow-button;

  text-align: right;
  cursor: pointer;

  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    border-color: $color-primary;
  }
}

.choice-icon {
  flex: 0 0 46px;
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  font-size: 22px;
}

.workplace-icon {
  background: $color-primary-light;
  color: $color-primary;
}

.worker-icon {
  background: $color-bg-soft;
  color: $color-primary;
}

.choice-content {
  flex: 1;
  min-width: 0;
}

.choice-content h2 {
  margin: 0 0 4px;

  font-size: $font-size-md;
  line-height: 1.6;
  font-weight: 700;
  color: $color-text-primary;
}

.choice-content p {
  margin: 0;

  font-size: $font-size-sm;
  line-height: 1.7;
  color: $color-text-secondary;
}

.choice-arrow {
  flex: 0 0 auto;

  font-size: 20px;
  color: $color-text-muted;
}
</style>
``` ### Route Add this to your router: ```js { path: '/start', name: 'start',
component: () => import('@/views/auth/workplace-choice.vue'), } ``` I'd send the
user to `/start` after successful signup/login when they don't have a workplace
yet. The important part is that **the worker option shouldn't create anything
yet**. It should take them to a profile setup page where they select their
`Field` (`rightTailor`, `topTailor`, or `midTailor`). Then their profile becomes
discoverable/ready to receive workplace invitations. For the manager path,
`/workplace/create` can create: ```text Workplace ↓ ownerId = currentUser.id ↓
User.role = MANAGER ↓ User.workplaceId = workplace.id ``` For the worker path:
```text Worker profile ↓ User.field = selected Field ↓ User.role = WORKER ↓
workplaceId = null ↓ ready to receive invitations ``` This fits your existing
Prisma architecture without adding another model.
