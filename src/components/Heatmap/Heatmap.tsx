// components/Heatmap.tsx
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
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (points.length === 0) return;

    // Initialize the map
    mapRef.current = L.map('heatmap-container', {
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

    // Add the OpenStreetMap tiles with a more subtle style
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      opacity: 0.7
    }).addTo(mapRef.current);

    // Prepare heatmap data with enhanced intensity scaling
    const maxIntensity = Math.max(...points.map(p => p.intensity || 1), 1);
    const heatData = points.map(point => [
      point.lat, 
      point.lng, 
      (point.intensity || 1) / maxIntensity * 0.8
    ] as [number, number, number]);

    // Add heatmap layer with weather-like gradient
    heatLayerRef.current = (L as any).heatLayer(heatData, {
      radius: 25,
      blur: 20,
      maxZoom: 9,
      gradient: {
        0.1: 'rgba(33, 102, 172, 0.2)',
        0.3: 'rgba(103, 169, 207, 0.4)',
        0.5: 'rgba(209, 229, 240, 0.6)',
        0.7: 'rgba(253, 219, 199, 0.8)',
        0.9: 'rgba(239, 138, 98, 0.9)',
        1.0: 'rgba(178, 24, 43, 1)'
      },
      minOpacity: 0.3
    }).addTo(mapRef.current);

    // Add Europe bounding box
    const europeBounds = L.latLngBounds(
      L.latLng(35, -25),
      L.latLng(71, 40)
    );
    
    if (locked) {
      mapRef.current.setMaxBounds(europeBounds);
      mapRef.current.on('drag', () => {
        mapRef.current!.panInsideBounds(europeBounds, { animate: false });
      });
    }

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
      id="heatmap-container" 
      style={{ 
        height, 
        width,
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }} 
    />
  );
};

export default Heatmap;