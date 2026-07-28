document.addEventListener("DOMContentLoaded", function () {
    const COOKIE_NAME = "contentninja_cookie_consent_v1";
    const PIXEL_ID = "3857575907663677";
    const ADS_ID = "AW-10918594401";

    // A teljes tájékoztató angolul él (/en/privacy-policy/); a /hu/adatkezeles/
    // egy arra hivatkozó rövid magyar oldal.
    const PRIVACY_URLS = { hu: "/hu/adatkezeles/", en: "/en/privacy-policy/" };

    const STRINGS = {
        hu: {
            title: "Sütiket (cookie-kat) használunk",
            body: "a legjobb felhasználói élmény és analitikai mérések biztosításához (Meta Pixel, Google Ads).",
            link: "Adatkezelési tájékoztató",
            accept: "Elfogadom",
            reject: "Elutasítom",
        },
        en: {
            title: "We use cookies",
            body: "to ensure the best user experience and analytics measurement (Meta Pixel, Google Ads).",
            link: "Privacy policy",
            accept: "Accept",
            reject: "Decline",
        },
    };

    const lang = (document.documentElement.lang || "hu").toLowerCase().startsWith("en") ? "en" : "hu";
    const T = STRINGS[lang];

    function loadMetaPixel() {
        if (window.fbq) return;

        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', PIXEL_ID);
        fbq('track', 'PageView');
    }

    // A gtag() parancssort a BaseLayout állítja fel; itt csak a tényleges
    // scriptet húzzuk be, hozzájárulás után. A queue-ban addig összegyűlt
    // hívások a betöltéskor visszamenőleg lefutnak.
    function loadGoogleAds() {
        if (document.querySelector('script[data-gtag]')) return;

        const s = document.createElement("script");
        s.async = true;
        s.src = "https://www.googletagmanager.com/gtag/js?id=" + ADS_ID;
        s.setAttribute("data-gtag", "");
        document.head.appendChild(s);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', ADS_ID);
    }

    function loadTrackers() {
        loadMetaPixel();
        loadGoogleAds();
    }

    const consent = localStorage.getItem(COOKIE_NAME);

    if (consent === "true") {
        loadTrackers();
    } else if (consent === null) {
        showCookieBanner();
    }

    function showCookieBanner() {
        const banner = document.createElement("div");
        banner.id = "cookie-banner";
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            border-top: 1px solid #e8e8ef;
            box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
            z-index: 99999;
            padding: 20px 24px;
            animation: cookieSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        `;
        banner.innerHTML = `
            <style>
                @keyframes cookieSlideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                #cookie-banner * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
                #cookie-accept {
                    background-color: #6c5ce7;
                    color: white;
                    font-weight: 600;
                    border-radius: 10px;
                    border: none;
                    padding: 10px 24px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.2s ease, transform 0.15s ease;
                    white-space: nowrap;
                }
                #cookie-accept:hover { background-color: #5a4bd6; transform: translateY(-1px); }
                #cookie-reject {
                    background-color: transparent;
                    border: 1.5px solid #6c5ce7;
                    color: #6c5ce7;
                    font-weight: 600;
                    border-radius: 10px;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.2s ease, transform 0.15s ease;
                    white-space: nowrap;
                }
                #cookie-reject:hover { background-color: rgba(108,92,231,0.07); transform: translateY(-1px); }
                #cookie-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    flex-wrap: wrap;
                }
                #cookie-text { flex: 1; min-width: 260px; }
                #cookie-text p { margin: 0; color: #4a4a68; font-size: 13px; line-height: 1.6; }
                #cookie-text strong { color: #1e1e2f; }
                #cookie-text a { color: #6c5ce7; text-decoration: underline; font-weight: 600; }
                #cookie-buttons { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
                #cookie-icon {
                    width: 36px; height: 36px;
                    background: rgba(108,92,231,0.1);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    font-size: 18px;
                }
            </style>
            <div id="cookie-inner">
                <div id="cookie-icon">🍪</div>
                <div id="cookie-text">
                    <p>
                        <strong>${T.title}</strong> ${T.body}
                        <a href="${PRIVACY_URLS[lang]}">${T.link}</a>
                    </p>
                </div>
                <div id="cookie-buttons">
                    <button id="cookie-reject">${T.reject}</button>
                    <button id="cookie-accept">${T.accept}</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById("cookie-accept").addEventListener("click", function () {
            localStorage.setItem(COOKIE_NAME, "true");
            loadTrackers();
            banner.remove();
        });

        document.getElementById("cookie-reject").addEventListener("click", function () {
            localStorage.setItem(COOKIE_NAME, "false");
            banner.remove();
        });
    }
});
