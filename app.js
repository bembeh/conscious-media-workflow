// App Logic - Conscious Media YouTube Thumbnail Branding & Production Workflow System

// Core State
const state = {
  // Metadata fields for Sheets DB
  videoTitle: "Reggae Legends Born in March",
  month: "March",
  status: "Draft",
  artists: "Bob Marley, Dennis Brown",
  category: "Reggae Birthday",
  youtubeLink: "",
  notes: "Special March Legends tribute episode",
  imageLinks: "", // Filled after custom upload
  finalFileLink: "", // Filled after export save

  // Graphic design parameters
  headline: "MARCH LEGENDS",
  fontPair: "bebas-cinzel",
  textColor: "gold-white",
  textSize: 105,
  textTilt: -4,
  textY: 52,
  bgStyle: "vintage-texture",
  bgContrast: 120,
  vignette: 60,
  noiseOverlay: true,
  lightleakOverlay: true,
  artistImage: "reggae-legend",
  artistScale: 1.15,
  artistX: 70,
  artistY: 55,
  artistFilter: "warm-cinematic",
  glowIntensity: 35,
  glowColor: "gold",
  bgText: "MARCH",
  bgTextOpacity: 0.2
};

// Global variables for Google Integration
let oauth2TokenClient;
let accessToken = null;
let googleFolderStructure = {
  root: null,
  brandKit: null,
  artistImages: null,
  finishedThumbnails: null,
  marchThumbnail: null,
  templates: null
};
let googleSpreadsheetId = null;
let customArtistDataURL = "";
let customArtistBlob = null; // Stored to upload on click or auto-upload
let customArtistFilename = "artist_cutout.png";

// Templates Preset configurations
const templates = {
  "tpl-march-birthday": {
    headline: "MARCH LEGENDS",
    fontPair: "bebas-cinzel",
    textColor: "gold-white",
    textSize: 105,
    textTilt: -4,
    textY: 52,
    bgStyle: "vintage-texture",
    bgContrast: 120,
    vignette: 60,
    noiseOverlay: true,
    lightleakOverlay: true,
    artistImage: "reggae-legend",
    artistScale: 1.15,
    artistX: 70,
    artistY: 55,
    artistFilter: "warm-cinematic",
    glowIntensity: 35,
    glowColor: "gold",
    bgText: "MARCH",
    bgTextOpacity: 0.2,
    category: "Reggae Birthday",
    month: "March"
  },
  "tpl-roots-doc": {
    headline: "REGGAE STORY",
    fontPair: "playfair-mont",
    textColor: "green-gold",
    textSize: 85,
    textTilt: 0,
    textY: 50,
    bgStyle: "roots-gradient",
    bgContrast: 95,
    vignette: 85,
    noiseOverlay: false,
    lightleakOverlay: true,
    artistImage: "reggae-legend",
    artistScale: 1.2,
    artistX: 65,
    artistY: 50,
    artistFilter: "none",
    glowIntensity: 20,
    glowColor: "green",
    bgText: "ROOTS",
    bgTextOpacity: 0.08,
    category: "Artist Documentaries"
  },
  "tpl-dancehall": {
    headline: "STREET CLASH",
    fontPair: "syne-montserrat",
    textColor: "red-gold",
    textSize: 95,
    textTilt: 5,
    textY: 48,
    bgStyle: "crimson-dark",
    bgContrast: 130,
    vignette: 75,
    noiseOverlay: true,
    lightleakOverlay: false,
    artistImage: "dancehall-neon",
    artistScale: 1.3,
    artistX: 72,
    artistY: 55,
    artistFilter: "roots-duotone",
    glowIntensity: 50,
    glowColor: "red",
    bgText: "DANCE",
    bgTextOpacity: 0.1,
    category: "Dancehall Artists"
  },
  "tpl-top10": {
    headline: "TOP 10 HITS",
    fontPair: "bebas-bebas",
    textColor: "gold-white",
    textSize: 110,
    textTilt: -5,
    textY: 50,
    bgStyle: "roots-gradient",
    bgContrast: 110,
    vignette: 70,
    noiseOverlay: true,
    lightleakOverlay: true,
    artistImage: "reggae-legend",
    artistScale: 1.1,
    artistX: 74,
    artistY: 55,
    artistFilter: "warm-cinematic",
    glowIntensity: 40,
    glowColor: "gold",
    bgText: "TOP 10",
    bgTextOpacity: 0.12,
    category: "Top 10 Lists"
  },
  "tpl-history": {
    headline: "ROOTS HISTORY",
    fontPair: "playfair-mont",
    textColor: "white-red",
    textSize: 85,
    textTilt: -1,
    textY: 52,
    bgStyle: "vintage-texture",
    bgContrast: 100,
    vignette: 70,
    noiseOverlay: true,
    lightleakOverlay: false,
    artistImage: "reggae-silhouette",
    artistScale: 1.15,
    artistX: 68,
    artistY: 50,
    artistFilter: "none",
    glowIntensity: 0,
    glowColor: "gold",
    bgText: "HISTORY",
    bgTextOpacity: 0.15,
    category: "Reggae History"
  },
  "tpl-commentary": {
    headline: "MUSIC REVIEW",
    fontPair: "syne-montserrat",
    textColor: "green-gold",
    textSize: 90,
    textTilt: 3,
    textY: 48,
    bgStyle: "crimson-dark",
    bgContrast: 120,
    vignette: 55,
    noiseOverlay: false,
    lightleakOverlay: true,
    artistImage: "reggae-legend",
    artistScale: 1.25,
    artistX: 70,
    artistY: 55,
    artistFilter: "vintage-bw",
    glowIntensity: 25,
    glowColor: "green",
    bgText: "REVIEW",
    bgTextOpacity: 0.08,
    category: "Music Commentary"
  },
  "tpl-promo": {
    headline: "ON THE AIR",
    fontPair: "bebas-cinzel",
    textColor: "gold-white",
    textSize: 100,
    textTilt: 0,
    textY: 50,
    bgStyle: "dancehall-street",
    bgContrast: 100,
    vignette: 60,
    noiseOverlay: false,
    lightleakOverlay: true,
    artistImage: "reggae-legend",
    artistScale: 1.15,
    artistX: 65,
    artistY: 50,
    artistFilter: "none",
    glowIntensity: 45,
    glowColor: "gold",
    bgText: "RADIO",
    bgTextOpacity: 0.05,
    category: "Radio Show Promo"
  }
};

let customBgDataURL = "";
let customBgBlob = null;
let customBgFilename = "custom_background.png";

// ============================================================
// Drag & Drop Upload Zone Initializer
// ============================================================
function initDropZones() {
  // ---- ARTIST DROP ZONE ----
  setupDropZone({
    zoneId: "drop-zone-artist",
    inputId: "input-artist-file",
    promptId: "artist-prompt",
    previewId: "artist-preview",
    previewImgId: "artist-preview-img",
    previewNameId: "artist-preview-name",
    removeBtnId: "btn-remove-artist",
    onFile: async (file, dataURL) => {
      customArtistDataURL = dataURL;
      customArtistBlob = file;
      customArtistFilename = file.name;
      state.artistImage = "custom-upload";
      // Deselect preset selector
      const sel = document.getElementById("select-artist-image");
      if (sel) sel.value = "reggae-legend"; // reset visually but state overrides
      renderPreview();
      // Auto-upload to Drive if connected
      if (accessToken && googleFolderStructure.artistImages) {
        logConnection("Uploading artist image to Google Drive...");
        try {
          const result = await uploadFileToDrive(file, file.name, googleFolderStructure.artistImages);
          if (result && result.webViewLink) {
            state.imageLinks = result.webViewLink;
            logConnection("Artist image uploaded: " + result.webViewLink);
          }
        } catch(err) { logConnection("Drive upload error: " + err.message); }
      }
    },
    onRemove: () => {
      customArtistDataURL = "";
      customArtistBlob = null;
      state.artistImage = "reggae-legend";
      const sel = document.getElementById("select-artist-image");
      if (sel) sel.value = "reggae-legend";
      renderPreview();
    }
  });

  // ---- BACKGROUND DROP ZONE ----
  setupDropZone({
    zoneId: "drop-zone-bg",
    inputId: "input-bg-file",
    promptId: "bg-prompt",
    previewId: "bg-preview",
    previewImgId: "bg-preview-img",
    previewNameId: "bg-preview-name",
    removeBtnId: "btn-remove-bg",
    onFile: (file, dataURL) => {
      customBgDataURL = dataURL;
      customBgBlob = file;
      customBgFilename = file.name;
      state.bgStyle = "custom-upload";
      renderPreview();
    },
    onRemove: () => {
      customBgDataURL = "";
      customBgBlob = null;
      state.bgStyle = "vintage-texture";
      const sel = document.getElementById("select-bg-style");
      if (sel) sel.value = "vintage-texture";
      renderPreview();
    }
  });
}

function setupDropZone({ zoneId, inputId, promptId, previewId, previewImgId, previewNameId, removeBtnId, onFile, onRemove }) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  const prompt = document.getElementById(promptId);
  const preview = document.getElementById(previewId);
  const previewImg = document.getElementById(previewImgId);
  const previewName = document.getElementById(previewNameId);
  const removeBtn = document.getElementById(removeBtnId);

  if (!zone || !input) return;

  // Click to open file picker (clicking zone anywhere except remove btn)
  zone.addEventListener("click", (e) => {
    if (e.target === removeBtn || removeBtn && removeBtn.contains(e.target)) return;
    input.click();
  });
  zone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
  });

  // Drag events
  zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("dragover"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  });

  // File input change
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  });

  // Remove button
  if (removeBtn) {
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      input.value = "";
      if (preview) preview.style.display = "none";
      if (prompt) prompt.style.display = "flex";
      if (onRemove) onRemove();
    });
  }

  function processFile(file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataURL = evt.target.result;
      // Show preview
      if (previewImg) previewImg.src = dataURL;
      if (previewName) previewName.textContent = file.name;
      if (prompt) prompt.style.display = "none";
      if (preview) preview.style.display = "flex";
      if (onFile) onFile(file, dataURL);
    };
    reader.readAsDataURL(file);
  }
}

// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSliders();
  initFormBindings();
  initTemplateSelectors();
  initGuides();
  initActions();
  initGoogleAuth();
  initCopywriter();
  initDropZones();

  // Load credential configurations from local storage
  const savedClientId = localStorage.getItem("conscious_media_client_id");
  if (savedClientId) {
    document.getElementById("input-client-id").value = savedClientId;
  }

  // Load local offline database list if workspace is not authorized
  loadLocalDatabase();

  // Initial draw & scale
  scaleCanvas();
  renderPreview();
  validateWordCount(state.headline);

  window.addEventListener("resize", scaleCanvas);
});

// 1. Tabs Switching Logic
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

// 2. Scale 1280x720 canvas visually
function scaleCanvas() {
  const wrapper = document.querySelector(".thumbnail-wrapper");
  const canvas = document.querySelector(".thumbnail-canvas");
  if (!wrapper || !canvas) return;
  
  const wrapperWidth = wrapper.clientWidth;
  const scale = wrapperWidth / 1280;
  
  canvas.style.transform = `scale(${scale})`;
  canvas.style.transformOrigin = "top left";
}

// 3. Slider update listeners
function initSliders() {
  const sliders = [
    { id: "slider-text-size", valId: "val-text-size", stateKey: "textSize" },
    { id: "slider-text-tilt", valId: "val-text-tilt", stateKey: "textTilt" },
    { id: "slider-text-y", valId: "val-text-y", stateKey: "textY" },
    { id: "slider-bg-contrast", valId: "val-bg-contrast", stateKey: "bgContrast" },
    { id: "slider-vignette", valId: "val-vignette", stateKey: "vignette" },
    { id: "slider-artist-scale", valId: "val-artist-scale", stateKey: "artistScale" },
    { id: "slider-artist-x", valId: "val-artist-x", stateKey: "artistX" },
    { id: "slider-artist-y", valId: "val-artist-y", stateKey: "artistY" },
    { id: "slider-glow-intensity", valId: "val-glow-intensity", stateKey: "glowIntensity" },
    { id: "slider-bg-text-opacity", valId: "val-bg-text-opacity", stateKey: "bgTextOpacity" }
  ];

  sliders.forEach(sliderDef => {
    const el = document.getElementById(sliderDef.id);
    const indicator = document.getElementById(sliderDef.valId);
    
    if (el && indicator) {
      el.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        state[sliderDef.stateKey] = val;
        indicator.textContent = val;
        renderPreview();
      });
    }
  });
}

// 4. Form inputs binding
function initFormBindings() {
  // Headline
  const inputHeadline = document.getElementById("input-headline");
  if (inputHeadline) {
    inputHeadline.addEventListener("input", (e) => {
      state.headline = e.target.value;
      validateWordCount(e.target.value);
      renderPreview();
    });
  }

  // Metadata Sync Bindings
  const bindMeta = (inputId, stateKey) => {
    const el = document.getElementById(inputId);
    if (el) {
      el.addEventListener("input", (e) => {
        state[stateKey] = e.target.value;
        if (stateKey === "videoTitle") {
          updateSimulatedVideoTitle(e.target.value);
        }
      });
      el.addEventListener("change", (e) => {
        state[stateKey] = e.target.value;
        if (stateKey === "month" && state.category === "Reggae Birthday") {
          state.bgText = e.target.value.toUpperCase();
          document.getElementById("input-bg-text").value = state.bgText;
          renderPreview();
        }
      });
    }
  };

  bindMeta("input-video-title", "videoTitle");
  bindMeta("select-month", "month");
  bindMeta("select-status", "status");
  bindMeta("input-artists", "artists");
  bindMeta("select-category", "category");
  bindMeta("input-youtube-link", "youtubeLink");
  bindMeta("input-notes", "notes");

  // Font typography pair
  const selectFontPair = document.getElementById("select-font-pair");
  if (selectFontPair) {
    selectFontPair.addEventListener("change", (e) => {
      state.fontPair = e.target.value;
      renderPreview();
    });
  }

  // Text color
  const selectTextColor = document.getElementById("select-text-color");
  if (selectTextColor) {
    selectTextColor.addEventListener("change", (e) => {
      state.textColor = e.target.value;
      renderPreview();
    });
  }

  // Background style
  const selectBgStyle = document.getElementById("select-bg-style");
  if (selectBgStyle) {
    selectBgStyle.addEventListener("change", (e) => {
      state.bgStyle = e.target.value;
      renderPreview();
    });
  }

  // Checkboxes
  const bindCheck = (id, stateKey) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", (e) => {
        state[stateKey] = e.target.checked;
        renderPreview();
      });
    }
  };
  bindCheck("chk-overlay-noise", "noiseOverlay");
  bindCheck("chk-overlay-lightleak", "lightleakOverlay");

  // Artist preset selector (no longer triggers upload wrapper)
  const selectArtist = document.getElementById("select-artist-image");
  if (selectArtist) {
    selectArtist.addEventListener("change", (e) => {
      state.artistImage = e.target.value;
      // If user picks a preset, clear the custom upload
      if (e.target.value !== "custom-upload") {
        customArtistDataURL = "";
        customArtistBlob = null;
        // Reset artist drop zone to prompt state
        const artistPreview = document.getElementById("artist-preview");
        const artistPrompt = document.getElementById("artist-prompt");
        if (artistPreview) artistPreview.style.display = "none";
        if (artistPrompt) artistPrompt.style.display = "flex";
      }
      renderPreview();
    });
  }

  // Glow controls
  const selectGlowColor = document.getElementById("select-glow-color");
  if (selectGlowColor) {
    selectGlowColor.addEventListener("change", (e) => {
      state.glowColor = e.target.value;
      renderPreview();
    });
  }

  const selectArtistFilter = document.getElementById("select-artist-filter");
  if (selectArtistFilter) {
    selectArtistFilter.addEventListener("change", (e) => {
      state.artistFilter = e.target.value;
      renderPreview();
    });
  }

  // Big background text
  const inputBgText = document.getElementById("input-bg-text");
  if (inputBgText) {
    inputBgText.addEventListener("input", (e) => {
      state.bgText = e.target.value;
      renderPreview();
    });
  }
}

function updateSimulatedVideoTitle(title) {
  const el = document.getElementById("sim-video-title");
  if (el) {
    el.textContent = title.length > 5 ? title : `${title} | Roots & Culture Documentary`;
  }
}

// Word Count check
function validateWordCount(text) {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const count = words.length;
  
  const counterEl = document.getElementById("text-count");
  if (counterEl) {
    counterEl.textContent = `${count} / 5 Words`;
    if (count > 5) {
      counterEl.style.color = "var(--brand-red-light)";
    } else if (count >= 3) {
      counterEl.style.color = "var(--brand-green-light)";
    } else {
      counterEl.style.color = "var(--text-muted)";
    }
  }

  const warningEl = document.getElementById("text-limit-warning");
  if (warningEl) {
    warningEl.style.display = (count > 5 || count === 0) ? "block" : "none";
  }
}

// 5. Template Card Presets Selection
function initTemplateSelectors() {
  const cards = document.querySelectorAll(".template-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      
      const tplId = card.id;
      if (templates[tplId]) {
        applyTemplateData(templates[tplId]);
      }
    });
  });
}

function applyTemplateData(data) {
  // Update state values
  Object.keys(data).forEach(key => {
    state[key] = data[key];
  });

  // Sync inputs UI
  document.getElementById("input-headline").value = state.headline;
  document.getElementById("select-font-pair").value = state.fontPair;
  document.getElementById("select-text-color").value = state.textColor;
  document.getElementById("select-bg-style").value = state.bgStyle;
  document.getElementById("chk-overlay-noise").checked = state.noiseOverlay;
  document.getElementById("chk-overlay-lightleak").checked = state.lightleakOverlay;
  document.getElementById("select-artist-image").value = state.artistImage;
  
  const uploadWrapper = document.getElementById("custom-artist-upload-wrapper");
  if (uploadWrapper) {
    uploadWrapper.style.display = state.artistImage === "custom-upload" ? "block" : "none";
  }
  
  document.getElementById("select-artist-filter").value = state.artistFilter;
  document.getElementById("select-glow-color").value = state.glowColor;
  document.getElementById("input-bg-text").value = state.bgText;
  
  if (data.category) {
    document.getElementById("select-category").value = data.category;
    state.category = data.category;
  }
  if (data.month) {
    document.getElementById("select-month").value = data.month;
    state.month = data.month;
  }

  // Update layout sliders UI
  const syncSlider = (id, val) => {
    const el = document.getElementById(id);
    const indicator = document.getElementById(id.replace("slider-", "val-"));
    if (el) el.value = val;
    if (indicator) indicator.textContent = val;
  };

  syncSlider("slider-text-size", state.textSize);
  syncSlider("slider-text-tilt", state.textTilt);
  syncSlider("slider-text-y", state.textY);
  syncSlider("slider-bg-contrast", state.bgContrast);
  syncSlider("slider-vignette", state.vignette);
  syncSlider("slider-artist-scale", state.artistScale);
  syncSlider("slider-artist-x", state.artistX);
  syncSlider("slider-artist-y", state.artistY);
  syncSlider("slider-glow-intensity", state.glowIntensity);
  syncSlider("slider-bg-text-opacity", state.bgTextOpacity);

  // Manage March layout display
  const marchCtrl = document.getElementById("march-extra-controls");
  if (marchCtrl) {
    marchCtrl.style.display = (state.bgText !== "") ? "block" : "none";
  }

  validateWordCount(state.headline);
  renderPreview();
}

// 6. Overlays guidelines
function initGuides() {
  const chkGrid = document.getElementById("chk-grid-guide");
  const gridOverlay = document.getElementById("thirds-grid-overlay");
  
  if (chkGrid && gridOverlay) {
    chkGrid.addEventListener("change", (e) => {
      gridOverlay.style.display = e.target.checked ? "block" : "none";
    });
  }

  const chkTimestamp = document.getElementById("chk-timestamp-guide");
  const timestampOverlay = document.getElementById("timestamp-badge-overlay");
  
  if (chkTimestamp && timestampOverlay) {
    chkTimestamp.addEventListener("change", (e) => {
      timestampOverlay.style.display = e.target.checked ? "flex" : "none";
    });
  }
}

// 7. Local Save & Export Actions
function initActions() {
  const btnReset = document.getElementById("btn-reset");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      applyTemplateData(templates["tpl-march-birthday"]);
      document.querySelectorAll(".template-card").forEach(c => c.classList.remove("active"));
      document.getElementById("tpl-march-birthday").classList.add("active");
    });
  }

  const btnExportLocal = document.getElementById("btn-export-local");
  if (btnExportLocal) {
    btnExportLocal.addEventListener("click", () => {
      exportPNGLocal();
    });
  }

  const btnSaveWorkflow = document.getElementById("btn-save-workflow");
  if (btnSaveWorkflow) {
    btnSaveWorkflow.addEventListener("click", () => {
      triggerWorkflowSave();
    });
  }
}

// 8. GRAPHIC PREVIEW RENDER ENGINE
function renderPreview() {
  // A. Background Style
  const bgEl = document.getElementById("canvas-bg");
  if (bgEl) {
    let bgStyleCss = "";
    if (state.bgStyle === "custom-upload" && customBgDataURL) {
      bgEl.style.background = "none";
      bgEl.style.backgroundImage = `url('${customBgDataURL}')`;
      bgEl.style.backgroundSize = "cover";
      bgEl.style.backgroundPosition = "center";
      bgEl.style.filter = `contrast(${state.bgContrast}%)`;
      // Skip rest of bg logic
    } else {
      if (state.bgStyle === "vintage-texture") {
        bgStyleCss = "url('assets/reggae_poster_bg.png')";
      } else if (state.bgStyle === "roots-gradient") {
        bgStyleCss = "radial-gradient(circle, #1A4C32 0%, #0B0C10 100%)";
      } else if (state.bgStyle === "crimson-dark") {
        bgStyleCss = "radial-gradient(circle, #A82424 0%, #0B0C10 100%)";
      } else if (state.bgStyle === "dancehall-street") {
        bgStyleCss = "#0B0C10";
      }

      if (bgStyleCss.startsWith("url")) {
        bgEl.style.background = "none";
        bgEl.style.backgroundImage = bgStyleCss;
        bgEl.style.backgroundSize = "cover";
        bgEl.style.backgroundPosition = "center";
      } else {
        bgEl.style.backgroundImage = "none";
        bgEl.style.background = bgStyleCss;
      }
      bgEl.style.filter = `contrast(${state.bgContrast}%)`;
    }
  }

  // B. Large background text
  const bgTextEl = document.getElementById("canvas-bg-text");
  if (bgTextEl) {
    bgTextEl.textContent = state.bgText;
    bgTextEl.style.opacity = state.bgTextOpacity;
    bgTextEl.style.display = state.bgText ? "block" : "none";
  }

  // C. Vignette
  const vignetteEl = document.getElementById("canvas-vignette");
  if (vignetteEl) {
    vignetteEl.style.background = `radial-gradient(circle, transparent ${100 - state.vignette}%, rgba(11, 12, 16, 0.95) 100%)`;
  }

  // D. Overlays
  const noiseEl = document.getElementById("canvas-texture");
  if (noiseEl) noiseEl.style.display = state.noiseOverlay ? "block" : "none";

  const lightleakEl = document.getElementById("canvas-lightleak");
  if (lightleakEl) {
    lightleakEl.style.display = state.lightleakOverlay ? "block" : "none";
  }

  // E. Artist Image
  const artistImg = document.getElementById("canvas-artist-img");
  const artistGlow = document.getElementById("canvas-artist-glow");
  
  if (artistImg && artistGlow) {
    // Source loading
    if (state.artistImage === "reggae-legend") {
      artistImg.src = "assets/reggae_legend.png";
      artistImg.style.display = "block";
    } else if (state.artistImage === "reggae-silhouette") {
      artistImg.src = "assets/reggae_legend.png";
      artistImg.style.display = "block";
    } else if (state.artistImage === "dancehall-neon") {
      artistImg.src = "assets/reggae_legend.png";
      artistImg.style.display = "block";
    } else if (state.artistImage === "custom-upload") {
      if (customArtistDataURL) {
        artistImg.src = customArtistDataURL;
        artistImg.style.display = "block";
      } else {
        artistImg.style.display = "none";
      }
    } else {
      artistImg.style.display = "none";
    }

    // Coordinates and dimensions
    artistImg.style.left = `${state.artistX}%`;
    artistImg.style.top = `${state.artistY}%`;
    artistImg.style.transform = `translate(-50%, -50%) scale(${state.artistScale})`;

    // Glowing lights
    artistGlow.style.left = `${state.artistX}%`;
    artistGlow.style.top = `${state.artistY}%`;
    artistGlow.style.width = `${state.artistScale * 250}px`;
    artistGlow.style.height = `${state.artistScale * 250}px`;
    
    if (state.glowIntensity > 0) {
      artistGlow.style.display = "block";
      artistGlow.style.filter = `blur(${state.glowIntensity}px)`;
      
      let glowColorHex = "rgba(230, 179, 37, 0.4)";
      if (state.glowColor === "green") glowColorHex = "rgba(46, 204, 113, 0.5)";
      if (state.glowColor === "red") glowColorHex = "rgba(168, 36, 36, 0.6)";
      
      artistGlow.style.backgroundColor = glowColorHex;
    } else {
      artistGlow.style.display = "none";
    }

    // Graphic filters
    let filterCss = "";
    if (state.artistImage === "reggae-silhouette") {
      filterCss = "brightness(0)";
    } else {
      if (state.artistFilter === "warm-cinematic") {
        filterCss = "contrast(1.2) brightness(1.05) sepia(0.2) saturate(1.1)";
      } else if (state.artistFilter === "roots-duotone") {
        filterCss = "grayscale(100%) contrast(140%) sepia(80%) hue-rotate(65deg) saturate(300%)";
      } else if (state.artistFilter === "vintage-bw") {
        filterCss = "grayscale(100%) contrast(135%) brightness(95%)";
      } else {
        filterCss = "none";
      }
    }
    artistImg.style.filter = filterCss;
  }

  // F. Title Text Layout
  const textContainer = document.getElementById("canvas-text-container");
  const title1 = document.getElementById("canvas-title-1");
  const title2 = document.getElementById("canvas-title-2");

  if (textContainer && title1 && title2) {
    textContainer.style.top = `${state.textY}%`;
    textContainer.style.transform = `translateY(-50%) rotate(${state.textTilt}deg)`;
    
    const words = state.headline.trim().split(/\s+/).filter(w => w.length > 0);
    let line1Text = "";
    let line2Text = "";

    if (words.length <= 1) {
      line1Text = words[0] || "";
      line2Text = "";
    } else if (words.length === 2) {
      line1Text = words[0];
      line2Text = words[1];
    } else if (words.length === 3) {
      line1Text = `${words[0]} ${words[1]}`;
      line2Text = words[2];
    } else {
      line1Text = `${words[0]} ${words[1]}`;
      line2Text = words.slice(2).join(" ");
    }

    title1.textContent = line1Text;
    title2.textContent = line2Text;

    if (state.fontPair === "bebas-cinzel") {
      title1.style.fontFamily = "var(--font-bebas)";
      title1.style.letterSpacing = "2px";
      title1.style.fontWeight = "normal";
      title2.style.fontFamily = "var(--font-cinzel)";
      title2.style.letterSpacing = "4px";
      title2.style.fontWeight = "900";
    } else if (state.fontPair === "syne-montserrat") {
      title1.style.fontFamily = "var(--font-syne)";
      title1.style.letterSpacing = "-1px";
      title1.style.fontWeight = "800";
      title2.style.fontFamily = "var(--font-montserrat)";
      title2.style.letterSpacing = "3px";
      title2.style.fontWeight = "900";
    } else if (state.fontPair === "bebas-bebas") {
      title1.style.fontFamily = "var(--font-bebas)";
      title1.style.letterSpacing = "1px";
      title2.style.fontFamily = "var(--font-bebas)";
      title2.style.letterSpacing = "1px";
    } else if (state.fontPair === "playfair-mont") {
      title1.style.fontFamily = "var(--font-playfair)";
      title1.style.letterSpacing = "0px";
      title1.style.fontWeight = "bold";
      title1.style.fontStyle = "italic";
      title2.style.fontFamily = "var(--font-montserrat)";
      title2.style.letterSpacing = "4px";
      title2.style.fontWeight = "900";
    }

    title1.style.fontSize = `${state.textSize}px`;
    title2.style.fontSize = `${state.textSize * 0.52}px`;

    // Color application
    if (state.textColor === "gold-white") {
      title1.style.color = "var(--brand-gold)";
      title2.style.color = "var(--brand-white)";
    } else if (state.textColor === "green-gold") {
      title1.style.color = "var(--brand-green-light)";
      title2.style.color = "var(--brand-gold)";
    } else if (state.textColor === "red-gold") {
      title1.style.color = "var(--brand-red-light)";
      title2.style.color = "var(--brand-gold)";
    } else if (state.textColor === "white-red") {
      title1.style.color = "var(--brand-white)";
      title2.style.color = "var(--brand-red-light)";
    }
  }

  // G. Premium borders (Magazine template check)
  const borderEl = document.getElementById("canvas-border-overlay");
  if (borderEl) {
    borderEl.style.opacity = (state.bgStyle === "dancehall-street" && state.fontPair === "bebas-cinzel") ? "1" : "0";
  }

  // H. Clones to mobile/sidebar simulators
  syncSimulator("sim-live-thumb");
  syncSimulator("sim-sidebar-thumb");
}

// 9. Simulator synchronization
function syncSimulator(placeholderId) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;
  
  placeholder.innerHTML = "";
  const clone = document.getElementById("canvas-node").cloneNode(true);
  clone.id = `${placeholderId}-clone`;
  clone.querySelectorAll(".non-exporting").forEach(el => el.remove());
  
  const placeholderWidth = placeholder.clientWidth;
  const scale = placeholderWidth / 1280;
  
  clone.style.transform = `scale(${scale})`;
  clone.style.transformOrigin = "top left";
  clone.style.position = "absolute";
  clone.style.top = "0";
  clone.style.left = "0";
  
  placeholder.appendChild(clone);
}

// 10. Local PNG exporter
function exportPNGLocal() {
  const canvasNode = document.getElementById("canvas-node");
  if (!canvasNode) return;

  const btn = document.getElementById("btn-export-local");
  btn.textContent = "Rendering...";
  btn.disabled = true;

  const guides = canvasNode.querySelectorAll(".non-exporting");
  guides.forEach(g => g.style.visibility = "hidden");

  const originalTransform = canvasNode.style.transform;
  canvasNode.style.transform = "scale(1)";

  html2canvas(canvasNode, {
    width: 1280,
    height: 720,
    scale: 1,
    useCORS: true,
    logging: false,
    backgroundColor: "#000000"
  }).then(renderedCanvas => {
    canvasNode.style.transform = originalTransform;
    guides.forEach(g => g.style.visibility = "visible");
    btn.textContent = "Local PNG";
    btn.disabled = false;

    const dataURL = renderedCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    const cleanTitle = state.headline.toLowerCase().replace(/\s+/g, "_").substring(0, 15);
    link.download = `conscious_media_${cleanTitle}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }).catch(err => {
    canvasNode.style.transform = originalTransform;
    guides.forEach(g => g.style.visibility = "visible");
    btn.textContent = "Local PNG";
    btn.disabled = false;
    alert("Export rendering failed.");
  });
}

// ==========================================
// GOOGLE WORKSPACE API MODULES & INTEGRATIONS
// ==========================================

function initGoogleAuth() {
  // Credentials UI bindings
  const btnSave = document.getElementById("btn-save-credentials");
  const btnResetCred = document.getElementById("btn-clear-credentials");
  const inputId = document.getElementById("input-client-id");
  const btnAuth = document.getElementById("btn-google-auth");

  if (btnSave) {
    btnSave.addEventListener("click", () => {
      const idVal = inputId.value.trim();
      if (idVal) {
        localStorage.setItem("conscious_media_client_id", idVal);
        alert("Google Client ID saved locally. Ready to connect!");
      }
    });
  }

  if (btnResetCred) {
    btnResetCred.addEventListener("click", () => {
      localStorage.removeItem("conscious_media_client_id");
      inputId.value = "";
      alert("Credentials reset.");
    });
  }

  if (btnAuth) {
    btnAuth.addEventListener("click", () => {
      if (accessToken) {
        disconnectGoogleWorkspace();
      } else {
        connectGoogleWorkspace();
      }
    });
  }
}

// Token Client Trigger for OAuth flow
function connectGoogleWorkspace() {
  const clientId = document.getElementById("input-client-id").value.trim() || localStorage.getItem("conscious_media_client_id");
  
  if (!clientId) {
    alert("Please navigate to 'G-Connect Setup' tab first and save your OAuth Client ID!");
    document.querySelector('.tab-btn[data-tab="setup-tab"]').click();
    return;
  }

  document.getElementById("connection-debug-box").style.display = "block";
  logConnection("Initializing Google Identity Services Token Client...");

  try {
    oauth2TokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
      callback: (response) => {
        if (response.error) {
          logConnection("OAuth Authentication Error: " + response.error);
          return;
        }
        accessToken = response.access_token;
        logConnection("Successfully authenticated with Google OAuth!");
        updateConnectionUI(true);
        setupGoogleDriveWorkspace();
      }
    });

    oauth2TokenClient.requestAccessToken({ prompt: "consent" });
  } catch (err) {
    logConnection("Error starting OAuth flow: " + err.message + "\nCheck if script libraries loaded correctly.");
  }
}

function disconnectGoogleWorkspace() {
  accessToken = null;
  updateConnectionUI(false);
  logConnection("Disconnected from Workspace. Returning to Local mode.");
}

function updateConnectionUI(connected) {
  const indicator = document.getElementById("conn-indicator");
  const statusTxt = document.getElementById("conn-text");
  const authBtn = document.getElementById("btn-google-auth");
  const saveBtn = document.getElementById("btn-save-workflow");
  const refreshBtn = document.getElementById("btn-refresh-db");

  if (connected) {
    indicator.className = "status-indicator online";
    statusTxt.textContent = "Workspace Connected";
    authBtn.textContent = "Disconnect Workspace";
    authBtn.className = "btn-workspace-connect connected";
    saveBtn.disabled = false;
    refreshBtn.disabled = false;
  } else {
    indicator.className = "status-indicator offline";
    statusTxt.textContent = "Workspace Offline";
    authBtn.textContent = "Connect Google Workspace";
    authBtn.className = "btn-workspace-connect";
    saveBtn.disabled = true;
    refreshBtn.disabled = true;
  }
}

function logConnection(message) {
  const logsEl = document.getElementById("connection-logs");
  if (logsEl) {
    logsEl.textContent += `[${new Date().toLocaleTimeString()}] ${message}\n`;
  }
}

// Drive and Spreadsheet Setup Sequence
async function setupGoogleDriveWorkspace() {
  logConnection("Setting up directory structure in Google Drive...");
  try {
    // 1. Check/create root directory '/Conscious Media Thumbnails'
    const rootId = await getOrCreateFolder("Conscious Media Thumbnails", null);
    googleFolderStructure.root = rootId;

    // 2. Subfolders
    googleFolderStructure.brandKit = await getOrCreateFolder("Brand Kit", rootId);
    googleFolderStructure.artistImages = await getOrCreateFolder("Artist Images", rootId);
    googleFolderStructure.finishedThumbnails = await getOrCreateFolder("Finished Thumbnails", rootId);
    googleFolderStructure.marchThumbnail = await getOrCreateFolder("March Thumbnail", rootId);
    googleFolderStructure.templates = await getOrCreateFolder("Templates", rootId);

    logConnection("All Google Drive directories verified & active.");

    // 3. Check/create database spreadsheet
    await setupSheetsDatabase(rootId);
    
    // 4. Load database table rows
    refreshDatabaseRows();

  } catch (err) {
    logConnection("Workspace Directory setup failed: " + err.message);
  }
}

// REST Client for searching/creating folders in Google Drive
async function getOrCreateFolder(folderName, parentId) {
  let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }
  
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`;
  
  const searchRes = await fetch(searchUrl, {
    headers: { "Authorization": "Bearer " + accessToken }
  });
  const searchData = await searchRes.json();

  if (searchData.files && searchData.files.length > 0) {
    logConnection(`Folder '/${folderName}' verified.`);
    return searchData.files[0].id;
  }

  // Create folder
  logConnection(`Folder '/${folderName}' not found. Constructing new folder...`);
  const createUrl = "https://www.googleapis.com/drive/v3/files";
  const metadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder"
  };
  if (parentId) {
    metadata.parents = [parentId];
  }

  const createRes = await fetch(createUrl, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(metadata)
  });
  const createdData = await createRes.json();
  logConnection(`Folder '/${folderName}' constructed! ID: ` + createdData.id);
  return createdData.id;
}

// Sheets setup
async function setupSheetsDatabase(parentId) {
  logConnection("Verifying database spreadsheet 'Conscious Media Content Tracker'...");
  
  const query = `name = 'Conscious Media Content Tracker' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false and '${parentId}' in parents`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`;
  
  const searchRes = await fetch(searchUrl, {
    headers: { "Authorization": "Bearer " + accessToken }
  });
  const searchData = await searchRes.json();

  if (searchData.files && searchData.files.length > 0) {
    googleSpreadsheetId = searchData.files[0].id;
    logConnection("Database sheet connected! ID: " + googleSpreadsheetId);
    return;
  }

  // Create spreadsheet inside roots folder parent directory
  logConnection("Database file not found. Building new spreadsheet tracker...");
  const createUrl = "https://www.googleapis.com/drive/v3/files?fields=id";
  const metadata = {
    name: "Conscious Media Content Tracker",
    mimeType: "application/vnd.google-apps.spreadsheet",
    parents: [parentId]
  };

  const createRes = await fetch(createUrl, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(metadata)
  });
  const createdData = await createRes.json();
  googleSpreadsheetId = createdData.id;
  logConnection("Database file constructed! ID: " + googleSpreadsheetId);

  // Initialize columns headers in new spreadsheet
  await writeSpreadsheetHeaders();
}

async function writeSpreadsheetHeaders() {
  logConnection("Setting up spreadsheet columns header layout...");
  
  const headers = [
    "Video Title", "Month", "Thumbnail Status", "Image Links", 
    "Final File Link", "Caption Text", "Upload Date", 
    "YouTube Link", "Artist Names", "Video Category", 
    "Thumbnail Template Used", "Notes"
  ];
  
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetId}/values/Sheet1!A1:L1?valueInputOption=RAW`;
  const body = {
    values: [headers]
  };

  await fetch(updateUrl, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  logConnection("Spreadsheet columns initialized successfully.");
}

// Drive Multipart File Upload REST Call
async function uploadFileToDrive(blob, filename, parentId) {
  const metadata = {
    name: filename,
    parents: [parentId]
  };

  const formData = new FormData();
  formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  formData.append("file", blob);

  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
    method: "POST",
    headers: { "Authorization": "Bearer " + accessToken },
    body: formData
  });
  
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Upload fail: ${response.status} - ${errorBody}`);
  }

  return await response.json();
}

// Workflow Save and Sync
async function triggerWorkflowSave() {
  const canvasNode = document.getElementById("canvas-node");
  if (!canvasNode) return;

  const btn = document.getElementById("btn-save-workflow");
  btn.textContent = "Syncing & Saving to Google Cloud...";
  btn.disabled = true;

  try {
    // 1. Render PNG Blob
    const guides = canvasNode.querySelectorAll(".non-exporting");
    guides.forEach(g => g.style.visibility = "hidden");
    const originalTransform = canvasNode.style.transform;
    canvasNode.style.transform = "scale(1)";

    const renderedCanvas = await html2canvas(canvasNode, {
      width: 1280,
      height: 720,
      scale: 1,
      useCORS: true,
      logging: false,
      backgroundColor: "#000000"
    });

    canvasNode.style.transform = originalTransform;
    guides.forEach(g => g.style.visibility = "visible");

    // Convert canvas to binary blob
    const blob = await new Promise(resolve => renderedCanvas.toBlob(resolve, "image/png"));

    // 2. Select target folder (Finished vs March)
    let parentFolderId = googleFolderStructure.finishedThumbnails;
    if (state.month === "March") {
      parentFolderId = googleFolderStructure.marchThumbnail;
      logConnection("Saving completed file to Month '/March Thumbnail' exclusive directory...");
    } else {
      logConnection("Saving completed file to general '/Finished Thumbnails' directory...");
    }

    const cleanTitle = state.videoTitle.toLowerCase().replace(/\s+/g, "_").substring(0, 15);
    const filename = `thumb_conscious_${cleanTitle}_${Date.now()}.png`;

    // 3. Upload PNG to Drive
    const uploadRes = await uploadFileToDrive(blob, filename, parentFolderId);
    state.finalFileLink = uploadRes.webViewLink;
    logConnection("Thumbnail saved successfully to Google Drive. Link: " + state.finalFileLink);

    // 4. Append row to Google Sheets
    await appendRowToSheets();

    // 5. Update local view list
    refreshDatabaseRows();

    alert("Completed Thumbnail saved to Google Drive and cataloged in Google Sheets successfully!");

  } catch (err) {
    console.error(err);
    alert("Error syncing to Google Workspace: " + err.message);
    logConnection("Workflow save error: " + err.message);
  } finally {
    btn.textContent = "💾 Cloud Save & Sync Tracker";
    btn.disabled = false;
  }
}

async function appendRowToSheets() {
  logConnection("Appending content project row to Google Sheets...");
  
  // Format row matching schema:
  // "Video Title", "Month", "Thumbnail Status", "Image Links", "Final File Link", "Caption Text", "Upload Date", "YouTube Link", "Artist Names", "Video Category", "Thumbnail Template Used", "Notes"
  const capText = document.getElementById("cap-text-1").textContent;
  const uploadDate = new Date().toLocaleDateString();

  const values = [
    state.videoTitle,
    state.month,
    state.status,
    state.imageLinks || "Default Asset",
    state.finalFileLink,
    capText,
    uploadDate,
    state.youtubeLink,
    state.artists,
    state.category,
    state.fontPair + " + " + state.bgStyle,
    state.notes
  ];

  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetId}/values/Sheet1!A:L:append?valueInputOption=USER_ENTERED`;
  const body = {
    values: [values]
  };

  const response = await fetch(appendUrl, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (response.ok) {
    logConnection("Google Sheets database catalog row added.");
    
    // Save to local storage for local offline state sync
    saveToLocalDatabase(values);
  } else {
    logConnection("Error appending sheets database row: " + response.statusText);
  }
}

// Refresh Google Sheet rows and draw database table layout
async function refreshDatabaseRows() {
  const btn = document.getElementById("btn-refresh-db");
  if (btn) btn.disabled = true;

  logConnection("Fetching records list from Google Sheets Tracker...");
  try {
    const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetId}/values/Sheet1!A2:L`;
    const response = await fetch(fetchUrl, {
      headers: { "Authorization": "Bearer " + accessToken }
    });
    
    const data = await response.json();
    drawDatabaseTable(data.values || []);
    logConnection("Spreadsheet database list loaded successfully.");
  } catch (err) {
    console.error(err);
    logConnection("Failed loading database row elements: " + err.message);
  } finally {
    if (btn) btn.disabled = false;
  }
}

function drawDatabaseTable(rows) {
  const body = document.getElementById("db-table-body");
  if (!body) return;

  if (rows.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="table-empty-state">No content tracking items recorded in the spreadsheet.</td></tr>`;
    return;
  }

  body.innerHTML = "";
  // Display newest rows first
  rows.reverse().forEach((row) => {
    // Columns: "Video Title"(0), "Month"(1), "Thumbnail Status"(2), "Image Links"(3), "Final File Link"(4), "Caption Text"(5), "Upload Date"(6), "YouTube Link"(7), "Artist Names"(8), "Video Category"(9), "Thumbnail Template Used"(10), "Notes"(11)
    const title = row[0] || "Untitled Video";
    const month = row[1] || "";
    const status = row[2] || "Draft";
    const finalLink = row[4] || "#";
    const artists = row[8] || "";
    const category = row[9] || "";

    const statusClass = status.toLowerCase();
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${title}</strong></td>
      <td>${month}</td>
      <td>${category}</td>
      <td><span class="status-badge ${statusClass}">${status}</span></td>
      <td>${artists}</td>
      <td><a href="${finalLink}" target="_blank" class="table-link">Open Drive File ↗</a></td>
      <td><button class="btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;" onclick="loadProjectRowToEditor('${title.replace(/'/g, "\\'")}')">Load to Editor</button></td>
    `;
    body.appendChild(tr);
  });
}

// Local offline DB storage fallback
function saveToLocalDatabase(rowValues) {
  let db = JSON.parse(localStorage.getItem("conscious_media_local_db") || "[]");
  db.push(rowValues);
  localStorage.setItem("conscious_media_local_db", JSON.stringify(db));
}

function loadLocalDatabase() {
  const db = JSON.parse(localStorage.getItem("conscious_media_local_db") || "[]");
  if (!accessToken && db.length > 0) {
    drawDatabaseTable(db);
  }
}

// Load spreadsheet record data back into Layout Editor inputs
window.loadProjectRowToEditor = function(title) {
  // Search locally loaded rows
  const localDb = JSON.parse(localStorage.getItem("conscious_media_local_db") || "[]");
  let targetRow = localDb.find(r => r[0] === title);

  if (targetRow) {
    logConnection("Loading project back to Editor: " + title);
    
    // Apply database details to app state
    state.videoTitle = targetRow[0];
    state.month = targetRow[1];
    state.status = targetRow[2];
    state.imageLinks = targetRow[3];
    state.finalFileLink = targetRow[4];
    state.artists = targetRow[8];
    state.category = targetRow[9];
    state.notes = targetRow[11];

    // Sync input components
    document.getElementById("input-video-title").value = state.videoTitle;
    document.getElementById("select-month").value = state.month;
    document.getElementById("select-status").value = state.status;
    document.getElementById("input-artists").value = state.artists;
    document.getElementById("select-category").value = state.category;
    document.getElementById("input-youtube-link").value = targetRow[7] || "";
    document.getElementById("input-notes").value = state.notes;

    // Apply basic preset elements based on Category
    if (state.category === "Reggae Birthday") {
      applyTemplateData(templates["tpl-march-birthday"]);
    } else if (state.category === "Dancehall Artists") {
      applyTemplateData(templates["tpl-dancehall"]);
    } else if (state.category === "Top 10 Lists") {
      applyTemplateData(templates["tpl-top10"]);
    } else {
      applyTemplateData(templates["tpl-roots-doc"]);
    }

    updateSimulatedVideoTitle(state.videoTitle);
    
    // Switch to Editor Tab
    document.querySelector('.tab-btn[data-tab="editor-tab"]').click();
  }
};


// ==========================================
// AI COPYWRITER TEXT GENERATOR ALGORITHMS
// ==========================================

function initCopywriter() {
  const btn = document.getElementById("btn-generate-copy");
  if (btn) {
    btn.addEventListener("click", () => {
      generateAICopyText();
    });
  }

  // Bind DB Refresh button
  const btnRefresh = document.getElementById("btn-refresh-db");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      refreshDatabaseRows();
    });
  }

  // Programmatic event delegation for AI Headline click triggers
  const headlineOutput = document.getElementById("ai-headline-output");
  if (headlineOutput) {
    headlineOutput.addEventListener("click", (e) => {
      const block = e.target.closest(".copy-block");
      if (block) {
        const text = block.getAttribute("data-headline") || block.textContent.trim();
        window.applyAIText(text);
      }
    });
  }
}

function generateAICopyText() {
  const category = state.category;
  const month = state.month;
  const artistString = state.artists || "Reggae Legends";
  const artistsList = artistString.split(",").map(a => a.trim());
  const primaryArtist = artistsList[0] || "Reggae Icon";

  // Headline generation algorithms (3-5 words max, high contrast ready)
  let headlines = [];
  if (category === "Reggae Birthday") {
    headlines = [
      `${month.toUpperCase()} LEGENDS`,
      `BORN IN ${month.toUpperCase()}`,
      `HAPPY EARTHSTRONG ${primaryArtist.toUpperCase()}`
    ];
  } else if (category === "Dancehall Artists") {
    headlines = [
      `${primaryArtist.toUpperCase()} CLASH`,
      `STREET DANCEHALL`,
      `KING OF DANCEHALL`
    ];
  } else if (category === "Top 10 Lists") {
    headlines = [
      `TOP 10 ANTHEMS`,
      `ROOTS CLASSIFIED`,
      `10 REGGAE CLASSICS`
    ];
  } else if (category === "Reggae History") {
    headlines = [
      `REGGAE REVOLUTION`,
      `ROOTS UNCOVERED`,
      `JAMAICAN HISTORY`
    ];
  } else {
    // Documentaries
    headlines = [
      `${primaryArtist.toUpperCase()} STORY`,
      `REGGAE DOCUMENTARY`,
      `LEGENDARY LIVITY`
    ];
  }

  // Headline UI Sync
  const headlineOutput = document.getElementById("ai-headline-output");
  if (headlineOutput) {
    headlineOutput.innerHTML = headlines.map(h => `
      <div class="copy-block" data-headline="${h}">${h}</div>
    `).join("");
  }

  // Social Captions Generator
  const caption1 = `🔥 Celebrating ${artistString} born in ${month}! From classic roots anthems to the heights of dancehall, we dive deep into the records, riddims, and Caribbean storytelling that defined a generation. Check out the full episode now! #ConsciousMedia #ReggaeHistory #RootsCulture #CaribbeanStorytelling`;
  const caption2 = `⚡ The livity and the sounds of Jamaica! In this ${category.toLowerCase()} special, we examine how artists like ${primaryArtist} revolutionized the world stage. What is your ultimate Roots or Dancehall anthem? Drop it in the comments below! #ReggaeMusic #DancehallCulture #MusicCommentary`;

  const captionOutput = document.getElementById("ai-caption-output");
  if (captionOutput) {
    captionOutput.innerHTML = `
      <div class="caption-item-card">
        <p class="caption-item-text" id="cap-text-1">${caption1}</p>
        <button class="btn-copy-clipboard" onclick="copyCaption('cap-text-1')">Copy Caption</button>
      </div>
      <div class="caption-item-card">
        <p class="caption-item-text" id="cap-text-2">${caption2}</p>
        <button class="btn-copy-clipboard" onclick="copyCaption('cap-text-2')">Copy Caption</button>
      </div>
    `;
  }

  logConnection("AI creative copy generated successfully for: " + artistString);
}

// Helpers called from AI Copywriter cards
window.applyAIText = function(text) {
  state.headline = text;
  document.getElementById("input-headline").value = text;
  validateWordCount(text);
  renderPreview();
  // Switch to Editor Tab
  document.querySelector('.tab-btn[data-tab="editor-tab"]').click();
};

window.copyCaption = function(elementId) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Caption copied to clipboard!");
  }).catch(err => {
    console.error("Clipboard copy failed: ", err);
  });
};
