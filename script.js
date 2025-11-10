// All scripts wrapped to ensure DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  /* =========================
      Mobile Nav / Drawer
    ============================ */
  const burger = document.querySelector(".burger");
  const drawer = document.getElementById("mobile-drawer");

  if (burger && drawer) {
    // Open / close on burger click
    burger.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent immediate close by document click
      const isOpen = drawer.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      drawer.setAttribute("aria-hidden", String(!isOpen));
      document.body.classList.toggle("drawer-open", isOpen);
    });

    // Close drawer when a link is clicked
    drawer.querySelectorAll(".drawer-link").forEach((link) => {
      link.addEventListener("click", () => closeDrawer());
    });

    // Close drawer when clicking outside of it
    document.addEventListener("click", (e) => {
      const isClickInsideDrawer = drawer.contains(e.target);
      const isBurgerClick = burger.contains(e.target);

      if (!isClickInsideDrawer && !isBurgerClick && drawer.classList.contains("open")) {
        closeDrawer();
      }
    });

    function closeDrawer() {
      drawer.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("drawer-open");
    }
  }
  /* =========================
     Smooth Scroll
  ============================ */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top:
            target.getBoundingClientRect().top +
            window.pageYOffset -
            72,
          behavior: "smooth",
        });
      }
    });
  });

  /* =========================
     Year in Footer
  ============================ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================
     Lightbox
  ============================ */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector(".lb-img");
    const lbPrev = lightbox.querySelector(".lb-prev");
    const lbNext = lightbox.querySelector(".lb-next");
    const lbClose = lightbox.querySelector(".lb-close");
    const galleryImgs = Array.from(
      document.querySelectorAll("[data-lightbox]")
    );
    let currentIndex = -1;

    function openLightbox(index) {
      currentIndex = index;
      lbImg.src = galleryImgs[currentIndex].dataset.lightbox;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    }
    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    }
    function showPrev() {
      if (currentIndex > 0) openLightbox(currentIndex - 1);
    }
    function showNext() {
      if (currentIndex < galleryImgs.length - 1)
        openLightbox(currentIndex + 1);
    }

    galleryImgs.forEach((imgEl, idx) => {
      imgEl.addEventListener("click", () => openLightbox(idx));
    });

    lbPrev.addEventListener("click", showPrev);
    lbNext.addEventListener("click", showNext);
    lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    });
  }

  /* =========================
     About Image Fade-in
  ============================ */
  document.querySelector(".about-image")?.classList.add("loaded");

  /* =========================
     Terms & Conditions Modal
  ============================ */
  const openTerms = document.getElementById("open-terms");
  const closeTerms = document.getElementById("close-terms");
  const termsModal = document.getElementById("terms-modal");

  if (openTerms && closeTerms && termsModal) {
    openTerms.addEventListener("click", (e) => {
      e.preventDefault();
      termsModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });

    closeTerms.addEventListener("click", () => {
      termsModal.style.display = "none";
      document.body.style.overflow = "";
    });

    window.addEventListener("click", (e) => {
      if (e.target === termsModal) {
        termsModal.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  }

  /* =========================
     Brochure Download (force download)
  ============================ */
  document.querySelectorAll("a[download]").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("href");
      const fileName =
        this.getAttribute("download") || "Cineboy_Brochure.pdf";
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });

  /* =========================
     Min Date for Event
  ============================ */
  const dateInput = document.querySelector('input[name="date"]');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const minDate = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute("min", minDate);
  }

  /* =========================
     Contact Form Validation + EmailJS
  ============================ */
  const form = document.getElementById("contactForm");
  const status = document.querySelector(".form-status");

  if (form && status) {
    const fields = {
      name: form.elements["name"],
      email: form.elements["email"],
      phone: form.elements["phone"],
      date: form.elements["date"],
      venue: form.elements["venue"],
      message: form.elements["message"],
    };

    function getErrorElement(input) {
      let err = input.parentElement.querySelector(".field-error");
      if (!err) {
        err = document.createElement("div");
        err.className = "field-error";
        err.setAttribute("aria-live", "polite");
        input.parentElement.appendChild(err);
      }
      return err;
    }

    function showError(input, message) {
      const err = getErrorElement(input);
      err.textContent = message;
      err.style.display = "block";
      input.classList.add("has-error");
    }

    function clearError(input) {
      const err = input.parentElement.querySelector(".field-error");
      if (err) {
        err.textContent = "";
        err.style.display = "none";
      }
      input.classList.remove("has-error");
    }

    function validateName() {
      const input = fields.name;
      const value = input.value.trim();
      if (!value) {
        showError(input, "Please enter your full name.");
        return false;
      }
      if (value.length < 3) {
        showError(input, "Name looks too short.");
        return false;
      }
      clearError(input);
      return true;
    }

    function validateEmail() {
      const input = fields.email;
      const value = input.value.trim();
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        showError(input, "Please enter your email.");
        return false;
      }
      if (!pattern.test(value)) {
        showError(input, "Please enter a valid email address.");
        return false;
      }
      clearError(input);
      return true;
    }

    function validatePhone() {
      const input = fields.phone;
      const value = input.value.trim();

      // Phone is optional, but if filled, validate properly
      if (!value) {
        clearError(input);
        return true;
      }

      // Basic India-friendly pattern: 10 digits, with or without +91 / 0
      const cleaned = value.replace(/\s+/g, "");
      const pattern =
        /^(?:\+91|0)?[6-9]\d{9}$/;

      if (!pattern.test(cleaned)) {
        showError(
          input,
          "Please enter a valid phone number (e.g. 9876543210 or +91...)."
        );
        return false;
      }
      clearError(input);
      return true;
    }

    function validateMessage() {
      const input = fields.message;
      const value = input.value.trim();
      if (!value) {
        showError(input, "Please tell us a bit about your event.");
        return false;
      }
      if (value.length < 10) {
        showError(
          input,
          "Message is too short. Add a few more details."
        );
        return false;
      }
      clearError(input);
      return true;
    }

    function validateDate() {
      const input = fields.date;
      if (!input || !input.value) {
        // optional: no error if empty
        clearError(input);
        return true;
      }
      clearError(input);
      return true;
    }

    function validateVenue() {
      const input = fields.venue;
      if (!input) return true;
      // optional; you can enforce if you want:
      clearError(input);
      return true;
    }

    function validateField(input) {
      if (!input) return true;
      switch (input.name) {
        case "name":
          return validateName();
        case "email":
          return validateEmail();
        case "phone":
          return validatePhone();
        case "message":
          return validateMessage();
        case "date":
          return validateDate();
        case "venue":
          return validateVenue();
        default:
          return true;
      }
    }

    // Live validation on input + blur
    Object.values(fields).forEach((input) => {
      if (!input) return;
      input.addEventListener("input", () => validateField(input));
      input.addEventListener("blur", () => validateField(input));
    });

    function validateForm() {
      let valid = true;
      if (!validateName()) valid = false;
      if (!validateEmail()) valid = false;
      if (!validatePhone()) valid = false;
      if (!validateMessage()) valid = false;
      if (!validateDate()) valid = false;
      if (!validateVenue()) valid = false;

      if (!valid) {
        status.textContent = "Please fix the highlighted fields.";
        status.style.color = "red";
      } else {
        status.textContent = "";
      }
      return valid;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateForm()) {
        const firstError = form.querySelector(".has-error");
        if (firstError) firstError.focus();
        return;
      }

      status.textContent = "Sending...";
      status.style.color = "#b6973a";

      // Uses EmailJS (already initialized in HTML)
      emailjs
        .sendForm("service_cineboy", "template_pvfmt6n", form)
        .then(() => {
          status.textContent = "✅ Enquiry sent successfully!";
          status.style.color = "green";
          form.reset();
          // Clear errors after successful submit
          Object.values(fields).forEach((input) => {
            if (!input) return;
            clearError(input);
          });
        })
        .catch((error) => {
          console.error("Error sending enquiry:", error);
          status.textContent =
            "❌ Failed to send. Please try again in a moment.";
          status.style.color = "red";
        });
    });
  }
});