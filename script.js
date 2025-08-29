// Menampilkan Nama Tamu
const params = new URLSearchParams(window.location.search);
  const guestName = params.get("to");
  if (guestName) {
    document.getElementById("guestName").textContent = guestName;
  }

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
const scriptURL = "https://script.google.com/macros/s/AKfycbx274HynLaF82d2e7NAN2R5-inkGxWT_l68Ruf2qqpa1tgHu0ubxTc4gIOi3Qcve0IX/exec";

// Elemen HTML
const form = document.getElementById("ucapanForm");
const listUcapan = document.getElementById("listUcapan");
const pagination = document.getElementById("pagination");
const avatarColors = ["#fbc02d", "#e91e63", "#d500f9", "#2196f3", "#4caf50", "#ff5722"];

// Data & Pagination
let allUcapan = [];
let currentPage = 1;
const itemsPerPage = 5;

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
        fetchUcapan();
      }
    })
    .catch((err) => console.error("Error:", err));
});

// Ambil data ucapan
async function fetchUcapan() {
  try {
    const res = await fetch(scriptURL);
    const data = await res.json();
    allUcapan = data.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
    currentPage = 1; // reset ke halaman pertama
    renderUcapan();
    renderPagination();
  } catch (err) {
    console.error("Gagal mengambil data ucapan", err);
  }
}

// Render ucapan sesuai halaman
function renderUcapan() {
  listUcapan.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = allUcapan.slice(start, end);

  paginated.forEach(item => {
    const card = document.createElement("div");
    card.className = "ucapan-card";

    // avatar huruf pertama nama
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = item.nama.charAt(0).toUpperCase();
    // kasih warna random
    avatar.style.background = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const content = document.createElement("div");
    content.className = "ucapan-content";

    const header = document.createElement("div");
    header.className = "ucapan-header";

    const nama = document.createElement("span");
    nama.className = "ucapan-nama";
    nama.textContent = item.nama;

    const kehadiran = document.createElement("span");
    kehadiran.innerHTML = ` (${item.kehadiran})`;

    const pesan = document.createElement("p");
    pesan.textContent = item.ucapan;

    const waktu = document.createElement("span");
    waktu.className = "ucapan-waktu";
    waktu.textContent = new Date(item.waktu).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    header.appendChild(nama);
    header.appendChild(kehadiran);

    content.appendChild(header);
    content.appendChild(pesan);
    content.appendChild(waktu);

    card.appendChild(avatar);
    card.appendChild(content);

    listUcapan.appendChild(card);
  });
}

// Render tombol pagination
function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(allUcapan.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderUcapan();
      renderPagination();
    });
    pagination.appendChild(btn);
  }
}

// Load awal
fetchUcapan();


// Fungsi copy nomor rekening
function copyText(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Nomor rekening berhasil disalin: " + text);
  });
}

const toggleBtn = document.getElementById("toggle-btn");
const accountList = document.getElementById("account-list");

toggleBtn.addEventListener("click", () => {
  accountList.classList.toggle("hidden");

  if (accountList.classList.contains("hidden")) {
    toggleBtn.textContent = "Lihat Rekening";
  } else {
    toggleBtn.textContent = "Sembunyikan Rekening";
  }
});

function copyText(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Nomor rekening berhasil disalin: " + text);
  });
}
