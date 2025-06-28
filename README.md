# 🎮 Gestor de Materiales y Creación de Equipos

Una aplicación web para gestionar materiales y simular la creación de equipos en videojuegos RPG. Permite organizar inventarios, calcular conversiones de materiales y simular el uso de recursos para crear equipos de diferentes calidades.

## ✨ Características Principales

### 🛠️ Gestión de Materiales
- **Inventario dinámico**: Controla cantidades de materiales por color (Blanco, Verde, Azul, Morado, Dorado)
- **Almacenamiento local**: Los datos se guardan automáticamente en tu navegador
- **Importación/Exportación CSV**: Compatible con hojas de cálculo

### 🔄 Sistema de Conversiones
- **Calculadora automática**: Convierte materiales entre diferentes calidades
- **Tablas de equivalencia**: Visualiza las relaciones entre materiales
- **Simulación en tiempo real**: Ve cómo afectan las conversiones a tu inventario

### ⚔️ Creación de Equipos
- **Múltiples tipos**: Espada, Pecho, Botas, Casco, Guantes, Cinturón
- **Diferentes clases**: Normal, Campeón, Planewalker, Lord, Noble Lord
- **Sistema de niveles**: Del nivel 1 al 5
- **Calidades variables**: Blanco, Verde, Azul, Morado, Dorado

### 🎨 Galería de Imágenes
- **Almacenamiento local**: Guarda imágenes de referencia
- **Carrusel interactivo**: Navega por tus imágenes guardadas
- **Soporte múltiples formatos**: JPG, PNG, GIF, etc.

## 🚀 Cómo Usar

### 1. Configurar Equipo
- Selecciona el tipo de equipo (Espada, Pecho, etc.)
- Elige la clase (Normal, Campeón, etc.)
- Define el nivel (1-5)
- Selecciona la calidad objetivo (Blanco a Dorado)

### 2. Gestionar Materiales
- Usa las pestañas para ver diferentes vistas:
  - **Materiales**: Inventario actual
  - **>> Verde**: Conversión a Verde
  - **>> Azul**: Conversión a Azul
  - **>> Morado**: Conversión a Morado
  - **>> Dorado**: Conversión a Dorado
  - **ARTE**: Equipos simulados

### 3. Simular Uso
- Ajusta las cantidades de materiales
- Haz clic en "USAR" para simular la creación
- Ve el resultado en tiempo real

## 📊 Sistema de Conversiones

| Calidad | Blanco | Verde | Azul | Morado | Dorado |
|---------|--------|-------|------|--------|--------|
| **Blanco** | 1 | 4 | 16 | 64 | 256 |
| **Verde** | 0 | 1 | 4 | 16 | 64 |
| **Azul** | 0 | 0 | 1 | 4 | 16 |
| **Morado** | 0 | 0 | 0 | 1 | 4 |
| **Dorado** | 0 | 0 | 0 | 0 | 1 |

### Equivalencias Principales:
- 4 Blancos = 1 Verde
- 4 Verdes = 1 Azul
- 4 Azules = 1 Morado
- 4 Morados = 1 Dorado

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Módulos**: ES6 Modules para organización del código
- **Almacenamiento**: LocalStorage para persistencia de datos
- **Responsive**: Diseño adaptable a móviles y escritorio

## 📁 Estructura del Proyecto

```
gestor-de-materiales/
├── index.html              # Página principal
├── estilos/                # Hojas de estilo CSS
│   ├── principal.css       # Estilos principales
│   ├── tablas.css          # Estilos de tablas
│   ├── modales.css         # Estilos de modales
│   ├── galeria.css         # Estilos de galería
│   └── responsive.css      # Diseño responsive
├── scripts/                # Módulos JavaScript
│   ├── app.js             # Aplicación principal
│   ├── datos.js           # Datos y configuraciones
│   ├── ui.js              # Interfaz de usuario
│   ├── eventos.js         # Manejo de eventos
│   ├── materiales.js      # Lógica de materiales
│   ├── conversiones.js    # Sistema de conversiones
│   ├── galeria.js         # Gestión de galería
│   ├── modales.js         # Sistema de modales
│   ├── csv.js             # Importación/exportación CSV
│   ├── simulacion.js      # Simulación de uso
│   ├── arte.js            # Lógica de equipos simulados
│   └── baselogic.js       # Lógica base del selector
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


## 📱 Compatibilidad

- **Navegadores modernos**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Escritorio, tablet, móvil
- **Funcionamiento offline**: Almacenamiento local disponible

## 🔧 Características Técnicas

- **Sin dependencias externas**: JavaScript puro
- **Módulos ES6**: Organización modular del código
- **LocalStorage**: Persistencia de datos sin servidor
- **Responsive Design**: Adaptable a cualquier pantalla
- **PWA Ready**: Preparado para futuras mejoras PWA

## 🤝 Contribuir

Si quieres contribuir al proyecto:

1. Únete a nuestra comunidad en whatsapp y telegram

	https://chat.whatsapp.com/DN5X1L7BqiJAMk4llRkLrN
	
	https://t.me/+MJ8GLGcdPX9iMTcx
	
2. Da ideas o contribuye con la codificación

3. Invita a tus amigos a jugar con nosotros o por lo menos que instalen el juego :D


## 🎯 Roadmap

	En un futuro lejano (por falta de tiempo):

- [ ] Sistema de recetas personalizadas
- [ ] Porcentajes de éxito
- [ ] Modo oscuro
- [ ] Aplicación para windows
- [ ] Aplicación móvil nativa

---

**Desarrollado con ❤️ para la comunidad de Deck Heroes**

*¿Tienes alguna pregunta o sugerencia? Por favor, comunícate con nosotros para comentarla. 
