const menuBtn = document.getElementById("menuToggle");
const navList = document.querySelector(".nav-list");
const menuIcon = document.getElementById("menuIcon");

menuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
    if (menuIcon.classList.contains("icon-menu")) {
        menuIcon.classList.remove("icon-menu", "font-23");
        menuIcon.classList.add("icon-close", "font-17");
    } else {
        menuIcon.classList.remove("icon-close", "font-17");
        menuIcon.classList.add("icon-menu", "font-23");
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const mainImage = document.getElementById("mainImage");
    const thumbnails = document.querySelectorAll(".thumbnails img");
    const prevBtn = document.querySelector(".left-arrow");
    const nextBtn = document.querySelector(".right-arrow");
    const singleRadio = document.getElementById("singleSubscription");
    const doubleRadio = document.getElementById("doubleSubscription");
    const singleBlock = document.getElementById("singleBlock");
    const doubleBlock = document.getElementById("doubleBlock");
    const addBtn = document.getElementById("addToCartBtn");
    const statsSection = document.getElementById("statsSection");
    const counters = statsSection.querySelectorAll("span[data-target]");
    let hasCounted = false;

    // thumbnails handler
    let currentIndex = 0;
    if (!thumbnails.length) return;
    function updateImage(index) {
        currentIndex = index;
        mainImage.src = thumbnails[currentIndex].src;

        thumbnails.forEach(img => img.classList.remove("active"));
        thumbnails[currentIndex].classList.add("active");
    }
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener("click", () => {
            mainImage.src = thumbnail.src;

            thumbnails.forEach(img => img.classList.remove("active"));
            thumbnail.classList.add("active");
        });
    });
    nextBtn.addEventListener("click", () => {
        updateImage((currentIndex + 1) % thumbnails.length);
    });

    prevBtn.addEventListener("click", () => {
        updateImage((currentIndex - 1 + thumbnails.length) % thumbnails.length);
    });

    // purchase type handler

    singleRadio.addEventListener("change", () => {
        if (singleRadio.checked) {
            singleBlock.style.display = "block";
            doubleBlock.style.display = "none";
        }
    });

    doubleRadio.addEventListener("change", () => {
        if (doubleRadio.checked) {
            doubleBlock.style.display = "block";
            singleBlock.style.display = "none";
        }
    });

    function getCheckedValue(name) {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : null;
    }
    function updateBlocks() {
        const purchase = getCheckedValue("purchaseType");
        if (purchase === "single") {
            singleBlock.style.display = "block";
            doubleBlock.style.display = "none";
        } else if (purchase === "double") {
            singleBlock.style.display = "none";
            doubleBlock.style.display = "block";
        }
    }

    addBtn.addEventListener("click", () => {
        const purchase = getCheckedValue("purchaseType");
        let cartItem = null;
        let dummyLink = "#";

        if (purchase === "single") {
            const fragrance = getCheckedValue("singleFragrance");
            if (!fragrance) {
                alert("Please select a fragrance for Single Subscription.");
                return;
            }
            cartItem = { type: "single", fragrance: fragrance };
            dummyLink = `https://example.com/cart/single-${fragrance}`;
        } else if (purchase === "double") {
            const f1 = getCheckedValue("doubleFragrance1");
            const f2 = getCheckedValue("doubleFragrance2");
            if (!f1 || !f2) {
                alert("Please select both fragrances for Double Subscription.");
                return;
            }
            cartItem = { type: "double", fragrance1: f1, fragrance2: f2 };
            dummyLink = `https://example-link.com/cart/double-${f1}-${f2}`;
        }
        console.log("Item added to cart:", cartItem);
        alert(`Added to cart:\n${JSON.stringify(cartItem, null, 2)}\n\nDummy link: ${dummyLink}`);
    });
    document.querySelectorAll('input[name="purchaseType"]').forEach(radio => {
        radio.addEventListener("change", updateBlocks);
    });

    updateBlocks();

    // percentage count handler
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom >= 0;
    }

    function countUp() {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            let current = 0;
            const increment = Math.ceil(target / 100);

            const update = () => {
                current += increment;
                if (current > target) current = target;
                counter.textContent = current + "%";
                if (current < target) {
                    requestAnimationFrame(update);
                }
            };
            update();
        });
    }

    function checkScroll() {
        if (!hasCounted && isElementInViewport(statsSection)) {
            countUp();
            hasCounted = true;
            window.removeEventListener("scroll", checkScroll);
        }
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});


