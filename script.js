
/* =========================================================
   MASTER MHER DELIVERY
   SCRIPT
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mainNav = document.getElementById("mainNav");

if (mobileMenuButton && mainNav) {

    mobileMenuButton.addEventListener("click", () => {

        const isOpen = mainNav.classList.toggle("active");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    /* Close menu after clicking a navigation link */

    const navLinks = mainNav.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("active");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        alert(
            "Vielen Dank für Ihre Anfrage! " +
            "Wir melden uns so schnell wie möglich bei Ihnen."
        );

    });

}
