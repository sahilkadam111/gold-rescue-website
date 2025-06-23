document.addEventListener('DOMContentLoaded', () => {
    // Cache frequently accessed DOM elements
    const mobileNav = document.getElementById('mobile-nav-links');
    const hamburgerButton = document.getElementById('hamburger');
    const slideshowImages = document.querySelectorAll('.slideshow-img');
    
    const calculateLoanButton = document.getElementById('calculateLoan');
    const goldWeightInput = document.getElementById('goldWeight');
    const goldPurityInput = document.getElementById('goldPurity');
    const loanTenureInput = document.getElementById('loanTenure');
    const calculatorResult = document.getElementById('calculatorResult');
    const displayGoldValue = document.getElementById('displayGoldValue');
    const displayLoanAmount = document.getElementById('displayLoanAmount');
    const displayEMI = document.getElementById('displayEMI');

    // Smooth scrolling for navigation links (delegating to a common ancestor might be more performant for many links, but this is fine for a few)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            // Close mobile menu after clicking a link (using cached mobileNav)
            if (mobileNav && mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
            }
        });
    });

    // Hamburger menu functionality
    if (hamburgerButton && mobileNav) { // mobileNav is already cached as mobileNavLinks
        hamburgerButton.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            // Toggle aria-expanded for accessibility
            const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true' || false;
            hamburgerButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Hero Section Slideshow
    let currentSlide = 0;

    function showSlide(index) {
        slideshowImages.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideshowImages.length;
        showSlide(currentSlide);
    }

    if (slideshowImages.length > 0) {
        showSlide(currentSlide); // Show the first slide initially
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Gold Loan Calculator Logic
    if (calculateLoanButton) {
        calculateLoanButton.addEventListener('click', () => {
            // Safely get values, defaulting to 0 if input elements are not found or values are empty/invalid
            const goldWeight = parseFloat(goldWeightInput ? goldWeightInput.value : '0');
            const goldPurity = parseFloat(goldPurityInput ? goldPurityInput.value : '0');
            const loanTenure = parseInt(loanTenureInput ? loanTenureInput.value : '0');

            // Basic validation for positive numbers
            if (goldWeight <= 0 || goldPurity <= 0 || loanTenure <= 0 || isNaN(goldWeight) || isNaN(goldPurity) || isNaN(loanTenure)) {
                showMessageBox('Please enter valid positive numbers for Gold Weight, Purity, and Loan Tenure.');
                if (calculatorResult) calculatorResult.classList.add('hidden'); // Ensure result is hidden on error
                return;
            }

            // Disclaimer: This is a simplified calculation and does not represent actual market values or bank policies.
            // Using a hypothetical current market price for 24K gold (e.g., 6500 INR/gram)
            const current24kGoldPricePerGram = 6500; // This would vary daily

            // Adjust price based on purity (e.g., 22K is 22/24 of 24K price)
            const effectiveGoldPricePerGram = current24kGoldPricePerGram * (goldPurity / 24);

            // Estimated Gold Value
            const estimatedGoldValue = goldWeight * effectiveGoldPricePerGram;

            // Max loan amount (e.g., 75% of gold value, this is a common practice but varies)
            const maxLoanPercentage = 0.75;
            const maxLoanAmount = estimatedGoldValue * maxLoanPercentage;

            // Simplified annual interest rate for EMI calculation (e.g., 12% annual).
            // This could be made an input field if desired.
            const annualInterestRate = 12; // Example: 12%
            const monthlyInterestRate = (annualInterestRate / 12) / 100;

            let emi = 0;
            if (monthlyInterestRate > 0) {
                emi = (maxLoanAmount * monthlyInterestRate * Math.pow((1 + monthlyInterestRate), loanTenure)) / (Math.pow((1 + monthlyInterestRate), loanTenure) - 1);
            } else {
                // If interest rate is 0, EMI is simply loan amount / tenure
                emi = maxLoanAmount / loanTenure;
            }

            // Update display elements safely
            if (displayGoldValue) displayGoldValue.textContent = `₹ ${estimatedGoldValue.toFixed(2)}`;
            if (displayLoanAmount) displayLoanAmount.textContent = `₹ ${maxLoanAmount.toFixed(2)}`;
            if (displayEMI) displayEMI.textContent = `₹ ${emi.toFixed(2)}`;
            
            if (calculatorResult) calculatorResult.classList.remove('hidden'); // Show the result
        });
    }

    // Intersection Observer for fade-in/slide-in animations
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-in-up, .animate-slide-in-left');
    const appearOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Shrink the viewport slightly to trigger earlier
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                // Remove the initial opacity/transform properties to let CSS animations take over
                entry.target.style.opacity = '';
                entry.target.style.transform = '';

                // Add a class that triggers the animation (e.g., a specific animation class)
                // For existing animations, simply ensuring they are visible will make them play
                // as their styles are already set by the respective animate- classes in CSS.
                // The delay is also handled by CSS.

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    animatedElements.forEach(element => {
        // Apply initial hidden state for animation
        element.style.opacity = '0';
        if (element.classList.contains('animate-slide-in-up')) {
            element.style.transform = 'translateY(50px)';
        }
        if (element.classList.contains('animate-slide-in-left')) {
            element.style.transform = 'translateX(-50px)';
        }
        appearOnScroll.observe(element);
    });

    // Custom message box function (replaces alert())
    function showMessageBox(message) {
        // Remove existing message box if any
        const existingOverlay = document.getElementById('message-box-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        overlay.id = 'message-box-overlay';

        // Create message box
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 90%;
            min-width: 300px;
            position: relative;
        `;

        // Add message text
        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.cssText = `
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
            color: #333;
        `;

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'OK';
        closeButton.style.cssText = `
            background-color: #f59e0b; /* Tailwind yellow-500 */
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem; /* Tailwind rounded-md */
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
            border: none; /* Remove default button border */
        `;
        closeButton.onmouseover = () => closeButton.style.backgroundColor = '#d97706'; /* Tailwind yellow-600 */
        closeButton.onmouseout = () => closeButton.style.backgroundColor = '#f59e0b';
        closeButton.onclick = () => document.body.removeChild(overlay);

        messageBox.appendChild(messageText);
        messageBox.appendChild(closeButton);
        overlay.appendChild(messageBox);
        document.body.appendChild(overlay);
    }

    // Basic form submission handling (for demonstration)
    const contactForm = document.querySelector('#contact form');
    const contactNameInput = document.getElementById('contact-name');
    const contactPhoneInput = document.getElementById('contact-phone');
    const contactEmailInput = document.getElementById('contact-email');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // You can add form validation here before showing the message box
            const name = contactNameInput ? contactNameInput.value : '';
            const phone = contactPhoneInput ? contactPhoneInput.value : '';
            const email = contactEmailInput ? contactEmailInput.value : '';
            if (!name || !phone || !email) {
                showMessageBox('Please fill in all required fields (Name, Phone, Email).');
                return;
            }

            showMessageBox('Thank you for your inquiry! We will get back to you soon.');
            contactForm.reset(); // Clear the form
        });
    }

    // Internship Form Modal Logic
    const openInternshipFormBtn = document.getElementById('openInternshipFormBtn');
    const internshipFormModal = document.getElementById('internshipFormModal');
    const internshipFormModalContent = document.getElementById('internshipFormModalContent');
    const closeInternshipFormModalBtn = document.getElementById('closeInternshipFormModal');
    const internshipFormIframe = document.getElementById('internshipFormIframe');
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeXsrYlHuDJ_vmLSkKlUnudXIcH9ReWx-M13dtCdZ6whvxAzA/viewform?embedded=true';

    if (openInternshipFormBtn && internshipFormModal && internshipFormModalContent && closeInternshipFormModalBtn && internshipFormIframe) {
        openInternshipFormBtn.addEventListener('click', () => {
            internshipFormModal.classList.remove('opacity-0', 'pointer-events-none');
            internshipFormModalContent.classList.remove('scale-95');
            
            // Forcing reflow for transition to apply correctly on first open
            void internshipFormModal.offsetWidth; 
            
            internshipFormModal.classList.add('opacity-100', 'pointer-events-auto');
            internshipFormModalContent.classList.add('scale-100');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling

            // Defer setting the iframe src until after the modal's opening animation has started
            requestAnimationFrame(() => {
                if (internshipFormIframe.getAttribute('src') !== googleFormUrl) {
                    internshipFormIframe.setAttribute('src', googleFormUrl);
                }
            });
        });

        function closeModal() {
            internshipFormModal.classList.add('opacity-0');
            internshipFormModalContent.classList.add('scale-95');
            internshipFormModal.classList.remove('opacity-100', 'pointer-events-auto'); // Explicitly remove pointer-events-auto
            internshipFormModalContent.classList.remove('scale-100');
            
            // Delay making it non-interactive and clearing src to allow fade-out animation
            setTimeout(() => {
                internshipFormModal.classList.add('pointer-events-none');
                internshipFormIframe.setAttribute('src', 'about:blank'); // Clear src to stop form activity and free resources
            }, 300); // Match CSS transition duration (300ms)
            document.body.style.overflow = ''; // Restore background scrolling
        }

        closeInternshipFormModalBtn.addEventListener('click', closeModal);

        internshipFormModal.addEventListener('click', (event) => {
            if (event.target === internshipFormModal) { // Clicked on the overlay
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && internshipFormModal.classList.contains('opacity-100')) {
                closeModal();
            }
        });
    }

    // Release Pledge Gold Modal Logic
    const openReleasePledgeModalBtn = document.getElementById('openReleasePledgeModalBtn');
    const releasePledgeModal = document.getElementById('releasePledgeModal');
    const releasePledgeModalContent = document.getElementById('releasePledgeModalContent');
    const closeReleasePledgeModalBtn = document.getElementById('closeReleasePledgeModal');
    const contactFromReleaseModal = document.getElementById('contactFromReleaseModal');

    if (openReleasePledgeModalBtn && releasePledgeModal && releasePledgeModalContent && closeReleasePledgeModalBtn) {
    
        function openPledgeModal() {
            releasePledgeModal.classList.remove('opacity-0', 'pointer-events-none');
            releasePledgeModalContent.classList.remove('scale-95');
            
            void releasePledgeModal.offsetWidth; 
            
            releasePledgeModal.classList.add('opacity-100', 'pointer-events-auto');
            releasePledgeModalContent.classList.add('scale-100');
            document.body.style.overflow = 'hidden';
        }

        function closePledgeModal() {
            releasePledgeModal.classList.add('opacity-0');
            releasePledgeModalContent.classList.add('scale-95');
            releasePledgeModal.classList.remove('opacity-100', 'pointer-events-auto');
            releasePledgeModalContent.classList.remove('scale-100');
            
            setTimeout(() => {
                releasePledgeModal.classList.add('pointer-events-none');
            }, 300);
            document.body.style.overflow = '';
        }

        openReleasePledgeModalBtn.addEventListener('click', openPledgeModal);
        closeReleasePledgeModalBtn.addEventListener('click', closePledgeModal);

        releasePledgeModal.addEventListener('click', (event) => {
            if (event.target === releasePledgeModal) {
                closePledgeModal();
            }
        });

        if (contactFromReleaseModal) {
            contactFromReleaseModal.addEventListener('click', closePledgeModal);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && releasePledgeModal.classList.contains('opacity-100')) {
                closePledgeModal();
            }
        });
    }

    // Gold Buyback Modal Logic
    const openGoldBuybackModalBtn = document.getElementById('openGoldBuybackModalBtn');
    const goldBuybackModal = document.getElementById('goldBuybackModal');
    const goldBuybackModalContent = document.getElementById('goldBuybackModalContent');
    const closeGoldBuybackModalBtn = document.getElementById('closeGoldBuybackModal');
    const contactFromBuybackModal = document.getElementById('contactFromBuybackModal');

    if (openGoldBuybackModalBtn && goldBuybackModal && goldBuybackModalContent && closeGoldBuybackModalBtn) {
    
        function openBuybackModal() {
            goldBuybackModal.classList.remove('opacity-0', 'pointer-events-none');
            goldBuybackModalContent.classList.remove('scale-95');
            
            void goldBuybackModal.offsetWidth; 
            
            goldBuybackModal.classList.add('opacity-100', 'pointer-events-auto');
            goldBuybackModalContent.classList.add('scale-100');
            document.body.style.overflow = 'hidden';
        }

        function closeBuybackModal() {
            goldBuybackModal.classList.add('opacity-0');
            goldBuybackModalContent.classList.add('scale-95');
            goldBuybackModal.classList.remove('opacity-100', 'pointer-events-auto');
            goldBuybackModalContent.classList.remove('scale-100');
            
            setTimeout(() => {
                goldBuybackModal.classList.add('pointer-events-none');
            }, 300);
            document.body.style.overflow = '';
        }

        openGoldBuybackModalBtn.addEventListener('click', openBuybackModal);
        closeGoldBuybackModalBtn.addEventListener('click', closeBuybackModal);

        goldBuybackModal.addEventListener('click', (event) => {
            if (event.target === goldBuybackModal) {
                closeBuybackModal();
            }
        });

        if (contactFromBuybackModal) {
            contactFromBuybackModal.addEventListener('click', closeBuybackModal);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && goldBuybackModal.classList.contains('opacity-100')) {
                closeBuybackModal();
            }
        });
    }

    // Gold Loan Modal Logic
    const openGoldLoanModalBtn = document.getElementById('openGoldLoanModalBtn');
    const goldLoanModal = document.getElementById('goldLoanModal');
    const goldLoanModalContent = document.getElementById('goldLoanModalContent');
    const closeGoldLoanModalBtn = document.getElementById('closeGoldLoanModal');
    const contactFromLoanModal = document.getElementById('contactFromLoanModal');

    if (openGoldLoanModalBtn && goldLoanModal && goldLoanModalContent && closeGoldLoanModalBtn) {
    
        function openLoanModal() {
            goldLoanModal.classList.remove('opacity-0', 'pointer-events-none');
            goldLoanModalContent.classList.remove('scale-95');
            
            void goldLoanModal.offsetWidth; 
            
            goldLoanModal.classList.add('opacity-100', 'pointer-events-auto');
            goldLoanModalContent.classList.add('scale-100');
            document.body.style.overflow = 'hidden';
        }

        function closeLoanModal() {
            goldLoanModal.classList.add('opacity-0');
            goldLoanModalContent.classList.add('scale-95');
            goldLoanModal.classList.remove('opacity-100', 'pointer-events-auto');
            goldLoanModalContent.classList.remove('scale-100');
            
            setTimeout(() => {
                goldLoanModal.classList.add('pointer-events-none');
            }, 300);
            document.body.style.overflow = '';
        }

        openGoldLoanModalBtn.addEventListener('click', openLoanModal);
        closeGoldLoanModalBtn.addEventListener('click', closeLoanModal);

        goldLoanModal.addEventListener('click', (event) => {
            if (event.target === goldLoanModal) {
                closeLoanModal();
            }
        });

        if (contactFromLoanModal) {
            contactFromLoanModal.addEventListener('click', closeLoanModal);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && goldLoanModal.classList.contains('opacity-100')) {
                closeLoanModal();
            }
        });
    }

    // Jewelry Valuation Modal Logic
    const openValuationModalBtn = document.getElementById('openValuationModalBtn');
    const valuationModal = document.getElementById('valuationModal');
    const valuationModalContent = document.getElementById('valuationModalContent');
    const closeValuationModalBtn = document.getElementById('closeValuationModal');
    const contactFromValuationModal = document.getElementById('contactFromValuationModal');

    if (openValuationModalBtn && valuationModal && valuationModalContent && closeValuationModalBtn) {
    
        function openValuationModal() {
            valuationModal.classList.remove('opacity-0', 'pointer-events-none');
            valuationModalContent.classList.remove('scale-95');
            
            void valuationModal.offsetWidth; 
            
            valuationModal.classList.add('opacity-100', 'pointer-events-auto');
            valuationModalContent.classList.add('scale-100');
            document.body.style.overflow = 'hidden';
        }

        function closeValuationModal() {
            valuationModal.classList.add('opacity-0');
            valuationModalContent.classList.add('scale-95');
            valuationModal.classList.remove('opacity-100', 'pointer-events-auto');
            valuationModalContent.classList.remove('scale-100');
            
            setTimeout(() => {
                valuationModal.classList.add('pointer-events-none');
            }, 300);
            document.body.style.overflow = '';
        }

        openValuationModalBtn.addEventListener('click', openValuationModal);
        closeValuationModalBtn.addEventListener('click', closeValuationModal);

        valuationModal.addEventListener('click', (event) => {
            if (event.target === valuationModal) {
                closeValuationModal();
            }
        });

        if (contactFromValuationModal) {
            contactFromValuationModal.addEventListener('click', closeValuationModal);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && valuationModal.classList.contains('opacity-100')) {
                closeValuationModal();
            }
        });
    }
});
