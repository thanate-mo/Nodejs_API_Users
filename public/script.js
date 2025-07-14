const userForm = document.getElementById('userForm');
const userIdInput = document.getElementById('userId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const cancelEditBtn = document.getElementById('cancelEdit');
const userTableBody = document.getElementById('userTableBody');
let users = [];

async function fetchUsers() {
  const res = await fetch('/api/users');
  users = await res.json();
  renderUsers();
}

function renderUsers() {
  userTableBody.innerHTML = '';
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="editUser('${user.id}')">Edit</button>
        <button onclick="deleteUser('${user.id}')">Delete</button>
      </td>
    `;
    userTableBody.appendChild(tr);
  });
}

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const id = userIdInput.value;

  if (!name || !email) return;

  if (id) {
    // Edit
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
  } else {
    // Create
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
  }

  resetForm();
  fetchUsers();
});

function editUser(id) {
  const user = users.find(u => u.id === id);
  userIdInput.value = user.id;
  nameInput.value = user.name;
  emailInput.value = user.email;
  cancelEditBtn.style.display = 'inline-block';
}

function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    fetch(`/api/users/${id}`, { method: 'DELETE' })
      .then(fetchUsers);
  }
}

cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

function resetForm() {
  userIdInput.value = '';
  nameInput.value = '';
  emailInput.value = '';
  cancelEditBtn.style.display = 'none';
}

fetchUsers();
