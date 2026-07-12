/**
 * Backfill de modalidad (spec-modalidad-privada-colectiva §10.2).
 *
 * Recorre `services` y a los documentos SIN campo `modalidad` les escribe:
 *   modalidad: "COLECTIVA"
 *   pricing: { precioPorPersona: <price legado>, capacidadMaxima: <capacity> }
 *
 * Correrlo DESPUÉS de desplegar las functions tolerantes (§10.3), no antes.
 *
 * USO (desde la raíz de mochilapp-admin, con `firebase login` activo en esta
 * máquina — usa la sesión de la CLI, no requiere service account):
 *
 *   node scripts/backfill-modalidad.cjs              → DRY-RUN: solo imprime
 *   node scripts/backfill-modalidad.cjs --ejecutar   → escribe de verdad
 *
 * Reglas:
 *  - Docs que ya tienen `modalidad`: se saltan (idempotente).
 *  - Docs con price <= 0: NO se migran; se reportan para revisión manual
 *    (una colectiva con precio 0 sería inválida para reglas y cobro).
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

const PROJECT = "mochilapp-2c777";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const EJECUTAR = process.argv.includes("--ejecutar");

/** Token OAuth desde la sesión de firebase-tools de esta máquina. */
async function getAccessToken() {
  const storePath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");
  const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
  const refreshToken = store.tokens && store.tokens.refresh_token;
  if (!refreshToken) throw new Error("No hay sesión de firebase-tools: corre `firebase login`.");
  // Cliente OAuth público de firebase-tools (constantes de su repo open source)
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: new URLSearchParams({
      client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
      client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const json = await resp.json();
  if (!json.access_token) throw new Error("No se pudo obtener token: " + JSON.stringify(json));
  return json.access_token;
}

/** Lista todos los documentos de services (paginado). */
async function listarServicios(token) {
  let docs = [];
  let pageToken = "";
  do {
    const url = `${BASE}/services?pageSize=300` + (pageToken ? `&pageToken=${pageToken}` : "");
    const resp = await fetch(url, {headers: {Authorization: `Bearer ${token}`}});
    const json = await resp.json();
    if (json.error) throw new Error("Error listando services: " + json.error.message);
    docs = docs.concat(json.documents || []);
    pageToken = json.nextPageToken || "";
  } while (pageToken);
  return docs;
}

const num = (f) => f === undefined ? 0 :
  (f.doubleValue !== undefined ? Number(f.doubleValue) : Number(f.integerValue || 0));
const str = (f) => (f && f.stringValue) || "";

/** PATCH solo de modalidad y pricing (updateMask: no toca nada más). */
async function escribir(token, docId, precioPorPersona, capacidadMaxima) {
  const url = `${BASE}/services/${docId}?updateMask.fieldPaths=modalidad&updateMask.fieldPaths=pricing`;
  const body = {
    fields: {
      modalidad: {stringValue: "COLECTIVA"},
      pricing: {mapValue: {fields: {
        precioPorPersona: {doubleValue: precioPorPersona},
        capacidadMaxima: {integerValue: String(capacidadMaxima)},
      }}},
    },
  };
  const resp = await fetch(url, {
    method: "PATCH",
    headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
    body: JSON.stringify(body),
  });
  const json = await resp.json();
  if (json.error) throw new Error(`Error escribiendo ${docId}: ${json.error.message}`);
}

(async () => {
  console.log(EJECUTAR
    ? "⚠️  MODO EJECUCIÓN: se escribirá en Firestore.\n"
    : "🔍 DRY-RUN: solo se imprime lo que se haría (usa --ejecutar para escribir).\n");

  const token = await getAccessToken();
  const docs = await listarServicios(token);

  let yaMigrados = 0;
  let migrables = 0;
  let modificados = 0;
  let omitidos = 0;

  for (const doc of docs) {
    const id = doc.name.split("/").pop();
    const f = doc.fields || {};
    const nombre = str(f.name) || "(sin nombre)";

    if (f.modalidad !== undefined) {
      yaMigrados++;
      console.log(`  = ${id}  "${nombre}" — ya tiene modalidad=${str(f.modalidad)}, se salta`);
      continue;
    }

    const price = num(f.price);
    const capacity = num(f.capacity);

    if (price <= 0) {
      omitidos++;
      console.log(`  ! ${id}  "${nombre}" — price=${price} inválido: NO se migra, revisar a mano`);
      continue;
    }

    migrables++;
    console.log(`  → ${id}  "${nombre}" — escribiría modalidad=COLECTIVA, ` +
        `pricing={precioPorPersona: ${price}, capacidadMaxima: ${capacity}}`);

    if (EJECUTAR) {
      await escribir(token, id, price, capacity);
      modificados++;
    }
  }

  console.log("\n===== RESUMEN =====");
  console.log(`Documentos en services:   ${docs.length}`);
  console.log(`Ya migrados (saltados):   ${yaMigrados}`);
  console.log(`Omitidos por price<=0:    ${omitidos}`);
  if (EJECUTAR) {
    console.log(`✅ Documentos MODIFICADOS: ${modificados}`);
  } else {
    console.log(`Se modificarían:          ${migrables} (dry-run, nada se escribió)`);
  }
})().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
