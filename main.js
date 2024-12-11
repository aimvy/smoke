document.addEventListener('DOMContentLoaded', () => {
    let vantaEffect = null;
    let currentSpeed = 0.35;
    let targetSpeed = 0.35;
    let currentZoom = 0.35;  // Zoom légèrement augmenté
    let targetZoom = 0.35;
    let scrollTimeout;

    // Configuration des thèmes pour l'effet VANTA
    const vantaConfigs = {
        dark: {
            highlightColor: 0xff0000,
            midtoneColor: 0x990000,
            lowlightColor: 0x330000,
            baseColor: 0x000000,
            blurFactor: 0.60,
            speed: currentSpeed,
            zoom: currentZoom
        },
        light: {
            highlightColor: 0xff3333,
            midtoneColor: 0xff0000,
            lowlightColor: 0xcc0000,
            baseColor: 0xffefef,
            blurFactor: 0.45,
            speed: currentSpeed,
            zoom: currentZoom
        }
    };

    function updateEffect(newSpeed, newZoom) {
        if (vantaEffect && vantaEffect.options) {
            vantaEffect.setOptions({
                speed: newSpeed,
                zoom: newZoom
            });
        }
    }

    let lastScrollTop = 0;
    let scrollVelocity = 0;
    let animationFrameId = null;

    function updateVelocity() {
        const currentScrollTop = window.pageYOffset;
        const delta = Math.abs(currentScrollTop - lastScrollTop);
        scrollVelocity = Math.min(delta * 0.015, 4);
        lastScrollTop = currentScrollTop;

        // Calcul de la vitesse uniquement
        targetSpeed = 0.35 + (scrollVelocity * 3.5);
        
        // Animation de la vitesse
        currentSpeed += (targetSpeed - currentSpeed) * 0.2;
        
        updateEffect(currentSpeed, currentZoom);

        if (scrollVelocity > 0) {
            scrollVelocity *= 0.92;
            animationFrameId = requestAnimationFrame(updateVelocity);
        } else if (currentSpeed > 0.36) {
            animationFrameId = requestAnimationFrame(updateVelocity);
        }
    }

    function handleScroll() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(updateVelocity);

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            targetSpeed = 0.35;
            updateVelocity();
        }, 150);
    }

    function initVanta(theme) {
        if (vantaEffect) {
            vantaEffect.destroy();
        }

        vantaEffect = VANTA.FOG({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            ...vantaConfigs[theme],
            speed: currentSpeed,
            zoom: currentZoom
        });

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        initVanta(newTheme);
        
        localStorage.setItem('theme', newTheme);
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    initVanta(savedTheme);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });
});
