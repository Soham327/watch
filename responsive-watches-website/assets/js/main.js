/*=============== SHOW & CLOSE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Show menu */
if(navToggle){
   navToggle.addEventListener('click', () =>{
      navMenu.classList.add('show-menu')
   })
}

/* Hide menu */
if(navClose){
   navClose.addEventListener('click', () =>{
      navMenu.classList.remove('show-menu')
   })
}

/*=============== REMOVE MOBILE MENU ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
   const navMenu = document.getElementById('nav-menu')
   // When we click on each nav__link, we remove the show-menu class
   navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE HEADER STYLES ===============*/
const scrollHeader = () =>{
   const header = document.getElementById('header')
   // Add the .scroll-header class if the bottom scroll of the viewport is greater than 50
   this.scrollY >= 50 ? header.classList.add('scroll-header') 
                      : header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== TESTIMONIAL SWIPER ===============*/
let testimonialSwiper = new Swiper(".testimonial-swiper", {
    spaceBetween: 30,
    loop: 'true',

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

/*=============== NEW SWIPER ===============*/
let newSwiper = new Swiper(".new-swiper", {
    spaceBetween: 24,
    loop: 'true',

    breakpoints: {
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
    },
});

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
   // Add the .scroll-header class if the bottom scroll of the viewport is greater than 350
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						     : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

// Link the ID of each section (section id="home") to each link (a href="#home") 
// and activate the link with the class .active-link
const scrollActive = () => {
   // We get the position by scrolling down
   const scrollY = window.scrollY

   sections.forEach(section => {
      const id = section.id, // id of each section
            top = section.offsetTop - 50, // Distance from the top edge
            height = section.offsetHeight, // Element height
            link = document.querySelector('.nav__menu a[href*=' + id + ']') // id nav link

      if(!link) return

      link.classList.toggle('active-link', scrollY > top && scrollY <= top + height)
   })
}
window.addEventListener('scroll', scrollActive)

/*=============== SHOW CART ===============*/
const cart = document.getElementById('cart'),
      cartShop = document.getElementById('cart-shop'),
      cartClose = document.getElementById('cart-close')

/*===== CART SHOW =====*/
/* Validate if constant exists */
if(cartShop){
    cartShop.addEventListener('click', () =>{
        cart.classList.add('show-cart')
    })
}

/*===== CART HIDDEN =====*/
/* Validate if constant exists */
if(cartClose){
    cartClose.addEventListener('click', () =>{
        cart.classList.remove('show-cart')
    })
}

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx bx-moon' : 'bx bx-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx bx-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})
function placeOrder(){
    let items = [];

    document.querySelectorAll('.cart__card').forEach(card => {
        items.push({
            name: card.querySelector('.cart__title').innerText,
            price: card.querySelector('.cart__price').innerText,
            qty: card.querySelector('.cart__amount-number').innerText
        });
    });

    if(items.length === 0){
        alert("Cart is empty");
        return;
    }

    let total = document.querySelector('.cart__prices-total').innerText;

    let order = {
        id: Date.now(),
        items,
        total,
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Redirect to checkout to complete payment; keep cart so totals remain
    const params = new URLSearchParams({ orderId: String(order.id) });
    window.location.href = 'checkout.html?' + params.toString();
    return;
}

/*=============== LOAD ADMIN PRODUCTS ===============*/
const ADMIN_KEY = 'admin_products_v1'

function loadAdminProducts(){
    try{ const raw = localStorage.getItem(ADMIN_KEY); return raw?JSON.parse(raw):[] }catch(e){ return [] }
}

function escapeHtml(s){ if(!s && s!==0) return ''; return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) }

function renderSiteProductsFromAdmin(){
    const list = loadAdminProducts();
    if(!list || !list.length) return; // keep static products if none in admin
    const container = document.querySelector('.products__container');
    if(!container) return;
    container.innerHTML = '';
    list.forEach((p, idx) => {
        const article = document.createElement('article');
        article.className = 'products__card';
        // assign dataset for click navigation
        const pid = p.id || ('admin-' + idx + '-' + Date.now());
        article.dataset.id = pid;
        article.dataset.title = p.title || 'Product';
        article.dataset.price = (typeof p.price === 'number') ? String(p.price) : String((parseFloat(String(p.price).replace(/[^0-9.\-]/g,''))||0));
        article.dataset.image = p.image || 'assets/img/product1.png';
        article.dataset.description = p.description || '';
        article.innerHTML = `\
            <img src="${escapeHtml(p.image || 'assets/img/product1.png')}" alt="${escapeHtml(p.title)}" class="products__img">\
            <h3 class="products__title">${escapeHtml(p.title)}</h3>\
            <span class="products__price">${escapeHtml(((parseFloat(String(p.price).replace(/[^0-9.\-]/g,''))||0)).toFixed(2))}</span>\
            <button class="products__button">\
                <i class='bx bx-shopping-bag'></i>\
            </button>`;
        container.appendChild(article);
    })
    // re-wire buttons and product clicks for dynamically rendered items
    wireAddButtons();
    wireProductClicks();
}

document.addEventListener('DOMContentLoaded', renderSiteProductsFromAdmin);

/*=============== CART LOGIC (add/remove/update) ===============*/
const CART_KEY = 'site_cart_v1';
const cartContainer = document.querySelector('.cart__container');
const cartPricesItem = document.querySelector('.cart__prices-item');
const cartPricesTotal = document.querySelector('.cart__prices-total');

function loadCart(){
    try{ const raw = localStorage.getItem(CART_KEY); return raw?JSON.parse(raw):[] }catch(e){ return [] }
}

function saveCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)) }

function formatCurrency(v){
    const n = parseFloat(String(v).replace(/[^0-9.\-]/g,'')) || 0;
    return '$' + n.toFixed(2);
}

function renderCart(){
    if(!cartContainer) return;
    const items = loadCart();
    cartContainer.innerHTML = '';
    items.forEach(it => {
        const article = document.createElement('article');
        article.className = 'cart__card';
        article.innerHTML = `
            <div class="cart__box">
                <img src="${escapeHtml(it.image||'assets/img/featured1.png')}" alt="" class="cart__img">
            </div>
            <div class="cart__details">
                <h3 class="cart__title">${escapeHtml(it.name)}</h3>
                <span class="cart__price">${formatCurrency(it.price)}</span>

                <div class="cart__amount">
                    <div class="cart__amount-content">
                        <span class="cart__amount-box">
                            <i class='bx bx-minus' ></i>
                        </span>

                        <span class="cart__amount-number">${it.qty}</span>

                        <span class="cart__amount-box">
                            <i class='bx bx-plus' ></i>
                        </span>
                    </div>

                    <i class='bx bx-trash-alt cart__amount-trash' ></i>
                </div>
            </div>`;
        cartContainer.appendChild(article);
    })
    // update totals
    const totalItems = items.reduce((s,i)=>s + (i.qty||0),0);
    const totalPrice = items.reduce((s,i)=>s + ((parseFloat(String(i.price).replace(/[^0-9.\-]/g,''))||0) * (i.qty||0)),0);
    if(cartPricesItem) cartPricesItem.textContent = `${totalItems} item${totalItems!==1?'s':''}`;
    if(cartPricesTotal) cartPricesTotal.textContent = formatCurrency(totalPrice);
}

function addToCartFromElement(el){
    // el is the button inside a card; find containing article
    const article = el.closest('article');
    if(!article) return;
    const nameEl = article.querySelector('h3, h1');
    const priceEl = article.querySelector('span[class*="price"]');
    const imgEl = article.querySelector('img');
    const name = nameEl? nameEl.textContent.trim() : 'Product';
    const price = priceEl? priceEl.textContent.trim().replace('$','') : '0';
    const image = imgEl? imgEl.getAttribute('src') : '';

    const items = loadCart();
    const existing = items.find(i=>i.name === name && String(i.price) === String(price));
    if(existing){ existing.qty = (existing.qty||0) + 1; }
    else{ items.push({ name, price: parseFloat(price)||0, qty:1, image }); }
    saveCart(items);
    renderCart();
    // show cart panel
    if(cart) cart.classList.add('show-cart');
}

// wire add-to-cart buttons
function wireAddButtons(){
    const selectors = ['.featured__button', '.products__button', '.new__button', '.home__button', '.button.home__button'];
    const buttons = document.querySelectorAll(selectors.join(','));
    buttons.forEach(b => b.addEventListener('click', (e)=>{ e.preventDefault(); addToCartFromElement(b); }));
}

// cart container delegation: plus/minus/trash
if(cartContainer){
    cartContainer.addEventListener('click', (e)=>{
        const plus = e.target.closest('.bx-plus');
        const minus = e.target.closest('.bx-minus');
        const trash = e.target.closest('.cart__amount-trash');
        if(plus || minus || trash){
            const card = e.target.closest('.cart__card');
            if(!card) return;
            const title = card.querySelector('.cart__title').textContent.trim();
            const price = card.querySelector('.cart__price').textContent.trim().replace('$','');
            const items = loadCart();
            const idx = items.findIndex(i=>i.name===title && String(i.price) === String(price));
            if(idx === -1) return;
            if(plus){ items[idx].qty = (items[idx].qty||0) + 1 }
            else if(minus){ items[idx].qty = Math.max(1, (items[idx].qty||1) - 1) }
            else if(trash){ items.splice(idx,1) }
            saveCart(items);
            renderCart();
        }
    })
}

// Product click navigation to details page
const REGISTRY_KEY = 'catalog_registry_v1';
function addToRegistry(p){
    try{
        const arr = JSON.parse(localStorage.getItem(REGISTRY_KEY) || '[]');
        const exists = arr.find(x => String(x.id) === String(p.id));
        if(!exists){ arr.push(p); localStorage.setItem(REGISTRY_KEY, JSON.stringify(arr)); }
    }catch(e){ /* ignore */ }
}

function wireProductClicks(){
    const cards = document.querySelectorAll('.products__card, .featured__card, .new__card');
    cards.forEach(card => {
        // prevent duplicate listeners
        if(card.__wiredClick) return; card.__wiredClick = true;
        card.addEventListener('click', (e) => {
            // ignore clicks on add-to-cart buttons
            if(e.target.closest('.products__button, .featured__button, .new__button, .home__button')) return;
            const imgEl = card.querySelector('img');
            const titleEl = card.querySelector('h3, h2, h1');
            const priceEl = card.querySelector('span[class*="price"]');
            const product = {
                id: card.dataset.id || (titleEl? titleEl.textContent.trim() : 'product') + '-' + (Date.now()),
                title: card.dataset.title || (titleEl? titleEl.textContent.trim() : 'Product'),
                price: card.dataset.price || (priceEl? String(priceEl.textContent).replace(/[^0-9.\-]/g,'') : '0'),
                image: card.dataset.image || (imgEl? imgEl.getAttribute('src') : ''),
                description: card.dataset.description || ''
            };
            localStorage.setItem('last_clicked_product', JSON.stringify(product));
            addToRegistry(product);
            // navigate
            const url = new URL(location.origin + location.pathname.replace(/[^\/]*$/, 'product.html'));
            url.searchParams.set('id', product.id);
            location.href = url.toString();
        });
    });
}

// initialize cart and add/product button wiring after DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
    renderCart();
    wireAddButtons();
    wireProductClicks();
});
