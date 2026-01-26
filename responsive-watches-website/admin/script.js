const PASSWORD = 'admin';
const KEY = 'admin_products_v1';
// Use same-origin API when served over http(s); if opened via file://, fall back to localhost:3000
const API_BASE = (location.protocol === 'file:') ? 'http://localhost:3000' : '';

function qs(sel){return document.querySelector(sel)}

function loadProducts(){
  try{const raw = localStorage.getItem(KEY); return raw?JSON.parse(raw):[] }catch(e){return []}
}

function saveProducts(list){ localStorage.setItem(KEY, JSON.stringify(list)) }

function renderProducts(){
  const tbody = qs('#productsTable tbody'); tbody.innerHTML = '';
  const list = loadProducts();
  list.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(p.title)}</td>
      <td>${escapeHtml(p.price)}</td>
      <td>${p.image?`<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}">` : ''}</td>
      <td>
        <button class="btn small" data-id="${p.id}" data-action="edit">Edit</button>
        <button class="btn small" data-id="${p.id}" data-action="delete">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  })
}

function renderDashboardStats(){
  const list = loadProducts();
  const count = list.length;
  const avg = count ? (list.reduce((s,i)=>s+(parseFloat(i.price)||0),0)/count).toFixed(2) : '0.00';
  qs('#stat-count').querySelector('.value').textContent = count;
  qs('#stat-average').querySelector('.value').textContent = avg;
  // placeholders for the other cards
  qs('#stat-collections').querySelector('.value').textContent = Math.max(0, Math.floor(count/2));
  qs('#stat-comments').querySelector('.value').textContent = Math.max(0, Math.floor(count*3));
}

function escapeHtml(s){ if(!s && s!==0) return ''; return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) }

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}

function resetForm(){ qs('#pId').value=''; qs('#pTitle').value=''; qs('#pPrice').value=''; qs('#pImage').value=''; qs('#pDesc').value=''; }

function handleFormSubmit(e){
  e.preventDefault();
  const id = qs('#pId').value || uid();
  const product = {
    id,
    title: qs('#pTitle').value.trim(),
    price: qs('#pPrice').value.trim(),
    image: qs('#pImage').value.trim(),
    description: qs('#pDesc').value.trim()
  };
  const list = loadProducts().filter(p=>p.id!==id).concat([product]);
  saveProducts(list);
  renderProducts();
  resetForm();
}

function handleTableClick(e){
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id; const action = btn.dataset.action;
  if(action==='edit'){
    const p = loadProducts().find(x=>x.id===id); if(!p) return;
    qs('#pId').value = p.id; qs('#pTitle').value = p.title; qs('#pPrice').value = p.price; qs('#pImage').value = p.image; qs('#pDesc').value = p.description;
  }else if(action==='delete'){
    if(!confirm('Delete this product?')) return;
    const list = loadProducts().filter(x=>x.id!==id); saveProducts(list); renderProducts();
  }
}


function importJSON(file){
  if(!file) return;
  const r = new FileReader();
  r.onload = ()=>{
    try{ const data = JSON.parse(r.result); if(!Array.isArray(data)) throw new Error('Invalid JSON'); saveProducts(data); renderProducts(); alert('Imported successfully') }catch(err){ alert('Failed to import: '+err.message) }
  };
  r.readAsText(file);
}

// Export / Push / Pull features removed per request

function clearAll(){ if(!confirm('Clear all products?')) return; localStorage.removeItem(KEY); renderProducts(); }

/* Orders */
const ORDERS_KEY = 'orders';

function loadOrders(){
  try{ const raw = localStorage.getItem(ORDERS_KEY); return raw?JSON.parse(raw):[] }catch(e){ return [] }
}

function renderOrders(){
  const tbody = qs('#ordersTable tbody'); if(!tbody) return; tbody.innerHTML = '';
  const list = loadOrders();
  list.slice().reverse().forEach(o=>{
    const tr = document.createElement('tr');
    const itemsSummary = (o.items||[]).map(i=>`${escapeHtml(i.name)} x${i.qty}`).join('<br>');
    tr.innerHTML = `
      <td>${escapeHtml(String(o.id))}</td>
      <td>${escapeHtml(String(o.date||''))}</td>
      <td>${itemsSummary}</td>
      <td>${escapeHtml(String(o.total||''))}</td>
      <td>
        <button class="btn small" data-id="${escapeHtml(String(o.id))}" data-action="view">View</button>
        <button class="btn small" data-id="${escapeHtml(String(o.id))}" data-action="delete">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  })
}

function handleOrdersClick(e){
  const btn = e.target.closest('button'); if(!btn) return;
  const id = btn.dataset.id; const action = btn.dataset.action;
  if(action === 'view'){
    const order = loadOrders().find(x=>String(x.id)===String(id));
    if(!order) return alert('Order not found');
    alert(`Order ${order.id}\nDate: ${order.date}\nTotal: ${order.total}\nItems:\n` + (order.items||[]).map(i=>`${i.name} x${i.qty}`).join('\n'));
  } else if(action === 'delete'){
    if(!confirm('Delete this order?')) return;
    const list = loadOrders().filter(x=>String(x.id)!==String(id));
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    renderOrders();
  }
}

function showApp(){ qs('#loginOverlay').style.display='none'; qs('#adminApp').style.display='block'; }
function hideApp(){ qs('#loginOverlay').style.display='flex'; qs('#adminApp').style.display='none'; }

function init(){
  qs('#loginBtn').addEventListener('click', ()=>{
    const v = qs('#adminPassword').value; if(v===PASSWORD){ showApp(); renderProducts(); } else alert('Wrong password')
  });

  qs('#productForm').addEventListener('submit', handleFormSubmit);
  qs('#resetForm').addEventListener('click', resetForm);
  qs('#productsTable').addEventListener('click', handleTableClick);
  qs('#importFile').addEventListener('change', (e)=> importJSON(e.target.files[0]));
  
  qs('#clearBtn').addEventListener('click', clearAll);
  qs('#logoutBtn').addEventListener('click', ()=>{ resetForm(); hideApp(); });
  // orders actions
  const ordersTable = qs('#ordersTable'); if(ordersTable) ordersTable.addEventListener('click', handleOrdersClick);
}

document.addEventListener('DOMContentLoaded', ()=>{
  init();
  // ensure dashboard updates when products change
  const originalRender = renderProducts;
  renderProducts = function(){ originalRender(); renderDashboardStats(); };
  // render orders when the app loads
  renderOrders();
});
