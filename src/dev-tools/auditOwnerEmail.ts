/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import firebaseConfig from '../../firebase-applet-config.json';

async function runAudit() {
  console.log("Iniciando auditoría de Firestore para mochilapp-2c777...");

  // Inicializar Firebase Client SDK
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 1. Obtener todos los servicios
  const servicesSnap = await getDocs(collection(db, 'services'));
  const servicesList: any[] = [];
  let servicesWithEmail = 0;
  let servicesWithoutEmail = 0;
  const servicesWithoutEmailIds: string[] = [];

  servicesSnap.forEach(docSnap => {
    const data = docSnap.data();
    const ownerEmail = data.ownerEmail;
    servicesList.push({ id: docSnap.id, ownerEmail });
    if (ownerEmail && typeof ownerEmail === 'string' && ownerEmail.includes('@')) {
      servicesWithEmail++;
    } else {
      servicesWithoutEmail++;
      servicesWithoutEmailIds.push(docSnap.id);
    }
  });

  // Crear un mapa de serviceId -> ownerEmail para cruzar las reservas
  const serviceOwnerMap = new Map<string, string>();
  servicesList.forEach(s => {
    if (s.ownerEmail) {
      serviceOwnerMap.set(s.id, s.ownerEmail);
    }
  });

  // 2. Obtener todas las reservas
  const bookingsSnap = await getDocs(collection(db, 'bookings'));
  let totalBookings = 0;
  let bookingsWithEmail = 0;
  let bookingsWithoutEmail = 0;
  let bookingsMigratable = 0;
  let bookingsNoServiceId = 0;
  let bookingsServiceNotFound = 0;
  let bookingsServiceNoEmail = 0;

  const bookingsList: any[] = [];
  const bookingsTroubledIds: string[] = [];

  bookingsSnap.forEach(docSnap => {
    totalBookings++;
    const data = docSnap.data();
    const ownerEmail = data.ownerEmail;
    const serviceId = data.serviceId;

    bookingsList.push({ id: docSnap.id, ownerEmail, serviceId });

    const hasValidEmail = ownerEmail && typeof ownerEmail === 'string' && ownerEmail.includes('@');

    if (hasValidEmail) {
      bookingsWithEmail++;
    } else {
      bookingsWithoutEmail++;
      
      if (!serviceId) {
        bookingsNoServiceId++;
        bookingsTroubledIds.push(docSnap.id);
      } else {
        const correspondingServiceEmail = serviceOwnerMap.get(serviceId);
        const serviceExists = servicesList.some(s => s.id === serviceId);

        if (!serviceExists) {
          bookingsServiceNotFound++;
          bookingsTroubledIds.push(docSnap.id);
        } else if (!correspondingServiceEmail) {
          bookingsServiceNoEmail++;
          bookingsTroubledIds.push(docSnap.id);
        } else {
          bookingsMigratable++;
        }
      }
    }
  });

  // Report structure
  const report = {
    timestamp: new Date().toISOString(),
    project: firebaseConfig.projectId,
    summary: {
      totalServices: servicesList.length,
      servicesWithEmail,
      servicesWithoutEmail,
      totalBookings,
      bookingsWithEmail,
      bookingsWithoutEmail,
      bookingsMigratable,
      bookingsNoServiceId,
      bookingsServiceNotFound,
      bookingsServiceNoEmail
    },
    servicesWithoutEmailIds,
    bookingsTroubledIds
  };

  // Imprimir resumen
  console.log("\n==================================================");
  console.log("               AUDITORÍA OWNER EMAIL");
  console.log("==================================================");
  console.log(`Services revisados:          ${servicesList.length}`);
  console.log(`  - Con ownerEmail:          ${servicesWithEmail}`);
  console.log(`  - Sin ownerEmail:          ${servicesWithoutEmail}`);
  console.log("--------------------------------------------------");
  console.log(`Bookings revisados:          ${totalBookings}`);
  console.log(`  - Con ownerEmail:          ${bookingsWithEmail}`);
  console.log(`  - Sin ownerEmail:          ${bookingsWithoutEmail}`);
  console.log(`  - Migrables por serviceId:  ${bookingsMigratable}`);
  console.log(`  - Sin serviceId:            ${bookingsNoServiceId}`);
  console.log(`  - Con serviceId inexistente:${bookingsServiceNotFound}`);
  console.log(`  - Con service sin email:    ${bookingsServiceNoEmail}`);
  console.log("==================================================");

  // Escribir reporte en un archivo local
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }
  const reportPath = path.join(reportsDir, 'ownerEmail-audit.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`Reporte guardado en: reports/ownerEmail-audit.json`);
}

runAudit().catch(err => {
  console.error("Error al ejecutar la auditoría:", err);
  process.exit(1);
});
