// 外部ライブラリ不要。JavaScriptが無効でも本文とナビゲーションは表示されます。
"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const mobileViewport = window.matchMedia("(max-width: 820px)");

function setMenuState(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  siteNav.hidden = mobileViewport.matches && !open;
}

function syncMenu() {
  // 折りたたみの中にフォーカスがある場合はメニューボタンに戻します。
  if (mobileViewport.matches && siteNav.contains(document.activeElement)) {
    menuToggle.focus();
  }
  setMenuState(false);
}

menuToggle.hidden = false;
syncMenu();
mobileViewport.addEventListener("change", syncMenu);
menuToggle.addEventListener("click", () => {
  setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a") && mobileViewport.matches) {
    const target = document.querySelector(event.target.closest("a").getAttribute("href"));
    setMenuState(false);
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileViewport.matches &&
      menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuState(false);
    menuToggle.focus();
  }
});

// JSが動作するときだけフォームを折りたたみます。
const contactPanel = document.querySelector("#contact-form");
const contactOpen = document.querySelector(".contact-open");
const inquiryForm = document.querySelector(".inquiry-form");
const formStatus = document.querySelector(".form-status");

contactPanel.hidden = true;
contactOpen.setAttribute("aria-controls", "contact-form");
contactOpen.setAttribute("aria-expanded", "false");

function openContactForm(focusInput = false) {
  contactPanel.hidden = false;
  contactOpen.setAttribute("aria-expanded", "true");
  if (focusInput) {
    // アンカー移動を妨げず、キーボード操作も続けられるようにします。
    document.querySelector("#name").focus({ preventScroll: true });
  }
}

contactOpen.addEventListener("click", () => openContactForm(true));
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#contact-form") openContactForm();
});
if (window.location.hash === "#contact-form") openContactForm();

// 入力を確認するだけのデモ。通信・ストレージへの保存は行いません。
inquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [
    { element: inquiryForm.elements.name, min: 1, message: "お名前を入力してください。" },
    { element: inquiryForm.elements.message, min: 5, message: "お問い合わせ内容を5文字以上で入力してください。" }
  ];
  fields.forEach(({ element, min, message }) => {
    element.setCustomValidity(element.value.trim().length < min ? message : "");
  });
  if (!inquiryForm.reportValidity()) return;
  formStatus.textContent = "入力内容を確認しました。これはデモのため、送信・保存はされていません。";
});

inquiryForm.addEventListener("input", (event) => {
  if (typeof event.target.setCustomValidity === "function") {
    event.target.setCustomValidity("");
  }
  formStatus.textContent = "";
});

// イベントの設定後に有効化。JS無効時は入力と送信を無効に保ちます。
inquiryForm.querySelectorAll("[disabled]").forEach((control) => { control.disabled = false; });

document.querySelector("#year").textContent = String(new Date().getFullYear());

// 画像が読み込めない場合にも、ローカルの仮画像でレイアウトを保ちます。
document.querySelectorAll("img").forEach((img) => {
  const showPlaceholder = () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = "true";
    img.alt = "仮のイラスト画像（写真を読み込めませんでした）";
    img.src = "assets/placeholder.svg";
  };
  img.addEventListener("error", showPlaceholder);
  if (img.complete && img.naturalWidth === 0) showPlaceholder();
});
