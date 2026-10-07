import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
    const username = ref<string | null>(
        localStorage.getItem('username')
    )
    const role = ref<string | null>(
        localStorage.getItem('role')
    ) 
    const field = ref<string | null>(
        localStorage.getItem('field')
    )
    const workplaceId = ref<number | null>(
        Number(localStorage.getItem('workplace'))
    )

    function workplaceChange(value : number){

        workplaceId.value = value
        localStorage.setItem('workplace' , value.toString())
    }
    function roleChange(value : string){
        if(!value.trim()) return console.log('error');

        role.value = value
        localStorage.setItem('role' , value)
    }
    function fieldChange(value : string){
        if(!value.trim()) return console.log('error');
        
        field.value = value
        localStorage.setItem('field' , value)
    }
    function usernameChange(value : string){
        if(!value.trim()) return console.log('error');
        
        username.value = value
        localStorage.setItem('username' , value)
    }

    return {
        usernameChange,
        username,
        role,
        roleChange,
        field,
        fieldChange,
        workplaceId,
        workplaceChange
    }
});
