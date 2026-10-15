<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/useGlobal';
import { getMemberAssignments } from '@/api/workplace';
import {
  ArrowRight,
  Users,
  Package,
  CalendarDays,
  ChevronDown,
  ClipboardList,
} from 'lucide-vue-next';
import Loading from '@/components/common/Loading.vue';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();
const global = useGlobalStore();

const member = ref(null);
const assignments = ref([]);
const loading = ref(true);
const error = ref('');
const expandedProducts = ref(new Set());

const fieldLabels = {
  rightTailor: 'خیاط راست',
  topTailor: 'خیاط بالا',
  midTailor: 'خیاط وسط',
  general: 'عمومی',
};

const products = computed(() => {
  const map = {};
  for (const a of assignments.value) {
    if (!map[a.productId]) {
      map[a.productId] = {
        id: a.product.id,
        name: a.product.name,
        amount: a.product.amount,
        assignments: [],
        totalQuantity: 0,
      };
    }
    map[a.productId].assignments.push(a);
    map[a.productId].totalQuantity += a.quantity;
  }
  return Object.values(map);
});

const totalQuantity = computed(() =>
  assignments.value.reduce((sum, a) => sum + a.quantity, 0)
);

const memberSince = computed(() => {
  if (!member.value?.createdAt) return '';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(member.value.createdAt));
  } catch {
    return '';
  }
});

function formatDate(dateStr) {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return '';
  }
}

function toggleProduct(productId) {
  const next = new Set(expandedProducts.value);
  if (next.has(productId)) {
    next.delete(productId);
  } else {
    next.add(productId);
  }
  expandedProducts.value = next;
}

function goBack() {
  router.push('/managerDashboard/Members');
}

onMounted(async () => {
  const memberId = Number(route.params.memberId);
  try {
    const data = await getMemberAssignments(global.workplaceId, memberId);
    member.value = data.data.member;
    assignments.value = data.data.assignments;
  } catch (err) {
    error.value = err.message || 'خطا در دریافت اطلاعات عضو';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page detail-page">
    <Loading v-if="loading" />

    <template v-else-if="error">
      <div class="error-state">
        <p>{{ error }}</p>
        <button type="button" class="back-btn" @click="goBack">
          <ArrowRight :size="16" />
          <span>بازگشت</span>
        </button>
      </div>
    </template>

    <template v-else>
      <!-- BACK -->
      <div class="top-bar">
        <button type="button" class="back-btn" @click="goBack">
          <ArrowRight :size="16" />
          <span>بازگشت</span>
        </button>
      </div>

      <!-- MEMBER HEADER -->
      <header class="member-header">
        <div class="avatar-large">
          {{ member.name?.[0] || '؟' }}
        </div>
        <div class="member-title">
          <h1>{{ member.name }}</h1>
          <p>@{{ member.username }}</p>
          <div class="member-meta">
            <span class="meta-badge">
              <Users :size="12" />
              {{ fieldLabels[member.field] || member.field || 'نامشخص' }}
            </span>
          </div>
        </div>
      </header>

      <!-- SUMMARY -->
      <section class="summary">
        <div class="summary-card">
          <Package :size="18" />
          <div class="summary-info">
            <span class="summary-value">{{ products.length }}</span>
            <span class="summary-label">محصول</span>
          </div>
        </div>
        <div class="summary-card">
          <ClipboardList :size="18" />
          <div class="summary-info">
            <span class="summary-value">{{ totalQuantity.toLocaleString('fa-IR') }}</span>
            <span class="summary-label">مجموع مقدار</span>
          </div>
        </div>
        <div class="summary-card">
          <CalendarDays :size="18" />
          <div class="summary-info">
            <span class="summary-value summary-date">{{ memberSince }}</span>
            <span class="summary-label">عضویت</span>
          </div>
        </div>
      </section>

      <!-- PRODUCTS -->
      <section class="products-section">
        <h2 class="section-title">محصولات و توزیع‌ها</h2>

        <div v-if="products.length === 0" class="empty-state">
          <div class="empty-icon">
            <Package :size="22" />
          </div>
          <h3>هنوز توزیعی انجام نشده</h3>
          <p>برای این عضو هنوز محصولی توزیع نشده است.</p>
        </div>

        <div v-else class="products-list">
          <div v-for="product in products" :key="product.id" class="product-card">
            <button
              type="button"
              class="product-header"
              @click="toggleProduct(product.id)"
            >
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <span class="product-qty">
                  مجموع: {{ product.totalQuantity.toLocaleString('fa-IR') }} عدد
                </span>
              </div>
              <ChevronDown
                :size="18"
                :class="{ rotated: expandedProducts.has(product.id) }"
              />
            </button>

            <div v-if="expandedProducts.has(product.id)" class="broadcasts">
              <div
                v-for="assignment in product.assignments"
                :key="assignment.id"
                class="broadcast-row"
              >
                <span class="broadcast-qty">
                  {{ assignment.quantity.toLocaleString('fa-IR') }} عدد
                </span>
                <span class="broadcast-date">
                  {{ formatDate(assignment.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.detail-page {
  min-height: 100vh;
  padding-bottom: 3rem;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 50vh;
  color: $color-text-secondary;
}

/* TOP BAR */
.top-bar {
  display: flex;
  align-items: center;
  @include page-padding;
  padding-top: $space-4;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  border: 1px solid $color-border-soft;
  border-radius: 11px;
  background: $color-bg-card;
  color: $color-text;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.back-btn:hover {
  border-color: $color-border;
  background: $color-bg-soft;
}

/* MEMBER HEADER */
.member-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  @include page-padding;
  padding-top: $space-5;
}

.avatar-large {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 18px;
  background: $color-bg-soft;
  color: $color-text;
  font-size: 1.3rem;
  font-weight: 800;
}

.member-title h1 {
  margin: 0;
  color: $color-text;
  font-size: 1.15rem;
  font-weight: 800;
}

.member-title > p {
  margin: 0.2rem 0 0;
  color: $color-text-secondary;
  font-size: 0.72rem;
}

.member-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: $color-bg-soft;
  color: $color-primary;
  font-size: 0.62rem;
  font-weight: 700;
}

/* SUMMARY */
.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  @include page-padding;
  margin-top: 1.4rem;
}

.summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border: 1px solid $color-border-soft;
  border-radius: 15px;
  background: $color-bg-card;
  color: $color-primary;
}

.summary-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.summary-value {
  color: $color-text;
  font-size: 0.85rem;
  font-weight: 800;
}

.summary-date {
  font-size: 0.68rem;
}

.summary-label {
  color: $color-text-secondary;
  font-size: 0.6rem;
}

/* PRODUCTS */
.products-section {
  @include page-padding;
  margin-top: 1.6rem;
}

.section-title {
  margin: 0 0 0.8rem;
  color: $color-text;
  font-size: 0.85rem;
  font-weight: 800;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.product-card {
  border: 1px solid $color-border-soft;
  border-radius: 17px;
  background: $color-bg-card;
  overflow: hidden;
}

.product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.9rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: right;
}

.product-info h3 {
  margin: 0;
  color: $color-text;
  font-size: 0.8rem;
  font-weight: 800;
}

.product-qty {
  display: inline-block;
  margin-top: 0.25rem;
  color: $color-text-secondary;
  font-size: 0.65rem;
}

.product-header > svg {
  flex-shrink: 0;
  color: $color-text-secondary;
  transition: transform 0.2s;
}

.product-header > svg.rotated {
  transform: rotate(180deg);
}

/* BROADCASTS */
.broadcasts {
  padding: 0 1rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.broadcast-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  border-radius: 11px;
  background: $color-bg-soft;
}

.broadcast-qty {
  color: $color-text;
  font-size: 0.72rem;
  font-weight: 700;
}

.broadcast-date {
  color: $color-text-secondary;
  font-size: 0.62rem;
}

/* EMPTY */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  margin-bottom: 1rem;
  border-radius: 16px;
  background: $color-bg-soft;
  color: $color-text-secondary;
}

.empty-state h3 {
  margin: 0;
  color: $color-text;
  font-size: 0.9rem;
  font-weight: 800;
}

.empty-state p {
  margin: 0.4rem 0 0;
  color: $color-text-secondary;
  font-size: 0.7rem;
}

/* MOBILE */
@media (max-width: 480px) {
  .summary {
    grid-template-columns: 1fr;
  }

  .member-header {
    flex-direction: column;
    text-align: center;
  }

  .member-meta {
    justify-content: center;
  }
}
</style>
