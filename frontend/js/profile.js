const profileForm = document.getElementById("profileForm");
const avatarButton = document.getElementById("avatarButton");
const avatarInput = document.getElementById("avatarInput");

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const input = counter.querySelector('input[type="number"]');
    counter.querySelectorAll(".counter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const step = Number(btn.dataset.step);
        const min = Number(input.min) || 0;
        const current = Number(input.value) || 0;
        const next = Math.max(min, current + step);
        input.value = next;
      });
    });
  });
}

function bindToggle(name, onChange) {
  const group = document.querySelector(`[data-toggle="${name}"]`);
  const hiddenInput = document.getElementById(`${name}Input`);
  if (!group || !hiddenInput) return;
  group.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      group.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      hiddenInput.value = btn.dataset.value;
      if (onChange) onChange(btn.dataset.value);
    });
  });
}

initCounters();
bindToggle("smokes");

avatarButton?.addEventListener("click", () => {
  avatarInput?.click();
});

avatarInput?.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) {
    showToast("Photo selected!");
  }
});

profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateForm(profileForm)) return profileForm.reportValidity();
  const formData = new FormData(profileForm);
  if (!formData.get("smokes")) {
    showToast("Please let us know if you smoke.");
    return;
  }
  try {
    showLoader();
    await api.post("/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    localStorage.setItem("isSmoker", formData.get("smokes"));
    showToast("Profile saved");
    window.location.href = "home.html";
  } catch (error) {
    showToast(error.response?.data?.message || "Unable to save profile");
  } finally {
    hideLoader();
  }
});
