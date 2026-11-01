import "@fontsource/moul/400.css";
import "@fontsource/moulpali/400.css";
import "@fontsource/kantumruy-pro/400.css";
import "@fontsource/kantumruy-pro/500.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/pinyon-script/400.css";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { wedding } from "./data/wedding";
import { copy } from "./data/i18n";
import "./styles.css";

gsap.registerPlugin(CustomEase, ScrollTrigger);
CustomEase.create("hand", "M0,0 C0.12,0.01 0.08,0.45 0.32,0.55 0.62,0.68 0.72,0.98 1,1");

const assetUrl = (file) => `${import.meta.env.BASE_URL}assets/${file}`;
const kitPath = assetUrl("khmer-invite-starter-kit");

const decorativeCorner = (className = "") => `
  <svg class="corner ${className}" viewBox="0 0 180 180" aria-hidden="true">
    <g ${className.includes("--br") ? 'transform="translate(180 180) rotate(180)"' : ""}>
      <image href="${kitPath}/elements/corner.svg" width="180" height="180" />
    </g>
  </svg>`;

const crest = (className = "") => `
  <img class="crest ${className}" src="${kitPath}/elements/crest.svg" alt="" aria-hidden="true" />`;

const divider = (className = "") => `<img class="divider ${className}" src="${kitPath}/elements/divider.svg" alt="" aria-hidden="true" />`;

const butterfly = `
  <img class="logo-butterfly" src="${kitPath}/elements/butterfly.svg" alt="" aria-hidden="true" />`;

const nameLogo = (modifier = "") => `
  <div class="name-logo ${modifier}" aria-label="${wedding.couple.groom.shortKh} and ${wedding.couple.bride.shortKh}">
    ${crest("logo-crest")}
    <div class="logo-stage">
      <span class="logo-name logo-name--groom" data-name="groom">${wedding.couple.groom.shortKh}</span>
      <svg class="logo-flourish" viewBox="0 0 310 96" preserveAspectRatio="none" aria-hidden="true">
        <path class="flourish-path" d="M44 48c50-42 78 38 126 0 35-28 63-19 96-3"/>
        <path class="flourish-curl" d="M131 54c12 18 38 18 49 0"/>
      </svg>
      <span class="logo-heart" aria-hidden="true">♥</span>
      ${butterfly}
      <span class="logo-name logo-name--bride" data-name="bride">${wedding.couple.bride.shortKh}</span>
    </div>
  </div>`;

const dateCells = (lang) => {
  const d = wedding.date;
  const values = lang === "km"
    ? [d.weekdayKh, d.dayKh, d.monthKh, d.yearKh]
    : [d.weekdayEn, d.dayEn, d.monthEn, d.yearEn];
  const labels = [copy[lang].day, copy[lang].date, copy[lang].month, copy[lang].year];
  return values.map((value, i) => `
    <div class="date-cell">
      <span class="date-label">${labels[i]}</span>
      <span class="date-value">${value}</span>
    </div>`).join("");
};

const ritualIcon = (type) => {
  const paths = {
    lotus: "M24 38C17 29 10 25 3 24c5-5 11-7 18-5-1-6 0-11 3-15 4 4 5 9 3 15 7-2 13 0 18 5-8 1-15 5-21 14Z",
    ring: "M13 26a11 11 0 1 0 22 0 11 11 0 1 0-22 0Zm7-14 4-7 4 7-4 5-4-5Z",
    blessing: "M24 42V13M8 19c8 1 13 5 16 13M40 19c-8 1-13 5-16 13M11 38c8 5 18 5 26 0",
    dinner: "M10 5v16c0 4 3 7 7 7V5M24 5v37M36 5v15c0 4-3 7-7 7",
  };
  return `<svg class="ritual-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="${paths[type] || paths.lotus}"/></svg>`;
};

const programmeItems = () => wedding.programme.map((item) => `
  <article class="programme-item">
    <div class="programme-icon">${ritualIcon(item.icon)}</div>
    <div class="programme-copy">
      <time class="lang-km">${item.timeKh}</time><time class="lang-en">${item.timeEn}</time>
      <p class="lang-km">${item.titleKh}</p><p class="lang-en">${item.titleEn}</p>
    </div>
  </article>`).join("");

const storyCards = () => wedding.story.map((item, index) => `
  <article class="story-card">
    <div class="story-photo" style="--story-image:url('${wedding.assets.story[index].src}');--story-position:${wedding.assets.story[index].position}"></div>
    <div class="story-number">${item.number}</div>
    <div class="story-caption">
      <h3 class="lang-km">${item.titleKh}</h3><h3 class="lang-en">${item.titleEn}</h3>
      <p class="lang-km">${item.captionKh}</p><p class="lang-en">${item.captionEn}</p>
    </div>
  </article>`).join("");

const galleryCards = () => wedding.gallery.map((item, index) => `
  <button class="gallery-item gallery-item--${index + 1}" type="button" data-gallery-index="${index}" aria-label="${item.altKh}">
    <img src="${item.src}" alt="${item.altKh}" style="object-position:${item.position}" loading="lazy" />
    <span>0${index + 1}</span>
  </button>`).join("");

const parentLines = (side) => `
  <p>លោក ${wedding.parents[side].father}</p>
  <p>និងលោកស្រី ${wedding.parents[side].mother}</p>`;

document.querySelector("#app").innerHTML = `
  <main class="experience" data-lang="km">
    <section class="envelope-screen" aria-labelledby="envelope-title">
      <div class="envelope-backdrop" aria-hidden="true"></div>
      <div class="ambient-grain" aria-hidden="true"></div>
      <div class="opening-effects" aria-hidden="true">
        ${Array.from({ length: 8 }, (_, index) => `<i class="opening-sparkle" style="--x:${30 + ((index * 17) % 42)}%;--y:${37 + ((index * 13) % 24)}%"></i>`).join("")}
        ${Array.from({ length: 10 }, (_, index) => `<i class="opening-gold-particle" style="--x:${32 + ((index * 19) % 38)}%;--y:${43 + ((index * 11) % 18)}%"></i>`).join("")}
      </div>
      <header class="envelope-heading">
        <p class="eyebrow lang-km" id="envelope-title">${copy.km.invitation}</p>
        <p class="eyebrow lang-en" id="envelope-title-en">${copy.en.invitation}</p>
        <p class="english-title">The Wedding Invitation</p>
      </header>

      <div class="envelope-stage-wrap">
        <div class="envelope-stage" id="envelope-stage">
          <div class="envelope-back paper-dark"></div>
          <div class="inner-card paper-cream">
            <div class="card-border"></div>
            ${decorativeCorner("card-corner card-corner--tl")}
            ${decorativeCorner("card-corner card-corner--br")}
            ${nameLogo("name-logo--card")}
            <p class="card-whisper lang-km">${copy.km.respect}</p>
            <p class="card-whisper lang-en">${copy.en.respect}</p>
          </div>

          <div class="pocket">
            <div class="pocket-panel pocket-panel--left paper-olive"></div>
            <div class="pocket-panel pocket-panel--right paper-olive"></div>
            <div class="pocket-panel pocket-panel--bottom paper-olive"></div>
            <div class="pocket-rim"></div>
          </div>

          <div class="flap" id="flap">
            <div class="flap-face flap-face--front paper-olive">
              <svg class="flap-scallop" viewBox="0 0 600 34" preserveAspectRatio="none" aria-hidden="true"><path d="M0 2h600v8c-14 0-14 18-28 18s-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18-14 18-28 18-14-18-28-18S14 10 0 10Z"/></svg>
              ${nameLogo("name-logo--flap")}
            </div>
            <div class="flap-face flap-face--back paper-cream">
              <div class="lining-ornament">${crest("lining-crest")}</div>
            </div>
          </div>

          <button class="wax-seal" id="open-invitation" type="button" aria-label="${copy.km.open}">
            <img src="${kitPath}/elements/wax-seal.svg" alt="" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="open-prompt" aria-hidden="true">
        <span class="prompt-line"></span>
        <span class="prompt-copy lang-km">${copy.km.open}</span>
        <span class="prompt-copy lang-en">${copy.en.open}</span>
      </div>
      <p class="opening-status" aria-live="polite"></p>
    </section>

    <section class="cover" id="cover" aria-labelledby="cover-title">
      <div class="cover-photo" aria-hidden="true"></div>
      <div class="cover-vignette" aria-hidden="true"></div>
      <div class="cover-grain" aria-hidden="true"></div>
      ${decorativeCorner("cover-corner cover-corner--tl")}
      ${decorativeCorner("cover-corner cover-corner--br")}

      <nav class="topbar" aria-label="Invitation controls">
        ${nameLogo("name-logo--mini")}
        <div class="topbar-actions">
          <button class="round-button" id="lang-toggle" type="button" aria-label="Switch language">EN</button>
          <button class="round-button music-toggle" id="music-toggle" type="button" aria-label="Play music" aria-pressed="false">
            <img class="music-icon" src="${assetUrl("audio_mute.svg")}" alt="" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div class="cover-content">
        <div class="cover-intro reveal-line">
          ${crest("cover-crest")}
          <p class="ceremonial lang-km" id="cover-title">${copy.km.invitation}</p>
          <p class="ceremonial lang-en" id="cover-title-en">${copy.en.invitation}</p>
        </div>
        ${nameLogo("name-logo--hero")}
        <div class="english-names reveal-line">
          <span>${wedding.couple.groom.en}</span><i aria-hidden="true">&amp;</i><span>${wedding.couple.bride.en}</span>
        </div>
        <p class="respect reveal-line lang-km">${copy.km.respect}</p>
        <p class="respect reveal-line lang-en">${copy.en.respect}</p>
        <div class="date-row reveal-line" data-date-row>${dateCells("km")}</div>
        <p class="lunar reveal-line">${wedding.date.lunarKh}</p>
        <p class="venue reveal-line">${wedding.venue.kh}</p>
      </div>

      <div class="scroll-cue" aria-hidden="true">
        <span class="lang-km">${copy.km.scroll}</span><span class="lang-en">${copy.en.scroll}</span>
        <i></i>
      </div>
    </section>

    <section class="paper-section formal-section" id="words" aria-labelledby="formal-title">
      ${decorativeCorner("section-corner section-corner--tl")}
      ${decorativeCorner("section-corner section-corner--br")}
      <div class="section-shell formal-grid">
        <div class="arched-photo reveal-photo"><img src="${wedding.assets.section2}" alt="Pre-wedding portrait" loading="lazy" /></div>
        <div class="parents-grid">
          <div class="parent-block reveal-copy">
            <p class="section-label lang-km">${copy.km.parentsGroom}</p><p class="section-label lang-en">${copy.en.parentsGroom}</p>
            <div class="khmer-lines">${parentLines("groom")}</div>
          </div>
          <div class="parent-divider">${divider("divider-art")}</div>
          <div class="parent-block reveal-copy">
            <p class="section-label lang-km">${copy.km.parentsBride}</p><p class="section-label lang-en">${copy.en.parentsBride}</p>
            <div class="khmer-lines">${parentLines("bride")}</div>
          </div>
        </div>
        <div class="formal-copy reveal-copy">
          ${crest("section-crest")}
          <h2 class="section-title lang-km" id="formal-title">${copy.km.formalTitle}</h2>
          <h2 class="section-title lang-en">${copy.en.formalTitle}</h2>
          <p class="formal-body lang-km">${copy.km.formalBody}</p>
          <p class="formal-body lang-en">${copy.en.formalBody}</p>
          <div class="formal-names">
            <div><span class="lang-km">${copy.km.groomLabel}</span><span class="lang-en">${copy.en.groomLabel}</span><strong>${wedding.couple.groom.kh}</strong></div>
            <i>&amp;</i>
            <div><span class="lang-km">${copy.km.brideLabel}</span><span class="lang-en">${copy.en.brideLabel}</span><strong>${wedding.couple.bride.kh}</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="dark-section couple-section" id="couple" aria-labelledby="couple-title" style="--section3-background:url('${wedding.assets.section3Background}')">
      <div class="couple-glow" aria-hidden="true"></div>
      <div class="section-shell couple-shell">
        <div class="section-heading light-heading reveal-copy">
          ${crest("section-crest")}
          <h2 class="section-title lang-km" id="couple-title">${copy.km.coupleTitle}</h2>
          <h2 class="section-title lang-en">${copy.en.coupleTitle}</h2>
        </div>
        <div class="scalloped-photo reveal-photo section3-photo"><img src="${wedding.assets.section3}" alt="The couple" loading="lazy" /></div>
        <div class="couple-cards">
          <article class="person-card reveal-copy">
            <span class="lang-km">កូនកំលោះ</span><span class="lang-en">Groom</span>
            <h3>${wedding.couple.groom.kh}</h3><em>${wedding.couple.groom.en}</em>
            <p class="lang-km">${copy.km.sonOf}<br>លោក ${wedding.parents.groom.father}<br>${copy.km.and}លោកស្រី ${wedding.parents.groom.mother}</p>
            <p class="lang-en">${copy.en.sonOf}<br>${wedding.parents.groom.father}<br>${copy.en.and} ${wedding.parents.groom.mother}</p>
          </article>
          <div class="couple-amp">&amp;</div>
          <article class="person-card reveal-copy">
            <span class="lang-km">កូនក្រមុំ</span><span class="lang-en">Bride</span>
            <h3>${wedding.couple.bride.kh}</h3><em>${wedding.couple.bride.en}</em>
            <p class="lang-km">${copy.km.daughterOf}<br>លោក ${wedding.parents.bride.father}<br>${copy.km.and}លោកស្រី ${wedding.parents.bride.mother}</p>
            <p class="lang-en">${copy.en.daughterOf}<br>${wedding.parents.bride.father}<br>${copy.en.and} ${wedding.parents.bride.mother}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="countdown-section" id="countdown" aria-labelledby="countdown-title">
      <div class="blessing-marquee" aria-hidden="true"><div>${Array(5).fill(`<span class="lang-km">${copy.km.blessing}</span><span class="lang-en">${copy.en.blessing}</span>`).join("")}</div></div>
      <div class="countdown-card reveal-copy">
        ${crest("section-crest")}
        <h2 class="section-title lang-km" id="countdown-title">${copy.km.countdown}</h2>
        <h2 class="section-title lang-en">${copy.en.countdown}</h2>
        <div class="countdown-grid" aria-live="polite">
          <div><strong data-count="days">––</strong><span class="lang-km">${copy.km.days}</span><span class="lang-en">${copy.en.days}</span></div>
          <div><strong data-count="hours">––</strong><span class="lang-km">${copy.km.hours}</span><span class="lang-en">${copy.en.hours}</span></div>
          <div><strong data-count="minutes">––</strong><span class="lang-km">${copy.km.minutes}</span><span class="lang-en">${copy.en.minutes}</span></div>
          <div><strong data-count="seconds">––</strong><span class="lang-km">${copy.km.seconds}</span><span class="lang-en">${copy.en.seconds}</span></div>
        </div>
        <p class="countdown-date">${wedding.date.weekdayKh} · ${wedding.date.dayKh} ${wedding.date.monthKh} ${wedding.date.yearKh} · ${wedding.date.timeKh}</p>
      </div>
    </section>

    <section class="paper-section programme-section" id="programme" aria-labelledby="programme-title">
      <div class="section-shell programme-shell">
        <div class="section-heading reveal-copy">
          ${crest("section-crest")}
          <h2 class="section-title lang-km" id="programme-title">${copy.km.programme}</h2>
          <h2 class="section-title lang-en">${copy.en.programme}</h2>
          <p class="programme-date lang-km">${copy.km.programmeDate}</p><p class="programme-date lang-en">${copy.en.programmeDate}</p>
        </div>
        <div class="programme-timeline">
          <svg class="gold-thread" viewBox="0 0 8 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M4 0C8 100 0 180 4 260s4 170 0 250 4 180 0 260 4 150 0 230"/></svg>
          ${programmeItems()}
        </div>
      </div>
    </section>

    <section class="story-section" id="story" aria-labelledby="story-title">
      <div class="story-sticky">
        <div class="story-heading">
          <p class="story-kicker lang-km">${copy.km.storyKicker}</p><p class="story-kicker lang-en">${copy.en.storyKicker}</p>
          <h2 class="section-title lang-km" id="story-title">${copy.km.storyTitle}</h2><h2 class="section-title lang-en">${copy.en.storyTitle}</h2>
          <p class="story-hint lang-km">${copy.km.storyHint}</p><p class="story-hint lang-en">${copy.en.storyHint}</p>
        </div>
        <div class="story-track">${storyCards()}<div class="story-end">${nameLogo("name-logo--story")}</div></div>
      </div>
    </section>

    <section class="candle-section" id="candle" aria-labelledby="candle-title">
      <div class="candle-photo" aria-hidden="true"></div>
      <div class="water-sheen" id="water-surface"></div>
      <div class="candle-copy reveal-copy">
        <p class="lang-km">${copy.km.candleKicker}</p><p class="lang-en">${copy.en.candleKicker}</p>
        <h2 id="candle-title">${wedding.couple.groom.shortKh} <i>&amp;</i> ${wedding.couple.bride.shortKh}</h2>
        <span class="lang-km">${copy.km.candleHint}</span><span class="lang-en">${copy.en.candleHint}</span>
      </div>
      <div class="lotus-lantern" aria-hidden="true"><i></i><b></b></div>
    </section>

    <section class="dark-section gallery-section" id="gallery" aria-labelledby="gallery-title">
      <div class="section-shell gallery-shell">
        <div class="section-heading light-heading reveal-copy">
          <p class="section-kicker lang-km">${copy.km.galleryKicker}</p><p class="section-kicker lang-en">${copy.en.galleryKicker}</p>
          <h2 class="section-title lang-km" id="gallery-title">${copy.km.galleryTitle}</h2><h2 class="section-title lang-en">${copy.en.galleryTitle}</h2>
        </div>
        <div class="masonry-grid">${galleryCards()}</div>
      </div>
    </section>

    <section class="paper-section venue-section" id="venue" aria-labelledby="venue-title">
      <div class="section-shell venue-shell">
        ${crest("venue-crest")}
        <p class="section-kicker lang-km">${copy.km.venueKicker}</p><p class="section-kicker lang-en">${copy.en.venueKicker}</p>
        <h2 class="section-title" id="venue-title"><span class="lang-km">${wedding.venue.kh}</span><span class="lang-en">${wedding.venue.en}</span></h2>
        <p class="venue-address"><span class="lang-km">${wedding.venue.addressKh}</span><span class="lang-en">${wedding.venue.addressEn}</span></p>
        <div class="venue-meta"><span>${wedding.date.weekdayKh}</span><i>✦</i><span>${wedding.date.dayKh} ${wedding.date.monthKh} ${wedding.date.yearKh}</span><i>✦</i><span>${wedding.date.timeKh}</span></div>
        <div class="map-frame">
          <div class="map-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 21s6-5.15 6-11a6 6 0 1 0-12 0c0 5.85 6 11 6 11Z"/><circle cx="12" cy="10" r="2.25"/></svg>
            <span class="lang-km">ទីតាំងពិធី</span><span class="lang-en">Wedding venue</span>
          </div>
          <span class="map-corner map-corner--tl" aria-hidden="true"></span>
          <span class="map-corner map-corner--br" aria-hidden="true"></span>
          ${wedding.venue.mapEmbed
            ? `<iframe title="Wedding venue map" src="${wedding.venue.mapEmbed}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`
            : wedding.venue.lat && wedding.venue.lng
              ? `<iframe title="Wedding venue map" loading="lazy" src="https://maps.google.com/maps?q=${wedding.venue.lat},${wedding.venue.lng}&output=embed"></iframe>`
              : `<div class="map-placeholder">${crest("map-crest")}<span class="lang-km">${copy.km.mapPending}</span><span class="lang-en">${copy.en.mapPending}</span></div>`}
        </div>
        <div class="venue-actions">
          <a class="gold-button ${wedding.venue.lat ? "" : "is-disabled"}" ${wedding.venue.lat ? `href="https://www.google.com/maps?q=${wedding.venue.lat},${wedding.venue.lng}" target="_blank" rel="noreferrer"` : "aria-disabled=\"true\""}><span class="lang-km">${copy.km.openMaps}</span><span class="lang-en">${copy.en.openMaps}</span></a>
          <button class="gold-button" id="calendar-button" type="button"><span class="lang-km">${copy.km.calendar}</span><span class="lang-en">${copy.en.calendar}</span></button>
        </div>
      </div>
    </section>

    <section class="gift-section" id="gift" aria-labelledby="gift-title" style="--section10-background:url('${wedding.assets.section10Background}')">
      <div class="section-shell gift-shell">
        ${crest("section-crest")}
        <h2 class="section-title lang-km" id="gift-title">${copy.km.gift}</h2><h2 class="section-title lang-en">${copy.en.gift}</h2>
        <p class="gift-body lang-km">${copy.km.giftBody}</p><p class="gift-body lang-en">${copy.en.giftBody}</p>
        <div class="qr-grid">
          ${["KHQR", "ABA PAY"].map((label) => `<article class="qr-card"><strong>${label}</strong><div class="qr-placeholder">${crest("qr-crest")}<span class="lang-km">${copy.km.qrPending}</span><span class="lang-en">${copy.en.qrPending}</span></div><button class="qr-save" type="button" disabled><span class="lang-km">${copy.km.saveQr}</span><span class="lang-en">${copy.en.saveQr}</span></button></article>`).join("")}
        </div>
      </div>
    </section>

    <section class="finale-section" id="finale" aria-labelledby="thanks-title">
      <div class="finale-photo" aria-hidden="true"></div>
      <div class="candle-row" aria-hidden="true">${Array(7).fill(0).map((_, i) => `<i style="--i:${i}"><b></b></i>`).join("")}</div>
      <div class="finale-content reveal-copy">
        ${crest("finale-crest")}
        <h2 class="section-title lang-km" id="thanks-title">${copy.km.thanks}</h2><h2 class="section-title lang-en">${copy.en.thanks}</h2>
        <p class="lang-km">${copy.km.thanksBody}</p><p class="lang-en">${copy.en.thanksBody}</p>
        <div class="share-grid">
          <button data-share="telegram" type="button"><b aria-hidden="true"><img src="${assetUrl("icon_telegram.png")}" alt="" /></b><span class="lang-km">${copy.km.shareTelegram}</span><span class="lang-en">${copy.en.shareTelegram}</span></button>
          <button data-share="messenger" type="button"><b aria-hidden="true"><img src="${assetUrl("icon_messager.png")}" alt="" /></b><span class="lang-km">${copy.km.shareMessenger}</span><span class="lang-en">${copy.en.shareMessenger}</span></button>
          <button data-share="facebook" type="button"><b aria-hidden="true"><img src="${assetUrl("icon_facebook.png")}" alt="" /></b><span class="lang-km">${copy.km.shareFacebook}</span><span class="lang-en">${copy.en.shareFacebook}</span></button>
          <button data-share="copy" type="button"><b aria-hidden="true"><img src="${assetUrl("icon_link.png")}" alt="" /></b><span class="lang-km">${copy.km.copyLink}</span><span class="lang-en">${copy.en.copyLink}</span></button>
        </div>
        ${nameLogo("name-logo--finale")}
      </div>
      <footer class="site-credits">
        <span>Developed by Saky Unfake.</span>
        <span>Design inspired by Someth Phay.</span>
      </footer>
    </section>

    ${wedding.assets.music ? `<audio id="invitation-music" src="${wedding.assets.music}" preload="auto" loop></audio>` : ""}

    <div class="gallery-viewer" id="gallery-viewer" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <button class="viewer-close" type="button" aria-label="Close">×</button>
      <button class="viewer-prev" type="button" aria-label="Previous">‹</button>
      <img src="${wedding.assets.hero}" alt="Pre-wedding portrait" />
      <button class="viewer-next" type="button" aria-label="Next">›</button>
      <span class="viewer-count">1 / ${wedding.gallery.length}</span>
    </div>
  </main>`;

const experience = document.querySelector(".experience");
const openButton = document.querySelector("#open-invitation");
const envelopeStage = document.querySelector("#envelope-stage");
const envelopeScreen = document.querySelector(".envelope-screen");
const cover = document.querySelector("#cover");
const flap = document.querySelector("#flap");
const musicToggle = document.querySelector("#music-toggle");
const musicIcon = musicToggle.querySelector(".music-icon");
const invitationMusic = document.querySelector("#invitation-music");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let opened = false;
let currentLang = "km";

document.title = `${wedding.couple.groom.shortKh} & ${wedding.couple.bride.shortKh} · ${copy.km.invitation}`;

function setMusicState(isPlaying) {
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Mute music" : "Play music");
  musicToggle.classList.toggle("is-on", isPlaying);
  musicIcon.src = isPlaying ? assetUrl("audio_play.svg") : assetUrl("audio_mute.svg");
}

function startInvitationMusic() {
  if (!invitationMusic) return;
  invitationMusic.volume = 0.65;
  invitationMusic.play().then(() => setMusicState(true)).catch(() => setMusicState(false));
}
let experienceReady = false;
document.documentElement.classList.add("invitation-locked");

function animateLogo(root, delay = 0) {
  const names = root.querySelectorAll(".logo-name");
  const path = root.querySelector(".flourish-path");
  const curl = root.querySelector(".flourish-curl");
  const heart = root.querySelector(".logo-heart");
  const fly = root.querySelector(".logo-butterfly");
  if (!path) return;
  const lengths = [path, curl].map((p) => p.getTotalLength());
  [path, curl].forEach((p, i) => gsap.set(p, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] }));
  const tl = gsap.timeline({ delay });
  tl.fromTo(names, { clipPath: "inset(-40% 110% -40% -10%)" }, { clipPath: "inset(-40% -10% -40% -10%)", duration: 1.05, stagger: .16, ease: "power3.out", clearProps: "clipPath" })
    .to([path, curl], { strokeDashoffset: 0, duration: 1.05, stagger: .08, ease: "power2.inOut" }, "<.15")
    .fromTo(heart, { scale: 0, rotate: -18 }, { scale: 1, rotate: 0, duration: .5, ease: "back.out(2.3)" }, "-=.35")
    .fromTo(fly, { x: 48, y: -25, opacity: 0, rotate: 15 }, { x: 0, y: 0, opacity: 1, rotate: 0, duration: .85, ease: "power2.out" }, "-=.3");
}

function formatCount(value) {
  return new Intl.NumberFormat(currentLang === "km" ? "km-KH" : "en", { minimumIntegerDigits: 2, useGrouping: false }).format(value);
}

function updateCountdown() {
  if (!wedding.date.iso) return;
  const remaining = Math.max(0, new Date(wedding.date.iso).getTime() - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };
  Object.entries(values).forEach(([key, value]) => {
    const node = document.querySelector(`[data-count="${key}"]`);
    if (node) node.textContent = formatCount(value);
  });
}

function initGallery() {
  const viewer = document.querySelector("#gallery-viewer");
  const viewerImage = viewer.querySelector("img");
  const viewerCount = viewer.querySelector(".viewer-count");
  let activeIndex = 0;
  const show = (index) => {
    activeIndex = (index + wedding.gallery.length) % wedding.gallery.length;
    const photo = wedding.gallery[activeIndex];
    viewerImage.src = photo.src;
    viewerImage.alt = currentLang === "km" ? photo.altKh : photo.altEn;
    viewerImage.style.objectPosition = photo.position;
    viewerCount.textContent = `${activeIndex + 1} / ${wedding.gallery.length}`;
  };
  const open = (index) => { show(index); viewer.classList.add("is-open"); viewer.setAttribute("aria-hidden", "false"); document.documentElement.classList.add("invitation-locked"); };
  const close = () => { viewer.classList.remove("is-open"); viewer.setAttribute("aria-hidden", "true"); document.documentElement.classList.remove("invitation-locked"); };
  document.querySelectorAll("[data-gallery-index]").forEach((item) => item.addEventListener("click", () => open(Number(item.dataset.galleryIndex))));
  viewer.querySelector(".viewer-close").addEventListener("click", close);
  viewer.querySelector(".viewer-prev").addEventListener("click", () => show(activeIndex - 1));
  viewer.querySelector(".viewer-next").addEventListener("click", () => show(activeIndex + 1));
  viewer.addEventListener("click", (event) => event.target === viewer && close());
  addEventListener("keydown", (event) => {
    if (!viewer.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(activeIndex - 1);
    if (event.key === "ArrowRight") show(activeIndex + 1);
  });
}

function initSharing() {
  const shareText = `${copy[currentLang].invitation} — ${wedding.couple.groom.en} & ${wedding.couple.bride.en}`;
  document.querySelectorAll("[data-share]").forEach((button) => button.addEventListener("click", async () => {
    const url = location.href;
    const service = button.dataset.share;
    if (service === "copy") {
      await navigator.clipboard?.writeText(url);
      button.querySelector(`.lang-${currentLang}`).textContent = copy[currentLang].copied;
      return;
    }
    const targets = {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(addTelegramPreviewVersion(url))}&text=${encodeURIComponent(shareText)}`,
      messenger: `fb-messenger://share/?link=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    open(targets[service], "_blank", "noopener,noreferrer");
  }));
}

function addTelegramPreviewVersion(url) {
  const shareUrl = new URL(url);
  shareUrl.hash = "";
  shareUrl.searchParams.set("preview", "20261101");
  return shareUrl.toString();
}

function initCandle() {
  const section = document.querySelector("#candle");
  const lantern = section.querySelector(".lotus-lantern");
  section.addEventListener("pointerdown", (event) => {
    const rect = section.getBoundingClientRect();
    const ripple = document.createElement("i");
    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    section.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
    lantern.style.left = `${event.clientX - rect.left}px`;
    lantern.style.top = `${event.clientY - rect.top}px`;
    lantern.classList.add("is-floating");
  });
}

function initMotion() {
  if (reducedMotion) return;
  if (matchMedia("(min-width: 800px)").matches) {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  gsap.utils.toArray(".reveal-copy").forEach((element) => gsap.from(element, { y: 34, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } }));
  gsap.utils.toArray(".reveal-photo:not(.section3-photo)").forEach((element) => gsap.from(element, { clipPath: "inset(8% 12% 92% 12% round 42% 42% 0 0)", duration: 1.25, ease: "power3.inOut", scrollTrigger: { trigger: element, start: "top 82%", once: true, onComplete: () => gsap.set(element, { clearProps: "clipPath" }) } }));
  const section3Photo = document.querySelector(".section3-photo");
  if (section3Photo) {
    const section3Image = section3Photo.querySelector("img");
    gsap.set(section3Photo, {
      autoAlpha: 0,
      y: 72,
      scale: .86,
      rotate: -2,
      transformOrigin: "50% 50%",
    });
    gsap.set(section3Image, { scale: 1.24, filter: "blur(7px) brightness(.72)" });
    gsap.timeline({
      scrollTrigger: { trigger: section3Photo, start: "top 88%", once: true },
    })
      .to(section3Photo, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 1.3,
        ease: "back.out(1.25)",
      })
      .to(section3Image, {
        scale: 1,
        filter: "blur(0px) brightness(1)",
        duration: 1.55,
        ease: "power3.out",
      }, 0);
  }
  gsap.to(".gold-thread path", { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".programme-timeline", start: "top 78%", end: "bottom 70%", scrub: true } });
  document.querySelectorAll(".programme-item").forEach((item) => {
    const path = item.querySelector(".ritual-icon path");
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", scrollTrigger: { trigger: item, start: "top 82%", once: true } });
    gsap.from(item, { x: 34, opacity: 0, duration: .9, scrollTrigger: { trigger: item, start: "top 84%", once: true } });
  });
  gsap.utils.toArray(".gallery-item").forEach((item, index) => {
    const image = item.querySelector("img");
    const direction = index % 2 === 0 ? -1 : 1;
    gsap.set(item, { autoAlpha: 0, y: 58, rotate: direction * 1.8, scale: .94, transformOrigin: "50% 65%" });
    gsap.set(image, { scale: 1.13, filter: "saturate(.45) brightness(.72)" });
    gsap.timeline({ scrollTrigger: { trigger: item, start: "top 90%", once: true } })
      .to(item, {
        autoAlpha: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        duration: 1.05,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      })
      .to(image, {
        scale: 1,
        filter: "saturate(.84) brightness(1)",
        duration: 1.25,
        ease: "power3.out",
        clearProps: "transform,filter",
      }, 0);
  });
  const track = document.querySelector(".story-track");
  const story = document.querySelector(".story-section");
  gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: "none", scrollTrigger: { trigger: story, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } });
  gsap.to(".candle-photo", { yPercent: 3, ease: "none", scrollTrigger: { trigger: ".candle-section", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".candle-row > i", { scaleY: 1, duration: .45, stagger: .14, ease: "back.out(1.7)", scrollTrigger: { trigger: ".finale-section", start: "top 55%", once: true } });
  ScrollTrigger.refresh();
}

function initExperience() {
  if (experienceReady) return;
  experienceReady = true;
  document.documentElement.classList.remove("invitation-locked");
  addEventListener("scroll", () => document.querySelector(".topbar").classList.toggle("is-scrolled", scrollY > 40), { passive: true });
  updateCountdown();
  if (wedding.date.iso) setInterval(updateCountdown, 1000);
  initGallery();
  initSharing();
  initCandle();
  initMotion();
}

function showCover(introDelay = 0) {
  if (cover.classList.contains("is-visible")) return;
  cover.classList.add("is-visible");
  envelopeScreen.style.pointerEvents = "none";
  envelopeScreen.setAttribute("aria-hidden", "true");
  cover.removeAttribute("aria-hidden");
  const content = cover.querySelectorAll(".cover-intro, .english-names, .respect, .date-row, .lunar, .venue, .scroll-cue");
  gsap.timeline()
    .fromTo(".cover-photo", { scale: 1.055 }, { scale: 1, duration: 1.15, ease: "power2.out" })
    .fromTo(content, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .62, stagger: .045, ease: "power3.out" }, .08 + introDelay);
  animateLogo(cover.querySelector(".name-logo--hero"), .12 + introDelay);
  initExperience();
}

function openInvitation() {
  if (opened) return;
  opened = true;
  openButton.disabled = true;
  openButton.setAttribute("aria-disabled", "true");
  startInvitationMusic();
  document.querySelector(".opening-status").textContent = copy[currentLang].opening;
  document.body.classList.add("is-opening");
  const seal = document.querySelector(".wax-seal");
  const card = document.querySelector(".inner-card");
  const pocket = document.querySelector(".pocket");
  const prompt = document.querySelector(".open-prompt");
  const effects = document.querySelector(".opening-effects");
  const sparkles = gsap.utils.toArray(".opening-sparkle");
  const goldParticles = gsap.utils.toArray(".opening-gold-particle");
  const tl = gsap.timeline();

  if (reducedMotion) {
    tl.set([seal, flap, card, pocket], { opacity: 0 }).to(envelopeScreen, { opacity: 0, duration: .35, onComplete: showCover });
    return;
  }

  gsap.killTweensOf([envelopeStage, seal, flap, card, pocket]);
  gsap.set(envelopeStage, { rotateX: 0, rotateY: 0 });

  tl.set(effects, { opacity: 1 }, 0)
    .set(goldParticles, { x: 0, y: 10, scale: .35, opacity: 0 }, 0)
    .to(prompt, { opacity: 0, y: 8, duration: .24, ease: "power2.out" }, 0)
    .to(envelopeStage, { scale: .985, y: 2, duration: .18, ease: "power2.inOut" }, 0)
    .to(seal, { scale: .86, y: 4, rotate: -3, duration: .16, ease: "power2.in" }, 0)
    .to(seal, { scale: 1.06, y: 0, rotate: 2, duration: .18, ease: "back.out(2.2)" }, .16)
    .fromTo(sparkles, { scale: 0, opacity: 0, rotate: 0 }, { scale: 1.1, opacity: .8, rotate: 45, duration: .22, stagger: .035, repeat: 1, yoyo: true, ease: "sine.inOut" }, .2)
    .to(goldParticles, { opacity: .72, scale: 1, duration: .16, stagger: .025, ease: "power1.out" }, .22)
    .to(goldParticles, { x: (index) => (index % 2 ? -1 : 1) * (18 + (index % 4) * 13), y: (index) => -34 - (index % 5) * 12, opacity: 0, duration: .68, stagger: .025, ease: "power2.out" }, .32)
    .to(seal, { y: 14, scale: .68, opacity: 0, filter: "drop-shadow(0 4px 5px rgba(0,0,0,.25)) blur(1.5px)", duration: .34, ease: "power2.in" }, .34)
    .to(envelopeStage, { scale: 1, y: 0, filter: "drop-shadow(0 22px 28px rgba(0,0,0,.26))", duration: .58, ease: "power2.out" }, .3)
    .to(flap, { rotateX: -180, duration: 1.02, ease: "power3.inOut", onUpdate() { if (Math.abs(gsap.getProperty(flap, "rotateX")) > 90) flap.classList.add("is-behind"); } }, .48)
    .fromTo(card, { y: "3%", scale: .955, opacity: .72 }, { y: "-58%", scale: 1.025, opacity: 1, duration: 1.08, ease: "power3.out" }, 1.14)
    .to(card, { y: "-66%", scale: 1.08, filter: "drop-shadow(0 32px 38px rgba(0,0,0,.24))", duration: .3, ease: "power2.out" }, 1.88)
    .to(card, { y: "-36%", scale: 1.025, filter: "drop-shadow(0 20px 26px rgba(0,0,0,.2))", duration: .62, ease: "back.out(1.35)" }, 2.1)
    .to([flap, pocket], { opacity: 0, duration: .46, ease: "power2.in" }, 2.42)
    .call(showCover, [.45], 2.48)
    .to(envelopeScreen, { opacity: 0, duration: .78, ease: "power2.inOut" }, 2.48)
    .to(card, { scale: 1.08, opacity: 0, duration: .58, ease: "power2.in" }, 2.55)
    .set(effects, { opacity: 0 }, 3.3);
}

openButton.addEventListener("click", openInvitation);
openButton.addEventListener("pointerenter", () => !opened && gsap.to(openButton, { scale: 1.06, duration: .35, ease: "power2.out" }));
openButton.addEventListener("pointerleave", () => !opened && gsap.to(openButton, { scale: 1, duration: .35, ease: "power2.out" }));

const canTilt = matchMedia("(pointer:fine)").matches && !reducedMotion;
if (canTilt) {
  envelopeScreen.addEventListener("pointermove", (event) => {
    if (opened) return;
    const x = (event.clientX / innerWidth - .5) * 5;
    const y = (event.clientY / innerHeight - .5) * -4;
    gsap.to(envelopeStage, { rotateY: x, rotateX: y, duration: .8, ease: "power2.out" });
  });
  envelopeScreen.addEventListener("pointerleave", () => !opened && gsap.to(envelopeStage, { rotateX: 0, rotateY: 0, duration: 1 }));
}

document.querySelector("#lang-toggle").addEventListener("click", (event) => {
  currentLang = currentLang === "km" ? "en" : "km";
  experience.dataset.lang = currentLang;
  event.currentTarget.textContent = currentLang === "km" ? "EN" : "ខ្មែរ";
  document.documentElement.lang = currentLang;
  document.querySelector("[data-date-row]").innerHTML = dateCells(currentLang);
  document.querySelector(".lunar").textContent = currentLang === "km" ? wedding.date.lunarKh : wedding.date.lunarEn;
  document.querySelector(".venue").textContent = wedding.venue[currentLang === "km" ? "kh" : "en"];
  document.querySelector(".countdown-date").textContent = currentLang === "km"
    ? `${wedding.date.weekdayKh} · ${wedding.date.dayKh} ${wedding.date.monthKh} ${wedding.date.yearKh} · ${wedding.date.timeKh}`
    : `${wedding.date.weekdayEn} · ${wedding.date.dayEn} ${wedding.date.monthEn} ${wedding.date.yearEn} · ${wedding.date.timeEn}`;
  updateCountdown();
});

if (!wedding.assets.music) {
  musicToggle.disabled = true;
  musicToggle.classList.add("is-disabled");
  musicToggle.title = "Add a licensed music file to enable audio";
}
musicToggle.addEventListener("click", () => {
  if (!invitationMusic) return;
  if (invitationMusic.paused) {
    startInvitationMusic();
  } else {
    invitationMusic.pause();
    setMusicState(false);
  }
});

const calendarButton = document.querySelector("#calendar-button");
if (!wedding.date.iso) {
  calendarButton.classList.add("is-disabled");
  calendarButton.setAttribute("aria-disabled", "true");
} else {
  calendarButton.addEventListener("click", () => {
    const stamp = new Date(wedding.date.iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Khmer Invitation//EN", "BEGIN:VEVENT", `DTSTART:${stamp}`, `SUMMARY:${copy.en.invitation}`, `LOCATION:${wedding.venue.en}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    link.download = "wedding-invitation.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

gsap.set(cover, { visibility: "hidden" });
animateLogo(document.querySelector(".name-logo--flap"), .35);

if (!reducedMotion) {
  gsap.to(envelopeStage, { y: -7, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
}
