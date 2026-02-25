
// === Aquatlas WMS configuration ===
export const GEOSERVER_WMS = "https://aquatlas.nz/geoserver/wms"; // or https://aquatlas.nz/geoserver/aquatlas/wms

// Use SERVER legends (GetLegendGraphic) or STATIC png images you ship with the app.
export const LEGEND_MODE = "SERVER"; // "SERVER" | "STATIC"

export const LAYER_DEFS = [
  {
    id: "river",
    title: "River flow",
    layer: "aquatlas:water_volume_transport_in_river_channel",
    style: "q_river_style",
    visible: true,
    opacity: 0.9,
    legendPng: "aquatlas_q_river_style.png"
  },
  {
    id: "overland",
    title: "Overland flow",
    layer: "aquatlas:surface_runoff_flux",
    style: "q_land_style",
    visible: false,
    opacity: 0.9,
    legendPng: "aquatlas_q_land_style.png"
  },
  {
    id: "subsurface",
    title: "Subsurface flow",
    layer: "aquatlas:downward_liquid_water_mass_flux_into_groundwater",
    style: "ssf_style",
    visible: false,
    opacity: 0.9,
    legendPng: "aquatlas_ssf_style.png"
  }
];

// Initial map view
export const MAP_VIEW = {
  center: [-36.786, 174.995], // Waiheke / Auckland
  zoom: 9
};
