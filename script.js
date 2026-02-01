// ==========================================
// 1.(Global Scope)
// ==========================================
const productData = [
    { 
        id: 1, cat: 'perfumes', badge: 'الأكثر مبيعاً',
        nameAr: 'عطر الفخامة الملكي', nameEn: 'Royal Luxury', 
        price: 250, notes: 'العود، الجلود، أخشاب الساج', 
        img: 'images/p1.webp' 
    },
    { 
        id: 2, cat: 'perfumes', badge: 'جديد',
        nameAr: 'مسك الختام نسائي', nameEn: 'Misk Al-Khitam', 
        price: 180, notes: 'المسك الأبيض، زهرة اللوتس', 
        img: 'images/p2.webp' 
    },
    { 
        id: 8, cat: 'oud', badge: 'خصم لفترة محدودة',
        nameAr: 'عود كمبودي فاخر', nameEn: 'Cambodian Oud', 
        price: 450, notes: 'بخور طبيعي ثبات عالي', 
        img: 'images/p3.webp' 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 2. (Selectors)
    // ==========================================
    const htmlTag = document.documentElement;
    const grid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const langBtns = document.querySelectorAll('.langSwitcherBtn'); 
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggle = document.querySelector('.dropdown > a');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // ==========================================
    // 3. (Display Logic)
    // ==========================================
    function displayProducts(filter = 'all', query = '') {
        if (!grid) return;
        grid.innerHTML = '';

        let filtered = productData;
        if (filter !== 'all') filtered = filtered.filter(p => p.cat === filter);
        if (query) {
            filtered = filtered.filter(p => 
                p.nameAr.includes(query) || 
                p.nameEn.toLowerCase().includes(query.toLowerCase()) ||
                p.notes.includes(query)
            );
        }

        filtered.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'product-card reveal active';
            card.style.animationDelay = `${index * 0.05}s`;

            card.innerHTML = `
                <div class="pro-img">
                    ${p.badge ? `<span class="pro-badge">${p.badge}</span>` : ''}
                    <a href="product-details.html?id=${p.id}"><img src="${p.img}" alt="${p.nameAr}" onerror="this.src='https://via.placeholder.com/300x400?text=Incense'"></a>
                </div>
                <div class="pro-info">
                    <a href="product-details.html?id=${p.id}" class="pro-title-link">
                        <h3 class="lang-ar">${p.nameAr}</h3>
                        <h3 class="lang-en">${p.nameEn}</h3>
                    </a>
                    <p class="pro-notes"><i class="fas fa-wind"></i> ${p.notes}</p>
                    <div class="pro-price">${p.price} ⃁</div>
                    <div class="pro-buttons">
                        <button class="add-to-cart-btn" onclick="addToCart(${p.id})">
                            <i class="fas fa-cart-plus"></i> <span class="lang-ar">إضافة</span><span class="lang-en">Add</span>
                        </button>

                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // ==========================================
    // 4. (Bilingual Logic)
    // ==========================================
    function applyLanguage(lang) {
        htmlTag.setAttribute('lang', lang);
        htmlTag.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        
        langBtns.forEach(btn => {
            const textSpan = btn.querySelector('.langText');
            if (textSpan) {
                textSpan.textContent = lang === 'ar' ? 'English' : 'العربية';
            }
        });

        localStorage.setItem('incenseLang', lang);
        if (grid) displayProducts(); 
        updateCartBadge();
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentLang = htmlTag.getAttribute('lang') || 'ar';
            const nextLang = (currentLang === 'ar') ? 'en' : 'ar';
            applyLanguage(nextLang);
        });
    });

    const savedLang = localStorage.getItem('incenseLang') || 'ar';
    applyLanguage(savedLang);

    // ==========================================
    // 5. (Hamburger Menu)
    // ==========================================
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        });
    });


    if (dropdownToggle && window.innerWidth < 992) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            const icon = dropdownToggle.querySelector('i');
            if (icon) icon.style.transform = dropdownMenu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }

    // ==========================================
    // 7. البحث والفلترة والأنيميشن
    // ==========================================
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            displayProducts('all', e.target.value);
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            this.classList.add('active');
            displayProducts(this.getAttribute('data-filter'));
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
            else entry.target.classList.remove('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');
    if (category) displayProducts(category);
});

// ==========================================
// 9. (Global Functions)
// ==========================================

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('incenseCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
}

function addToCart(id) {
    const product = productData.find(p => p.id === id);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('incenseCart')) || [];
    let existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: product.id, nameAr: product.nameAr, nameEn: product.nameEn, price: product.price, img: product.img, quantity: 1 });
    }

    localStorage.setItem('incenseCart', JSON.stringify(cart));
    updateCartBadge();
    alert('تمت إضافة ' + product.nameAr + ' إلى السلة ✅');
}

function orderWhatsApp(productName) {
    const phoneNumber = "966503606971";
    const msg = encodeURIComponent(`أهلاً إنسينس للعطور، أريد الاستفسار عن: ${productName}`);
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank');
}
