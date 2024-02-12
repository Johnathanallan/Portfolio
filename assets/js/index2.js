gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

gsap.registerPlugin(ScrollTrigger);

const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

// Call the animation function on page load
initLoader();
initLoaderHome();
initPageTransitions();

// Animation - First Page Load
function initLoader() {
var tl = gsap.timeline();

console.log("first page load");

tl.set(".loading-screen", {
		top: "0",
	});

// Animation for loading screen
tl.set(".once-in", {
    y: "10vh",
    opacity: 0,
});

tl.to(".once-in", {
    duration: 0.6,
    rotation: 0,
    yPercent: 0,
    ease: "Expo.easeOut",
    delay: 0.1,
    stagger: 0.05,
});

tl.set(".split-text .span-inner", {
		rotation: 0,
		opacity: 1,
	});


tl.to(
    ".once-in",
    {
    duration: 0.8,
    rotation: 0,
    yPercent: -400,
    ease: "Expo.easeIn",
    stagger: -0.05,
    },
    "=-.1"
);

tl.to(
		".split-text .span-inner",
		{
			duration: 0.8,
			rotation: 0,
			yPercent: 200,
			ease: "Expo.easeIn",
			stagger: -0.05,
		},
		"=-.1"
	);

	tl.to(
		".loading-screen",
		{
			duration: 0.8,
			top: "-200%",
			ease: "Power2.easeOut",
		},
		"=-.4"
	);

tl.set(
    "html",
    {
    cursor: "auto",
    },
    "=-.2"
);


// Animation for once-in content
tl.to(
    ".once-in",
    {
    duration: 1.1,
    y: "0vh",
    opacity: 1,
    ease: "Expo.easeOut",
    stagger: -0.075,
    onStart: staggerSpanH1,
    },
    "=-0.5"
);

function staggerSpanH1() {
    gsap.to("once-in", {
    duration: 0.5,
    yPercent: 0,
    rotate: 0,
    ease: "Expo.easeOut",
    stagger: -0.075,
    delay: 0.2,
    });
}
}

function initLoaderHome() {
const tl = gsap.timeline();
gsap.set("#rectangle", { transformOrigin: "50% 100%", y: 100 });
tl.to("#rectangle", {   delay: 1.2, duration: 1.5, y: 0, ease: "power2.out" });
tl.add("scaleAnimation");
tl.to(
    "#rectangle-svg",
    { duration: 2.0, scale: 2, ease: "ease.out(1, 0.3)" },
    "scaleAnimation"
);
}

// Animation first load

// Animation - Page transition In
function pageTransitionIn(scroll) {
//the scroll parameter is passed as prop because this functions are passed on a callback function
var tl = gsap.timeline();

tl.set(".loading-screen", {
		top: "0",
	});

console.log("Transitioning page in...");

tl.call(function () {
    scroll.stop();
});

tl.to(".loading-screen", {
		duration: 0.5,
		top: "-200%",
		ease: "Power2.easeOut",
	});

tl.set("html", {
    cursor: "wait",
});

tl.to(".loading-screen", {
    duration: 0.5,
    top: "0%",
    ease: "Power2.easeIn",
});

tl.to(".loading-screen", {
    duration: 0.5,
    top: "-200%",
    ease: "Power2.easeOut",
    delay: 0.2,
});

tl.set(
    "html",
    {
    cursor: "auto",
    },
    "=-0.2"
);

tl.set(".loading-screen", {
    top: "200%",
});
}

// Animation - Page transition Out
function pageTransitionOut(scroll) {
// same that the function above
var tl = gsap.timeline();
    console.log('page out');

    tl.set(".loading-screen", {
		top: "-200%",
	});

tl.call(function () {
    scroll.start();
});

tl.set("once-in", {
    yPercent: 250,
});

tl.set(".once-in", {
    y: "20vh",
    opacity: 0,
});

tl.to(".loading-screen", {
		duration: 0.5,
		top: "0%",
		ease: "Power2.easeIn",
	});



tl.to(
    ".once-in",
    {
    duration: 2.6,
    y: "0vh",
    opacity: 1,
    ease: "Expo.easeOut",
    stagger: -0.075,
    onStart: staggerSpanH1,
    },
    "=-1.6"
);



function staggerSpanH1() {
    gsap.to("once-in", {
    duration: 1.6,
    yPercent: 0,
    rotate: 0,
    ease: "Expo.easeOut",
    stagger: -0.075,
    delay: 0.075,
    });
}
}

function initPageTransitions() {
let scroll; // this is the scroll object that barba hooks use. Tis where before on the scope above and only barba is going to utilize it
// do something before the transition starts
barba.hooks.before(() => {
    select("html").classList.add("is-transitioning");
});

// do something after the transition finishes
barba.hooks.after(() => {
    select("html").classList.remove("is-transitioning");
    // reinit locomotive scroll
    scroll.init();
    scroll.stop();
});

// scroll to the top of the page
barba.hooks.enter(() => {
    scroll.destroy();
});

// scroll to the top of the page
barba.hooks.afterEnter(() => {
    window.scrollTo(0, 0);
});

barba.init({
    sync: true,
    debug: true,
    timeout: 7000,
    transitions: [
    {
        name: "default",
        once(data) {
        // do something once on the initial page load
        initSmoothScroll(data.next.container);
        initScript();
        initLoader();
        },
        async leave(data) {
        // animate loading screen in
        pageTransitionIn(scroll); // so the scroll object now is going to be defined and passed has ref
        await delay(0.002);
        data.current.container.remove();
        gsap.killTweensOf([".loading-screen"]);

        },
        async enter(data) {
        // animate loading screen away
        pageTransitionOut(scroll); //
        initLoader(); // this are the funcionalities and animations of the two pages
        initLoaderHome(); // too
        },
        async beforeEnter(data) {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        scroll.destroy();
        initSmoothScroll(data.next.container);
        initScript();
        },
    },
    ],
});

function initSmoothScroll(container) {
    scroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    lerp: 0.075,
    });

    scroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
    scrollTop(value) {
        return arguments.length
        ? scroll.scrollTo(value, 0, 0)
        : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        };
    },
    pinType: document.querySelector("[data-scroll-container]").style.transform
        ? "transform"
        : "fixed",
    });

    window.addEventListener("resize", () => {
    scroll.update();
    ScrollTrigger.refresh();
    });

    ScrollTrigger.addEventListener("refresh", () => scroll.update());

    ScrollTrigger.refresh();
}
}

//for barba.js
function delay(n) {
n = n || 2000;
return new Promise((done) => {
    setTimeout(() => {
    done();
    }, n);
});
}

function initScript() {
select("body").classList.remove("is-loading");
initBasicFunctions();
initScrolltriggerAnimations();
initTimeZone();
initMagneticButtons();
initWindowInnerheight();
}

/**
 * Window Inner Height Check
 */
function initWindowInnerheight() {
	// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
	$(document).ready(function () {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	});
}

/**
 * Basic Functions
 */
function initBasicFunctions() {
// Toggle Navigation
$('[data-navigation-toggle="toggle"]').click(function () {
    $(this).toggleClass("active");
    var isActive = $(this).hasClass("active");
    $("[data-navigation-status]").attr(
    "data-navigation-status",
    isActive ? "active" : "not-active"
    );

    // Adjust the transform for both layers
    if (isActive) {
    $(".mobile-nav-box").css("transform", "translateY(0%) rotate(0.001deg)");
    $(".mobile-nav-behind-layer").css("transform", "translateY(-10%)"); // Slower movement
    $(".logo span").addClass("logo-open");
    } else {
    $(".mobile-nav-box").css(
        "transform",
        "translateY(-110%) rotate(0.001deg)"
    );
    $(".mobile-nav-behind-layer").css("transform", "translateY(-120%)");
    $(".logo span").removeClass("logo-open");
    }
});

// Key ESC - Close Navigation, add similar adjustments for the behind layer
$(document).keydown(function (e) {
    if (e.keyCode == 27) {
    // ESC key
    var $hamburger = $(".hamburger");
    if ($hamburger.hasClass("active")) {
        $hamburger.removeClass("active");
        $("[data-navigation-status]").attr(
        "data-navigation-status",
        "not-active"
        );
        $(".mobile-nav-box").css(
        "transform",
        "translateY(-110%) rotate(0.001deg)"
        );
        $(".mobile-nav-behind-layer").css("transform", "translateY(-120%)");
    }
    }
});
}

/**
 * Magnetic Buttons
 */
function initMagneticButtons() {
  // Only proceed if the viewport is wider than 540px.
  if (window.innerWidth > 540) {
    const magnets = document.querySelectorAll('.magnetic');

    magnets.forEach((magnet) => {
      magnet.addEventListener('mousemove', (event) => {
        const bounding = magnet.getBoundingClientRect();
        const strength = magnet.dataset.strength || 20; // Using dataset for attribute access
        const x = (((event.clientX - bounding.left) / bounding.width) - 0.5) * strength;
        const y = (((event.clientY - bounding.top) / bounding.height) - 0.5) * strength;

        // Here we ensure force3D: true is added for performance optimization
        gsap.to(magnet, { duration: 0.5, x: x, y: y, ease: "power3.out", force3D: true });
      });

      // This listener is correctly placed inside the forEach loop to apply to each magnet
      magnet.addEventListener('mouseleave', () => {
        // Ensure force3D: true is also included here for consistency
        gsap.to(magnet, { duration: 0.5, x: 0, y: 0, ease: "power3.out", force3D: true });
      });
    });
  }
}

function initTimeZone() {
	// Time zone
	// https://stackoverflow.com/questions/39418405/making-a-live-clock-in-javascript/67149791#67149791
	// https://stackoverflow.com/questions/8207655/get-time-of-specific-timezone
	// https://stackoverflow.com/questions/63572780/how-to-update-intl-datetimeformat-with-new-date

	var timeSpanHeader = document.querySelector("#timeTeller");
	var timeSpanFooter = document.querySelector("#timeSpanFooter");

	const optionsTime = {
		timeZone: "America/Los_Angeles",
		timeZoneName: "short",
		// year: 'numeric',
		// month: 'numeric',
		// day: 'numeric',
		hour: "2-digit",
		hour24: "true",
		minute: "numeric",
		second: "numeric",
	};

	const formatter = new Intl.DateTimeFormat([], optionsTime);
	updateTime();
	setInterval(updateTime, 1000);

	function updateTime() {
		const dateTime = new Date();
		const formattedDateTime = formatter.format(dateTime);
		if (timeSpanHeader) {
			timeSpanHeader.textContent = formattedDateTime;
		}
		if (timeSpanFooter) {
			timeSpanFooter.textContent = formattedDateTime;
		}
	}
}

/**
 * Scrolltrigger Animations Desktop + Mobile
 */
function initScrolltriggerAnimations() {
// Only apply animations on screens wider than 1024px
ScrollTrigger.matchMedia({
    "(min-width: 1025px)": function () {
    // Target each .bg-img element
    gsap.utils.toArray(".bg-img").forEach((targetElement) => {
        // Directly ensure full opacity at the start to avoid conflicts
        gsap.set(targetElement, { opacity: 1 });

        // Create the fade-out animation with Power3.easeOut
        gsap.to(targetElement, {
        opacity: 0, // Fade to no opacity
        ease: "Power3.easeOut", // Use Power3.easeOut for the transition
        scrollTrigger: {
            trigger: targetElement,
            scroller: "[data-scroll-container]", // Use Locomotive Scroll's container
            start: "100% 100%", // Adjust this to control when fading starts
            end: "105% 0%", // Adjust this to control when fading ends
            scrub: true,
            // Uncomment the following line for debugging purposes
        },
        });
    });
    },
});
}

