<template>
  <form @submit.prevent="newUser">
    <div class="form-layer">
      <label>نام</label>
      <input
        type="text"
        placeholder="نام"
        v-model="isValidUser.name"
        required
      />
    </div>

    <div class="form-layer">
      <label>نام خانوادگی</label>
      <input
        type="test"
        v-model="isValidUser.lastname"
        placeholder="نام خانوادگی"
      />
    </div>

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
        v-model="isValidUser.password1"
        placeholder="پسوورد"
        required
      />
    </div>

    <div class="form-layer">
      <label>تکرار پسوورد</label>
      <input
        type="password"
        v-model="isValidUser.password2"
        placeholder="تکرار پسوورد"
        required
      />
    </div>

    <div class="button">
      <button type="submit">
        <p>ساخت اکانت</p>
      </button>
    </div>
  </form>
</template>
<script setup>
import { useAuthStore } from '@/stores/useAuthStore';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
const auth = useAuthStore();

const isValidUser = ref({
  name: '',
  lastname: '',
  username: '',
  password1: '',
  password2: '',
});
const newUser = async () => {
  if (isValidUser.value.password1 !== isValidUser.value.password2) {
    toast.error('fill it precustently');
  } else {
    try {
      const data = await auth.Signup({
        name: `${isValidUser.value.name.trim()} ${isValidUser.value.lastname.trim()}`,
        username: isValidUser.value.username,
        password: isValidUser.value.password1,
      });
      console.log(data);
      return data;
    } catch (err) {
      console.log('here is an error :', err);
    }
  }
};
</script>
