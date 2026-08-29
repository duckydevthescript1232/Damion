(function () {
  "use strict";

  if (window.DMAudio) return;

  const players = new Set();

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  }

  function setRangeProgress(range, value, maximum) {
    if (!range) return;
    const percent = maximum > 0 ? Math.min(100, Math.max(0, (value / maximum) * 100)) : 0;
    range.style.setProperty("--dm-progress", `${percent}%`);
  }

  function setPlayerState(player, state) {
    player.dataset.state = state;
    const audio = player.querySelector("audio");
    const button = player.querySelector("[data-dm-audio-toggle]");
    const icon = player.querySelector("[data-dm-audio-icon]");
    const title = player.dataset.trackTitle || "audio preview";
    const playing = state === "playing";

    button?.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${title}`);
    button?.setAttribute("aria-pressed", String(playing));
    if (icon) icon.textContent = playing ? "Ⅱ" : "▶";
    if (state === "error") button?.setAttribute("disabled", "");
    else button?.removeAttribute("disabled");
    if (audio) audio.setAttribute("aria-hidden", "true");
  }

  function pauseOtherPlayers(current) {
    players.forEach((player) => {
      if (player === current) return;
      const audio = player.querySelector("audio");
      if (audio && !audio.paused) audio.pause();
    });
  }

  function initializePlayer(player) {
    if (player.dataset.dmAudioReady === "true") return;

    const audio = player.querySelector("audio");
    const toggle = player.querySelector("[data-dm-audio-toggle]");
    const timeline = player.querySelector("[data-dm-audio-timeline]");
    const current = player.querySelector("[data-dm-audio-current]");
    const duration = player.querySelector("[data-dm-audio-duration]");
    const volume = player.querySelector("[data-dm-audio-volume]");

    if (!audio || !toggle || !timeline) {
      player.dataset.state = "error";
      return;
    }

    player.dataset.dmAudioReady = "true";
    players.add(player);
    timeline.min = "0";
    timeline.step = "0.01";
    volume && (volume.step = "0.01");
    setPlayerState(player, "paused");
    setRangeProgress(timeline, 0, 1);

    const syncDuration = () => {
      const total = Number.isFinite(audio.duration) ? audio.duration : 0;
      timeline.max = String(total || 0);
      if (duration) duration.textContent = formatTime(total);
    };

    const syncTime = () => {
      timeline.value = String(audio.currentTime || 0);
      if (current) current.textContent = formatTime(audio.currentTime);
      setRangeProgress(timeline, audio.currentTime, audio.duration);
    };

    toggle.addEventListener("click", async () => {
      if (!audio.paused) {
        audio.pause();
        return;
      }

      pauseOtherPlayers(player);
      try {
        await audio.play();
      } catch (error) {
        if (error?.name !== "NotAllowedError" && error?.name !== "AbortError") {
          setPlayerState(player, "error");
        }
      }
    });

    timeline.addEventListener("input", () => {
      const nextTime = Number(timeline.value);
      if (Number.isFinite(nextTime)) audio.currentTime = nextTime;
      syncTime();
    });

    if (volume) {
      volume.min = "0";
      volume.max = "1";
      volume.value = String(audio.volume);
      setRangeProgress(volume, audio.volume, 1);
      volume.addEventListener("input", () => {
        audio.volume = Math.min(1, Math.max(0, Number(volume.value)));
        setRangeProgress(volume, audio.volume, 1);
      });
    }

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("play", () => setPlayerState(player, "playing"));
    audio.addEventListener("pause", () => setPlayerState(player, "paused"));
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      syncTime();
      setPlayerState(player, "paused");
    });
    audio.addEventListener("error", () => setPlayerState(player, "error"));

    if (audio.readyState >= 1) syncDuration();
    syncTime();
  }

  function initialize(root = document) {
    root.querySelectorAll("[data-dm-audio-player]").forEach(initializePlayer);
  }

  window.DMAudio = Object.freeze({
    formatTime,
    init: initialize,
    pauseAll: () => players.forEach((player) => player.querySelector("audio")?.pause())
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initialize(), { once: true });
  } else {
    initialize();
  }
})();

