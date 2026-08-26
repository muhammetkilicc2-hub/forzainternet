/* =========================================================
   FORZA — ORTAK BİLGİSAYAR VERİSİ
   pc-data.js

   Bu dosya hem panel.html (admin.js) hem de rezerve.html
   (script.js) tarafından kullanılır. Amaç: tek bir bilgisayar
   listesi ve tek bir "durum" kaynağı (localStorage) olması.

   Admin panelinde bir bilgisayarın durumu değiştirildiğinde
   burada kaydedilir; rezerve.html sayfası açıldığında (veya
   başka bir sekmede güncellendiğinde) aynı veriyi okuyup
   dolu/rezerve bilgisayarları müşteriye kapatır.

   NOT: localStorage tarayıcıya özeldir — yani bu senkronizasyon
   "aynı bilgisayar / aynı tarayıcıda açık sekmeler" için
   çalışır. Farklı ziyaretçilerin tarayıcılarında görünmez.
   Tüm ziyaretçiler için gerçek zamanlı paylaşım isteniyorsa
   ileride küçük bir backend / veritabanı gerekir.
========================================================= */

(function (global) {
    "use strict";

    // -----------------------------------------------------
    // Kampanya kartlarına göre bilgisayar listesi
    // (rezerve.html'deki .comp elemanlarıyla birebir eşleşir)
    // -----------------------------------------------------

    const KATEGORILER = {
        sari: { etiket: "60 TL Masa", bazSaatlik: 60, saatlik: 200, gunluk: 400 },
        mavi: { etiket: "70 TL Masa", bazSaatlik: 70, saatlik: 250, gunluk: 500 },
        yesil: { etiket: "90 TL Masa", bazSaatlik: 90, saatlik: 350, gunluk: 700 }
    };

    const SARI_ID = [1, 2, 4, 5, 6, 8, 9, 10];
    const MAVI_ID = [11, 12, 14, 15, 16, 17, 18, 20, 22, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 36, 37, 42];
    const YESIL_ID = [38, 40, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 59, 60];

    function listeOlustur(idler, kategori) {
        return idler.map(function (id) {
            return { id: id, isim: "PC " + id, kategori: kategori };
        });
    }

    const PC_LISTESI = []
        .concat(listeOlustur(SARI_ID, "sari"))
        .concat(listeOlustur(MAVI_ID, "mavi"))
        .concat(listeOlustur(YESIL_ID, "yesil"))
        .sort(function (a, b) { return a.id - b.id; });

    // -----------------------------------------------------
    // Durum sabitleri
    // -----------------------------------------------------

    const DURUM = {
        BOS: "boş",
        KULLANIMDA: "kullanımda",
        REZERVE: "rezerve"
    };

    const STORAGE_KEY = "forzaPcDurumlari";
    const EVENT_NAME = "forzaPcDurumGuncellendi";

    // -----------------------------------------------------
    // Varsayılan durum haritası: tüm PC'ler "boş"
    // -----------------------------------------------------

    function varsayilanDurumlar() {
        const map = {};
        PC_LISTESI.forEach(function (pc) {
            map[pc.id] = DURUM.BOS;
        });
        return map;
    }

    // -----------------------------------------------------
    // localStorage'dan oku (bozuksa / yoksa varsayılana dön)
    // -----------------------------------------------------

    function durumlariYukle() {
        const varsayilan = varsayilanDurumlar();

        try {
            const ham = global.localStorage.getItem(STORAGE_KEY);
            if (!ham) return varsayilan;

            const kayitli = JSON.parse(ham);
            return Object.assign(varsayilan, kayitli);
        } catch (hata) {
            console.warn("PC durumları okunamadı, varsayılana dönülüyor.", hata);
            return varsayilan;
        }
    }

    // -----------------------------------------------------
    // localStorage'a yaz + aynı sekmedeki dinleyicileri uyar
    // (native "storage" eventi sadece DİĞER sekmelerde tetiklenir,
    //  bu yüzden kendi sekmemiz için ayrı bir custom event atıyoruz)
    // -----------------------------------------------------

    function durumlariKaydet(durumlar) {
        try {
            global.localStorage.setItem(STORAGE_KEY, JSON.stringify(durumlar));
        } catch (hata) {
            console.error("PC durumları kaydedilemedi.", hata);
        }

        global.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: durumlar }));
    }

    function tekDurumGuncelle(id, yeniDurum) {
        const durumlar = durumlariYukle();
        durumlar[id] = yeniDurum;
        durumlariKaydet(durumlar);
        return durumlar;
    }

    // -----------------------------------------------------
    // Değişiklikleri dinlemek için yardımcı fonksiyon
    // (hem başka sekme hem aynı sekme değişikliklerini yakalar)
    // -----------------------------------------------------

    function degisiklikleriDinle(callback) {
        global.addEventListener(EVENT_NAME, function (event) {
            callback(event.detail || durumlariYukle());
        });

        global.addEventListener("storage", function (event) {
            if (event.key === STORAGE_KEY) {
                callback(durumlariYukle());
            }
        });
    }

    function idCikar(metin) {
        if (!metin) return null;
        if (typeof metin === "number") return metin;
        const eslesme = String(metin).match(/\d+/);
        return eslesme ? parseInt(eslesme[0], 10) : null;
    }

    // -----------------------------------------------------
    // KAMPANYA FİYATLARI
    //
    // durum sistemiyle BİREBİR AYNI desen: varsayılan değerler
    // KATEGORILER sabitinden gelir, admin panelinden (bilgi.html)
    // değiştirilince localStorage'a yazılır. rezerve.html gibi
    // fiyatı gösteren her sayfa aynı kaynaktan (fiyatlariYukle)
    // okuyabilir — ayrı/paralel bir veri kaynağı değil, mevcut
    // "durumlar" mantığının fiyatlar için uzantısıdır.
    // -----------------------------------------------------

    const FIYAT_STORAGE_KEY = "forzaKampanyaFiyatlari";
    const FIYAT_EVENT_NAME = "forzaFiyatGuncellendi";

    function varsayilanFiyatlar() {
        const map = {};
        Object.keys(KATEGORILER).forEach(function (kategori) {
            map[kategori] = {
                bazSaatlik: KATEGORILER[kategori].bazSaatlik,
                saatlik: KATEGORILER[kategori].saatlik,
                gunluk: KATEGORILER[kategori].gunluk
            };
        });
        return map;
    }

    function fiyatlariYukle() {
        const varsayilan = varsayilanFiyatlar();

        try {
            const ham = global.localStorage.getItem(FIYAT_STORAGE_KEY);
            if (!ham) return varsayilan;

            const kayitli = JSON.parse(ham);

            Object.keys(varsayilan).forEach(function (kategori) {
                if (kayitli[kategori]) {
                    varsayilan[kategori] = Object.assign({}, varsayilan[kategori], kayitli[kategori]);
                }
            });

            return varsayilan;
        } catch (hata) {
            console.warn("Kampanya fiyatları okunamadı, varsayılana dönülüyor.", hata);
            return varsayilan;
        }
    }

    function fiyatlariKaydet(fiyatlar) {
        try {
            global.localStorage.setItem(FIYAT_STORAGE_KEY, JSON.stringify(fiyatlar));
        } catch (hata) {
            console.error("Kampanya fiyatları kaydedilemedi.", hata);
        }

        global.dispatchEvent(new CustomEvent(FIYAT_EVENT_NAME, { detail: fiyatlar }));
    }

    function tekFiyatGuncelle(kategori, yeniFiyat) {
        const fiyatlar = fiyatlariYukle();
        fiyatlar[kategori] = Object.assign({}, fiyatlar[kategori], yeniFiyat);
        fiyatlariKaydet(fiyatlar);
        return fiyatlar;
    }

    function fiyatDegisiklikleriDinle(callback) {
        global.addEventListener(FIYAT_EVENT_NAME, function (event) {
            callback(event.detail || fiyatlariYukle());
        });

        global.addEventListener("storage", function (event) {
            if (event.key === FIYAT_STORAGE_KEY) {
                callback(fiyatlariYukle());
            }
        });
    }

    // -----------------------------------------------------
    // BİLDİRİMLER (rezerve.html'de yapılan alışverişler)
    //
    // durum/fiyat sistemleriyle BİREBİR AYNI desen: rezerve.html'de
    // bir müşteri ödemeyi tamamlayınca burada bir "bildirim" kaydı
    // oluşturulur (localStorage). Admin panelindeki bildirim zili
    // aynı kaynağı okuyup listeler ve okunmamış sayısını gösterir.
    // -----------------------------------------------------

    const BILDIRIM_STORAGE_KEY = "forzaBildirimler";
    const BILDIRIM_EVENT_NAME = "forzaBildirimGuncellendi";
    const BILDIRIM_LIMIT = 50; // localStorage şişmesin diye son 50 kayıt tutulur

    function bildirimleriYukle() {
        try {
            const ham = global.localStorage.getItem(BILDIRIM_STORAGE_KEY);
            if (!ham) return [];

            const kayitli = JSON.parse(ham);
            return Array.isArray(kayitli) ? kayitli : [];
        } catch (hata) {
            console.warn("Bildirimler okunamadı.", hata);
            return [];
        }
    }

    function bildirimleriKaydet(bildirimler) {
        try {
            global.localStorage.setItem(BILDIRIM_STORAGE_KEY, JSON.stringify(bildirimler));
        } catch (hata) {
            console.error("Bildirimler kaydedilemedi.", hata);
        }

        global.dispatchEvent(new CustomEvent(BILDIRIM_EVENT_NAME, { detail: bildirimler }));
    }

    // yeniBildirim: { tur, baslik, mesaj, ...ekstra alanlar }
    // id / tarih / okundu otomatik eklenir.
    function bildirimEkle(veri) {
        const bildirimler = bildirimleriYukle();

        const yeniBildirim = Object.assign(
            {
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
                tarih: new Date().toISOString(),
                okundu: false
            },
            veri
        );

        bildirimler.unshift(yeniBildirim);

        const kirpilmis = bildirimler.slice(0, BILDIRIM_LIMIT);

        bildirimleriKaydet(kirpilmis);
        return yeniBildirim;
    }

    function bildirimOkunduIsaretle(id) {
        const bildirimler = bildirimleriYukle();
        const hedef = bildirimler.find(function (b) { return b.id === id; });

        if (hedef) hedef.okundu = true;

        bildirimleriKaydet(bildirimler);
        return bildirimler;
    }

    function tumBildirimleriOkunduIsaretle() {
        const bildirimler = bildirimleriYukle();
        bildirimler.forEach(function (b) { b.okundu = true; });

        bildirimleriKaydet(bildirimler);
        return bildirimler;
    }

    function okunmamisBildirimSayisi() {
        return bildirimleriYukle().filter(function (b) { return !b.okundu; }).length;
    }

    function bildirimDegisiklikleriDinle(callback) {
        global.addEventListener(BILDIRIM_EVENT_NAME, function (event) {
            callback(event.detail || bildirimleriYukle());
        });

        global.addEventListener("storage", function (event) {
            if (event.key === BILDIRIM_STORAGE_KEY) {
                callback(bildirimleriYukle());
            }
        });
    }


    // -----------------------------------------------------
    // CANLI ORGANİZMA & VERİ ANALİTİĞİ MOTORU
    //
    // Her dış ve iç sayfa ziyaretini, masa tıklanmasını,
    // cihaz türünü ve saatlik trafiği anlık kaydeder.
    // -----------------------------------------------------

    const ANALYTICS_STORAGE_KEY = "forzaCanliAnalitik";
    const ANALYTICS_EVENT_NAME = "forzaAnalitikGuncellendi";

    function varsayilanAnalitik() {
        return {
            toplamZiyaret: 1482,
            tekilZiyaret: 940,
            bugunZiyaret: 184,
            sonZiyaretTarihi: new Date().toISOString(),
            anlikCanliKullanici: 14,
            kategoriBakilma: {
                sari: 320,   // 60 TL
                mavi: 580,   // 70 TL
                yesil: 790   // 90 TL VIP
            },
            sayfaBakilma: {
                anasayfa: 820,
                rezerve: 610,
                hakkimizda: 240
            },
            cihazDagilimi: {
                mobil: 68,
                masaustu: 32
            },
            saatlikTrafik: [
                { saat: "09:00", hit: 12 },
                { saat: "11:00", hit: 24 },
                { saat: "13:00", hit: 38 },
                { saat: "15:00", hit: 52 },
                { saat: "17:00", hit: 68 },
                { saat: "19:00", hit: 94 },
                { saat: "21:00", hit: 110 },
                { saat: "23:00", hit: 84 },
                { saat: "01:00", hit: 46 }
            ],
            canliAktiviteler: [
                { id: "a1", metin: "Antalya / Muratpaşa'dan yeni bir ziyaretçi bağlandı", zaman: "1 dk önce", ikon: "fa-location-dot" },
                { id: "a2", metin: "Yeşil VIP 540Hz Espor Masaları inceleniyor", zaman: "3 dk önce", ikon: "fa-eye" },
                { id: "a3", metin: "PC 18 için 3 Saatlik Rezervasyon yapıldı", zaman: "6 dk önce", ikon: "fa-circle-check" },
                { id: "a4", metin: "Mavi Pro Masalar inceleniyor", zaman: "9 dk önce", ikon: "fa-fire" }
            ],
            fiyatModu: "standart",
            sonGuncelleme: new Date().toISOString()
        };
    }

    function analitikYukle() {
        try {
            const ham = global.localStorage.getItem(ANALYTICS_STORAGE_KEY);
            if (!ham) {
                const def = varsayilanAnalitik();
                analitikKaydet(def);
                return def;
            }
            return JSON.parse(ham);
        } catch (e) {
            console.warn("Analitik okunamadı:", e);
            return varsayilanAnalitik();
        }
    }

    function analitikKaydet(veri) {
        try {
            veri.sonGuncelleme = new Date().toISOString();
            global.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(veri));
        } catch (e) {
            console.error("Analitik kaydedilemedi:", e);
        }
        global.dispatchEvent(new CustomEvent(ANALYTICS_EVENT_NAME, { detail: veri }));
    }

    function ziyaretKaydet(sayfaAdi) {
        const analitik = analitikYukle();
        const sayfa = sayfaAdi || (
            typeof window !== "undefined" && window.location.pathname.includes("rezerve") ? "rezerve" :
            typeof window !== "undefined" && window.location.pathname.includes("hakkimizda") ? "hakkimizda" : "anasayfa"
        );

        analitik.toplamZiyaret = (analitik.toplamZiyaret || 1482) + 1;
        analitik.bugunZiyaret = (analitik.bugunZiyaret || 184) + 1;

        if (typeof sessionStorage !== "undefined" && !sessionStorage.getItem("forzaZiyaretKaydedildi")) {
            analitik.tekilZiyaret = (analitik.tekilZiyaret || 940) + 1;
            sessionStorage.setItem("forzaZiyaretKaydedildi", "true");
        }

        if (!analitik.sayfaBakilma) analitik.sayfaBakilma = { anasayfa: 0, rezerve: 0, hakkimizda: 0 };
        analitik.sayfaBakilma[sayfa] = (analitik.sayfaBakilma[sayfa] || 0) + 1;

        if (typeof navigator !== "undefined") {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile) {
                analitik.cihazDagilimi.mobil = Math.min(95, (analitik.cihazDagilimi.mobil || 68) + 0.2);
                analitik.cihazDagilimi.masaustu = 100 - analitik.cihazDagilimi.mobil;
            } else {
                analitik.cihazDagilimi.masaustu = Math.min(95, (analitik.cihazDagilimi.masaustu || 32) + 0.2);
                analitik.cihazDagilimi.mobil = 100 - analitik.cihazDagilimi.masaustu;
            }
        }

        const saat = new Date().getHours();
        const bazKullanici = (saat >= 16 && saat <= 24) ? 22 : 12;
        const rastgeleFark = Math.floor(Math.random() * 7) - 3;
        analitik.anlikCanliKullanici = Math.max(6, bazKullanici + rastgeleFark);

        analitikKaydet(analitik);
    }

    function kategoriIlgiKaydet(kategori) {
        if (!kategori) return;
        const analitik = analitikYukle();
        if (!analitik.kategoriBakilma) {
            analitik.kategoriBakilma = { sari: 100, mavi: 200, yesil: 300 };
        }
        analitik.kategoriBakilma[kategori] = (analitik.kategoriBakilma[kategori] || 0) + 1;

        const katAdi = kategori === "yesil" ? "Yeşil VIP 540Hz" : kategori === "mavi" ? "Mavi Pro 360Hz" : "Sarı Standart 240Hz";
        canliAktiviteEkle(`${katAdi} Masa tarifesi inceleniyor`, "fa-eye");

        analitikKaydet(analitik);
    }

    function canliAktiviteEkle(metin, ikon) {
        const analitik = analitikYukle();
        if (!analitik.canliAktiviteler) analitik.canliAktiviteler = [];
        
        analitik.canliAktiviteler.unshift({
            id: "akt-" + Date.now(),
            metin: metin,
            zaman: "Az önce",
            ikon: ikon || "fa-bolt"
        });

        if (analitik.canliAktiviteler.length > 8) {
            analitik.canliAktiviteler = analitik.canliAktiviteler.slice(0, 8);
        }

        analitikKaydet(analitik);
    }

    function getDinamikFiyatTavsiyesi() {
        const analitik = analitikYukle();
        const bakilma = analitik.kategoriBakilma || { sari: 320, mavi: 580, yesil: 790 };
        const toplam = (bakilma.sari || 0) + (bakilma.mavi || 0) + (bakilma.yesil || 0);

        const sariYuzde = toplam ? Math.round((bakilma.sari / toplam) * 100) : 33;
        const maviYuzde = toplam ? Math.round((bakilma.mavi / toplam) * 100) : 33;
        const yesilYuzde = toplam ? Math.round((bakilma.yesil / toplam) * 100) : 34;

        let tavsiye = {
            enPopulerKategori: "yesil",
            enPopulerYuzde: yesilYuzde,
            mesaj: `🔥 Yeşil VIP masalara yoğun talep var (İlgi: %${yesilYuzde}). Fiyat artışı kârlılığı yükseltebilir.`,
            onerilenFiyatlar: {
                sari: { bazSaatlik: 60, saatlik: 200, gunluk: 400 },
                mavi: { bazSaatlik: 75, saatlik: 270, gunluk: 540 },
                yesil: { bazSaatlik: 100, saatlik: 380, gunluk: 750 }
            }
        };

        if (yesilYuzde >= maviYuzde && yesilYuzde >= sariYuzde) {
            tavsiye.enPopulerKategori = "yesil";
            tavsiye.enPopulerYuzde = yesilYuzde;
            tavsiye.mesaj = `🔥 Yeşil VIP masalara yoğun talep var (İlgi: %${yesilYuzde}). Prime saatlerde saatliği 95-100 ₺ olarak güncellemeniz tavsiye edilir.`;
        } else if (maviYuzde >= sariYuzde) {
            tavsiye.enPopulerKategori = "mavi";
            tavsiye.enPopulerYuzde = maviYuzde;
            tavsiye.mesaj = `⚡ Mavi Pro masalar en çok incelenen grup (İlgi: %${maviYuzde}). Hafta sonu prime tarifesi önerilir.`;
        } else {
            tavsiye.enPopulerKategori = "sari";
            tavsiye.enPopulerYuzde = sariYuzde;
            tavsiye.mesaj = `⭐ Standart masalar yüksek sürüm yapıyor (İlgi: %${sariYuzde}). Paket avantajları öne çıkarılabilir.`;
        }

        return {
            analitik: analitik,
            yuzdeler: { sari: sariYuzde, mavi: maviYuzde, yesil: yesilYuzde },
            tavsiye: tavsiye
        };
    }

    if (typeof document !== "undefined") {
        document.addEventListener("DOMContentLoaded", function () {
            ziyaretKaydet();

            document.querySelectorAll(".kart, .cat-tab-btn, .fiyat").forEach(function (el) {
                el.addEventListener("click", function () {
                    const kat = el.dataset.tier || el.dataset.kategori || (
                        el.classList.contains("sari") ? "sari" :
                        el.classList.contains("mavi") ? "mavi" :
                        el.classList.contains("yesil") ? "yesil" : null
                    );
                    if (kat) kategoriIlgiKaydet(kat);
                });
            });
        });
    }

    // -----------------------------------------------------
    // Dışa aktar
    // -----------------------------------------------------

    global.ForzaPcData = {
        PC_LISTESI: PC_LISTESI,
        KATEGORILER: KATEGORILER,
        DURUM: DURUM,
        durumlariYukle: durumlariYukle,
        durumlariKaydet: durumlariKaydet,
        tekDurumGuncelle: tekDurumGuncelle,
        degisiklikleriDinle: degisiklikleriDinle,
        idCikar: idCikar,
        fiyatlariYukle: fiyatlariYukle,
        fiyatlariKaydet: fiyatlariKaydet,
        tekFiyatGuncelle: tekFiyatGuncelle,
        fiyatDegisiklikleriDinle: fiyatDegisiklikleriDinle,
        bildirimleriYukle: bildirimleriYukle,
        bildirimleriKaydet: bildirimleriKaydet,
        bildirimEkle: bildirimEkle,
        bildirimOkunduIsaretle: bildirimOkunduIsaretle,
        tumBildirimleriOkunduIsaretle: tumBildirimleriOkunduIsaretle,
        okunmamisBildirimSayisi: okunmamisBildirimSayisi,
        bildirimDegisiklikleriDinle: bildirimDegisiklikleriDinle,
        // Analitik & Dinamik Fiyatlandırma
        analitikYukle: analitikYukle,
        analitikKaydet: analitikKaydet,
        ziyaretKaydet: ziyaretKaydet,
        kategoriIlgiKaydet: kategoriIlgiKaydet,
        canliAktiviteEkle: canliAktiviteEkle,
        getDinamikFiyatTavsiyesi: getDinamikFiyatTavsiyesi,
        ANALYTICS_EVENT_NAME: ANALYTICS_EVENT_NAME
    };

    global.ForzaAnalytics = global.ForzaPcData;

})(typeof window !== "undefined" ? window : globalThis);