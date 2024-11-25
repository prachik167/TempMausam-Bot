async function updateApiKey() {
  const apiKey = document.getElementById('apiKey').value;
  if (!apiKey) {
      showAlert('Please enter an API key!', 'error');
      return;
  }

  const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
  });

  const result = await response.json();
  if (response.ok) {
      showAlert(result.message, 'success');
  } else {
      showAlert(result.error, 'error');
  }
}

async function fetchUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();

  const userList = document.getElementById('userTable').querySelector('tbody');
  userList.innerHTML = '';

  users.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${user.firstName || user.chatId}</td>
          <td>${user.chatId}</td>
          <td>${user.subscribed ? 'Yes' : 'No'}</td>
          <td>${user.blocked ? 'Yes' : 'No'}</td>
          <td>
              <button class="${user.blocked ? 'unblock' : 'block'}" onclick="toggleUserStatus('${user._id}', '${user.blocked ? 'blocked' : 'active'}')">${user.blocked ? 'Unblock' : 'Block'}</button>
              <button class="delete" onclick="deleteUser('${user._id}')">Delete</button>
          </td>
      `;
      userList.appendChild(tr);
  });
}

async function toggleUserStatus(userId, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
  const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
  });

  const result = await response.json();
  if (response.ok) {
      showAlert(result.message, 'success');
      fetchUsers(); // Refresh user list after update
  } else {
      showAlert(result.error, 'error');
  }
}

async function deleteUser(userId) {
  const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
  const result = await response.json();
  if (response.ok) {
      showAlert(result.message, 'success');
      fetchUsers(); // Refresh user list after deletion
  } else {
      showAlert(result.error, 'error');
  }
}

// Helper function to show alerts
function showAlert(message, type) {
  const alertBox = document.getElementById('alert');
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`; // success or error
  setTimeout(() => {
      alertBox.textContent = ''; // Clear alert after 3 seconds
      alertBox.className = '';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', fetchUsers);

  