/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import firebaseConfig from '../../firebase-applet-config.json';

async function runMappingReport() {
  console.log("Iniciando generación de reportes de mapeo de Firestore para mochilapp-2c777...");

  // Inicializar Firebase Client SDK
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 1. Obtener todos los servicios y filtrar los que no tienen ownerEmail
  const servicesSnap = await getDocs(collection(db, 'services'));
  const servicesWithoutEmail: any[] = [];

  servicesSnap.forEach(docSnap => {
    const data = docSnap.data();
    const ownerEmail = data.ownerEmail;
    const hasValidEmail = ownerEmail && typeof ownerEmail === 'string' && ownerEmail.includes('@');

    if (!hasValidEmail) {
      servicesWithoutEmail.push({
        id: docSnap.id,
        name: data.name || 'Servicio sin nombre',
        type: data.type || 'tour',
        location: data.location || 'Sin ubicación',
        description: data.description || data.content || 'Sin descripción',
        price: Number(data.price || 0),
        imageUrl: data.imageUrl || '',
        ownerEmail: ownerEmail || null,
        // Capturar todos los campos extra para análisis
        extraData: data
      });
    }
  });

  // 2. Obtener todos los usuarios de tipo COMPANY
  const usersSnap = await getDocs(collection(db, 'users'));
  const companyUsers: any[] = [];

  usersSnap.forEach(docSnap => {
    const data = docSnap.data();
    if (data.role === 'COMPANY') {
      companyUsers.push({
        uid: docSnap.id,
        name: data.name || 'Sin Nombre',
        email: data.email || '',
        companyType: data.companyType || 'NONE',
        businessName: data.businessName || data.name || '',
        profileImageUrl: data.profileImageUrl || ''
      });
    }
  });

  // Heurística para sugerir posibles dueños
  const servicesWithSuggestions = servicesWithoutEmail.map(s => {
    let sugerenciaEmail = 'No se encontró sugerencia automática';
    let sugerenciaName = 'Desconocido';
    let coincidenciaScore = 0;

    // Buscar coincidencia por nombre o texto
    companyUsers.forEach(u => {
      let score = 0;
      const uNameLower = u.name.toLowerCase();
      const sNameLower = s.name.toLowerCase();
      const sDescLower = s.description.toLowerCase();
      const uEmailPrefix = u.email.split('@')[0].toLowerCase();

      // Heurística 1: Si el nombre del usuario (ej. Ricardo Salinas) aparece en el nombre del servicio
      if (sNameLower.includes(uNameLower) || uNameLower.includes(sNameLower)) {
        score += 5;
      }
      // Heurística 2: Si partes del nombre del usuario aparecen en la descripción
      const nameParts = uNameLower.split(' ');
      nameParts.forEach(part => {
        if (part.length > 3 && sDescLower.includes(part)) {
          score += 2;
        }
      });
      // Heurística 3: Si hay metadatos heredados como "providerName" en el servicio que coincidan
      if (s.extraData.providerName && s.extraData.providerName.toLowerCase().includes(uNameLower)) {
        score += 10;
      }
      if (s.extraData.responsibleName && s.extraData.responsibleName.toLowerCase().includes(uNameLower)) {
        score += 10;
      }
      // Heurística 4: Coincidencia con prefijo de email
      if (sNameLower.includes(uEmailPrefix) || sDescLower.includes(uEmailPrefix)) {
        score += 3;
      }

      if (score > coincidenciaScore) {
        coincidenciaScore = score;
        sugerenciaEmail = u.email;
        sugerenciaName = u.name;
      }
    });

    return {
      ...s,
      posiblePrestador: coincidenciaScore > 0 ? `${sugerenciaName} (${sugerenciaEmail})` : 'Mapear manualmente',
      ownerEmailSugerido: coincidenciaScore > 0 ? sugerenciaEmail : ''
    };
  });

  // Estructura del reporte JSON
  const reportData = {
    timestamp: new Date().toISOString(),
    totalServicesWithoutEmail: servicesWithoutEmail.length,
    totalCompanyUsers: companyUsers.length,
    servicesWithoutEmail: servicesWithSuggestions,
    companyUsersAvailable: companyUsers
  };

  // Crear la carpeta reports si no existe
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  // Guardar JSON
  const jsonPath = path.join(reportsDir, 'services-ownerEmail-mapping-needed.json');
  fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2), 'utf-8');
  console.log(`Reporte JSON guardado en: reports/services-ownerEmail-mapping-needed.json`);

  // Guardar Markdown
  let mdContent = `# Reporte de Mapeo de Services Huérfanos\n\n`;
  mdContent += `Este reporte ayuda a identificar el prestador de cada servicio que carece del campo \`ownerEmail\` y enumera las cuentas corporativas (\`role == "COMPANY"\`) disponibles en el sistema.\n\n`;
  mdContent += `* **Total de servicios sin ownerEmail:** ${servicesWithoutEmail.length}\n`;
  mdContent += `* **Total de prestadores COMPANY disponibles:** ${companyUsers.length}\n\n`;

  mdContent += `## Services sin ownerEmail\n\n`;
  servicesWithSuggestions.forEach(s => {
    mdContent += `### Service: ${s.name}\n\n`;
    mdContent += `*   **serviceId:** \`${s.id}\`\n`;
    mdContent += `*   **type:** ${s.type}\n`;
    mdContent += `*   **location:** ${s.location}\n`;
    mdContent += `*   **price:** $${s.price} MXN\n`;
    mdContent += `*   **description:** ${s.description}\n`;
    if (s.imageUrl) {
      mdContent += `*   **imageUrl:** ${s.imageUrl}\n`;
    }
    mdContent += `*   **posible prestador:** ${s.posiblePrestador}\n`;
    mdContent += `*   **ownerEmail sugerido:** \`${s.ownerEmailSugerido || 'Mapear manualmente'}\`\n`;
    mdContent += `*   **campos extras en DB:** \`${JSON.stringify(s.extraData)}\`\n`;
    mdContent += `*   **notas:** Requiere validación de propiedad antes de realizar el backfill.\n\n`;
  });

  mdContent += `## Usuarios COMPANY disponibles\n\n`;
  companyUsers.forEach(u => {
    mdContent += `*   **name:** ${u.name}\n`;
    mdContent += `    *   **email:** \`${u.email}\`\n`;
    mdContent += `    *   **uid:** \`${u.uid}\`\n`;
    mdContent += `    *   **companyType:** ${u.companyType}\n`;
    if (u.businessName) {
      mdContent += `    *   **businessName:** ${u.businessName}\n`;
    }
    mdContent += `\n`;
  });

  const mdPath = path.join(reportsDir, 'services-ownerEmail-mapping-needed.md');
  fs.writeFileSync(mdPath, mdContent, 'utf-8');
  console.log(`Reporte Markdown guardado en: reports/services-ownerEmail-mapping-needed.md`);

  // Imprimir resumen
  console.log("\n==================================================");
  console.log("       DIAGNÓSTICO COMPLETO DE MAPEO");
  console.log("==================================================");
  console.log(`Servicios sin ownerEmail:  ${servicesWithoutEmail.length}`);
  console.log(`Usuarios COMPANY activos:  ${companyUsers.length}`);
  console.log("==================================================");
}

runMappingReport().catch(err => {
  console.error("Error al generar reportes de mapeo:", err);
  process.exit(1);
});
