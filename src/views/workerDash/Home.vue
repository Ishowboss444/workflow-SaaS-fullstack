<template>
    <h2>
        به کارگاه من خوش امدید 👋! برای ادامه یکی از گزینه های پایین رو انتخاب کنید
    </h2>

    <button
      @click="logout"
    >
    LogOut
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()

function logout (){
    localStorage.clear()
    router.replace({name : 'login'})
}
</script>