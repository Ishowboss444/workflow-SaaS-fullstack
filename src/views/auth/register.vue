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
      <label>رول</label>
      <input type="test" v-model="isValidUser.role" placeholder="رول " />
    </div>

    <div class="form-layer">
      <label>ایمیل</label>
      <input
        type="email"
        v-model="isValidUser.email"
        placeholder="ایمیل"
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
import { ref } from 'vue';
import { toast } from 'vue-sonner';
const isValidUser = ref({
  name: '',
  lastname: '',
  email: '',
  password1: '',
  password2: '',
  role: 'TOP',
});
const newUser = async () => {
  if (isValidUser.value.password1 !== isValidUser.value.password2) {
    toast.error('fill it precustently');
  } else {
    console.log(isValidUser.value.password1, isValidUser.value.password2);
    let res;
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${isValidUser.value.name.trim()} ${isValidUser.value.lastname.trim()}`,
          email: isValidUser.value.email,
          password: isValidUser.value.password1,
          fieldOfWork: isValidUser.value.role,
        }),
      });
      const data = await response.json();
      console.log(data);
      res = data;
    } finally {
      console.log('done');
      console.log(res);
    }
  }
};
</script>
