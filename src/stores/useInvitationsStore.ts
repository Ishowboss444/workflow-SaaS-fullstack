import { getInvites, sendInvites } from '@/api/invitation';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useInvitationsStore = defineStore('invitations', () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(false);

  async function myInvitations() {
    loading.value = true;
    try {
      const data = await getInvites();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  }

  async function sendInvitations(id: number) {
    loading.value = true;
    try {
      const data = await sendInvites(Number(id));
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    users,
    loading,
    error,
    myInvitations,
    sendInvitations,
  };
});
