import { getInvites, sendInvites, acceptInvite, rejectInvite } from '@/api/invitation';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

export const useInvitationsStore = defineStore('invitations', () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(false);

  async function myInvitations() {
    loading.value = true;
    try {
      return await getInvites();
    } catch (err) {
      toast.error(err.message || 'گرفتن دعوت‌نامه‌ها انجام نشد');
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function sendInvitations(id: number) {
    loading.value = true;
    try {
      return await sendInvites(Number(id));
    } catch (err) {
      toast.error(err.message || 'ارسال دعوت‌نامه انجام نشد');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function acceptInvitation(id: number) {
    return await acceptInvite(Number(id));
  }

  async function rejectInvitation(id: number) {
    return await rejectInvite(Number(id));
  }

  return {
    users,
    loading,
    error,
    acceptInvitation,
    rejectInvitation,
    myInvitations,
    sendInvitations,
  };
});
