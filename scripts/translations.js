// scripts/translations.js
// Sistema de traducciones multiidioma

export const translations = {
    es: {
        // Español (idioma por defecto)
        title: "📖 Guía de Uso - Gestor de Materiales",
        whatIsApp: {
            title: "🎯 ¿Qué es esta aplicación?",
            description: "Esta aplicación te ayuda a gestionar materiales y equipos para el juego Deck Heroes. Puedes:",
            features: [
                "Ver materiales necesarios para equipos específicos",
                "Calcular conversiones entre diferentes calidades de materiales",
                "Simular equipos en la pestaña ARTE",
                "Guardar imágenes de referencia en la galería"
            ]
        },
        howToUse: {
            title: "⚙️ Cómo usar los selectores",
            steps: [
                "Equipo: Selecciona el tipo de equipo (Espada, Pecho, Botas, etc.)",
                "Clase: Elige la clase del equipo (Normal, Campeón, Planewalker, etc.)",
                "Nivel: Selecciona el nivel del equipo (1-5)",
                "Color: Elige la calidad del material (Blanco, Verde, Azul, Morado, Dorado)"
            ],
            note: "💡 Nota: Algunas clases especiales tienen restricciones en niveles y colores permitidos."
        },
        tabs: {
            title: "📊 Pestañas disponibles",
            tabs: [
                "Materiales: Muestra los materiales necesarios para el equipo seleccionado",
                ">> Verde/Azul/Morado/Dorado: Calcula conversiones hacia esa calidad",
                "Leyenda: Muestra la tabla de equivalencias entre calidades",
                "ARTE: Simula equipos con diferentes configuraciones"
            ]
        },
        gallery: {
            title: "🖼️ Galería de imágenes",
            description: "Puedes guardar imágenes de referencia para ayudarte a recordar:",
            features: [
                "Haz clic en el botón de galería (📷) en la parte inferior",
                "Usa el botón \"+\" para agregar nuevas imágenes",
                "Haz clic en una imagen para verla en pantalla completa",
                "Usa el botón \"×\" para eliminar imágenes"
            ]
        },
        saveLoad: {
            title: "💾 Guardar y cargar datos",
            description: "Para mantener tus datos seguros:",
            features: [
                "Usa el botón flotante de guardado (💾) en la esquina superior derecha",
                "Selecciona \"Guardar datos\" para descargar un archivo JSON",
                "Usa \"Cargar datos\" para restaurar desde un archivo guardado",
                "Usa \"Limpiar datos\" para borrar todos los datos locales",
                "⚠️ Importante: Los datos se guardan localmente, no en la nube"
            ]
        },
        floatingButtons: {
            title: "📋 Botones flotantes",
            description: "En la esquina superior derecha encontrarás dos botones flotantes:",
            features: [
                "Botón superior (💾): Opciones de gestión de datos (guardar, cargar, limpiar)",
                "Botón inferior (📋): Muestra la lista completa de materiales",
                "💡 Los botones se adaptan automáticamente a diferentes tamaños de pantalla"
            ]
        },
        arte: {
            title: "🎨 Pestaña ARTE",
            description: "En la pestaña ARTE puedes:",
            features: [
                "Ver una tabla completa de todos los equipos posibles",
                "Ver los materiales necesarios para cada configuración",
                "Usar esta información para planificar tu progreso"
            ]
        },
        responsive: {
            title: "📱 Diseño responsive",
            description: "La aplicación se adapta automáticamente a diferentes dispositivos:",
            features: [
                "Desktop: Interfaz completa con todos los elementos visibles",
                "Tablet: Elementos reorganizados para pantallas medianas",
                "Móvil: Interfaz optimizada para pantallas pequeñas",
                "💡 Los selectores de materiales mantienen su forma cuadrada en todas las resoluciones"
            ]
        },
        links: {
            title: "🔗 Enlaces útiles",
            description: "Únete a nuestra comunidad:",
            features: [
                "WhatsApp: Grupo de jugadores para consultas y estrategias",
                "Telegram: Canal oficial con noticias y actualizaciones",
                "YouTube: Tutorials y contenido educativo"
            ]
        },
        backButton: "← Volver a Materiales"
    },
    en: {
        // English
        title: "📖 User Guide - Material Manager",
        whatIsApp: {
            title: "🎯 What is this application?",
            description: "This application helps you manage materials and equipment for the Deck Heroes game. You can:",
            features: [
                "View materials needed for specific equipment",
                "Calculate conversions between different material qualities",
                "Simulate equipment in the ARTE tab",
                "Save reference images in the gallery"
            ]
        },
        howToUse: {
            title: "⚙️ How to use the selectors",
            steps: [
                "Equipment: Select the type of equipment (Sword, Chest, Boots, etc.)",
                "Class: Choose the equipment class (Normal, Champion, Planewalker, etc.)",
                "Level: Select the equipment level (1-5)",
                "Color: Choose the material quality (White, Green, Blue, Purple, Gold)"
            ],
            note: "💡 Note: Some special classes have restrictions on allowed levels and colors."
        },
        tabs: {
            title: "📊 Available tabs",
            tabs: [
                "Materials: Shows materials needed for the selected equipment",
                ">> Green/Blue/Purple/Gold: Calculates conversions to that quality",
                "Legend: Shows the equivalence table between qualities",
                "ARTE: Simulates equipment with different configurations"
            ]
        },
        gallery: {
            title: "🖼️ Image gallery",
            description: "You can save reference images to help you remember:",
            features: [
                "Click the gallery button (📷) at the bottom",
                "Use the \"+\" button to add new images",
                "Click on an image to view it full screen",
                "Use the \"×\" button to delete images"
            ]
        },
        saveLoad: {
            title: "💾 Save and load data",
            description: "To keep your data safe:",
            features: [
                "Use the floating save button (💾) in the top right corner",
                "Select \"Save data\" to download a JSON file",
                "Use \"Load data\" to restore from a saved file",
                "Use \"Clear data\" to delete all local data",
                "⚠️ Important: Data is saved locally, not in the cloud"
            ]
        },
        floatingButtons: {
            title: "📋 Floating buttons",
            description: "In the top right corner you'll find two floating buttons:",
            features: [
                "Top button (💾): Data management options (save, load, clear)",
                "Bottom button (📋): Shows the complete materials list",
                "💡 Buttons automatically adapt to different screen sizes"
            ]
        },
        arte: {
            title: "🎨 ARTE tab",
            description: "In the ARTE tab you can:",
            features: [
                "View a complete table of all possible equipment",
                "See materials needed for each configuration",
                "Use this information to plan your progress"
            ]
        },
        responsive: {
            title: "📱 Responsive design",
            description: "The application automatically adapts to different devices:",
            features: [
                "Desktop: Complete interface with all elements visible",
                "Tablet: Elements reorganized for medium screens",
                "Mobile: Interface optimized for small screens",
                "💡 Material selectors maintain their square shape at all resolutions"
            ]
        },
        links: {
            title: "🔗 Useful links",
            description: "Join our community:",
            features: [
                "WhatsApp: Player group for queries and strategies",
                "Telegram: Official channel with news and updates",
                "YouTube: Tutorials and educational content"
            ]
        },
        backButton: "← Back to Materials"
    },
    ru: {
        // Русский
        title: "📖 Руководство пользователя - Менеджер материалов",
        whatIsApp: {
            title: "🎯 Что это за приложение?",
            description: "Это приложение помогает управлять материалами и снаряжением для игры Deck Heroes. Вы можете:",
            features: [
                "Просматривать материалы, необходимые для конкретного снаряжения",
                "Рассчитывать конверсии между различными качествами материалов",
                "Симулировать снаряжение во вкладке ARTE",
                "Сохранять справочные изображения в галерее"
            ]
        },
        howToUse: {
            title: "⚙️ Как использовать селекторы",
            steps: [
                "Снаряжение: Выберите тип снаряжения (Меч, Грудь, Сапоги и т.д.)",
                "Класс: Выберите класс снаряжения (Обычный, Чемпион, Планеходец и т.д.)",
                "Уровень: Выберите уровень снаряжения (1-5)",
                "Цвет: Выберите качество материала (Белый, Зеленый, Синий, Фиолетовый, Золотой)"
            ],
            note: "💡 Примечание: Некоторые специальные классы имеют ограничения на разрешенные уровни и цвета."
        },
        tabs: {
            title: "📊 Доступные вкладки",
            tabs: [
                "Материалы: Показывает материалы, необходимые для выбранного снаряжения",
                ">> Зеленый/Синий/Фиолетовый/Золотой: Рассчитывает конверсии к этому качеству",
                "Легенда: Показывает таблицу эквивалентности между качествами",
                "ARTE: Симулирует снаряжение с различными конфигурациями"
            ]
        },
        gallery: {
            title: "🖼️ Галерея изображений",
            description: "Вы можете сохранять справочные изображения, чтобы помочь запомнить:",
            features: [
                "Нажмите кнопку галереи (📷) внизу",
                "Используйте кнопку \"+\" для добавления новых изображений",
                "Нажмите на изображение, чтобы просмотреть его в полноэкранном режиме",
                "Используйте кнопку \"×\" для удаления изображений"
            ]
        },
        saveLoad: {
            title: "💾 Сохранение и загрузка данных",
            description: "Чтобы сохранить ваши данные в безопасности:",
            features: [
                "Используйте плавающую кнопку сохранения (💾) в правом верхнем углу",
                "Выберите \"Сохранить данные\" для загрузки JSON файла",
                "Используйте \"Загрузить данные\" для восстановления из сохраненного файла",
                "Используйте \"Очистить данные\" для удаления всех локальных данных",
                "⚠️ Важно: Данные сохраняются локально, не в облаке"
            ]
        },
        floatingButtons: {
            title: "📋 Плавающие кнопки",
            description: "В правом верхнем углу вы найдете две плавающие кнопки:",
            features: [
                "Верхняя кнопка (💾): Опции управления данными (сохранить, загрузить, очистить)",
                "Нижняя кнопка (📋): Показывает полный список материалов",
                "💡 Кнопки автоматически адаптируются к различным размерам экрана"
            ]
        },
        arte: {
            title: "🎨 Вкладка ARTE",
            description: "Во вкладке ARTE вы можете:",
            features: [
                "Просматривать полную таблицу всех возможных снаряжений",
                "Видеть материалы, необходимые для каждой конфигурации",
                "Использовать эту информацию для планирования прогресса"
            ]
        },
        responsive: {
            title: "📱 Адаптивный дизайн",
            description: "Приложение автоматически адаптируется к различным устройствам:",
            features: [
                "Десктоп: Полный интерфейс со всеми видимыми элементами",
                "Планшет: Элементы реорганизованы для средних экранов",
                "Мобильный: Интерфейс оптимизирован для маленьких экранов",
                "💡 Селекторы материалов сохраняют квадратную форму на всех разрешениях"
            ]
        },
        links: {
            title: "🔗 Полезные ссылки",
            description: "Присоединяйтесь к нашему сообществу:",
            features: [
                "WhatsApp: Группа игроков для запросов и стратегий",
                "Telegram: Официальный канал с новостями и обновлениями",
                "YouTube: Учебные пособия и образовательный контент"
            ]
        },
        backButton: "← Вернуться к материалам"
    },
    de: {
        // Deutsch
        title: "📖 Benutzerhandbuch - Materialmanager",
        whatIsApp: {
            title: "🎯 Was ist diese Anwendung?",
            description: "Diese Anwendung hilft Ihnen bei der Verwaltung von Materialien und Ausrüstung für das Spiel Deck Heroes. Sie können:",
            features: [
                "Materialien anzeigen, die für spezifische Ausrüstung benötigt werden",
                "Konvertierungen zwischen verschiedenen Materialqualitäten berechnen",
                "Ausrüstung im ARTE-Tab simulieren",
                "Referenzbilder in der Galerie speichern"
            ]
        },
        howToUse: {
            title: "⚙️ Wie man die Selektoren verwendet",
            steps: [
                "Ausrüstung: Wählen Sie den Ausrüstungstyp (Schwert, Brust, Stiefel, etc.)",
                "Klasse: Wählen Sie die Ausrüstungsklasse (Normal, Champion, Planewalker, etc.)",
                "Level: Wählen Sie das Ausrüstungslevel (1-5)",
                "Farbe: Wählen Sie die Materialqualität (Weiß, Grün, Blau, Lila, Gold)"
            ],
            note: "💡 Hinweis: Einige spezielle Klassen haben Einschränkungen bei erlaubten Levels und Farben."
        },
        tabs: {
            title: "📊 Verfügbare Tabs",
            tabs: [
                "Materialien: Zeigt Materialien an, die für die ausgewählte Ausrüstung benötigt werden",
                ">> Grün/Blau/Lila/Gold: Berechnet Konvertierungen zu dieser Qualität",
                "Legende: Zeigt die Äquivalenztabelle zwischen Qualitäten",
                "ARTE: Simuliert Ausrüstung mit verschiedenen Konfigurationen"
            ]
        },
        gallery: {
            title: "🖼️ Bildergalerie",
            description: "Sie können Referenzbilder speichern, um sich zu erinnern:",
            features: [
                "Klicken Sie auf den Galerie-Button (📷) unten",
                "Verwenden Sie den \"+\"-Button, um neue Bilder hinzuzufügen",
                "Klicken Sie auf ein Bild, um es im Vollbildmodus anzuzeigen",
                "Verwenden Sie den \"×\"-Button, um Bilder zu löschen"
            ]
        },
        saveLoad: {
            title: "💾 Daten speichern und laden",
            description: "Um Ihre Daten sicher zu halten:",
            features: [
                "Verwenden Sie den schwebenden Speichern-Button (💾) in der oberen rechten Ecke",
                "Wählen Sie \"Daten speichern\", um eine JSON-Datei herunterzuladen",
                "Verwenden Sie \"Daten laden\", um aus einer gespeicherten Datei wiederherzustellen",
                "Verwenden Sie \"Daten löschen\", um alle lokalen Daten zu löschen",
                "⚠️ Wichtig: Daten werden lokal gespeichert, nicht in der Cloud"
            ]
        },
        floatingButtons: {
            title: "📋 Schwebende Buttons",
            description: "In der oberen rechten Ecke finden Sie zwei schwebende Buttons:",
            features: [
                "Oberer Button (💾): Datenverwaltungsoptionen (speichern, laden, löschen)",
                "Unterer Button (📋): Zeigt die vollständige Materialliste an",
                "💡 Buttons passen sich automatisch an verschiedene Bildschirmgrößen an"
            ]
        },
        arte: {
            title: "🎨 ARTE-Tab",
            description: "Im ARTE-Tab können Sie:",
            features: [
                "Eine vollständige Tabelle aller möglichen Ausrüstungen anzeigen",
                "Materialien sehen, die für jede Konfiguration benötigt werden",
                "Diese Informationen zur Fortschrittsplanung verwenden"
            ]
        },
        responsive: {
            title: "📱 Responsives Design",
            description: "Die Anwendung passt sich automatisch an verschiedene Geräte an:",
            features: [
                "Desktop: Vollständige Oberfläche mit allen sichtbaren Elementen",
                "Tablet: Elemente für mittlere Bildschirme neu organisiert",
                "Mobil: Oberfläche für kleine Bildschirme optimiert",
                "💡 Materialselektoren behalten ihre quadratische Form bei allen Auflösungen"
            ]
        },
        links: {
            title: "🔗 Nützliche Links",
            description: "Treten Sie unserer Community bei:",
            features: [
                "WhatsApp: Spielergruppe für Anfragen und Strategien",
                "Telegram: Offizieller Kanal mit Nachrichten und Updates",
                "YouTube: Tutorials und Bildungsinhalte"
            ]
        },
        backButton: "← Zurück zu Materialien"
    }
};

// Función para cambiar el idioma
export function changeLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Idioma no soportado: ${lang}`);
        return;
    }

    const t = translations[lang];
    
    // Actualizar título principal
    const title = document.querySelector('#ayuda-tab h2');
    if (title) title.textContent = t.title;

    // Actualizar sección "¿Qué es esta aplicación?"
    updateSection('whatIsApp', t.whatIsApp);
    
    // Actualizar sección "Cómo usar los selectores"
    updateSection('howToUse', t.howToUse);
    
    // Actualizar sección "Pestañas disponibles"
    updateSection('tabs', t.tabs);
    
    // Actualizar sección "Galería de imágenes"
    updateSection('gallery', t.gallery);
    
    // Actualizar sección "Guardar y cargar datos"
    updateSection('saveLoad', t.saveLoad);
    
    // Actualizar sección "Botones flotantes"
    updateSection('floatingButtons', t.floatingButtons);
    
    // Actualizar sección "Pestaña ARTE"
    updateSection('arte', t.arte);
    
    // Actualizar sección "Diseño responsive"
    updateSection('responsive', t.responsive);
    
    // Actualizar sección "Enlaces útiles"
    updateSection('links', t.links);

    // Actualizar botón volver
    const backButton = document.querySelector('#ayuda-back-button');
    if (backButton) backButton.textContent = t.backButton;

    // Actualizar estado activo de las banderas
    updateFlagStates(lang);
}

// Función auxiliar para actualizar secciones
function updateSection(sectionId, content) {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (!section) return;

    // Actualizar título
    const title = section.querySelector('h3');
    if (title) title.textContent = content.title;

    // Actualizar descripción
    const description = section.querySelector('p');
    if (description) description.textContent = content.description;

    // Actualizar lista
    const list = section.querySelector('ul');
    if (list && content.features) {
        list.innerHTML = '';
        content.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            list.appendChild(li);
        });
    }

    // Actualizar pasos numerados
    const ol = section.querySelector('ol');
    if (ol && content.steps) {
        ol.innerHTML = '';
        content.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            ol.appendChild(li);
        });
    }

    // Actualizar nota
    const note = section.querySelector('em');
    if (note && content.note) {
        note.textContent = content.note;
    }
}

// Función para actualizar el estado activo de las banderas
function updateFlagStates(activeLang) {
    const flags = document.querySelectorAll('.flag-icon');
    flags.forEach(flag => {
        flag.classList.remove('active');
        if (flag.getAttribute('data-lang') === activeLang) {
            flag.classList.add('active');
        }
    });
}

// Función para inicializar el sistema de idiomas
export function initLanguageSystem() {
    // Configurar event listeners para las banderas
    const flags = document.querySelectorAll('.flag-icon');
    flags.forEach(flag => {
        flag.addEventListener('click', () => {
            const lang = flag.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });

    // Establecer español como idioma por defecto
    updateFlagStates('es');
} 