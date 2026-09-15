// --- 1. PRELOADER ---
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

// --- 2. ANIMASI SCROLL (Fade-In) ---
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

// --- 3. TOMBOL SCROLL KE FORM ---
const btnScrollToForm = document.getElementById("btnScrollToForm");
const sectionKontak = document.getElementById("kontak");
if (btnScrollToForm && sectionKontak) {
  btnScrollToForm.addEventListener("click", function () {
    sectionKontak.scrollIntoView({ behavior: "smooth" });
  });
}

// --- 4. KARTU LAYANAN INTERAKTIF & AUTO-CUSTOM PINDAHAN ---
const kotakLayanan = document.querySelectorAll(".card-layanan");
const pilihanLayanan = document.getElementById("pilihanLayanan");

kotakLayanan.forEach(function (kotak) {
  kotak.addEventListener("click", function () {
    const judul = kotak.querySelector("h4").innerText;
    if (judul.includes("Puing")) {
      pilihanLayanan.value = "Angkut Puing";
      pilihRit(1, document.querySelector(".btn-rit"));
    } else if (judul.includes("Tanah")) {
      pilihanLayanan.value = "Tanah";
      pilihRit(1, document.querySelector(".btn-rit"));
    } else if (judul.includes("Pindahan")) {
      pilihanLayanan.value = "Pindahan Rumah";
      const tombolCustom = document.querySelector(".btn-rit:nth-child(4)");
      if (tombolCustom) pilihRit("custom", tombolCustom);
    } else {
      pilihanLayanan.value = "Sampah Proyek";
      pilihRit(1, document.querySelector(".btn-rit"));
    }

    if (sectionKontak) {
      sectionKontak.scrollIntoView({ behavior: "smooth" });
    }
  });
});

if (pilihanLayanan) {
  pilihanLayanan.addEventListener("change", function () {
    if (this.value === "Pindahan Rumah") {
      const tombolCustom = document.querySelector(".btn-rit:nth-child(4)");
      if (tombolCustom) pilihRit("custom", tombolCustom);
    }
  });
}

// --- 5. GALERI LIGHTBOX ---
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

// --- 6. KALKULATOR ESTIMASI & PILIHAN RIT ---
let ritAktif = 1;

function pilihRit(nilai, elemenTombol) {
  ritAktif = nilai;

  const semuaTombol = document.querySelectorAll(".btn-rit");
  semuaTombol.forEach((btn) => btn.classList.remove("aktif"));
  if (elemenTombol) elemenTombol.classList.add("aktif");

  const containerOutput = document.getElementById("containerOutput");
  const infoKapasitas = document.getElementById("infoKapasitas");
  const cardResult = document.getElementById("cardResult");
  const labelResultTitle = document.getElementById("labelResultTitle");

  const HARGA_PER_RIT = 349000;

  if (nilai === "custom") {
    if (labelResultTitle)
      labelResultTitle.innerText = "Butuh Penawaran Khusus?";
    if (cardResult) cardResult.classList.add("clickable");

    if (containerOutput) {
      containerOutput.innerHTML = `
        <a href="#" onclick="kirimWaCustom(event)" class="link-hubungi-custom">
          <h2>Hubungi Kami</h2>
        </a>
      `;
    }
    if (infoKapasitas)
      infoKapasitas.innerHTML = `🤝 <strong>Muatan Banyak / Khusus / Pindahan:</strong> Dump Truck Colt Diesel Roda 6 siap meluncur. Klik di sini untuk nego via WhatsApp.`;
  } else {
    if (cardResult) cardResult.classList.remove("clickable");
    if (labelResultTitle) labelResultTitle.innerText = "Estimasi Total Biaya";

    const jumlah = parseInt(nilai);
    const totalHarga = jumlah * HARGA_PER_RIT;
    const totalKapasitas = jumlah * 4;

    if (containerOutput) {
      containerOutput.innerHTML = `
        <h2 id="hasilEstimasi">Rp ${totalHarga.toLocaleString("id-ID")}</h2>
      `;
    }
    if (infoKapasitas)
      infoKapasitas.innerHTML = `🚛 <strong>Kapasitas:</strong> ${totalKapasitas} Kubik (${jumlah} Rit) - Dump Truck Colt Diesel Roda 6 (Termasuk Truk & Kuli)`;
  }
}

// --- 7. DATABASE KECAMATAN & VALIDASI WILAYAH (STRICT) ---
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
const inputKecamatan = document.getElementById("inputKecamatan");
const hasilPencarian = document.getElementById("hasilPencarian");
const infoLokasi = document.getElementById("infoLokasi");

if (inputKecamatan && hasilPencarian && infoLokasi && pilihanWilayah) {
  function tampilkanDaftarKecamatan(keyword = "") {
    hasilPencarian.innerHTML = "";
    let daftarKecamatan = [];
    const wilayahTerpilih = pilihanWilayah.value;

    if (!wilayahTerpilih) {
      hasilPencarian.style.display = "none";
      return;
    }

    if (databaseKecamatan[wilayahTerpilih]) {
      daftarKecamatan = databaseKecamatan[wilayahTerpilih];
    }

    const hasil = daftarKecamatan.filter((item) =>
      item.toLowerCase().includes(keyword.toLowerCase()),
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
        div.style.fontSize = "14px";

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
  }

  inputKecamatan.addEventListener("focus", function () {
    if (!pilihanWilayah.value) {
      alert(
        "⚠️ Mohon pilih Wilayah Utama terlebih dahulu di atas sebelum mencari kecamatan!",
      );
      pilihanWilayah.focus();
      hasilPencarian.style.display = "none";
      return;
    }
    tampilkanDaftarKecamatan(this.value);
  });

  inputKecamatan.addEventListener("input", function () {
    if (!pilihanWilayah.value) return;
    const keyword = this.value.trim();
    tampilkanDaftarKecamatan(keyword);

    if (keyword.length > 0) {
      infoLokasi.innerText = `📍 Lokasi tujuan: ${keyword}`;
    } else {
      infoLokasi.innerText = "";
    }
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

function validasiDanAmbilLokasi() {
  const wilayahVal = pilihanWilayah ? pilihanWilayah.value : "";
  const kecamatanVal = inputKecamatan ? inputKecamatan.value.trim() : "";

  if (!wilayahVal) {
    alert(
      "⚠️ Mohon pilih Wilayah Utama terlebih dahulu (Jakarta Selatan, Jakarta Timur, atau Bekasi)!",
    );
    if (pilihanWilayah) {
      pilihanWilayah.scrollIntoView({ behavior: "smooth", block: "center" });
      pilihanWilayah.focus();
    }
    return null;
  }

  if (!kecamatanVal) {
    alert(
      "⚠️ Mohon pilih atau cari Kecamatan tujuan terlebih dahulu dari daftar!",
    );
    if (inputKecamatan) {
      inputKecamatan.scrollIntoView({ behavior: "smooth", block: "center" });
      inputKecamatan.focus();
    }
    return null;
  }

  const daftarKecamatanValid = databaseKecamatan[wilayahVal] || [];
  const isKecamatanValid = daftarKecamatanValid.some(
    (kec) => kec.toLowerCase() === kecamatanVal.toLowerCase(),
  );

  if (!isKecamatanValid) {
    alert(
      `⚠️ Maaf, kecamatan "${kecamatanVal}" tidak terdaftar atau tidak sesuai dengan wilayah ${wilayahVal}.\n\nSilakan pilih nama kecamatan yang valid dari daftar yang muncul!`,
    );
    if (inputKecamatan) {
      inputKecamatan.scrollIntoView({ behavior: "smooth", block: "center" });
      inputKecamatan.focus();
    }
    return null;
  }

  return `${kecamatanVal}, ${wilayahVal}`;
}

// --- 8. KIRIM KE WHATSAPP (FORM & CUSTOM) ---
function kirimWaCustom(e) {
  e.preventDefault();
  const lokasiLengkap = validasiDanAmbilLokasi();
  if (!lokasiLengkap) return;

  const layanan = pilihanLayanan ? pilihanLayanan.value : "Angkut Puing";
  const nomorWa = "6281573044356";
  let pesan = `Halo JayTrans, saya mau order jasa *${layanan}* dengan muatan *Custom / Banyak* untuk lokasi tujuan di *${lokasiLengkap}*. Mohon info harga dan ketersediaan armada.`;

  if (layanan === "Pindahan Rumah") {
    pesan = `Halo JayTrans, saya mau tanya-tanya / order jasa *Pindahan Rumah / Perabot* untuk rute/tujuan di *${lokasiLengkap}*. Mohon info estimasi biaya dan ketersediaan armada truk.`;
  }

  const urlWa = `https://wa.me/${nomorWa}?text=${encodeURIComponent(pesan)}`;
  window.open(urlWa, "_blank");
}

const btnKirim = document.getElementById("btnKirim");
if (btnKirim) {
  btnKirim.addEventListener("click", function () {
    const lokasiLengkap = validasiDanAmbilLokasi();
    if (!lokasiLengkap) return;

    const layanan = pilihanLayanan.value;
    let detailRitPesan = `${ritAktif} Rit (± ${ritAktif * 4} Kubik)`;
    if (ritAktif === "custom") {
      detailRitPesan = "Custom / Muatan Banyak";
    }

    const nomorWa = "6281573044356";
    let pesan = `Halo JayTrans, saya mau order jasa *${layanan}* sebanyak *${detailRitPesan}* untuk lokasi tujuan di *${lokasiLengkap}*. Apakah armada tersedia?`;

    if (layanan === "Pindahan Rumah") {
      pesan = `Halo JayTrans, saya mau order jasa *Pindahan Rumah / Perabot* untuk tujuan di *${lokasiLengkap}*. Apakah armada tersedia?`;
    }

    const urlWa = `https://wa.me/${nomorWa}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWa, "_blank");
  });
}

// --- 9. FAQ ACCORDION ---
const faqTanya = document.querySelectorAll(".faq-tanya");
faqTanya.forEach((tanya) => {
  tanya.addEventListener("click", function () {
    faqTanya.forEach((item) => {
      if (item !== this) item.parentElement.classList.remove("aktif");
    });
    this.parentElement.classList.toggle("aktif");
  });
});

// --- 10. TOMBOL SEE MORE GALERI ---
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
