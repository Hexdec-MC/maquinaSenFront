# Heavy Machinery Local - Frontend

Sistema mejorado de gestión de maquinaria con arquitectura modular y componentes reutilizables.

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── common/                 # Componentes reutilizables
│   │   ├── Alert.tsx          # Alertas/notificaciones
│   │   ├── Button.tsx         # Botón con variantes
│   │   ├── Card.tsx           # Tarjeta contenedora
│   │   ├── FormInput.tsx      # Input de formulario
│   │   ├── Loader.tsx         # Cargador
│   │   ├── Modal.tsx          # Modal/diálogo
│   │   └── index.ts           # Exportaciones
│   ├── pages/                 # Componentes de página
│   │   ├── Login.tsx          # Pantalla de login
│   │   ├── MachineManagement.tsx
│   │   ├── MaintenanceManagement.tsx
│   │   ├── InventoryManagement.tsx
│   │   └── index.ts
│   └── App.tsx                # Componente principal
├── hooks/                      # Hooks personalizados
│   ├── useAuth.ts             # Gestión de autenticación
│   ├── useApi.ts              # Llamadas API
│   ├── useMessage.ts          # Sistema de mensajes
│   ├── useMachineData.ts      # Datos de máquinas
│   └── index.ts
├── types/                      # Tipos TypeScript
│   └── index.ts               # Definiciones de tipos
└── utils/                      # Utilidades
    └── constants.ts           # Constantes y funciones auxiliares
```

## ✨ Mejoras Implementadas

### Lógica
- ✅ **Separación de responsabilidades**: Hooks personalizados para autenticación, API y datos
- ✅ **Manejo de errores mejorado**: Validación de formularios y mensajes descriptivos
- ✅ **Tipado fuerte**: TypeScript con interfaces definidas para todos los datos
- ✅ **Gestión de estado centralizada**: Hooks reutilizables en lugar de state local

### UI/UX
- ✅ **Diseño moderno**: Gradientes, sombras y espaciado consistente
- ✅ **Componentes reutilizables**: Button, FormInput, Card, Modal, Alert
- ✅ **Variantes de botones**: primary, secondary, danger, success
- ✅ **Sistema de alertas mejorado**: success, error, warning, info
- ✅ **Feedback visual**: Indicadores de estado (En Uso/Disponible), colores de mantenimiento
- ✅ **Responsive design**: Grillas adaptables sm/md/lg
- ✅ **Iconos descriptivos**: Emojis para mejor comprensión visual
- ✅ **Estados de carga**: Spinner durante carga de datos
- ✅ **Validaciones visuales**: Campos requeridos, errores destacados

### Componentes
- ✅ **MachineCard**: Tarjeta individual de máquina con estado
- ✅ **SupplyCard**: Tarjeta de suministro con alerta de stock bajo
- ✅ **MachineMaintenanceCard**: Card con estado de PM (vencido/próximo)
- ✅ **MaintenanceHistoryItem**: Item del historial con detalles
- ✅ **Tabs**: Sistema de navegación mejorado
- ✅ **Header**: Encabezado con info de usuario
- ✅ **FormInput**: Input reutilizable con label y validación
- ✅ **Alert**: Notificación con 4 tipos

## 🎯 Características Principales

### Autenticación
- Login mejorado con validación
- Gestión de usuario y rol
- Logout seguro

### Maquinaria
- Registro de máquinas con horómetro inicial
- Cálculo automático del próximo PM
- Estados visuales (En Uso/Disponible)
- Grilla responsiva con detalles

### Mantenimiento
- Dashboard de estado de PMs (vencidos, por vencer, vigentes)
- Registro de mantenimiento con historial
- Alertas visuales para PMs vencidos
- Cálculo automático de próximo PM

### Inventario
- Gestión de suministros con stock
- Alerta de stock bajo
- Estadísticas de totales
- Visualización por categoría

## 🚀 Componentes Principales

### `useAuth` Hook
```typescript
const { user, isLoading, error, login, logout } = useAuth();
```

### `useApi` Hook
```typescript
const { fetchMachines, fetchSupplies, post, put } = useApi();
```

### `useMessage` Hook
```typescript
const { message, showMessage, clearMessage } = useMessage();
```

### Button Variants
```typescript
<Button variant="primary|secondary|danger|success" size="sm|md|lg">
```

### Alert Types
```typescript
<Alert type="success|error|warning|info" text="..." />
```

## 📊 Tipos Disponibles

```typescript
interface Machine { ... }
interface Supply { ... }
interface MaintenanceRecord { ... }
interface User { ... }
interface Message { ... }
```

## 🎨 Colores y Estilos

- **Primary**: Indigo/Blue (#4F46E5)
- **Success**: Green (#16A34A)
- **Danger**: Red (#DC2626)
- **Warning**: Yellow (#CA8A04)
- **Info**: Blue (#2563EB)

## 📦 Dependencias

- React 18+
- TypeScript
- Tailwind CSS
- lucide-react (iconos)

## 🔧 Uso

```bash
# Instalar dependencias
npm install

# Ejecutar desarrollo
npm run dev

# Build
npm run build
```

---

**Versión**: 2.0
**Última actualización**: Noviembre 2025
