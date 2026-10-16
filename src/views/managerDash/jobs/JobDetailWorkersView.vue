<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import JobDetailHeader from '@/components/common/JobDetailHeader.vue';
import WorkerAssignRow from '@/components/common/WorkerAssignRow.vue';
import AppButton from '@/components/common/AppButton.vue';
import Loading from '@/components/common/Loading.vue';
import { useProductStore } from '@/stores/useProductStore';
import { useGlobalStore } from '@/stores/useGlobal';
import { getWorkplaceMembers } from '@/api/workplace';
import { createAssignment } from '@/api/assignment';

const route = useRoute();
const router = useRouter();
const product = useProductStore();
const global = useGlobalStore();

const workers = ref([]);
const productData = ref(null);
const loading = ref(true);
const saving = ref(false);

onMounted(async () => {
  try {
    const id = route.params.id;
    const [productResponse, membersResponse] = await Promise.all([
      product._getProduct(id),
      getWorkplaceMembers(global.workplaceId),
    ]);

    productData.value = productResponse.data;
    const members = membersResponse.data.members || membersResponse.data?.members || [];
    const productAmount = productResponse.data.amount;

    workers.value = members
      .filter((m) => m.role === 'WORKER')
      .map((m) => ({
        id: m.id,
        name: m.name,
        color: stringToColor(m.name),
        qty: 0,
        price: productResponse.data.salary?.worker || 0,
        remaining: productAmount,
      }));
  } catch (err) {
    toast.error('error loading data');
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

const remaining = () =>
  (productData.value?.amount || 0) - totalAssigned();

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
    const productId = Number(route.params.id);
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
    router.push({ name: 'job-list' });
  } catch (err) {
    toast.error(err.message || 'error saving assignments');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Loading v-if="loading" />
  <div v-else class="page">
    <JobDetailHeader active-tab="workers" :data="productData" />

    <div class="tab-body">
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

      <div v-if="workers.length > 0" class="totals">
        <div class="totals__row">
          <span>جمع اختصاص داده شده</span>
          <strong>{{ totalAssigned() }}</strong>
        </div>
        <div class="totals__row totals__row--muted">
          <span>باقی‌مانده</span>
          <strong>{{ remaining() }}</strong>
        </div>
      </div>

      <AppButton
        v-if="workers.length > 0"
        :disabled="saving"
        @click="submitAssignments"
      >
        {{ saving ? 'در حال ثبت...' : 'ثبت و ارسال' }}
      </AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.tab-body {
  @include page-padding;
  padding-top: $space-4;
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.empty-state {
  padding: $space-5 0;
  text-align: center;
  color: $color-text-muted;
  font-size: $font-size-sm;
}

.worker-card {
  @include card;
  padding: $space-1 $space-4;

  > * + * {
    border-top: 1px solid $color-border-soft;
  }
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
</style>
