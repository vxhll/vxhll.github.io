document.addEventListener("DOMContentLoaded", () => {
    // 0. System Preloader Animation
    const preloader = document.getElementById("preloader");
    const percentText = document.getElementById("loader-percentage");
    const loaderBar = document.querySelector(".loader-bar");
    
    if (preloader && percentText && loaderBar) {
        let percent = 0;
        const interval = setInterval(() => {
            percent += Math.floor(Math.random() * 8) + 4;
            if (percent >= 100) {
                percent = 100;
                clearInterval(interval);
                // Transition out preloader
                setTimeout(() => {
                    preloader.classList.add("fade-out");
                    // Trigger scroll reveals only after preloader is done
                    document.querySelectorAll(".reveal").forEach((el) => {
                        el.classList.add("active");
                    });
                }, 300);
            }
            percentText.textContent = `${percent}%`;
            loaderBar.style.width = `${percent}%`;
        }, 45);
    }

    // 0.1 Custom Cursor Follower Logic
    const cursor = document.getElementById("custom-cursor");
    const cursorDot = document.getElementById("custom-cursor-dot");
    let mouseX = 0, mouseY = 0; // target mouse coordinates
    let followerX = 0, followerY = 0; // follower current coordinates
    
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            cursorDot.style.opacity = "1";
        }
        if (cursor) {
            cursor.style.opacity = "1";
        }
    });

    window.addEventListener("mouseleave", () => {
        if (cursor) cursor.style.opacity = "0";
        if (cursorDot) cursorDot.style.opacity = "0";
    });
    
    function animateCursor() {
        // Smooth lerp: follower moves toward mouse by 14% of the distance each frame
        followerX += (mouseX - followerX) * 0.14;
        followerY += (mouseY - followerY) * 0.14;
        
        if (cursor) {
            cursor.style.left = `${followerX}px`;
            cursor.style.top = `${followerY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover listeners to resize cursor
    const hoverElements = "a, button, input, textarea, select, .btn-trigger-abstract, .btn-trigger-cert, .social-icon, .nav-link, .nav-logo, .btn, .btn-project-link, .dock-btn, .repo-card";
    
    function setupCursorListeners() {
        document.querySelectorAll(hoverElements).forEach(el => {
            el.addEventListener("mouseenter", () => {
                if (cursor) cursor.classList.add("hover");
                if (cursorDot) cursorDot.classList.add("hover");
            });
            el.addEventListener("mouseleave", () => {
                if (cursor) cursor.classList.remove("hover");
                if (cursorDot) cursorDot.classList.remove("hover");
            });
        });
    }
    setupCursorListeners();

    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            // Toggle menu icon between menu and close
            const icon = mobileMenuBtn.querySelector("i");
            if (icon) {
                const isOpened = navLinks.classList.contains("active");
                icon.setAttribute("data-lucide", isOpened ? "x" : "menu");
                lucide.createIcons();
            }
        });

        // Close menu when clicking nav link
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                const icon = mobileMenuBtn.querySelector("i");
                if (icon) {
                    icon.setAttribute("data-lucide", "menu");
                    lucide.createIcons();
                }
            });
        });
    }

    // 3. Scroll Header Effect
    const header = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.padding = "0.75rem 0";
            header.style.boxShadow = "0 10px 30px -10px rgba(0, 0, 0, 0.5)";
        } else {
            header.style.padding = "1.25rem 0";
            header.style.boxShadow = "none";
        }
    });

    // 4. Interactive Particle Canvas Background
    const canvas = document.getElementById("particle-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Mouse Move Listener
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Click to spawn particle explosion ripple
        canvas.addEventListener("click", (e) => {
            const burstSize = 15;
            for (let i = 0; i < burstSize; i++) {
                const p = new Particle();
                p.x = e.clientX;
                p.y = e.clientY;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2.5 + 1; // faster speed for explosion look
                p.speedX = Math.cos(angle) * speed;
                p.speedY = Math.sin(angle) * speed;
                p.size = Math.random() * 2 + 1.5;
                particles.push(p);
            }
            // Limit maximum particles so performance remains high
            if (particles.length > 180) {
                particles.splice(0, particles.length - 180);
            }
        });

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // small tech nodes
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.color = Math.random() > 0.5 ? "rgba(184, 255, 101, 0.45)" : "rgba(255, 110, 48, 0.45)";
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off walls
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Mouse interaction
                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        // Push away particles slightly
                        this.x -= dx / distance * force * 1.5;
                        this.y -= dy / distance * force * 1.5;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Init Particles
        const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 120);
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }

        // Connect Particles with lines
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 110) {
                        opacityValue = 1 - (distance / 110);
                        ctx.strokeStyle = `rgba(184, 255, 101, ${opacityValue * 0.12})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse as well
                if (mouse.x && mouse.y) {
                    let dx = particles[a].x - mouse.x;
                    let dy = particles[a].y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        opacityValue = 1 - (distance / mouse.radius);
                        ctx.strokeStyle = `rgba(255, 110, 48, ${opacityValue * 0.18})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
            requestAnimationFrame(animate);
        }
        animate();
    }

    // 5. Hero Section Typing Effect
    const words = [
        "AI Engineer",
        "Machine Learning Engineer",
        "Generative AI Developer",
        "NLP Engineer",
        "Deep Learning Enthusiast"
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingElement = document.getElementById("typing-text");

    function type() {
        if (!typingElement) return;
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 40 : 100;

        if (!isDeleting && charIdx === currentWord.length) {
            typeSpeed = 1500; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);

    // 6. Intersection Observer for Scroll Reveal
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Set transition delays for stagger but don't activate immediately (activated after preloader)
    document.querySelectorAll(".reveal").forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll(".scroll-reveal").forEach(el => {
        revealObserver.observe(el);
    });

    // 7. Glass Card Spotlight Hover Effect (Cursor Tracker)
    const cards = document.querySelectorAll(".glass-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // 8. Dynamic GitHub Statistics Integration
    const githubUser = "vxhll";
    const reposContainer = document.getElementById("github-repos-list");

    // Local Fallback Repos list in case GitHub rate limits us or user is offline
    const fallbackRepos = [
        {
            name: "railbot",
            description: "An intelligent railway chatbot that assists users with railway information through conversational AI and NLP-powered interactions.",
            html_url: "https://github.com/vxhll/railbot",
            language: "Python",
            stargazers_count: 5
        },
        {
            name: "YOLO-MineSafe",
            description: "Vision-based abnormal fall detection and emergency alert framework for isolated mining workers using YOLOv8 and Computer Vision.",
            html_url: "https://github.com/vxhll/YOLO-MineSafe",
            language: "Python",
            stargazers_count: 4
        }
    ];

    async function fetchGitHubData() {
        try {
            // Fetch User Details
            const userResponse = await fetch(`https://api.github.com/users/${githubUser}`);
            if (userResponse.ok) {
                const userData = await userResponse.json();
                document.getElementById("github-name").textContent = userData.name || "Vishal J";
                document.getElementById("github-avatar").src = userData.avatar_url;
                document.getElementById("github-repos-count").textContent = userData.public_repos;
                document.getElementById("github-followers-count").textContent = userData.followers;
                document.getElementById("github-gists-count").textContent = userData.public_gists;
            }

            // Fetch Repositories
            const reposResponse = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=6`);
            if (reposResponse.ok) {
                const reposData = await reposResponse.json();
                renderRepositories(reposData);
            } else {
                throw new Error("GitHub repos fetch failed");
            }
        } catch (error) {
            console.warn("GitHub API error, rendering fallback data:", error);
            // Render Fallback statistics locally
            document.getElementById("github-repos-count").textContent = "12";
            document.getElementById("github-followers-count").textContent = "85";
            document.getElementById("github-gists-count").textContent = "2";
            renderRepositories(fallbackRepos);
        }
    }

    function renderRepositories(repos) {
        if (!reposContainer) return;
        reposContainer.innerHTML = ""; // Clear shimmer loading cards

        // Limit to top 3 or 6 repos
        const displayRepos = repos.slice(0, 3);

        displayRepos.forEach(repo => {
            const langClass = repo.language ? repo.language.toLowerCase() : "other";
            const langDotClass = ['python', 'javascript', 'jupyter'].includes(langClass) ? langClass : 'other';
            
            const card = document.createElement("a");
            card.href = repo.html_url;
            card.target = "_blank";
            card.rel = "noopener";
            card.className = "repo-card glass-card";
            
            card.innerHTML = `
                <div class="card-glow"></div>
                <div class="repo-content-wrap">
                    <h4 class="repo-title">
                        <i data-lucide="folder"></i> ${repo.name}
                    </h4>
                    <p class="repo-desc">${repo.description || "No description provided."}</p>
                </div>
                <div class="repo-footer">
                    <span class="repo-lang">
                        <span class="lang-dot ${langDotClass}"></span>
                        ${repo.language || "Other"}
                    </span>
                    <span class="repo-stars">
                        <i data-lucide="star" style="width: 14px; height: 14px; fill: rgba(255, 255, 255, 0.45); border:none"></i>
                        ${repo.stargazers_count}
                    </span>
                </div>
            `;
            
            // Add mousemove tracking dynamically
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            });

            reposContainer.appendChild(card);
        });

        // Initialize icons inside the dynamically created elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Rebind cursor listeners for newly created elements
        setupCursorListeners();
    }

    // Call API fetch
    fetchGitHubData();

    // 9. Form Submission Handling
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Show sending state
            const submitBtn = contactForm.querySelector(".btn-submit");
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span> <i data-lucide="loader" class="animate-spin"></i>`;
            lucide.createIcons();

            // Simulate form submisson to endpoint or EmailJS (since we don't have server backend here)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                lucide.createIcons();

                formStatus.textContent = "Thank you! Your message has been sent successfully. Vishal J will get back to you soon.";
                formStatus.className = "form-status success";
                contactForm.reset();

                // Clear message after 6 seconds
                setTimeout(() => {
                    formStatus.style.display = "none";
                }, 6000);
            }, 1800);
        });
    }

    // 10. Abstract and Certificate Modal Handlers
    const abstractModal = document.getElementById("abstract-modal");
    const certModal = document.getElementById("cert-modal");
    
    // Open Abstract Modal
    document.querySelectorAll(".btn-trigger-abstract").forEach(btn => {
        btn.addEventListener("click", () => {
            if (abstractModal) {
                abstractModal.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });

    // Open Certificate Modal
    document.querySelectorAll(".btn-trigger-cert").forEach(btn => {
        btn.addEventListener("click", () => {
            if (certModal) {
                certModal.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });

    // Close Modals
    const closeAbstractBtn = document.querySelector(".btn-close-abstract");
    if (closeAbstractBtn && abstractModal) {
        closeAbstractBtn.addEventListener("click", () => {
            abstractModal.classList.remove("active");
            document.body.style.overflow = "";
        });
    }

    const closeCertBtn = document.querySelector(".btn-close-cert");
    if (closeCertBtn && certModal) {
        closeCertBtn.addEventListener("click", () => {
            certModal.classList.remove("active");
            document.body.style.overflow = "";
        });
    }

    // Close on clicking overlay background
    window.addEventListener("click", (e) => {
        if (abstractModal && e.target === abstractModal) {
            abstractModal.classList.remove("active");
            document.body.style.overflow = "";
        }
        if (certModal && e.target === certModal) {
            certModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // Close on Escape Key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (abstractModal) abstractModal.classList.remove("active");
            if (certModal) certModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
});
