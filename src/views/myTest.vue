<template>
    <button @click="addProduct">
        add product
    </button>
</template>
<script setup lang="ts">
const colors = [
    {
        color : 'blue',
        amount : 2000,
    },
    {
        color : 'yellow',
        amount : 2000,
    },
    {
        color : 'red',
        amount : 2000,
    },
]


async function addProduct() {
    try{
        const response = fetch('http://localhost:3000/product/add',{
            method : "POST",
            headers : {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                name : 't-shirt',
                description : "yh",
                colors : colors,
                amount : 6000,
                workplaceId : 8,
            })
        })
        if(!response){
            console.log(response);
            throw Error
        }
    }
    catch(err){

    }
    
}
</script>