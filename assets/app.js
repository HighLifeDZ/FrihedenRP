const RP_CONFIG = {
  serverName: "Friheden Roleplay",
  fivem: {
    // Replace with your live FiveM server address or cfx.re link
    connectUrl: "fivem://connect/92.118.207.17:30120"
  },
  discord: {
    // Replace with your Discord invite
    inviteUrl: "https://discord.gg/ZVQFUtjauQ"
  },
  webhooks: {
    police: "https://discord.com/api/webhooks/1413181593966608518/x7vzll1zq7a-ZeDAhzGxyNToDxdvUVWVmG9sCtZynYTR69rEe0Gi-kXZIQ-LsqtZriTz",
    allowlist: "https://discord.com/api/webhooks/1413181489688084622/kiqGhgTv9U9YadkJx1ayBcch-kVW5pqfIRFCbyH1Vc0eVe_NIpL4cPE2J3Z53Cy643IA",
    reports: "https://discord.com/api/webhooks/1413233334703882361/xDlIJQcfOgcReknoTuCgrXeUlWYALo1ffs9pRuMt0swLSH-Y4sISXxBi2BXBhNeYcueZ"
  }
};

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
}

function wireCtas() {
  const joinServerEls = document.querySelectorAll("[data-join-fivem]");
  const joinDiscordEls = document.querySelectorAll("[data-join-discord]");

  const resolveConnectUrl = (rawUrl) => {
    if (!rawUrl) return "";
    const url = String(rawUrl).trim();
    if (url.startsWith("fivem://")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("cfx.re/")) return `https://${url}`;
    // Assume host:port
    return `fivem://connect/${url}`;
  };

  joinServerEls.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = resolveConnectUrl(RP_CONFIG.fivem.connectUrl);
      if (target) window.location.href = target;
    });
  });

  joinDiscordEls.forEach(btn => {
    btn.addEventListener("click", () => {
      window.open(RP_CONFIG.discord.inviteUrl, "_blank");
    });
  });
}

function handlePoliceApplication() {
  const form = document.getElementById("police-form");
  if (!form) return;

  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";

    const data = Object.fromEntries(new FormData(form).entries());

    const errors = [];
    if (!data.rpName || data.rpName.trim().length < 3) errors.push("RP-navn skal være mindst 3 tegn.");
    const discordInput = (data.discord || "").trim();
    const isNewDiscord = /^[A-Za-z0-9_.-]{2,32}$/.test(discordInput);
    const isOldDiscord = /^[^#\s]{2,32}#\d{4}$/.test(discordInput);
    if (!discordInput || !(isNewDiscord || isOldDiscord)) errors.push("Indtast gyldigt Discord brugernavn (fx Brugernavn eller Brugernavn#0000).");
    if (!data.age || Number(data.age) < 15) errors.push("Du skal være mindst 16 år.");
    if (!data.experience || data.experience.trim().length < 20) errors.push("Skriv mindst 20 tegn om din erfaring.");
    if (!data.motivation || data.motivation.trim().length < 40) errors.push("Skriv mindst 40 tegn om din motivation.");

    const errorBox = document.getElementById("form-errors");
    errorBox.innerHTML = "";
    if (errors.length) {
      const ul = document.createElement("ul");
      errors.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg;
        errorBox.appendChild(li);
      });
      return;
    }

    const webhookUrl = RP_CONFIG.webhooks && RP_CONFIG.webhooks.police;
    const payload = {
      content: null,
      embeds: [
        {
          title: "Ny Politi Ansøgning",
          color: 3066993,
          fields: [
            { name: "RP-navn", value: String(data.rpName), inline: true },
            { name: "Discord", value: String(data.discord), inline: true },
            { name: "Alder", value: String(data.age), inline: true },
            { name: "Playtime", value: String(data.playtime || "N/A"), inline: true },
            { name: "Erfaring", value: String(data.experience), inline: false },
            { name: "Motivation", value: String(data.motivation), inline: false },
            { name: "OOC note", value: String(data.oocNote || "-"), inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then((res) => {
        if (!res.ok) throw new Error("Webhook fejl");
        status.textContent = "Tak for din ansøgning! Vi vender tilbage snarest.";
        form.reset();
      })
      .catch(() => {
        status.textContent = "Kunne ikke sende til Discord. Prøv igen senere.";
      });
    } else {
      setTimeout(() => {
        status.textContent = "Tak for din ansøgning! (test-tilstand)";
        form.reset();
      }, 400);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  wireCtas();
  handlePoliceApplication();
  handleAllowlistApplication();
  handleReportForm();
  initDarkMode();
});

function handleAllowlistApplication() {
  const form = document.getElementById("allowlist-form");
  if (!form) return;

  const status = document.getElementById("allowlist-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";

    const data = Object.fromEntries(new FormData(form).entries());

    const errors = [];
    if (!data.rpName || data.rpName.trim().length < 3) errors.push("RP-navn skal være mindst 3 tegn.");
    const discordInput = (data.discord || "").trim();
    const isNewDiscord = /^[A-Za-z0-9_.-]{2,32}$/.test(discordInput);
    const isOldDiscord = /^[^#\s]{2,32}#\d{4}$/.test(discordInput);
    if (!discordInput || !(isNewDiscord || isOldDiscord)) errors.push("Indtast gyldigt Discord brugernavn (fx Brugernavn eller Brugernavn#0000).");
    if (!data.age || Number(data.age) < 15) errors.push("Du skal være mindst 15 år.");
    if (!data.reason || data.reason.trim().length < 20) errors.push("Skriv mindst 20 tegn om hvorfor du vil whitelistes.");
    if (!data.rules || data.rules !== "on") errors.push("Du skal bekræfte at du har læst reglerne.");

    const errorBox = document.getElementById("allowlist-errors");
    errorBox.innerHTML = "";
    if (errors.length) {
      errors.forEach(msg => {
        const div = document.createElement("div");
        div.textContent = msg;
        errorBox.appendChild(div);
      });
      return;
    }

    const webhookUrl = RP_CONFIG.webhooks && RP_CONFIG.webhooks.allowlist;
    const payload = {
      content: null,
      embeds: [
        {
          title: "Ny Allowlist Ansøgning",
          color: 15844367,
          fields: [
            { name: "RP-navn", value: String(data.rpName), inline: true },
            { name: "Discord", value: String(data.discord), inline: true },
            { name: "Alder", value: String(data.age), inline: true },
            { name: "Timer/uge", value: String(data.hours || "N/A"), inline: true },
            { name: "Tidligere RP/ban-historik", value: String(data.history || "-"), inline: false },
            { name: "Hvorfor whitelist?", value: String(data.reason), inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then((res) => {
        if (!res.ok) throw new Error("Webhook fejl");
        status.textContent = "Tak for din ansøgning! Vi vender tilbage snarest.";
        form.reset();
      })
      .catch(() => {
        status.textContent = "Kunne ikke sende til Discord. Prøv igen senere.";
      });
    } else {
      setTimeout(() => {
        status.textContent = "Tak for din ansøgning! (test-tilstand)";
        form.reset();
      }, 400);
    }
  });
}


