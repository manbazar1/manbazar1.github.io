import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getFirestore, collection, query, orderBy, getDocs, limit
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
}[c]));

function noticeHtml(n, compact=false) {
  const title = esc(n.title || "Untitled notice");
  const date = esc(n.date || "");
  const category = esc(n.category || "Notice");
  const details = esc(n.details || "");
  const pdf = n.pdfUrl ? `<a class="btn-link" href="${esc(n.pdfUrl)}" target="_blank" rel="noopener noreferrer">Open document ↗</a>` : "";
  return `
    <article class="notice public-notice">
      <div class="date">${date || "—"}</div>
      <div>
        <b>${title}</b>
        <br><small>${category}${date ? " • " + date : ""}</small>
        ${compact ? "" : `<p>${details}</p>`}
        ${pdf}
      </div>
    </article>`;
}

async function loadPublicNotices() {
  const list = document.getElementById("publicNoticeList");
  const homeList = document.getElementById("homeNoticeList");
  if (!list && !homeList) return;

  try {
    const q = query(collection(db, "notices"), orderBy("publishedAt", "desc"), limit(50));
    const snap = await getDocs(q);

    if (list) {
      list.innerHTML = snap.empty
        ? `<div class="card-body"><p>No notices published yet.</p></div>`
        : snap.docs.map(d => noticeHtml(d.data(), false)).join("");
    }

    if (homeList) {
      homeList.innerHTML = snap.empty
        ? `<div class="notice"><div class="date">—</div><div><b>No notices published yet</b><br><small>Published notices will appear here automatically.</small></div></div>`
        : snap.docs.slice(0, 5).map(d => noticeHtml(d.data(), true)).join("");
    }
  } catch (e) {
    const msg = "Notices could not be loaded. Check Firebase configuration and Firestore read rules.";
    if (list) list.innerHTML = `<div class="card-body"><p>${msg}</p></div>`;
    if (homeList) homeList.innerHTML = `<div class="notice"><div class="date">!</div><div><b>Notice service unavailable</b><br><small>${msg}</small></div></div>`;
    console.error(e);
  }
}

loadPublicNotices();
