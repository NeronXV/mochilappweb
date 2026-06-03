/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Editor';
  status: 'active' | 'suspended';
}

export interface MochilaUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Viajero' | 'Proveedor' | 'Cliente destacado';
  status: 'active' | 'suspended' | 'pending' | 'verified';
  createdAt: string;
  mochiPuntos: number;
  passportLevel: 'Explorador' | 'Mochilero' | 'Aventurero' | 'Embajador Local' | 'Viajero Legendario';
}

export interface Provider {
  id: string;
  merchantName: string;
  responsibleName: string;
  category: 'tour' | 'restaurante' | 'hospedaje' | 'transporte' | 'experiencia local' | 'actividad cultural' | 'aventura';
  location: string;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Unificado';
  rating: number;
  salesCalculated: number;
  commissionAccumulated: number;
  verificationDocName: string;
  isRecommended: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  imageUrl: string;
  location: string;
  likesCount: number;
  title: string;
  status: 'Pendiente' | 'Aprobado';
  createdAt: string;
  tag: 'Playa' | 'Aventura' | 'Gastronomía' | 'Pueblo' | 'Naturaleza' | 'Familiar' | 'Good Vibes';
  isFeatured: boolean;
}

export interface Payment {
  id: string;
  merchantName: string;
  serviceName: string;
  amount: number; // Overall mxn price booking
  fee: number; // 15% Mochilapp Fee
  incentiveContribution: number; // 20% of Fee directed to Incentive campaigns
  payoutNet: number; // clean income to Provider
  status: 'Pendiente' | 'Completado' | 'En revisión';
  createdAt: string;
}

export interface Promo {
  id: string;
  providerName: string;
  promoText: string;
  targetSubscription: 'promos' | 'feed_updates' | 'all' | 'viajeros frecuentes' | 'mochipuntos' | 'playa' | 'aventura' | 'prestadores';
  discountRate: number;
  clicksCount: number;
  channel: 'Feed' | 'Push simulado' | 'Editorial' | 'Redes' | 'all';
  status: 'Activo' | 'Pausado' | 'Vencido';
  createdAt: string;
}

export interface Package {
  id: string;
  name: string;
  destination: string;
  durationDays: number;
  travelerType: string;
  budgetRange: 'Económico' | 'Medio' | 'Premium';
  interests: string[];
  servicesIncluded: string[];
  providersIncluded: string[];
  priceEstimate: number;
  comissionCalculated: number; // 15% comision
  incentiveAwarded: number; // MochiPuntos won on reservation
  status: 'Borrador' | 'Activo' | 'Pausado';
  createdAt: string;
}

export interface Itinerary {
  id: string;
  packageName: string;
  destination: string;
  days: {
    day: number;
    title: string;
    activities: string[];
  }[];
  createdAt: string;
}

export interface RewardAccount {
  userId: string;
  userName: string;
  currentBalance: number;
  level: MochilaUser['passportLevel'];
  lastUpdated: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  userName: string;
  pointsAmount: number;
  operationType: 'Suma' | 'Canje';
  descriptionType: 'Reservar aventura' | 'Calificar cabaña' | 'Subir post aprobado' | 'Recomendar amigo' | 'Completar ruta' | 'Canje descuento' | 'Crédito' | 'Incentivo manual';
  createdAt: string;
}

export interface IncentiveCampaign {
  id: string;
  name: string;
  objective: string;
  allocatedAmount: number; // in MXN
  targetAudience: string;
  incentiveType: 'MochiPuntos extra' | 'Cupón de descuento' | 'Crédito reserva' | 'Beneficio cliente frecuente' | 'Apoyo conectividad local' | 'Campaña de temporada';
  status: 'Borrador' | 'Activo' | 'Pausado' | 'Finalizado';
  startDate: string;
  endDate: string;
  description: string;
  resultsSimulatedClicks: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface AiMessage {
  id: string;
  sender: 'admin' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'create_package' | 'create_campaign' | 'approve_post' | 'create_promo';
    payload: any;
  };
}
