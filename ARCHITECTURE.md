# PsicoWeb Frontend - Arquitectura Refactorizada

## 🏗️ Nueva Estructura del Proyecto

```
src/
├── components/           → Componentes reutilizables organizados por responsabilidad
│   ├── ui/              → Componentes básicos de UI (Button, Input, Card, etc.)
│   ├── features/        → Componentes específicos de funcionalidad (AppointmentCard, etc.)
│   ├── layout/          → Componentes de layout (NavigationSidebar, Header, etc.)
│   └── index.js         → Exportaciones centralizadas
├── pages/               → Páginas principales con lógica compuesta
│   ├── PatientDashboard.jsx
│   ├── PsychologistDashboard.jsx
│   └── ...
├── hooks/               → Hooks personalizados para encapsular lógica reactiva
│   ├── useAuth.js
│   ├── usePatientAppointments.js
│   ├── usePsychologistAppointments.js
│   └── usePsychologistPatients.js
├── services/            → Servicios de conexión con el backend
│   └── authService.js
├── store/               → Estado global centralizado
│   └── authStore.js
├── routes/              → Configuración de rutas centralizadas
│   ├── AppRoutes.jsx
│   └── routePaths.js
├── utils/               → Funciones auxiliares reutilizables
│   └── classNames.js
├── constants/           → Constantes de la aplicación
│   └── index.js
├── assets/              → Recursos estáticos
├── config/              → Configuración (mantiene compatibilidad)
└── App.jsx              → Entrada principal simplificada
```

## 🎯 Principios Aplicados

### 1. **Single Responsibility Principle (SRP)**
- Cada componente tiene una única responsabilidad
- Los hooks encapsulan lógica específica
- Separación clara entre presentación y lógica de negocio

### 2. **Open/Closed Principle (OCP)**
- Componentes extensibles sin modificación
- Sistema de variantes en componentes UI
- Interfaces consistentes para nuevas funcionalidades

### 3. **Dependency Inversion Principle (DIP)**
- Hooks abstraen la lógica de datos
- Componentes dependen de abstracciones, no implementaciones
- Store centralizado para gestión de estado

### 4. **DRY (Don't Repeat Yourself)**
- Componentes UI reutilizables
- Rutas centralizadas
- Funciones utilitarias compartidas

### 5. **Separation of Concerns**
- Lógica de negocio separada de presentación
- Estado global vs local bien definido
- Servicios independientes para comunicación con API

## 📦 Componentes Principales

### UI Components (Atomic Design)
- **Button**: Componente base con variantes y estados
- **Input**: Campo de entrada con validación y estilos
- **Card**: Contenedor flexible con subcomponentes
- **LoadingSpinner**: Indicador de carga reutilizable

### Feature Components
- **AppointmentCard**: Tarjeta individual de cita
- **AppointmentList**: Lista organizada de citas
- **PsychologistCard**: Tarjeta de información de psicólogo

### Layout Components
- **NavigationSidebar**: Barra de navegación adaptativa por rol

## 🔄 Hooks Personalizados

### useAuth
- Gestión centralizada de autenticación
- Validación automática de tokens
- Normalización de datos de usuario

### usePatientAppointments
- Carga y gestión de citas del paciente
- Formateo automático de datos
- Manejo de estados de carga y error

### usePsychologistAppointments
- Gestión de citas por psicólogo
- Filtrado por estados (próximas, pasadas, canceladas)
- Ordenamiento automático

### usePsychologistPatients
- Lista de pacientes asignados
- Información consolidada de pacientes
- Estados de actividad

## 🛣️ Sistema de Rutas

### Rutas Centralizadas
- `ROUTE_PATHS`: Constantes para todas las rutas
- `NAVIGATION_ROUTES`: Configuración de menús por rol
- `AppRoutes`: Componente principal de rutas con lazy loading

### Características
- Lazy loading para mejor rendimiento
- Rutas protegidas automáticas
- Componentes de carga y error
- Compatibilidad con rutas existentes

## 📊 Gestión de Estado

### AuthStore (Nuevo)
- Estado reactivo con useReducer
- Acciones tipadas
- Verificación automática de autenticación
- Mejores prácticas de Redux sin complejidad

### Compatibilidad
- Mantiene AuthContext para componentes existentes
- Migración gradual sin breaking changes

## 🎨 Sistema de Diseño

### Clases CSS Utilitarias
- Función `cn()` para combinar clases
- Variantes predefinidas en componentes
- Consistencia visual automática

### Tokens de Diseño
- Colores, espaciados y tipografías estandarizados
- Componentes adaptativos
- Temas futuros preparados

## 🔧 Herramientas y Utilidades

### classNames.js
- Combinación inteligente de clases CSS
- Soporte para clases condicionales
- Alternativa ligera a clsx/classnames

### Constantes
- Configuración centralizada
- Roles de usuario tipados
- Estados de aplicación estandarizados

## 📈 Beneficios de la Refactorización

### Mantenibilidad
- Código más legible y organizado
- Responsabilidades claras
- Fácil localización de funcionalidades

### Escalabilidad
- Componentes reutilizables
- Patrones consistentes
- Extensión sin modificación

### Testabilidad
- Componentes aislados
- Hooks testables independientemente
- Lógica de negocio separada

### Rendimiento
- Lazy loading de componentes
- Optimizaciones de re-renderizado
- Carga diferida de recursos

### Experiencia de Desarrollo
- TypeScript ready (preparado para migración)
- Mejor IntelliSense
- Patrones predecibles

## 🔄 Migración y Compatibilidad

### Estrategia de Migración
1. **Fase 1**: Nuevos componentes usan nueva arquitectura
2. **Fase 2**: Migración gradual de componentes existentes
3. **Fase 3**: Eliminación de código legacy

### Compatibilidad
- Todas las rutas existentes funcionan
- Estados compartidos mantienen funcionalidad
- APIs de backend sin cambios

### Próximos Pasos
1. Migrar componentes de formularios
2. Implementar sistema de temas
3. Añadir TypeScript gradualmente
4. Optimizar bundle size
5. Implementar testing automatizado

## 🧪 Testing Strategy

### Unit Testing
- Componentes UI aislados
- Hooks con React Testing Library
- Funciones utilitarias puras

### Integration Testing
- Flujos de usuario completos
- Interacciones entre componentes
- Estados de aplicación

### E2E Testing
- Funcionalidades críticas
- Flujos de autenticación
- Reserva de citas

---

Esta refactorización mantiene **100% de compatibilidad** con el backend existente mientras mejora significativamente la arquitectura frontend para futuras expansiones y mantenimiento.
