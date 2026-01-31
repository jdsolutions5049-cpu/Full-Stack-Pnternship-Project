console.log("pricing.js loaded");

const token = localStorage.getItem("adminToken");

if (!token) {
  alert("Please login again");
  window.location.href = "admin.html";
}

function formatCropName(crop) {
  return crop.charAt(0).toUpperCase() + crop.slice(1);
}

fetch("http://localhost:5000/admin/pricing/crops", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => {
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  })
  .then(data => {
    const table = document.getElementById("pricingTable");
    table.innerHTML = "";

    data.forEach(item => {
      const cropKey = item.crop.toLowerCase();

      table.innerHTML += `
        <tr>
          <td>${formatCropName(cropKey)}</td>
          <td>
            <input 
              type="number"
              value="${item.price}"
              id="price-${cropKey}"
              style="width:80px"
            />
          </td>
          <td>
            <button onclick="updatePrice('${cropKey}')">
              Update
            </button>
          </td>
        </tr>
      `;
    });
  })
  .catch(err => {
    console.error("Pricing load error:", err);
    alert("Failed to load pricing data");
  });


function updatePrice(cropKey) {
  const priceInput = document.getElementById(`price-${cropKey}`);
  const price = Number(priceInput.value);

  if (isNaN(price) || price < 0) {
    alert("Enter a valid price");
    return;
  }

  fetch(`http://localhost:5000/admin/pricing/crops/${cropKey}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ price })
  })
    .then(res => {
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    })
    .then(() => {
      alert(`Price updated for ${formatCropName(cropKey)}`);
    })
    .catch(err => {
      console.error(err);
      alert("Price update failed");
    });
}
