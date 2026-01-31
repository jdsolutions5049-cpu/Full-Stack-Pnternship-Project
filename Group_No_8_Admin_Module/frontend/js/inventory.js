const token = localStorage.getItem("adminToken");

fetch("http://localhost:5000/admin/inventory", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => {
    if (!res.ok) throw new Error("Failed");
    return res.json();
  })
  .then(data => {
    const table = document.getElementById("inventoryTable");
    table.innerHTML = "";

    data.forEach(item => {
      table.innerHTML += `
        <tr>
          <td>${item.productName}</td>
          <td>${item.category}</td>
          <td>${item.quantity}</td>
          <td>${item.farmerName}</td>
          <td>${item.availabilityStatus}</td>
        </tr>
      `;
    });
  })
  .catch(err => {
    console.error(err);
    alert("Failed to load inventory");
  });
