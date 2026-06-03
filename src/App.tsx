/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Users, Store, ImageIcon, Sparkles, Map, Award, Megaphone, CreditCard, Gift, LogOut,
  Search, Plus, Trash2, CheckCircle, Clock, X, MapPin, Heart, Smartphone, Bell, RefreshCw, Sliders,
  UserPlus, AlertTriangle, Check, Wifi, Battery, DollarSign, ChevronRight, Info, Send, Star, FileText
} from 'lucide-react';

import { firebaseEnabled } from './firebase';
import { 
  subscribeUsers, 
  subscribeServices, 
  subscribeBookings,
  subscribePosts,
  subscribePromos,
  subscribeComments,
  subscribeReviews,
  updateServiceVerification,
  updateServiceRecommendation,
  updateServiceVisibility,
  updateBookingStatus,
  createPromo,
  approvePostById,
  deletePostById,
  getAdminDoc,
  createAdminDoc,
  loginWithEmail,
  logout
} from './firebase/services';

import { MochilaUser, Provider, Post, Payment, Promo, Package, RewardTransaction, IncentiveCampaign, Toast, AiMessage } from './types';
import { 
  DUMMY_USERS, DUMMY_PROVIDERS, DUMMY_POSTS, DUMMY_PAYMENTS, 
  DUMMY_PROMOS, DUMMY_PACKAGES, DUMMY_REWARDS, DUMMY_INCENTIVE_CAMPAIGNS 
} from './dummyData';

import LoginScreen from './features/auth/components/LoginScreen';
import AdminLayout from './features/dashboard/components/AdminLayout';
import DashboardScreen from './features/dashboard/screens/DashboardScreen';
import UsersScreen from './features/users/screens/UsersScreen';
import ServicesScreen from './features/services/screens/ServicesScreen';
import FeedModerationScreen from './features/feed/screens/FeedModerationScreen';
import PromosScreen from './features/promos/screens/PromosScreen';
import BookingsScreen from './features/bookings/screens/BookingsScreen';
import AiCopilotScreen from './features/ai/screens/AiCopilotScreen';
import PackagesScreen from './features/packages/screens/PackagesScreen';
import PassportScreen from './features/passport/screens/PassportScreen';
import IncentivesScreen from './features/incentives/screens/IncentivesScreen';
import { calculateCommission, calculateIncentiveContribution } from './shared/utils/commissionUtils';
import { isPaidBooking } from './shared/utils/bookingUtils';

export default function App() {
  // --- STATE SYSTEM ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'users' | 'providers' | 'feed' | 'ai' | 'packages' | 'passport' | 'editorial' | 'payouts' | 'incentives'
  >('dashboard');

  // Credentials
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  // Entities state lists
  const [users, setUsers] = useState<MochilaUser[]>(DUMMY_USERS);
  const [providers, setProviders] = useState<Provider[]>(DUMMY_PROVIDERS);
  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS);
  const [payments, setPayments] = useState<Payment[]>(DUMMY_PAYMENTS);
  const [promos, setPromos] = useState<Promo[]>(DUMMY_PROMOS);
  const [packages, setPackages] = useState<Package[]>(DUMMY_PACKAGES);
  const [campaigns, setCampaigns] = useState<IncentiveCampaign[]>(DUMMY_INCENTIVE_CAMPAIGNS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  // Local modes
  const [usingLocalFallback, setUsingLocalFallback] = useState(!firebaseEnabled);

  // Search & Filters
  const [userQuery, setUserQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | 'Admin' | 'Viajero' | 'Proveedor' | 'Cliente destacado'>('All');
  const [selectedProviderForAnalysis, setSelectedProviderForAnalysis] = useState<Provider | null>(DUMMY_PROVIDERS[0]);

  // Modals / AI Prompts In-App
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // AI Description Boost Helper Session
  const [boostingPostId, setBoostingPostId] = useState<string | null>(null);
  const [boostedText, setBoostedText] = useState('');

  // Real Firestore read-only collections state
  const [comments, setComments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // AI Assistant Copilot state
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: '¡Hola, Pedro! Soy MochiCopilot 🧗‍♂️, tu asistente comercial de IA. Puedo ayudarte a componer paquetes turísticos, redactar copias editoriales de redes sociales, crear campañas o evaluar prestadores.',
      timestamp: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatIn, setChatIn] = useState('');

  // Package Form States
  const [pkgName, setPkgName] = useState('');
  const [pkgDest, setPkgDest] = useState('');
  const [pkgDays, setPkgDays] = useState(3);
  const [pkgBudget, setPkgBudget] = useState<'Económico' | 'Medio' | 'Premium'>('Medio');
  const [pkgPrice, setPkgPrice] = useState(4500);

  // Promotional Editorial builder states
  const [promoName, setPromoName] = useState('');
  const [promoMerchant, setPromoMerchant] = useState('EcoTours Chiapas');
  const [promoTarget, setPromoTarget] = useState<'all' | 'viajeros frecuentes' | 'mochipuntos'>('all');
  const [promoRate, setPromoRate] = useState(15);
  const [simulatedNotify, setSimulatedNotify] = useState<{ title: string; body: string; active: boolean } | null>(null);

  // Campaign builder states
  const [campName, setCampName] = useState('');
  const [campType, setCampType] = useState<IncentiveCampaign['incentiveType']>('MochiPuntos extra');
  const [campAmount, setCampAmount] = useState(12000);
  const [campDesc, setCampDesc] = useState('');

  // --- FLOATING TOASTS HANDLER ---
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- LIVE SYSTEM CLOCK ---
  useEffect(() => {
    const tick = () => {
      setCurrentTime(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- FIRESTORE SYNCHRONIZATION ---
  useEffect(() => {
    if (!firebaseEnabled) {
      setUsingLocalFallback(true);
      return;
    }

    try {
      const unsubUsers = subscribeUsers(uList => {
        setUsers(uList);
        setUsingLocalFallback(false);
      }, err => {
        console.error("Users sync error:", err);
      });

      // Mapea la colección real 'services' al módulo visual de Prestadores
      const unsubServices = subscribeServices(serviceList => {
        setProviders(serviceList);
      }, err => {
        console.error("Services sync error:", err);
      });

      const unsubPosts = subscribePosts(postsList => {
        setPosts(postsList);
      }, err => {
        console.error("Posts sync error:", err);
      });

      // Mapea la colección real 'bookings' al módulo visual de pagos
      const unsubBookings = subscribeBookings(bookingsList => {
        setPayments(bookingsList);
      }, err => {
        console.error("Bookings sync error:", err);
      });

      const unsubPromos = subscribePromos(promosList => {
        setPromos(promosList);
      }, err => {
        console.error("Promos sync error:", err);
      });

      // Colecciones reales de solo lectura agregadas
      const unsubComments = subscribeComments(commentsList => {
        setComments(commentsList);
      }, err => {
        console.error("Comments sync error:", err);
      });

      const unsubReviews = subscribeReviews(reviewsList => {
        setReviews(reviewsList);
      }, err => {
        console.error("Reviews sync error:", err);
      });

      return () => {
        unsubUsers();
        unsubServices();
        unsubPosts();
        unsubBookings();
        unsubPromos();
        unsubComments();
        unsubReviews();
      };
    } catch (e) {
      console.warn("Firestore listeners error:", e);
      setUsingLocalFallback(true);
    }
  }, []);

  // --- AUTENTICACIÓN LOGIN ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSigningIn(true);

    if (!firebaseEnabled) {
      setLoginError("Credenciales inválidas. El servicio no está disponible en este momento.");
      setSigningIn(false);
      return;
    }

    try {
      const userCred = await loginWithEmail(loginEmail, loginPassword);
      
      // Consultar admins/{uid} para comprobar estatus de administrador
      const adminData = await getAdminDoc(userCred.user.uid);

      if (!adminData || adminData.active !== true) {
        await logout();
        setLoginError("No tienes permisos de administrador.");
        showToast("No tienes permisos de administrador", "error");
        setSigningIn(false);
        return;
      }

      setCurrentUser({
        id: userCred.user.uid,
        name: adminData.name || userCred.user.displayName || 'Pedro Valenzuela',
        email: userCred.user.email,
        role: 'Super Admin'
      });
      showToast("Ingreso exitoso mediante Firebase Secure Connection.", "success");
    } catch (err: any) {
      setLoginError(err.message || 'Error al conectar con la base de datos.');
      showToast("Fallo de acceso, compruebe credenciales.", "error");
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogOut = async () => {
    if (firebaseEnabled) {
      await logout();
    }
    setCurrentUser(null);
    showToast("Sesión cerrada.", "info");
  };

  // --- MOCHI ACTIONS ---
  const toggleUserStatus = async (user: MochilaUser) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    if (!usingLocalFallback && firebaseEnabled) {
      // In active Firestore phase, we do not modify users (ReadOnly users)
      showToast("Modo producción: Suspensión de usuarios desactivada.", "warning");
    } else {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
      showToast(`[Demo] Cuenta de ${user.name} cambiada a ${nextStatus}`, 'success');
    }
  };

  const deleteUser = async (uId: string) => {
    if (!usingLocalFallback && firebaseEnabled) {
      // In active Firestore phase, we do not delete users
      showToast("Modo producción: Eliminación de usuarios desactivada.", "warning");
    } else {
      setUsers(prev => prev.filter(u => u.id !== uId));
      showToast("[Demo] Usuario removido de la memoria.", 'success');
    }
  };

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;

    const newAdId = 'adm-' + Math.random().toString(36).substring(2, 7);

    if (!usingLocalFallback && firebaseEnabled) {
      try {
        await createAdminDoc(newAdId, newAdminName, newAdminEmail);
        showToast(`Admin ${newAdminName} guardado en colección admins.`, 'success');
      } catch (err: any) {
        showToast(`Error al guardar admin en Firestore: ${err.message}`, 'error');
      }
    } else {
      const newAd: MochilaUser = {
        id: newAdId,
        name: newAdminName,
        email: newAdminEmail,
        role: 'Admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        mochiPuntos: 0,
        passportLevel: 'Explorador'
      };
      setUsers(p => [newAd, ...p]);
      showToast(`[Demo] Admin ${newAd.name} registrado localmente.`, 'success');
    }

    setNewAdminName('');
    setNewAdminEmail('');
    setShowAddAdmin(false);
  };

  const awardPoints = (userId: string, pts: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const after = u.mochiPuntos + pts;
        let lv = u.passportLevel;
        if (after > 2000) lv = 'Viajero Legendario';
        else if (after > 1200) lv = 'Embajador Local';
        else if (after > 700) lv = 'Aventurero';
        else if (after > 300) lv = 'Mochilero';
        showToast(`Otorgados +${pts} MochiPuntos a ${u.name}.`, 'success');
        return { ...u, mochiPuntos: Math.max(0, after), passportLevel: lv };
      }
      return u;
    }));
  };

  const updateProviderStatus = async (id: string, next: 'Aprobado' | 'Rechazado') => {
    const isVerified = next === 'Aprobado';
    if (!usingLocalFallback && firebaseEnabled && db) {
      try {
        await updateServiceVerification(id, isVerified);
        showToast(isVerified ? "Servicio aprobado/verificado exitosamente." : "Servicio marcado como no verificado.", 'success');
      } catch (err: any) {
        showToast(`Error al actualizar Firestore: ${err.message}`, 'error');
      }
    } else {
      setProviders(prev => prev.map(p => p.id === id ? { ...p, status: next } : p));
      showToast(`Proveedor actualizado localmente a: ${next}`, 'success');
    }
  };

  const toggleProviderRecommended = async (id: string) => {
    const p = providers.find(item => item.id === id);
    if (!p) return;
    const nextRecommended = !p.isRecommended;
    if (!usingLocalFallback && firebaseEnabled && db) {
      try {
        await updateServiceRecommendation(id, nextRecommended);
        showToast(nextRecommended ? "Servicio destacado/recomendado!" : "Recomendación del servicio eliminada.", 'info');
      } catch (err: any) {
        showToast(`Error al actualizar Firestore: ${err.message}`, 'error');
      }
    } else {
      setProviders(prev => prev.map(item => item.id === id ? { ...item, isRecommended: nextRecommended } : item));
      showToast(nextRecommended ? "Proveedor recomendado destacado localmente!" : "Recomendación eliminada localmente.", 'info');
    }
  };

  const toggleServiceVisibility = async (id: string, currentVisible: boolean) => {
    const nextVisible = !currentVisible;
    if (!usingLocalFallback && firebaseEnabled && db) {
      try {
        await updateServiceVisibility(id, nextVisible);
        showToast(nextVisible ? "Servicio ahora es visible (soft restore)." : "Servicio ocultado (soft delete).", 'success');
      } catch (err: any) {
        showToast(`Error al actualizar Firestore: ${err.message}`, 'error');
      }
    } else {
      setProviders(prev => prev.map(item => item.id === id ? { ...item, isVisible: nextVisible } as any : item));
      showToast(nextVisible ? "Servicio visible localmente." : "Servicio oculto localmente.", 'success');
    }
  };

  const approvePost = async (id: string) => {
    if (!usingLocalFallback && firebaseEnabled && db) {
      try {
        await approvePostById(id);
        showToast("Post de mochilero aprobado satisfactoriamente.", "success");
      } catch (err: any) {
        showToast(`Error al actualizar post: ${err.message}`, "error");
      }
    } else {
      setPosts(p => p.map(pst => pst.id === id ? { ...pst, status: 'Aprobado' } : pst));
      showToast("Post de mochilero aprobado satisfactoriamente.", "success");
    }
  };

  const deletePost = async (id: string) => {
    if (!usingLocalFallback && firebaseEnabled && db) {
      try {
        await deletePostById(id);
        showToast("Publicación bloqueada y removida de feed.", "warning");
      } catch (err: any) {
        showToast(`Error al borrar post: ${err.message}`, "error");
      }
    } else {
      setPosts(prev => prev.filter(p => p.id !== id));
      showToast("Publicación bloqueada y removida de feed.", "warning");
    }
  };

  // Mapeo de ventas acumuladas por prestador/servicio en base a reservas reales
  const mappedProviders = useMemo(() => {
    return providers.map(p => {
      // Filtrar reservas que pertenezcan a este servicio
      const serviceBookings = payments.filter(b => b.serviceId === p.id);
      const salesCalculated = serviceBookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
      const commissionAccumulated = calculateCommission(salesCalculated);
      return {
        ...p,
        salesCalculated,
        commissionAccumulated
      };
    });
  }, [providers, payments]);

  // Mapeo de bookings para compatibilidad visual de nombres de servicios
  const mappedPayments = useMemo(() => {
    return payments.map(pay => {
      const service = providers.find(s => s.id === pay.serviceId);
      return {
        ...pay,
        merchantName: service?.responsibleName || 'Socio Desconocido',
        serviceName: service?.merchantName || 'Servicio Desconocido',
        amount: Number(pay.totalPrice || 0),
        status: pay.status || 'PENDING',
        createdAt: pay.date || new Date().toISOString()
      };
    });
  }, [payments, providers]);

  // --- COMPUTE KPIs ---
  const calculatedStats = useMemo(() => {
    const totalUsers = users.length;
    const activeProviders = providers.filter(p => p.status === 'Aprobado').length;
    const reviewsPending = posts.filter(p => p.status === 'Pendiente').length + providers.filter(p => p.status === 'Pendiente').length;
    
    let totalSales = payments.reduce((sum, p) => isPaidBooking(p.status || '') ? sum + (p.totalPrice || 0) : sum, 0);
    let totalComision = calculateCommission(totalSales);
    let poolIncentivos = calculateIncentiveContribution(totalComision);

    return {
      totalUsers,
      activeProviders,
      reviewsPending,
      totalSales,
      totalComision,
      poolIncentivos,
      activePackages: packages.filter(p => p.status === 'Activo').length
    };
  }, [users, providers, posts, payments, packages]);

  // --- FILTERED TABLES ---
  const filteredUsersList = useMemo(() => {
    return users.filter(u => {
      const criteria = u.name.toLowerCase().includes(userQuery.toLowerCase()) || 
                       u.email.toLowerCase().includes(userQuery.toLowerCase()) || 
                       u.id.toLowerCase().includes(userQuery.toLowerCase());
      if (userRoleFilter === 'All') return criteria;
      return criteria && u.role === userRoleFilter;
    });
  }, [users, userQuery, userRoleFilter]);

  // --- IA CO-PILOT ACTIONS ---
  const runAiCommand = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: AiMessage = {
      id: Math.random().toString(),
      sender: 'admin',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages(prev => [...prev, userMsg]);
    setChatIn('');

    setTimeout(() => {
      let responseText = "Entendido Pedro, estoy procesando el contexto mochilero... [Mapeando prestadores locales].";
      
      const textLower = promptText.toLowerCase();
      if (textLower.includes('itinerario') || textLower.includes('crear')) {
        responseText = `🤖 [Sugerencia IA para Nuevo Paquete]
Paquete sugerido: "Good Vibes La Paz Salvaje"
Destino: La Paz, BCS
Incentivo Recomendado: 150 MochiPuntos por reserva.
Día 1: Arribo al puerto, recorrido por el malecón histórico y cena comunitaria en "Sabores del Puerto BCS".
Día 2: Expedición marítima guiada con nado de Tiburón Ballena mediante el prestador aprobado "La Paz Good Vibes Marine Adventures". Almuerzo regional en playa Balandra.
Día 3: Senderismo natural al amanecer, mercadito de artesanía local y café de despedida.

Comisión Mochilapp calculada: 15%. Este paquete es altamente rentable e impulsa 2 prestadores locales aprobados.`;
      } else if (textLower.includes('promocion') || textLower.includes('descuento')) {
        responseText = `🎯 [Campaña de Fidelización Recomendada]
Campaña: "Exploradores del Desierto"
Presupuesto sugerido: $12,500 MXN del fondo acumulado.
Plan: Otorgar un cupón de 15% de crédito directo en tours comunitarios a cualquier mochilero que registre 2 post aprobados de pueblos mágicos en las últimas 4 semanas.`;
      } else if (textLower.includes('copy') || textLower.includes('redes')) {
        responseText = `📱 [Contenido para Instagram / Facebook]
"¿Listo para desconectarte? 🎒 Descubre la magia oculta de la costa de Baja California de la mano de verdaderos guías locales. Nado con fauna marina majestuosa, playas vírgenes y gastronomía campestre auténtica. Todo respaldado por prestadores locales en Mochilapp. 🌊✨ #AutenticoMochilazo #Mochilapp"`;
      } else {
        responseText = `Perfecto Super Admin. Basado en los datos, sugiero incentivar a los prestadores de Chiapas y Baja California Sur con buenas calificaciones (4.5+) ofreciéndoles créditos parciales de combustible del Fondo de Incentivos Turísticos de Mochilapp para bajar el costo base del turista.`;
      }

      const aiMsg: AiMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
      };
      setAiMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  // --- IA DESCRIPTION IMPROVER SIMULATION ---
  const improvePostDescriptionDesc = (post: Post) => {
    setBoostingPostId(post.id);
    const words = ["espectacular", "fascinante", "mágico", "secreto", "natural", "único"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const text = `✨ [Boosteado por Mochilapp IA] ✨\nDescubre el rincón más ${randomWord} de ${post.location}. "Amaneciendo con la brisa fresca rodeado de una atmósfera ancestral. Una aventura única recomendada por la comunidad mochilera que impulsa el turismo regenerativo local. 🎒🌿"`;
    setBoostedText(text);
  };

  const acceptBoostedDescription = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, title: boostedText } : p));
    showToast("Descripción mejorada y aplicada con éxito.", "success");
    setBoostingPostId(null);
  };

  // --- MANUAL FORM ACTIONS ---
  const handleCreatePackage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pkgName || !pkgDest) {
      showToast("Por favor complete nombre y destino del paquete.", "warning");
      return;
    }
    const newPkg: Package = {
      id: 'pkg-' + Math.random().toString(36).substring(2, 6),
      name: pkgName,
      destination: pkgDest,
      durationDays: pkgDays,
      travelerType: 'Aventurero',
      budgetRange: pkgBudget,
      interests: ['Aventura', 'Cultura'],
      servicesIncluded: ['Guía local', 'Transporte comunitario'],
      providersIncluded: ['Varios prestadores locales'],
      priceEstimate: pkgPrice,
      comissionCalculated: pkgPrice * 0.15,
      incentiveAwarded: Math.round(pkgPrice * 0.03),
      status: 'Activo',
      createdAt: new Date().toISOString()
    };
    setPackages(prev => [newPkg, ...prev]);
    showToast(`Paquete "${newPkg.name}" publicado existosamente.`, "success");
    setPkgName('');
    setPkgDest('');
  };

  const generatePackageIa = () => {
    setPkgName("Travesía Sierra y Playas");
    setPkgDest("La Paz y Los Cabos, BCS");
    setPkgDays(4);
    setPkgBudget("Premium");
    setPkgPrice(7500);
    showToast("Campos rellenados inteligentemente con IA. Haz clic en Crear Paquete.", "info");
  };

  const createIncentiveCampaign = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!campName || !campDesc) {
      showToast("Complementa los campos de campaña.", "warning");
      return;
    }
    const newC: IncentiveCampaign = {
      id: 'camp-' + Math.random().toString(36).substring(2, 6),
      name: campName,
      objective: 'Fomentar visitas e impacto',
      allocatedAmount: campAmount,
      targetAudience: 'Mochileros frecuentes',
      incentiveType: campType,
      status: 'Activo',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      description: campDesc,
      resultsSimulatedClicks: 0
    };
    setCampaigns(prev => [newC, ...prev]);
    showToast(`Campaña de Incentivo "${newC.name}" creada.`, 'success');
    setCampName('');
    setCampDesc('');
  };

  const suggestIncentiveCampIa = () => {
    setCampName("Incentivo Conectividad Oaxaqueña");
    setCampType("Crédito reserva");
    setCampAmount(18000);
    setCampDesc("Otorga $300 MXN de descuento subvencionado en cualquier restaurante comunitario verificado de los valles centrales de Oaxaca para mochileros con nivel mayor a Mochilero.");
    showToast("Estructura de campaña generada con IA.", "info");
  };

  const handlePublishPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName) return;

    // Usar campos compatibles con el modelo móvil Kotlin:
    // companyName (string), content (string), discount (string), timestamp (Long Unix epoch)
    const companyNameVal = String(promoMerchant || '').trim();
    const contentVal = String(promoName || '').trim();
    const discountVal = String(promoRate || '0') + '%';
    const timestampVal = Date.now(); // Long en milisegundos

    if (!usingLocalFallback && firebaseEnabled && db) {
      try {
        await createPromo(companyNameVal, contentVal, discountVal, timestampVal);
        showToast("Promoción guardada en Firestore y transmitida.", 'success');
      } catch (err: any) {
        showToast(`Error al guardar promoción en Firestore: ${err.message}`, 'error');
      }
    } else {
      const newPr: Promo = {
        id: 'prm-' + Math.random().toString(36).substring(2, 6),
        providerName: promoMerchant,
        promoText: promoName,
        targetSubscription: 'all',
        discountRate: promoRate,
        clicksCount: 0,
        channel: 'Push simulado',
        status: 'Activo',
        createdAt: new Date().toISOString()
      };
      setPromos(prev => [newPr, ...prev]);
      showToast("Promoción creada localmente y transmitida.", 'success');
    }

    setSimulatedNotify({
      title: `${promoMerchant} ★ ¡Descuento!`,
      body: promoName,
      active: true
    });

    setTimeout(() => {
      setSimulatedNotify(null);
    }, 7000);

    setPromoName('');
  };

  const releasePayment = async (payId: string) => {
    if (!usingLocalFallback && firebaseEnabled && db) {
      try {
        await updateBookingStatus(payId, 'PAID');
        showToast("Fondos aprobados y estado de reserva actualizado a PAID.", "success");
      } catch (err: any) {
        showToast(`Error al actualizar en Firestore: ${err.message}`, "error");
      }
    } else {
      setPayments(prev => prev.map(p => p.id === payId ? { ...p, status: 'PAID' } : p));
      showToast("Fondos aprobados localmente.", "success");
    }
  };

  // --- MODULE CONNECTIVITY BADGE HELPER ---
  const getModuleStatusBadge = () => {
    const isDemoOnlyModule = ['packages', 'passport', 'ai', 'incentives'].includes(activeTab);
    
    if (isDemoOnlyModule) {
      return (
        <span className="text-[10px] font-extrabold py-1 px-3 bg-amber-50 border border-amber-255 text-amber-700 rounded-full tracking-wide uppercase select-none flex items-center gap-1">
          ⚠️ Módulo en modo demo / próximo desarrollo
        </span>
      );
    }
    
    if (usingLocalFallback) {
      return (
        <span className="text-[10px] font-extrabold py-1 px-3 bg-orange-50 border border-orange-255 text-orange-700 rounded-full tracking-wide uppercase select-none flex items-center gap-1">
          🤖 Datos simulados
        </span>
      );
    } else {
      return (
        <span className="text-[10px] font-extrabold py-1 px-3 bg-emerald-50 border border-emerald-255 text-emerald-700 rounded-full tracking-wide uppercase select-none flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Firebase Live
        </span>
      );
    }
  };

  // --- DYNAMIC PROVIDER ANALYSIS ENGINE ---
  const selectedProviderAnalysisResult = useMemo(() => {
    if (!selectedProviderForAnalysis) return null;
    const p = selectedProviderForAnalysis;
    const score = p.rating;
    const isFit = score >= 4.5 && p.location.includes("Baja California") && p.status === 'Aprobado';
    return {
      name: p.merchantName,
      location: p.location,
      rating: score,
      priceCategory: p.category === 'hospedaje' ? 'Premium' : 'Medio',
      evaluationText: isFit 
        ? "Excelente socio comercial. Posee valoraciones impecables y su cercanía al turismo de esmeralda lo hace ideal para el Paquete Good Vibes BCS."
        : `Socio confiable en ${p.location}. Puede ser integrado en rutas grupales básicas de aventura regional.`
    };
  }, [selectedProviderForAnalysis]);

  if (!currentUser) {
    return (
      <LoginScreen
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginError={loginError}
        signingIn={signingIn}
        firebaseEnabled={firebaseEnabled}
        toasts={toasts}
        onSubmit={handleLoginSubmit}
      />
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      usersCount={users.length}
      pendingProvidersCount={providers.filter(p => p.status === 'Pendiente').length}
      pendingPostsCount={posts.filter(p => p.status === 'Pendiente').length}
      usingLocalFallback={usingLocalFallback}
      onLogout={handleLogOut}
      firebaseEnabled={firebaseEnabled}
      currentTime={currentTime}
      toasts={toasts}
    >
      {/* ---------------- A: PANEL PRINCIPAL ---------------- */}
      {activeTab === 'dashboard' && (
        <DashboardScreen
          calculatedStats={calculatedStats}
          users={users}
          providers={providers}
          posts={posts}
          payments={payments}
          campaigns={campaigns}
          setActiveTab={setActiveTab}
          showToast={showToast}
        />
      )}

      {/* ---------------- B: GESTIÓN DE USUARIOS ---------------- */}
      {activeTab === 'users' && (
        <UsersScreen
          userQuery={userQuery}
          setUserQuery={setUserQuery}
          userRoleFilter={userRoleFilter}
          setUserRoleFilter={setUserRoleFilter}
          filteredUsersList={filteredUsersList}
          showAddAdmin={showAddAdmin}
          setShowAddAdmin={setShowAddAdmin}
          newAdminName={newAdminName}
          setNewAdminName={setNewAdminName}
          newAdminEmail={newAdminEmail}
          setNewAdminEmail={setNewAdminEmail}
          createAdmin={createAdmin}
          awardPoints={awardPoints}
          toggleUserStatus={toggleUserStatus}
          deleteUser={deleteUser}
          usingLocalFallback={usingLocalFallback}
        />
      )}

        {/* ---------------- C: PRESTADORES TURÍSTICOS ---------------- */}
        {activeTab === 'providers' && (
          <ServicesScreen
            mappedProviders={mappedProviders}
            selectedProviderForAnalysis={selectedProviderForAnalysis}
            setSelectedProviderForAnalysis={setSelectedProviderForAnalysis}
            selectedProviderAnalysisResult={selectedProviderAnalysisResult}
            updateProviderStatus={updateProviderStatus}
            toggleProviderRecommended={toggleProviderRecommended}
            toggleServiceVisibility={toggleServiceVisibility}
            setActiveTab={setActiveTab}
            setPkgDest={setPkgDest}
            showToast={showToast}
          />
        )}

        {/* ---------------- D: MODERACIÓN FEED ---------------- */}
        {activeTab === 'feed' && (
          <FeedModerationScreen
            posts={posts}
            approvePost={approvePost}
            deletePost={deletePost}
            boostingPostId={boostingPostId}
            setBoostingPostId={setBoostingPostId}
            boostedText={boostedText}
            improvePostDescriptionDesc={improvePostDescriptionDesc}
            acceptBoostedDescription={acceptBoostedDescription}
            showToast={showToast}
          />
        )}

        {/* ---------------- E: COPILOTO IA CHAT ---------------- */}
        {activeTab === 'ai' && (
          <AiCopilotScreen
            aiMessages={aiMessages}
            chatIn={chatIn}
            setChatIn={setChatIn}
            runAiCommand={runAiCommand}
            handleCreatePackage={handleCreatePackage}
            showToast={showToast}
          />
        )}

        {/* ---------------- F: PAQUETES E ITINERARIOS ---------------- */}
        {activeTab === 'packages' && (
          <PackagesScreen
            generatePackageIa={generatePackageIa}
            handleCreatePackage={handleCreatePackage}
            pkgName={pkgName}
            setPkgName={setPkgName}
            pkgDest={pkgDest}
            setPkgDest={setPkgDest}
            pkgDays={pkgDays}
            setPkgDays={setPkgDays}
            pkgPrice={pkgPrice}
            setPkgPrice={setPkgPrice}
            pkgBudget={pkgBudget}
            setPkgBudget={setPkgBudget}
            packages={packages}
            setPackages={setPackages}
            showToast={showToast}
          />
        )}

        {/* ---------------- G: PASAPORTE Y MOCHIPUNTOS ---------------- */}
        {activeTab === 'passport' && (
          <PassportScreen
            users={users}
            awardPoints={awardPoints}
          />
        )}

        {/* ---------------- H: EDITORIAL Y PROMOS (CON NOTIFICADOR ANDROID) ---------------- */}
        {activeTab === 'editorial' && (
          <PromosScreen
            promoMerchant={promoMerchant}
            setPromoMerchant={setPromoMerchant}
            promoRate={promoRate}
            setPromoRate={setPromoRate}
            promoTarget={promoTarget}
            setPromoTarget={setPromoTarget}
            promoName={promoName}
            setPromoName={setPromoName}
            handlePublishPromo={handlePublishPromo}
            promos={promos}
            setPromos={setPromos}
            simulatedNotify={simulatedNotify}
            setSimulatedNotify={setSimulatedNotify}
            showToast={showToast}
            usingLocalFallback={usingLocalFallback}
            firebaseEnabled={firebaseEnabled}
          />
        )}

        {/* ---------------- I: CONTROL DE PAGOS Y LIQUIDACIONES ---------------- */}
        {activeTab === 'payouts' && (
          <BookingsScreen
            calculatedStats={calculatedStats}
            mappedPayments={mappedPayments}
            releasePayment={releasePayment}
          />
        )}

        {/* ---------------- J: FONDO DE INCENTIVOS ---------------- */}
        {activeTab === 'incentives' && (
          <IncentivesScreen
            suggestIncentiveCampIa={suggestIncentiveCampIa}
            createIncentiveCampaign={createIncentiveCampaign}
            campName={campName}
            setCampName={setCampName}
            campAmount={campAmount}
            setCampAmount={setCampAmount}
            campType={campType}
            setCampType={setCampType}
            campDesc={campDesc}
            setCampDesc={setCampDesc}
            campaigns={campaigns}
            setCampaigns={setCampaigns}
            showToast={showToast}
          />
        )}
    </AdminLayout>
  );
}
