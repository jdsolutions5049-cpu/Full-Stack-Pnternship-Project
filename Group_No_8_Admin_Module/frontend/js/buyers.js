document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("Login required");
    window.location.href = "admin.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/admin/buyers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Unauthorized");

    const buyers = await res.json();
    const table = document.getElementById("buyersTable");
    table.innerHTML = "";

    buyers.forEach(buyer => {
      const row = `
        <tr>
          <td>${buyer.name}</td>
          <td>${buyer.email}</td>
          <td>${buyer.phone}</td>
          <td>${buyer.cropsInterested.join(", ") || "-"}</td>
          <td>${buyer.active ? "Active" : "Inactive"}</td>
        </tr>
      `;
      table.innerHTML += row;
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load buyers");
  }
});
