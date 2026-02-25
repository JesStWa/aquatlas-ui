
import { GEOSERVER_WMS, LEGEND_MODE, LAYER_DEFS, MAP_VIEW } from "./config.js";

const $ = (sel)=>document.querySelector(sel);
const legendImg = $("#legend-img");
const info = $("#info");

// Map
const map = L.map("map").setView(MAP_VIEW.center, MAP_VIEW.zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution:'© OpenStreetMap' }).addTo(map);

// Build WMS layers and UI controls
const layers = {};
const layerList = $("#layer-list");

LAYER_DEFS.forEach(def=>{
  const wms = L.tileLayer.wms(GEOSERVER_WMS, {
    layers: def.layer,
    styles: def.style,
    format: "image/png",
    transparent: true,
    tiled: true
  });
  layers[def.id] = wms;
  if (def.visible) wms.addTo(map);

  // UI row
  const row = document.createElement('div');
  row.className = 'layer-row';
  row.innerHTML = `
    <input type="checkbox" id="chk_${def.id}" ${def.visible?'checked':''}/>
    <label for="chk_${def.id}">${def.title}</label>
    <input type="range" id="op_${def.id}" min="0" max="1" step="0.05" value="${def.opacity ?? 1}" />
  `;
  layerList.appendChild(row);

  $("#chk_"+def.id).addEventListener('change', (e)=>{
    if (e.target.checked) {
      wms.addTo(map);
      setLegend(def);
    } else {
      map.removeLayer(wms);
      info.textContent = "";
    }
  });
  $("#op_"+def.id).addEventListener('input', (e)=>{
    wms.setOpacity(parseFloat(e.target.value));
  });
  if (def.visible && !legendImg.src) setLegend(def);
});

function setLegend(def) {
  if (LEGEND_MODE === "SERVER") {
    legendImg.src = `${GEOSERVER_WMS}?service=WMS&request=GetLegendGraphic&format=image/png&layer=${encodeURIComponent(def.layer)}&style=${encodeURIComponent(def.style)}`;
  } else {
    legendImg.src = `./public/legends/${def.legendPng}`;
  }
}

// Simple GetFeatureInfo
map.on('click', async (e)=>{
  const activeDef = [...LAYER_DEFS].reverse().find(d => map.hasLayer(layers[d.id]));
  if (!activeDef) return;
  const size = map.getSize();
  const pt = map.latLngToContainerPoint(e.latlng, map.getZoom());
  const bbox = map.getBounds().toBBoxString();
  const params = new URLSearchParams({
    service:'WMS', request:'GetFeatureInfo', version:'1.3.0', srs:'EPSG:3857',
    styles: activeDef.style, format:'image/png', transparent:'true',
    query_layers: activeDef.layer, layers: activeDef.layer, info_format:'text/html',
    i: Math.trunc(pt.x), j: Math.trunc(pt.y), width:size.x, height:size.y
  });
  const url = `${GEOSERVER_WMS}?${params}&bbox=${bbox}`;
  try { const html = await fetch(url).then(r=>r.text()); info.innerHTML = html.slice(0,1500);} catch { info.textContent='GetFeatureInfo failed.'; }
});
