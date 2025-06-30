# 🎮 Gestor de Materiales y Equipos - Deck Heroes

Una aplicación web completa para gestionar materiales, simular conversiones y crear equipos en Deck Heroes. Permite organizar inventarios, calcular conversiones automáticas y simular el uso de recursos para crear equipos de diferentes calidades y clases.

## ℹ️ Guía de Ayuda Multiidioma

La sección de ayuda y guía de uso está disponible en varios idiomas. Puedes cambiar el idioma de la ayuda desde la pestaña correspondiente haciendo clic en la bandera de tu preferencia.

**Idiomas disponibles para la ayuda:**
- Español (es)
- Inglés (en)
- Ruso (ru)
- Alemán (de)
- Portugués (pt)
- Italiano (it)
- Francés (fr)

---

## 🖼️ Ejemplos visuales

### Pantalla principal de la aplicación
![Vista principal de la app](screenshots/vista-principal.png)

### Sección de ayuda multiidioma
![Ayuda multiidioma con banderas](screenshots/ayuda-multiidioma.png)

### Galería de imágenes
![Galería de imágenes](screenshots/galeria.png)

### Tabla de materiales
![Tabla de materiales](screenshots/tabla-materiales.png)

### Simulación de equipo (ARTE)
![Simulación de equipo en ARTE](screenshots/arte-simulacion.png)

---

## ✨ Características Principales

### 🛠️ Gestión de Materiales Avanzada
- **Inventario dinámico**: Controla cantidades de materiales por color (Blanco, Verde, Azul, Morado, Dorado)
- **Sistema de backup manual**: Guarda y carga tus datos en archivos JSON
- **Restricciones por clase**: Cada clase tiene sus propias limitaciones de nivel y colores
- **Materiales específicos**: Diferentes materiales según el tipo de equipo y clase

### 🔄 Sistema de Conversiones Automáticas
- **Calculadora en tiempo real**: Convierte materiales entre diferentes calidades automáticamente
- **5 pestañas de conversión**: Verde, Azul, Morado, Dorado y Leyenda
- **Tablas de equivalencia**: Visualiza las relaciones entre materiales
- **Simulación instantánea**: Ve cómo afectan las conversiones a tu inventario

### ⚔️ Creación de Equipos Completa
- **6 tipos de equipo**: Espada, Pecho, Botas, Casco, Guantes, Cinturón
- **5 clases especiales**: Normal, Campeón, Planewalker, Lord, Noble Lord
- **Sistema de niveles**: Del nivel 1 al 5 con restricciones automáticas
- **5 calidades**: Blanco, Verde, Azul, Morado, Dorado
- **Restricciones automáticas**:
  - **Campeón**: Solo nivel 4, colores Azul/Morado/Dorado
  - **Planewalker**: Solo nivel 5, colores Azul/Morado/Dorado
  - **Lord**: Solo nivel 5, colores Azul/Morado/Dorado
  - **Noble Lord**: Solo nivel 5, colores Azul/Morado/Dorado

### 🎨 Galería de Imágenes
- **Almacenamiento en base64**: Las imágenes se guardan completas en el backup
- **Carrusel interactivo**: Navega por tus imágenes guardadas
- **Soporte múltiples formatos**: JPG, PNG, GIF, etc.
- **Botón de agregar**: Fácil adición de nuevas imágenes

### 💾 Sistema de Backup Manual
- **Botón flotante (FAB)**: Acceso rápido a guardar/cargar datos
- **Backup completo**: Incluye materiales, galería y equipos simulados
- **Archivo JSON**: Formato estándar y portable
- **Sin dependencias**: No requiere servidor ni base de datos

## 🚀 Cómo Usar la Aplicación

### 1. Configurar Equipo
1. **Selecciona el tipo de equipo** (Espada, Pecho, Botas, etc.)
2. **Elige la clase** (Normal, Campeón, Planewalker, Lord, Noble Lord)
3. **Define el nivel** (1-5, se ajusta automáticamente según la clase)
4. **Selecciona la calidad objetivo** (Blanco a Dorado)

### 2. Gestionar Materiales
- **Pestaña Materiales**: Inventario actual y edición de cantidades
- **Pestañas de Conversión**: 
  - **>> Verde**: Convierte todo a Verde
  - **>> Azul**: Convierte todo a Azul
  - **>> Morado**: Convierte todo a Morado
  - **>> Dorado**: Convierte todo a Dorado
- **Pestaña Leyenda**: Tabla de equivalencias y conversiones
- **Pestaña ARTE**: Historial de equipos simulados

### 3. Simular Uso de Materiales
1. **Ajusta las cantidades** en los inputs de colores
2. **Haz clic en "USAR"** para simular la creación del equipo
3. **Ve el resultado** en la pestaña ARTE
4. **Gestiona equipos simulados** con botones de eliminar

### 4. Backup y Restauración
1. **Guardar datos**: Haz clic en el botón flotante (disquette) → "Guardar"
2. **Cargar datos**: Haz clic en el botón flotante → "Cargar" → Selecciona archivo
3. **Limpiar datos**: Haz clic en el botón flotante → "Limpiar"

### 5. Galería de Imágenes
1. **Abrir galería**: Haz clic en el botón de galería
2. **Agregar imagen**: Haz clic en el botón "+" verde
3. **Ver imagen**: Haz clic en cualquier imagen para abrir el carrusel
4. **Eliminar imagen**: Haz clic en la "X" roja de cada imagen

## 📊 Sistema de Conversiones

### Tabla de Equivalencias
| Calidad | Blanco | Verde | Azul | Morado | Dorado |
|---------|--------|-------|------|--------|--------|
| **Blanco** | 1 | 4 | 16 | 64 | 256 |
| **Verde** | 0 | 1 | 4 | 16 | 64 |
| **Azul** | 0 | 0 | 1 | 4 | 16 |
| **Morado** | 0 | 0 | 0 | 1 | 4 |
| **Dorado** | 0 | 0 | 0 | 0 | 1 |

### Conversiones Principales:
- **4 Blancos = 1 Verde**
- **4 Verdes = 1 Azul**
- **4 Azules = 1 Morado**
- **4 Morados = 1 Dorado**
- **16 Blancos = 1 Azul**
- **64 Blancos = 1 Morado**
- **256 Blancos = 1 Dorado**

## 🎨 Características Visuales

### Diseño Moderno
- **Transiciones suaves**: Animaciones de 0.6s entre pestañas
- **Fondo dinámico**: Cambia según el color del equipo seleccionado
- **Fondo inicial**: Gris ónix por 9 segundos al cargar
- **Responsive design**: Se adapta perfectamente a móviles y escritorio

### Interfaz Optimizada
- **Tablas compactas**: Texto pequeño y truncamiento automático
- **Columnas adaptativas**: Se ajustan al ancho de la pantalla
- **Iconos sociales**: Enlaces a WhatsApp, Telegram y YouTube
- **Modales elegantes**: Galería y lista de materiales con animaciones

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Módulos**: ES6 Modules para organización del código
- **Almacenamiento**: Sistema de backup manual con archivos JSON
- **Responsive**: Diseño adaptable a móviles y escritorio
- **Sin dependencias**: JavaScript puro sin librerías externas

## 📁 Estructura del Proyecto

```
art-manager-v1.3.8/
├── index.html              # Página principal
├── estilos/                # Hojas de estilo CSS
│   ├── principal.css       # Estilos principales
│   ├── tablas.css          # Estilos de tablas y columnas
│   ├── modales.css         # Estilos de modales
│   ├── galeria.css         # Estilos de galería
│   └── responsive.css      # Diseño responsive
├── scripts/                # Módulos JavaScript
│   ├── app.js             # Aplicación principal
│   ├── datos.js           # Datos y configuraciones
│   ├── ui.js              # Interfaz de usuario y transiciones
│   ├── eventos.js         # Manejo de eventos
│   ├── materiales.js      # Lógica de materiales
│   ├── conversiones.js    # Sistema de conversiones
│   ├── galeria.js         # Gestión de galería
│   ├── modales.js         # Sistema de modales
│   ├── simulacion.js      # Simulación de uso
│   ├── arte.js            # Lógica de equipos simulados
│   ├── baselogic.js       # Lógica base del selector
│   └── backup.js          # Sistema de backup manual
└── images/                # Imágenes del proyecto
    ├── icon-192.png       # Iconos de equipos
    └── ...                # Otras imágenes
```

## 🌐 Despliegue

Esta aplicación está optimizada para funcionar en cualquier hosting estático:

- **GitHub Pages**: ✅ Compatible
- **Netlify**: ✅ Compatible  
- **Vercel**: ✅ Compatible
- **Servidor local**: ✅ Compatible
- **Móviles**: ✅ Funciona perfectamente en navegadores móviles

## 📱 Compatibilidad

- **Navegadores modernos**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Escritorio, tablet, móvil
- **Funcionamiento offline**: Sistema de backup manual disponible
- **Navegación privada**: Compatible con modo incógnito

## 🔧 Características Técnicas

- **Sin dependencias externas**: JavaScript puro
- **Módulos ES6**: Organización modular del código
- **Backup manual**: Sistema robusto de guardado/carga
- **Responsive Design**: Adaptable a cualquier pantalla
- **Transiciones CSS**: Animaciones suaves y profesionales
- **5,268 líneas de código**: Aplicación completa y funcional

## 🤝 Comunidad

Únete a nuestra comunidad para compartir estrategias y equipos:

- **WhatsApp**: https://chat.whatsapp.com/DN5X1L7BqiJAMk4llRkLrN
- **Telegram**: https://t.me/+MJ8GLGcdPX9iMTcx
- **YouTube**: https://www.youtube.com/@DecodificandoDH

## 🎯 Roadmap Futuro

En un futuro lejano (por falta de tiempo):

- [ ] Sistema de recetas personalizadas
- [ ] Porcentajes de éxito en conversiones
- [ ] Modo oscuro/claro
- [ ] Aplicación para Windows
- [ ] Aplicación móvil nativa
- [ ] Sincronización en la nube

---

**Desarrollado con ❤️ para la comunidad de Deck Heroes**

*¿Tienes alguna pregunta o sugerencia? Por favor, comunícate con nosotros a través de los enlaces de la comunidad.* 