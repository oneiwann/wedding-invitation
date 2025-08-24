// Countdown Timer
const eventDate = new Date("Jul 20, 2026 10:00:00").getTime();

  const countdown = setInterval(function () {
    const now = new Date().getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

    if (distance < 0) {
      clearInterval(countdown);
      document.getElementById("countdown").innerHTML = "<h3>Acara Sedang Berlangsung 🎉</h3>";
    }
  }, 1000);

// Backsound Audio
const musicBtn = document.getElementById("music-btn");
const bgMusic = document.getElementById("bg-music");

let isPlaying = false;

musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    bgMusic.pause();
    musicBtn.textContent = "🎵 Putar Musik";
  } else {
    bgMusic.play();
    musicBtn.textContent = "⏸️ Jeda Musik";
  }
  isPlaying = !isPlaying;
});

// RSVP
const scriptURL = "https://script.google.com/macros/s/AKfycbwhfYvZiqQEy0cfNFT4NIn8TmvVvpO8tYkDHl-W1PxSz8ujzxx2WoBUXRdh_C6ZvtQ/exec"; 
const itemsPerPage = 8; // jumlah data per load
let currentIndex = 0;
let allData = [];
let isLoading = false;

// submit form
document.getElementById("ucapanForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    nama: document.getElementById("nama").value,
    kehadiran: document.getElementById("kehadiran").value,
    ucapan: document.getElementById("ucapan").value
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.result === "success") {
        document.getElementById("ucapanForm").reset();
        reloadUcapan();
      }
    })
    .catch((err) => console.error("Error:", err));
});

// load ulang data (reset)
function reloadUcapan() {
  currentIndex = 0;
  document.getElementById("listUcapan").innerHTML = "";
  loadUcapan();
}

// ambil semua data dari sheet
function loadUcapan() {
  if (isLoading) return;
  isLoading = true;
  document.getElementById("loading").style.display = "block";

  fetch(scriptURL)
    .then((res) => res.json())
    .then((data) => {
      allData = data.reverse(); // biar terbaru di atas
      renderNext();
    })
    .catch((err) => console.error("Error load data:", err));
}

// render sebagian data (lazy load)
function renderNext() {
  const container = document.getElementById("listUcapan");
  const slice = allData.slice(currentIndex, currentIndex + itemsPerPage);

  slice.forEach((row) => {
    const el = document.createElement("div");
    el.classList.add("ucapan-item");
    el.innerHTML = `
      <strong>${row.nama}</strong> (${row.kehadiran})<br>
      ${row.ucapan}<br>
      <small>${new Date(row.waktu).toLocaleString()}</small>
    `;
    container.appendChild(el);
  });

  currentIndex += slice.length;
  isLoading = false;
  document.getElementById("loading").style.display = "none";
}

// infinite scroll listener
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 100
  ) {
    if (currentIndex < allData.length) {
      renderNext();
    }
  }
});

// pertama kali load
loadUcapan();

// Fungsi copy nomor rekening
function copyText(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Nomor rekening berhasil disalin: " + text);
  });
}
