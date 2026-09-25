import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUsersStore = defineStore('users', () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(false);
});
