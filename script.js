// مصفوفة البيانات يجب أن تكون في البداية لتكون متاحة لكل الوظائف
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
    // يمكنك إضافة باقي الـ 26 منتج هنا بنفس التنسيق
];

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. تعريف العناصر (المرتبطة بالـ HTML) ---
    const langBtn = document.getElementById('langSwitcher');
    const htmlTag = document.documentElement;
    const grid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const menuBtn = document.getElementById('mobile-menu-btn'); // تأكد أن الـ ID مطابق في الـ HTML
    const navMenu = document.getElementById('nav-menu');

    // --- 2. وظيفة عرض المنتجات ---
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
                    <a href="product-details.html?id=${p.id}"><img src="${p.img}" alt="${p.nameAr}"></a>
                </div>
                <div class="pro-info">
                    <a href="product-details.html?id=${p.id}" class="pro-title-link">
                        <h3 class="lang-ar">${p.nameAr}</h3>
                        <h3 class="lang-en">${p.nameEn}</h3>
                    </a>
                    <p class="pro-notes"><i class="fas fa-wind"></i> ${p.notes}</p>
                    <div class="pro-price">${p.price} SAR</div>
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

    // --- 3. معالجة تبديل اللغة ---
    function applyLanguage(lang) {
        htmlTag.setAttribute('lang', lang);
        htmlTag.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        if (langBtn) {
            langBtn.innerHTML = lang === 'ar' ? '<i class="fas fa-globe"></i> English' : '<i class="fas fa-globe"></i> العربية';
        }
        localStorage.setItem('incenseLang', lang);
        displayProducts(); // تحديث المنيو باللغة الجديدة
        updateCartBadge();
    }

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const currentLang = htmlTag.getAttribute('lang') || 'ar';
            applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
        });
    }

    // تطبيق اللغة المحفوظة أو العربية كافتراضية
    const savedLang = localStorage.getItem('incenseLang') || 'ar';
    applyLanguage(savedLang);

     const navLinks = document.querySelector('.nav-links'); // تأكد إن السطر ده بيجيب الـ UL

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // إضافة كلاس active للقائمة نفسها
            navLinks.classList.toggle('active');
            
            // تغيير شكل الأيقونة
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times'; // علامة X
            } else {
                icon.className = 'fas fa-bars'; // تلات شرطات
            }
        });
    }

    // --- 5. البحث والفلترة ---
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

    // --- 6. أنيميشن السكرول (Reveal) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 7. تشغيل الفلتر من الرابط (URL Params) ---
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');
    if (category) displayProducts(category);

});

// ==========================================
// وظائف عالمية (Global) - خارج DOMContentLoaded
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
        cart.push({
            id: product.id,
            nameAr: product.nameAr,
            nameEn: product.nameEn,
            price: product.price,
            img: product.img,
            quantity: 1
        });
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
