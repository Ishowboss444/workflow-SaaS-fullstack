<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/useGlobal';
import { getWorkplaceMembers } from '@/api/workplace';
import { Users, Search, ChevronDown, BriefcaseBusiness } from 'lucide-vue-next';
import Loading from '@/components/common/Loading.vue';

const router = useRouter();
const global = useGlobalStore();

const workplaceName = ref('');
const members = ref([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const selectedField = ref('all');
const showDropdown = ref(false);

const fieldOptions = [
  { value: 'all', label: 'همه رشته‌ها' },
  { value: 'rightTailor', label: 'خیاط راست' },
  { value: 'topTailor', label: 'خیاط بالا' },
  { value: 'midTailor', label: 'خیاط وسط' },
  { value: 'general', label: 'شاگرد' },
];

const fieldLabels = {
  rightTailor: 'خیاط راست',
  topTailor: 'خیاط بالا',
  midTailor: 'خیاط وسط',
  general: 'شاگرد',
};

const filteredMembers = computed(() => {
  let result = members.value;

  if (selectedField.value !== 'all') {
    result = result.filter((m) => m.field === selectedField.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    result = result.filter(
      (m) => m.name.toLowerCase().includes(q) || m.username.toLowerCase().includes(q)
    );
  }

  return result;
});

function getFieldLabel(field) {
  return fieldLabels[field] || field || 'نامشخص';
}

function selectField(option) {
  selectedField.value = option.value;
  showDropdown.value = false;
}

function goToMember(member) {
  router.push(`/managerDashboard/Members/${member.id}`);
}

onMounted(async () => {
  try {
    console.log(global.workplaceId);
    
    const data = await getWorkplaceMembers(global.workplaceId);
    workplaceName.value = data.data.name;
    members.value = (data.data.members || []).filter((m) => m.role === 'WORKER');
  } catch (err) {
    error.value = err.message || 'خطا در دریافت اعضا';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page members-page">
    <Loading v-if="loading" />

    <template v-else-if="error">
      <div class="error-state">
        <p>{{ error }}</p>
      </div>
    </template>

    <template v-else>
      <!-- HEADER -->
      <header class="members-header">
        <div class="header-icon">
          <Users :size="20" />
        </div>
        <div class="header-content">
          <h1>{{ workplaceName }}</h1>
          <p>اعضای کارگاه</p>
        </div>
      </header>

      <!-- SEARCH & FILTER -->
      <div class="controls">
        <div class="search-box">
          <Search :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجوی نام یا نام کاربری..."
          />
        </div>

        <div class="dropdown-wrapper">
          <button type="button" class="dropdown-btn" @click="showDropdown = !showDropdown">
            <span>{{ fieldOptions.find((f) => f.value === selectedField)?.label }}</span>
            <ChevronDown :size="14" :class="{ rotated: showDropdown }" />
          </button>
          <div v-if="showDropdown" class="dropdown-menu">
            <button
              v-for="option in fieldOptions"
              :key="option.value"
              type="button"
              class="dropdown-item"
              :class="{ active: selectedField === option.value }"
              @click="selectField(option)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- COUNT -->
      <div class="count-header">
        <span>اعضا</span>
        <small>{{ filteredMembers.length }} نفر</small>
      </div>

      <!-- MEMBERS LIST -->
      <main class="members-list">
        <article
          v-for="member in filteredMembers"
          :key="member.id"
          class="member-card"
          @click="goToMember(member)"
        >
          <div class="member-main">
            <div class="avatar">
              {{ member.name?.[0] || '؟' }}
            </div>
            <div class="member-info">
              <h2>{{ member.name }}</h2>
              <div class="member-username">
                <span>@{{ member.username }}</span>
              </div>
              <div class="member-field">
                <BriefcaseBusiness :size="12" />
                <span>{{ getFieldLabel(member.field) }}</span>
              </div>
            </div>
          </div>
          <div class="role-badge">کارمند</div>
        </article>

        <!-- EMPTY -->
        <div v-if="filteredMembers.length === 0" class="empty-state">
          <div class="empty-icon">
            <Users :size="22" />
          </div>
          <h3>عضوی پیدا نشد</h3>
          <p>عبارت جستجو یا فیلد را تغییر دهید.</p>
        </div>
      </main>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.members-page {
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
.members-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  @include page-padding;
  padding-top: $space-5;
}

.header-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 14px;
  background: $color-bg-soft;
  color: $color-primary;
}

.header-content h1 {
  margin: 0;
  color: $color-text;
  font-size: 1.2rem;
  font-weight: 800;
}

.header-content p {
  margin: 0.25rem 0 0;
  color: $color-text-secondary;
  font-size: 0.7rem;
}

/* CONTROLS */
.controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  @include page-padding;
  margin-top: 1.2rem;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid $color-border-soft;
  border-radius: 13px;
  background: $color-bg-card;
  color: $color-text-secondary;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-box:focus-within {
  border-color: $color-primary;
  box-shadow: 0 0 0 3px rgba(232, 62, 140, 0.08);
}

.search-box input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: $color-text;
  font-family: inherit;
  font-size: 0.75rem;
}

.search-box input::placeholder {
  color: $color-text-secondary;
}

/* DROPDOWN */
.dropdown-wrapper {
  position: relative;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid $color-border-soft;
  border-radius: 13px;
  background: $color-bg-card;
  color: $color-text;
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s;
  white-space: nowrap;
}

.dropdown-btn:hover {
  border-color: $color-border;
}

.dropdown-btn svg {
  transition: transform 0.2s;
}

.dropdown-btn svg.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  min-width: 140px;
  background: $color-bg-card;
  border: 1px solid $color-border-soft;
  border-radius: 13px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  padding: 0.3rem;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: $color-text;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  text-align: right;
  cursor: pointer;
  transition: background 0.12s;
}

.dropdown-item:hover {
  background: $color-bg-soft;
}

.dropdown-item.active {
  background: $color-bg-soft;
  color: $color-primary;
}

/* COUNT */
.count-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  @include page-padding;
  margin-top: 1.4rem;
  margin-bottom: 0.7rem;
}

.count-header span {
  color: $color-text;
  font-size: 0.8rem;
  font-weight: 800;
}

.count-header small {
  color: $color-text-secondary;
  font-size: 0.65rem;
}

/* MEMBERS LIST */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  @include page-padding;
}

.member-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 0.85rem;
  border: 1px solid $color-border-soft;
  border-radius: 17px;
  background: $color-bg-card;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}

.member-card:hover {
  transform: translateY(-1px);
  border-color: $color-border;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.035);
}

.member-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 13px;
  background: $color-bg-soft;
  color: $color-text;
  font-size: 0.9rem;
  font-weight: 800;
}

.member-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.member-info h2 {
  overflow: hidden;
  margin: 0;
  color: $color-text;
  font-size: 0.82rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-username {
  margin-top: 0.15rem;
  color: $color-text-secondary;
  font-size: 0.65rem;
}

.member-field {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.25rem;
  color: $color-text-secondary;
  font-size: 0.62rem;
}

.role-badge {
  flex-shrink: 0;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: $color-bg-soft;
  color: $color-primary;
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
}

/* MOBILE */
@media (max-width: 480px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .dropdown-wrapper {
    width: 100%;
  }

  .dropdown-btn {
    width: 100%;
    justify-content: space-between;
  }

  .member-card {
    padding: 0.7rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 11px;
  }
}
</style>
