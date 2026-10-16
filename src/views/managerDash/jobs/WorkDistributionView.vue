<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import PageHeader from '@/components/common/PageHeader.vue';
import WorkerAssignRow from '@/components/common/WorkerAssignRow.vue';
import AppButton from '@/components/common/AppButton.vue';
import Loading from '@/components/common/Loading.vue';
import { useGlobalStore } from '@/stores/useGlobal';
import { getWorkplaceMembers } from '@/api/workplace';
import { getProducts } from '@/api/product';
import { createAssignment } from '@/api/assignment';

const global = useGlobalStore();
const router = useRouter();

const products = ref([]);
const workers = ref([]);
const selectedProduct = ref(null);
const loading = ref(true);
const saving = ref(false);

const fieldLabels = {
  rightTailor: 'خیاط راست',
  topTailor: 'خیاط بالا',
  midTailor: 'خیاط وسط',
  general: 'عمومی',
};

const statusLabels = {
  NOT_BROADCASTED: 'پخش نشده',
  BROADCASTED: 'پخش شده',
  IN_PROGRESS: 'در حال انجام',
  DONE: 'تمام شده',
};

onMounted(async () => {
  try {
    const [productsResponse, membersResponse] = await Promise.all([
      getProducts(null, global.workplaceId),
      getWorkplaceMembers(global.workplaceId),
    ]);

    products.value = productsResponse.data || [];

    const members = membersResponse.data.members || membersResponse.data?.members || [];
    workers.value = members
      .filter((m) => m.role === 'WORKER')
      .map((m) => ({
        id: m.id,
        name: m.name,
        color: stringToColor(m.name),
        qty: 0,
        price: 0,
        remaining: 0,
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

function selectProduct(product) {
  if (product.status !== 'NOT_BROADCASTED') {
    toast.error('this product is already broadcasted');
    return;
  }
  selectedProduct.value = product;
  const workerSalary = product.salary?.worker || 0;
  workers.value.forEach((w) => {
    w.price = workerSalary;
    w.remaining = product.amount;
  });
}

const totalAssigned = () =>
  workers.value.reduce((sum, w) => sum + (Number(w.qty) || 0), 0);

const remaining = () =>
  (selectedProduct.value?.amount || 0) - totalAssigned();

const exceedsLimit = () => remaining() < 0;

async function submitAssignments() {
  if (!selectedProduct.value) {
    toast.error('select a product first');
    return;
  }

  if (totalAssigned() === 0) {
    toast.error('enter quantity for at least one worker');
    return;
  }

  if (exceedsLimit()) {
    toast.error('total quantity exceeds product amount');
    return;
  }

  saving.value = true;
  try {
    const productId = selectedProduct.value.id;
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
  <div v-else class="page page--no-nav">
    <PageHeader title="پخش کار" />

    <div class="tab-body">
      <!-- Product selector -->
      <div class="product-selector">
        <label class="product-selector__label">انتخاب محصول</label>
        <select
          v-model="selectedProduct"
          class="product-selector__select"
          @change="selectProduct(selectedProduct)"
        >
          <option :value="null" disabled>انتخاب محصول</option>
          <option
            v-for="p in products"
            :key="p.id"
            :value="p"
            :disabled="p.status !== 'NOT_BROADCASTED'"
            :class="{ 'option--disabled': p.status !== 'NOT_BROADCASTED' }"
          >
            {{ p.name }} — {{ p.amount }} عدد — {{ statusLabels[p.status] }}
          </option>
        </select>
      </div>

      <!-- Selected product card -->
      <div v-if="selectedProduct" class="product-card">
        <h3 class="product-card__title">{{ selectedProduct.name }}</h3>
        <div class="product-card__row">
          <span>تعداد کل:</span>
          <strong>{{ selectedProduct.amount }}</strong>
        </div>
        <div class="product-card__row">
          <span>باقی‌مانده:</span>
          <strong>{{ remaining() }}</strong>
        </div>
        <div class="product-card__row">
          <span>رشته کارگر:</span>
          <strong>{{ fieldLabels[selectedProduct.field] || selectedProduct.field || 'عمومی' }}</strong>
        </div>
        <div class="product-card__row">
          <span>وضعیت:</span>
          <strong>{{ statusLabels[selectedProduct.status] }}</strong>
        </div>
      </div>

      <!-- Workers list -->
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

      <!-- Warning -->
      <div v-if="exceedsLimit()" class="warning">
        مقدار بیشتر از باقی‌مانده است
      </div>

      <!-- Totals -->
      <div v-if="selectedProduct && workers.length > 0" class="totals">
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
        v-if="selectedProduct && workers.length > 0"
        :disabled="saving || exceedsLimit()"
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

.product-selector {
  &__label {
    display: block;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    font-weight: 600;
    margin-bottom: $space-2;
  }

  &__select {
    width: 100%;
    height: 46px;
    padding: 0 $space-3;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background: $color-bg-card;
    color: $color-text-primary;
    font-size: $font-size-sm;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: $color-primary;
    }
  }
}

.option--disabled {
  color: $color-text-muted;
}

.product-card {
  @include card;
  padding: $space-4;

  &__title {
    font-size: $font-size-md;
    font-weight: 700;
    margin: 0 0 $space-3;
  }

  &__row {
    @include flex-between;
    font-size: $font-size-sm;
    padding: $space-1 0;

    span {
      color: $color-text-secondary;
    }
  }
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

.warning {
  padding: $space-3 $space-4;
  background: #fff1cf;
  border-radius: $radius-md;
  color: #a97900;
  font-size: $font-size-sm;
  font-weight: 600;
  text-align: center;
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
