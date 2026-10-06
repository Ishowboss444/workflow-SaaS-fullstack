```vue
<script setup>
import FullfilledLoading from '@/components/common/FullfilledLoading.vue'
import { useInvitationsStore } from '@/stores/useInvitationsStore'
import {
  Mail,
  Check,
  X,
  ChevronLeft,
} from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const invite = useInvitationsStore()
const myInvites = ref([])
onMounted(async()=>{
  const data = await invite.myInvitations()
  console.log(data);
})
const invitations = ref([
  {
    id: 1,
    sender: {
      name: 'علی رضایی',
    },

    sentAt: 'امروز، ۱۰:۲۴',
    status: 'pending',
  },
  {
    id: 2,
    sender: {
      name: 'سارا محمدی',
    },
    sentAt: 'دیروز، ۱۶:۴۰',
    status: 'pending',
  },
  {
    id: 3,
    sender: {
      name: 'محمد احمدی',
    },
    sentAt: '۲ روز پیش',
    status: 'accepted',
  }
])

const activeFilter = ref('all')

const filteredInvitations = computed(() => {
  if (activeFilter.value === 'all') {
    return invitations.value
  }

  return invitations.value.filter(
    (invite) => invite.status === activeFilter.value
  )
})

const pendingCount = computed(
  () =>
    invitations.value.filter(
      (invite) => invite.status === 'pending'
    ).length
)

function acceptInvitation(invitation) {
  invitation.status = 'accepted'

  toast.success('دعوت‌نامه پذیرفته شد')
}

function declineInvitation(invitation) {
  invitation.status = 'declined'

  toast.success('دعوت‌نامه رد شد')
}
</script>

<template>
  <div class="page invitations-page" v-if="!invite.loading">
    <!-- HEADER -->
    <header class="invitations-header">
      <div>
          <div class="header-label">
            <button class="icon-btn" @click="router.push({name : 'job-list'})">
                <X/>
            </button>

          <Mail :size="15" />
          دعوت‌نامه‌ها
        </div>

        <h1>دعوت‌های شما</h1>

        <p>
          دعوت‌نامه‌های همکاری و سفارش‌های جدید را اینجا ببینید.
        </p>
      </div>

      <div
        v-if="pendingCount"
        class="pending-count"
      >
        {{ pendingCount }}
        <span>جدید</span>
      </div>
    </header>

    <!-- FILTERS -->
    <div class="filters">
      <button
        type="button"
        :class="{ active: activeFilter === 'all' }"
        @click="activeFilter = 'all'"
      >
        همه
      </button>

      <button
        type="button"
        :class="{ active: activeFilter === 'pending' }"
        @click="activeFilter = 'pending'"
      >
        در انتظار
      </button>

      <button
        type="button"
        :class="{ active: activeFilter === 'accepted' }"
        @click="activeFilter = 'accepted'"
      >
        پذیرفته‌شده
      </button>

      <button
        type="button"
        :class="{ active: activeFilter === 'declined' }"
        @click="activeFilter = 'declined'"
      >
        ردشده
      </button>
    </div>

    <!-- INVITATIONS -->
    <main class="invitation-list">
      <article
        v-for="invitation in filteredInvitations"
        :key="invitation.id"
        class="invitation-card"
        :class="`is-${invitation.status}`"
      >
        <!-- TOP -->
        <div class="invitation-top">
          <div class="sender">
            <div class="avatar">
              {{ invitation.sender.name[0] }}
            </div>

            <div class="sender-info">
              <strong>
                {{ invitation.sender.name }}
              </strong>

              <span>
                manager
              </span>
            </div>
          </div>

          <span class="time">
            {{ invitation.sentAt }}
          </span>
        </div>

        <!-- CONTENT -->
        <div class="invitation-content">
          <h2>
            شما به کارگاه <span>{{ invitation.sender.name }}</span> دعوت شدید
          </h2>

        </div>

        <!-- FOOTER -->
        <div class="invitation-footer">
          <template v-if="invitation.status === 'pending'">
            <button
              type="button"
              class="decline-btn"
              @click="declineInvitation(invitation)"
            >
              <X :size="16" />
              رد کردن
            </button>

            <button
              type="button"
              class="accept-btn"
              @click="acceptInvitation(invitation)"
            >
              <Check :size="17" />
              پذیرفتن دعوت
            </button>
          </template>

          <template v-else>
            <div
              class="status"
              :class="invitation.status"
            >
              <Check
                v-if="invitation.status === 'accepted'"
                :size="15"
              />

              <X
                v-else
                :size="15"
              />

              {{
                invitation.status === 'accepted'
                  ? 'دعوت پذیرفته شد'
                  : 'دعوت رد شد'
              }}
            </div>

            <button
              type="button"
              class="details-btn"
            >
              جزئیات
              <ChevronLeft :size="15" />
            </button>
          </template>
        </div>
      </article>

      <!-- EMPTY -->
      <div
        v-if="filteredInvitations.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          <Mail :size="23" />
        </div>

        <h3>دعوت‌نامه‌ای وجود ندارد</h3>

        <p>
          در حال حاضر دعوت‌نامه‌ای در این بخش نیست.
        </p>
      </div>
    </main>
  </div>
  <FullfilledLoading v-else/>
</template>

<style scoped lang="scss">
@use '/src/assets/scss/variables' as *;
@use '/src/assets/scss/mixins' as *;

$color-text: #1f2937 !default;
$color-text-secondary: #6b7280 !default;
$color-primary: #6366f1 !default;
$color-bg-card: #ffffff !default;
$color-bg-soft: #f8fafc !default;
$color-border: #e5e7eb !default;
$color-border-soft: #f1f5f9 !default;

.invitations-page {
  min-height: 100vh;
  padding-bottom: 3rem;
}

/* =========================
   HEADER
   ========================= */
.icon-btn {
  @include flex-center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: $color-bg-card;
  color: $color-text-primary;
  cursor: pointer;
}
.invitations-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;

  @include page-padding;

  padding-top: $space-5;
}

.header-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;

  margin-bottom: 0.55rem;

  color: $color-primary;
  font-size: 0.75rem;
  font-weight: 700;
}

.invitations-header h1 {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.invitations-header p {
  max-width: 420px;
  margin: 0.5rem 0 0;

  color: $color-text-secondary;
  font-size: 0.78rem;
  line-height: 1.8;
}

.pending-count {
  min-width: 48px;
  height: 48px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 15px;

  background: $color-bg-soft;
  color: $color-text;

  font-size: 0.9rem;
  font-weight: 800;
}

.pending-count span {
  margin-top: -1px;
  color: $color-text-secondary;
  font-size: 0.55rem;
  font-weight: 600;
}

/* =========================
   FILTERS
   ========================= */

.filters {
  display: flex;
  gap: 0.45rem;

  overflow-x: auto;

  @include page-padding;

  margin-top: 1.5rem;
  padding-bottom: 0.25rem;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.filters button {
  flex-shrink: 0;

  padding: 0.55rem 0.85rem;

  border: 1px solid $color-border-soft;
  border-radius: 10px;

  background: transparent;
  color: $color-text-secondary;

  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.filters button.active {
  border-color: $color-text;
  background: $color-text;
  color: white;
}

/* =========================
   LIST
   ========================= */

.invitation-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  @include page-padding;

  margin-top: 1rem;
}

/* =========================
   CARD
   ========================= */

.invitation-card {
  overflow: hidden;

  border: 1px solid $color-border-soft;
  border-radius: 20px;

  background: $color-bg-card;

  box-shadow:
    0 3px 14px rgba(0, 0, 0, 0.025);

  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.invitation-card:hover {
  transform: translateY(-1px);

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.05);
}

/* =========================
   CARD TOP
   ========================= */

.invitation-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding: 1rem 1rem 0.85rem;
}

.sender {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;

  display: grid;
  place-items: center;

  border-radius: 12px;

  background: $color-bg-soft;
  color: $color-text;

  font-size: 0.9rem;
  font-weight: 800;
}

.sender-info {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.sender-info strong {
  overflow: hidden;

  color: $color-text;
  font-size: 0.82rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sender-info span {
  color: $color-text-secondary;
  font-size: 0.65rem;
}

.time {
  flex-shrink: 0;

  color: $color-text-secondary;
  font-size: 0.62rem;
}

/* =========================
   CONTENT
   ========================= */

.invitation-content {
  padding: 0 1rem 1rem;
}

.invitation-content h2 {
  margin: 0 0 0.8rem;

  font-size: 0.95rem;
  font-weight: 800;
}

.project {
  display: flex;
  align-items: center;
  gap: 0.65rem;

  padding: 0.7rem;

  border-radius: 14px;
  background: $color-bg-soft;
}

.project-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;

  display: grid;
  place-items: center;

  border-radius: 10px;

  background: $color-bg-card;
  color: $color-text-secondary;
}

.project > div:nth-child(2) {
  min-width: 0;
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.project span {
  color: $color-text-secondary;
  font-size: 0.6rem;
}

.project strong {
  overflow: hidden;

  font-size: 0.73rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quantity {
  flex-shrink: 0;

  color: $color-text-secondary;
  font-size: 0.67rem;
  font-weight: 700;
}

/* =========================
   FOOTER
   ========================= */

.invitation-footer {
  display: flex;
  align-items: center;
  gap: 0.55rem;

  padding: 0.8rem 1rem;

  border-top: 1px solid $color-border-soft;
}

.accept-btn,
.decline-btn,
.details-btn {
  min-height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  border-radius: 11px;

  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;

  cursor: pointer;
}

.accept-btn {
  flex: 1;

  border: none;

  background: $color-primary;
  color: white;
}

.decline-btn {
  padding: 0 0.85rem;

  border: 1px solid $color-border;
  background: transparent;
  color: $color-text-secondary;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.35rem;

  flex: 1;

  font-size: 0.68rem;
  font-weight: 700;
}

.status.accepted {
  color: #16a34a;
}

.status.declined {
  color: #dc2626;
}

.details-btn {
  padding: 0 0.75rem;

  border: 1px solid $color-border-soft;
  background: transparent;
  color: $color-text-secondary;
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

  font-size: 0.9rem;
  font-weight: 800;
}

.empty-state p {
  margin: 0.4rem 0 0;

  color: $color-text-secondary;
  font-size: 0.72rem;
}

/* =========================
   MOBILE
   ========================= */

@media (max-width: 480px) {
  .invitations-header h1 {
    font-size: 1.35rem;
  }

  .invitation-top {
    align-items: flex-start;
  }

  .time {
    font-size: 0.58rem;
  }

  .invitation-footer {
    padding: 0.7rem 0.8rem;
  }

  .accept-btn,
  .decline-btn {
    min-height: 42px;
  }
}
</style>
```
