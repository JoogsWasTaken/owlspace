
// function to get viewport width
const windowWidth = () => {
    return window.innerWidth || body.clientWidth;
};

// true if window width <= 576
const isSmall = () => {
    return windowWidth() <= 576;
}

const getScrollPosY = () => {
    return document.documentElement.scrollTop || document.body.scrollTop || 0;
}

// dom elements
const menu = document.getElementById("menu");
const body = document.body;

const scrollCheckMs = 500;

// remember to restore nav bar if viewport size changes
let oldIsSmall = isSmall();
// true if nav is expanded
let isOpen = false;
// true if nav is in the process of or already hidden
let isHidden = false;

// constant to evaluate the scrollDelta var
const scrollDown = 1;
const scrollUp = -1;

// scrollTop value when scroll capture started
let scrollTopStart = 0;
// timeout id, has to be null when no timeout is running
let scrollTimeoutId = null;

document.getElementById("menu-open").addEventListener("click", () => {
    // only works if we're small and visible
    if (!isSmall() || isHidden) {
        return;
    }

    // expand menu
    isOpen = true;
    body.classList.add("expanded"); 
});

document.getElementById("menu-close").addEventListener("click", () => {
    // only works if we're small and visible
    if (!isSmall() || isHidden) {
        return;
    }

    // close menu
    isOpen = false;
    body.classList.remove("expanded"); 
});

window.addEventListener("resize", () => {
    let newIsSmall = isSmall();

    // handle state change
    if (oldIsSmall == true && newIsSmall == false) {
        // cancel scroll timeout
        if (scrollTimeoutId != null) {
            clearTimeout(scrollTimeoutId);
        }

        // restore nav bar
        body.classList.remove("expanded");
        // restore any styles that might still be applied
        menu.style.visibility = "visible";
        menu.style.opacity = 1;
        // restore state vars
        isOpen = false;
        isHidden = false;
        scrollTimeoutId = null;
    }

    oldIsSmall = newIsSmall;
});

window.addEventListener("scroll", () => {
    // only works if we're small
    if (!isSmall()) {
        return;
    }

    // only works if the menu is currently not opened
    if (isOpen) {
        // abort any scroll capture task
        if (scrollTimeoutId != null) {
            clearTimeout(scrollTimeoutId);
        }

        return;
    }

    // only works if we're not already tracking scroll movement
    if (scrollTimeoutId != null) {
        return;
    }

    // check back in 500 ms if we've moved down or up
    scrollTopStart = getScrollPosY();

    scrollTimeoutId = setTimeout(() => {
        let scrollDelta = Math.sign(getScrollPosY() - scrollTopStart);

        if (scrollDelta == scrollDown) {
            // hide menu
            isHidden = true;
            menu.style.opacity = 0;

            // wait for menu to be translucent before hiding it completely
            setTimeout(() => {
                menu.style.visibility = "hidden";
                scrollTimeoutId = null;
            }, scrollCheckMs);
        } else if (scrollDelta == scrollUp) {
            // show menu
            isHidden = false;
            menu.style.visibility = "visible";
            menu.style.opacity = 1;
            // allow next timeout to be scheduled
            scrollTimeoutId = null;
        } else {
            // can be zero if no movement is registered
            scrollTimeoutId = null;
        }
    }, scrollCheckMs);
});