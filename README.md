
# Aquatlas UI (WMS)

Minimal Leaflet app that renders three hydrology layers from GeoServer via WMS and shows matching legends.

## Quick start

```bash
# serve locally
python3 -m http.server 5500
# open http://localhost:5500
```

## Configure
- Edit `src/config.js` to change:
  - `GEOSERVER_WMS` (base WMS endpoint)
  - `LEGEND_MODE` ("SERVER" for GetLegendGraphic or "STATIC" for bundled PNGs)
  - `LAYER_DEFS` (layer/style names)

## Deploy to Azure Static Web Apps
1. Create a Static Web App and copy its **deployment token**.
2. Create GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN` with that token.
3. Push to `main`; the provided GitHub Action will deploy automatically.

## Notes
- WMS requires parameters like `service=WMS`, `request=GetMap`/`GetLegendGraphic`. Leaflet's `L.tileLayer.wms()` handles these for tiles.
- For legends, `LEGEND_MODE = "SERVER"` uses `GetLegendGraphic` so the legend always matches your SLD in GeoServer.
- If you encounter CORS, either switch to `LEGEND_MODE = "STATIC"` or front your GeoServer through the same Azure Front Door endpoint as the app and route `/geoserver/*` to the origin.
