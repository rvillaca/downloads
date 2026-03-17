async function loadReleases() {
  try {
    const response = await fetch("assets/data/releases.json", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar releases.json");
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
  setText("android-version", android.version || "Nao informado");
  setText("android-date", android.publishedAt || "Nao informado");
  setText("android-notes", android.notes || "Sem observacoes.");

  const link = document.getElementById("android-download");
  const hasDownload = Boolean(android.downloadUrl);

  if (hasDownload) {
    link.href = android.downloadUrl;
    link.removeAttribute("aria-disabled");
    link.classList.remove("button--disabled");
    link.textContent = android.ctaLabel || "Baixar APK";
  } else {
    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    link.classList.add("button--disabled");
    link.textContent = android.ctaLabel || "Download indisponivel";
  }
}

function renderIos(ios) {
  setText("ios-status", ios.status || "Em preparacao");
  setText("ios-channel", ios.channel || "Nao definido");
  setText("ios-summary", ios.summary || "Aguardando distribuicao");
  setText("ios-notes", ios.notes || "Sem observacoes.");
}

function renderFallback(error) {
  setText("android-status", "Erro");
  setText("android-notes", "Nao foi possivel carregar os dados do portal.");
  setText("ios-status", "Erro");
  setText("ios-notes", "Nao foi possivel carregar os dados do portal.");
  console.error(error);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

loadReleases();
