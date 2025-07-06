// Centralización de todas las rutas de la aplicación
// Principio DRY: evita duplicar paths en toda la aplicación

export const ROUTE_PATHS = {
  // Rutas públicas
  HOME: "/",
  MAIN_PAGE: "/mainpage",
  SEARCH: "/search",
  
  // Autenticación
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  
  // Dashboard
  DASHBOARD: "/dashboard",
  
  // Reservas y disponibilidad
  RESERVA: "/reserva",
  DISPONIBILIDAD: "/disponibilidad",
  
  // Pruebas psicológicas
  CREAR_PRUEBAS: "/CrearPruebas",
  EDITAR_PRUEBA: "/EditarPrueba/:testId",
  TEST_MENU: "/testmenu",
  TEST_PAGE: "/test/:testId",
  RESULTADO: "/resultado/:resultId",
  RESULTADO_PLURAL: "/resultados/:resultId",  // Added for compatibility with existing code
  
  // Chat
  CHAT: "/chat",
  CHAT_DETAIL: "/chat/:id",
  
  // Perfiles
  PERFIL_PACIENTE: "/perfil-paciente",
  PERFIL_PACIENTE_ALT: "/perfil_paciente",
  PERFIL_PACIENTE_ID: "/perfil_paciente/:id",
  PERFIL_PSICOLOGO: "/perfil-psicologo",
  PERFIL_PSICOLOGO_ALT: "/perfil_psicologo",
  
  // Consultas y pacientes
  CONSULTAS: "/consultas",
  PACIENTES: "/pacientes",
  PACIENTE_DETAIL: "/pacientes/:id",
  
  // Funcionalidades adicionales
  HELP: "/help",
  CALENDARIO: "/calendario",
  CONSULTAS_ONLINE: "/consultas-online",
  
  // Objetivos del paciente
  OBJETIVOS_PACIENTE: "/objetivos-paciente/:pacienteId",
  MIS_OBJETIVOS: "/mis-objetivos",
  
  // Registro y progreso emocional
  GESTION_EMOCIONES: "/gestion-emociones",
  REGISTRAR_EMOCIONES: "/registrar-emociones/:pacienteId",
  MIS_EMOCIONES: "/mis-emociones",
  GENERAR_INFORME: "/generarinforme",
  MOSTRAR_INFORME: "/mostrar-informe"
};

// Generadores de rutas dinámicas
export const createDynamicRoute = (path, params) => {
  let route = path;
  Object.entries(params).forEach(([key, value]) => {
    route = route.replace(`:${key}`, value);
  });
  return route;
};

// Helper function for objectives route
export const createObjetivosRoute = (pacienteId) => {
  return createDynamicRoute(ROUTE_PATHS.OBJETIVOS_PACIENTE, { pacienteId });
};

// Helper function for emotions registration route
export const createRegistrarEmocionesRoute = (pacienteId) => {
  return createDynamicRoute(ROUTE_PATHS.REGISTRAR_EMOCIONES, { pacienteId });
};

// Rutas de navegación comunes
export const NAVIGATION_ROUTES = {
  PATIENT: [
    { path: ROUTE_PATHS.DASHBOARD, label: "Dashboard", icon: "dashboard" },
    { path: ROUTE_PATHS.RESERVA, label: "Reservar Cita", icon: "calendar" },
    { path: ROUTE_PATHS.TEST_MENU, label: "Pruebas", icon: "test" },
    { path: ROUTE_PATHS.MIS_OBJETIVOS, label: "Mis Objetivos", icon: "target" },
    { path: ROUTE_PATHS.MIS_EMOCIONES, label: "Mis Emociones", icon: "emotion" },
    { path: ROUTE_PATHS.CONSULTAS, label: "Mis Consultas", icon: "consultation" },
    { path: ROUTE_PATHS.CHAT, label: "Mensajes", icon: "chat" },
    { path: ROUTE_PATHS.PERFIL_PACIENTE, label: "Perfil", icon: "profile" },
    { path: ROUTE_PATHS.HELP, label: "Ayuda", icon: "help" },
  ],
  PSYCHOLOGIST: [
    { path: ROUTE_PATHS.DASHBOARD, label: "Dashboard", icon: "dashboard" },
    { path: ROUTE_PATHS.PACIENTES, label: "Pacientes", icon: "patients" },
    { path: ROUTE_PATHS.OBJETIVOS_PACIENTE, label: "Objetivos del Paciente", icon: "target" },
    { path: ROUTE_PATHS.GESTION_EMOCIONES, label: "Gestión de Emociones", icon: "emotion" },
    { path: ROUTE_PATHS.DISPONIBILIDAD, label: "Mi disponibilidad", icon: "availability" },
    { path: ROUTE_PATHS.CONSULTAS, label: "Mis consultas", icon: "consultation" },
    { path: ROUTE_PATHS.CHAT, label: "Mensajes", icon: "chat" },
    { path: ROUTE_PATHS.CONSULTAS_ONLINE, label: "Consultas Online", icon: "online" },
    { path: ROUTE_PATHS.TEST_MENU, label: "Gestión de Pruebas", icon: "test" },
    { path: ROUTE_PATHS.MOSTRAR_INFORME, label: "Mostrar Informe", icon: "consultation" },
    { path: ROUTE_PATHS.PERFIL_PSICOLOGO, label: "Perfil", icon: "profile" },
    { path: ROUTE_PATHS.HELP, label: "Ayuda", icon: "help" },
  ],
};
