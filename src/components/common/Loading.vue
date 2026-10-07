<script setup>
// Shows as a chat bubble while waiting for the AI/API response.
// Usage: <ResponseLoader v-if="waitingForReply" />
</script>

<template>
  <div class="response-loader">
    <span class="response-loader__dot" />
    <span class="response-loader__dot" />
    <span class="response-loader__dot" />
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.response-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  right: 47.5%;
  top: 40%;
  height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  background: transparent;
  border: 1px solid $color-border-soft;
  border-radius: $radius-lg;
  border-bottom-left-radius: 4px; // matches typical "incoming message" bubble shape
  padding: $space-3 $space-4;
  box-shadow: $shadow-card;

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: $color-primary;
    opacity: 0.5;
    animation: bounce 1s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.15s;
    }
    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .response-loader__dot {
    animation: none;
    opacity: 0.8;
  }
}
</style>
