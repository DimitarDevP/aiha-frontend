// Types/warnings.ts
import React from 'react';

export type CardColor = 'yellow' | 'red' | 'blue' | 'green' | 'purple' | 'default';

export interface WarningDetails {
  id: string;
  title: string;
  summary: string;
  details: string;
  recommendations: string[];
  color: CardColor;
  icon?: React.ReactNode;
  location?: {
    lat: number;
    lng: number;
    intensity?: number;
  };
}

export interface WarningsState {
  warnings: WarningDetails[];
}