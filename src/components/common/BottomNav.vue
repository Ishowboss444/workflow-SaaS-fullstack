<script setup>
import { Wallet, Briefcase, Users, Home , Mail , User} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import {ref} from 'vue'
const props = defineProps({
  type : {type : String , default : 'WORKER'}
});
const router = useRouter()
const active = ref('home')
const tabsManger = [
  { key: 'profit', label: 'سود', icon: Wallet },
  { key: 'jobs', label: 'کارها', icon: Briefcase },
  { key: 'workers', label: 'کارگرها', icon: Users },
  { key: 'home', label: 'خانه', icon: Home },
];
const tabsWorker = [
  { key: 'invites', label: 'درخواست ها', icon: Mail },
  { key: 'workplace', label: 'کارگاه', icon: Briefcase },
  { key: 'assignment', label: 'کارهای من', icon: User },
  { key: 'home', label: 'خانه', icon: Home },
];
function routing(key){
  active.value = key
  // Worker mode routing
  if(props.type === "WORKER"){
    console.log(key);

    if(key === 'invites'){
      router.push({name : 'Invitations'})
    } 
    else if (key === 'workplace'){
      router.push({name : 'WorkerWorkplace'})
    } 
    else if (key === 'assignment'){
      router.push({name : 'assignments'})
    } 
    else if (key === 'home'){
      router.push({name : 'WorkerHome'})
    }
    else{
      console.log('checkk!');
    }
    return
  } 

  if(props.type === "MANAGER"){
    
    return
  }
  //Manager mode routing

}
</script>

<template>
  <nav class="bottom-nav" v-if="type === 'MANAGER'">
    <button
      v-for="tab in tabsManger"
      :key="tab.key"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': active === tab.key }"
      @click="routing(tab.key)"
    >
      <component :is="tab.icon" :size="20" />
      <span>{{ tab.label }}</span>
    </button>
  </nav>

  <nav class="bottom-nav" v-if="type === 'WORKER'">
    <button
      v-for="tab in tabsWorker"
      :key="tab.key"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': active === tab.key }"
      @click="routing(tab.key)"
    >
      <component :is="tab.icon" :size="20" />
      <span>{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
@use '../../assets/scss/variables' as *;
@use '../../assets/scss/mixins' as *;

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: $app-max-width;
  min-width: $app-min-width;
  display: flex;
  background: $color-bg-card;
  border-top: 1px solid $color-border-soft;
  padding: $space-2 $space-3 $space-4;
  z-index: $z-bottom-nav;

  &__item {
    flex: 1;
    @include flex-center;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    color: $color-text-muted;
    font-size: $font-size-xs;
    padding: $space-2 0;
    cursor: pointer;

    &--active {
      color: $color-primary;
      font-weight: 600;
    }
  }
}
</style>
