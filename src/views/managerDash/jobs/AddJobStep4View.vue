<script setup>
import { Plus } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import StepperHeader from '@/components/common/StepperHeader.vue';
import WorkerAssignRow from '@/components/common/WorkerAssignRow.vue';
import AppButton from '@/components/common/AppButton.vue';
import Loading from '@/components/common/Loading.vue';
import { useProductStore } from '@/stores/useProductStore';
import { useGlobalStore } from '@/stores/useGlobal';
import { getWorkplaceMembers } from '@/api/workplace';
import { createAssignment } from '@/api/assignment';

const product = useProductStore();
const global = useGlobalStore();
const router = useRouter();

const workers = ref([]);
const loading = ref(true);
const saving = ref(false);

onMounted(async () => {
  try {
    const data = await getWorkplaceMembers(global.workplaceId);
    const members = data.data.members || data.data?.members || [];
    const productAmount = product.newProduct.amount;

    workers.value = members
      .filter((m) => m.role === 'WORKER')
      .map((m) => ({
        id: m.id,
        name: m.name,
        color: stringToColor(m.name),
        qty: 0,
        price: product.newProduct.salary?.worker || 0,
        remaining: productAmount,
      }));
  } catch (err) {
    toast.error('error loading workers');
  } finally {
    loading.value = false;
  }
});

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#f7d3e3', '#ffe0c2', '#d8d3ff', '#c2f0e0', '#ffd6cc', '#e0e0ff'];
  return colors[Math.abs(hash) % colors.length];
}

const totalAssigned = () =>
  workers.value.reduce((sum, w) => sum + (Number(w.qty) || 0), 0);

const remaining = () => product.newProduct.amount - totalAssigned();

async function submitAssignments() {
  if (totalAssigned() === 0) {
    toast.error('enter quantity for at least one worker');
    return;
  }

  if (remaining() < 0) {
    toast.error('total quantity exceeds product amount');
    return;
  }

  saving.value = true;
  try {
    const productId = product.newProduct.id;
    const promises = workers.value
      .filter((w) => Number(w.qty) > 0)
      .map((w) =>
        createAssignment({
          productId,
          workerId: w.id,
          quantity: Number(w.qty),
        })
      );

    await Promise.all(promises);
    toast.success('work distributed successfully');
    router.push({ name: 'success' });
  } catch (err) {
    toast.error(err.message || 'error saving assignments');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Loading v-if="loading" />
  <div v-else class="page page--no-nav">
    <StepperHeader :current-step="4" />
    <div class="form-body">
      <h2 class="section-title">تقسیم کار</h2>

      <div v-if="workers.length === 0" class="empty-state">
        no workers found in your workplace
      </div>

      <div v-else class="worker-card">
        <WorkerAssignRow
          v-for="w in workers"
          :key="w.id"
          v-model:qty="w.qty"
          v-model:price="w.price"
          :name="w.name"
          :avatar-color="w.color"
          :remaining-label="`باقی‌مانده: ${remaining()}`"
        />
      </div>

      <div class="totals">
        <div class="totals__row">
          <span>جمع اختصاص داده شده</span>
          <strong>{{ totalAssigned() }}</strong>
        </div>
        <div class="totals__row totals__row--muted">
          <span>باقی‌مانده</span>
          <strong>{{ remaining() }}</strong>
        </div>
      </div>
    </div>

    <div class="form-footer">
      <router-link :to="{ name: 'add-job-3' }" class="footer-btn">
        <AppButton variant="outline">بازگشت</AppButton>
      </router-link>
      <div class="footer-btn">
        <AppButton :disabled="saving" @click="submitAssignments">
          {{ saving ? 'در حال ثبت...' : 'ثبت سفارش' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.form-body {
  @include page-padding;
  padding-top: $space-5;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  margin: 0 0 $space-4;
}

.empty-state {
  padding: $space-5 0;
  text-align: center;
  color: $color-text-muted;
  font-size: $font-size-sm;
}

.worker-card {
  @include card;
  padding: 0 $space-4;
  margin-bottom: $space-4;
}

.totals {
  &__row {
    @include flex-between;
    font-size: $font-size-md;
    font-weight: 700;
    padding: $space-1 0;

    &--muted {
      color: $color-text-muted;
      font-weight: 600;
      font-size: $font-size-sm;
    }
  }
}

.form-footer {
  @include page-padding;
  margin-top: $space-4;
  display: flex;
  gap: $space-3;
}

.footer-btn {
  flex: 1;
  display: block;
}
</style>
