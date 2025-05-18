import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity?: number;
}

interface HeatmapProps {
  points: HeatmapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
  locked?: boolean;
}

const Heatmap: React.FC<HeatmapProps> = ({
  points,
  center = [48.8566, 2.3522],
  zoom = 5,
  height = '300px',
  width = '100%',
  locked = true
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;

    // Delay to wait for parent layout (especially modals)
    setTimeout(() => {
      if (mapRef.current) return; // Prevent reinitialization

      const map = L.map(containerRef.current!, {
        center,
        zoom,
        zoomControl: false,
        dragging: !locked,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false
      });

      mapRef.current = map;

      // Add base tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        opacity: 0.7
      }).addTo(map);

      // Add label layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        opacity: 0.5
      }).addTo(map);

      const heatData = points.map(point => [
        point.lat,
        point.lng,
        point.intensity || 0.5
      ] as [number, number, number]);

      const heatmapGradient = {
        0.1: 'rgba(59, 130, 246, 0.2)',   // blue-500
        0.3: 'rgba(234, 179, 8, 0.4)',    // yellow-500
        0.6: 'rgba(245, 158, 11, 0.6)',   // amber-500
        0.8: 'rgba(239, 68, 68, 0.8)',    // red-500
        1.0: 'rgba(185, 28, 28, 1)'       // red-700
      };

      heatLayerRef.current = (L as any).heatLayer(heatData, {
        radius: 25,
        blur: 20,
        maxZoom: 9,
        gradient: heatmapGradient,
        minOpacity: 0.3
      }).addTo(map);

      const europeBounds = L.latLngBounds(L.latLng(35, -25), L.latLng(71, 40));

      if (locked) {
        map.setMaxBounds(europeBounds);
        map.on('drag', () => {
          map.panInsideBounds(europeBounds, { animate: false });
        });
      }

      // Force Leaflet to size correctly
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, 50);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      heatLayerRef.current = null;
    };
  }, [points, center, zoom, locked]);

  return (
    <div
      ref={containerRef}
      style={{
        height,
        width,
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f8fafc'
      }}
    />
  );
};

export default Heatmap;
