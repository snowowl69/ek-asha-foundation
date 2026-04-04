/* ========================================
   EK ASHA FOUNDATION — MAIN JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('hidden'), 800);
        });
        // Fallback: hide after 3s even if load event doesn't fire
        setTimeout(() => preloader.classList.add('hidden'), 3000);
    }

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 400);
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ---- Mobile Menu ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // ---- Active Nav Link on Scroll ----
    const sections = document.querySelectorAll('section[id]');
    function setActiveLink() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', setActiveLink);

    // ---- Scroll Animations (Custom AOS) ----
    const animatedElements = document.querySelectorAll('[data-aos]');

    function checkAnimations() {
        const windowHeight = window.innerHeight;
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const delay = parseInt(el.getAttribute('data-aos-delay')) || 0;
            if (rect.top < windowHeight - 80) {
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, delay);
            }
        });
    }

    window.addEventListener('scroll', checkAnimations);
    window.addEventListener('resize', checkAnimations);
    // Initial check
    setTimeout(checkAnimations, 100);

    // ---- Counter Animation ----
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                counter.dataset.animated = 'true';
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    counter.textContent = current.toLocaleString();
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
                requestAnimationFrame(updateCounter);
            }
        });
    }

    window.addEventListener('scroll', animateCounters);
    setTimeout(animateCounters, 500);

    // ---- Progress Bars Animation ----
    function animateProgressBars() {
        const bars = document.querySelectorAll('.progress-bar');
        bars.forEach(bar => {
            if (bar.dataset.animated) return;
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                bar.dataset.animated = 'true';
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 300);
            }
        });
    }

    window.addEventListener('scroll', animateProgressBars);
    setTimeout(animateProgressBars, 500);

    // ---- Floating Particles ----
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // ---- Newsletter Form ----
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const btn = newsletterForm.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Subscribed!';
                btn.style.background = 'var(--secondary)';
                emailInput.value = '';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // ---- Gupt Daan (Anonymous Donation) Toggle ----
    const anonymousToggle = document.getElementById('anonymousToggle');
    const guptDaanToggle = document.getElementById('guptDaanToggle');
    const donorFields = document.getElementById('donorFields');
    const guptDaanMessage = document.getElementById('guptDaanMessage');
    const donateButtonText = document.getElementById('donateButtonText');

    if (anonymousToggle) {
        anonymousToggle.addEventListener('change', () => {
            const isAnonymous = anonymousToggle.checked;

            // Toggle visual state
            if (guptDaanToggle) guptDaanToggle.classList.toggle('active', isAnonymous);

            // Show/hide donor fields
            if (donorFields) {
                if (isAnonymous) {
                    donorFields.style.maxHeight = donorFields.scrollHeight + 'px';
                    requestAnimationFrame(() => {
                        donorFields.classList.add('hidden');
                    });
                    // Remove required from hidden fields
                    donorFields.querySelectorAll('input[required]').forEach(input => {
                        input.removeAttribute('required');
                        input.dataset.wasRequired = 'true';
                    });
                } else {
                    donorFields.classList.remove('hidden');
                    donorFields.style.maxHeight = donorFields.scrollHeight + 'px';
                    setTimeout(() => { donorFields.style.maxHeight = ''; }, 400);
                    // Restore required
                    donorFields.querySelectorAll('input[data-was-required]').forEach(input => {
                        input.setAttribute('required', '');
                        delete input.dataset.wasRequired;
                    });
                }
            }

            // Show/hide anonymous message
            if (guptDaanMessage) {
                guptDaanMessage.style.display = isAnonymous ? 'block' : 'none';
            }

            // Update button text
            if (donateButtonText) {
                donateButtonText.textContent = isAnonymous ? 'गुप्त दान करें' : 'Donate Now';
            }
        });
    }

    // ---- Donation Amount Buttons ----
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (customAmountInput) {
                customAmountInput.value = btn.getAttribute('data-amount');
            }
        });
    });

    // ---- Donation Form ----
    const donateForm = document.getElementById('donateForm');
    if (donateForm) {
        donateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = customAmountInput ? customAmountInput.value : '';
            const isAnonymous = anonymousToggle && anonymousToggle.checked;
            const name = isAnonymous ? 'गुप्त दानी (Anonymous)' : (document.getElementById('donorName')?.value || '');

            if (!amount || parseInt(amount) <= 0) {
                showToast('Please enter a valid donation amount.', 'error');
                return;
            }

            // Build UPI payment link
            const upiId = 'ekashafoundation@upi'; // Placeholder UPI ID
            const tn = isAnonymous ? 'Gupt Daan - Anonymous Donation' : ('Donation from ' + name);
            const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Ek Asha Foundation')}&am=${amount}&cu=INR&tn=${encodeURIComponent(tn)}`;

            // Show success modal
            showDonationModal(amount, name, upiLink, isAnonymous);
        });
    }

    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName')?.value || '';
            showToast(`Thank you ${name}! Your message has been received. We'll get back to you soon.`, 'success');
            contactForm.reset();
        });
    }

    // ---- Toast Notification ----
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${type === 'success' ? '#2d6a4f' : '#d32f2f'};
            color: white;
            padding: 16px 30px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.95rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 90vw;
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ---- Donation Modal ----
    function showDonationModal(amount, name, upiLink, isAnonymous = false) {
        const existing = document.querySelector('.donation-modal-overlay');
        if (existing) existing.remove();

        const thankYouName = isAnonymous ? '' : (name ? ', ' + name : '');
        const headerEmoji = isAnonymous ? '🙏' : '🙏';
        const headerText = isAnonymous
            ? 'गुप्त दान स्वीकार है!'
            : `Thank You${thankYouName}!`;
        const subText = isAnonymous
            ? `Your anonymous donation of <strong style="color: #e8713a;">₹${parseInt(amount).toLocaleString()}</strong> reflects the highest form of selfless giving. Your identity will remain completely private.`
            : `Your generous donation of <strong style="color: #e8713a;">₹${parseInt(amount).toLocaleString()}</strong> will make a real difference. Here's how you can complete your payment:`;
        const receiptNote = isAnonymous
            ? 'As a Gupt Daan, no personal records will be maintained. Thank you for your selfless generosity.'
            : 'For donation receipts, email us at ekashafoundation.adm@gmail.com';

        const overlay = document.createElement('div');
        overlay.className = 'donation-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(5px);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.3s;
        `;

        overlay.innerHTML = `
            <div class="donation-modal" style="
                background: white;
                border-radius: 20px;
                padding: 50px 40px;
                max-width: 500px;
                width: 100%;
                text-align: center;
                transform: scale(0.9);
                transition: transform 0.3s;
                box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            ">
                <div style="font-size: 3rem; margin-bottom: 15px;">${headerEmoji}</div>
                ${isAnonymous ? '<div style="display:inline-block;padding:5px 16px;background:#f0fdf4;border-radius:50px;font-size:0.75rem;font-weight:600;color:#2d6a4f;letter-spacing:1px;margin-bottom:12px;">गुप्त दान MODE</div>' : ''}
                <h2 style="font-family: 'Playfair Display', serif; font-size: 1.6rem; margin-bottom: 10px; color: #1a1a2e;">
                    ${headerText}
                </h2>
                <p style="color: #666; margin-bottom: 25px; line-height: 1.7;">
                    ${subText}
                </p>
                <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 20px; text-align: left;">
                    <h4 style="font-size: 0.9rem; margin-bottom: 12px; color: #333;">Payment Options:</h4>
                    <div style="margin-bottom: 10px; font-size: 0.88rem; color: #555;">
                        <strong>1. UPI:</strong> Send to <code style="background: #fff3e0; padding: 2px 8px; border-radius: 4px; color: #e8713a;">ekashafoundation@upi</code>
                    </div>
                    <div style="margin-bottom: 10px; font-size: 0.88rem; color: #555;">
                        <strong>2. Bank Transfer:</strong><br>
                        &nbsp;&nbsp;A/C Name: Ek Asha Foundation<br>
                        &nbsp;&nbsp;Contact: +91 92150 00448
                    </div>
                    <div style="font-size: 0.88rem; color: #555;">
                        <strong>3. In Person:</strong> Visit our office at Keshav Market, Kaithal
                    </div>
                </div>
                <p style="font-size: 0.78rem; color: #999; margin-bottom: 20px;">
                    ${receiptNote}
                </p>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <a href="${upiLink}" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 28px;
                        background: #e8713a;
                        color: white;
                        border-radius: 50px;
                        font-weight: 600;
                        font-size: 0.9rem;
                        text-decoration: none;
                    ">
                        <i class="fas fa-mobile-alt"></i> Pay via UPI
                    </a>
                    <button class="close-modal" style="
                        padding: 12px 28px;
                        background: transparent;
                        color: #666;
                        border: 2px solid #e9ecef;
                        border-radius: 50px;
                        font-weight: 600;
                        font-size: 0.9rem;
                        cursor: pointer;
                        font-family: inherit;
                    ">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.donation-modal').style.transform = 'scale(1)';
        });

        // Close handlers
        const closeBtn = overlay.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => closeModal(overlay));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay);
        });
    }

    function closeModal(overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('.donation-modal').style.transform = 'scale(0.9)';
        setTimeout(() => overlay.remove(), 300);
    }

    // ---- Smooth Scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
});
