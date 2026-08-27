/* =========================================================
   FORZA ADMIN PANEL — CONTROLLER ENGINE
   admin.js (Stabilized, single-scope, clean architecture)
   ========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* =========================================================
           1. ADMIN GİRİŞ KONTROLÜ (giriş.html)
        ========================================================= */
        const loginForm = document.getElementById("loginForm");

        if (loginForm) {
            const usernameInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");
            const message = document.getElementById("message");

            loginForm.addEventListener("submit", function (event) {
                event.preventDefault();

                const username = usernameInput ? usernameInput.value.trim() : "";
                const password = passwordInput ? passwordInput.value : "";

                let DOGRU_KULLANICI = "admin";
                let DOGRU_SIFRE = "1234";

                const kayitliAyarlar = localStorage.getItem("forzaAyarlar");
                if (kayitliAyarlar) {
                    try {
                        const ayarData = JSON.parse(kayitliAyarlar);
                        if (ayarData.adminUser) DOGRU_KULLANICI = ayarData.adminUser;
                        if (ayarData.adminPass) DOGRU_SIFRE = ayarData.adminPass;
                    } catch (e) {
                        console.error("Giriş ayarları okunamadı:", e);
                    }
                }

                if (username === DOGRU_KULLANICI && password === DOGRU_SIFRE) {
                    if (message) {
                        message.textContent = "Giriş başarılı! Yönlendiriliyorsunuz...";
                        message.style.color = "#10b981";
                    }
                    sessionStorage.setItem("forzaAdminGiris", "true");
                    setTimeout(function () {
                        window.location.href = "panel.html";
                    }, 400);
                } else {
                    if (message) {
                        message.textContent = "Kullanıcı adı veya şifre hatalı!";
                        message.style.color = "#f43f5e";
                    }
                    if (passwordInput) {
                        passwordInput.value = "";
                        passwordInput.focus();
                    }
                }
            });

            // =========================================================
            // E-POSTA İLE ŞİFRE SIFIRLAMA / UNUTTUM İŞLEMLERİ
            // =========================================================
            const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
            const forgotPasswordModal = document.getElementById("forgotPasswordModal");
            const closeForgotModal = document.getElementById("closeForgotModal");
            const sendResetCodeBtn = document.getElementById("sendResetCodeBtn");
            const confirmResetPassBtn = document.getElementById("confirmResetPassBtn");
            const forgotEmailInput = document.getElementById("forgotEmailInput");
            const verificationCodeInput = document.getElementById("verificationCodeInput");
            const resetNewPassInput = document.getElementById("resetNewPassInput");
            const resetConfirmPassInput = document.getElementById("resetConfirmPassInput");
            const forgotMessage = document.getElementById("forgotMessage");
            const forgotStep1 = document.getElementById("forgotStep1");
            const forgotStep2 = document.getElementById("forgotStep2");

            let uretilenKod = null;
            let dogrulananEmail = null;

            function modalAc() {
                if (forgotPasswordModal) forgotPasswordModal.style.display = "flex";
                if (forgotStep1) forgotStep1.style.display = "block";
                if (forgotStep2) forgotStep2.style.display = "none";
                if (forgotMessage) forgotMessage.textContent = "";
                if (forgotEmailInput) forgotEmailInput.value = "";
                if (verificationCodeInput) verificationCodeInput.value = "";
                if (resetNewPassInput) resetNewPassInput.value = "";
                if (resetConfirmPassInput) resetConfirmPassInput.value = "";
            }

            function modalKapat() {
                if (forgotPasswordModal) forgotPasswordModal.style.display = "none";
            }

            if (forgotPasswordBtn) forgotPasswordBtn.addEventListener("click", modalAc);
            if (closeForgotModal) closeForgotModal.addEventListener("click", modalKapat);

            if (forgotPasswordModal) {
                forgotPasswordModal.addEventListener("click", function (e) {
                    if (e.target === forgotPasswordModal) modalKapat();
                });
            }

            // 1. Aşama: E-Posta veya Telefon Kontrolü ve 6 Haneli Kod Gönderimi
            if (sendResetCodeBtn) {
                sendResetCodeBtn.addEventListener("click", function () {
                    const girilenGirdi = forgotEmailInput ? forgotEmailInput.value.trim().toLowerCase() : "";

                    if (!girilenGirdi || girilenGirdi.length < 4) {
                        if (forgotMessage) {
                            forgotMessage.textContent = "Lütfen kayıtlı e-posta adresinizi veya telefon numaranızı girin.";
                            forgotMessage.style.color = "#f43f5e";
                        }
                        return;
                    }

                    // Kayıtlı admin bilgilerini al
                    let kayitliEmail = "admin@forzagaming.com";
                    let kayitliTelefon = "0546 465 96 93";
                    let kayitliUser = "admin";

                    try {
                        const raw = localStorage.getItem("forzaAyarlar");
                        if (raw) {
                            const data = JSON.parse(raw);
                            if (data.adminEmail) kayitliEmail = data.adminEmail.toLowerCase();
                            if (data.cafePhone) kayitliTelefon = data.cafePhone;
                            if (data.adminUser) kayitliUser = data.adminUser;
                        }
                    } catch (e) {}

                    // Normalize phone (sadece rakamlar)
                    const normalizeInput = girilenGirdi.replace(/\D/g, "");
                    const normalizeKayitliTel = kayitliTelefon.replace(/\D/g, "");

                    const emailEslesiyor = (girilenGirdi === kayitliEmail || girilenGirdi === "admin@forzacafe.com" || girilenGirdi === "admin@forzagaming.com");
                    const telEslesiyor = normalizeInput.length >= 10 && (normalizeKayitliTel.includes(normalizeInput) || normalizeInput.includes("5464659693"));

                    if (!emailEslesiyor && !telEslesiyor) {
                        if (forgotMessage) {
                            forgotMessage.textContent = `Girdiğiniz bilgi kayıtlı değil! Kayıtlı: "${kayitliEmail}" veya "${kayitliTelefon}"`;
                            forgotMessage.style.color = "#f43f5e";
                        }
                        return;
                    }

                    // 6 Haneli Güvenlik Kodu Üret
                    uretilenKod = Math.floor(100000 + Math.random() * 900000).toString();
                    dogrulananEmail = emailEslesiyor ? girilenGirdi : kayitliEmail;

                    if (forgotStep1) forgotStep1.style.display = "none";
                    if (forgotStep2) forgotStep2.style.display = "block";

                    // WhatsApp linkini bağla
                    const whatsappDirectBox = document.getElementById("whatsappDirectBox");
                    const whatsappSendLink = document.getElementById("whatsappSendLink");
                    if (whatsappDirectBox && whatsappSendLink) {
                        const hedefTel = "905464659693";
                        const waMesaj = encodeURIComponent(`*FORZA YÖNETİCİ ŞİFRE SIFIRLAMA*\nGüvenlik Kodunuz: ${uretilenKod}\nBu kodu girerek yeni şifrenizi belirleyebilirsiniz.`);
                        whatsappSendLink.href = `https://wa.me/${hedefTel}?text=${waMesaj}`;
                        whatsappDirectBox.style.display = "block";
                    }

                    if (forgotMessage) {
                        forgotMessage.innerHTML = `✅ 6 haneli güvenlik kodunuz üretildi.<br><span style="color: var(--cream-gold); font-size: 14px; font-weight: 800; display: inline-block; margin-top: 6px;">[ Güvenlik Kodu: ${uretilenKod} ]</span>`;
                        forgotMessage.style.color = "#10b981";
                    }

                    if (verificationCodeInput) verificationCodeInput.focus();
                });
            }

            // 2. Aşama: Kod Doğrulama ve Yeni Şifreyi Kaydetme
            if (confirmResetPassBtn) {
                confirmResetPassBtn.addEventListener("click", function () {
                    const girilenKod = verificationCodeInput ? verificationCodeInput.value.trim() : "";
                    const yeniSifre = resetNewPassInput ? resetNewPassInput.value : "";
                    const tekrarSifre = resetConfirmPassInput ? resetConfirmPassInput.value : "";

                    if (!girilenKod || girilenKod !== uretilenKod) {
                        if (forgotMessage) {
                            forgotMessage.textContent = "Hatalı güvenlik kodu! Lütfen size verilen 6 haneli kodu girin.";
                            forgotMessage.style.color = "#f43f5e";
                        }
                        return;
                    }

                    if (yeniSifre.length < 3) {
                        if (forgotMessage) {
                            forgotMessage.textContent = "Yeni şifre en az 3 karakter olmalıdır.";
                            forgotMessage.style.color = "#f59e0b";
                        }
                        return;
                    }

                    if (yeniSifre !== tekrarSifre) {
                        if (forgotMessage) {
                            forgotMessage.textContent = "Yeni şifreler birbiriyle uyuşmuyor.";
                            forgotMessage.style.color = "#f43f5e";
                        }
                        return;
                    }

                    // Yeni Şifreyi Kaydet & 6 Aylık Şifre Sayacını Sıfırla
                    let kayitliAyarData = {
                        adminUser: "admin",
                        adminPass: yeniSifre,
                        adminEmail: dogrulananEmail,
                        cafeName: "Forza İnternet & Cafe",
                        cafePhone: "0546 465 96 93",
                        sifreSonDegismeTarihi: new Date().toISOString()
                    };

                    try {
                        const raw = localStorage.getItem("forzaAyarlar");
                        if (raw) {
                            kayitliAyarData = Object.assign(kayitliAyarData, JSON.parse(raw));
                        }
                    } catch (e) {}

                    kayitliAyarData.adminPass = yeniSifre;
                    kayitliAyarData.adminEmail = dogrulananEmail;
                    kayitliAyarData.sifreSonDegismeTarihi = new Date().toISOString();
                    kayitliAyarData.guncellendi = new Date().toISOString();

                    localStorage.setItem("forzaAyarlar", JSON.stringify(kayitliAyarData));

                    if (forgotMessage) {
                        forgotMessage.textContent = "🎉 Şifreniz başarıyla güncellendi! Giriş yapılıyor...";
                        forgotMessage.style.color = "#10b981";
                    }

                    setTimeout(function () {
                        modalKapat();
                        if (usernameInput) usernameInput.value = kayitliAyarData.adminUser || "admin";
                        if (passwordInput) {
                            passwordInput.value = yeniSifre;
                            passwordInput.focus();
                        }
                        if (message) {
                            message.textContent = "Şifreniz güncellendi. Giriş yapabilirsiniz.";
                            message.style.color = "#10b981";
                        }
                    }, 1200);
                });
            }

            return; // Giriş sayfasında diğer panel kodları çalışmaz
        }

        /* =========================================================
           2. GÜVENLİ YÖNETİCİ OTURUM DOĞRULAMASI
        ========================================================= */
        const isAdminLoggedIn = sessionStorage.getItem("forzaAdminGiris") === "true";
        if (!isAdminLoggedIn) {
            // Yetkisiz kullanıcı paneli veya fotoğraf yöneticisini açamaz
            window.location.href = "giris.html";
            return;
        }

        /* =========================================================
           3. ADMIN PANEL ARAYÜZÜ & SIDEBAR KONTROLÜ
        ========================================================= */
        const sidebar = document.querySelector(".sidebar");
        const sidebarToggle = document.getElementById("sidebarToggle");
        const sidebarBackdrop = document.getElementById("sidebarBackdrop");
        const menuItems = document.querySelectorAll(".menu-item:not(.logout), .ios-tab-item");

        const notificationButton = document.getElementById("notificationBtn") || document.querySelector(".notification-btn");
        const notificationCount = document.getElementById("notificationCount") || document.querySelector(".notification-count");
        const notificationDropdown = document.getElementById("notificationDropdown");
        const notificationList = document.getElementById("notificationList");
        const notificationEmpty = document.getElementById("notificationEmpty");
        const notificationClearBtn = document.getElementById("notificationClearBtn");

        const searchInput = document.getElementById("panelSearch");
        const searchDropdown = document.getElementById("searchResultsDropdown");
        const computerGrid = document.getElementById("computerStatusGrid");
        const computerEmptyState = document.getElementById("computerEmptyState");
        const computerMoreLink = document.getElementById("computerMoreLink");
        const filterTabs = document.querySelectorAll(".computer-filter-tabs .filter-tab");

        const statToplamPc = document.getElementById("statToplamPc");
        const statAktifPc = document.getElementById("statAktifPc");
        const statBosPc = document.getElementById("statBosPc");

        const pcData = window.ForzaPcData;

        let aktifKategori = "tumu";
        let aramaSorgusu = "";

        // Sidebar Aç / Kapat
        function openSidebar() {
            if (sidebar) sidebar.classList.add("active");
            if (sidebarBackdrop) sidebarBackdrop.classList.add("active");
            if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "true");
        }

        function closeSidebar() {
            if (sidebar) sidebar.classList.remove("active");
            if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
            if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "false");
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener("click", function () {
                if (sidebar && sidebar.classList.contains("active")) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });
        }

        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener("click", closeSidebar);
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeSidebar();
                if (notificationDropdown) notificationDropdown.classList.remove("visible");
                if (searchDropdown) searchDropdown.classList.remove("active");
            }
        });


        /* =========================================================
           3. TOAST BİLDİRİM & SES SİSTEMİ (Apple Studio Chime)
        ========================================================= */
        let globalAudioCtx = null;

        function getAudioContext() {
            if (!globalAudioCtx && typeof window !== "undefined") {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    globalAudioCtx = new AudioContextClass();
                }
            }
            if (globalAudioCtx && globalAudioCtx.state === "suspended") {
                globalAudioCtx.resume().catch(function () {});
            }
            return globalAudioCtx;
        }

        // Tarayıcı autoplay kilidini ilk kullanıcı etkileşiminde aç
        function unlockAudio() {
            getAudioContext();
        }
        document.addEventListener("click", unlockAudio, { passive: true });
        document.addEventListener("keydown", unlockAudio, { passive: true });
        document.addEventListener("touchstart", unlockAudio, { passive: true });

        function sesBildirimiCal() {
            // Ayarlardan ses kapatılmışsa çalma
            try {
                const rawAyar = localStorage.getItem("forzaAyarlar");
                if (rawAyar) {
                    const ayarObj = JSON.parse(rawAyar);
                    if (ayarObj.soundEnabled === false || ayarObj.sesBildirimi === false) {
                        return;
                    }
                }
            } catch (e) {}

            try {
                const ctx = getAudioContext();
                if (!ctx) return;

                const playTone = function (freq, start, dur, gainLevel) {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

                    gain.gain.setValueAtTime(0, ctx.currentTime + start);
                    gain.gain.linearRampToValueAtTime(gainLevel, ctx.currentTime + start + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(ctx.currentTime + start);
                    osc.stop(ctx.currentTime + start + dur + 0.05);
                };

                // Kristal Apple Studio Chime Sesi (3 Ton Akustik)
                playTone(659.25, 0, 0.35, 0.18);
                playTone(880.00, 0.10, 0.45, 0.22);
                playTone(1318.51, 0.20, 0.65, 0.15);
            } catch (e) {
                console.warn("Ses çalınamadı:", e);
            }
        }

        function toastKonteynirAl() {
            let container = document.getElementById("toastContainer");
            if (!container) {
                container = document.createElement("div");
                container.id = "toastContainer";
                document.body.appendChild(container);
            }
            return container;
        }

        function toastGoster(baslik, mesaj, tip, sesCal) {
            if (sesCal) sesBildirimiCal();
            const container = toastKonteynirAl();
            const toast = document.createElement("div");
            toast.className = "toast-item " + (tip || "basarili");

            const ikon = tip === "hata" ? "fa-circle-xmark" : tip === "uyari" ? "fa-triangle-exclamation" : "fa-circle-check";

            toast.innerHTML = `
                <i class="fa-solid ${ikon}" aria-hidden="true"></i>
                <div>
                    <strong style="display:block; margin-bottom:2px;">${baslik}</strong>
                    <span>${mesaj}</span>
                </div>
            `;

            container.appendChild(toast);
            requestAnimationFrame(function () { toast.classList.add("gorunur"); });

            setTimeout(function () {
                toast.classList.remove("gorunur");
                setTimeout(function () { toast.remove(); }, 350);
            }, 4000);
        }


        /* =========================================================
           4. BİLGİSAYAR DURUMLARI & GRID RENDER
        ========================================================= */
        function gridRender() {
            if (!computerGrid || !pcData) return;

            const durumlar = pcData.durumlariYukle();
            computerGrid.innerHTML = "";

            const limit = computerGrid.dataset.limit ? parseInt(computerGrid.dataset.limit, 10) : null;

            const eslesenler = pcData.PC_LISTESI.filter(function (pc) {
                const kategoriUyuyor = aktifKategori === "tumu" || pc.kategori === aktifKategori;
                const aramaUyuyor = aramaSorgusu === "" || pc.isim.toLocaleLowerCase("tr-TR").includes(aramaSorgusu);
                return kategoriUyuyor && aramaUyuyor;
            });

            const gosterilecekler = limit ? eslesenler.slice(0, limit) : eslesenler;

            gosterilecekler.forEach(function (pc) {
                const durum = durumlar[pc.id] || pcData.DURUM.BOS;
                const durumSinif = durum === pcData.DURUM.KULLANIMDA ? "busy" : durum === pcData.DURUM.REZERVE ? "reserved" : "available";

                const kart = document.createElement("div");
                kart.className = "computer-item " + durumSinif;
                kart.setAttribute("role", "button");
                kart.setAttribute("tabindex", "0");
                kart.dataset.id = pc.id;
                kart.dataset.kategori = pc.kategori;

                const numara = document.createElement("span");
                numara.className = "computer-number";
                numara.textContent = pc.isim;

                const durumEtiketi = document.createElement("span");
                durumEtiketi.className = "computer-status";
                durumEtiketi.textContent = durum.charAt(0).toUpperCase() + durum.slice(1);

                kart.appendChild(numara);
                kart.appendChild(durumEtiketi);

                function durumDegistir() {
                    const yeni = durum === pcData.DURUM.BOS ? pcData.DURUM.KULLANIMDA : durum === pcData.DURUM.KULLANIMDA ? pcData.DURUM.REZERVE : pcData.DURUM.BOS;
                    pcData.tekDurumGuncelle(pc.id, yeni);
                    try {
                        fetch("/api/computers", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: "pc-" + pc.id, durum: yeni === "kullanımda" ? "kullanimda" : yeni })
                        }).catch(function () {});
                    } catch (e) {}
                }

                kart.addEventListener("click", durumDegistir);
                kart.addEventListener("keydown", function (e) {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        durumDegistir();
                    }
                });

                computerGrid.appendChild(kart);
            });

            if (computerEmptyState) {
                computerEmptyState.classList.toggle("visible", gosterilecekler.length === 0);
            }

            if (computerMoreLink) {
                const kalan = eslesenler.length - gosterilecekler.length;
                if (kalan > 0) {
                    computerMoreLink.textContent = "+" + kalan + " bilgisayar daha — tümünü gör";
                    computerMoreLink.classList.add("visible");
                } else {
                    computerMoreLink.textContent = "";
                    computerMoreLink.classList.remove("visible");
                }
            }

            // İstatistikleri Güncelle
            if (statToplamPc) statToplamPc.textContent = pcData.PC_LISTESI.length;
            if (statAktifPc) {
                statAktifPc.textContent = pcData.PC_LISTESI.filter(p => (durumlar[p.id] === pcData.DURUM.KULLANIMDA)).length;
            }
            if (statBosPc) {
                statBosPc.textContent = pcData.PC_LISTESI.filter(p => (!durumlar[p.id] || durumlar[p.id] === pcData.DURUM.BOS)).length;
            }
        }

        // Filtre Sekmeleri
        function filtreSekmeEtiketleriniGuncelle() {
            if (!pcData || !pcData.fiyatlariYukle || !filterTabs.length) return;
            const fiyatlar = pcData.fiyatlariYukle();
            filterTabs.forEach(function (tab) {
                const kat = tab.dataset.kategori;
                if (kat && fiyatlar[kat]) {
                    const saatlik = fiyatlar[kat].bazSaatlik || (kat === "sari" ? 60 : kat === "mavi" ? 70 : 90);
                    tab.textContent = saatlik + " TL (" + (kat === "sari" ? "Standart" : kat === "mavi" ? "Pro" : "VIP") + ")";
                }
            });
        }

        if (filterTabs.length) {
            filterTabs.forEach(function (tab) {
                tab.addEventListener("click", function () {
                    filterTabs.forEach(t => t.classList.remove("active"));
                    tab.classList.add("active");
                    aktifKategori = tab.dataset.kategori || "tumu";
                    gridRender();
                });
            });
        }

        if (pcData && pcData.degisiklikleriDinle) {
            pcData.degisiklikleriDinle(function () {
                gridRender();
            });
        }

        if (pcData && pcData.fiyatDegisiklikleriDinle) {
            pcData.fiyatDegisiklikleriDinle(function () {
                filtreSekmeEtiketleriniGuncelle();
            });
        }

        filtreSekmeEtiketleriniGuncelle();
        gridRender();

        const saveAllComputersBtn = document.getElementById("saveAllComputersBtn");
        if (saveAllComputersBtn) {
            saveAllComputersBtn.addEventListener("click", async function () {
                const durumlar = pcData ? pcData.durumlariYukle() : {};
                const list = (pcData && pcData.PC_LISTESI) ? pcData.PC_LISTESI : [];

                const payload = list.map(function (pc) {
                    const st = durumlar[pc.id] || "boş";
                    const apiDurum = st === "kullanımda" ? "kullanimda" : st === "rezerve" ? "rezerve" : "bos";
                    return { id: "pc-" + pc.id, durum: apiDurum };
                });

                saveAllComputersBtn.disabled = true;
                saveAllComputersBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Veritabanına Yazılıyor...';

                try {
                    const res = await fetch("/api/computers", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ computers: payload })
                    });
                    const data = await res.json();
                    if (data && data.success) {
                        toastGoster("Veritabanına Kaydedildi", "Tüm masa durumları başarıyla veritabanına kaydedildi ve web sitesinde güncellendi.", "basari");
                    } else {
                        toastGoster("Kaydedildi", "Masa durumları güncellendi.", "bilgi");
                    }
                } catch (e) {
                    toastGoster("Bilgi", "Masa durumları yerel olarak kaydedildi.", "bilgi");
                } finally {
                    saveAllComputersBtn.disabled = false;
                    saveAllComputersBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Masaları Veritabanına Kaydet';
                }
            });
        }


        /* =========================================================
           5. CANLI VERİTABANI VE PANEL ARAMASI
        ========================================================= */
        if (searchInput) {
            const sampleUsers = [
                { isim: "Muhammet Kılıç", uyelik: "VIP Üye" },
                { isim: "Ahmet Yılmaz", uyelik: "Standart Üye" },
                { isim: "Mustafa Demir", uyelik: "Gold Espor Üyesi" },
                { isim: "Caner Şahin", uyelik: "Standart Üye" }
            ];

            searchInput.addEventListener("input", function () {
                aramaSorgusu = searchInput.value.trim().toLocaleLowerCase("tr-TR");
                gridRender();

                if (!searchDropdown) return;

                if (aramaSorgusu.length < 1) {
                    searchDropdown.classList.remove("active");
                    searchDropdown.innerHTML = "";
                    return;
                }

                searchDropdown.innerHTML = "";
                let toplamSonuc = 0;

                // 1. Bilgisayarlarda Ara
                if (pcData && pcData.PC_LISTESI) {
                    const eslesenPc = pcData.PC_LISTESI.filter(p => p.isim.toLocaleLowerCase("tr-TR").includes(aramaSorgusu));
                    if (eslesenPc.length > 0) {
                        const grup = document.createElement("div");
                        grup.className = "search-result-group";
                        grup.textContent = "Bilgisayarlar";
                        searchDropdown.appendChild(grup);

                        eslesenPc.forEach(pc => {
                            toplamSonuc++;
                            const item = document.createElement("a");
                            item.href = "bilgi.html";
                            item.className = "search-result-item";
                            item.innerHTML = `<span><i class="fa-solid fa-desktop" style="margin-right:8px; color:#ffd700;"></i>${pc.isim}</span> <small>${pc.kategori.toUpperCase()} Masa</small>`;
                            searchDropdown.appendChild(item);
                        });
                    }
                }

                // 2. Üyelerde Ara
                const eslesenUyeler = sampleUsers.filter(u => u.isim.toLocaleLowerCase("tr-TR").includes(aramaSorgusu));
                if (eslesenUyeler.length > 0) {
                    const grup = document.createElement("div");
                    grup.className = "search-result-group";
                    grup.textContent = "Kayıtlı Üyeler";
                    searchDropdown.appendChild(grup);

                    eslesenUyeler.forEach(u => {
                        toplamSonuc++;
                        const item = document.createElement("div");
                        item.className = "search-result-item";
                        item.innerHTML = `<span><i class="fa-solid fa-user" style="margin-right:8px; color:#10b981;"></i>${u.isim}</span> <small>${u.uyelik}</small>`;
                        searchDropdown.appendChild(item);
                    });
                }

                // 3. Rezervasyonlarda Ara
                if (pcData && pcData.bildirimleriYukle) {
                    const bildirimler = pcData.bildirimleriYukle();
                    const eslesenRez = bildirimler.filter(b => (b.baslik || "").toLocaleLowerCase("tr-TR").includes(aramaSorgusu) || (b.mesaj || "").toLocaleLowerCase("tr-TR").includes(aramaSorgusu));

                    if (eslesenRez.length > 0) {
                        const grup = document.createElement("div");
                        grup.className = "search-result-group";
                        grup.textContent = "Rezervasyonlar";
                        searchDropdown.appendChild(grup);

                        eslesenRez.slice(0, 3).forEach(b => {
                            toplamSonuc++;
                            const item = document.createElement("a");
                            item.href = "rezervasyon.html?highlight=" + encodeURIComponent(b.id);
                            item.className = "search-result-item";
                            item.innerHTML = `<span><i class="fa-solid fa-calendar-check" style="margin-right:8px; color:#0ea5e9;"></i>${b.baslik}</span> <small>İncele</small>`;
                            searchDropdown.appendChild(item);
                        });
                    }
                }

                if (toplamSonuc === 0) {
                    searchDropdown.innerHTML = `<div class="search-no-result">"${aramaSorgusu}" için sonuç bulunamadı.</div>`;
                }

                searchDropdown.classList.add("active");
            });

            document.addEventListener("click", function (e) {
                if (!searchInput.contains(e.target) && searchDropdown && !searchDropdown.contains(e.target)) {
                    searchDropdown.classList.remove("active");
                }
            });
        }


        /* =========================================================
           6. BİLDİRİM TEPSİSİ & YÖNETİMİ
        ========================================================= */
        function goreliZaman(tarihMetni) {
            if (!tarihMetni) return "";
            const tarih = new Date(tarihMetni);
            if (isNaN(tarih.getTime())) return "";
            const saniye = Math.round((Date.now() - tarih.getTime()) / 1000);

            if (saniye < 60) return "az önce";
            if (saniye < 3600) return Math.floor(saniye / 60) + " dk önce";
            if (saniye < 86400) return Math.floor(saniye / 3600) + " sa önce";
            return Math.floor(saniye / 86400) + " gün önce";
        }

        function bildirimListesiniRenderla() {
            if (!pcData || !pcData.bildirimleriYukle) return;
            const bildirimler = pcData.bildirimleriYukle();
            const okunmamis = bildirimler.filter(b => !b.okundu).length;

            if (notificationCount) {
                if (okunmamis > 0) {
                    notificationCount.textContent = okunmamis > 99 ? "99+" : String(okunmamis);
                    notificationCount.style.display = "flex";
                } else {
                    notificationCount.style.display = "none";
                }
            }

            if (notificationList) {
                notificationList.innerHTML = "";
                bildirimler.slice(0, 15).forEach(function (b) {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "notification-item" + (b.okundu ? "" : " unread");

                    btn.innerHTML = `
                        <span class="notification-item-icon"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i></span>
                        <span class="notification-item-body">
                            <strong>${b.baslik || 'Bildirim'}</strong>
                            <span class="notification-item-mesaj">${b.mesaj || ''}</span>
                            <span class="notification-item-zaman">${goreliZaman(b.tarih)}</span>
                        </span>
                    `;

                    btn.addEventListener("click", function () {
                        pcData.bildirimOkunduIsaretle(b.id);
                        if (notificationDropdown) notificationDropdown.classList.remove("visible");
                        window.location.href = "rezervasyon.html?highlight=" + encodeURIComponent(b.id);
                    });

                    notificationList.appendChild(btn);
                });

                if (notificationEmpty) {
                    notificationEmpty.classList.toggle("visible", bildirimler.length === 0);
                }
            }
        }

        if (notificationButton && notificationDropdown) {
            notificationButton.addEventListener("click", function (e) {
                e.stopPropagation();
                notificationDropdown.classList.toggle("visible");
            });

            document.addEventListener("click", function (e) {
                if (!notificationDropdown.contains(e.target) && !notificationButton.contains(e.target)) {
                    notificationDropdown.classList.remove("visible");
                }
            });
        }

        if (notificationClearBtn && pcData && pcData.tumBildirimleriOkunduIsaretle) {
            notificationClearBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                pcData.tumBildirimleriOkunduIsaretle();
            });
        }

        const bilinenBildirimIdleri = new Set();
        let ilkYuklemeTamamlandi = false;

        function bildirimleriIsleVeGuncelle(tumBildirimler) {
            const yeniListe = Array.isArray(tumBildirimler) ? tumBildirimler : (pcData && pcData.bildirimleriYukle ? pcData.bildirimleriYukle() : []);

            if (ilkYuklemeTamamlandi) {
                const yeniGelenler = yeniListe.filter(function (b) {
                    return b && b.id && !bilinenBildirimIdleri.has(b.id);
                });

                if (yeniGelenler.length > 0) {
                    const enYeni = yeniGelenler[0];
                    sesBildirimiCal();
                    toastGoster(enYeni.baslik || "Yeni Rezervasyon Geldi!", enYeni.mesaj || "Rezervasyon talebi iletildi.", "basarili", false);
                }
            }

            yeniListe.forEach(function (b) {
                if (b && b.id) bilinenBildirimIdleri.add(b.id);
            });

            ilkYuklemeTamamlandi = true;
            bildirimListesiniRenderla();
            if (typeof gridRender === "function") gridRender();
            if (typeof renderDashboardReservations === "function") renderDashboardReservations();
            if (typeof renderFullReservations === "function") renderFullReservations();
        }

        // İlk yüklemede mevcut bildirimleri kaydet (ses çalmaz)
        const mevcutBildirimler = pcData && pcData.bildirimleriYukle ? pcData.bildirimleriYukle() : [];
        mevcutBildirimler.forEach(function (b) {
            if (b && b.id) bilinenBildirimIdleri.add(b.id);
        });
        ilkYuklemeTamamlandi = true;

        if (pcData && pcData.bildirimDegisiklikleriDinle) {
            pcData.bildirimDegisiklikleriDinle(function (tum) {
                bildirimleriIsleVeGuncelle(tum);
            });
        }

        // Periyodik Senkronizasyon (Her 5 sn)
        setInterval(function () {
            bildirimleriIsleVeGuncelle();
        }, 5000);

        bildirimListesiniRenderla();


        /* =========================================================
           7. REZERVASYON ONAY / RED SİSTEMİ (rezervasyon.html & panel.html)
        ========================================================= */
        function rezervasyonDurumBelirle(bildirim) {
            const durum = (bildirim.durum || bildirim.tur || "").toLowerCase();
            if (durum === "confirmed" || durum === "onaylandi" || durum === "basarili") {
                return { etiket: "Onaylandı", sinif: "confirmed" };
            }
            if (durum === "rejected" || durum === "iptal" || durum === "hata") {
                return { etiket: "Reddedildi", sinif: "rejected" };
            }
            return { etiket: "Bekliyor", sinif: "pending" };
        }

        function rezervasyonKartiOlustur(bildirim) {
            const satir = document.createElement("div");
            satir.className = "reservation-item";
            satir.dataset.id = bildirim.id;

            const durumInfo = rezervasyonDurumBelirle(bildirim);
            const isPending = durumInfo.sinif === "pending";

            const pcText = Array.isArray(bildirim.pcler) && bildirim.pcler.length ? bildirim.pcler.join(", ") : (bildirim.baslik || "Rezervasyon");
            const musteriText = bildirim.musteri || "";
            const telefonText = bildirim.telefon || "";
            const sureText = bildirim.sure || "";
            const tutarText = bildirim.tutar ? `₺${Number(bildirim.tutar).toLocaleString("tr-TR")}` : "";
            const zamanText = goreliZaman(bildirim.tarih);

            satir.innerHTML = `
                <div class="reservation-icon"><i class="fa-solid fa-desktop" aria-hidden="true"></i></div>
                <div class="reservation-info">
                    <div class="res-card-top">
                        <strong class="res-pc-name">${pcText}</strong>
                        ${tutarText ? `<span class="res-price-pill">${tutarText}</span>` : ''}
                    </div>
                    <div class="res-card-meta">
                        ${musteriText ? `<span class="res-meta-item"><i class="fa-solid fa-user"></i> ${musteriText}</span>` : ''}
                        ${telefonText ? `<span class="res-meta-item"><i class="fa-solid fa-phone"></i> ${telefonText}</span>` : ''}
                        ${sureText ? `<span class="res-meta-item"><i class="fa-solid fa-clock"></i> ${sureText}</span>` : ''}
                        <span class="res-meta-item res-time"><i class="fa-solid fa-hourglass-half"></i> ${zamanText}</span>
                    </div>
                </div>
            `;

            if (isPending) {
                const actions = document.createElement("div");
                actions.className = "reservation-actions";

                const approveBtn = document.createElement("button");
                approveBtn.type = "button";
                approveBtn.className = "res-btn res-btn-approve";
                approveBtn.title = "Rezervasyonu Onayla";
                approveBtn.innerHTML = '<i class="fa-solid fa-check"></i>';

                const rejectBtn = document.createElement("button");
                rejectBtn.type = "button";
                rejectBtn.className = "res-btn res-btn-reject";
                rejectBtn.title = "Rezervasyonu Reddet";
                rejectBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

                approveBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    if (!pcData) return;

                    const tum = pcData.bildirimleriYukle();
                    const idx = tum.findIndex(b => b.id === bildirim.id);
                    if (idx !== -1) {
                        tum[idx].durum = "confirmed";
                        tum[idx].tur = "onaylandi";
                        tum[idx].okundu = true;
                        pcData.bildirimleriKaydet(tum);
                    }

                    // Masaları Kullanımda durumuna al
                    if (Array.isArray(bildirim.pcler)) {
                        bildirim.pcler.forEach(pcName => {
                            const id = pcData.idCikar(pcName);
                            if (id !== null) {
                                pcData.tekDurumGuncelle(id, pcData.DURUM.KULLANIMDA);
                                try {
                                    fetch("/api/computers", {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ id: "pc-" + id, durum: "kullanimda" })
                                    }).catch(function () {});
                                } catch (e) {}
                            }
                        });
                    }

                    try {
                        fetch("/api/reservations", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: bildirim.id, durum: "confirmed" })
                        }).catch(function () {});
                    } catch (e) {}

                    toastGoster("Rezervasyon Onaylandı", (bildirim.baslik || "Sipariş") + " onaylandı ve masalar aktifleştirildi.", "basarili");
                });

                rejectBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    if (!pcData) return;

                    const tum = pcData.bildirimleriYukle();
                    const idx = tum.findIndex(b => b.id === bildirim.id);
                    if (idx !== -1) {
                        tum[idx].durum = "rejected";
                        tum[idx].tur = "iptal";
                        tum[idx].okundu = true;
                        pcData.bildirimleriKaydet(tum);
                    }

                    // Masaları Boş durumuna geri al
                    if (Array.isArray(bildirim.pcler)) {
                        bildirim.pcler.forEach(pcName => {
                            const id = pcData.idCikar(pcName);
                            if (id !== null) {
                                pcData.tekDurumGuncelle(id, pcData.DURUM.BOS);
                                try {
                                    fetch("/api/computers", {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ id: "pc-" + id, durum: "bos" })
                                    }).catch(function () {});
                                } catch (e) {}
                            }
                        });
                    }

                    try {
                        fetch("/api/reservations", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: bildirim.id, durum: "rejected" })
                        }).catch(function () {});
                    } catch (e) {}

                    toastGoster("Rezervasyon Reddedildi", (bildirim.baslik || "Sipariş") + " iptal edildi.", "hata");
                });

                actions.appendChild(approveBtn);
                actions.appendChild(rejectBtn);
                satir.appendChild(actions);
            } else {
                const statusTag = document.createElement("span");
                statusTag.className = "reservation-status " + durumInfo.sinif;
                statusTag.textContent = durumInfo.etiket;
                satir.appendChild(statusTag);
            }

            return satir;
        }

        // Panel Anasayfa "Son Rezervasyonlar" widget'ı
        const dashboardResList = document.querySelector(".dashboard-content .reservation-list");
        const resEmpty = document.getElementById("reservationEmptyState");
        if (dashboardResList && pcData) {
            function renderDashboardReservations() {
                const bildirimler = pcData.bildirimleriYukle().slice(0, 6);
                dashboardResList.innerHTML = "";
                if (resEmpty) {
                    resEmpty.classList.toggle("visible", bildirimler.length === 0);
                }
                bildirimler.forEach(b => {
                    dashboardResList.appendChild(rezervasyonKartiOlustur(b));
                });
            }
            renderDashboardReservations();
            pcData.bildirimDegisiklikleriDinle(renderDashboardReservations);
        }

        // rezervasyon.html Tam Liste
        const fullResList = document.getElementById("reservationsFullList");
        if (fullResList && pcData) {
            const resTabs = document.querySelectorAll("#reservationFilterTabs .filter-tab");
            const markAllBtn = document.getElementById("markAllReservationsRead");
            let aktifResFiltre = "tumu";

            const urlParams = new URLSearchParams(window.location.search);
            const highlightId = urlParams.get("highlight");

            function renderFullReservations() {
                const tumu = pcData.bildirimleriYukle();
                const filtrelenmis = aktifResFiltre === "tumu" 
                    ? tumu 
                    : tumu.filter(b => rezervasyonDurumBelirle(b).sinif === aktifResFiltre);

                fullResList.innerHTML = "";

                filtrelenmis.forEach(b => {
                    const kart = rezervasyonKartiOlustur(b);
                    if (b.id === highlightId) {
                        kart.classList.add("highlight");
                        setTimeout(() => { kart.scrollIntoView({ behavior: "smooth", block: "center" }); }, 200);
                    }
                    fullResList.appendChild(kart);
                });

                // İstatistikleri Güncelle
                const statToplam = document.getElementById("statToplamRezervasyon");
                const statOnay = document.getElementById("statOnaylananRezervasyon");
                const statBekleyen = document.getElementById("statBekleyenRezervasyon");

                if (statToplam) statToplam.textContent = tumu.length;
                if (statOnay) statOnay.textContent = tumu.filter(b => rezervasyonDurumBelirle(b).sinif === "confirmed").length;
                if (statBekleyen) statBekleyen.textContent = tumu.filter(b => rezervasyonDurumBelirle(b).sinif === "pending").length;
            }

            resTabs.forEach(tab => {
                tab.addEventListener("click", function () {
                    resTabs.forEach(t => t.classList.remove("active"));
                    tab.classList.add("active");
                    aktifResFiltre = tab.dataset.durum || "tumu";
                    renderFullReservations();
                });
            });

            if (markAllBtn && pcData.tumBildirimleriOkunduIsaretle) {
                markAllBtn.addEventListener("click", function () {
                    pcData.tumBildirimleriOkunduIsaretle();
                    toastGoster("Başarılı", "Tüm rezervasyonlar okundu olarak işaretlendi.", "basarili");
                });
            }

            renderFullReservations();
            pcData.bildirimDegisiklikleriDinle(renderFullReservations);
        }


        /* =========================================================
           8. SİSTEM AYARLARI (panel.html #ayarlar)
        ========================================================= */
        /* =========================================================
           8. SİSTEM AYARLARI & YÖNETİCİ PROFİLİ (panel.html #ayarlar)
        ========================================================= */
        const menuHome = document.getElementById("menuHome");
        const menuSettings = document.getElementById("menuSettings");
        const dashboardSection = document.getElementById("dashboardSection");
        const settingsSection = document.getElementById("settingsSection");
        const saveSettingsBtn = document.getElementById("saveSettingsBtn");

        const avatarPreviewBox = document.getElementById("avatarPreviewBox");
        const avatarFileInput = document.getElementById("avatarFileInput");
        const avatarRemoveBtn = document.getElementById("avatarRemoveBtn");

        let taslakAdminAvatar = null;

        // Tüm Sayfalardaki Başlık Avatarını Güncelle
        function globalAvatarGuncelle() {
            let avatarSrc = null;
            try {
                const raw = localStorage.getItem("forzaAyarlar");
                if (raw) {
                    const data = JSON.parse(raw);
                    if (data.adminAvatar) avatarSrc = data.adminAvatar;
                }
            } catch (e) {}

            const badges = document.querySelectorAll(".forza-logo-badge");
            badges.forEach(badge => {
                if (avatarSrc) {
                    badge.innerHTML = `<img src="${avatarSrc}" alt="Admin">`;
                    badge.style.padding = "0";
                } else {
                    badge.innerHTML = "F";
                    badge.style.padding = "";
                }
            });
        }

        // 6 Aylık Şifre Geçerlilik ve Güvenlik Kontrolü
        function sifreGecerlilikKontrolu() {
            let sifreTarihi = null;
            try {
                const raw = localStorage.getItem("forzaAyarlar");
                if (raw) {
                    const data = JSON.parse(raw);
                    if (data.sifreSonDegismeTarihi) sifreTarihi = data.sifreSonDegismeTarihi;
                }
            } catch (e) {}

            if (!sifreTarihi) {
                sifreTarihi = new Date().toISOString();
                try {
                    let data = {};
                    const raw = localStorage.getItem("forzaAyarlar");
                    if (raw) data = JSON.parse(raw);
                    data.sifreSonDegismeTarihi = sifreTarihi;
                    localStorage.setItem("forzaAyarlar", JSON.stringify(data));
                } catch (e) {}
            }

            const gecenGun = Math.floor((Date.now() - new Date(sifreTarihi).getTime()) / (1000 * 60 * 60 * 24));
            const warningBox = document.getElementById("passwordExpiryWarning");
            const warningText = document.getElementById("passwordExpiryText");
            const ageText = document.getElementById("passwordAgeText");

            if (ageText) {
                ageText.textContent = `Şifre Güvenlik Durumu: ${gecenGun} gün önce değiştirildi (6 ayda bir zorunlu yenileme periyodu)`;
            }

            if (warningBox && warningText) {
                if (gecenGun >= 180) {
                    warningText.textContent = `Şifreniz ${gecenGun} gündür değiştirilmedi. 6 aylık güvenlik süreniz dolduğu için lütfen şifrenizi yenileyin!`;
                    warningBox.style.display = "flex";
                } else {
                    warningBox.style.display = "none";
                }
            }
        }

        // Kayıtlı Ayarları Form Elemanlarına Yükle
        function ayarlarFormunuDoldur() {
            let kayitliUser = "admin";
            let kayitliEmail = "admin@forzagaming.com";
            let kayitliCafe = "Forza İnternet & Cafe";
            let kayitliPhone = "0546 465 96 93";
            taslakAdminAvatar = null;

            try {
                const raw = localStorage.getItem("forzaAyarlar");
                if (raw) {
                    const data = JSON.parse(raw);
                    if (data.adminUser) kayitliUser = data.adminUser;
                    if (data.adminEmail) kayitliEmail = data.adminEmail;
                    if (data.cafeName) kayitliCafe = data.cafeName;
                    if (data.cafePhone) kayitliPhone = data.cafePhone;
                    if (data.adminAvatar) taslakAdminAvatar = data.adminAvatar;
                }
            } catch (e) {
                console.error("Ayarlar yüklenemedi:", e);
            }

            const userInput = document.getElementById("settingAdminUser");
            const emailInput = document.getElementById("settingAdminEmail");
            const cafeInput = document.getElementById("settingCafeName");
            const phoneInput = document.getElementById("settingCafePhone");

            if (userInput) userInput.value = kayitliUser;
            if (emailInput) emailInput.value = kayitliEmail;
            if (cafeInput) cafeInput.value = kayitliCafe;
            if (phoneInput) phoneInput.value = kayitliPhone;

            if (avatarPreviewBox) {
                if (taslakAdminAvatar) {
                    avatarPreviewBox.innerHTML = `<img src="${taslakAdminAvatar}" alt="Profil">`;
                } else {
                    avatarPreviewBox.innerHTML = "F";
                }
            }

            sifreGecerlilikKontrolu();
        }

        // Profil Fotoğrafı Yükleme (Dosya Seçimi)
        if (avatarFileInput) {
            avatarFileInput.addEventListener("change", function (e) {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (evt) {
                    taslakAdminAvatar = evt.target.result;
                    if (avatarPreviewBox) {
                        avatarPreviewBox.innerHTML = `<img src="${taslakAdminAvatar}" alt="Profil">`;
                    }
                    toastGoster(
                        "Profil Fotoğrafı Seçildi (Taslak)",
                        "Fotoğraf yüklendi. Kalıcı olması için 'Değişiklikleri Kaydet' butonuna basmalısınız.",
                        "uyari"
                    );
                };
                reader.readAsDataURL(file);
            });
        }

        // Profil Fotoğrafını Kaldır
        if (avatarRemoveBtn) {
            avatarRemoveBtn.addEventListener("click", function () {
                taslakAdminAvatar = null;
                if (avatarPreviewBox) avatarPreviewBox.innerHTML = "F";
                if (avatarFileInput) avatarFileInput.value = "";
                toastGoster(
                    "Profil Fotoğrafı Sıfırlandı (Taslak)",
                    "Varsayılan logoya dönüldü. Kalıcı olması için 'Değişiklikleri Kaydet' butonuna basmalısınız.",
                    "bilgi"
                );
            });
        }

        function checkSection() {
            const hash = window.location.hash;
            if (hash === "#ayarlar" && settingsSection && dashboardSection) {
                dashboardSection.style.display = "none";
                settingsSection.style.display = "block";
                menuItems.forEach(i => i.classList.remove("active"));
                if (menuSettings) menuSettings.classList.add("active");
                ayarlarFormunuDoldur();
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (dashboardSection && settingsSection) {
                dashboardSection.style.display = "block";
                settingsSection.style.display = "none";
                menuItems.forEach(i => i.classList.remove("active"));
                if (menuHome) menuHome.classList.add("active");
                sifreGecerlilikKontrolu();
            }
        }

        if (menuHome) {
            menuHome.addEventListener("click", function () {
                window.location.hash = "anasayfa";
                checkSection();
            });
        }

        if (menuSettings) {
            menuSettings.addEventListener("click", function () {
                window.location.hash = "ayarlar";
                checkSection();
            });
        }

        window.addEventListener("hashchange", checkSection);
        checkSection();
        globalAvatarGuncelle();
        sifreGecerlilikKontrolu();

        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener("click", function () {
                const userInput = document.getElementById("settingAdminUser");
                const emailInput = document.getElementById("settingAdminEmail");
                const oldPassInput = document.getElementById("settingAdminPassOld");
                const newPassInput = document.getElementById("settingAdminPassNew");
                const confirmPassInput = document.getElementById("settingAdminPassConfirm");
                const cafeInput = document.getElementById("settingCafeName");
                const phoneInput = document.getElementById("settingCafePhone");

                let aktifUser = "admin";
                let aktifEmail = "admin@forzagaming.com";
                let aktifPass = "1234";
                let mevcutSifreTarihi = new Date().toISOString();

                try {
                    const raw = localStorage.getItem("forzaAyarlar");
                    if (raw) {
                        const data = JSON.parse(raw);
                        if (data.adminUser) aktifUser = data.adminUser;
                        if (data.adminEmail) aktifEmail = data.adminEmail;
                        if (data.adminPass) aktifPass = data.adminPass;
                        if (data.sifreSonDegismeTarihi) mevcutSifreTarihi = data.sifreSonDegismeTarihi;
                    }
                } catch (e) {}

                const yeniUser = userInput ? userInput.value.trim() : aktifUser;
                const yeniEmail = emailInput ? emailInput.value.trim() : aktifEmail;
                const girilenOldPass = oldPassInput ? oldPassInput.value : "";
                const girilenNewPass = newPassInput ? newPassInput.value : "";
                const girilenConfirmPass = confirmPassInput ? confirmPassInput.value : "";

                if (!yeniUser) {
                    toastGoster("Hata", "Yönetici kullanıcı adı boş bırakılamaz.", "hata");
                    return;
                }

                let sonSifre = aktifPass;
                let sifreGuncellendiMi = false;

                // Kullanıcı şifreyi değiştirmek istiyorsa
                if (girilenNewPass !== "" || girilenOldPass !== "") {
                    if (girilenOldPass !== aktifPass) {
                        toastGoster("Hata", "Mevcut şifreniz hatalı! Lütfen doğru şifreyi girin.", "hata");
                        if (oldPassInput) oldPassInput.focus();
                        return;
                    }

                    if (girilenNewPass.length < 3) {
                        toastGoster("Hata", "Yeni şifre en az 3 karakter olmalıdır.", "uyari");
                        if (newPassInput) newPassInput.focus();
                        return;
                    }

                    if (girilenNewPass !== girilenConfirmPass) {
                        toastGoster("Hata", "Yeni şifre ile şifre tekrarı uyuşmuyor.", "hata");
                        if (confirmPassInput) confirmPassInput.focus();
                        return;
                    }

                    sonSifre = girilenNewPass;
                    sifreGuncellendiMi = true;
                }

                // 1. Ayarları, Profil Fotoğrafını, E-Postayı ve Galeri Taslağını Kalıcı Kaydet
                const yeniAyarData = {
                    adminUser: yeniUser,
                    adminEmail: yeniEmail || "admin@forzagaming.com",
                    adminPass: sonSifre,
                    adminAvatar: taslakAdminAvatar,
                    cafeName: cafeInput ? cafeInput.value.trim() : "Forza İnternet & Cafe",
                    cafePhone: phoneInput ? phoneInput.value.trim() : "0546 465 96 93",
                    sifreSonDegismeTarihi: sifreGuncellendiMi ? new Date().toISOString() : mevcutSifreTarihi,
                    guncellendi: new Date().toISOString()
                };

                localStorage.setItem("forzaAyarlar", JSON.stringify(yeniAyarData));

                // Galeri Taslağını Kalıcı Olarak Kaydet
                galeriFotograflariniKaydet(taslakGaleriFotograflari);
                renderDashboardGallery();
                renderAdminDraftGallery();
                globalAvatarGuncelle();
                sifreGecerlilikKontrolu();

                if (oldPassInput) oldPassInput.value = "";
                if (newPassInput) newPassInput.value = "";
                if (confirmPassInput) confirmPassInput.value = "";

                toastGoster(
                    "Tüm Değişiklikler Kaydedildi",
                    `Profil fotoğrafınız, galeri ve kullanıcı "${yeniUser}" ayarları başarıyla kaydedildi!`,
                    "basarili"
                );
            });
        }


        /* =========================================================
           9. HAKKIMIZDA FOTOĞRAF VE MEDYA YÖNETİCİSİ (TASLAK / KAYDET MODELLİ)
        ========================================================= */
        const galleryGrid = document.getElementById("adminMediaGalleryGrid");
        const galleryEmptyState = document.getElementById("galleryEmptyState");
        const galleryFileInput = document.getElementById("galleryFileInput");
        const galleryFileLabelText = document.getElementById("galleryFileLabelText");
        const galleryPhotoUrl = document.getElementById("galleryPhotoUrl");
        const galleryPhotoBadge = document.getElementById("galleryPhotoBadge");
        const galleryAddBtn = document.getElementById("galleryAddBtn");
        const dashboardGalleryGrid = document.getElementById("dashboardMediaGalleryGrid");

        const VARSAYILAN_FOTOGRAFLAR = [
            { id: "f1", src: "foto1.jpeg", badge: "Ana Salon", alt: "Forza Gaming Salonu" },
            { id: "f2", src: "foto2.jpeg", badge: "540 Hz Alan", alt: "540Hz Espor Alanı" },
            { id: "f3", src: "foto3.jpeg", badge: "Pro Setup", alt: "Pro Gaming Setup" },
            { id: "f4", src: "foto4.jpeg", badge: "VIP Lounge", alt: "VIP Oyuncu Alanı" },
            { id: "f5", src: "foto5.jpeg", badge: "Ekipman", alt: "Ekipman ve Konfor" },
            { id: "f6", src: "foto6.jpeg", badge: "Turnuva", alt: "Turnuva Masaları" }
        ];

        function galeriFotograflariniGetir() {
            try {
                const raw = localStorage.getItem("forzaGaleriFotograflar");
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed;
                    }
                }
            } catch (e) {
                console.error("Galeri fotoğrafları okunamadı:", e);
            }
            return VARSAYILAN_FOTOGRAFLAR;
        }

        function galeriFotograflariniKaydet(list) {
            localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(list));
        }

        // Taslak Galeri Listesi (Admin kaydet butonuna basana kadar bellekte tutulur)
        let taslakGaleriFotograflari = galeriFotograflariniGetir();

        // 1. Dashboard Önizleme Izgarasını Doldur (Yayındaki güncel fotoğraflar)
        function renderDashboardGallery() {
            if (!dashboardGalleryGrid) return;
            const yayindakiFotolar = galeriFotograflariniGetir();
            dashboardGalleryGrid.innerHTML = "";
            yayindakiFotolar.forEach(function (foto) {
                const item = document.createElement("div");
                item.className = "media-item";
                item.innerHTML = `
                    <img src="${foto.src}" alt="${foto.badge || 'Mekan Fotoğrafı'}" loading="lazy">
                    <span class="media-badge">${foto.badge || 'Mekan Fotoğrafı'}</span>
                `;
                dashboardGalleryGrid.appendChild(item);
            });
        }

        // 2. Ayarlar Düzenleme Izgarasını Doldur (Taslak Liste)
        function renderAdminDraftGallery() {
            if (!galleryGrid) return;
            galleryGrid.innerHTML = "";

            if (!taslakGaleriFotograflari || taslakGaleriFotograflari.length === 0) {
                if (galleryEmptyState) galleryEmptyState.classList.add("visible");
                return;
            }

            if (galleryEmptyState) galleryEmptyState.classList.remove("visible");

            taslakGaleriFotograflari.forEach(function (foto, index) {
                const item = document.createElement("div");
                item.className = "media-item";
                item.innerHTML = `
                    <img src="${foto.src}" alt="${foto.badge || 'Mekan Fotoğrafı'}" loading="lazy">
                    <span class="media-badge">${foto.badge || 'Mekan Fotoğrafı'}</span>
                    <button type="button" class="photo-delete-btn" title="Fotoğrafı Listeden Çıkart" data-id="${foto.id || index}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;

                const delBtn = item.querySelector(".photo-delete-btn");
                if (delBtn) {
                    delBtn.addEventListener("click", function (e) {
                        e.stopPropagation();
                        taslakFotografSil(foto.id || index, foto.badge);
                    });
                }

                galleryGrid.appendChild(item);
            });
        }

        function taslakFotografSil(idOrIndex, badge) {
            taslakGaleriFotograflari = taslakGaleriFotograflari.filter((f, idx) => f.id !== idOrIndex && idx !== idOrIndex);
            renderAdminDraftGallery();
            toastGoster(
                "Fotoğraf Listeden Çıkartıldı (Taslak)",
                `"${badge || 'Fotoğraf'}" çıkartıldı. Canlı sitede yayınlanması için yukarıdaki "Değişiklikleri Kaydet" butonuna basmalısınız.`,
                "uyari"
            );
        }

        let yuklenenGorselBase64 = null;

        if (galleryFileInput) {
            galleryFileInput.addEventListener("change", function (e) {
                const file = e.target.files && e.target.files[0];
                if (!file) return;

                if (galleryFileLabelText) {
                    galleryFileLabelText.textContent = file.name.length > 15 ? file.name.substring(0, 12) + "..." : file.name;
                }

                const reader = new FileReader();
                reader.onload = function (evt) {
                    yuklenenGorselBase64 = evt.target.result;
                    if (galleryPhotoUrl) {
                        galleryPhotoUrl.value = "";
                        galleryPhotoUrl.placeholder = "Dosya seçildi: " + file.name;
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        if (galleryAddBtn) {
            galleryAddBtn.addEventListener("click", function () {
                const urlVal = galleryPhotoUrl ? galleryPhotoUrl.value.trim() : "";
                const badgeVal = galleryPhotoBadge ? galleryPhotoBadge.value.trim() : "";

                const gorselKaynak = yuklenenGorselBase64 || urlVal;

                if (!gorselKaynak) {
                    toastGoster("Hata", "Lütfen bir fotoğraf dosyası seçin veya görsel linki/dosya adı girin.", "uyari");
                    return;
                }

                const yeniFoto = {
                    id: "foto_" + Date.now(),
                    src: gorselKaynak,
                    badge: badgeVal || "Mekan Fotoğrafı",
                    alt: badgeVal || "Forza İnternet & Cafe"
                };

                taslakGaleriFotograflari.push(yeniFoto);

                // Formu Sıfırla
                yuklenenGorselBase64 = null;
                if (galleryFileInput) galleryFileInput.value = "";
                if (galleryFileLabelText) galleryFileLabelText.textContent = "Dosya Seç";
                if (galleryPhotoUrl) {
                    galleryPhotoUrl.value = "";
                    galleryPhotoUrl.placeholder = "veya görsel URL'si / dosya adı (örn: foto1.jpeg)";
                }
                if (galleryPhotoBadge) galleryPhotoBadge.value = "";

                renderAdminDraftGallery();
                toastGoster(
                    "Fotoğraf Eklendi (Taslak)",
                    `"${yeniFoto.badge}" listeye eklendi. Canlı sitede yayınlamak için "Değişiklikleri Kaydet" butonuna basmalısınız.`,
                    "uyari"
                );
            });
        }

        renderDashboardGallery();
        renderAdminDraftGallery();

    });
}());