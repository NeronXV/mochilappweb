/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Wifi, Clock, Store, Calendar, Megaphone, MessageSquare, Anchor } from 'lucide-react';
import { firebaseEnabled } from '../../firebase';
import { loginWithEmail, logout, verifyCompanyRole, getCompanyProfile } from '../../firebase/services/business/businessAuthService';
import { subscribeMyServices, updateMyService } from '../../firebase/services/business/businessServicesService';
import { subscribeMyBookings } from '../../firebase/services/business/businessBookingsService';
import { subscribeMyPromos, createBusinessPromo } from '../../firebase/services/business/businessPromosService';
import { subscribeMyReviews } from '../../firebase/services/business/businessReviewsService';
import { Toast } from '../../types';
import BusinessLoginScreen from '../../features/business/auth/components/BusinessLoginScreen';
import BusinessHomeScreen from '../../features/business/home/screens/BusinessHomeScreen';
import MyServicesScreen from '../../features/business/services/screens/MyServicesScreen';
import MyBookingsScreen from '../../features/business/bookings/screens/MyBookingsScreen';
import MyPromosScreen from '../../features/business/promos/screens/MyPromosScreen';
import MyReviewsScreen from '../../features/business/reviews/screens/MyReviewsScreen';
import { moduleRegistry } from '../../features/business/modules/moduleRegistry';
import ModuleLoader from '../../features/business/modules/components/ModuleLoader';
import ModuleErrorBoundary from '../../features/business/modules/components/ModuleErrorBoundary';
import Toasts from '../../shared/components/Toasts';

export default function BusinessApp() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [activeBusinessTab, setActiveBusinessTab] = useState<string>('home');
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const activeModules = moduleRegistry.filter(mod => mod.isEnabled(services));

  // Toast handler
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Clock tick
  useEffect(() => {
    const tick = () => {
      setCurrentTime(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subscriptions to services, bookings & promos once logged in
  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      setServices([]);
      setBookings([]);
      setPromos([]);
      return;
    }

    setLoadingData(true);

    const unsubscribeServices = subscribeMyServices(
      currentUser.email,
      (data) => {
        setServices(data);
        setLoadingData(false);
      },
      (err) => {
        console.error('Error in services subscription:', err);
        showToast('Error de sincronización de servicios', 'error');
        setLoadingData(false);
      }
    );

    const unsubscribeBookings = subscribeMyBookings(
      currentUser.email,
      (data) => {
        setBookings(data);
      },
      (err) => {
        console.error('Error in bookings subscription:', err);
        showToast('Error de sincronización de reservas', 'error');
      }
    );

    const unsubscribePromos = subscribeMyPromos(
      currentUser.email,
      currentUser.name,
      (data) => {
        setPromos(data);
      },
      (err) => {
        console.error('Error in promos subscription:', err);
        showToast('Error de sincronización de promociones', 'error');
      }
    );

    return () => {
      unsubscribeServices();
      unsubscribeBookings();
      unsubscribePromos();
    };
  }, [currentUser]);

  // Subscription to reviews associated with owned services
  useEffect(() => {
    if (services.length === 0) {
      setReviews([]);
      return;
    }

    const serviceIds = services.map(s => s.id);
    const unsubscribeReviews = subscribeMyReviews(
      serviceIds,
      (data) => {
        setReviews(data);
      },
      (err) => {
        console.error('Error in reviews subscription:', err);
        showToast('Error de sincronización de reseñas', 'error');
      }
    );

    return () => {
      unsubscribeReviews();
    };
  }, [services]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSigningIn(true);

    if (!firebaseEnabled) {
      setLoginError("El servicio de autenticación no está disponible.");
      setSigningIn(false);
      return;
    }

    try {
      const userCred = await loginWithEmail(loginEmail, loginPassword);
      const profile = await getCompanyProfile(userCred.user.uid);

      if (!profile) {
        await logout();
        setLoginError("Este panel es solo para prestadores registrados.");
        showToast("Acceso denegado: Se requiere rol COMPANY", "error");
        setSigningIn(false);
        return;
      }

      setCurrentUser({
        id: profile.uid,
        email: profile.email,
        name: profile.name,
        companyType: profile.companyType
      });
      showToast("Inicio de sesión exitoso.", "success");
      setActiveBusinessTab('home');
    } catch (err: any) {
      setLoginError(err.message || 'Error al autenticar credenciales.');
      showToast("Error de inicio de sesión.", "error");
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

  const handleEditService = async (serviceId: string, data: any) => {
    if (!currentUser || !currentUser.email) return;
    try {
      await updateMyService(serviceId, currentUser.email, data);
      showToast('Servicio actualizado con éxito.', 'success');
    } catch (err: any) {
      console.error('Error updating service:', err);
      showToast(err.message || 'Error al actualizar el servicio.', 'error');
      throw err;
    }
  };

  const handleCreatePromo = async (
    content: string, 
    discount: string,
    serviceId: string,
    discountPercent: number,
    promoCode: string,
    expiresAt: number
  ) => {
    if (!currentUser || !currentUser.email) return;
    try {
      await createBusinessPromo({
        companyName: currentUser.name,
        content,
        discount,
        timestamp: Date.now(),
        ownerEmail: currentUser.email,
        createdByUid: currentUser.id,
        isActive: true,
        source: 'business_dashboard',
        serviceId,
        discountPercent,
        promoCode,
        expiresAt
      });
      showToast('Promoción creada con éxito.', 'success');
    } catch (err: any) {
      console.error('Error creating promo:', err);
      showToast(err.message || 'Error al crear la promoción.', 'error');
      throw err;
    }
  };

  if (!currentUser) {
    return (
      <BusinessLoginScreen
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      {/* Toast Alert stack */}
      <Toasts toasts={toasts} />

      {/* Header Bar */}
      <header className="bg-emerald-950 text-white p-4 md:px-8 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1">
            <img src="/logocolor.png" alt="Mochilapp Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none uppercase">Mochilapp Business</h1>
            <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold">PORTAL DE SOCIOS</span>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="hidden md:flex items-center gap-2 bg-emerald-900/40 p-1 rounded-xl border border-emerald-800/30">
          {(() => {
            const navigationTabs = [
              { id: 'home', label: 'Inicio', icon: LayoutDashboard },
              { id: 'services', label: 'Mis Servicios', icon: Store },
              { id: 'bookings', label: 'Mis Reservas', icon: Calendar }
            ];
            activeModules.forEach(mod => {
              navigationTabs.push({ id: mod.id, label: mod.label, icon: mod.icon });
            });
            navigationTabs.push(
              { id: 'promos', label: 'Promociones', icon: Megaphone },
              { id: 'reviews', label: 'Reseñas', icon: MessageSquare }
            );
            return navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeBusinessTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveBusinessTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-950 shadow-md' 
                      : 'text-emerald-100 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            });
          })()}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs py-1 px-3 rounded-lg">
            <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Conexión Segura Live</span>
          </div>

          <div className="bg-emerald-900 border border-emerald-800 text-cyan-300 font-mono text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime}</span>
          </div>

          <button 
            onClick={handleLogOut}
            className="p-2 bg-emerald-900/40 hover:bg-rose-900/30 text-slate-300 hover:text-rose-200 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden bg-emerald-900 border-b border-emerald-800/80 px-4 py-2 flex justify-around">
        {(() => {
          const mobileTabs = [
            { id: 'home', label: 'Inicio', icon: LayoutDashboard },
            { id: 'services', label: 'Servicios', icon: Store },
            { id: 'bookings', label: 'Reservas', icon: Calendar }
          ];
          activeModules.forEach(mod => {
            mobileTabs.push({ id: mod.id, label: mod.mobileLabel, icon: mod.icon });
          });
          mobileTabs.push(
            { id: 'promos', label: 'Promos', icon: Megaphone },
            { id: 'reviews', label: 'Reseñas', icon: MessageSquare }
          );
          return mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeBusinessTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBusinessTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'text-emerald-300 bg-emerald-950/60 font-black' 
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          });
        })()}
      </div>

      {/* Main Workplace */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {loadingData ? (
          <div className="h-full flex flex-col justify-center items-center py-24 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-semibold animate-pulse">Cargando datos en tiempo real...</p>
          </div>
        ) : (
          <>
            {activeBusinessTab === 'home' && (
              <BusinessHomeScreen 
                services={services} 
                bookings={bookings} 
                promos={promos}
                currentUser={currentUser} 
              />
            )}
            {activeBusinessTab === 'services' && (
              <MyServicesScreen 
                services={services} 
                onEditService={handleEditService}
              />
            )}
            {activeBusinessTab === 'bookings' && (
              <MyBookingsScreen 
                bookings={bookings} 
              />
            )}
            {activeBusinessTab === 'promos' && (
              <MyPromosScreen 
                promos={promos}
                services={services}
                companyName={currentUser.name}
                onCreatePromo={handleCreatePromo}
              />
            )}
            {activeBusinessTab === 'reviews' && (
              <MyReviewsScreen 
                reviews={reviews} 
                services={services}
              />
            )}
            {(() => {
              const currentModule = activeModules.find(m => m.id === activeBusinessTab);
              if (currentModule) {
                const ModuleComponent = currentModule.screen;
                return (
                  <ModuleErrorBoundary moduleName={currentModule.label}>
                    <React.Suspense fallback={<ModuleLoader />}>
                      <ModuleComponent services={services} bookings={bookings} />
                    </React.Suspense>
                  </ModuleErrorBoundary>
                );
              }
              return null;
            })()}
          </>
        )}
      </main>
    </div>
  );
}
