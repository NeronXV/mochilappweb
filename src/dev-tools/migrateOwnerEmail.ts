/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Mapeos definidos por nombre de servicio
const MAPPING: { [key: string]: string } = {
  "Tour en Catamarán al Atardecer": "pdro_valenzuela@hotmail.com",
  "Expedición Volcán Acatenango": "gbajaintegral@gmail.com",
  "Hotel Boutique Selva Maya": "pdro_valenzuela@hotmail.com",
  "Cata de Mezcal Artesanal": "pdro_valenzuela@hotmail.com"
};

async function runMigration() {
  const isApply = process.argv.includes('--apply');

  console.log("==================================================");
  if (isApply) {
    console.log("   *** MODO APPLY: APLICANDO CAMBIOS EN FIRESTORE ***");
  } else {
    console.log("   *** MODO DRY-RUN: SIMULANDO MIGRACIÓN (SOLO LECTURA) ***");
  }
  console.log("==================================================");

  // Inicializar Firebase Client SDK
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 1. Cargar todos los servicios para identificar huérfanos y mapearlos
  console.log("Leyendo servicios...");
  const servicesSnap = await getDocs(collection(db, 'services'));
  const servicesToUpdate: any[] = [];
  const servicesSkipped: any[] = [];
  const serviceOwnerMap = new Map<string, string>(); // Mapa final id -> email para mapeo de bookings

  servicesSnap.forEach(docSnap => {
    const data = docSnap.data();
    const serviceId = docSnap.id;
    const name = data.name || '';
    const currentEmail = data.ownerEmail;
    const hasValidEmail = currentEmail && typeof currentEmail === 'string' && currentEmail.includes('@');

    // Identificar el email asignado
    let targetEmail = '';
    for (const key in MAPPING) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        targetEmail = MAPPING[key];
        break;
      }
    }

    if (hasValidEmail) {
      // Ya tiene email en la base de datos, lo registramos en el mapa
      serviceOwnerMap.set(serviceId, currentEmail);
      servicesSkipped.push({ id: serviceId, name, reason: 'Ya tiene ownerEmail' });
    } else if (targetEmail) {
      // Huérfano y coincide con nuestro mapeo
      servicesToUpdate.push({ id: serviceId, name, targetEmail });
      serviceOwnerMap.set(serviceId, targetEmail);
    } else {
      // Huérfano pero sin coincidencia de mapeo
      servicesSkipped.push({ id: serviceId, name, reason: 'Sin coincidencia en mapeo manual' });
    }
  });

  // 2. Cargar bookings y cruzarlos con servicios para asignar ownerEmail
  console.log("Leyendo reservas...");
  const bookingsSnap = await getDocs(collection(db, 'bookings'));
  const bookingsToUpdate: any[] = [];
  const bookingsSkipped: any[] = [];

  bookingsSnap.forEach(docSnap => {
    const bookingId = docSnap.id;
    const data = docSnap.data();
    const currentEmail = data.ownerEmail;
    const serviceId = data.serviceId;
    const hasValidEmail = currentEmail && typeof currentEmail === 'string' && currentEmail.includes('@');

    if (hasValidEmail) {
      bookingsSkipped.push({ id: bookingId, reason: 'Ya tiene ownerEmail' });
    } else if (!serviceId) {
      bookingsSkipped.push({ id: bookingId, reason: 'Reserva sin serviceId' });
    } else {
      const targetEmail = serviceOwnerMap.get(serviceId);
      if (targetEmail) {
        bookingsToUpdate.push({ id: bookingId, serviceId, targetEmail });
      } else {
        bookingsSkipped.push({ id: bookingId, serviceId, reason: 'Servicio asociado no tiene ownerEmail' });
      }
    }
  });

  // 3. Ejecutar escrituras en Firestore si --apply está activado
  let servicesUpdatedCount = 0;
  let bookingsUpdatedCount = 0;
  const errorsList: any[] = [];

  if (isApply) {
    console.log("\nAplicando cambios a Servicios...");
    for (const s of servicesToUpdate) {
      try {
        const docRef = doc(db, 'services', s.id);
        await updateDoc(docRef, { ownerEmail: s.targetEmail });
        servicesUpdatedCount++;
        console.log(`[OK] Service ${s.id} ("${s.name}") -> ${s.targetEmail}`);
      } catch (err: any) {
        console.error(`[ERROR] Service ${s.id}:`, err);
        errorsList.push({ type: 'service', id: s.id, error: err.message });
      }
    }

    console.log("\nAplicando cambios a Reservas (Bookings)...");
    for (const b of bookingsToUpdate) {
      try {
        const docRef = doc(db, 'bookings', b.id);
        await updateDoc(docRef, { ownerEmail: b.targetEmail });
        bookingsUpdatedCount++;
        console.log(`[OK] Booking ${b.id} (Service ${b.serviceId}) -> ${b.targetEmail}`);
      } catch (err: any) {
        console.error(`[ERROR] Booking ${b.id}:`, err);
        errorsList.push({ type: 'booking', id: b.id, error: err.message });
      }
    }
  } else {
    // Modo Dry-run: Solo listar lo que se haría
    console.log("\n[DRY-RUN] Servicios por actualizar:");
    servicesToUpdate.forEach(s => {
      console.log(`  - Service ${s.id} ("${s.name}") -> ${s.targetEmail}`);
    });

    console.log("\n[DRY-RUN] Reservas por actualizar:");
    bookingsToUpdate.forEach(b => {
      console.log(`  - Booking ${b.id} (Service ${b.serviceId}) -> ${b.targetEmail}`);
    });
  }

  // 4. Imprimir resumen de la ejecución
  console.log("\n==================================================");
  console.log("            RESUMEN DE MIGRACIÓN");
  console.log("==================================================");
  console.log(`Services revisados:             ${servicesSnap.size}`);
  console.log(`Services ${isApply ? 'actualizados' : 'por actualizar'}:      ${servicesToUpdate.length}`);
  console.log(`Services omitidos:              ${servicesSkipped.length}`);
  console.log("--------------------------------------------------");
  console.log(`Bookings revisados:             ${bookingsSnap.size}`);
  console.log(`Bookings ${isApply ? 'actualizados' : 'por actualizar'}:      ${bookingsToUpdate.length}`);
  console.log(`Bookings omitidos:              ${bookingsSkipped.length}`);
  console.log("--------------------------------------------------");
  if (isApply) {
    console.log(`Escrituras completadas:         ${servicesUpdatedCount + bookingsUpdatedCount}`);
    console.log(`Errores encontrados:            ${errorsList.length}`);
  } else {
    console.log("*(Ejecuta con bandera --apply para escribir los cambios)*");
  }
  console.log("==================================================");
}

runMigration().catch(err => {
  console.error("Error crítico durante la ejecución del script:", err);
  process.exit(1);
});
