```vue
<template>
  <Transition name="loading">
    <div
      class="fulfilled-loading"
      dir="rtl"
    >
      <div class="loading-content">
        <div class="loading-logo">
          <span></span>
        </div>

        <div class="loading-spinner"></div>

        <p>در حال بارگذاری...</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@use '../../assets/scss/variables' as *;

.fulfilled-loading {

  width: 100%;
  height: 100dvh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: $color-bg-app;
}

.loading-content {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Logo */

.loading-logo {
  width: 56px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 24px;

  border-radius: 17px;
  background: $color-primary-light;
}

.loading-logo span {
  width: 24px;
  height: 24px;

  display: block;

  border-radius: 8px;
  background: $color-primary;

  transform: rotate(-8deg);

  animation: logo-pulse 1.3s ease-in-out infinite;
}

/* Spinner */

.loading-spinner {
  width: 20px;
  height: 20px;

  margin-bottom: 13px;

  border: 2px solid $color-border-soft;
  border-top-color: $color-primary;
  border-radius: 50%;

  animation: spin 0.7s linear infinite;
}

/* Text */

.loading-content p {
  margin: 0;

  color: $color-text-secondary;
  font-size: $font-size-sm;
  line-height: 1.8;
}

/* Transition */

.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.2s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

/* Animations */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes logo-pulse {
  0%,
  100% {
    transform: rotate(-8deg) scale(1);
  }

  50% {
    transform: rotate(-8deg) scale(0.88);
  }
}
</style>
```
