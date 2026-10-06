import { login, LoginInfo, signup, SignupInfo } from '@/api/auth';
import { Str } from 'bcrypto/lib/encoding/asn1';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const error = ref<any>(null);

  const Signup = async (info: SignupInfo) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await signup(info);
      return result;
    } catch (err) {
      console.log(`here is the error : ${err}`);
      error.value = err instanceof Error ? err.message : 'signup failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const Login = async (info: LoginInfo) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await login(info);
      localStorage.setItem('accessToken', result.data.token);
      console.log(result.status);
      
      return result;
    } catch (err) {
      const isError = String(err)
      if(isError.includes('401')){
        toast.error("فری با این مشخصات وجود ندارد یا پسوورد اشتباه است") 
      }else{
        toast.error('ارور سرور') 
      }
      console.log(err);
      error.value = err instanceof Error ? err.message : 'signup failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    Signup,
    Login,
    loading,
    error,
  };
});
