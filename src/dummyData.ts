/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  MochilaUser, 
  Provider, 
  Post, 
  Payment, 
  Promo, 
  Package, 
  RewardTransaction, 
  IncentiveCampaign 
} from './types';

export const DUMMY_USERS: MochilaUser[] = [
  {
    id: "user-pedro",
    name: "Pedro Valenzuela",
    email: "admin@mochilapp.com",
    role: "Admin",
    status: "active",
    createdAt: "2026-01-10T08:00:00Z",
    mochiPuntos: 1250,
    passportLevel: "Embajador Local"
  },
  {
    id: "user-ana",
    name: "Ana Camila Gómez",
    email: "ana.camilag@gmail.com",
    role: "Viajero",
    status: "active",
    createdAt: "2026-03-15T12:30:00Z",
    mochiPuntos: 840,
    passportLevel: "Aventurero"
  },
  {
    id: "user-ricardo",
    name: "Ricardo Salinas (Chiapas Guide)",
    email: "salinas.ricardo@outlook.com",
    role: "Proveedor",
    status: "verified",
    createdAt: "2026-02-20T10:15:00Z",
    mochiPuntos: 300,
    passportLevel: "Explorador"
  },
  {
    id: "user-mariana",
    name: "Mariana del Río",
    email: "marianita.travels@yahoo.com",
    role: "Cliente destacado",
    status: "active",
    createdAt: "2025-11-05T14:22:00Z",
    mochiPuntos: 2450,
    passportLevel: "Viajero Legendario"
  },
  {
    id: "user-esteban",
    name: "Esteban Quiroz",
    email: "esteban.q@gmail.com",
    role: "Viajero",
    status: "suspended",
    createdAt: "2026-04-18T19:10:00Z",
    mochiPuntos: 120,
    passportLevel: "Explorador"
  },
  {
    id: "user-sofia",
    name: "Sofía Vergara Ramos",
    email: "sofia.ramos@live.com.mx",
    role: "Viajero",
    status: "pending",
    createdAt: "2026-05-26T21:00:00Z",
    mochiPuntos: 50,
    passportLevel: "Explorador"
  },
  {
    id: "user-luis",
    name: "Luis Fernando Torres",
    email: "luis.adventure@ecotours.mx",
    role: "Proveedor",
    status: "active",
    createdAt: "2026-03-01T09:40:00Z",
    mochiPuntos: 900,
    passportLevel: "Mochilero"
  }
];

export const DUMMY_PROVIDERS: Provider[] = [
  {
    id: "prov-ecotours",
    merchantName: "EcoTours Chiapas Premium",
    responsibleName: "Ricardo Salinas",
    category: "tour",
    location: "Palenque & San Cristóbal, Chiapas",
    status: "Aprobado",
    rating: 4.8,
    salesCalculated: 38400,
    commissionAccumulated: 5760,
    verificationDocName: "rfc_chiapas_tours_constancia.pdf",
    isRecommended: true,
    createdAt: "2026-02-20T10:20:00Z"
  },
  {
    id: "prov-glamping",
    merchantName: "Glamping Domos Valle de Bravo",
    responsibleName: "Daniela Kuri",
    category: "hospedaje",
    location: "Valle de Bravo, Estado de México",
    status: "Aprobado",
    rating: 4.9,
    salesCalculated: 64200,
    commissionAccumulated: 9630,
    verificationDocName: "acta_propiedad_vallededomos.pdf",
    isRecommended: true,
    createdAt: "2026-01-15T15:00:00Z"
  },
  {
    id: "prov-huasteca",
    merchantName: "Aventura Huasteca Potosina",
    responsibleName: "Luis Fernando Torres",
    category: "aventura",
    location: "Ciudad Valles, San Luis Potosí",
    status: "Pendiente",
    rating: 4.2,
    salesCalculated: 12500,
    commissionAccumulated: 1875,
    verificationDocName: "seguro_colectivo_huasteca2026.pdf",
    isRecommended: false,
    createdAt: "2026-03-01T09:45:00Z"
  },
  {
    id: "prov-lapaz-sea",
    merchantName: "La Paz Good Vibes Marine Adventures",
    responsibleName: "Capitán Jorge Rosas",
    category: "experiencia local",
    location: "La Paz, Baja California Sur",
    status: "Aprobado",
    rating: 4.7,
    salesCalculated: 45000,
    commissionAccumulated: 6750,
    verificationDocName: "permiso_maritimo_bcs_2026.pdf",
    isRecommended: true,
    createdAt: "2026-02-12T11:30:00Z"
  },
  {
    id: "prov-pueblito-sabores",
    merchantName: "Sabores de la Milpa Campestre",
    responsibleName: "Doña Elena Patishtán",
    category: "restaurante",
    location: "Zinacantán, Chiapas",
    status: "Pendiente",
    rating: 4.5,
    salesCalculated: 3200,
    commissionAccumulated: 480,
    verificationDocName: "comprobante_ejidal_2026.pdf",
    isRecommended: false,
    createdAt: "2026-05-10T14:15:00Z"
  },
  {
    id: "prov-cabañas-puebla",
    merchantName: "Cabañas Bosque Cuetzalan",
    responsibleName: "Carlos Altamirano",
    category: "hospedaje",
    location: "Cuetzalan del Progreso, Puebla",
    status: "Rechazado",
    rating: 3.1,
    salesCalculated: 0,
    commissionAccumulated: 0,
    verificationDocName: "identificacion_carlos_ine.pdf",
    isRecommended: false,
    createdAt: "2026-04-10T17:25:00Z"
  }
];

export const DUMMY_POSTS: Post[] = [
  {
    id: "post-1",
    authorId: "user-ana",
    authorName: "Ana Camila Gómez",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    location: "Sian Ka'an, Quintana Roo",
    likesCount: 154,
    title: "Amaneciendo en el edén maya. Recorriendo los manglares ancestrales de la reserva de Sian Ka'an en canoa rústica. La naturaleza en su estado más virgen 🌿🌊 Auténtico Mochilazo.",
    status: "Pendiente",
    createdAt: "2026-05-25T19:10:00Z",
    tag: "Naturaleza",
    isFeatured: false
  },
  {
    id: "post-2",
    authorId: "user-mariana",
    authorName: "Mariana del Río",
    imageUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800",
    location: "Hierve el Agua, Oaxaca",
    likesCount: 312,
    title: "Contemplando el silencio de las pozas infinitas de Hierve el Agua desde temprano. Oaxaca nunca deja de sorprender al corazón viajero.",
    status: "Aprobado",
    createdAt: "2026-05-23T15:04:00Z",
    tag: "Good Vibes",
    isFeatured: true
  },
  {
    id: "post-3",
    authorId: "user-ana",
    authorName: "Ana Camila Gómez",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    location: "Nevado de Toluca, EdoMex",
    likesCount: 95,
    title: "La caminata fue pesada a más de 4,000 metros de altura pero miren esta recompensa helada. El cráter del Nevado de Toluca vigilándonos. ❄️🗻",
    status: "Pendiente",
    createdAt: "2026-05-26T21:40:00Z",
    tag: "Aventura",
    isFeatured: false
  },
  {
    id: "post-4",
    authorId: "user-luis",
    authorName: "Luis Fernando Torres",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800",
    location: "Tulum, Quintana Roo",
    likesCount: 420,
    title: "Una joya arqueológica frente al mar turquesa del Caribe. El Castillo de Tulum brilla con el sol de la mañana.",
    status: "Aprobado",
    createdAt: "2026-05-21T18:30:00Z",
    tag: "Playa",
    isFeatured: true
  }
];

export const DUMMY_PAYMENTS: Payment[] = [
  {
    id: "pay-101",
    merchantName: "EcoTours Chiapas Premium",
    serviceName: "Expedición Selva Lacandona y Yaxchilán",
    amount: 3200,
    fee: 480, // 15%
    incentiveContribution: 96, // 20% of fee
    payoutNet: 2720,
    status: "Completado",
    createdAt: "2026-05-24T10:00:00Z"
  },
  {
    id: "pay-102",
    merchantName: "Glamping Domos Valle de Bravo",
    serviceName: "Hospedaje Domo Geodésico Estelar",
    amount: 5500,
    fee: 825, // 15%
    incentiveContribution: 165, // 20% Of fee
    payoutNet: 4675,
    status: "Pendiente",
    createdAt: "2026-05-25T11:30:00Z"
  },
  {
    id: "pay-103",
    merchantName: "Aventura Huasteca Potosina",
    serviceName: "Salto de Cascadas y Rafting Río Micos",
    amount: 1800,
    fee: 270,
    incentiveContribution: 54,
    payoutNet: 1530,
    status: "Completado",
    createdAt: "2026-05-22T09:45:00Z"
  },
  {
    id: "pay-104",
    merchantName: "La Paz Good Vibes Marine Adventures",
    serviceName: "Nado con Tiburon Ballena & Balandra Bay",
    amount: 4500,
    fee: 675,
    incentiveContribution: 135,
    payoutNet: 3825,
    status: "Pendiente",
    createdAt: "2026-05-26T14:10:00Z"
  }
];

export const DUMMY_PROMOS: Promo[] = [
  {
    id: "promo-201",
    providerName: "EcoTours Chiapas Premium",
    promoText: "¡20% de descuento en la expedición de Cañón del Sumidero usando el cupón SUMIDERO2026! Cupos reducidos para preservar el santuario.",
    targetSubscription: "viajeros frecuentes",
    discountRate: 20,
    clicksCount: 172,
    channel: "Push simulado",
    status: "Activo",
    createdAt: "2026-05-24T16:00:00Z"
  },
  {
    id: "promo-202",
    providerName: "Glamping Domos Valle de Bravo",
    promoText: "Reserva de domingo a jueves y llévate gratis una canasta de fogata mágica con bombones. Código: VALLESTAR.",
    targetSubscription: "mochipuntos",
    discountRate: 15,
    clicksCount: 94,
    channel: "Feed",
    status: "Activo",
    createdAt: "2026-05-25T18:22:00Z"
  },
  {
    id: "promo-203",
    providerName: "La Paz Good Vibes Marine Adventures",
    promoText: "10% de descuento directo en el avistamiento de ballenas canjeando 100 MochiPuntos.",
    targetSubscription: "all",
    discountRate: 10,
    clicksCount: 341,
    channel: "Editorial",
    status: "Activo",
    createdAt: "2026-05-20T12:00:00Z"
  }
];

export const DUMMY_PACKAGES: Package[] = [
  {
    id: "pkg-1",
    name: "Good Vibes La Paz Completo",
    destination: "La Paz, Baja California Sur",
    durationDays: 4,
    travelerType: "Aventurero / Playa",
    budgetRange: "Premium",
    interests: ["Naturaleza", "Fotografía", "Aventura Marítima"],
    servicesIncluded: ["Paseo en bote", "Nado guiado tiburón ballena", "Almuerzo regional en Balandra"],
    providersIncluded: ["La Paz Good Vibes Marine Adventures", "Sabores del Puerto BCS"],
    priceEstimate: 6200,
    comissionCalculated: 930,
    incentiveAwarded: 150,
    status: "Activo",
    createdAt: "2026-04-15T12:00:00Z"
  },
  {
    id: "pkg-2",
    name: "Aventura Maya Esmeralda",
    destination: "Palenque, Chiapas",
    durationDays: 3,
    travelerType: "Mochilero / Cultural",
    budgetRange: "Económico",
    interests: ["Arqueología", "Selva", "Senderismo"],
    servicesIncluded: ["Entrada a pirámides Palenque", "Guía lacandón", "Cabaña rústica"],
    providersIncluded: ["EcoTours Chiapas Premium", "Cabañas Chamula"],
    priceEstimate: 2900,
    comissionCalculated: 435,
    incentiveAwarded: 100,
    status: "Activo",
    createdAt: "2026-05-01T10:30:00Z"
  },
  {
    id: "pkg-3",
    name: "Escapada Familiar Bosques de Bravo",
    destination: "Valle de Bravo, EdoMex",
    durationDays: 3,
    travelerType: "Familiar / Relajación",
    budgetRange: "Medio",
    interests: ["Bosque", "Vela", "Gastronomía"],
    servicesIncluded: ["Hospedaje domo geodésico", "Renta de kayak", "Cena fogata"],
    providersIncluded: ["Glamping Domos Valle de Bravo"],
    priceEstimate: 4800,
    comissionCalculated: 720,
    incentiveAwarded: 120,
    status: "Borrador",
    createdAt: "2026-05-20T17:00:00Z"
  }
];

export const DUMMY_REWARDS: RewardTransaction[] = [
  {
    id: "rw-1",
    userId: "user-ana",
    userName: "Ana Camila Gómez",
    pointsAmount: 100,
    operationType: "Suma",
    descriptionType: "Reservar aventura",
    createdAt: "2026-05-24T10:15:00Z"
  },
  {
    id: "rw-2",
    userId: "user-mariana",
    userName: "Mariana del Río",
    pointsAmount: 150,
    operationType: "Suma",
    descriptionType: "Recomendar amigo",
    createdAt: "2026-05-25T11:45:00Z"
  },
  {
    id: "rw-3",
    userId: "user-ana",
    userName: "Ana Camila Gómez",
    pointsAmount: -200,
    operationType: "Canje",
    descriptionType: "Canje descuento",
    createdAt: "2026-05-26T16:00:00Z"
  },
  {
    id: "rw-4",
    userId: "user-mariana",
    userName: "Mariana del Río",
    pointsAmount: 300,
    operationType: "Suma",
    descriptionType: "Completar ruta",
    createdAt: "2026-05-26T18:30:00Z"
  }
];

export const DUMMY_INCENTIVE_CAMPAIGNS: IncentiveCampaign[] = [
  {
    id: "camp-01",
    name: "Regresa a La Paz Veraniego",
    objective: "Reactivar mochileros que visitaron BCS hace más de 60 días ofreciendo bonificación para hospedajes",
    allocatedAmount: 15000,
    targetAudience: "Viajeros frecuentes con interés veraniego",
    incentiveType: "MochiPuntos extra",
    status: "Activo",
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    description: "Cada reserva en el paquete Good Vibes La Paz otorga 150 MochiPuntos adicionales financiados en un 50% por el fondo corporativo de conectividad corporativa Mochilapp.",
    resultsSimulatedClicks: 215
  },
  {
    id: "camp-02",
    name: "Sabor de Cuachalán & Localidades",
    objective: "Impulsar ventas de pequeños prestadores de comida tradicional en pueblos originarios",
    allocatedAmount: 8000,
    targetAudience: "Usuarios interesados en turismo gastronómico y herencia local",
    incentiveType: "Cupón de descuento",
    status: "Activo",
    startDate: "2026-05-15",
    endDate: "2026-06-30",
    description: "Cupón de descuento directo de $150 MXN aplicable exclusivamente en restaurantes comunitarios verificados con estatus de cooperativa.",
    resultsSimulatedClicks: 88
  },
  {
    id: "camp-03",
    name: "Fondo Primavera Aventura",
    objective: "Fomentar el ecoturismo de bajo impacto ambiental en la Huasteca y Sierras",
    allocatedAmount: 25000,
    targetAudience: "Todos los mochileros registrados",
    incentiveType: "Apoyo conectividad local",
    status: "Borrador",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    description: "Créditos de gasolina y transporte local para viajeros que cumplan con la ruta de 3 hospedajes sustentables consecutivos.",
    resultsSimulatedClicks: 0
  }
];
