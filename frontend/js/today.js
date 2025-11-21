const todayForm = document.getElementById("todayForm");
const transportDetails = document.getElementById("transportDetails");
const smokingLog = document.getElementById("smokingLog");
const cigarettesInput = smokingLog?.querySelector('input[name="cigarettesToday"]');
const transportSelect = transportDetails?.querySelector('select[name="transportMode"]');
const transportDurationInput = transportDetails?.querySelector('input[name="travelDuration"]');
const toggleConfigs = [
  { name: "travelled", message: "Please tell us if you travelled today." },
  { name: "plasticUse", message: "Please answer the plastic usage question." },
  { name: "wasteSegregation", message: "Please answer the waste segregation question." },
];

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

function handleTravelToggle(value) {
  const show = value === "yes";
  transportDetails?.classList.toggle("hidden", !show);
  if (transportSelect) transportSelect.required = show;
  if (transportDurationInput) transportDurationInput.required = show;
  if (!show) {
    transportSelect && (transportSelect.value = "");
    transportDurationInput && (transportDurationInput.value = "");
  }
}

const isProfileSmoker = localStorage.getItem("isSmoker") === "yes";
if (!isProfileSmoker) {
  smokingLog?.classList.add("hidden");
} else {
  smokingLog?.classList.remove("hidden");
  if (cigarettesInput) cigarettesInput.required = true;
}

bindToggle("travelled", handleTravelToggle);
bindToggle("plasticUse");
bindToggle("wasteSegregation");

todayForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateForm(todayForm)) return todayForm.reportValidity();
  const formData = new FormData(todayForm);
  for (const config of toggleConfigs) {
    if (!formData.get(config.name)) {
      showToast(config.message);
      return;
    }
  }
  if (formData.get("travelled") === "no") {
    formData.set("transportMode", "");
    formData.set("travelDuration", "");
  }
  if (!isProfileSmoker) {
    formData.delete("cigarettesToday");
  }
  const payload = Object.fromEntries(formData.entries());
  try {
    showLoader();
    await api.post("/logs", payload);
    showToast("Log submitted!");
    window.location.href = "dashboard.html";
  } catch (error) {
    showToast(error.response?.data?.message || "Unable to save log");
  } finally {
    hideLoader();
  }
});
