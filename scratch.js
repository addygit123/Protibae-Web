async function fetchWarehouses() {
  const token = 'npk_2d04f37e167c6cf0';
  const clientId = '1Y85-oLGhres5lCQvztiq5yFb2ltVvCq';

  try {
    const res = await fetch('https://api-v2.nimbuspost.com/v2/warehouses', {
      headers: {
        'x-api-key': token,
        'x-api-secret': clientId,
        'Accept': 'application/json'
      }
    });
    
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (error) {
    console.error(error);
  }
}

fetchWarehouses();
