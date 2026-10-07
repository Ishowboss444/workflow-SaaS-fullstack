<script setup>
import { Plus, CircleCheck, X, Trash2 } from 'lucide-vue-next';
import StepperHeader from '../components/common/StepperHeader.vue';
import AppButton from '../components/common/AppButton.vue';
import { useProductStore } from '@/stores/useProductStore.js';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
// toast.success('herre')
const router = useRouter();
const product = useProductStore();

const colors = ref([
  {
    id: 1,
    name: 'مشکی',
    qty: 500,
    hex: '#2b2130',
    edit: false,
  },
  {
    id: 2,
    name: 'صورتی',
    qty: 500,
    hex: '#e83e8c',
    edit: false,
  },
]);

const addingColor = ref(false);

const newColor = ref({
  name: '',
  qty: 0,
  hex: '#e83e8c',
});

const totalAmount = computed(() => {
  return colors.value.reduce((amount, color) => {
    return amount + Number(color.qty || 0);
  }, 0);
});

const productAmount = computed(() => {
  return Number(product.newProduct.amount || 0);
});

const remainingAmount = computed(() => {
  return productAmount.value - totalAmount.value;
});

const isComplete = computed(() => {
  return totalAmount.value === productAmount.value;
});

function closeEditors() {
  colors.value.forEach((color) => {
    color.edit = false;
  });

  addingColor.value = false;
}

function toggleEdit(color) {
  colors.value.forEach((item) => {
    if (item !== color) {
      item.edit = false;
    }
  });

  addingColor.value = false;

  color.edit = !color.edit;
}

function openAddColor() {
  closeEditors();

  if (remainingAmount.value <= 0) {
    toast.error('تعداد کل تکمیل شده است');
    return;
  }

  newColor.value = {
    name: '',
    qty: remainingAmount.value,
    hex: '#e83e8c',
  };

  addingColor.value = true;
}

function cancelAddColor() {
  addingColor.value = false;
}

function addColor() {
  const name = newColor.value.name.trim();
  const qty = Number(newColor.value.qty);
  const id = colors.value.length + 1;
  if (!name) {
    toast.error('نام رنگ را وارد کنید');
    return;
  }

  if (!qty || qty <= 0) {
    toast.error('تعداد رنگ را وارد کنید');
    return;
  }

  if (totalAmount.value + qty > productAmount.value) {
    toast.error(
      `تعداد بیشتر از مقدار باقی‌مانده است (${remainingAmount.value.toLocaleString()} عدد)`
    );
    return;
  }

  colors.value.push({
    id,
    name,
    qty,
    hex: newColor.value.hex,
    edit: false,
  });

  addingColor.value = false;

  toast.success('رنگ اضافه شد');
}

function removeColor(color) {
  const index = colors.value.indexOf(color);

  if (index === -1) return;

  colors.value.splice(index, 1);

  toast.success('رنگ حذف شد');
}

function nextStep() {
  console.log('next');

  if (totalAmount.value !== productAmount.value) {
    if (remainingAmount.value > 0) {
      toast.error('dfdf');
      console.error(
        `${remainingAmount.value.toLocaleString()} عدد هنوز باقی مانده است`
      );
      toast.error(
        `${remainingAmount.value.toLocaleString()} عدد هنوز باقی مانده است`
      );
    } else {
      console.error('تعداد رنگ‌ها بیشتر از تعداد سفارش است');

      toast.error('تعداد رنگ‌ها بیشتر از تعداد سفارش است');
    }

    return;
  }

  product.newProduct.colors = colors.value.map((color) => ({
    name: color.name,
    qty: Number(color.qty),
    hex: color.hex,
  }));

  router.push({
    name: 'add-job-3',
  });

  toast.success('رنگ‌ها با موفقیت ثبت شدند');
}
</script>

<template>
  <div class="page page--no-nav">
    <StepperHeader :current-step="2" />

    <div class="form-body">
      <!-- Header -->
      <div class="section-heading">
        <div>
          <h2 class="section-title">رنگ‌ها و تنوع</h2>

          <p class="section-description">رنگ و تعداد هر تنوع را مشخص کنید.</p>
        </div>

        <span class="remaining-badge" :class="{ complete: isComplete }">
          <template v-if="isComplete"> تکمیل شد </template>

          <template v-else>
            {{ Math.max(remainingAmount, 0).toLocaleString() }}
            باقی‌مانده
          </template>
        </span>
      </div>

      <!-- Colors -->
      <div class="color-list">
        <div v-for="c in colors" :key="c.id" class="color-row">
          <!-- Quantity -->
          <button type="button" class="color-row__qty" @click="toggleEdit(c)">
            {{ Number(c.qty).toLocaleString() }}
            عدد
          </button>

          <!-- Name -->
          <button type="button" class="color-row__name" @click="toggleEdit(c)">
            {{ c.name }}
          </button>

          <!-- Color -->
          <button
            type="button"
            class="color-row__swatch"
            :style="{ backgroundColor: c.hex }"
            aria-label="ویرایش رنگ"
            @click="toggleEdit(c)"
          />

          <!-- INLINE COLOR EDITOR -->
          <div v-if="c.edit" class="color-editor">
            <div class="editor-header">
              <div>
                <h3>ویرایش رنگ</h3>

                <p>اطلاعات این رنگ را تغییر دهید.</p>
              </div>

              <button
                type="button"
                class="close-editor"
                @click="c.edit = false"
              >
                <X :size="18" />
              </button>
            </div>

            <!-- Color picker -->
            <div class="editor-field">
              <label> رنگ </label>

              <div class="color-picker-row">
                <input
                  v-model="c.hex"
                  type="color"
                  class="native-color-picker"
                />

                <span
                  class="large-color-swatch"
                  :style="{ backgroundColor: c.hex }"
                />

                <span class="hex-value">
                  {{ c.hex.toUpperCase() }}
                </span>
              </div>
            </div>

            <!-- Name -->
            <div class="editor-field">
              <label> نام رنگ </label>

              <input v-model="c.name" type="text" placeholder="مثلاً سفید" />
            </div>

            <!-- Quantity -->
            <div class="editor-field">
              <label> تعداد </label>

              <input
                v-model.number="c.qty"
                type="number"
                min="0"
                :max="productAmount"
                placeholder="تعداد"
              />
            </div>

            <!-- Delete -->
            <button
              type="button"
              class="delete-color-btn"
              @click="removeColor(c)"
            >
              <Trash2 :size="16" />
              حذف این رنگ
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="colors.length === 0" class="empty-state">
          هنوز رنگی اضافه نشده است.
        </div>
      </div>

      <!-- Add color -->
      <button
        type="button"
        class="add-color-btn"
        :disabled="remainingAmount <= 0"
        @click="openAddColor"
      >
        <Plus :size="16" />
        افزودن رنگ
      </button>

      <!-- ADD COLOR PANEL -->
      <div v-if="addingColor" class="add-color-panel">
        <div class="add-color-header">
          <div>
            <h3>افزودن رنگ جدید</h3>

            <p>
              {{ Math.max(remainingAmount, 0).toLocaleString() }}
              عدد باقی مانده
            </p>
          </div>

          <button type="button" class="close-editor" @click="cancelAddColor">
            <X :size="18" />
          </button>
        </div>

        <!-- Color -->
        <div class="editor-field">
          <label> رنگ </label>

          <div class="color-picker-row">
            <input
              v-model="newColor.hex"
              type="color"
              class="native-color-picker"
            />

            <span
              class="large-color-swatch"
              :style="{ backgroundColor: newColor.hex }"
            />

            <span class="hex-value">
              {{ newColor.hex.toUpperCase() }}
            </span>
          </div>
        </div>

        <!-- Name -->
        <div class="editor-field">
          <label> نام رنگ </label>

          <input v-model="newColor.name" type="text" placeholder="مثلاً سفید" />
        </div>

        <!-- Quantity -->
        <div class="editor-field">
          <label> تعداد </label>

          <input
            v-model.number="newColor.qty"
            type="number"
            min="1"
            :max="Math.max(remainingAmount, 0)"
            placeholder="تعداد"
          />
        </div>

        <!-- Actions -->
        <div class="editor-actions">
          <button type="button" class="cancel-btn" @click="cancelAddColor">
            لغو
          </button>

          <button type="button" class="save-color-btn" @click="addColor">
            افزودن رنگ
          </button>
        </div>
      </div>

      <!-- Total -->
      <div class="total-field">
        <span class="total-field__label"> جمع کل </span>

        <div class="total-field__control" :class="{ incomplete: !isComplete }">
          <CircleCheck
            v-if="isComplete"
            :size="18"
            class="total-field__check"
          />

          <span>
            {{ totalAmount.toLocaleString() }}
            /
            {{ productAmount.toLocaleString() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="form-footer">
      <router-link :to="{ name: 'add-job-1' }" class="footer-btn">
        <AppButton variant="outline"> بازگشت </AppButton>
      </router-link>

      <div class="footer-btn">
        <AppButton @click="nextStep"> ادامه </AppButton>
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
  padding-bottom: $space-4;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-3;
  margin-bottom: $space-4;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 700;
  margin: 0 0 5px;
}

.section-description {
  margin: 0;
  color: $color-text-secondary;
  font-size: $font-size-sm;
}

.remaining-badge {
  flex-shrink: 0;
  padding: 7px 10px;
  border-radius: $radius-pill;
  background: #fff1cf;
  color: #a97900;
  font-size: $font-size-xs;
  font-weight: 700;
  white-space: nowrap;

  &.complete {
    background: $color-status-done-bg;
    color: $color-status-done-text;
  }
}

/* =========================
   COLOR LIST
========================= */

.color-list {
  @include card;
  padding: 0 $space-4;
  margin-bottom: $space-4;
}

.color-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: $space-3;
  min-height: 66px;
  padding: $space-4 0;
  border-bottom: 1px solid $color-border-soft;

  &:last-child {
    border-bottom: none;
  }

  &__qty {
    padding: 0;
    border: 0;
    background: transparent;
    color: $color-text-secondary;
    font-family: inherit;
    font-size: $font-size-sm;
    cursor: pointer;
  }

  &__name {
    flex: 1;
    padding: 0;
    border: 0;
    background: transparent;
    color: $color-text-primary;
    font-family: inherit;
    font-size: $font-size-md;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
  }

  &__swatch {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    border-radius: 50%;
    border: 2px solid $color-bg-card;
    box-shadow: 0 0 0 1px $color-border;
    cursor: pointer;
  }
}

.empty-state {
  padding: $space-5 0;
  color: $color-text-muted;
  text-align: center;
  font-size: $font-size-sm;
}

/* =========================
   EDITOR
========================= */

.color-editor,
.add-color-panel {
  position: fixed;
  z-index: 100;
  top: 50%;
  left: 50%;
  width: min(90%, 430px);
  max-height: 75vh;
  overflow-y: auto;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  padding: 1.5rem;
  border-radius: 18px;
  background: $color-bg-soft;
  box-shadow: 0 15px 50px rgba(43, 33, 48, 0.25);
}

.color-editor::before,
.add-color-panel::before {
  content: '';
  position: fixed;
  z-index: -1;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  background: rgba(43, 33, 48, 0.22);
}

.editor-header,
.add-color-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: $space-4;

  h3 {
    margin: 0 0 4px;
    color: $color-text-primary;
    font-size: $font-size-md;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: $color-text-secondary;
    font-size: $font-size-xs;
  }
}

.close-editor {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: white;
  color: $color-text-secondary;
  cursor: pointer;

  &:hover {
    color: $color-text-primary;
  }
}

.editor-field {
  margin-bottom: $space-3;

  label {
    display: block;
    margin-bottom: 7px;
    color: $color-text-secondary;
    font-size: $font-size-xs;
    font-weight: 600;
  }

  > input {
    width: 100%;
    height: 46px;
    box-sizing: border-box;
    padding: 0 13px;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    outline: none;
    background: white;
    color: $color-text-primary;
    font-family: inherit;
    font-size: $font-size-sm;

    &:focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba(232, 62, 140, 0.08);
    }
  }
}

/* =========================
   COLOR PICKER
========================= */

.color-picker-row {
  display: flex;
  align-items: center;
  gap: $space-3;
  height: 54px;
  padding: 5px 10px;
  box-sizing: border-box;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background: white;
}

.native-color-picker {
  width: 42px;
  height: 42px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background: transparent;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: 0;
    border-radius: 50%;
  }
}

.large-color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px $color-border;
}

.hex-value {
  direction: ltr;
  color: $color-text-secondary;
  font-size: $font-size-xs;
}

/* =========================
   BUTTONS
========================= */

.add-color-btn {
  width: 100%;
  height: 46px;
  border-radius: $radius-md;
  border: 1.5px dashed $color-primary-light;
  background: $color-bg-card;
  color: $color-primary;
  font-family: inherit;
  font-size: $font-size-md;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  margin-bottom: $space-5;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.editor-actions {
  display: flex;
  gap: $space-2;
  margin-top: $space-4;
}

.cancel-btn,
.save-color-btn {
  flex: 1;
  height: 44px;
  border-radius: $radius-md;
  font-family: inherit;
  font-size: $font-size-sm;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn {
  border: 1px solid $color-border;
  background: white;
  color: $color-text-secondary;
}

.save-color-btn {
  border: 0;
  background: $color-primary;
  color: white;
}

.delete-color-btn {
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  margin-top: $space-4;
  border: 1px solid #f0b7c4;
  border-radius: $radius-md;
  background: #fff5f7;
  color: #c43c5c;
  font-family: inherit;
  font-size: $font-size-sm;
  font-weight: 600;
  cursor: pointer;
}

/* =========================
   TOTAL
========================= */

.total-field {
  &__label {
    display: block;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin-bottom: $space-2;
  }

  &__control {
    @include flex-center;
    gap: $space-2;
    height: 50px;
    background: $color-status-done-bg;
    border-radius: $radius-md;
    color: $color-status-done-text;
    font-weight: 700;

    &.incomplete {
      background: #fff1cf;
      color: #a97900;
    }
  }

  &__check {
    color: $color-status-done-text;
  }
}

/* =========================
   FOOTER
========================= */

.form-footer {
  @include page-padding;
  margin-top: $space-4;
  padding-bottom: $space-5;
  display: flex;
  gap: $space-3;
}

.footer-btn {
  flex: 1;
  display: block;
}
</style>
