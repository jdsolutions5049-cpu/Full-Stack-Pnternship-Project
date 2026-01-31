fetch("http://localhost:5000/admin/orders")
  .then(res => res.json())
  .then(orders => {
    const tbody = document.getElementById("ordersTable");
    tbody.innerHTML = "";

    orders.forEach(o => {
      tbody.innerHTML += `
        <tr>
          <td>${o._id}</td>
          <td>${o.buyerId}</td>
          <td>${o.status}</td>
        </tr>
      `;
    });
  });
