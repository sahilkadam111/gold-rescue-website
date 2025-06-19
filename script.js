document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
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

            // Close mobile menu after clicking a link
            const mobileNav = document.getElementById('mobile-nav-links');
            if (mobileNav && mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
            }
        });
    });

    // Hamburger menu functionality
    const hamburgerButton = document.getElementById('hamburger');
    const mobileNavLinks = document.getElementById('mobile-nav-links');

    if (hamburgerButton && mobileNavLinks) {
        hamburgerButton.addEventListener('click', () => {
            mobileNavLinks.classList.toggle('open');
            // Toggle aria-expanded for accessibility
            const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true' || false;
            hamburgerButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Hero Section Slideshow
    const slideshowImages = document.querySelectorAll('.slideshow-img');
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
    const calculateLoanButton = document.getElementById('calculateLoan');
    if (calculateLoanButton) {
        calculateLoanButton.addEventListener('click', () => {
            const goldWeightInput = document.getElementById('goldWeight');
            const goldPurityInput = document.getElementById('goldPurity');
            const loanTenureInput = document.getElementById('loanTenure');

            // Safely get values, defaulting to 0 if input elements are not found or values are empty/invalid
            const goldWeight = parseFloat(goldWeightInput ? goldWeightInput.value : '0');
            const goldPurity = parseFloat(goldPurityInput ? goldPurityInput.value : '0');
            const loanTenure = parseInt(loanTenureInput ? loanTenureInput.value : '0');

            const calculatorResult = document.getElementById('calculatorResult');
            const displayGoldValue = document.getElementById('displayGoldValue');
            const displayLoanAmount = document.getElementById('displayLoanAmount');
            const displayEMI = document.getElementById('displayEMI');

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
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // You can add form validation here before showing the message box
            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const email = document.getElementById('contact-email').value;

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
            if (internshipFormIframe.getAttribute('src') !== googleFormUrl) {
                internshipFormIframe.setAttribute('src', googleFormUrl);
            }
            internshipFormModal.classList.remove('opacity-0', 'pointer-events-none');
            internshipFormModalContent.classList.remove('scale-95');
            // Forcing reflow for transition to apply correctly on first open
            void internshipFormModal.offsetWidth; 
            internshipFormModal.classList.add('opacity-100', 'pointer-events-auto');
            internshipFormModalContent.classList.add('scale-100');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        function closeModal() {
            internshipFormModal.classList.add('opacity-0');
            internshipFormModalContent.classList.add('scale-95');
            internshipFormModal.classList.remove('opacity-100');
            internshipFormModalContent.classList.remove('scale-100');
            
            // Delay making it non-interactive and clearing src to allow fade-out animation
            setTimeout(() => {
                internshipFormModal.classList.add('pointer-events-none');
                // internshipFormIframe.setAttribute('src', ''); // Optional: Clear src to stop form activity/sound if needed
            }, 300); // Match transition duration (300ms)
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
});
