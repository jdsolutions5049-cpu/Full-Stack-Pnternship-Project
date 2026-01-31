async function login() {
  const email = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();

  if (!email || !password) {
    alert('Email and password required');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Invalid credentials');
      return;
    }

    localStorage.setItem('adminToken', data.token);
 
    window.location.href = 'dashboard.html';

  } catch (err) {
    console.error(err);
    alert('Server error');
  }
}
