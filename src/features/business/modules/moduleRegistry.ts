/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Anchor, Home, Calendar, Utensils, Compass, Bus } from 'lucide-react';

export interface BusinessModuleConfig {
  id: string;                                          // Identificador de pestaña
  label: string;                                       // Nombre en pestaña (desktop)
  mobileLabel: string;                                 // Nombre en pestaña (móvil)
  icon: React.ComponentType<any>;                      // Componente Lucide Icon
  isEnabled: (services: any[]) => boolean;            // Verifica si el prestador califica para este módulo
  screen: React.ComponentType<{ services: any[]; bookings: any[] }>; // Componente principal lazy-loaded
}

// Carga diferida (Lazy Load) de las pantallas de módulos especiales
const BoatTourModuleLazy = React.lazy(() => import('./boat-tour/screens/BoatTourModule'));
const LodgingModuleLazy = React.lazy(() => import('./lodging/screens/LodgingModule'));
const PropertyRentalModuleLazy = React.lazy(() => import('./property-rental/screens/PropertyRentalModule'));
const RestaurantModuleLazy = React.lazy(() => import('./restaurant/screens/RestaurantModule'));
const TourAgencyModuleLazy = React.lazy(() => import('./tour-agency/screens/TourAgencyModule'));
const TransportModuleLazy = React.lazy(() => import('./transport/screens/TransportModule'));

export const moduleRegistry: BusinessModuleConfig[] = [
  {
    id: 'boat_tour',
    label: 'Control de Lancha',
    mobileLabel: 'Lanchas',
    icon: Anchor,
    isEnabled: (services: any[]) => services.some(s => s.type === 'BOAT_TOUR'),
    screen: BoatTourModuleLazy
  },
  {
    id: 'lodging',
    label: 'Control de Alojamiento',
    mobileLabel: 'Alojamiento',
    icon: Home,
    isEnabled: (services: any[]) => services.some(s => s.type === 'HOTEL' || s.type === 'HOSTEL'),
    screen: LodgingModuleLazy
  },
  {
    id: 'property_rental',
    label: 'Control de Calendario',
    mobileLabel: 'Calendario',
    icon: Calendar,
    isEnabled: (services: any[]) => services.some(s => s.type === 'PROPERTY_RENTAL'),
    screen: PropertyRentalModuleLazy
  },
  {
    id: 'restaurant',
    label: 'Control de Menú',
    mobileLabel: 'Menú',
    icon: Utensils,
    isEnabled: (services: any[]) => services.some(s => s.type === 'RESTAURANT' || s.type === 'FOOD_STAND'),
    screen: RestaurantModuleLazy
  },
  {
    id: 'tour_agency',
    label: 'Control de Salidas',
    mobileLabel: 'Salidas',
    icon: Compass,
    isEnabled: (services: any[]) => services.some(s => s.type === 'TOUR_AGENCY'),
    screen: TourAgencyModuleLazy
  },
  {
    id: 'transport',
    label: 'Control de Rutas',
    mobileLabel: 'Transporte',
    icon: Bus,
    isEnabled: (services: any[]) => services.some(s => s.type === 'TRANSPORT'),
    screen: TransportModuleLazy
  }
];
