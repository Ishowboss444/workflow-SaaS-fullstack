<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getMyAssignments } from '@/api/assignment';
import { Package, ClipboardList, Coins } from 'lucide-vue-next';
import Loading from '@/components/common/Loading.vue';
import { toast } from 'vue-sonner';

const assignments = ref([]);
const loading = ref(true);
const error = ref('');
const now = ref(new Date());

let clockInterval = null;

const statusLabels = {
  NOT_BROADCASTED: 'هنوز توزیع نشده',
  BROADCASTED: 'توزیع شده',
  IN_PROGRESS: 'در حال انجام',
  DONE: 'تکمیل شده',
};

const statusColors = {
  NOT_BROADCASTED: { bg: '#f1f5f9', text: '#64748b' },
  BROADCASTED: { bg: '#dbeafe', text: '#2563eb' },
  IN_PROGRESS: { bg: '#fef3c7', text: '#d97706' },
  DONE: { bg: '#d1fae5', text: '#059669' },
};

const formattedDate = computed(() => {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(now.value);
  } catch {
    return '';
  }
});

const formattedTime = computed(() => {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(now.value);
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

function getWorkerSalary(product) {
  try {
    const salary =
      typeof product.salary === 'string'
        ? JSON.parse(product.salary)
        : product.salary;
    return salary?.worker ?? 0;
  } catch {
    return 0;
  }
}

function calculateSalary(assignment) {
  const workerSalary = getWorkerSalary(assignment.product);
  return (assignment.quantity * workerSalary).toLocaleString('fa-IR');
}

function getStatusLabel(status) {
  return statusLabels[status] || status || 'نامشخص';
}

function getStatusColor(status) {
  return statusColors[status] || { bg: '#f1f5f9', text: '#64748b' };
}

onMounted(async () => {
  clockInterval = setInterval(() => {
    now.value = new Date();
  }, 1000);

  try {
    const data = await getMyAssignments();
    assignments.value = data.data;
  } catch (err) {
    error.value = err.message || 'خطا در دریافت تکالیف';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
});
</script>

<template>
  <div class="page assignments-page">
    <Loading v-if="loading" />

    <template v-else-if="error">
      <div class="error-state">
        <p>{{ error }}</p>
      </div>
    </template>

    <template v-else>
      <!-- HEADER -->
      <header class="assignments-header">
        <p class="header-sentence">کار شما، پیشرفت ماست</p>
        <div class="header-datetime">
          <span class="date">{{ formattedDate }}</span>
          <span class="time">{{ formattedTime }}</span>
        </div>
      </header>

      <!-- ASSIGNMENTS LIST -->
      <main class="assignments-list">
        <div v-if="assignments.length === 0" class="empty-state">
          <div class="empty-icon">
            <ClipboardList :size="22" />
          </div>
          <h3>هنوز تکلیفی ندارید</h3>
          <p>وقتی مدیر کاری به شما توزیع کند، اینجا نمایش داده می‌شود.</p>
        </div>

        <article
          v-for="assignment in assignments"
          :key="assignment.id"
          class="assignment-card"
        >
          <div class="card-main">
            <div class="product-icon">
              <Package :size="18" />
            </div>
            <div class="product-info">
              <h3>{{ assignment.product?.name || 'محصول' }}</h3>
              <span class="product-date">
                {{ formatDate(assignment.createdAt) }}
              </span>
            </div>
          </div>

          <div class="card-details">
            <div class="detail-item">
              <span class="detail-label">مقدار</span>
              <span class="detail-value">
                {{ assignment.quantity.toLocaleString('fa-IR') }} عدد
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">وضعیت</span>
              <span
                class="status-badge"
                :style="{
                  background: getStatusColor(assignment.product?.status).bg,
                  color: getStatusColor(assignment.product?.status).text,
                }"
              >
                {{ getStatusLabel(assignment.product?.status) }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">حقوق</span>
              <span class="detail-value salary">
                <Coins :size="13" />
                {{ calculateSalary(assignment) }} تومان
              </span>
            </div>
          </div>
        </article>
      </main>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.assignments-page {
  min-height: 100vh;
  padding-bottom: 3rem;
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: $color-text-secondary;
}

/* HEADER */
.assignments-header {
  text-align: center;
  padding: $space-6 $space-4 $space-5;
}

.header-sentence {
  margin: 0;
  color: $color-text;
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.8;
}

.header-datetime {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 0.6rem;
}

.header-datetime .date {
  color: $color-text-secondary;
  font-size: 0.72rem;
}

.header-datetime .time {
  color: $color-primary;
  font-size: 0.85rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

/* ASSIGNMENTS LIST */
.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  @include page-padding;
}

.assignment-card {
  padding: 0.9rem 1rem;
  border: 1px solid $color-border-soft;
  border-radius: 17px;
  background: $color-bg-card;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.assignment-card:hover {
  border-color: $color-border;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.card-main {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.product-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: $color-bg-soft;
  color: $color-primary;
}

.product-info h3 {
  margin: 0;
  color: $color-text;
  font-size: 0.82rem;
  font-weight: 800;
}

.product-date {
  display: inline-block;
  margin-top: 0.2rem;
  color: $color-text-secondary;
  font-size: 0.62rem;
}

/* CARD DETAILS */
.card-details {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 0.8rem;
  padding-top: 0.7rem;
  border-top: 1px solid $color-border-soft;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
}

.detail-label {
  color: $color-text-secondary;
  font-size: 0.58rem;
}

.detail-value {
  color: $color-text;
  font-size: 0.72rem;
  font-weight: 700;
}

.detail-value.salary {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #059669;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 700;
}

/* EMPTY */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem;
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
  line-height: 1.7;
}

/* MOBILE */
@media (max-width: 480px) {
  .card-details {
    gap: 0.8rem;
  }

  .detail-value {
    font-size: 0.65rem;
  }
}
</style>
