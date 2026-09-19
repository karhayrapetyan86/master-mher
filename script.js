/* =========================================================
   MASTER MHER DELIVERY
   MAIN JAVASCRIPT

   Structure:
   01. DOM helpers
   02. Mobile navigation
   03. Header scroll state
   04. Scroll reveal
   05. Active navigation
   06. Contact form
   07. Current year
========================================================= */


/* =========================================================
   01. DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   02. MOBILE NAVIGATION
========================================================= */

const mobileMenuToggle = $("#mobileMenuToggle");
const mainNav = $("#mainNav");

if (mobileMenuToggle && mainNav) {

    mobileMenuToggle.addEventListener("click", () => {

        const isOpen =
            mainNav.classList.toggle("open");

        mobileMenuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        mobileMenuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Menü schließen"
                : "Menü öffnen"
        );

    });


    /* Close menu after navigation */

    $$("#mainNav a").forEach((link) => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

            mobileMenuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuToggle.setAttribute(
                "aria-label",
                "Menü öffnen"
            );

        });

    });


    /* Close when clicking outside */

    document.addEventListener("click", (event) => {

        if (
            !mainNav.contains(event.target) &&
            !mobileMenuToggle.contains(event.target)
        ) {

            mainNav.classList.remove("open");

            mobileMenuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

}


/* =========================================================
   03. HEADER SCROLL STATE
========================================================= */

const siteHeader = $("#siteHeader");

const updateHeader = () => {

    if (!siteHeader) return;

    siteHeader.classList.toggle(
        "scrolled",
        window.scrollY > 30
    );

};

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================================================
   04. SCROLL REVEAL
========================================================= */

const revealElements = $$(".reveal");

revealElements.forEach((element) => {

    const delay =
        element.dataset.delay || 0;

    element.style.setProperty(
        "--reveal-delay",
        `${delay}ms`
    );

});


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "is-visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach((element) => {

        element.classList.add(
            "is-visible"
        );

    });

}


/* =========================================================
   05. ACTIVE NAVIGATION
========================================================= */

const sections = $$(
    "main section[id]"
);

const navLinks = $$("#mainNav a[href^='#']");

if (
    sections.length &&
    navLinks.length &&
    "IntersectionObserver" in window
) {

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id =
                        entry.target.getAttribute(
                            "id"
                        );

                    navLinks.forEach((link) => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") ===
                            `#${id}`
                        );

                    });

                });

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach((section) => {

        sectionObserver.observe(section);

    });

}


/* =========================================================
   06. CONTACT FORM
========================================================= */

const contactForm = $("#contactForm");
const formStatus = $("#formStatus");


/*
    IMPORTANT:

    Right now the form is frontend-functional:
    - validation
    - user feedback
    - mailto fallback

    Later we can replace this with a real backend
    such as Cloudflare Workers / Resend / Formspree.

    To use a real API later, add:

    const FORM_ENDPOINT = "https://...";

*/

const FORM_ENDPOINT = "";


const showFormStatus = (
    message,
    type = "success"
) => {

    if (!formStatus) return;

    formStatus.textContent = message;

    formStatus.className =
        `form-status ${type}`;

};


const clearFormErrors = () => {

    $$(".form-error", contactForm)
        .forEach((error) => {

            error.textContent = "";

        });

    $$(
        ".form-group input, .form-group textarea",
        contactForm
    ).forEach((field) => {

        field.classList.remove("error");

    });

};


const setFieldError = (
    field,
    message
) => {

    field.classList.add("error");

    const group =
        field.closest(".form-group");

    if (!group) return;

    const error =
        $(".form-error", group);

    if (error) {
        error.textContent = message;
    }

};


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearFormErrors();

            showFormStatus("", "success");


            const name =
                $("#name", contactForm);

            const email =
                $("#email", contactForm);

            const message =
                $("#message", contactForm);

            const privacy =
                $("#privacy", contactForm);

            let valid = true;


            /* Name */

            if (
                !name.value.trim() ||
                name.value.trim().length < 2
            ) {

                setFieldError(
                    name,
                    "Bitte geben Sie Ihren Namen ein."
                );

                valid = false;

            }


            /* Email */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !email.value.trim() ||
                !emailPattern.test(
                    email.value.trim()
                )
            ) {

                setFieldError(
                    email,
                    "Bitte geben Sie eine gültige E-Mail-Adresse ein."
                );

                valid = false;

            }


            /* Message */

            if (
                !message.value.trim() ||
                message.value.trim().length < 10
            ) {

                setFieldError(
                    message,
                    "Bitte beschreiben Sie kurz Ihr Anliegen."
                );

                valid = false;

            }


            /* Privacy */

            if (!privacy.checked) {

                showFormStatus(
                    "Bitte akzeptieren Sie die Datenschutzerklärung.",
                    "error"
                );

                valid = false;

            }


            if (!valid) {
                return;
            }


            /* =================================================
               REAL BACKEND
            ================================================= */

            if (FORM_ENDPOINT) {

                try {

                    const formData =
                        new FormData(contactForm);

                    const response =
                        await fetch(
                            FORM_ENDPOINT,
                            {
                                method: "POST",
                                body: formData,
                                headers: {
                                    "Accept":
                                        "application/json"
                                }
                            }
                        );


                    if (!response.ok) {
                        throw new Error(
                            "Form submission failed"
                        );
                    }


                    showFormStatus(
                        "Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.",
                        "success"
                    );

                    contactForm.reset();

                } catch (error) {

                    showFormStatus(
                        "Leider ist ein Fehler aufgetreten. Bitte kontaktieren Sie uns direkt.",
                        "error"
                    );

                }

                return;
            }


            /* =================================================
               MAILTO FALLBACK
            ================================================= */

            const service =
                $("#service", contactForm)?.value ||
                "Nicht angegeben";

            const phone =
                $("#phone", contactForm)?.value ||
                "Nicht angegeben";


            const subject =
                encodeURIComponent(
                    "Neue Anfrage – Master Mher Delivery"
                );


            const body =
                encodeURIComponent(
`
Neue Anfrage über die Website

Name:
${name.value}

Telefon:
${phone}

E-Mail:
${email.value}

Leistung:
${service}

Nachricht:
${message.value}
`
                );


            window.location.href =
                `mailto:begjifanyanmher20@gmail.com?subject=${subject}&body=${body}`;


            showFormStatus(
                "Ihre Anfrage wird vorbereitet.",
                "success"
            );

        }
    );

}


/* =========================================================
   07. CURRENT YEAR
========================================================= */

const currentYear = $("#currentYear");

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}
