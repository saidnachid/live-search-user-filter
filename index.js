const userList = document.querySelector(".user-list");
const searchInput = document.getElementById("search-input");
const overlay = document.querySelector(".overlay");
const overlayDetails = document.querySelector(".overlay-details");
const closeBtn = document.querySelector(".close-btn");

let users = [];

// Fetch Users from JSON
async function fetchUsers() {
  try {
    const res = await fetch("users.json");
    if (!res.ok) throw new Error("Failed to fetch data");

    users = await res.json();
    renderUsers(users);
  } catch (error) {
    console.error("Failed fetching users:", error);
    userList.innerHTML = `<li class="no-users">Unable to load users</li>`;
  }
}

// Debounced Search Handler
let debounceTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const query = searchInput.value.trim().toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(query)
    );
    renderUsers(filteredUsers);
  }, 300);
});

// Render Users List
function renderUsers(userArray) {
  if (userArray.length === 0) {
    userList.innerHTML = "<li class='no-users'>No users found</li>";
    return;
  }

  const html = userArray.map(createUserHTML).join("");
  userList.innerHTML = html;
}

// Create User Card HTML
function createUserHTML(user) {
  return `
    <li class="user">
      <div class="info">
        <div class="avatar">
          <img src="${user.profilePicture}" alt="User Avatar" />
        </div>
        <div class="user-info">
          <h3 class="user-name">${user.name}</h3>
          <p class="user-email">${user.email}</p>
        </div>
      </div>
      <button class="more-btn" data-id="${user.id}" aria-label="More Option">
        <i class="ri-arrow-right-up-line"></i>
      </button>
    </li>
  `;
}

// Show Overlay with User Details
function showUserOverlay(user) {
  overlayDetails.innerHTML = createOverlayHTML(user);
  overlay.classList.remove("hidden");
}

// Create Overlay HTML
function createOverlayHTML(user) {
  return `
    <div class="overlay-avatar">
      <img src="${user.profilePicture}" alt="Overlay Avatar" />
    </div>
    <ul class="overlay-data">
      <li><strong>Name</strong><small>${user.name}</small></li>
      <li><strong>Email</strong><small>${user.email}</small></li>
      <li><strong>Age</strong><small>${user.age || "N/A"}</small></li>
      <li><strong>Location</strong><small>${user.location || "N/A"}</small></li>
      <li><strong>Job</strong><small>${user.job || "N/A"}</small></li>
      <li><strong>Hobby</strong><small>${user.hobby || "N/A"}</small></li>
    </ul>
  `;
}

// Handle "More" Button Click
userList.addEventListener("click", (e) => {
  const moreBtn = e.target.closest(".more-btn");
  if (!moreBtn) return;

  const userId = moreBtn.dataset.id;
  const user = users.find((u) => u.id == userId);
  if (user) showUserOverlay(user);
});

// Close Overlay
closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// Start App
fetchUsers();
