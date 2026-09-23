<!--
  OrderDetailsColorsTab.vue
  ─────────────────────────────────────────────────────────────
  صفحهٔ «جزئیات سفارش ‑ تب رنگ‌ها» (طرح «کارگاه من»)
  Vue 3 · Composition API (script setup) · بدون هیچ کتابخانهٔ جانبی
  آیکون‌ها inline SVG هستن و استایل‌ها CSS ساده (scoped)

  استفاده:
    <OrderDetailsColorsTab
      :order="order"
      @back="router.back()"
      @edit="router.push(`/orders/${order.code}/edit`)"
    />

  دادهٔ سفارش (order):
    code, status ('active' | 'in-progress' | 'new' | 'done'), title,
    image (اختیاری)، totalQty, doneQty, daysLeft،
    colors: [{ id, name, hex, qty, done, allocated }]   ← done و allocated درصد هستن
-->

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    default: () => ({
      code: '1000',
      status: 'active',
      title: 'تی‌شرت',
      image: '', // خالی = تصویر پیش‌فرض (SVG). آدرس عکس محصول رو اینجا بده
      totalQty: 10000,
      doneQty: 7800,
      daysLeft: 2,
      colors: [
        {
          id: 1,
          name: 'مشکی',
          hex: '#26262b',
          qty: 7000,
          done: 85,
          allocated: 85,
        },
        {
          id: 2,
          name: 'صورتی',
          hex: '#f8a4b9',
          qty: 3000,
          done: 52,
          allocated: 80,
        },
      ],
    }),
  },
  // نوار وضعیت گوشی (۹:۴۱ و آیکون‌ها) که توی طرح هست. روی گوشی واقعی / PWA خاموشش کن
  showStatusBar: { type: Boolean, default: true },
});

const emit = defineEmits(['back', 'menu', 'edit', 'tab-change']);

/* ───────── ابزارهای فرمت ───────── */
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
// 7000 → ۷,۰۰۰
const fa = (n) =>
  Number(n)
    .toLocaleString('en-US')
    .replace(/\d/g, (d) => FA_DIGITS[d]);
const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

/* ───────── وضعیت سفارش (بج کنار کد سفارش) ───────── */
const STATUS = {
  active: { label: 'فعال', tone: 'green', plus: true },
  'in-progress': { label: 'در حال انجام', tone: 'orange' },
  new: { label: 'جدید', tone: 'amber' },
  done: { label: 'تکمیل شده', tone: 'gray' },
};
const status = computed(
  () =>
    STATUS[props.order.status] ??
    (props.order.status ? { label: props.order.status, tone: 'gray' } : null)
);

/* ───────── مهلت تحویل ───────── */
const urgent = computed(() => props.order.daysLeft <= 3);
const dueText = computed(() => {
  const d = props.order.daysLeft;
  if (d > 0) return `${fa(d)} روز تا تحویل`;
  if (d === 0) return 'امروز موعد تحویل است';
  return `${fa(Math.abs(d))} روز تأخیر`;
});

/* ───────── پیشرفت کلی ───────── */
const overallPct = computed(() =>
  props.order.totalQty > 0
    ? clamp((props.order.doneQty / props.order.totalQty) * 100)
    : 0
);

/* ───────── رنگ‌ها ───────── */
const colors = computed(() => props.order.colors ?? []);

/* ───────── تب‌ها ───────── */
const TABS = [
  { id: 'colors', label: 'رنگ‌ها' },
  { id: 'workers', label: 'کارگرها' },
  { id: 'finance', label: 'مالی' },
  { id: 'history', label: 'تاریخچه' },
];
const activeTab = ref('colors');

function selectTab(id) {
  if (id === activeTab.value) return;
  activeTab.value = id;
  emit('tab-change', id);
}

// ناوبری با کیبورد؛ چون صفحه RTL هست، فلش چپ = تب بعدی
function onTabsKeydown(e) {
  const step = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0;
  if (!step) return;
  e.preventDefault();
  const i = TABS.findIndex((t) => t.id === activeTab.value);
  const next = TABS[(i + step + TABS.length) % TABS.length];
  selectTab(next.id);
  e.currentTarget.querySelector(`#tab-${next.id}`)?.focus();
}
</script>

<template>
  <div class="order-page" dir="rtl" lang="fa">
    <div class="order-page__col">
      <!-- نوار وضعیت گوشی (فقط برای شبیه‌سازی طرح) -->
      <div v-if="showStatusBar" class="statusbar" aria-hidden="true">
        <span class="statusbar__time">9:41</span>
        <span class="statusbar__icons">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
            <rect x="10" y="3" width="3" height="9" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </svg>
          <svg
            width="17"
            height="12"
            viewBox="0 0 17 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
          >
            <path d="M1.4 4.3a10 10 0 0 1 14.2 0" />
            <path d="M4 7a6.3 6.3 0 0 1 9 0" />
            <path d="M6.6 9.6a2.6 2.6 0 0 1 3.8 0" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13" fill="currentColor">
            <rect
              x=".5"
              y=".5"
              width="22"
              height="12"
              rx="3.6"
              fill="none"
              stroke="currentColor"
              opacity=".4"
            />
            <rect x="2" y="2" width="19" height="9" rx="2.2" />
            <path
              d="M24.4 4.6v3.8c.8-.3 1.5-1.1 1.5-1.9s-.7-1.6-1.5-1.9z"
              opacity=".45"
            />
          </svg>
        </span>
      </div>

      <!-- هدر: بازگشت · کد سفارش · وضعیت ········· منو -->
      <header class="topbar">
        <button
          type="button"
          class="icon-btn topbar__back"
          aria-label="بازگشت"
          @click="emit('back')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <h1 class="topbar__title">#{{ order.code }}</h1>

        <span v-if="status" class="status" :class="`status--${status.tone}`">
          <svg
            v-if="status.plus"
            class="status__plus"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M6 2.4v7.2M2.4 6h7.2" />
          </svg>
          {{ status.label }}
        </span>

        <button
          type="button"
          class="icon-btn topbar__menu"
          aria-label="گزینه‌های بیشتر"
          @click="emit('menu')"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.9" />
            <circle cx="12" cy="12" r="1.9" />
            <circle cx="12" cy="19" r="1.9" />
          </svg>
        </button>
      </header>

      <!-- کارت محصول -->
      <section class="card summary" aria-label="خلاصهٔ سفارش">
        <div class="summary__info">
          <h2 class="summary__title">{{ order.title }}</h2>
          <p class="summary__qty">{{ fa(order.totalQty) }} قطعه</p>
          <p
            v-if="order.daysLeft != null"
            class="summary__due"
            :class="{ 'is-urgent': urgent }"
          >
            <svg
              v-if="urgent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M10.3 4.1 2.8 17.2a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.1a2 2 0 0 0-3.4 0Z"
              />
              <path d="M12 9.6v4" />
              <path d="M12 17h.01" />
            </svg>
            <span>{{ dueText }}</span>
          </p>
        </div>

        <div class="summary__thumb">
          <img v-if="order.image" :src="order.image" :alt="order.title" />
          <!-- تصویر پیش‌فرض تی‌شرت -->
          <svg
            v-else
            viewBox="0 0 104 104"
            role="img"
            :aria-label="order.title"
          >
            <defs>
              <linearGradient id="tee-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#fdecf1" />
                <stop offset="1" stop-color="#f8d3df" />
              </linearGradient>
              <linearGradient id="tee-body" x1="0.2" y1="0" x2="0.8" y2="1">
                <stop offset="0" stop-color="#f791a9" />
                <stop offset="1" stop-color="#ec6789" />
              </linearGradient>
              <filter
                id="tee-blur"
                x="-30%"
                y="-100%"
                width="160%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="2.4" />
              </filter>
            </defs>
            <rect width="104" height="104" fill="url(#tee-bg)" />
            <ellipse
              cx="52"
              cy="93"
              rx="28"
              ry="3.6"
              fill="#c73d6b"
              opacity=".25"
              filter="url(#tee-blur)"
            />
            <!-- بدنه و آستین‌ها -->
            <path
              d="M39 17 14 28 7 46l15 6 5-8v45q0 2 2 2h46q2 0 2-2V44l5 8 15-6-7-18-25-11q-5 11-13 11t-13-11Z"
              fill="url(#tee-body)"
            />
            <!-- نور و سایهٔ چین‌های پارچه -->
            <path d="M40 30q-5 28-3 60h-8V46Z" fill="#fff" opacity=".14" />
            <path d="M66 32q5 28 3 58h8V46Z" fill="#a8234f" opacity=".08" />
            <!-- درز آستین و سردوز -->
            <path
              d="M27 44q2-16 12-26M77 44q-2-16-12-26"
              fill="none"
              stroke="#b02a58"
              stroke-opacity=".3"
              stroke-width="1.2"
            />
            <path
              d="M8.8 44.2 22.6 49.7M95.2 44.2 81.4 49.7M29 86.6h46"
              fill="none"
              stroke="#b02a58"
              stroke-opacity=".24"
              stroke-width="1.2"
            />
            <!-- یقه -->
            <path d="M39 17q5 12 13 12t13-12q-5 6-13 6t-13-6Z" fill="#c43e68" />
            <path
              d="M39.6 18.6q5 12.4 12.4 12.4t12.4-12.4"
              fill="none"
              stroke="#b02a58"
              stroke-opacity=".38"
              stroke-width="1.4"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </section>

      <!-- پیشرفت کلی -->
      <section class="card overall" aria-labelledby="overall-title">
        <h2 id="overall-title" class="overall__title">پیشرفت کلی</h2>
        <div class="overall__row">
          <span class="overall__pct">{{ overallPct }}%</span>
          <div
            class="bar bar--lg"
            role="progressbar"
            aria-labelledby="overall-title"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="overallPct"
          >
            <i class="bar__fill" :style="{ '--w': overallPct + '%' }" />
          </div>
        </div>
        <p class="overall__count">
          {{ fa(order.doneQty) }} / {{ fa(order.totalQty) }}
        </p>
      </section>

      <!-- تب‌ها -->
      <div
        class="tabs"
        role="tablist"
        aria-label="بخش‌های جزئیات سفارش"
        @keydown="onTabsKeydown"
      >
        <button
          v-for="t in TABS"
          :id="`tab-${t.id}`"
          :key="t.id"
          type="button"
          role="tab"
          class="tabs__item"
          :class="{ 'is-active': activeTab === t.id }"
          :aria-selected="activeTab === t.id"
          :aria-controls="activeTab === t.id ? `panel-${t.id}` : undefined"
          :tabindex="activeTab === t.id ? 0 : -1"
          @click="selectTab(t.id)"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- تب رنگ‌ها -->
      <section
        v-if="activeTab === 'colors'"
        id="panel-colors"
        class="card colors"
        role="tabpanel"
        aria-labelledby="tab-colors"
      >
        <ul v-if="colors.length" class="colors__list">
          <li v-for="c in colors" :key="c.id ?? c.name" class="color">
            <span class="color__name">{{ c.name }}</span>
            <span class="color__qty">{{ fa(c.qty) }} قطعه</span>

            <!-- درصد انجام‌شده کنار نمونهٔ رنگ -->
            <span class="color__pct">{{ clamp(c.done) }}%</span>
            <span
              class="color__swatch"
              :style="{ '--swatch': c.hex }"
              aria-hidden="true"
            />

            <div
              class="bar color__bar"
              role="progressbar"
              :aria-label="`پیشرفت رنگ ${c.name}`"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuenow="clamp(c.done)"
            >
              <i class="bar__fill" :style="{ '--w': clamp(c.done) + '%' }" />
            </div>
            <!-- درصد تخصیص‌داده‌شده به کارگرها، انتهای نوار -->
            <span class="color__pct color__pct--end"
              >{{ clamp(c.allocated) }}%</span
            >
          </li>
        </ul>
        <p v-else class="colors__empty">
          هنوز رنگی برای این سفارش ثبت نشده است
        </p>
      </section>

      <!-- تب‌های دیگه: از بیرون با اسلات (#workers, #finance, #history) پر می‌شن -->
      <section
        v-else
        :id="`panel-${activeTab}`"
        role="tabpanel"
        :aria-labelledby="`tab-${activeTab}`"
      >
        <slot :name="activeTab">
          <p class="placeholder">محتوای این تب هنوز ساخته نشده است</p>
        </slot>
      </section>

      <!-- دکمهٔ شناور ویرایش -->
      <div class="fab-dock">
        <button type="button" class="fab" @click="emit('edit')">
          ویرایش
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 20h4.2L19.4 8.8a2.4 2.4 0 0 0-3.4-3.4L4.8 16.6 4 20Z" />
            <path d="m14.6 7 3.4 3.4" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─────────── توکن‌ها ─────────── */
.order-page {
  --rose: #e0507c;
  --rose-deep: #d23e6c;
  --rose-soft: #ee7a9e;
  --ink: #2b2228;
  --muted: #93858c;
  --track: #f9dee7;
  --line: rgba(232, 140, 170, 0.22);
  --card: rgba(255, 255, 255, 0.78);
  --card-edge: rgba(255, 255, 255, 0.95);
  --shadow:
    0 10px 26px -12px rgba(226, 90, 130, 0.32),
    0 1px 3px rgba(226, 90, 130, 0.1);

  min-height: 100vh;
  min-height: 100dvh;
  color: var(--ink);
  font-family:
    'Vazirmatn', 'Vazir', 'IRANSansX', 'IRANSans', Tahoma, system-ui, sans-serif;
  background:
    radial-gradient(90% 45% at 100% 0%, #ffeaf0 0%, rgba(255, 234, 240, 0) 70%),
    linear-gradient(180deg, #fdeff3 0%, #fbe3eb 100%);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}

.order-page *,
.order-page *::before,
.order-page *::after {
  box-sizing: border-box;
}

.order-page__col {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  min-height: 100dvh;
  margin-inline: auto;
  padding: 0 18px;
  display: flex;
  flex-direction: column;
}

button {
  font: inherit;
  color: inherit;
  touch-action: manipulation;
}

:focus-visible {
  outline: 2px solid var(--rose);
  outline-offset: 2px;
}

/* ─────────── کارت ─────────── */
.card {
  background: var(--card);
  border: 1px solid var(--card-edge);
  border-radius: 22px;
  box-shadow: var(--shadow);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

/* ─────────── نوار وضعیت ─────────── */
.statusbar {
  height: 47px;
  padding: 4px 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  direction: ltr;
  font-family:
    -apple-system, 'SF Pro Text', 'Segoe UI', Roboto, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: #17141a;
}
.statusbar__icons {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ─────────── هدر ─────────── */
.topbar {
  height: 48px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  direction: ltr; /* در طرح: بازگشت سمت چپ، منو سمت راست */
}
.topbar__title {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.2px;
}
.icon-btn {
  width: 40px;
  height: 40px;
  flex: none;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  transition: background-color 0.15s;
}
.icon-btn svg {
  width: 24px;
  height: 24px;
}
.icon-btn:hover {
  background: rgba(224, 80, 124, 0.08);
}
.icon-btn:active {
  background: rgba(224, 80, 124, 0.16);
}
.topbar__back {
  margin-left: -8px;
}
.topbar__menu {
  margin-left: auto;
  margin-right: -8px;
}

/* بج وضعیت */
.status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  direction: rtl;
  height: 26px;
  padding: 0 11px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
}
.status__plus {
  width: 9px;
  height: 9px;
}
.status--green {
  background: #dcf4e5;
  color: #25985b;
}
.status--orange {
  background: #fde7db;
  color: #e0632b;
}
.status--amber {
  background: #fff0d3;
  color: #d48a0e;
}
.status--gray {
  background: #efe9ed;
  color: #85787f;
}

/* ─────────── کارت محصول ─────────── */
.summary {
  margin-top: 18px;
  padding: 12px;
  display: flex;
  gap: 14px;
}
.summary__info {
  flex: 1;
  min-width: 0;
  padding: 2px 6px 2px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
}
.summary__title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.3;
  overflow-wrap: anywhere;
}
.summary__qty {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--muted);
}
.summary__due {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--muted);
}
.summary__due svg {
  width: 18px;
  height: 18px;
  flex: none;
}
.summary__due.is-urgent {
  color: #e2456f;
}
.summary__thumb {
  flex: none;
  width: 104px;
  height: 104px;
  border-radius: 16px;
  overflow: hidden;
  background: #fbdfe7;
}
.summary__thumb img,
.summary__thumb svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ─────────── نوار پیشرفت ─────────── */
.bar {
  --h: 8px;
  position: relative;
  height: var(--h);
  border-radius: 999px;
  background: var(--track);
  overflow: hidden;
  direction: ltr; /* پر شدن از چپ به راست، مثل طرح */
}
.bar--lg {
  --h: 10px;
}
.bar__fill {
  display: block;
  height: 100%;
  width: var(--w);
  border-radius: inherit;
  background: linear-gradient(90deg, #dc4674, #ea6890);
  transition: width 0.5s cubic-bezier(0.22, 0.8, 0.24, 1);
  animation: bar-in 0.9s cubic-bezier(0.22, 0.8, 0.24, 1) both;
}
@keyframes bar-in {
  from {
    width: 0;
  }
}

/* ─────────── پیشرفت کلی ─────────── */
.overall {
  margin-top: 12px;
  padding: 16px 18px 16px;
}
.overall__title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 800;
}
.overall__row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.overall__row .bar {
  flex: 1;
}
.overall__pct {
  min-width: 42px;
  font-size: 16px;
  font-weight: 800;
  color: var(--rose);
  direction: ltr;
  text-align: center;
}
.overall__count {
  margin: 10px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  direction: ltr; /* ۷,۸۰۰ / ۱۰,۰۰۰ همون ترتیب طرح */
  text-align: left;
}

/* ─────────── تب‌ها ─────────── */
.tabs {
  margin-top: 14px;
  padding: 4px;
  display: flex;
  gap: 2px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid var(--card-edge);
  box-shadow: var(--shadow);
}
.tabs__item {
  position: relative;
  flex: 1;
  height: 48px;
  padding: 0;
  border: 0;
  border-radius: 14px;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  transition:
    color 0.2s,
    background-color 0.2s;
}
.tabs__item:hover:not(.is-active) {
  color: var(--ink);
}
.tabs__item.is-active {
  background: #fde4ec;
  color: var(--rose);
  font-weight: 800;
}
.tabs__item.is-active::after {
  content: '';
  position: absolute;
  inset-inline: 14px;
  bottom: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--rose);
}

/* ─────────── کارت رنگ‌ها ─────────── */
.colors {
  margin-top: 14px;
  padding: 2px 18px;
}
.colors__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.color + .color {
  border-top: 1px solid var(--line);
}

/*
  چیدمان هر ردیف مثل طرح از چپ به راست:
  [ نام / تعداد / نوار ]  [ درصد ]  [ نمونهٔ رنگ ]
*/
.color {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px 34px;
  grid-template-areas:
    'name pct swatch'
    'qty  pct swatch'
    'bar  end .';
  column-gap: 10px;
  align-items: center;
  padding: 16px 0 18px;
  direction: ltr;
}
.color__name,
.color__qty {
  direction: rtl; /* متن فارسی، ولی چپ‌چین مثل طرح */
  text-align: left;
}
.color__name {
  grid-area: name;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.color__qty {
  grid-area: qty;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
}
.color__pct {
  grid-area: pct;
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.color__pct--end {
  grid-area: end;
}
.color__swatch {
  grid-area: swatch;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--swatch);
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.26),
    0 0 0 1px rgba(0, 0, 0, 0.07),
    0 4px 9px -3px rgba(70, 30, 50, 0.32);
}
.color__bar {
  grid-area: bar;
  margin-top: 10px;
}
.colors__empty,
.placeholder {
  margin: 0;
  padding: 28px 0;
  text-align: center;
  font-size: 14px;
  color: var(--muted);
}

/* ─────────── دکمهٔ شناور ─────────── */
.fab-dock {
  position: sticky;
  bottom: 0;
  margin-top: auto;
  padding: 18px 0 calc(22px + env(safe-area-inset-bottom, 0px));
  display: flex;
  justify-content: flex-start; /* RTL: سمت راست */
  pointer-events: none;
}
.fab {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #f0729a 0%, #dc4a78 100%);
  box-shadow:
    0 14px 26px -10px rgba(220, 74, 120, 0.65),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition:
    transform 0.15s,
    filter 0.15s;
}
.fab svg {
  width: 21px;
  height: 21px;
}
.fab:hover {
  filter: brightness(1.05);
}
.fab:active {
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .bar__fill {
    animation: none;
    transition: none;
  }
  .fab {
    transition: none;
  }
}
</style>

<!-- فونت وزیرمتن. اگه فونت رو قبلاً توی پروژه لود کردی این بلاک رو حذف کن -->
<style>
@import url('https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/Vazirmatn-Variable-font-face.css');
</style>
