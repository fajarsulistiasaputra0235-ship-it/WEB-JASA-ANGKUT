// --- 1. LOGIKA PRELOADER ---
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(function () {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }, 800);
  }
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
if (btnScrollToForm && sectionKontak) {
  btnScrollToForm.addEventListener("click", function () {
    sectionKontak.scrollIntoView({ behavior: "smooth" });
  });
}

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
    if (sectionKontak) {
      sectionKontak.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// --- 5. DATABASE KECAMATAN & LOGIKA AUTO-SUGGEST ---
const databaseKecamatan = {
  "Jakarta Selatan": [
    "Pancoran",
    "Tebet",
    "Kebon Baru",
    "Gudang Peluru",
    "Pengadegan",
    "Cikoko",
    "Kalibata (X Bata)",
  ],
  "Jakarta Timur": [
    "Jatinegara",
    "Kampung Melayu",
    "Cipinang Cempedak",
    "Jalan Otista",
    "Kebon Nanas",
    "Cawang",
    "Halim",
    "Kampung Makasar",
    "Taman Mini",
    "Bambu Apus",
    "Cipayung",
    "Duren Sawit",
    "Pondok Bambu",
    "Pangkalan Jati",
    "Pondok Kopi",
    "Klender",
    "Rawamangun",
    "Cipinang Jaya",
    "Cipinang Muara",
  ],
  Bekasi: [
    "Pondok Gede",
    "Jatiwaringin",
    "Jatibening",
    "Jatikeramat",
    "Jatimakmur",
    "Jatirahayu",
    "Jakasampurna",
    "Kodau",
    "Pondok Melati",
    "Bintara",
  ],
};

const pilihanWilayah = document.getElementById("pilihanWilayah");
const inputWilayahManual = document.getElementById("inputWilayahManual");
const inputKecamatan = document.getElementById("inputKecamatan");
const hasilPencarian = document.getElementById("hasilPencarian");
const infoLokasi = document.getElementById("infoLokasi");

function cekWilayahLainnya() {
  if (pilihanWilayah && inputWilayahManual) {
    if (pilihanWilayah.value === "Lainnya") {
      inputWilayahManual.style.display = "block";
      inputWilayahManual.focus();
    } else {
      inputWilayahManual.style.display = "none";
      inputWilayahManual.value = "";
    }
  }
}

if (inputKecamatan && hasilPencarian && infoLokasi && pilihanWilayah) {
  inputKecamatan.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    hasilPencarian.innerHTML = "";

    if (keyword.length < 1) {
      hasilPencarian.style.display = "none";
      infoLokasi.innerText = "";
      return;
    }

    let daftarKecamatan = [];
    const wilayahTerpilih = pilihanWilayah.value;

    if (databaseKecamatan[wilayahTerpilih]) {
      daftarKecamatan = databaseKecamatan[wilayahTerpilih];
    } else {
      Object.values(databaseKecamatan).forEach((arr) =>
        daftarKecamatan.push(...arr),
      );
    }

    const hasil = daftarKecamatan.filter((item) =>
      item.toLowerCase().includes(keyword),
    );

    if (hasil.length > 0) {
      hasilPencarian.style.display = "block";
      hasil.forEach((kec) => {
        const div = document.createElement("div");
        div.innerText = kec;
        div.style.padding = "10px";
        div.style.cursor = "pointer";
        div.style.borderBottom = "1px solid #1e293b";
        div.style.color = "#fff";

        div.onmouseover = () => (div.style.background = "#1e293b");
        div.onmouseout = () => (div.style.background = "transparent");

        div.onclick = function () {
          inputKecamatan.value = kec;
          hasilPencarian.style.display = "none";
          infoLokasi.innerText = `📍 Armada siap meluncur ke wilayah: ${kec}`;
        };
        hasilPencarian.appendChild(div);
      });
    } else {
      hasilPencarian.style.display = "none";
    }

    infoLokasi.innerText = `📍 Lokasi tujuan: ${this.value} (Bisa ketik manual jika tidak ada di list)`;
  });

  window.addEventListener("click", function (e) {
    if (
      !inputKecamatan.contains(e.target) &&
      !hasilPencarian.contains(e.target)
    ) {
      hasilPencarian.style.display = "none";
    }
  });
}

// --- 6. LOGIKA KIRIM KE WHATSAPP ---
const btnKirim = document.getElementById("btnKirim");
if (btnKirim) {
  btnKirim.addEventListener("click", function () {
    const layanan = pilihanLayanan.value;
    const wilayah =
      pilihanWilayah.value === "Lainnya"
        ? inputWilayahManual.value
        : pilihanWilayah.value;
    const kecamatan = inputKecamatan.value.trim();

    if (!wilayah) {
      alert("Tolong pilih wilayah utamanya dulu ya!");
      pilihanWilayah.focus();
      return;
    }
    if (!kecamatan) {
      alert("Tolong isi atau ketik kecamatan tujuan terlebih dahulu!");
      inputKecamatan.focus();
      return;
    }

    const lokasiLengkap = `${kecamatan}, ${wilayah}`;
    const nomorWa = "6281573044356";
    const pesan = `Halo, saya mau order jasa *${layanan}* untuk lokasi tujuan di *${lokasiLengkap}*. Apakah armada tersedia?`;

    const urlWa = `https://wa.me/${nomorWa}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWa, "_blank");
  });
}

// --- 7. LOGIKA GALERI LIGHTBOX ---
const modal = document.getElementById("modalLightbox");
const gambarMembesar = document.getElementById("gambarMembesar");
const fotoGaleri = document.querySelectorAll(".foto-galeri");
const closeModal = document.querySelector(".close-modal");

fotoGaleri.forEach((foto) => {
  foto.addEventListener("click", function () {
    if (modal && gambarMembesar) {
      modal.style.display = "block";
      gambarMembesar.src = this.src;
    }
  });
});

if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// --- 8. LOGIKA FAQ ACCORDION ---
const faqTanya = document.querySelectorAll(".faq-tanya");
faqTanya.forEach((tanya) => {
  tanya.addEventListener("click", function () {
    faqTanya.forEach((item) => {
      if (item !== this) item.parentElement.classList.remove("aktif");
    });
    this.parentElement.classList.toggle("aktif");
  });
});

// --- 9. LOGIKA TOMBOL SEE MORE GALERI ---
function toggleGaleri() {
  const itemsHidden = document.querySelectorAll(".galeri-hidden");
  const btnSeeMore = document.getElementById("btn-see-more");

  if (itemsHidden.length > 0 && btnSeeMore) {
    const isHidden = itemsHidden[0].style.display === "none";

    itemsHidden.forEach((item) => {
      item.style.display = isHidden ? "block" : "none";
    });

    if (isHidden) {
      btnSeeMore.innerText = "Show Less";
    } else {
      btnSeeMore.innerText = "See More Photos";
    }
  }
}
