# Plan: Cuentas, progreso por evaluaciones y seguimiento diario

Este es un cambio grande. Antes de implementarlo confirmo el alcance y algunas decisiones clave. Mantengo el diseño visual actual (fondo claro, tipografías, degradado RIQSIN, tarjetas, header/footer) y todas las rutas existentes.

## 1. Backend — Lovable Cloud

Voy a activar **Lovable Cloud** (backend gestionado por Lovable, sin cuentas externas). Da base de datos PostgreSQL, autenticación de usuarios, funciones seguras del servidor y almacenamiento — todo con Row Level Security activo por defecto en las tablas que creemos.

## 2. Autenticación

- Rutas: `/registro`, `/iniciar-sesion`, `/recuperar-contrasena`, `/cuenta`, `/cuenta/historial`.
- Registro con: nombre, alias público (opcional), email, contraseña + confirmación.
- Página `/cuenta` con nombre, alias, nivel actual, progreso general, racha diaria, última actividad, botón "Continuar" (lleva al próximo módulo disponible), botón "Cerrar sesión", y la **pregunta diaria** integrada.
- Método por defecto: email + contraseña. **¿Querés que también agregue "Iniciar sesión con Google"?** (recomendado, es un click; si no, sólo email/contraseña).

## 3. Estructura de contenido (tablas)

`levels`, `modules`, `lessons`, `quizzes`, `quiz_questions`, `quiz_options` — tal cual el pedido.

Nota importante: hoy los 6 niveles viven en `src/data/levels.ts` (archivo estático). Voy a crear las tablas y **sembrar** los 6 niveles actuales (Despertar → Legado) en `levels` con una migración. Los módulos, lecciones y cuestionarios los cargás después desde `/admin` — el contenido detallado de cada módulo lo definís vos cuando esté listo.

## 4. Progreso por evaluaciones (sin marcar manual)

- Tablas: `quiz_attempts`, `quiz_answers`, `user_module_progress`, `user_level_progress`.
- Toda la corrección y actualización de progreso se hace en **funciones seguras del servidor** (`createServerFn`). El navegador solo envía las respuestas elegidas; nunca el puntaje, ni `passed`, ni el porcentaje.
- Un módulo se marca `completed` solo si `percentage >= quiz.passing_percentage`. Al aprobar se desbloquea el siguiente por `position`. El % del nivel = módulos aprobados / total.
- Se guardan todos los intentos, con `attempt_number` y `max_attempts`. Se muestran mejor nota y cantidad de intentos.
- RLS: el usuario solo ve sus propios intentos/respuestas y **no puede** insertar/actualizar `quiz_attempts`, `quiz_answers`, `user_module_progress` ni `user_level_progress` directamente (solo el service role, vía las server functions).

## 5. Pregunta diaria + rachas

- Tablas: `daily_questions`, `daily_responses`, `user_streaks`.
- Server function `submitDailyResponse`: valida que sea el día activo, que el usuario no haya respondido hoy (índice único `(user_id, question_id)`), guarda la respuesta, calcula puntos y actualiza `user_streaks` (consecutivos → +1, día perdido → reset a 1, `longest_streak` conserva el máximo).
- RLS: el usuario lee sus respuestas y su racha; no puede escribirlas directamente.

## 6. Historial personal (`/cuenta/historial`)

- Calendario de días respondidos, respuestas anteriores, racha actual, mejor racha, % de participación, puntaje total, evolución semanal y mensual.
- Filtros: 7 días / 30 días / todo.

## 7. Comunidad (`/comunidad`)

- Ranking opcional. Añado a `profiles`: `public_alias`, `show_in_leaderboard`, `created_at`.
- Vista segura `public.leaderboard` (security_invoker) que expone solo alias, puntaje, racha actual, mejor racha, respuestas y niveles completados, filtrando `show_in_leaderboard = true`. Nunca email ni nombre real. Sin alias → "Usuario anónimo".
- Toggle en `/cuenta` para activar/desactivar la aparición.

## 8. Roles y `/admin`

- Tabla separada `user_roles` + enum `app_role ('user','admin')` + función `has_role()` `SECURITY DEFINER` (patrón Lovable, evita recursión y escalada de privilegios).
- Ruta `/admin` protegida server-side por `has_role(uid,'admin')`. Un usuario normal **no puede** asignarse admin (INSERT en `user_roles` restringido a admins).
- Panel para crear/editar niveles, módulos, lecciones, cuestionarios, preguntas, opciones, definir la correcta, nota mínima, y crear/programar preguntas diarias por fecha. Estadísticas: intentos, % aprobación, participación diaria.
- El primer admin lo asignás vos manualmente (te doy el SQL de una línea o botón de "promover a admin" desde SQL).

## 9. UX de módulos

Cada módulo muestra: título, contenido, estado, evaluación, intentos, mejor resultado, nota mínima, próximo módulo (bloqueado/disponible). Mensajes: "Módulo aprobado" / "No alcanzaste el porcentaje necesario. Revisá el contenido e intentá nuevamente." No se revelan respuestas correctas durante el intento; al finalizar se muestran explicaciones solo si están configuradas.

## 10. Seguridad (checklist final)

- RLS activo en TODAS las tablas de usuario.
- Escrituras críticas (notas, aprobaciones, progreso, desbloqueos, puntos, rachas, roles) solo vía server functions con service role, tras validar identidad y reglas.
- Vista pública del ranking sin PII.
- Índices únicos para: una respuesta diaria por usuario por pregunta; un rol único por usuario.

## Detalles técnicos

- **Stack**: TanStack Start + Lovable Cloud (Supabase). Server functions con `createServerFn` + `requireSupabaseAuth`. Cliente browser existente para auth.
- **Rutas nuevas**: `/registro`, `/iniciar-sesion`, `/recuperar-contrasena`, `_authenticated/cuenta`, `_authenticated/cuenta/historial`, `_authenticated/metodo/$slug/modulo/$moduleId`, `_authenticated/metodo/$slug/quiz/$quizId`, `/comunidad`, `_authenticated/_admin/*`.
- **Header**: agrego "Cuenta" cuando el usuario está logueado; "Iniciar sesión" cuando no.
- **Migraciones**: una sola migración inicial con todas las tablas, GRANTs, RLS, políticas, funciones, triggers y seed de los 6 niveles.
- **No incluye** (por pedido): Mercado Pago, contenido real de módulos/lecciones/quizzes (se carga desde /admin).

## Preguntas antes de empezar

1. **¿Agrego Google Sign-In además de email/contraseña?** (recomendado)
2. **¿Confirmás que los 6 niveles actuales se siembran en la tabla `levels`** y los módulos/lecciones/quizzes los cargás vos después desde `/admin`? (No voy a inventar contenido educativo).
3. **¿Tu email para que quede como primer admin?** (lo dejo listo en la migración o te paso el SQL para ejecutar cuando te registres).

Con esas respuestas arranco. Si preferís que empiece ya con email/contraseña, siembra de niveles vacía y admin manual por SQL, decime "dale" y avanzo.
