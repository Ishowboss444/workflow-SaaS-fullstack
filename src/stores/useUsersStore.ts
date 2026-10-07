import { findUser } from '@/api/user';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

export const useUsersStore = defineStore('users', () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(false);

  async function searchForUser(username: string) {
    loading.value = true;
    if (!username.trim().startsWith('@')) {
      loading.value = false;
      return toast.error('نام کاربری اشتباه است');
    }

    try {
      const data = await findUser(username);
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
    searchForUser,
  };
});
