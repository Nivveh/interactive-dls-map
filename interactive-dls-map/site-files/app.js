const STORAGE_KEY = "fixed-map-markers-v1";

const DEFAULT_MARKERS = [
  { id: "01", text: "01", color: "#20a464", x: 26.722, y: 27.703 },
  { id: "02", text: "02", color: "#20a464", x: 32.552, y: 23.197 },
  { id: "03", text: "03", color: "#20a464", x: 39.696, y: 21.983 },
  { id: "04", text: "04", color: "#20a464", x: 46.204, y: 21.987 },
  { id: "05", text: "05", color: "#20a464", x: 53.003, y: 22.131 },
  { id: "06", text: "06", color: "#20a464", x: 59.817, y: 22.132 },
  { id: "07", text: "07", color: "#20a464", x: 68.248, y: 25.879 },
  { id: "08", text: "08", color: "#20a464", x: 71.452, y: 32.811 },
  { id: "09", text: "09", color: "#20a464", x: 74.618, y: 41.493 },
  { id: "10", text: "10", color: "#20a464", x: 78.766, y: 47.231 },
  { id: "11", text: "11", color: "#20a464", x: 80.509, y: 53.538 },
  { id: "12", text: "12", color: "#20a464", x: 79.845, y: 59.858 },
  { id: "13", text: "13", color: "#20a464", x: 78.793, y: 66.167 },
  { id: "14", text: "14", color: "#20a464", x: 73.796, y: 69.810 },
  { id: "15", text: "15", color: "#20a464", x: 65.387, y: 68.825 },
  { id: "16", text: "16", color: "#20a464", x: 58.782, y: 67.943 },
  { id: "17", text: "17", color: "#20a464", x: 51.364, y: 68.844 },
  { id: "18", text: "18", color: "#20a464", x: 43.769, y: 67.961 },
  { id: "19", text: "19", color: "#20a464", x: 38.374, y: 62.535 },
  { id: "20", text: "20", color: "#20a464", x: 33.512, y: 58.773 },
  { id: "21", text: "21", color: "#20a464", x: 28.240, y: 56.196 },
  { id: "22", text: "22", color: "#20a464", x: 25.434, y: 51.838 },
  { id: "23", text: "23", color: "#20a464", x: 25.103, y: 43.319 },
  { id: "24", text: "24", color: "#20a464", x: 23.938, y: 36.135 },

  { id: "A1", text: "A1", color: "#ffbd59", x: 44.595, y: 35.287 },
  { id: "A2", text: "A2", color: "#ffbd59", x: 52.997, y: 35.272 },
  { id: "A3", text: "A3", color: "#ffbd59", x: 63.035, y: 37.416 },
  { id: "B1", text: "B1", color: "#004fff", x: 65.460, y: 45.394 },
  { id: "B2", text: "B2", color: "#004fff", x: 64.957, y: 53.508 },
  { id: "B3", text: "B3", color: "#004fff", x: 57.805, y: 57.220 },
  { id: "C1", text: "C1", color: "#ff3131", x: 49.381, y: 57.242 },
  { id: "C2", text: "C2", color: "#ff3131", x: 40.940, y: 48.543 },
  { id: "C3", text: "C3", color: "#ff3131", x: 39.085, y: 41.080 },

  { id: "P1", text: "X", color: "#c86ae8", x: 25.765, y: 8.383 },
  { id: "P2", text: "X", color: "#c86ae8", x: 80.359, y: 10.462 },
  { id: "P3", text: "X", color: "#c86ae8", x: 31.198, y: 16.339 },
  { id: "P4", text: "X", color: "#c86ae8", x: 71.154, y: 19.106 },
  { id: "P5", text: "X", color: "#c86ae8", x: 88.289, y: 47.682 },
  { id: "P6", text: "X", color: "#c86ae8", x: 15.290, y: 52.784 },
  { id: "P7", text: "X", color: "#c86ae8", x: 37.137, y: 73.639 },
  { id: "P8", text: "X", color: "#c86ae8", x: 71.802, y: 77.152 },
  { id: "P9", text: "X", color: "#c86ae8", x: 34.007, y: 84.637 },
  { id: "P10", text: "X", color: "#c86ae8", x: 70.134, y: 88.959 }
];

const DIRECTIONS = [
  { text: "N",  x: 51.367, y: 9.917 },
  { text: "NW", x: 16.935, y: 26.911 },
  { text: "NE", x: 82.210, y: 28.260 },
  { text: "SW", x: 20.499, y: 72.462 },
  { text: "SE", x: 86.474, y: 72.479 },
  { text: "S",  x: 51.379, y: 82.031 }
];

let markers = loadMarkers();
let selectedId = null;

const markerLayer = document.querySelector("#marker-layer");
const directionLayer = document.querySelector("#direction-layer");
const emptyState = document.querySelector("#empty-state");
const form = document.querySelector("#editor-form");
const selectedIdEl = document.querySelector("#selected-id");
const textInput = document.querySelector("#marker-text");
const colorInput = document.querySelector("#marker-color");
const mapImage = document.querySelector(".map-image");
const downloadButton = document.querySelector("#download-map");
const downloadStatus = document.querySelector("#download-status");

function loadMarkers() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return structuredClone(DEFAULT_MARKERS);

    // Keep coordinates fixed from source code even when saved state is loaded.
    return DEFAULT_MARKERS.map((base) => {
      const existing = saved.find((item) => item.id === base.id);
      return {
        ...base,
        text: typeof existing?.text === "string" ? existing.text : base.text,
        color: /^#[0-9a-f]{6}$/i.test(existing?.color || "") ? existing.color : base.color
      };
    });
  } catch {
    return structuredClone(DEFAULT_MARKERS);
  }
}

function saveMarkers() {
  const editableData = markers.map(({ id, text, color }) => ({ id, text, color }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(editableData));
}

function textColorFor(background) {
  const hex = background.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? "#111111" : "#ffffff";
}

function renderDirections() {
  directionLayer.innerHTML = "";
  for (const item of DIRECTIONS) {
    const el = document.createElement("div");
    el.className = "direction-marker";
    el.textContent = item.text;
    el.style.setProperty("--x", `${item.x}%`);
    el.style.setProperty("--y", `${item.y}%`);
    directionLayer.appendChild(el);
  }
}

function renderMarkers() {
  markerLayer.innerHTML = "";

  for (const marker of markers) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "marker";
    button.dataset.id = marker.id;
    button.textContent = marker.text;
    button.title = `Edit marker ${marker.id}`;
    button.setAttribute("aria-label", `Edit marker ${marker.id}, currently ${marker.text}`);
    button.style.setProperty("--x", `${marker.x}%`);
    button.style.setProperty("--y", `${marker.y}%`);
    button.style.setProperty("--marker-color", marker.color);
    button.style.setProperty("--label-color", textColorFor(marker.color));

    if (marker.text.length >= 4) button.classList.add("tiny");
    else if (marker.text.length === 3) button.classList.add("compact");
    if (marker.id === selectedId) button.classList.add("is-selected");

    button.addEventListener("click", () => selectMarker(marker.id));
    markerLayer.appendChild(button);
  }
}

function selectMarker(id) {
  selectedId = id;
  const marker = markers.find((item) => item.id === id);
  if (!marker) return;

  emptyState.hidden = true;
  form.hidden = false;
  selectedIdEl.textContent = id;
  textInput.value = marker.text;
  colorInput.value = marker.color;
  renderMarkers();
  textInput.focus({ preventScroll: true });
}

function updateSelected(patch) {
  const marker = markers.find((item) => item.id === selectedId);
  if (!marker) return;
  Object.assign(marker, patch);
  saveMarkers();
  renderMarkers();
}

textInput.addEventListener("input", (event) => {
  updateSelected({ text: event.target.value || " " });
});

colorInput.addEventListener("input", (event) => {
  updateSelected({ color: event.target.value });
});

document.querySelectorAll(".swatch").forEach((button) => {
  button.addEventListener("click", () => {
    const color = button.dataset.color;
    colorInput.value = color;
    updateSelected({ color });
  });
});

function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawExportMarker(ctx, marker, width, height) {
  const cx = width * marker.x / 100;
  const cy = height * marker.y / 100;
  const radius = width * 0.02675;
  const label = marker.text || " ";

  ctx.save();
  ctx.fillStyle = marker.color;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  let fontSize = width * 0.0223;
  if (label.length === 3) fontSize = width * 0.018;
  if (label.length >= 4) fontSize = width * 0.014;

  ctx.fillStyle = textColorFor(marker.color);
  ctx.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx, cy + fontSize * 0.03);
  ctx.restore();
}

function drawExportDirection(ctx, item, width, height) {
  const cx = width * item.x / 100;
  const cy = height * item.y / 100;
  const markerHeight = width * 0.0508;
  const fontSize = width * 0.0208;

  ctx.save();
  ctx.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
  const textWidth = ctx.measureText(item.text).width;
  const markerWidth = Math.max(markerHeight, textWidth + width * 0.023);

  ctx.fillStyle = "#ffffff";
  roundedRectPath(
    ctx,
    cx - markerWidth / 2,
    cy - markerHeight / 2,
    markerWidth,
    markerHeight,
    markerHeight / 2
  );
  ctx.fill();

  ctx.fillStyle = "#171717";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.text, cx, cy + fontSize * 0.03);
  ctx.restore();
}

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadMapImage() {
  downloadButton.disabled = true;
  downloadStatus.textContent = "Creating PNG…";

  try {
    if (!mapImage.complete || !mapImage.naturalWidth) {
      await new Promise((resolve, reject) => {
        mapImage.addEventListener("load", resolve, { once: true });
        mapImage.addEventListener("error", reject, { once: true });
      });
    }

    const width = mapImage.naturalWidth;
    const height = mapImage.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported in this browser.");

    ctx.drawImage(mapImage, 0, 0, width, height);
    DIRECTIONS.forEach((item) => drawExportDirection(ctx, item, width, height));
    markers.forEach((marker) => drawExportMarker(ctx, marker, width, height));

    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-") + "_" + [
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0")
    ].join("-");
    const filename = `map-version-${stamp}.png`;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("The PNG could not be created.");

    triggerBlobDownload(blob, filename);
    downloadStatus.textContent = `Downloaded ${filename}`;
  } catch (error) {
    console.error(error);
    downloadStatus.textContent = "Download failed. Try opening the site in Chrome, Edge, Firefox, or Safari.";
  } finally {
    downloadButton.disabled = false;
  }
}

downloadButton.addEventListener("click", downloadMapImage);

document.querySelector("#reset-marker").addEventListener("click", () => {
  if (!selectedId) return;
  const base = DEFAULT_MARKERS.find((item) => item.id === selectedId);
  const marker = markers.find((item) => item.id === selectedId);
  marker.text = base.text;
  marker.color = base.color;
  saveMarkers();
  selectMarker(selectedId);
});

document.querySelector("#reset-all").addEventListener("click", () => {
  markers = structuredClone(DEFAULT_MARKERS);
  localStorage.removeItem(STORAGE_KEY);
  selectedId = null;
  form.hidden = true;
  emptyState.hidden = false;
  renderMarkers();
});

renderDirections();
renderMarkers();
