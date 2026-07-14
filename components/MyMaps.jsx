'use client';
 
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
 
// Controller component to dynamically manage Leaflet scrollWheelZoom based on Ctrl key
function MapInteractionController({ ctrlPressed }) {
  const map = useMap();
  React.useEffect(() => {
    // Dragging and double click zoom are always enabled
    map.dragging.enable();
    map.doubleClickZoom.enable();
 
    if (ctrlPressed) {
      if (map.scrollWheelZoom) map.scrollWheelZoom.enable();
    } else {
      if (map.scrollWheelZoom) map.scrollWheelZoom.disable();
    }
  }, [ctrlPressed, map]);
  return null;
}
 
const MyMap = () => {
  const [mounted, setMounted] = React.useState(false);
  const [ctrlPressed, setCtrlPressed] = React.useState(false);
  const [showCtrlAlert, setShowCtrlAlert] = React.useState(false);
  const alertTimeoutRef = React.useRef(null);
  const position = [0.776036, 127.374373];
 
  React.useEffect(() => {
    setMounted(true);
 
    const handleKeyDown = (e) => {
      if (e.key === "Control") {
        setCtrlPressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === "Control") {
        setCtrlPressed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    const handleBlur = () => {
      setCtrlPressed(false);
      setShowCtrlAlert(false);
    };
    window.addEventListener("blur", handleBlur);
 
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);
 
  const handleWheel = (e) => {
    // If scrolling without holding Ctrl key, show the default zoom alert overlay
    if (!e.ctrlKey) {
      setShowCtrlAlert(true);
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
      alertTimeoutRef.current = setTimeout(() => {
        setShowCtrlAlert(false);
      }, 1800);
    }
  };
 
  if (!mounted) {
    return <div style={{ height: "220px" }} className="w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl mb-5" />;
  }
 
  return (
    <div 
      style={{ height: "220px" }}
      className="w-full relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800"
      onWheel={handleWheel}
    >
      {/* Google Maps style default alert overlay shown only when scroll attempts happen without Ctrl */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-[0.5px] z-[999] flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          showCtrlAlert ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white text-[13px] md:text-[14px] font-bold text-center px-4 leading-relaxed font-sans select-none tracking-wide">
          Gunakan ctrl + scroll untuk memperbesar atau memperkecil peta
        </span>
      </div>
 
      <MapContainer
        className="w-full h-full"
        center={position}
        zoom={17}
        dragging={true}
        scrollWheelZoom={false}
        doubleClickZoom={true}
      >
        <MapInteractionController ctrlPressed={ctrlPressed} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={position}
          icon={
            new L.Icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
              shadowSize: [41, 41],
            })
          }
        >
          <Popup>
            <div className="flex flex-col gap-1 text-center" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              <span className="font-extrabold text-slate-800 text-sm">SEKRETARIAT HMTI UNKHAIR</span>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=0.776036,127.374373" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-bold flex items-center justify-center gap-1 mt-1.5"
              >
                <span>Buka di Google Maps</span>
                <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
 
export default MyMap;
