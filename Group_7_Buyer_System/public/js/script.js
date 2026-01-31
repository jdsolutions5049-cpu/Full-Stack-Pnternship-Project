(() => {
  "use strict";

  // ================= DOM CACHE =================
  const dropdown = document.getElementById("userDropdown");
  const locationText = document.getElementById("locationText");
  const searchInput = document.getElementById("productSearch");
  const productLinks = document.querySelectorAll(".product-link");
  const defaultAddress = document.getElementById("defaultAddress");

  // Category Buttons
  const categoryButtons = document.querySelectorAll(".cat-btn");

  // ================= USER DROPDOWN =================
  if (dropdown) {
    document.addEventListener("click", (e) => {
      dropdown.classList.toggle("active", dropdown.contains(e.target));
    });
  }

  // ================= GEO LOCATION =================
  async function getLocationAndSave() {
    if (!navigator.geolocation || !locationText) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await res.json();
        const addr = data.address || {};

        const area = addr.suburb || addr.village || "";
        const city = addr.city || addr.town || addr.state || "";
        const country = addr.country || "";

        const fullAddress = `${area ? area + ", " : ""}${city}, ${country}`;

        // Show in navbar
        locationText.textContent = fullAddress;

        // Store for backend if exists
        if (defaultAddress) {
          defaultAddress.value = fullAddress;
        }
      } catch (err) {
        console.error("Location error:", err);
        locationText.textContent = "Location unavailable";
      }
    });
  }

  // ================= SEARCH FILTER =================
  if (searchInput && productLinks.length) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();

      productLinks.forEach((link) => {
        const name =
          link.querySelector(".jd-product-name")?.innerText.toLowerCase() || "";
        const category =
          link.querySelector(".jd-category")?.innerText.toLowerCase() || "";
        const description =
          link.dataset.description?.toLowerCase() || "";

        const match =
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query);

        link.style.display = match ? "block" : "none";
      });
    });
  }

  // ================= CATEGORY FILTER =================
  if (categoryButtons.length && productLinks.length) {
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Active state
        categoryButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedCategory = btn.dataset.category;

        productLinks.forEach((product) => {
          const productCategory = product.dataset.category;

          const show =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

          product.style.display = show ? "block" : "none";
        });
      });
    });
  }

  // ================= INIT =================
  getLocationAndSave();
})();

