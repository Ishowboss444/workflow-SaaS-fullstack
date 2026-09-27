import { defineStore } from 'pinia';
import { ref } from 'vue';
import { addProduct, getProducts, ProductAdd } from '@/api/product';
interface NewProduct{
  title : string,
  description : string,
  amount : number ,
  color : object[],
  lines : number,
  salary : object,
  workplaceId : number,
}
export const useProductStore = defineStore('products', () => {
  const products = ref<object[]>([]);
  const loading = ref(false);
  const error = ref<any>(null);
  const newProduct = ref({
    title : '',
    description : '',
    amount : 1 ,
    color : [],
    lines : 0,
    salary : [],
    workplaceId : 0,
  })
  
  async function _addProduct(info: ProductAdd) {
    loading.value = true;
    try {
      const data = await addProduct({
        name: info.name,
        description: info.description,
        colors: info.colors,
        amount: info.amount,
        workplaceId: info.workplaceId,
      });
      console.log(data);
      return data;
    } catch (err) {
      console.log(`here is the error : ${err}`);
      error.value = err instanceof Error ? err.message : 'signup failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function _getProduct() {
    loading.value = true;
    try {
      const data = await getProducts();
      console.log(data);
      products.value.push(data)
      return data;
    } catch (err) {
      console.log(`here is the error : ${err}`);
      error.value = err instanceof Error ? err.message : 'signup failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    _addProduct,
    _getProduct,
    loading,
    error,
    products,
    newProduct
  };
});
