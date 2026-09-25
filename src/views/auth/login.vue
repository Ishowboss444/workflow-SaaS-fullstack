<template>
  <form @submit.prevent="user">
    <div class="form-layer">
      <label>یوزرنیم</label>
      <input
        type="text"
        v-model="isValidUser.username"
        placeholder="یوزرنیم"
        required
      />
    </div>

    <div class="form-layer">
      <label>پسوورد</label>
      <input
        type="password"
        v-model="isValidUser.password"
        placeholder="پسوورد"
        required
      />
    </div>

    <div class="button">
      <button type="submit">
        <p>ورود به اکانت</p>
      </button>
    </div>
  </form>
</template>
<script setup>
import { useAuthStore } from '@/stores/useAuthStore';
import { ref } from 'vue';
const auth = useAuthStore();

const isValidUser = ref({
  username: '',
  password: '',
});
const user = async () => {
  console.log(isValidUser.value);
  try {
    const data = await auth.Login({
      username: isValidUser.value.username,
      password: isValidUser.value.password,
    });
    console.log(data);
  } catch (err) {
    console.log('here is an error :', err);
  }
};
</script>
