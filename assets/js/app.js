document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupTabs();
  setupReveal();
  loadReleases();
});

async function loadReleases() {
  try {
    const response = await fetch("assets/data/releases.json", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Não foi possível carregar releases.json");
    }

    const data = await response.json();
    renderAndroid(data.android || {});
    renderIos(data.ios || {});
  } catch (error) {
    renderFallback(error);
  }
}

function renderAndroid(android) {
  setText("android-status", android.status || "Sem build");
  setText("android-version", android.version || "Não informado");
  setText("android-date", android.publishedAt || "Não informado");
  setText("android-notes", android.notes || "Sem observações.");

  const link = document.getElementById("android-download");
  const hasDownload = Boolean(android.downloadUrl);

  if (!link) {
    return;
  }

  if (hasDownload) {
    link.href = android.downloadUrl;
    link.removeAttribute("aria-disabled");
    link.classList.remove("button--disabled");
    link.removeAttribute("tabindex");
    link.textContent = android.ctaLabel || "Baixar APK";
  } else {
    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("tabindex", "-1");
    link.classList.add("button--disabled");
    link.textContent = android.ctaLabel || "Download indisponível";
  }
}

function renderIos(ios) {
  setText("ios-status", ios.status || "Em preparação");
  setText("ios-channel", ios.channel || "Não definido");
  setText("ios-summary", ios.summary || "Aguardando distribuição");
  setText("ios-notes", ios.notes || "Sem observações.");
}

function renderFallback(error) {
  setText("android-status", "Erro");
  setText("android-notes", "Não foi possível carregar os dados do portal.");
  setText("ios-status", "Erro");
  setText("ios-notes", "Não foi possível carregar os dados do portal.");
  console.error(error);
}

function setupNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const navLinks = document.querySelectorAll(".site-nav a");
  const sections = document.querySelectorAll("main section[id]");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const setHeaderState = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (!sections.length) {
    return;
  }

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === "#" + activeId;
          link.classList.toggle("is-active", isActive);
        });
      });
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.2,
    }
  );

  sections.forEach((section) => activeObserver.observe(section));
}

function setupTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabsRoot) => {
    const buttons = tabsRoot.querySelectorAll("[data-tab-target]");
    const panels = tabsRoot.querySelectorAll(".tab-panel");

    const activateTab = (button) => {
      const targetId = button.getAttribute("data-tab-target");

      buttons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-selected", String(item === button));
      });

      panels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => activateTab(button));

      button.addEventListener("keydown", (event) => {
        const currentIndex = Array.from(buttons).indexOf(button);
        const moveNext = event.key === "ArrowRight" || event.key === "ArrowDown";
        const movePrev = event.key === "ArrowLeft" || event.key === "ArrowUp";

        if (!moveNext && !movePrev) {
          return;
        }

        event.preventDefault();
        const nextIndex = moveNext
          ? (currentIndex + 1) % buttons.length
          : (currentIndex - 1 + buttons.length) % buttons.length;

        buttons[nextIndex].focus();
        activateTab(buttons[nextIndex]);
      });
    });
  });
}

function setupReveal() {
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (!revealItems.length) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.15,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}
