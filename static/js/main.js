function switchTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.getElementById(`${tabName}-tab`).classList.add("active");

  event.currentTarget.classList.add("active");
}

document.getElementById("file-upload").addEventListener("change", function (e) {
  const fileName = e.target.files[0]?.name || "No file chosen";
  document.getElementById("file-name").textContent = fileName;
});
