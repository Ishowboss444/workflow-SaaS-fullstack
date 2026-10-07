<script setup>
import Loading from '@/components/common/Loading.vue';
import { useInvitationsStore } from '@/stores/useInvitationsStore';
import { useUsersStore } from '@/stores/useUsersStore';
import { from } from 'bcrypto/lib/native/bn';
import {
  Search,
  UserPlus,
  Check,
  BriefcaseBusiness,
  Users,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';

const search = ref('');
const people = ref([]);
const user = useUsersStore();
const invite = useInvitationsStore();
async function sendInvitation(person) {
  if (person.workplaceId)
    return toast.warning('این یوزر درحال حاضر در یک کارگاه هست');

  console.log(person.id);
  const data = await invite.sendInvitations(Number(person.id));
  console.log(data);
  if (!data) return console.error(data);

  toast.success(`دعوت‌نامه برای ${person.name} ارسال شد`);
}

async function searchUser(username) {
  if (!username.trim()) return toast.error('لطفا با دقت جستوجو کنید');

  const data = await user.searchForUser(username);
  people.value.push(data.data);
  console.log(data);
  console.log(people.value);
}
</script>

<template>
  <div class="page request-page">
    <!-- HEADER -->
    <header class="request-header">
      <div class="header-icon">
        <Users :size="20" />
      </div>

      <div class="header-content">
        <h1>دعوت از افراد</h1>

        <p>افراد موردنظر را پیدا کنید و برای همکاری دعوت بفرستید.</p>
      </div>
    </header>

    <!-- SEARCH -->
    <form @submit.prevent="searchUser(search)" class="search-box">
      <Search :size="18" />

      <input
        v-model="search"
        type="text"
        placeholder="جستجوی نام کاربری @ ..."
      />
    </form>

    <!-- RESULTS HEADER -->
    <div class="results-header" v-if="!user.loading">
      <span> افراد </span>

      <small> {{ people.length }} نفر </small>
    </div>

    <!-- PEOPLE -->
    <main class="people-list" v-if="!user.loading">
      <article v-for="person in people" :key="person.id" class="person-card">
        <div class="person-main">
          <!-- AVATAR -->
          <div class="avatar">
            {{ person.name[0] }}

            <span
              class="online-dot"
              :class="{ busy: person.status === 'busy' }"
            ></span>
          </div>

          <!-- INFO -->
          <div class="person-info">
            <div class="person-name-row">
              <h2>
                {{ person.name }}
              </h2>
            </div>

            <div class="person-role">
              <BriefcaseBusiness :size="13" />

              <span>
                {{ person.role || 'انتخاب نشده' }}
              </span>
            </div>
          </div>
        </div>

        <!-- ACTION -->
        <button
          type="button"
          class="invite-btn"
          :class="{ invited: person.invited }"
          :disabled="person.invited"
          @click="sendInvitation(person)"
        >
          <Check v-if="person.invited" :size="16" />

          <UserPlus v-else :size="16" />

          <span>
            {{ person.invited ? 'ارسال شد' : 'دعوت' }}
          </span>
        </button>
      </article>

      <!-- EMPTY -->
      <div v-if="people.length === 0" class="empty-state">
        <div class="empty-icon">
          <Users :size="22" />
        </div>

        <h3>کسی پیدا نشد</h3>

        <p>نام یا نقش شخص موردنظر را تغییر دهید.</p>
      </div>
    </main>
    <Loading v-else />
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

/* =========================
   PAGE
   ========================= */

.request-page {
  min-height: 100vh;
  padding-bottom: 3rem;
}

/* =========================
   HEADER
   ========================= */

.request-header {
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

.header-content {
  min-width: 0;
}

.header-content h1 {
  margin: 0;

  color: $color-text;

  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.header-content p {
  margin: 0.35rem 0 0;

  color: $color-text-secondary;

  font-size: 0.72rem;
  line-height: 1.7;
}

/* =========================
   SEARCH
   ========================= */

.search-box {
  display: flex;
  align-items: center;
  gap: 0.65rem;

  @include page-padding;

  margin-top: 1.4rem;

  padding-top: 0.85rem;
  padding-bottom: 0.85rem;

  border: 1px solid $color-border-soft;
  border-radius: 15px;

  background: $color-bg-card;

  color: $color-text-secondary;

  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.search-box:focus-within {
  border-color: $color-primary;

  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
}

.search-box input {
  width: 100%;

  border: none;
  outline: none;

  background: transparent;

  color: $color-text;

  font-family: inherit;
  font-size: 0.78rem;
}

.search-box input::placeholder {
  color: $color-text-secondary;
}

/* =========================
   RESULTS HEADER
   ========================= */

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include page-padding;

  margin-top: 1.5rem;
  margin-bottom: 0.7rem;
}

.results-header span {
  color: $color-text;

  font-size: 0.8rem;
  font-weight: 800;
}

.results-header small {
  color: $color-text-secondary;

  font-size: 0.65rem;
}

/* =========================
   PEOPLE
   ========================= */

.people-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  @include page-padding;
}

/* =========================
   PERSON CARD
   ========================= */

.person-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;

  padding: 0.85rem;

  border: 1px solid $color-border-soft;
  border-radius: 17px;

  background: $color-bg-card;

  transition:
    border-color 0.15s,
    transform 0.15s,
    box-shadow 0.15s;
}

.person-card:hover {
  transform: translateY(-1px);

  border-color: $color-border;

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.035);
}

/* =========================
   PERSON
   ========================= */

.person-main {
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  position: relative;

  width: 46px;
  height: 46px;

  display: grid;
  place-items: center;

  flex-shrink: 0;

  border-radius: 14px;

  background: $color-bg-soft;
  color: $color-text;

  font-size: 0.9rem;
  font-weight: 800;
}

.online-dot {
  position: absolute;

  left: -1px;
  bottom: -1px;

  width: 10px;
  height: 10px;

  border: 2px solid $color-bg-card;
  border-radius: 50%;

  background: #22c55e;
}

.online-dot.busy {
  background: #f59e0b;
}

/* =========================
   INFO
   ========================= */

.person-info {
  min-width: 0;

  display: flex;
  flex-direction: column;
}

.person-name-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.person-info h2 {
  overflow: hidden;

  margin: 0;

  color: $color-text;

  font-size: 0.82rem;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.person-role {
  display: flex;
  align-items: center;
  gap: 0.3rem;

  margin-top: 0.2rem;

  color: $color-text-secondary;

  font-size: 0.65rem;
}

.company {
  overflow: hidden;

  margin-top: 0.12rem;

  color: $color-text-secondary;

  font-size: 0.6rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* =========================
   INVITE BUTTON
   ========================= */

.invite-btn {
  min-width: 78px;
  min-height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;

  flex-shrink: 0;

  padding: 0 0.75rem;

  border: none;
  border-radius: 11px;

  background: $color-primary;
  color: white;

  font-family: inherit;
  font-size: 0.68rem;
  font-weight: 700;

  cursor: pointer;

  transition:
    opacity 0.15s,
    background 0.15s,
    color 0.15s;
}

.invite-btn:hover {
  opacity: 0.9;
}

.invite-btn.invited {
  border: 1px solid $color-border-soft;

  background: $color-bg-soft;
  color: #16a34a;

  cursor: default;
}

/* =========================
   EMPTY
   ========================= */

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

/* =========================
   MOBILE
   ========================= */

@media (max-width: 480px) {
  .person-card {
    padding: 0.7rem;
  }

  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }

  .invite-btn {
    min-width: 70px;
    min-height: 36px;
  }

  .person-info h2 {
    font-size: 0.78rem;
  }
}
</style>
