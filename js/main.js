/* Ek Asha Foundation - Main JS */

document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 50);
        if (backToTop) backToTop.classList.toggle('visible', y > 400);
    });

    // trigger on load
    if (navbar && window.scrollY > 50) navbar.classList.add('scrolled');

    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const h = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + h) {
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            if (input && input.value) {
                const btn = newsletterForm.querySelector('button');
                btn.textContent = 'Subscribed!';
                btn.style.background = 'var(--secondary)';
                input.value = '';
                setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
            }
        });
    }

    // Gupt Daan toggle
    const anonymousToggle = document.getElementById('anonymousToggle');
    const guptDaanToggle = document.getElementById('guptDaanToggle');
    const donorFields = document.getElementById('donorFields');
    const guptDaanMessage = document.getElementById('guptDaanMessage');
    const donateButtonText = document.getElementById('donateButtonText');

    if (anonymousToggle) {
        anonymousToggle.addEventListener('change', () => {
            const on = anonymousToggle.checked;
            if (guptDaanToggle) guptDaanToggle.classList.toggle('active', on);

            if (donorFields) {
                if (on) {
                    donorFields.classList.add('hidden');
                    donorFields.querySelectorAll('input[required]').forEach(i => {
                        i.removeAttribute('required');
                        i.dataset.wasRequired = 'true';
                    });
                } else {
                    donorFields.classList.remove('hidden');
                    donorFields.querySelectorAll('input[data-was-required]').forEach(i => {
                        i.setAttribute('required', '');
                        delete i.dataset.wasRequired;
                    });
                }
            }

            if (guptDaanMessage) guptDaanMessage.style.display = on ? 'block' : 'none';
            if (donateButtonText) donateButtonText.textContent = on ? 'गुप्त दान करें' : 'Donate Now';
        });
    }

    // Donation amounts
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (customAmountInput) customAmountInput.value = btn.getAttribute('data-amount');
        });
    });

    // Donate form
    const donateForm = document.getElementById('donateForm');
    if (donateForm) {
        donateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = customAmountInput ? customAmountInput.value : '';
            const isAnon = anonymousToggle && anonymousToggle.checked;
            const name = isAnon ? 'Anonymous' : (document.getElementById('donorName')?.value || '');

            if (!amount || parseInt(amount) <= 0) {
                showToast('Please enter a valid amount.', 'error');
                return;
            }

            const upiId = 'ekashafoundation@upi';
            const note = isAnon ? 'Gupt Daan' : ('Donation from ' + name);
            const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Ek Asha Foundation')}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

            showDonationModal(amount, name, upiLink, isAnon);
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName')?.value || '';
            showToast(`Thank you ${name}! We'll get back to you soon.`, 'success');
            contactForm.reset();
        });
    }

    // Toast
    function showToast(message, type) {
        const old = document.querySelector('.ea-toast');
        if (old) old.remove();

        const t = document.createElement('div');
        t.className = 'ea-toast';
        t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        Object.assign(t.style, {
            position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%) translateY(80px)',
            background: type === 'success' ? '#2d6a4f' : '#d32f2f', color: '#fff',
            padding: '14px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center',
            gap: '8px', fontSize: '0.9rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: '10000', transition: 'transform 0.3s', maxWidth: '90vw'
        });
        document.body.appendChild(t);
        requestAnimationFrame(() => { t.style.transform = 'translateX(-50%) translateY(0)'; });
        setTimeout(() => {
            t.style.transform = 'translateX(-50%) translateY(80px)';
            setTimeout(() => t.remove(), 300);
        }, 3500);
    }

    // Donation modal
    function showDonationModal(amount, name, upiLink, isAnon) {
        const old = document.querySelector('.ea-modal-overlay');
        if (old) old.remove();

        const heading = isAnon ? 'गुप्त दान स्वीकार है!' : `Thank You${name ? ', ' + name : ''}!`;
        const desc = isAnon
            ? `Your anonymous donation of <strong>₹${parseInt(amount).toLocaleString()}</strong> reflects selfless giving.`
            : `Your donation of <strong>₹${parseInt(amount).toLocaleString()}</strong> will make a real difference.`;

        const overlay = document.createElement('div');
        overlay.className = 'ea-modal-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)', zIndex: '10001', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '20px',
            opacity: '0', transition: 'opacity 0.25s'
        });

        overlay.innerHTML = `
            <div style="background:#fff;border-radius:12px;padding:40px 32px;max-width:460px;width:100%;text-align:center;box-shadow:0 16px 48px rgba(0,0,0,0.15);">
                <div style="font-size:2.5rem;margin-bottom:12px;">🙏</div>
                <h2 style="font-family:'Playfair Display',serif;font-size:1.4rem;margin-bottom:8px;color:#1a1a2e;">${heading}</h2>
                <p style="color:#666;margin-bottom:20px;line-height:1.6;font-size:0.92rem;">${desc}</p>
                <div style="background:#f8f9fa;border-radius:8px;padding:20px;text-align:left;margin-bottom:16px;">
                    <p style="font-size:0.85rem;color:#555;margin-bottom:8px;"><strong>UPI:</strong> ekashafoundation@upi</p>
                    <p style="font-size:0.85rem;color:#555;margin-bottom:8px;"><strong>Bank Transfer:</strong> Call +91 92150 00448</p>
                    <p style="font-size:0.85rem;color:#555;"><strong>In Person:</strong> Keshav Market, Kaithal</p>
                </div>
                <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                    <a href="${upiLink}" style="padding:10px 22px;background:#e8713a;color:#fff;border-radius:6px;font-weight:600;font-size:0.88rem;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
                        <i class="fas fa-mobile-alt"></i> Pay via UPI
                    </a>
                    <button class="close-modal-btn" style="padding:10px 22px;background:transparent;color:#666;border:1px solid #e9ecef;border-radius:6px;font-weight:600;font-size:0.88rem;cursor:pointer;font-family:inherit;">Close</button>
                </div>
            </div>`;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => { overlay.style.opacity = '1'; });

        overlay.querySelector('.close-modal-btn').addEventListener('click', () => closeModal(overlay));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay); });
    }

    function closeModal(el) {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 250);
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });
});