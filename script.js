// ========== MOBILE MENU TOGGLE ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('.nav-links a, .hero-buttons a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== "#") {
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const offset = 80;
        const elementPosition = targetElem.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      }
    }
  });
});

// ========== FADE-UP ON SCROLL ==========
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
fadeElements.forEach(el => observer.observe(el));

// ========== NAVBAR SCROLL EFFECT ==========
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 252, 240, 0.98)';
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
  } else {
    navbar.style.background = 'rgba(255, 252, 240, 0.96)';
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
  }
});

// ========== STAT COUNTER ANIMATION ==========
const statNumbers = document.querySelectorAll('.stat-number');
const animateNumber = (el, target) => {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.innerText = target + (target === 12 ? '+' : target === 2400 ? '+' : '+');
      clearInterval(timer);
    } else {
      el.innerText = current;
    }
  }, 25);
};
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statEl = entry.target;
      const rawText = statEl.innerText;
      let targetNumber = 0;
      if (rawText.includes('12+')) targetNumber = 12;
      else if (rawText.includes('2.400')) targetNumber = 2400;
      else if (rawText.includes('35+')) targetNumber = 35;
      if (targetNumber) {
        statEl.innerText = '0';
        animateNumber(statEl, targetNumber);
      }
      statObserver.unobserve(statEl);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(stat => statObserver.observe(stat));

// ========== FORM HANDLER (FORMSPREE) ==========
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgvqled'; // Ganti dengan endpoint Anda
const form = document.getElementById('contactForm');
const feedbackDiv = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = document.getElementById('pesan').value.trim();

    if (!nama || !email || !pesan) {
      feedbackDiv.innerHTML = '<span style="color:#d9534f;">❌ Harap isi semua bidang!</span>';
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      feedbackDiv.innerHTML = '<span style="color:#d9534f;">✉️ Email tidak valid.</span>';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Mengirim... <i class="fas fa-spinner fa-pulse"></i>';
    feedbackDiv.innerHTML = '';

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ nama, email, pesan })
      });
      if (response.ok) {
        feedbackDiv.innerHTML = '<span style="color:#2b7a3e;">✅ Terima kasih! Pesan Anda telah terkirim. 🌿</span>';
        form.reset();
      } else {
        feedbackDiv.innerHTML = '<span style="color:#d9534f;">❌ Gagal mengirim. Coba lagi nanti.</span>';
      }
    } catch (error) {
      feedbackDiv.innerHTML = '<span style="color:#d9534f;">❌ Error jaringan.</span>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Kirim Pesan <i class="fas fa-paper-plane"></i>';
      setTimeout(() => { if (feedbackDiv.innerHTML) feedbackDiv.innerHTML = ''; }, 6000);
    }
  });
}

// ========== FITUR BERITA DENGAN API (GNews) + FALLBACK STATIS ==========
const beritaGrid = document.getElementById('beritaGrid');

// --- Data statis cadangan jika API gagal ---
const beritaDataStatis = [
  {
    id: 1,
    gambar: "menanam Mnagrove.png",
    judul: "Penanam 7.000 Bibit Mangrove",
    tanggal: "25 Mei 2026",
    deskripsiSingkat: "Kolaborasi kerja sama penanaman 7.000 bibit mangrove.",
    kontenLengkap: "Yayasan Butta Porea berkolaborasi bersama PT. Permodalan Nasional Madani (PNM) Cabang Makassar dan PT. BRI Asuransi (BRINS) Cabang Makassar melakukan penanaman mangrove di Bungalow Mangrove PIP Makassar."
  },
  {
    id: 2,
    gambar: "https://images.unsplash.com/photo-1592417817098-8fd3e2bc74fb?w=600&auto=format",
    judul: "Bank Sampah: Sampah Organik Jadi Kompos",
    tanggal: "2 April 2026",
    deskripsiSingkat: "Gerakan bank sampah di RW 05 berhasil mengolah 200 kg sampah organik menjadi pupuk kompos.",
    kontenLengkap: "Warga diajak memilah sampah dari rumah. Sampah organik diolah dengan metode takakura."
  },
  {
    id: 3,
    gambar: "https://images.unsplash.com/photo-1624890644271-c82bae4c2db9?w=600&auto=format",
    judul: "Penanaman 1.000 Pohon di Bantaran Sungai",
    tanggal: "20 April 2026",
    deskripsiSingkat: "Aksi kolaborasi dengan pemuda setempat menanam pohon produktif dan konservasi.",
    kontenLengkap: "Kegiatan ini rangkaian Hari Bumi. Pohon yang ditanam antara lain sengon, petai, dan trembesi."
  },
  {
    id: 4,
    gambar: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format",
    judul: "Panen Raya Kebun Percontohan",
    tanggal: "5 Mei 2026",
    deskripsiSingkat: "Hasil panen sayuran organik dari lahan percontohan seluas 500 m² mencapai 120 kg.",
    kontenLengkap: "Tim Yayasan bersama kelompok tani memanen kangkung, bayam, dan terong. Hasil dijual ke pasar murah."
  }
];

// --- Fungsi untuk menampilkan berita (baik dari API maupun statis) ---
function displayBerita(beritaArray, isApiData = false) {
  if (!beritaGrid) return;
  beritaGrid.innerHTML = '';

  beritaArray.forEach((item, index) => {
    // Jika data dari API, kita mapping propertinya ke struktur yang sama
    let berita;
    if (isApiData) {
      berita = {
        id: index,
        gambar: item.image || 'https://via.placeholder.com/600x400?text=Berita',
        judul: item.title || 'Judul tidak tersedia',
        tanggal: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID') : 'Tanggal tidak diketahui',
        deskripsiSingkat: (item.description || item.content || '').substring(0, 100),
        kontenLengkap: item.content || item.description || 'Baca selengkapnya di sumber asli.',
        url: item.url // untuk API, kita sediakan link asli
      };
    } else {
      berita = item;
    }

    const card = document.createElement('div');
    card.className = 'berita-card fade-up';
    card.innerHTML = `
      <img class="berita-img" src="${berita.gambar}" alt="${berita.judul}" loading="lazy" onerror="this.src='https://via.placeholder.com/600x400?text=Gambar+Tersedia'">
      <div class="berita-info">
        <div class="berita-tanggal"><i class="far fa-calendar-alt"></i> ${berita.tanggal}</div>
        <h3 class="berita-judul">${berita.judul}</h3>
        <p class="berita-deskripsi">${berita.deskripsiSingkat.substring(0, 100)}${berita.deskripsiSingkat.length > 100 ? '...' : ''}</p>
        ${isApiData && berita.url ? 
          `<a href="${berita.url}" target="_blank" class="btn-berita">Baca Selengkapnya <i class="fas fa-external-link-alt"></i></a>` :
          `<button class="btn-berita" data-id="${berita.id}">Baca Selengkapnya <i class="fas fa-arrow-right"></i></button>`
        }
      </div>
    `;
    beritaGrid.appendChild(card);
  });

  // Re-attach event listener untuk tombol "Baca Selengkapnya" (hanya untuk mode statis)
  if (!isApiData) {
    const btns = document.querySelectorAll('.btn-berita');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        const berita = beritaDataStatis.find(b => b.id === id);
        if (berita) showModal(berita);
      });
    });
  }

  // Trigger fade-up observer untuk card baru
  const newFadeElements = document.querySelectorAll('.fade-up');
  newFadeElements.forEach(el => observer.observe(el));
}

// --- Fungsi modal (untuk data statis) ---
function showModal(berita) {
  let modal = document.getElementById('beritaModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'beritaModal';
    modal.className = 'berita-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <img class="modal-img" src="" alt="">
        <h2 class="modal-judul"></h2>
        <div class="modal-tanggal"></div>
        <div class="modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  }
  const modalImg = modal.querySelector('.modal-img');
  const modalJudul = modal.querySelector('.modal-judul');
  const modalTanggal = modal.querySelector('.modal-tanggal');
  const modalBody = modal.querySelector('.modal-body');
  modalImg.src = berita.gambar;
  modalJudul.textContent = berita.judul;
  modalTanggal.innerHTML = `<i class="far fa-calendar-alt"></i> ${berita.tanggal}`;
  modalBody.innerHTML = `<p>${berita.kontenLengkap}</p><p style="margin-top:1rem;"><strong>#ButtaPorea #UrbanFarming</strong></p>`;
  modal.style.display = 'flex';
}

// Escape key close modal
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('beritaModal');
  if (e.key === 'Escape' && modal && modal.style.display === 'flex') modal.style.display = 'none';
});

// --- Ambil berita dari API GNews (atau gunakan statis) ---
async function fetchBeritaFromAPI() {
  if (!beritaGrid) return;
  
  // Tampilkan loading
  beritaGrid.innerHTML = '<div style="text-align:center; padding:2rem;">🔄 Memuat berita terbaru...</div>';

  // Ganti dengan API key Anda dari https://gnews.io
  const API_KEY = 'YOUR_GNEWS_API_KEY'; // <-- GANTI DENGAN API KEY ANDA
  const API_URL = `https://gnews.io/api/v4/search?q=urban%20farming%20indonesia%20lingkungan&lang=id&country=id&max=4&token=${API_KEY}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.articles && data.articles.length > 0) {
      displayBerita(data.articles, true);
    } else {
      throw new Error('Tidak ada artikel');
    }
  } catch (error) {
    console.warn('Gagal mengambil dari API, menggunakan data statis:', error);
    // Fallback ke data statis
    displayBerita(beritaDataStatis, false);
  }
}

// Jalankan jika elemen beritaGrid ada
if (beritaGrid) {
  fetchBeritaFromAPI();
}