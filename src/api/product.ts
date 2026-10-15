export interface ProductAdd {
  name: string;
  description: string;
  colors: object[];
  amount: number;
  salary: { manager: number; worker: number };
  lines: number;
  right_tailor: number;
  mid_tailor: number;
  top_tailor: number;
}
export async function addProduct(info: ProductAdd) {
  const token = localStorage.getItem('accessToken');

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
        salary: info.salary,
        lines: info.lines,
        right_tailor: info.right_tailor,
        mid_tailor: info.mid_tailor,
        top_tailor: info.top_tailor,
      }),
    });
    if (!response.ok) {
      throw Error;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function getProducts(id: number | null = null) {
  const token = localStorage.getItem('accessToken');
  const url =
    id !== null
      ? `http://localhost:3000/product/${id}/get`
      : `http://localhost:3000/product/get`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
