function initLoaderHome() {
  const tl = gsap.timeline();
  gsap.set("#rectangle", { transformOrigin: "50% 100%", y: 100 });
  tl.to("#rectangle", { duration: 1, y: 0, ease: "power2.out" });
  tl.add("scaleAnimation");
  tl.to("#rectangle-svg", { duration: 1, scale: 2, ease: "ease.out(1, 0.3)" }, "scaleAnimation");
}

// Call this function when the DOM content has loaded
document.addEventListener("DOMContentLoaded", initLoaderHome);
