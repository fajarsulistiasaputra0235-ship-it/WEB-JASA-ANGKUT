// --- 1. LOGIKA PRELOADER ---
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  setTimeout(function () {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }, 800); // Loading pura-pura 0.8 detik biar berasa eksklusif
});

// --- 2. LOGIKA ANIMASI SCROLL (Fade-In) ---
const faders = document.querySelectorAll(".fade-in");
const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});

// --- 3. LOGIKA TOMBOL SCROLL KE FORM ---
const btnScrollToForm = document.getElementById("btnScrollToForm");
const sectionKontak = document.getElementById("kontak");
btnScrollToForm.addEventListener("click", function () {
  sectionKontak.scrollIntoView({ behavior: "smooth" });
});

// --- 4. LOGIKA KARTU LAYANAN INTERAKTIF ---
const kotakLayanan = document.querySelectorAll(".card-layanan");
const pilihanLayanan = document.getElementById("pilihanLayanan");
kotakLayanan.forEach(function (kotak) {
  kotak.addEventListener("click", function () {
    const jenisLayanan = kotak.innerText;
    if (jenisLayanan.includes("Puing")) {
      pilihanLayanan.value = "Angkut Puing";
    } else if (jenisLayanan.includes("Pasir")) {
      pilihanLayanan.value = "Kirim Pasir";
    } else {
      pilihanLayanan.value = "Sampah Proyek";
    }
    sectionKontak.scrollIntoView({ behavior: "smooth" });
  });
});

// --- 5. LOGIKA INDIKATOR LOKASI REAL-TIME ---
const inputLokasi = document.getElementById("inputLokasi");
const infoLokasi = document.getElementById("infoLokasi");
inputLokasi.addEventListener("input", function () {
  const lokasiUser = inputLokasi.value;
  if (lokasiUser.trim() !== "") {
    infoLokasi.innerText = `📍 Armada siap meluncur ke wilayah: ${lokasiUser}`;
  } else {
    infoLokasi.innerText = "";
  }
});

// --- 6. LOGIKA KIRIM KE WHATSAPP ---
const btnKirim = document.getElementById("btnKirim");
btnKirim.addEventListener("click", function () {
  const layanan = pilihanLayanan.value;
  const lokasi = inputLokasi.value;

  if (lokasi.trim() === "") {
    alert("Tolong isi lokasinya dulu ya biar supir nggak nyasar!");
    inputLokasi.focus();
    return;
  }
  const nomorWa = "6281573044356";
  const pesan = `Halo, saya mau order jasa ${layanan} untuk lokasi di ${lokasi}. Apakah armada tersedia?`;
  const urlWa = `https://wa.me/${nomorWa}?text=${encodeURIComponent(pesan)}`;
  window.open(urlWa, "_blank");
});

// --- 7. LOGIKA GALERI LIGHTBOX (MODAL) ---
const modal = document.getElementById("modalLightbox");
const gambarMembesar = document.getElementById("gambarMembesar");
const fotoGaleri = document.querySelectorAll(".foto-galeri");
const closeModal = document.querySelector(".close-modal");

fotoGaleri.forEach((foto) => {
  foto.addEventListener("click", function () {
    modal.style.display = "block";
    gambarMembesar.src = this.src;
  });
});
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// --- 8. LOGIKA FAQ ACCORDION ---
const faqTanya = document.querySelectorAll(".faq-tanya");
faqTanya.forEach((tanya) => {
  tanya.addEventListener("click", function () {
    // Matikan semua dulu (opsional, kalau mau buka satu-satu)
    faqTanya.forEach((item) => {
      if (item !== this) item.parentElement.classList.remove("aktif");
    });
    // Toggle class 'aktif' di parent item yang di-klik
    this.parentElement.classList.toggle("aktif");
  });
});
