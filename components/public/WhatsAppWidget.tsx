"use client";

import React, { useState } from "react";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`sticky-contact ${open ? "active" : ""}`}>
      <div className="sticky-contact-options">
        <a
          href="https://wa.me/905464659693?text=Merhaba,%20Forza%20İnternet%20%26%20Cafe%20hakkında%20bilgi%20almak%20istiyorum."
          target="_blank"
          rel="noopener noreferrer"
          className="contact-option whatsapp"
          aria-label="WhatsApp İletişim"
        >
          <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
          <span>WhatsApp</span>
        </a>

        <a
          href="https://www.instagram.com/forza_internet_bilgisayar/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-option instagram"
          aria-label="Instagram Sayfamız"
        >
          <i className="fa-brands fa-instagram" aria-hidden="true"></i>
          <span>Instagram</span>
        </a>
      </div>

      <button
        className="sticky-contact-button"
        aria-label="Canlı İletişim Menüsü"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <i className="fa-solid fa-comment-dots" aria-hidden="true"></i>
      </button>
    </div>
  );
}