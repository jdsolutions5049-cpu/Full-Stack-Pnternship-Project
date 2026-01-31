const token = localStorage.getItem("adminToken");

if (!token) {
  alert("Not logged in");
  window.location.href = "admin.html";
}

fetch("http://localhost:5000/admin/dashboard/stats", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
  .then(res => {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    return res.json();
  })
  .then(data => {
    document.getElementById("farmerCount").innerText = data.totalFarmers;
    document.getElementById("buyerCount").innerText = data.totalBuyers;
    document.getElementById("sellRequestCount").innerText = data.activeSellRequests;
    document.getElementById("orderCount").innerText = data.activeOrders;
  })
  .catch(err => {
    console.error(err);
    alert("Session expired. Login again.");
    localStorage.removeItem("adminToken");
    window.location.href = "admin.html";
  });
