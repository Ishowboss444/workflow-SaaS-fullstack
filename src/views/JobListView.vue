<script setup>
import { Bell, Search, Plus, Scissors } from 'lucide-vue-next';
import BottomNav from '../components/common/BottomNav.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import ProgressBar from '../components/common/ProgressBar.vue';
import { ref ,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/useProductStore.js';
import Loading from '@/components/common/Loading.vue';

const products = useProductStore()
const activeFilter = ref('active'); // all | active | done
const router = useRouter();


onMounted(async ()=>{
  const data = await products._getProduct()
  console.log(data);
})

const filters = [
  { key: 'all', label: 'همه' },
  { key: 'active', label: 'فعال' },
  { key: 'done', label: 'تکمیل شده' },
];
</script>

<template>
  <div class="page" v-if="!products.loading">
    <header class="job-list-header">
      <button class="icon-btn" aria-label="اعلان‌ها">
        <Bell :size="20" />
      </button>
      <h1>کارها</h1>
      <span class="job-list-header__brand"><Scissors :size="18" /></span>
    </header>

    <div class="job-list-search">
      <Search :size="18" />
      <input type="text" placeholder="جستجوی سفارش..." />
    </div>

    <div class="job-list-filters">
      <button
        v-for="f in filters"
        :key="f.key"
        class="filter-chip"
        :class="{ 'filter-chip--active': activeFilter === f.key }"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <button class="add-job-btn" @click="router.push({ name: 'add-job-1' })">
      <Plus :size="18" />
      افزودن کار جدید
    </button>

    <!-- job lists loop -->
    <div class="job-list">
      <router-link
        v-for="job in products.products"
        :key="job.id"
        :to="{ name: 'job-detail-colors', params: { id: job.id } }"
        class="job-card"
      >
        <div class="job-card__thumb" :style="{ background: '#f7d3e3' }" />
        <div class="job-card__body">
          <div class="job-card__top">
            <span class="job-card__order">#{{ job.id }}</span>
            <StatusBadge :status="'progress'" :label="'progress'" />
          </div>
          <h3 class="job-card__title">{{ job.name }}</h3>
          <p class="job-card__meta">
            {{ job.amount.toLocaleString() }} قطعه
            {{ job.done.toLocaleString() }} انجام شده
          </p>
          <ProgressBar :percent="(job.done / job.amount) * 100" />
          <div class="job-card__bottom">
            <span>{{ job.lines }} خط</span>
            <span class="job-card__percent">{{ (job.done / job.amount) * 100 }}%</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
  <Loading v-else/>
  <BottomNav active="jobs" />
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.job-list-header {
  @include page-padding;
  @include flex-between;
  padding-top: $space-5;
  padding-bottom: $space-3;

  h1 {
    font-size: $font-size-xl;
    font-weight: 800;
    margin: 0;
  }

  &__brand {
    color: $color-primary;
  }
}

.icon-btn {
  @include flex-center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: $color-bg-card;
  color: $color-text-primary;
}

.job-list-search {
  @include page-padding;
  display: flex;
  align-items: center;
  gap: $space-2;
  margin: 0 $space-4 $space-4;
  background: $color-bg-card;
  border-radius: $radius-md;
  padding: $space-3 $space-4;
  color: $color-text-muted;

  input {
    flex: 1;
    border: none;
    background: none;
    font-size: $font-size-sm;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $color-text-muted;
    }
  }
}

.job-list-filters {
  @include page-padding;
  display: flex;
  gap: $space-2;
  margin-bottom: $space-4;
}

.filter-chip {
  flex: 1;
  border: none;
  background: $color-bg-card;
  color: $color-text-secondary;
  padding: $space-2 0;
  border-radius: $radius-pill;
  font-size: $font-size-sm;
  font-weight: 600;
  cursor: pointer;

  &--active {
    background: $color-primary;
    color: $color-text-on-primary;
  }
}

.add-job-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  margin: 0 $space-4 $space-5;
  width: calc(100% - #{$space-4 * 2});
  height: 46px;
  background: $color-primary;
  color: $color-text-on-primary;
  border: none;
  border-radius: $radius-pill;
  font-size: $font-size-md;
  font-weight: 700;
  box-shadow: $shadow-button;
  cursor: pointer;
}

.job-list {
  @include page-padding;
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.job-card {
  display: flex;
  gap: $space-3;
  @include card;

  &__thumb {
    width: 56px;
    height: 56px;
    border-radius: $radius-md;
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__top {
    @include flex-between;
    margin-bottom: 2px;
  }

  &__order {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__title {
    font-size: $font-size-md;
    font-weight: 700;
    margin: 0 0 4px;
  }

  &__meta {
    font-size: $font-size-xs;
    color: $color-text-muted;
    margin: 0 0 $space-2;
  }

  &__bottom {
    @include flex-between;
    margin-top: $space-2;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__percent {
    color: $color-primary;
    font-weight: 700;
  }
}
</style>
