# packing-list.github.io
const CACHE = 'packing-list-v1';
const ASSETS = [
  './',
  './index.html',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => cached);
    })
  );
});

<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Packing List">
<meta name="theme-color" content="#0f172a">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icon-192.png">
<title>Packing List | ASAROLL</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0f1e;
    --surface: #111827;
    --surface2: #1e2a3a;
    --border: #2a3a4a;
    --accent: #00d4ff;
    --accent2: #0090b8;
    --text: #e2e8f0;
    --text-dim: #64748b;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --font-mono: 'IBM Plex Mono', monospace;
    --font-sans: 'IBM Plex Sans', sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: var(--font-sans);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }
  /* Header */
  .app-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .app-title {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--accent);
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .app-badge {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-dim);
    background: var(--surface2);
    padding: 3px 8px;
    border-radius: 3px;
    border: 1px solid var(--border);
  }
  /* Tabs */
  .tabs {
    display: flex;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
    scrollbar-width: none;
    position: sticky;
    top: 53px;
    z-index: 99;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tab {
    flex: 0 0 auto;
    padding: 10px 16px;
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--text-dim);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }
  /* Content */
  .tab-content { display: none; padding: 16px; padding-bottom: 100px; }
  .tab-content.active { display: block; }
  /* Section */
  .section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .section-title {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--accent);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  /* Form */
  .form-row { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; margin-bottom: 12px; }
  .form-row.single { grid-template-columns: 1fr; }
  .form-group { display: flex; flex-direction: column; gap: 4px; }
  label {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  input, select, textarea {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 13px;
    padding: 8px 10px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--accent);
  }
  select { appearance: none; }
  textarea { resize: vertical; min-height: 60px; }
  /* Logo Upload */
  .logo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .logo-upload {
    border: 1px dashed var(--border);
    border-radius: 6px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .logo-upload:hover { border-color: var(--accent); background: rgba(0,212,255,0.03); }
  .logo-upload input[type=file] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer;
    width: 100%; height: 100%;
  }
  .logo-upload img {
    max-width: 100%; max-height: 60px;
    object-fit: contain; display: block; margin: 0 auto 8px;
  }
  .logo-upload-icon { font-size: 24px; margin-bottom: 6px; }
  .logo-upload-text { font-size: 10px; color: var(--text-dim); font-family: var(--font-mono); }
  .logo-label { font-size: 10px; color: var(--accent); font-family: var(--font-mono); margin-bottom: 6px; }
  /* Items Table */
  .table-wrapper { overflow-x: auto; border-radius: 6px; border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 700px; }
  th {
    background: var(--surface2);
    color: var(--text-dim);
    font-family: var(--font-mono);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  td {
    padding: 4px 6px;
    border-bottom: 1px solid rgba(42,58,74,0.5);
    vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(0,212,255,0.03); }
  td input {
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 4px;
    font-size: 12px;
  }
  td input:focus { background: rgba(0,212,255,0.07); border: none; }
  .row-num {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-dim);
    width: 30px;
    text-align: center;
  }
  .btn-del {
    background: none;
    border: none;
    color: var(--danger);
    cursor: pointer;
    font-size: 16px;
    padding: 2px 6px;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  .btn-del:hover { opacity: 1; }
  /* Add Row Button */
  .btn-add-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 1px dashed var(--border);
    color: var(--text-dim);
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
    margin-top: 8px;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .btn-add-row:hover { border-color: var(--accent); color: var(--accent); }
  /* Bottom Bar */
  .bottom-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 10px 16px;
    display: flex;
    gap: 8px;
    z-index: 100;
  }
  .btn {
    flex: 1;
    padding: 10px 8px;
    border-radius: 6px;
    border: none;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .btn-save { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-save:hover { border-color: var(--accent); color: var(--accent); }
  .btn-preview { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-preview:hover { border-color: var(--success); color: var(--success); }
  .btn-pdf { background: var(--accent); color: var(--bg); }
  .btn-pdf:hover { background: var(--accent2); }
  .btn-doc { background: var(--surface2); color: var(--text); border: 1px solid var(--accent); }
  .btn-doc:hover { background: rgba(0,212,255,0.1); }
  /* Checkbox group */
  .checkbox-group { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 4px; }
  .checkbox-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; cursor: pointer;
  }
  .checkbox-item input[type=checkbox] {
    width: 14px; height: 14px; cursor: pointer;
    accent-color: var(--accent);
  }
  /* Preview Modal */
  .modal-overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 200;
    overflow: auto;
    padding: 20px;
  }
  .modal-overlay.show { display: flex; align-items: flex-start; justify-content: center; }
  .modal-content {
    background: #fff;
    color: #000;
    width: 100%;
    max-width: 900px;
    border-radius: 4px;
    padding: 32px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    position: relative;
  }
  .modal-close {
    position: fixed;
    top: 20px; right: 20px;
    background: var(--danger);
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px; height: 36px;
    font-size: 18px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    z-index: 201;
  }
  /* Print styles */
  .preview-doc { font-family: Arial, sans-serif; font-size: 11px; color: #000; }
  .preview-doc table { width: 100%; border-collapse: collapse; }
  .preview-doc th, .preview-doc td { border: 1px solid #000; padding: 4px 6px; }
  .preview-doc th { background: #ddd; font-weight: bold; }
  .preview-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .preview-logo { max-height: 60px; max-width: 120px; object-fit: contain; }
  .preview-title { text-align: center; font-size: 16px; font-weight: bold; }
  .preview-section { margin: 10px 0; }
  .preview-section-title { font-weight: bold; background: #e8e8e8; padding: 3px 6px; margin-bottom: 4px; border: 1px solid #000; }
  .preview-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; }
  .preview-field { border: 1px solid #ccc; padding: 3px 6px; font-size: 10px; }
  .preview-field label { font-weight: bold; display: block; }
  /* Toast */
  .toast {
    position: fixed;
    bottom: 80px; left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--success);
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 12px;
    opacity: 0;
    transition: all 0.3s;
    z-index: 300;
    pointer-events: none;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
</style>
</head>
<body>

<div class="app-header">
  <div class="app-title">▣ Packing List</div>
  <div class="app-badge">ASAROLL.co</div>
</div>

<div class="tabs">
  <div class="tab active" onclick="switchTab('header')">📋 Header</div>
  <div class="tab" onclick="switchTab('delivery')">📦 Delivery</div>
  <div class="tab" onclick="switchTab('contract')">📄 Contract</div>
  <div class="tab" onclick="switchTab('packing')">📐 Packing</div>
  <div class="tab" onclick="switchTab('items')">🔩 Items</div>
  <div class="tab" onclick="switchTab('preview-tab')">👁 Preview</div>
</div>

<!-- TAB: Header -->
<div id="tab-header" class="tab-content active">
  <div class="section">
    <div class="section-title">Document Info / اطلاعات سند</div>
    <div class="form-row">
      <div class="form-group">
        <label>Project No / شماره پروژه</label>
        <input type="text" id="project_no" placeholder="P001">
      </div>
      <div class="form-group">
        <label>Document No / شماره سند</label>
        <input type="text" id="doc_no" placeholder="DOC-001">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Issued Date / تاریخ صدور (شمسی)</label>
        <input type="text" id="issued_date" placeholder="۱۴۰۴/۱۲/۰۳">
      </div>
      <div class="form-group">
        <label>Revision / ویرایش</label>
        <input type="text" id="revision" placeholder="0">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Page / صفحه</label>
        <input type="text" id="page_no" placeholder="1 of 1">
      </div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Logos / لوگوها</div>
    <div class="logo-grid">
      <div>
        <div class="logo-label">Company Logo / لوگوی شرکت</div>
        <div class="logo-upload" id="company-logo-box">
          <input type="file" accept="image/*" onchange="loadLogo(event,'company_logo','company-logo-box')">
          <div class="logo-upload-icon">🏢</div>
          <div class="logo-upload-text">Tap to upload</div>
        </div>
      </div>
      <div>
        <div class="logo-label">Client Logo / لوگوی کارفرما</div>
        <div class="logo-upload" id="client-logo-box">
          <input type="file" accept="image/*" onchange="loadLogo(event,'client_logo','client-logo-box')">
          <div class="logo-upload-icon">👔</div>
          <div class="logo-upload-text">Tap to upload</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- TAB: Delivery -->
<div id="tab-delivery" class="tab-content">
  <div class="section">
    <div class="section-title">Delivery Description / اطلاعات تحویل</div>
    <div class="form-row single">
      <div class="form-group">
        <label>Address / آدرس</label>
        <textarea id="address" rows="3" placeholder="Enter delivery address..."></textarea>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Contact Person / نام تماس</label>
        <input type="text" id="contact_person" placeholder="Full name">
      </div>
      <div class="form-group">
        <label>Phone No / شماره تلفن</label>
        <input type="tel" id="phone_no" placeholder="+98 ...">
      </div>
    </div>
  </div>
</div>

<!-- TAB: Contract -->
<div id="tab-contract" class="tab-content">
  <div class="section">
    <div class="section-title">Contract Description / اطلاعات قرارداد</div>
    <div class="form-row">
      <div class="form-group">
        <label>Client / کارفرما</label>
        <input type="text" id="client" placeholder="Client name">
      </div>
      <div class="form-group">
        <label>Item No / شماره آیتم</label>
        <input type="text" id="item_no" placeholder="ITEM-001">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Name of Project / نام پروژه</label>
        <input type="text" id="project_name" placeholder="Project name">
      </div>
      <div class="form-group">
        <label>Designation / عنوان</label>
        <input type="text" id="designation" placeholder="Designation">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>T No / شماره T</label>
        <input type="text" id="t_no" placeholder="T-001">
      </div>
      <div class="form-group">
        <label>Ordered QTY / تعداد سفارش</label>
        <input type="number" id="ordered_qty" placeholder="0">
      </div>
    </div>
    <div class="form-row single">
      <div class="form-group">
        <label>Incoterms / اینکوترمز</label>
        <select id="incoterms">
          <option value="EXW">EXW (EX-Work)</option>
          <option value="FOB">FOB (Free On Board)</option>
          <option value="CIF">CIF (Cost, Insurance & Freight)</option>
          <option value="CFR">CFR (Cost and Freight)</option>
          <option value="DDP">DDP (Delivered Duty Paid)</option>
          <option value="DAP">DAP (Delivered at Place)</option>
          <option value="FCA">FCA (Free Carrier)</option>
          <option value="CPT">CPT (Carriage Paid To)</option>
        </select>
      </div>
    </div>
  </div>
</div>

<!-- TAB: Packing -->
<div id="tab-packing" class="tab-content">
  <div class="section">
    <div class="section-title">Packing Description / اطلاعات بسته‌بندی</div>
    <div class="form-row">
      <div class="form-group">
        <label>Net Weight (kg) / وزن خالص</label>
        <input type="number" id="net_weight" placeholder="0.00" step="0.01">
      </div>
      <div class="form-group">
        <label>Gross Weight (kg) / وزن ناخالص</label>
        <input type="number" id="gross_weight" placeholder="0.00" step="0.01">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Cubic Measure (m³) / حجم</label>
        <input type="number" id="cubic_measure" placeholder="0.000" step="0.001">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Length (mm) / طول</label>
        <input type="number" id="length_mm" placeholder="0">
      </div>
      <div class="form-group">
        <label>Width (mm) / عرض</label>
        <input type="number" id="width_mm" placeholder="0">
      </div>
    </div>
    <div class="form-row single">
      <div class="form-group">
        <label>Height (mm) / ارتفاع</label>
        <input type="number" id="height_mm" placeholder="0">
      </div>
    </div>
    <div class="form-group" style="margin-top:8px">
      <label>Type of Packing / نوع بسته‌بندی</label>
      <div class="checkbox-group">
        <label class="checkbox-item">
          <input type="checkbox" id="packing_wooden"> Wooden Box/Pallet / جعبه چوبی
        </label>
        <label class="checkbox-item">
          <input type="checkbox" id="packing_metal"> Metal Pallet / پالت فلزی
        </label>
        <label class="checkbox-item">
          <input type="checkbox" id="packing_carton"> Carton / کارتن
        </label>
        <label class="checkbox-item">
          <input type="checkbox" id="packing_other"> Other / سایر
        </label>
      </div>
    </div>
  </div>
</div>

<!-- TAB: Items -->
<div id="tab-items" class="tab-content">
  <div class="section">
    <div class="section-title">Items / اقلام</div>
    <div class="table-wrapper">
      <table id="items-table">
        <thead>
          <tr>
            <th style="width:30px">No</th>
            <th>Part No</th>
            <th>Description</th>
            <th>Material</th>
            <th style="width:50px">QTY</th>
            <th style="width:50px">Unit</th>
            <th>Remark</th>
            <th style="width:30px"></th>
          </tr>
        </thead>
        <tbody id="items-body"></tbody>
      </table>
    </div>
    <button class="btn-add-row" onclick="addRow()">+ Add Row / افزودن ردیف</button>
  </div>
</div>

<!-- TAB: Preview -->
<div id="tab-preview-tab" class="tab-content">
  <div class="section">
    <div class="section-title">Preview / پیش‌نمایش</div>
    <p style="color:var(--text-dim);font-size:13px;margin-bottom:12px">برای مشاهده پیش‌نمایش کامل، دکمه 👁 Preview را در پایین بزنید.</p>
    <button class="btn btn-preview" style="flex:none;width:100%;padding:14px" onclick="showPreview()">👁 Open Preview / باز کردن پیش‌نمایش</button>
  </div>
</div>

<!-- Bottom Bar -->
<div class="bottom-bar">
  <button class="btn btn-save" onclick="saveData()">💾 Save</button>
  <button class="btn btn-preview" onclick="showPreview()">👁 Preview</button>
  <button class="btn btn-pdf" onclick="generatePDF()">📄 PDF</button>
  <button class="btn btn-doc" onclick="generateDOC()">📝 DOC</button>
</div>

<!-- Preview Modal -->
<div class="modal-overlay" id="preview-modal">
  <button class="modal-close" onclick="closePreview()">×</button>
  <div class="modal-content" id="preview-content"></div>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
<script>
// ─── Jalali Date ─────────────────────────────────────────────────
function toJalali(gy, gm, gd) {
  let jy,jm,jd,g_d_no,j_d_no,j_np,i,j,l,n,leap;
  g_d_no=365*gy+(Math.floor((gy+3)/4))-Math.floor((gy+99)/100)+Math.floor((gy+399)/400);
  g_d_no+=Math.floor(0+(gm<3?0:gy%4==0&&(gy%100!=0||gy%400==0)?-1:-2)+g_days_in_month[gm]);
  g_d_no+=gd;
  j_d_no=g_d_no-79;
  j_np=Math.floor(j_d_no/12053);
  j_d_no%=12053;
  jy=979+33*j_np+4*Math.floor(j_d_no/1461);
  j_d_no%=1461;
  if(j_d_no>=366){jy+=Math.floor((j_d_no-1)/365);j_d_no=(j_d_no-1)%365;}
  for(i=0;i<11&&j_d_no>=j_days_in_month[i];i++)j_d_no-=j_days_in_month[i];
  jm=i+1;jd=j_d_no+1;
  return[jy,jm,jd];
}
const g_days_in_month=[0,31,59,90,120,151,181,212,243,273,304,334,365];
const j_days_in_month=[31,31,31,31,31,31,30,30,30,30,30,29];

function getJalaliDate() {
  const d=new Date();
  const [jy,jm,jd]=toJalali(d.getFullYear(),d.getMonth()+1,d.getDate());
  const fa=s=>s.toString().split('').map(c=>String.fromCharCode(c.charCodeAt(0)+1728)).join('');
  return `${fa(jy)}/${fa(jm.toString().padStart(2,'0'))}/${fa(jd.toString().padStart(2,'0'))}`;
}

// ─── Tab Switching ────────────────────────────────────────────────
function switchTab(id) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('tab-'+id).classList.add('active');
}

// ─── Logo Upload ──────────────────────────────────────────────────
const logos = { company_logo: null, client_logo: null };
function loadLogo(event, key, boxId) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    logos[key] = e.target.result;
    const box = document.getElementById(boxId);
    box.innerHTML = `<input type="file" accept="image/*" onchange="loadLogo(event,'${key}','${boxId}')">
      <img src="${e.target.result}" alt="logo"><div class="logo-upload-text">Tap to change</div>`;
  };
  reader.readAsDataURL(file);
}

// ─── Items Table ──────────────────────────────────────────────────
let rowCount = 0;
function addRow(data={}) {
  rowCount++;
  const n = rowCount;
  const tbody = document.getElementById('items-body');
  const tr = document.createElement('tr');
  tr.id = `row-${n}`;
  tr.innerHTML = `
    <td class="row-num">${n}</td>
    <td><input type="text" placeholder="Part#" value="${data.part||''}"></td>
    <td><input type="text" placeholder="Description" value="${data.desc||''}"></td>
    <td><input type="text" placeholder="Material" value="${data.mat||''}"></td>
    <td><input type="number" placeholder="0" value="${data.qty||''}"></td>
    <td><input type="text" placeholder="pcs" value="${data.unit||''}"></td>
    <td><input type="text" placeholder="Remark" value="${data.remark||''}"></td>
    <td><button class="btn-del" onclick="delRow(${n})">×</button></td>`;
  tbody.appendChild(tr);
}
function delRow(n) {
  const row = document.getElementById(`row-${n}`);
  if (row) row.remove();
}
function getItems() {
  const rows = document.querySelectorAll('#items-body tr');
  return Array.from(rows).map(tr => {
    const inputs = tr.querySelectorAll('input');
    return {
      no: tr.querySelector('.row-num').textContent,
      part: inputs[0].value,
      desc: inputs[1].value,
      mat: inputs[2].value,
      qty: inputs[3].value,
      unit: inputs[4].value,
      remark: inputs[5].value
    };
  });
}

// ─── Form Data ────────────────────────────────────────────────────
function getField(id) { return document.getElementById(id)?.value || ''; }
function setField(id, val) { const el = document.getElementById(id); if(el) el.value = val; }

// ─── Save / Load ──────────────────────────────────────────────────
function saveData() {
  const data = {
    project_no: getField('project_no'), doc_no: getField('doc_no'),
    issued_date: getField('issued_date'), revision: getField('revision'),
    page_no: getField('page_no'), address: getField('address'),
    contact_person: getField('contact_person'), phone_no: getField('phone_no'),
    client: getField('client'), item_no: getField('item_no'),
    project_name: getField('project_name'), designation: getField('designation'),
    t_no: getField('t_no'), ordered_qty: getField('ordered_qty'),
    incoterms: getField('incoterms'), net_weight: getField('net_weight'),
    gross_weight: getField('gross_weight'), cubic_measure: getField('cubic_measure'),
    length_mm: getField('length_mm'), width_mm: getField('width_mm'),
    height_mm: getField('height_mm'),
    packing_wooden: document.getElementById('packing_wooden').checked,
    packing_metal: document.getElementById('packing_metal').checked,
    packing_carton: document.getElementById('packing_carton').checked,
    packing_other: document.getElementById('packing_other').checked,
    logos: logos,
    items: getItems()
  };
  try { localStorage.setItem('packingListData', JSON.stringify(data)); } catch(e){}
  showToast('✓ Saved / ذخیره شد');
}
function loadData() {
  try {
    const raw = localStorage.getItem('packingListData');
    if (!raw) return;
    const data = JSON.parse(raw);
    Object.keys(data).forEach(k => {
      if (k === 'items' || k === 'logos') return;
      if (k.startsWith('packing_')) { const el=document.getElementById(k); if(el) el.checked=data[k]; return; }
      setField(k, data[k]);
    });
    if (data.logos) {
      ['company_logo','client_logo'].forEach(key => {
        if (data.logos[key]) {
          logos[key] = data.logos[key];
          const boxId = key === 'company_logo' ? 'company-logo-box' : 'client-logo-box';
          const box = document.getElementById(boxId);
          if(box) box.innerHTML = `<input type="file" accept="image/*" onchange="loadLogo(event,'${key}','${boxId}')">
            <img src="${data.logos[key]}" alt="logo"><div class="logo-upload-text">Tap to change</div>`;
        }
      });
    }
    if (data.items) data.items.forEach(item => addRow({part:item.part,desc:item.desc,mat:item.mat,qty:item.qty,unit:item.unit,remark:item.remark}));
  } catch(e) {}
}

// ─── Preview ──────────────────────────────────────────────────────
function buildDocHTML() {
  const packingTypes = [];
  if(document.getElementById('packing_wooden').checked) packingTypes.push('Wooden Box/Pallet');
  if(document.getElementById('packing_metal').checked) packingTypes.push('Metal Pallet');
  if(document.getElementById('packing_carton').checked) packingTypes.push('Carton');
  if(document.getElementById('packing_other').checked) packingTypes.push('Other');
  const items = getItems();
  const itemRows = items.map(i => `<tr>
    <td style="text-align:center">${i.no}</td>
    <td>${i.part}</td>
    <td>${i.desc}</td>
    <td>${i.mat}</td>
    <td style="text-align:center">${i.qty}</td>
    <td style="text-align:center">${i.unit}</td>
    <td>${i.remark}</td>
  </tr>`).join('');
  const logoLeft = logos.company_logo ? `<img src="${logos.company_logo}" style="max-height:60px;max-width:120px;object-fit:contain">` : '<div style="width:120px;height:60px;background:#eee;display:flex;align-items:center;justify-content:center;font-size:10px">Company Logo</div>';
  const logoRight = logos.client_logo ? `<img src="${logos.client_logo}" style="max-height:60px;max-width:120px;object-fit:contain">` : '<div style="width:120px;height:60px;background:#eee;display:flex;align-items:center;justify-content:center;font-size:10px">Client Logo</div>';
  return `<div class="preview-doc">
    <table style="border:none;margin-bottom:8px">
      <tr>
        <td style="border:none;width:130px">${logoLeft}</td>
        <td style="border:none;text-align:center;font-size:18px;font-weight:bold">Packing List / لیست بسته‌بندی</td>
        <td style="border:none;width:130px;text-align:right">${logoRight}</td>
      </tr>
    </table>
    <table style="margin-bottom:4px">
      <tr>
        <td><b>Project No / شماره پروژه:</b> ${getField('project_no')}</td>
        <td><b>Document No / شماره سند:</b> ${getField('doc_no')}</td>
        <td><b>Issued Date / تاریخ:</b> ${getField('issued_date')}</td>
      </tr>
      <tr>
        <td><b>Revision / ویرایش:</b> ${getField('revision')}</td>
        <td></td>
        <td><b>Page / صفحه:</b> ${getField('page_no')}</td>
      </tr>
    </table>
    <div class="preview-section-title">Delivery Description / اطلاعات تحویل</div>
    <table style="margin-bottom:4px">
      <tr><td colspan="2"><b>Address / آدرس:</b> ${getField('address')}</td></tr>
      <tr>
        <td><b>Contact Person / نام تماس:</b> ${getField('contact_person')}</td>
        <td><b>Phone No / تلفن:</b> ${getField('phone_no')}</td>
      </tr>
    </table>
    <div class="preview-section-title">Contract Description / اطلاعات قرارداد</div>
    <table style="margin-bottom:4px">
      <tr>
        <td><b>Client / کارفرما:</b> ${getField('client')}</td>
        <td><b>Item No / شماره آیتم:</b> ${getField('item_no')}</td>
      </tr>
      <tr>
        <td><b>Project Name / نام پروژه:</b> ${getField('project_name')}</td>
        <td><b>Designation / عنوان:</b> ${getField('designation')}</td>
      </tr>
      <tr>
        <td><b>T No:</b> ${getField('t_no')}</td>
        <td><b>Ordered QTY / تعداد:</b> ${getField('ordered_qty')}</td>
      </tr>
      <tr><td colspan="2"><b>Incoterms / اینکوترمز:</b> ${getField('incoterms')}</td></tr>
    </table>
    <div class="preview-section-title">Packing Description / اطلاعات بسته‌بندی</div>
    <table style="margin-bottom:4px">
      <tr>
        <td><b>Net Weight / وزن خالص (kg):</b> ${getField('net_weight')}</td>
        <td><b>Type of Packing / نوع:</b> ${packingTypes.join(', ')||'-'}</td>
        <td><b>Length / طول (mm):</b> ${getField('length_mm')}</td>
      </tr>
      <tr>
        <td><b>Gross Weight / وزن ناخالص (kg):</b> ${getField('gross_weight')}</td>
        <td></td>
        <td><b>Width / عرض (mm):</b> ${getField('width_mm')}</td>
      </tr>
      <tr>
        <td><b>Cubic Measure / حجم (m³):</b> ${getField('cubic_measure')}</td>
        <td></td>
        <td><b>Height / ارتفاع (mm):</b> ${getField('height_mm')}</td>
      </tr>
    </table>
    <div class="preview-section-title">Items / اقلام</div>
    <table>
      <thead>
        <tr>
          <th style="width:30px">No</th>
          <th>Part Number</th>
          <th>Description</th>
          <th>Material</th>
          <th style="width:40px">QTY</th>
          <th style="width:40px">Unit</th>
          <th>Remark</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <table style="margin-top:16px;border:none">
      <tr>
        <td style="border:none;width:33%;text-align:center">
          <div style="border-top:1px solid #000;padding-top:4px;margin-top:40px">
            <b>ASAROLL.co</b><br>Signature / امضا
          </div>
        </td>
        <td style="border:none;width:33%;text-align:center">
          <div style="border-top:1px solid #000;padding-top:4px;margin-top:40px">
            <b>Third Party Inspection</b><br>Signature / امضا
          </div>
        </td>
        <td style="border:none;width:33%;text-align:center">
          <div style="border-top:1px solid #000;padding-top:4px;margin-top:40px">
            <b>Client/Owner / کارفرما</b><br>Signature / امضا
          </div>
        </td>
      </tr>
    </table>
  </div>`;
}
function showPreview() {
  document.getElementById('preview-content').innerHTML = buildDocHTML();
  document.getElementById('preview-modal').classList.add('show');
}
function closePreview() {
  document.getElementById('preview-modal').classList.remove('show');
}

// ─── PDF ──────────────────────────────────────────────────────────
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 10;

  // Header logos
  if (logos.company_logo) { try { doc.addImage(logos.company_logo,'PNG',10,y,35,18); } catch(e){} }
  if (logos.client_logo) { try { doc.addImage(logos.client_logo,'PNG',pw-45,y,35,18); } catch(e){} }
  doc.setFontSize(14); doc.setFont('helvetica','bold');
  doc.text('Packing List', pw/2, y+10, {align:'center'});
  y = 34;

  // Doc info
  doc.autoTable({
    startY: y, margin:{left:10,right:10},
    head: [['Project No','Document No','Issued Date','Revision','Page']],
    body: [[getField('project_no'),getField('doc_no'),getField('issued_date'),getField('revision'),getField('page_no')]],
    theme: 'grid', headStyles:{fillColor:[60,80,100],textColor:255,fontSize:8},
    bodyStyles:{fontSize:8}, styles:{cellPadding:2}
  });
  y = doc.lastAutoTable.finalY + 4;

  // Delivery
  doc.setFontSize(9); doc.setFont('helvetica','bold');
  doc.setFillColor(200,210,220); doc.rect(10,y,pw-20,6,'F');
  doc.text('Delivery Description', 12, y+4);
  y += 7;
  doc.autoTable({
    startY: y, margin:{left:10,right:10},
    body: [
      ['Address:', getField('address'), 'Contact:', getField('contact_person'), 'Phone:', getField('phone_no')]
    ],
    theme: 'grid', bodyStyles:{fontSize:8}, styles:{cellPadding:2}
  });
  y = doc.lastAutoTable.finalY + 4;

  // Contract
  doc.setFillColor(200,210,220); doc.rect(10,y,pw-20,6,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(9);
  doc.text('Contract Description', 12, y+4);
  y += 7;
  doc.autoTable({
    startY: y, margin:{left:10,right:10},
    body: [
      ['Client:', getField('client'), 'Item No:', getField('item_no'), 'Incoterms:', getField('incoterms')],
      ['Project:', getField('project_name'), 'Designation:', getField('designation'), 'T No:', getField('t_no')],
      ['Ordered QTY:', getField('ordered_qty'), '', '', '', '']
    ],
    theme: 'grid', bodyStyles:{fontSize:8}, styles:{cellPadding:2}
  });
  y = doc.lastAutoTable.finalY + 4;

  // Packing
  const packingTypes = [];
  if(document.getElementById('packing_wooden').checked) packingTypes.push('Wooden Box');
  if(document.getElementById('packing_metal').checked) packingTypes.push('Metal Pallet');
  if(document.getElementById('packing_carton').checked) packingTypes.push('Carton');
  if(document.getElementById('packing_other').checked) packingTypes.push('Other');
  doc.setFillColor(200,210,220); doc.rect(10,y,pw-20,6,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(9);
  doc.text('Packing Description', 12, y+4);
  y += 7;
  doc.autoTable({
    startY: y, margin:{left:10,right:10},
    body: [
      ['Net Wt (kg):', getField('net_weight'), 'Gross Wt (kg):', getField('gross_weight'), 'Volume (m³):', getField('cubic_measure')],
      ['Type:', packingTypes.join(', ')||'-', 'L (mm):', getField('length_mm'), 'W (mm):', getField('width_mm')],
      ['', '', 'H (mm):', getField('height_mm'), '', '']
    ],
    theme: 'grid', bodyStyles:{fontSize:8}, styles:{cellPadding:2}
  });
  y = doc.lastAutoTable.finalY + 4;

  // Items
  if (y > ph - 60) { doc.addPage(); y = 10; }
  doc.setFillColor(60,80,100); doc.rect(10,y,pw-20,6,'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(255,255,255);
  doc.text('Items / اقلام', 12, y+4);
  doc.setTextColor(0,0,0);
  y += 7;
  const items = getItems();
  doc.autoTable({
    startY: y, margin:{left:10,right:10},
    head: [['No','Part Number','Description','Material','QTY','Unit','Remark']],
    body: items.map(i=>[i.no,i.part,i.desc,i.mat,i.qty,i.unit,i.remark]),
    theme: 'grid', headStyles:{fillColor:[60,80,100],textColor:255,fontSize:8},
    bodyStyles:{fontSize:8}, styles:{cellPadding:2},
    columnStyles:{0:{cellWidth:12},4:{cellWidth:16},5:{cellWidth:16}}
  });
  y = doc.lastAutoTable.finalY + 16;

  // Signature
  if (y > ph - 30) { doc.addPage(); y = 10; }
  const sw = (pw-20)/3;
  ['ASAROLL.co','Third Party Inspection','Client/Owner'].forEach((name,i) => {
    const x = 10 + i*sw;
    doc.line(x+5, y+20, x+sw-5, y+20);
    doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text(name, x+sw/2, y+24, {align:'center'});
    doc.setFont('helvetica','normal');
    doc.text('Signature', x+sw/2, y+28, {align:'center'});
  });

  const fname = `PackingList_${getField('project_no')||'draft'}_${getField('doc_no')||'001'}.pdf`;
  doc.save(fname);
  showToast('✓ PDF Downloaded');
}

// ─── DOC ──────────────────────────────────────────────────────────
function generateDOC() {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>
      body{font-family:Arial,sans-serif;font-size:11px;margin:20px}
      table{width:100%;border-collapse:collapse;margin-bottom:8px}
      th,td{border:1px solid #000;padding:4px 6px}
      th{background:#ddd;font-weight:bold}
      .section-title{background:#c8d2dc;font-weight:bold;padding:3px 6px;border:1px solid #000;margin:8px 0 4px 0}
      .no-border td,.no-border th{border:none}
    </style></head><body>${buildDocHTML()}</body></html>`;
  const blob = new Blob([html], {type:'application/msword'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PackingList_${getField('project_no')||'draft'}.doc`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✓ DOC Downloaded');
}

// ─── Toast ────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2500);
}

// ─── Init ─────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  setField('issued_date', getJalaliDate());
  // Add default 5 rows
  for(let i=0;i<5;i++) addRow();
  loadData();
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
});
</script>
</body>
</html>

{
  "name": "Packing List / لیست بسته‌بندی",
  "short_name": "PackingList",
  "description": "ASAROLL Packing List Generator",
  "start_url": "./index.html",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0f1923",
  "theme_color": "#1a2332",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["productivity", "business"],
  "lang": "fa",
  "dir": "ltr"
}

{"name":"","short_name":"","icons":[{"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}],"theme_color":"#ffffff","background_color":"#ffffff","display":"standalone"}
