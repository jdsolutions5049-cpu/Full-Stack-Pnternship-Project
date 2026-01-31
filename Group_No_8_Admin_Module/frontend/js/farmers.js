const tableBody = document.getElementById("farmersTable");

fetch("http://localhost:5000/admin/farmers", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("adminToken")
  }
})
  .then(res => {
    if (!res.ok) throw new Error("Unauthorized or failed to fetch farmers");
    return res.json();
  })
  .then(farmers => {
    tableBody.innerHTML = "";

    farmers.forEach(farmer => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${farmer.name || "-"}</td>
        <td>${farmer.email || "-"}</td>
        <td>${farmer.phone || "-"}</td>
        <td>${farmer.location || "-"}</td>
        <td>${Array.isArray(farmer.crops) ? farmer.crops.join(", ") : "-"}</td>
        <td>${farmer.active ? "Active" : "Inactive"}</td>
        <td>
          <button onclick="toggleFarmer('${farmer._id}', ${farmer.active})">
            ${farmer.active ? "Deactivate" : "Activate"}
          </button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  })
  .catch(err => {
    console.error("Farmer fetch error:", err);
    alert("Failed to load farmers");
  });

function toggleFarmer(id, currentStatus) {
  fetch(`http://localhost:5000/admin/farmers/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("adminToken")
    },
    body: JSON.stringify({ active: !currentStatus })
  })
    .then(res => {
      if (!res.ok) throw new Error("Update failed");
      location.reload();
    })
    .catch(err => console.error(err));
}
