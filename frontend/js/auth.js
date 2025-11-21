const loginSection = document.getElementById("loginForm");
const signupSection = document.getElementById("signupForm");
const toggleModeBtn = document.getElementById("toggleMode");
const loginFormEl = loginSection?.querySelector("form");
const signupFormEl = signupSection?.querySelector("form");

if (toggleModeBtn) {
  toggleModeBtn.addEventListener("click", () => {
    loginSection.classList.toggle("active");
    signupSection.classList.toggle("active");
    const loginActive = loginSection.classList.contains("active");
    toggleModeBtn.textContent = loginActive ? "Switch to Signup" : "Switch to Login";
  });
}

loginFormEl?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateForm(loginFormEl)) return loginFormEl.reportValidity();
  const formData = new FormData(loginFormEl);
  const payload = Object.fromEntries(formData.entries());
  try {
    showLoader();
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("token", data.token);
    showToast("Welcome back!");
    window.location.href = "home.html";
  } catch (error) {
    showToast(error.response?.data?.message || "Login failed");
  } finally {
    hideLoader();
  }
});

signupFormEl?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateForm(signupFormEl)) return signupFormEl.reportValidity();
  const formData = new FormData(signupFormEl);
  const payload = Object.fromEntries(formData.entries());
  try {
    showLoader();
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("token", data.token);
    showToast("Account created! Let\'s personalize it.");
    window.location.href = "profile.html";
  } catch (error) {
    showToast(error.response?.data?.message || "Signup failed");
  } finally {
    hideLoader();
  }
});
