const token = localStorage.getItem('accessToken');
export interface ProductAdd {
  name: string;
  description: string;
  colors: object[];
  amount: number;
  workplaceId: number;
}
export async function addProduct(info: ProductAdd) {
  console.log(token);

  try {
    const response = await fetch('http://localhost:3000/product/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: info.name,
        description: info.description,
        colors: info.colors,
        amount: info.amount,
        workplaceId: info.workplaceId,
      }),
    });
    if (!response.ok) {
      console.log(response);
      throw Error;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function getProducts() {
  console.log(token);
  try {
    const response = await fetch('http://localhost:3000/product/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.log(response);
      throw Error;
    }
    const data = await response.json();
    return data;
    
  } catch (err) {
    console.log(err);
  }
}
