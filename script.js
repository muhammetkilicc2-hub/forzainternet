/* =========================================================
   FORZA INTERNET & CAFE — CORE JAVASCRIPT ENGINE
   Stabilized, robust, responsive & zero console errors
   ========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {        /* =====================================================
           1. GİZLİ 3 TIKLAMA (TRIPLE CLICK ADMIN SHORTCUT)
           index.html ve tüm sayfalarda Forza ikonuna 3 kez tıklandığında
           oturum varsa doğrudan panele (panel.html), yoksa giriş sayfasına (giris.html) yönlendirir.
        ===================================================== */
        (function initAdminShortcut() {
            const forzaImages = document.querySelectorAll(".forza-image");
            let clickCount = 0;
            let timer = null;

            forzaImages.forEach(function (img) {
                img.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    clickCount++;
                    clearTimeout(timer);

                    img.style.transform = "scale(" + (1 + clickCount * 0.1) + ") rotate(" + (clickCount * 6) + "deg)";

                    if (clickCount >= 3) {
                        clickCount = 0;
                        document.body.style.transition = "opacity 0.2s ease";
                        document.body.style.opacity = "0.3";

                        const isLoggedIn = sessionStorage.getItem("forzaAdminGiris") === "true";
                        const hedef = isLoggedIn ? "panel.html" : "giris.html";

                        setTimeout(function () {
                            window.location.href = hedef;
                        }, 120);
                        return false;
                    }

                    timer = setTimeout(function () {
                        const isIndex = window.location.pathname.endsWith("index.html") || 
                                        window.location.pathname === "/" || 
                                        window.location.pathname.endsWith("/") ||
                                        !window.location.pathname.includes(".html");

                        if (clickCount === 1 && !isIndex) {
                            window.location.href = "index.html";
                        }
                        clickCount = 0;
                        img.style.transform = "";
                    }, 380);
                });
            });
        }());       


        /* =====================================================
           2. MOBİL HAMBURGER MENÜ & OVERLAY
        ===================================================== */
        (function initMobileNav() {
            const hamburgerBtn = document.getElementById("hamburgerBtn");
            const navMenu = document.getElementById("navMenu");
            const navOverlay = document.getElementById("navOverlay");

            if (!hamburgerBtn || !navMenu) return;

            function toggleMenu(forceState) {
                const isOpen = typeof forceState === "boolean" 
                    ? forceState 
                    : !navMenu.classList.contains("active");

                hamburgerBtn.classList.toggle("active", isOpen);
                navMenu.classList.toggle("active", isOpen);
                if (navOverlay) navOverlay.classList.toggle("active", isOpen);

                hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
                document.body.style.overflow = isOpen ? "hidden" : "";
            }

            hamburgerBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleMenu();
            });

            if (navOverlay) {
                navOverlay.addEventListener("click", function () {
                    toggleMenu(false);
                });
            }

            // Menü linklerine tıklanınca kapat
            navMenu.querySelectorAll("a").forEach(function (link) {
                link.addEventListener("click", function () {
                    toggleMenu(false);
                });
            });

            // ESC tuşuyla kapat
            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape" && navMenu.classList.contains("active")) {
                    toggleMenu(false);
                }
            });
        }());


        /* =====================================================
           3. NAVBAR SCROLL EFFECT
        ===================================================== */
        (function initNavbarScroll() {
            const nav = document.querySelector("nav");
            if (!nav) return;

            function handleScroll() {
                if (window.scrollY > 40) {
                    nav.classList.add("scrolled");
                } else {
                    nav.classList.remove("scrolled");
                }
            }

            window.addEventListener("scroll", handleScroll, { passive: true });
            handleScroll();
        }());


        /* =====================================================
           4. STICKY İLETİŞİM BUTONU (WHATSAPP / INSTAGRAM)
        ===================================================== */
        (function initStickyContact() {
            const stickyContact = document.querySelector(".sticky-contact");
            const stickyBtn = document.querySelector(".sticky-contact-button");

            if (!stickyContact || !stickyBtn) return;

            stickyBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                stickyContact.classList.toggle("active");
            });

            document.addEventListener("click", function (e) {
                if (!stickyContact.contains(e.target)) {
                    stickyContact.classList.remove("active");
                }
            });

            stickyContact.querySelectorAll(".contact-option").forEach(function (opt) {
                opt.addEventListener("click", function () {
                    stickyContact.classList.remove("active");
                });
            });
        }());


        /* =====================================================
           5. FOTO GALERİ & LIGHTBOX (hakkimizda.html)
        ===================================================== */
        (function initGallery() {
            const track = document.querySelector(".photo-track");
            if (!track) return;

            const VARSAYILAN_FOTOLAR = [
                { src: "foto1.jpeg", alt: "Forza Gaming Salonu - Ana Salon" },
                { src: "foto2.jpeg", alt: "Forza 540Hz Espor Alanı" },
                { src: "foto3.jpeg", alt: "Pro Gaming Setup" },
                { src: "foto4.jpeg", alt: "VIP Oyuncu Alanı" },
                { src: "foto5.jpeg", alt: "Ekipman ve Konfor" },
                { src: "foto6.jpeg", alt: "Turnuva Masaları" }
            ];

            let fotoListesi = VARSAYILAN_FOTOLAR;
            try {
                const raw = localStorage.getItem("forzaGaleriFotograflar");
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        fotoListesi = parsed;
                    }
                }
            } catch (e) {
                console.error("Galeri fotoğrafları yüklenemedi:", e);
            }

            // Track içerisine dinamik img elementleri ekle
            track.innerHTML = "";
            fotoListesi.forEach(function (f) {
                const img = document.createElement("img");
                img.src = f.src;
                img.alt = f.alt || f.badge || "Forza Gaming Alanı";
                img.loading = "lazy";
                track.appendChild(img);
            });

            const slides = Array.from(track.querySelectorAll("img"));
            if (!slides.length) return;

            const prevBtn = document.getElementById("prev");
            const nextBtn = document.getElementById("next");
            const lightbox = document.getElementById("lightbox");
            const lightboxImg = document.getElementById("lightboxImage");
            const closeLightboxBtn = document.getElementById("closeLightbox");

            let currentIndex = 0;

            function getSlideWidth() {
                return slides[0] ? slides[0].getBoundingClientRect().width : 0;
            }

            function updateButtons() {
                if (prevBtn) prevBtn.disabled = currentIndex <= 0;
                if (nextBtn) {
                    const visibleCount = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
                    nextBtn.disabled = currentIndex >= slides.length - visibleCount;
                }
            }

            function moveToSlide(index) {
                const visibleCount = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
                const maxIndex = Math.max(0, slides.length - visibleCount);
                currentIndex = Math.max(0, Math.min(index, maxIndex));

                const slideW = getSlideWidth();
                const gap = 16;
                const offset = -(slideW + gap) * currentIndex;
                track.style.transform = "translateX(" + offset + "px)";

                updateButtons();
            }

            if (prevBtn) {
                prevBtn.addEventListener("click", function () {
                    moveToSlide(currentIndex - 1);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener("click", function () {
                    moveToSlide(currentIndex + 1);
                });
            }

            window.addEventListener("resize", function () {
                moveToSlide(currentIndex);
            });

            updateButtons();

            // Lightbox Modal with Sliding & Gesture Controls
            const lightboxCaption = document.getElementById("lightboxCaption");
            const lightboxCounter = document.getElementById("lightboxCounter");
            const lightboxPrevBtn = document.getElementById("lightboxPrev");
            const lightboxNextBtn = document.getElementById("lightboxNext");
            let lightboxCurrentIndex = 0;

            function renderLightboxPhoto(index) {
                if (!lightboxImg) return;
                lightboxCurrentIndex = (index + fotoListesi.length) % fotoListesi.length;
                const photo = fotoListesi[lightboxCurrentIndex];
                
                lightboxImg.src = photo.src;
                lightboxImg.alt = photo.alt || photo.badge || "Forza Gaming Alanı";
                
                if (lightboxCaption) {
                    lightboxCaption.textContent = photo.alt || photo.badge || "Forza Gaming Alanı";
                }
                if (lightboxCounter) {
                    lightboxCounter.textContent = (lightboxCurrentIndex + 1) + " / " + fotoListesi.length;
                }
            }

            function openLightbox(index) {
                if (!lightbox) return;
                renderLightboxPhoto(index);
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            }

            function closeLightbox() {
                if (!lightbox) return;
                lightbox.classList.remove("active");
                if (lightboxImg) lightboxImg.src = "";
                document.body.style.overflow = "";
            }

            slides.forEach(function (img, idx) {
                img.addEventListener("click", function () {
                    openLightbox(idx);
                });
            });

            if (lightboxPrevBtn) {
                lightboxPrevBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    renderLightboxPhoto(lightboxCurrentIndex - 1);
                });
            }

            if (lightboxNextBtn) {
                lightboxNextBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    renderLightboxPhoto(lightboxCurrentIndex + 1);
                });
            }

            if (closeLightboxBtn) {
                closeLightboxBtn.addEventListener("click", closeLightbox);
            }

            if (lightbox) {
                lightbox.addEventListener("click", function (e) {
                    if (e.target === lightbox) closeLightbox();
                });

                // Touch Swipe inside Lightbox
                let touchStartX = null;
                lightbox.addEventListener("touchstart", function (e) {
                    touchStartX = e.touches[0].clientX;
                }, { passive: true });

                lightbox.addEventListener("touchend", function (e) {
                    if (touchStartX === null) return;
                    const touchEndX = e.changedTouches[0].clientX;
                    const diff = touchStartX - touchEndX;
                    if (diff > 45) renderLightboxPhoto(lightboxCurrentIndex + 1);
                    if (diff < -45) renderLightboxPhoto(lightboxCurrentIndex - 1);
                    touchStartX = null;
                }, { passive: true });
            }

            document.addEventListener("keydown", function (e) {
                if (lightbox && lightbox.classList.contains("active")) {
                    if (e.key === "Escape") closeLightbox();
                    if (e.key === "ArrowLeft") renderLightboxPhoto(lightboxCurrentIndex - 1);
                    if (e.key === "ArrowRight") renderLightboxPhoto(lightboxCurrentIndex + 1);
                }
            });
        }());


        /* =====================================================
           6. KAMPANYA & REZERVASYON SİSTEMİ (rezerve.html)
        ===================================================== */
        (function initReservationSystem() {
            const kartlar = document.querySelectorAll(".kampanya-kartlari .kart");
            if (!kartlar.length) return;

            const pcData = window.ForzaPcData;

            // Admin panelinden gelen bilgisayar durumlarını eşzamanla
            function pcDurumlariniUygula() {
                if (!pcData) return;
                const durumlar = pcData.durumlariYukle();

                document.querySelectorAll(".comp").forEach(function (pc) {
                    const id = pcData.idCikar(pc.textContent);
                    const durum = id !== null ? durumlar[id] : undefined;
                    const rezerveMi = durum === pcData.DURUM.REZERVE;
                    const doluMu = durum === pcData.DURUM.KULLANIMDA || rezerveMi;

                    pc.classList.toggle("dolu", doluMu);
                    pc.classList.toggle("rezerveli", rezerveMi);
                    pc.setAttribute("aria-disabled", doluMu ? "true" : "false");

                    if (doluMu) {
                        pc.classList.remove("secili");
                        pc.title = rezerveMi ? "Bu bilgisayar rezerve edilmiş" : "Bu bilgisayar şu anda kullanımda";
                    } else {
                        pc.removeAttribute("title");
                    }
                });
            }

            // Fiyatları localStorage'dan eşzamanla
            function pcFiyatlariniUygula() {
                if (!pcData || !pcData.fiyatlariYukle) return;
                const fiyatlar = pcData.fiyatlariYukle();

                kartlar.forEach(function (kart) {
                    const tier = kart.dataset.tier || (
                        kart.classList.contains("sari") ? "sari" :
                        kart.classList.contains("mavi") ? "mavi" :
                        kart.classList.contains("yesil") ? "yesil" : null
                    );
                    const veri = tier ? fiyatlar[tier] : null;
                    if (!veri) return;

                    // Masa Başlığını Güncelle (Örn: 60 TL Masa -> 65 TL Masa)
                    const baslikEl = kart.querySelector(".kart-baslik h3");
                    const varsayilanSaatlik = tier === "sari" ? 60 : tier === "mavi" ? 70 : 90;
                    const guncelSaatlik = veri.bazSaatlik || varsayilanSaatlik;
                    if (baslikEl) {
                        baslikEl.textContent = guncelSaatlik + " TL Masa";
                    }

                    // Paket Fiyatlarını Güncelle (1. Tarife: 5 Saat / 2. Tarife: Gün Boyu)
                    const fiyatList = kart.querySelectorAll(".fiyat");
                    if (fiyatList.length >= 2) {
                        const f1Span = fiyatList[0].querySelector("span");
                        const f1Strong = fiyatList[0].querySelector("strong");
                        if (f1Span) f1Span.textContent = "5 Saat Paket";
                        if (f1Strong) f1Strong.textContent = (veri.besSaatlik || veri.saatlik || 200) + " TL";
                        fiyatList[0].setAttribute("aria-label", `${guncelSaatlik} TL Masa 5 Saatlik Paket (${veri.besSaatlik || veri.saatlik} TL)`);

                        const f2Span = fiyatList[1].querySelector("span");
                        const f2Strong = fiyatList[1].querySelector("strong");
                        if (f2Span) f2Span.textContent = "Gün Boyu Paket";
                        if (f2Strong) f2Strong.textContent = (veri.gunluk || 400) + " TL";
                        fiyatList[1].setAttribute("aria-label", `${guncelSaatlik} TL Masa Gün Boyu Paket (${veri.gunluk} TL)`);
                    }
                });
            }

            pcDurumlariniUygula();
            pcFiyatlariniUygula();

            if (pcData && pcData.degisiklikleriDinle) {
                pcData.degisiklikleriDinle(function () {
                    pcDurumlariniUygula();
                    kartlar.forEach(function (kart) {
                        kart.dispatchEvent(new Event("forzaYenidenHesapla"));
                    });
                });
            }

            if (pcData && pcData.fiyatDegisiklikleriDinle) {
                pcData.fiyatDegisiklikleriDinle(function () {
                    pcFiyatlariniUygula();
                    kartlar.forEach(function (kart) {
                        kart.dispatchEvent(new Event("forzaYenidenHesapla"));
                    });
                });
            }

            if (pcData && pcData.sunucudanSenkronizeEt) {
                pcData.sunucudanSenkronizeEt(pcDurumlariniUygula);
            }

            // Her kart için seçim ve hesaplama mekanizması
            kartlar.forEach(function (kart) {
                const fiyatlar = kart.querySelectorAll(".fiyat");
                const pcler = kart.querySelectorAll(".comp");
                const odemeBtn = kart.querySelector(".odeme-btn");

                function triggerHaptic() {
                    if (typeof navigator !== "undefined" && navigator.vibrate) {
                        try { navigator.vibrate(12); } catch (e) {}
                    }
                }

                function toplamFiyatHesapla() {
                    const seciliFiyat = kart.querySelector(".fiyat.secili");
                    const seciliPcler = kart.querySelectorAll(".comp.secili");
                    const pcSayisi = seciliPcler.length;

                    let tekilFiyat = 0;
                    let sureEtiket = "";

                    if (seciliFiyat) {
                        const strong = seciliFiyat.querySelector("strong");
                        const span = seciliFiyat.querySelector("span");
                        if (strong) {
                            const match = strong.textContent.match(/\d+/);
                            if (match) tekilFiyat = parseInt(match[0], 10);
                        }
                        if (span) sureEtiket = span.textContent.trim();
                    }

                    const toplam = tekilFiyat * pcSayisi;

                    if (odemeBtn) {
                        if (seciliFiyat && pcSayisi > 0) {
                            odemeBtn.innerHTML = '<i class="fa-solid fa-credit-card"></i> ' + pcSayisi + ' Masa Seçildi (' + toplam.toLocaleString("tr-TR") + ' TL) — Ödemeye Geç';
                        } else if (pcSayisi > 0) {
                            odemeBtn.innerHTML = '<i class="fa-solid fa-credit-card"></i> ' + pcSayisi + ' Masa Seçildi (Tarife Seçin)';
                        } else if (seciliFiyat) {
                            odemeBtn.innerHTML = '<i class="fa-solid fa-credit-card"></i> ' + sureEtiket + ' — Masa Seçin';
                        } else {
                            odemeBtn.innerHTML = '<i class="fa-solid fa-credit-card"></i> Masa &amp; Tarife Seçin';
                        }
                    }

                    return toplam;
                }

                // Fiyat Seçimi (Aç/Kapa - Toggle)
                fiyatlar.forEach(function (fiyat) {
                    function fiyatSec() {
                        triggerHaptic();
                        // Diğer kartların seçimlerini temizle
                        kartlar.forEach(function (digerKart) {
                            if (digerKart !== kart) {
                                digerKart.querySelectorAll(".fiyat.secili").forEach(function (f) { f.classList.remove("secili"); });
                                digerKart.querySelectorAll(".comp.secili").forEach(function (c) { c.classList.remove("secili"); });
                                const digerBtn = digerKart.querySelector(".odeme-btn");
                                if (digerBtn) {
                                    digerBtn.innerHTML = '<i class="fa-solid fa-credit-card"></i> Masa &amp; Tarife Seçin';
                                }
                            }
                        });

                        const aktifMi = fiyat.classList.contains("secili");
                        if (aktifMi) {
                            fiyat.classList.remove("secili");
                        } else {
                            fiyatlar.forEach(function (f) { f.classList.remove("secili"); });
                            fiyat.classList.add("secili");
                        }
                        toplamFiyatHesapla();
                    }

                    fiyat.addEventListener("click", fiyatSec);
                    fiyat.addEventListener("keydown", function (e) {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            fiyatSec();
                        }
                    });
                });

                // Masa Seçimi (Aç/Kapa - Toggle, Maksimum 3)
                pcler.forEach(function (pc) {
                    function masaSec() {
                        triggerHaptic();
                        if (pc.classList.contains("dolu") || pc.classList.contains("rezerveli")) {
                            alert("Bu bilgisayar şu anda müsait değildir.");
                            return;
                        }

                        // Diğer kartların seçimlerini temizle
                        kartlar.forEach(function (digerKart) {
                            if (digerKart !== kart) {
                                digerKart.querySelectorAll(".fiyat.secili").forEach(function (f) { f.classList.remove("secili"); });
                                digerKart.querySelectorAll(".comp.secili").forEach(function (c) { c.classList.remove("secili"); });
                            }
                        });

                        // Eğer seçili tarife yoksa ilk tarifeyi otomatik seç
                        const seciliFiyat = kart.querySelector(".fiyat.secili");
                        if (!seciliFiyat && fiyatlar.length > 0) {
                            fiyatlar[0].classList.add("secili");
                        }

                        if (pc.classList.contains("secili")) {
                            pc.classList.remove("secili");
                        } else {
                            const seciliSayisi = kart.querySelectorAll(".comp.secili").length;
                            if (seciliSayisi >= 3) {
                                alert("Aynı anda en fazla 3 masa seçebilirsiniz.");
                                return;
                            }
                            pc.classList.add("secili");
                        }
                        toplamFiyatHesapla();
                    }

                    pc.addEventListener("click", masaSec);
                    pc.addEventListener("keydown", function (e) {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            masaSec();
                        }
                    });
                });
            });
        }());


        /* =====================================================
           7. ÖDEME MODAL VE SİPARİŞ AKIŞI
        ===================================================== */
        (function initPaymentModal() {
            const paymentModal = document.getElementById("paymentModal");
            if (!paymentModal) return;

            const paymentClose = document.getElementById("paymentClose");
            const paymentSubmit = document.getElementById("paymentSubmit");
            const paymentPc = document.getElementById("paymentPc");
            const paymentPackage = document.getElementById("paymentPackage");
            const paymentDuration = document.getElementById("paymentDuration");
            const paymentTotal = document.getElementById("paymentTotal");
            const paymentName = document.getElementById("paymentName");
            const paymentSurname = document.getElementById("paymentSurname");
            const paymentPhone = document.getElementById("paymentPhone");

            const cardFields = document.getElementById("cardFields");
            const cardPayment = document.getElementById("cardPayment");
            const balancePayment = document.getElementById("balancePayment");
            const cardNumber = document.getElementById("cardNumber");
            const cardExpiry = document.getElementById("cardExpiry");
            const cardCvv = document.getElementById("cardCvv");

            let currentReservation = null;

            function openModal(data) {
                currentReservation = data;
                if (paymentPc) paymentPc.textContent = data.pcs.join(", ");
                if (paymentPackage) paymentPackage.textContent = data.package;
                if (paymentDuration) paymentDuration.textContent = data.duration;
                if (paymentTotal) paymentTotal.textContent = "₺" + data.price.toLocaleString("tr-TR");

                const dateInput = document.getElementById("paymentDate");
                if (dateInput) {
                    const todayStr = new Date().toISOString().split("T")[0];
                    if (!dateInput.value) dateInput.value = todayStr;
                    dateInput.min = todayStr;
                }

                paymentModal.classList.add("active");
                document.body.style.overflow = "hidden";

                if (paymentName) {
                    setTimeout(function () { paymentName.focus(); }, 120);
                }
            }

            function closeModal() {
                paymentModal.classList.remove("active");
                document.body.style.overflow = "";
            }

            if (paymentClose) paymentClose.addEventListener("click", closeModal);

            paymentModal.addEventListener("click", function (e) {
                if (e.target === paymentModal) closeModal();
            });

            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape" && paymentModal.classList.contains("active")) {
                    closeModal();
                }
            });

            // Ödeme Yöntemi Değişimi
            function togglePaymentMethod() {
                if (!cardFields) return;
                cardFields.style.display = (cardPayment && cardPayment.checked) ? "flex" : "none";
            }

            if (cardPayment) cardPayment.addEventListener("change", togglePaymentMethod);
            if (balancePayment) balancePayment.addEventListener("change", togglePaymentMethod);
            togglePaymentMethod();

            // Kart Numarası Otomatik Boşluk Formatı
            if (cardNumber) {
                cardNumber.addEventListener("input", function () {
                    let val = this.value.replace(/\D/g, "").slice(0, 16);
                    const groups = val.match(/.{1,4}/g);
                    this.value = groups ? groups.join(" ") : "";
                });
            }

            // SKT Otomatik Slash Formatı
            if (cardExpiry) {
                cardExpiry.addEventListener("input", function () {
                    let val = this.value.replace(/\D/g, "").slice(0, 4);
                    if (val.length >= 3) {
                        val = val.slice(0, 2) + "/" + val.slice(2);
                    }
                    this.value = val;
                });
            }

            // Telefon Numarası Otomatik TR Formatı: 0 (5XX) XXX XX XX
            if (paymentPhone) {
                paymentPhone.addEventListener("input", function () {
                    let digits = this.value.replace(/\D/g, "");
                    if (digits.startsWith("0")) digits = digits.slice(1);
                    digits = digits.slice(0, 10);

                    let formatted = "";
                    if (digits.length > 0) {
                        formatted = "0 (" + digits.slice(0, 3);
                        if (digits.length >= 3) {
                            formatted += ") " + digits.slice(3, 6);
                        }
                        if (digits.length >= 6) {
                            formatted += " " + digits.slice(6, 8);
                        }
                        if (digits.length >= 8) {
                            formatted += " " + digits.slice(8, 10);
                        }
                    }
                    this.value = formatted;
                });
            }

            // "Ödemeye Geç" Butonlarına Tıklama
            document.querySelectorAll(".odeme-btn").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    const kart = btn.closest(".kart");
                    if (!kart) return;

                    const seciliFiyat = kart.querySelector(".fiyat.secili");
                    const seciliPcler = Array.from(kart.querySelectorAll(".comp.secili"));

                    if (!seciliPcler.length) {
                        alert("Lütfen rezervasyon yapmak istediğiniz en az 1 adet masayı seçiniz.");
                        return;
                    }
                    if (!seciliFiyat) {
                        alert("Lütfen bir süre tarifesi (5 Saat veya Gün Boyu) seçiniz.");
                        return;
                    }

                    const pcs = seciliPcler.map(function (p) { return p.textContent.trim(); });
                    const packageTitle = kart.querySelector("h3");
                    const packageName = packageTitle ? packageTitle.textContent.trim() : "Forza Kampanya";
                    const durationEl = seciliFiyat.querySelector("span");
                    const duration = durationEl ? durationEl.textContent.trim() : "5 Saat Paket";
                    
                    const priceEl = seciliFiyat.querySelector("strong");
                    let unitPrice = 0;
                    if (priceEl) {
                        const match = priceEl.textContent.match(/\d+/);
                        if (match) unitPrice = parseInt(match[0], 10);
                    }

                    const total = unitPrice * pcs.length;

                    openModal({
                        pcs: pcs,
                        package: packageName,
                        duration: duration,
                        price: total,
                        unitPrice: unitPrice
                    });
                });
            });

            // Siparişi Onayla & Gönder
            if (paymentSubmit) {
                paymentSubmit.addEventListener("click", function () {
                    if (!currentReservation) return;

                    const name = paymentName ? paymentName.value.trim() : "";
                    const surname = paymentSurname ? paymentSurname.value.trim() : "";
                    const phone = paymentPhone ? paymentPhone.value.trim() : "";

                    if (!name) {
                        alert("Lütfen adınızı giriniz.");
                        if (paymentName) paymentName.focus();
                        return;
                    }
                    if (!surname) {
                        alert("Lütfen soyadınızı giriniz.");
                        if (paymentSurname) paymentSurname.focus();
                        return;
                    }
                    if (!phone) {
                        alert("Lütfen telefon numaranızı giriniz.");
                        if (paymentPhone) paymentPhone.focus();
                        return;
                    }

                    // Kart Validasyonu (Kart seçiliyse)
                    if (cardPayment && cardPayment.checked) {
                        const num = cardNumber ? cardNumber.value.replace(/\s/g, "") : "";
                        const exp = cardExpiry ? cardExpiry.value.trim() : "";
                        const cvv = cardCvv ? cardCvv.value.trim() : "";

                        if (num.length !== 16) {
                            alert("Lütfen 16 haneli geçerli bir kart numarası giriniz.");
                            if (cardNumber) cardNumber.focus();
                            return;
                        }
                        if (!/^\d{2}\/\d{2}$/.test(exp)) {
                            alert("Son kullanma tarihini AA/YY formatında giriniz.");
                            if (cardExpiry) cardExpiry.focus();
                            return;
                        }
                        if (cvv.length < 3) {
                            alert("Lütfen geçerli bir CVV güvenlik kodu giriniz.");
                            if (cardCvv) cardCvv.focus();
                            return;
                        }
                    }

                    const appointmentDate = (document.getElementById("paymentDate") && document.getElementById("paymentDate").value) || new Date().toISOString().split("T")[0];
                    const appointmentTime = (document.getElementById("paymentTime") && document.getElementById("paymentTime").value) || "18:00";

                    // Sipariş İşleniyor Gösterimi
                    paymentSubmit.disabled = true;
                    paymentSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Rezervasyon İşleniyor...';

                    setTimeout(function () {
                        paymentSubmit.disabled = false;
                        paymentSubmit.innerHTML = '<i class="fa-solid fa-lock"></i> Rezervasyonu Tamamla';

                        // Admin bildirimine ekle
                        const pcData = window.ForzaPcData;
                        if (pcData && pcData.bildirimEkle) {
                            pcData.bildirimEkle({
                                tur: "siparis",
                                durum: "pending",
                                baslik: "Yeni Rezervasyon — " + currentReservation.package,
                                mesaj: (currentReservation.pcs ? currentReservation.pcs.join(", ") : "") + " · " + currentReservation.package + " · " + currentReservation.duration + " · 🕒 Randevu: " + appointmentDate + " Saat " + appointmentTime + " · ₺" + currentReservation.price.toLocaleString("tr-TR") + " · " + name + " " + surname + " (" + phone + ")",
                                pcler: currentReservation.pcs,
                                kampanya: currentReservation.package,
                                sure: currentReservation.duration,
                                randevuTarihi: appointmentDate,
                                randevuSaati: appointmentTime,
                                tutar: currentReservation.price,
                                musteri: name + " " + surname,
                                telefon: phone
                            });

                            // Seçilen masaları geçici rezerve durumuna al
                            if (Array.isArray(currentReservation.pcs)) {
                                currentReservation.pcs.forEach(function (pcName) {
                                    const pcId = pcData.idCikar(pcName);
                                    if (pcId !== null) {
                                        pcData.tekDurumGuncelle(pcId, pcData.DURUM.REZERVE);
                                    }
                                });
                            }
                        }

                        // Sunucu API'sine de gönder
                        try {
                            fetch("/api/reservations", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    musteriAdi: name + " " + surname,
                                    telefon: phone,
                                    masaId: (currentReservation.pcs || []).join(", "),
                                    masaIsim: (currentReservation.pcs || []).join(", ") + " (" + currentReservation.package + ")",
                                    kategori: currentReservation.package.toLowerCase().includes("60") ? "sari" : currentReservation.package.toLowerCase().includes("70") ? "mavi" : "yesil",
                                    tarih: appointmentDate,
                                    saat: appointmentTime,
                                    sure: currentReservation.duration.includes("Gün") ? 12 : 5,
                                    toplamTutar: currentReservation.price,
                                    odemeYontemi: (cardPayment && cardPayment.checked) ? "kart" : "nakit"
                                })
                            }).catch(function () {});
                        } catch (e) {}

                        alert("✅ Rezervasyon Talebiniz Alındı!\n\nSeçilen Masalar: " + (currentReservation.pcs ? currentReservation.pcs.join(", ") : "-") + "\nPaket: " + currentReservation.package + "\nTarife: " + currentReservation.duration + "\nRandevu Saati: " + appointmentDate + " Saat " + appointmentTime + "\nTutar: ₺" + currentReservation.price.toLocaleString("tr-TR") + "\n\nİşletmemize geldiğinizde adınızı belirterek masanıza geçebilirsiniz.");

                        // Seçimleri sıfırla
                        document.querySelectorAll(".comp.secili").forEach(function (c) { c.classList.remove("secili"); });
                        document.querySelectorAll(".fiyat.secili").forEach(function (f) { f.classList.remove("secili"); });
                        document.querySelectorAll(".kampanya-kartlari .kart").forEach(function (k) {
                            k.dispatchEvent(new Event("forzaYenidenHesapla"));
                        });

                        closeModal();
                        currentReservation = null;
                    }, 900);
                });
            }
        }());


        /* =====================================================
           8. SCROLL REVEAL (ZARİF SAYFA ANİMASYONLARI)
        ===================================================== */
        (function initScrollReveal() {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const targets = document.querySelectorAll(
                ".about-hero, .about-info, .fotogaleri, .kampanya-kartlari .kart"
            );

            if (!targets.length || !("IntersectionObserver" in window)) return;

            targets.forEach(function (el) {
                el.style.opacity = "0";
                el.style.transform = "translateY(24px)";
                el.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            });

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

            targets.forEach(function (el) {
                observer.observe(el);
            });
        }());

    });
}());