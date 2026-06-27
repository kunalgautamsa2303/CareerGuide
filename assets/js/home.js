/*=====================================================
 Career Guide Platform
 home.js v3.0
 Part 1
 Navigation • Mobile Menu • Search • Smooth Scroll
======================================================*/

"use strict";

/*=====================================================
DOM Elements
======================================================*/

const navbar = document.querySelector(".navbar");
const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

const searchInput = document.querySelector(".search-input input");
const searchButton = document.querySelector(".hero-search .primary-btn");

/*=====================================================
Mobile Navigation
======================================================*/

if (mobileMenu && navLinks) {

    mobileMenu.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        mobileMenu.classList.toggle("active");

        document.body.classList.toggle("menu-open");

    });

}

/*=====================================================
Close Mobile Menu
======================================================*/

navItems.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        mobileMenu.classList.remove("active");

        document.body.classList.remove("menu-open");

    });

});

/*=====================================================
Sticky Navbar
======================================================*/

window.addEventListener("scroll", () => {

    if (window.scrollY > 20) {

        navbar.classList.add("sticky");

    } else {

        navbar.classList.remove("sticky");

    }

});

/*=====================================================
Smooth Scroll
======================================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    });

});

/*=====================================================
Active Navigation
======================================================*/

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const top = section.offsetTop - 90;

        if (window.scrollY >= top) {

            currentSection = section.id;

        }

    });

    navItems.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {

            link.classList.add("active");

        }

    });

});

/*=====================================================
Search
======================================================*/

function performSearch() {

    const keyword = searchInput.value.trim();

    if (keyword === "") {

        searchInput.focus();

        return;

    }

    console.log("Searching:", keyword);

    // Future Integration
    // Career Search API
    // University Search API
    // Counsellor Search API

}

if (searchButton) {

    searchButton.addEventListener(

        "click",

        performSearch

    );

}

if (searchInput) {

    searchInput.addEventListener(

        "keydown",

        e => {

            if (e.key === "Enter") {

                performSearch();

            }

        }

    );

}

/*=====================================================
Keyboard Shortcut
CTRL + /
Focus Search
======================================================*/

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key === "/") {

        e.preventDefault();

        searchInput.focus();

    }

});

/*=====================================================
Console
======================================================*/

console.log(

    "%cCareer Guide v3 Loaded",

    "color:#2563eb;font-size:15px;font-weight:bold"

);
/*=====================================================
 Career Guide Platform
 home.js v3.0
 Part 2
 Reveal • Counter • Back To Top
 Utilities
======================================================*/

/*=====================================================
Reveal Animation
(Lightweight & Mobile Friendly)
======================================================*/

const revealItems = document.querySelectorAll(

    ".career-card,\
     .university-card,\
     .counsellor-item,\
     .school-card,\
     .dashboard-card,\
     .feature-tile,\
     .event-item"

);

const revealObserver = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

            revealObserver.unobserve(entry.target);

        }

    });

},

{

    threshold:0.12

}

);

revealItems.forEach(item=>{

    item.classList.add("hidden");

    revealObserver.observe(item);

});

/*=====================================================
Statistics Counter
======================================================*/

const counters=document.querySelectorAll(".mini-stat h3");

const counterObserver=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(!entry.isIntersecting) return;

const counter=entry.target;

const finalValue=parseInt(

counter.innerText.replace(/\D/g,"")

);

let value=0;

const speed=Math.max(

10,

Math.floor(finalValue/80)

);

function update(){

value+=speed;

if(value>=finalValue){

counter.innerText=finalValue+"+";

return;

}

counter.innerText=value+"+";

requestAnimationFrame(update);

}

update();

counterObserver.unobserve(counter);

});

},

{

threshold:.5

}

);

counters.forEach(counter=>{

counterObserver.observe(counter);

});

/*=====================================================
Back To Top Button
======================================================*/

const topButton=document.createElement("button");

topButton.className="back-to-top";

topButton.innerHTML=

'<i class="bi bi-arrow-up"></i>';

document.body.appendChild(topButton);

window.addEventListener(

"scroll",

()=>{

if(window.scrollY>400){

topButton.classList.add("show");

}else{

topButton.classList.remove("show");

}

}

);

topButton.addEventListener(

"click",

()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

}

);

/*=====================================================
Card Hover Effect
(Mobile Safe)
======================================================*/

document.querySelectorAll(

".career-card,\
.dashboard-card,\
.school-card"

).forEach(card=>{

card.addEventListener(

"touchstart",

()=>{

card.classList.add("active-card");

},

{passive:true}

);

card.addEventListener(

"touchend",

()=>{

setTimeout(()=>{

card.classList.remove("active-card");

},180);

},

{passive:true}

);

});

/*=====================================================
Lazy Image Loader
======================================================*/

const lazyImages=document.querySelectorAll(

"img[data-src]"

);

if(lazyImages.length){

const imageObserver=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const image=entry.target;

image.src=image.dataset.src;

image.removeAttribute("data-src");

imageObserver.unobserve(image);

}

});

}

);

lazyImages.forEach(image=>{

imageObserver.observe(image);

});

}

/*=====================================================
Page Loaded
======================================================*/

window.addEventListener(

"load",

()=>{

document.body.classList.add("loaded");

});

/*=====================================================
Future Modules

Authentication

Student Dashboard

Counsellor Dashboard

School Dashboard

University Dashboard

Admin Dashboard

======================================================*/

console.log(

"%cCareer Guide Homepage Ready",

"color:#16a34a;font-size:15px;font-weight:bold"

);

/*=====================================================
End of File
======================================================*/
