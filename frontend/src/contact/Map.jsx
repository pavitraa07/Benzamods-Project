import { useState } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

export default function ShopMap() {
  const [infoOpen, setInfoOpen] = useState(false);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error(
      "Google Maps API key is missing! Make sure .env has REACT_APP_GOOGLE_MAPS_API_KEY and restart the dev server."
    );
  }

  return (
    <>
      <APIProvider apiKey={apiKey}>
        <div
          style={{
            height: "70vh",
            width: "100%",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <Map
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={14}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            <Marker position={DEFAULT_CENTER} onClick={() => setInfoOpen(true)} />
            {infoOpen && (
              <InfoWindow
                position={DEFAULT_CENTER}
                onCloseClick={() => setInfoOpen(false)}
              >
                <div style={{ lineHeight: 1.4 }}>
                  <strong>Benzamods</strong>
                  <br />
                  Customization • PPF • Tuning
                  <br />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${DEFAULT_CENTER.lat},${DEFAULT_CENTER.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>
    </>
  );
}
