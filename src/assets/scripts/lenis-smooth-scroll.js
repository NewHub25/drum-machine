import "@styles/lenis.css";

import Lenis from "lenis";

// Script to handle Lenis library settings for smooth scrolling
const lenis = new Lenis({ duration: 1.5 });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.addEventListener("DOMContentLoaded", () => {
  const containerHero = document.querySelector(".containerHero");
  lenis.on("scroll", (e) => {
    if (scrollY > innerHeight) return;
    containerHero.style.top = scrollY + "px";
    const result = (innerHeight * Math.pow(0.59, scrollY / 100)) / 10;
    containerHero.style.filter = `blur(${result - 2}px)`;
  });
});
