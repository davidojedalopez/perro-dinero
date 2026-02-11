# Plan de hubs temáticos y clasificación de posts

## Objetivo
Crear hubs por tema (presupuesto, inversión, ahorro, deudas, seguros), enlazar bidireccionalmente con posts y mantenerlos visibles para SEO.

## Implementación técnica propuesta

1. **Fuente única de temas**
   - Mantener catálogo de temas en `_data/temas_hub.js` con:
     - `slug`, `title`, `emoji`
     - `definition`
     - `keyLinks`
     - `keywords` para clasificación automática.

2. **Clasificación de posts (multi-tema)**
   - En `posts/posts.11tydata.js` calcular `temas` por post usando:
     - Asignación manual por `fileSlug` para excepciones/curación editorial.
     - Asignación automática por coincidencia de keywords en `tags` + `title`.
   - El campo `temas` es un arreglo y permite pertenecer a múltiples temáticas.

3. **Páginas hub por tema**
   - Página índice `/temas/` con todos los hubs.
   - Página dinámica `/temas/{slug}/` con:
     - resumen “definición + enlaces clave”
     - listado de posts relacionados.

4. **Enlace bidireccional**
   - **Hub → post**: listado principal en cada hub.
   - **Post → hub**: bloque “Este post también vive en estos hubs” dentro del layout de post.

## Plan de actualización de sitemaps

1. **Fase 1 (ya implementada):**
   - Incluir en `sitemap.xml`:
     - URLs existentes (`collections.rssables`)
     - URLs de hubs por tema (`collections.temas`)
     - índice de temas (`/temas/`).

2. **Fase 2 (siguiente iteración):**
   - Migrar a `sitemap index` con separación por tipo:
     - `sitemap-posts.xml`
     - `sitemap-temas.xml`
     - `sitemap-static.xml`
   - Beneficio: menor tamaño por archivo y recrawl más predecible.

3. **Fase 3 (operación):**
   - Agregar check en CI para validar:
     - cada tema tenga al menos 1 post
     - cada post nuevo tenga mínimo 1 tema asignado.

## Plan para mapear posts existentes

1. **Cobertura inicial automática**
   - Ejecutar mapeo por keywords sobre todos los posts actuales.

2. **Curación editorial por lotes**
   - Revisar por lotes de 10-15 posts, ajustando `manualAssignments` cuando:
     - falte contexto semántico en tags
     - se requieran 2+ temas por intención editorial.

3. **Regla operativa para posts nuevos**
   - Requerir `temas` en frontmatter para posts nuevos.
   - Mantener el clasificador automático como fallback.

4. **Definición de multi-tema**
   - Un post puede tener 1 tema principal y N secundarios.
   - Recomendación editorial:
     - ideal: 1-3 temas por post
     - evitar 4+ salvo contenido transversal.
