# Reporte de Mapeo de Services Huérfanos

Este reporte ayuda a identificar el prestador de cada servicio que carece del campo `ownerEmail` y enumera las cuentas corporativas (`role == "COMPANY"`) disponibles en el sistema.

* **Total de servicios sin ownerEmail:** 12
* **Total de prestadores COMPANY disponibles:** 2

## Services sin ownerEmail

### Service: Expedición Volcán Acatenango

*   **serviceId:** `5djLZeMwKjRY6en1ui7E`
*   **type:** OTHER
*   **location:** Antigua, Guatemala
*   **price:** $95 MXN
*   **description:** Caminata épica de dos días para ver las erupciones del Volcán de Fuego desde la cima. Incluye guía y equipo.
*   **imageUrl:** https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"type":"OTHER","rating":0,"price":95,"name":"Expedición Volcán Acatenango","imageUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop","location":"Antigua, Guatemala","ownerEmail":"","description":"Caminata épica de dos días para ver las erupciones del Volcán de Fuego desde la cima. Incluye guía y equipo.","reviewCount":0}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Cata de Mezcal Artesanal

*   **serviceId:** `9YQrwWt1Vb0ngs7gyFEv`
*   **type:** RESTAURANT
*   **location:** Oaxaca, México
*   **price:** $45 MXN
*   **description:** Aprende el proceso de destilación y prueba 5 variedades de mezcales premium acompañados de maridaje local.
*   **imageUrl:** https://images.unsplash.com/photo-1527281405159-45512743db13?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"type":"RESTAURANT","price":45,"rating":0,"name":"Cata de Mezcal Artesanal","imageUrl":"https://images.unsplash.com/photo-1527281405159-45512743db13?q=80&w=1000&auto=format&fit=crop","ownerEmail":"","location":"Oaxaca, México","isVerified":true,"reviewCount":0,"description":"Aprende el proceso de destilación y prueba 5 variedades de mezcales premium acompañados de maridaje local."}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Expedición Volcán Acatenango

*   **serviceId:** `QCLlQEls2pLqe7gdEU0n`
*   **type:** OTHER
*   **location:** Antigua, Guatemala
*   **price:** $95 MXN
*   **description:** Caminata épica de dos días para ver las erupciones del Volcán de Fuego desde la cima. Incluye guía y equipo.
*   **imageUrl:** https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"location":"Antigua, Guatemala","ownerEmail":"","description":"Caminata épica de dos días para ver las erupciones del Volcán de Fuego desde la cima. Incluye guía y equipo.","reviewCount":0,"isVerified":true,"type":"OTHER","rating":0,"price":95,"name":"Expedición Volcán Acatenango","imageUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Expedición Volcán Acatenango

*   **serviceId:** `XML2AwBnzu8ESjTOhnYS`
*   **type:** OTHER
*   **location:** Antigua, Guatemala
*   **price:** $95 MXN
*   **description:** Caminata épica de dos días para ver las erupciones del Volcán de Fuego desde la cima. Incluye guía y equipo.
*   **imageUrl:** https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"ownerEmail":"","location":"Antigua, Guatemala","isVerified":true,"reviewCount":0,"description":"Caminata épica de dos días para ver las erupciones del Volcán de Fuego desde la cima. Incluye guía y equipo.","price":95,"rating":0,"type":"OTHER","name":"Expedición Volcán Acatenango","imageUrl":"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Hotel Boutique Selva Maya

*   **serviceId:** `eR6XFtLJgnvNFU7OQE49`
*   **type:** HOTEL
*   **location:** Tulum, México
*   **price:** $220 MXN
*   **description:** Una experiencia de lujo sustentable en medio de la selva. Incluye desayuno artesanal y acceso privado a cenote.
*   **imageUrl:** https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"reviewCount":0,"description":"Una experiencia de lujo sustentable en medio de la selva. Incluye desayuno artesanal y acceso privado a cenote.","isVerified":true,"location":"Tulum, México","ownerEmail":"","name":"Hotel Boutique Selva Maya","imageUrl":"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop","type":"HOTEL","rating":0,"price":220}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Tour en Catamarán al Atardecer

*   **serviceId:** `huAyZADGiKSI8p04c78q`
*   **type:** BOAT_TOUR
*   **location:** Cancún, México
*   **price:** $85 MXN
*   **description:** Disfruta de una vista increíble del Caribe con barra libre y música a bordo. Ideal para parejas y grupos de amigos.
*   **imageUrl:** https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"imageUrl":"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop","name":"Tour en Catamarán al Atardecer","price":85,"rating":0,"type":"BOAT_TOUR","isVerified":true,"reviewCount":0,"description":"Disfruta de una vista increíble del Caribe con barra libre y música a bordo. Ideal para parejas y grupos de amigos.","ownerEmail":"","location":"Cancún, México"}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Cata de Mezcal Artesanal

*   **serviceId:** `jUiPRrDDT1PMZlMpE9Al`
*   **type:** RESTAURANT
*   **location:** Oaxaca, México
*   **price:** $45 MXN
*   **description:** Aprende el proceso de destilación y prueba 5 variedades de mezcales premium acompañados de maridaje local.
*   **imageUrl:** https://images.unsplash.com/photo-1527281405159-45512743db13?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"name":"Cata de Mezcal Artesanal","imageUrl":"https://images.unsplash.com/photo-1527281405159-45512743db13?q=80&w=1000&auto=format&fit=crop","price":45,"rating":0,"type":"RESTAURANT","isVerified":true,"reviewCount":0,"description":"Aprende el proceso de destilación y prueba 5 variedades de mezcales premium acompañados de maridaje local.","ownerEmail":"","location":"Oaxaca, México"}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Tour en Catamarán al Atardecer

*   **serviceId:** `omfDcAOS0N4dt4UbeNhr`
*   **type:** BOAT_TOUR
*   **location:** Cancún, México
*   **price:** $85 MXN
*   **description:** Disfruta de una vista increíble del Caribe con barra libre y música a bordo. Ideal para parejas y grupos de amigos.
*   **imageUrl:** https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"ownerEmail":"","location":"Cancún, México","reviewCount":0,"description":"Disfruta de una vista increíble del Caribe con barra libre y música a bordo. Ideal para parejas y grupos de amigos.","type":"BOAT_TOUR","price":85,"rating":0,"name":"Tour en Catamarán al Atardecer","imageUrl":"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop"}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Cata de Mezcal Artesanal

*   **serviceId:** `r8D6hqs8usl1QO4wQ1vS`
*   **type:** RESTAURANT
*   **location:** Oaxaca, México
*   **price:** $45 MXN
*   **description:** Aprende el proceso de destilación y prueba 5 variedades de mezcales premium acompañados de maridaje local.
*   **imageUrl:** https://images.unsplash.com/photo-1527281405159-45512743db13?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"reviewCount":0,"description":"Aprende el proceso de destilación y prueba 5 variedades de mezcales premium acompañados de maridaje local.","ownerEmail":"","location":"Oaxaca, México","name":"Cata de Mezcal Artesanal","imageUrl":"https://images.unsplash.com/photo-1527281405159-45512743db13?q=80&w=1000&auto=format&fit=crop","price":45,"rating":0,"type":"RESTAURANT"}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Tour en Catamarán al Atardecer

*   **serviceId:** `t7FJKvaoNugHNlMDp8Sn`
*   **type:** BOAT_TOUR
*   **location:** Cancún, México
*   **price:** $85 MXN
*   **description:** Disfruta de una vista increíble del Caribe con barra libre y música a bordo. Ideal para parejas y grupos de amigos.
*   **imageUrl:** https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"isVerified":true,"description":"Disfruta de una vista increíble del Caribe con barra libre y música a bordo. Ideal para parejas y grupos de amigos.","reviewCount":0,"ownerEmail":"","location":"Cancún, México","name":"Tour en Catamarán al Atardecer","imageUrl":"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop","price":85,"rating":0,"type":"BOAT_TOUR"}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Hotel Boutique Selva Maya

*   **serviceId:** `tPq8FlSobJZH2xcueAP9`
*   **type:** HOTEL
*   **location:** Tulum, México
*   **price:** $220 MXN
*   **description:** Una experiencia de lujo sustentable en medio de la selva. Incluye desayuno artesanal y acceso privado a cenote.
*   **imageUrl:** https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"rating":0,"price":220,"type":"HOTEL","name":"Hotel Boutique Selva Maya","imageUrl":"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop","location":"Tulum, México","ownerEmail":"","description":"Una experiencia de lujo sustentable en medio de la selva. Incluye desayuno artesanal y acceso privado a cenote.","reviewCount":0}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

### Service: Hotel Boutique Selva Maya

*   **serviceId:** `u8gH7GG9WcXc2I9cbbtf`
*   **type:** HOTEL
*   **location:** Tulum, México
*   **price:** $220 MXN
*   **description:** Una experiencia de lujo sustentable en medio de la selva. Incluye desayuno artesanal y acceso privado a cenote.
*   **imageUrl:** https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop
*   **posible prestador:** Mapear manualmente
*   **ownerEmail sugerido:** `Mapear manualmente`
*   **campos extras en DB:** `{"name":"Hotel Boutique Selva Maya","imageUrl":"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop","price":220,"rating":0,"type":"HOTEL","isVerified":true,"reviewCount":0,"description":"Una experiencia de lujo sustentable en medio de la selva. Incluye desayuno artesanal y acceso privado a cenote.","ownerEmail":"","location":"Tulum, México"}`
*   **notas:** Requiere validación de propiedad antes de realizar el backfill.

## Usuarios COMPANY disponibles

*   **name:** mochilapp tours
    *   **email:** `pdro_valenzuela@hotmail.com`
    *   **uid:** `NNGgh2Kr3PcdOTGVpKDTAwuOCA52`
    *   **companyType:** BOAT_TOUR
    *   **businessName:** mochilapp tours

*   **name:** Metal Madera
    *   **email:** `gbajaintegral@gmail.com`
    *   **uid:** `sPp8ITDGAAcRb01JIGXVCcUc3F13`
    *   **companyType:** OTHER
    *   **businessName:** Metal Madera

