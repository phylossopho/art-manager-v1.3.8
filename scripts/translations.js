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
        pestañasDisponibles: {
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
            title: "🎨 ARTE",
            description: "En la pestaña de Materiales y en la de Conversiones puedes simular la creación de un equipo y guardar la información para futuras consultas.",
            features: [
                "Primero, selecciona el tipo de equipo, la clase, el nivel y el color en los selectores superiores.",
                "En la parte intermedia podrás ver la cantidad de materiales disponibles que tienes, elige también la base adecuada según el requisito previo que se muestra en la propia base (aparecerá un texto explicativo si hay alguna restricción).",
                "Después de seleccionar todos los datos, haz clic en el botón USAR para simular la creación del equipo.",
                "Una vez simulado, podrás ver la información del equipo en la pestaña de ARTE y almacenarla para futuras consultas, también puedes eliminar esta simulación.",
                "Puedes repetir el proceso con diferentes combinaciones para planificar tu progreso y comparar materiales necesarios."
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
        pestañasDisponibles: {
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
            description: "In the ARTE tab you can simulate the creation of equipment and save the information for future reference:",
            features: [
                "First, select the type of equipment, class, level, and color using the top selectors.",
                "Also choose the correct base according to the prerequisite shown in the base itself (an explanatory text will appear if there is any restriction).",
                "After selecting all the data, click the USE button to simulate the creation of the equipment.",
                "Once simulated, you will see the equipment information in the ARTE table and can store it for future reference.",
                "You can repeat the process with different combinations to plan your progress and compare required materials."
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
        pestañasDisponibles: {
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
        pestañasDisponibles: {
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
    },
    pt: {
        title: "📖 Guia de Uso - Gerenciador de Materiais",
        whatIsApp: {
            title: "🎯 O que é este aplicativo?",
            description: "Este aplicativo te ajuda a gerenciar materiais e equipamentos para o jogo Deck Heroes. Você pode:",
            features: [
                "Ver materiais necessários para equipamentos específicos",
                "Calcular conversões entre diferentes qualidades de materiais",
                "Simular equipamentos na aba ARTE",
                "Salvar imagens de referência na galeria"
            ]
        },
        howToUse: {
            title: "⚙️ Como usar os seletores",
            steps: [
                "Equipamento: Selecione o tipo de equipamento (Espada, Peito, Botas, etc.)",
                "Classe: Escolha a classe do equipamento (Normal, Campeão, Planewalker, etc.)",
                "Nível: Selecione o nível do equipamento (1-5)",
                "Cor: Escolha a qualidade do material (Branco, Verde, Azul, Roxo, Dourado)"
            ],
            note: "💡 Nota: Algumas classes especiais têm restrições de níveis e cores permitidas."
        },
        pestañasDisponibles: {
            title: "📊 Abas disponíveis",
            tabs: [
                "Materiais: Mostra os materiais necessários para o equipamento selecionado",
                ">> Verde/Azul/Roxo/Dourado: Calcula conversões para essa qualidade",
                "Lenda: Mostra a tabela de equivalências entre qualidades",
                "ARTE: Simula equipamentos com diferentes configurações"
            ]
        },
        gallery: {
            title: "🖼️ Galeria de imagens",
            description: "Você pode salvar imagens de referência para te ajudar a lembrar:",
            features: [
                "Clique no botão de galeria (📷) na parte inferior",
                "Use o botão "+" para adicionar novas imagens",
                "Clique em uma imagem para vê-la em tela cheia",
                "Use o botão \"×\" para excluir imagens"
            ]
        },
        saveLoad: {
            title: "💾 Salvar e carregar dados",
            description: "Para manter seus dados seguros:",
            features: [
                "Use o botão flutuante de salvar (💾) no canto superior direito",
                "Selecione \"Salvar dados\" para baixar um arquivo JSON",
                "Use \"Carregar dados\" para restaurar de um arquivo salvo",
                "Use \"Limpar dados\" para apagar todos os dados locais",
                "⚠️ Importante: Os dados são salvos localmente, não na nuvem"
            ]
        },
        floatingButtons: {
            title: "📋 Botões flutuantes",
            description: "No canto superior direito você encontrará dois botões flutuantes:",
            features: [
                "Botão superior (💾): Opções de gestão de dados (salvar, carregar, limpar)",
                "Botão inferior (📋): Mostra a lista completa de materiais",
                "💡 Os botões se adaptam automaticamente a diferentes tamanhos de tela"
            ]
        },
        arte: {
            title: "🎨 Aba ARTE",
            description: "Na aba ARTE você pode simular a criação de um equipamento e salvar as informações para consultas futuras:",
            features: [
                "Primeiro, selecione o tipo de equipamento, classe, nível e cor nos seletores superiores.",
                "Escolha também a base correta de acordo com o pré-requisito exibido na própria base (um texto explicativo aparecerá se houver alguma restrição).",
                "Depois de selecionar todos os dados, clique no botão USAR para simular a criação do equipamento.",
                "Após a simulação, você verá as informações do equipamento na tabela ARTE e poderá armazená-las para consultas futuras.",
                "Você pode repetir o processo com diferentes combinações para planejar seu progresso e comparar os materiais necessários."
            ]
        },
        responsive: {
            title: "📱 Design responsivo",
            description: "O aplicativo se adapta automaticamente a diferentes dispositivos:",
            features: [
                "Desktop: Interface completa com todos os elementos visíveis",
                "Tablet: Elementos reorganizados para telas médias",
                "Móvel: Interface otimizada para telas pequenas",
                "💡 Os seletores de materiais mantêm sua forma quadrada em todas as resoluções"
            ]
        },
        links: {
            title: "🔗 Links úteis",
            description: "Junte-se à nossa comunidade:",
            features: [
                "WhatsApp: Grupo de jogadores para dúvidas e estratégias",
                "Telegram: Canal oficial com notícias e atualizações",
                "YouTube: Tutoriais e conteúdo educativo"
            ]
        },
        backButton: "← Voltar para Materiais"
    },
    it: {
        title: "📖 Guida all'Uso - Gestore Materiali",
        whatIsApp: {
            title: "🎯 Cos'è questa applicazione?",
            description: "Questa applicazione ti aiuta a gestire materiali ed equipaggiamenti per il gioco Deck Heroes. Puoi:",
            features: [
                "Vedere i materiali necessari per equipaggiamenti specifici",
                "Calcolare conversioni tra diverse qualità di materiali",
                "Simulare equipaggiamenti nella scheda ARTE",
                "Salvare immagini di riferimento nella galleria"
            ]
        },
        howToUse: {
            title: "⚙️ Come usare i selettori",
            steps: [
                "Equipaggiamento: Seleziona il tipo di equipaggiamento (Spada, Petto, Stivali, ecc.)",
                "Classe: Scegli la classe dell'equipaggiamento (Normale, Campione, Planewalker, ecc.)",
                "Livello: Seleziona il livello dell'equipaggiamento (1-5)",
                "Colore: Scegli la qualità del materiale (Bianco, Verde, Blu, Viola, Dorato)"
            ],
            note: "💡 Nota: Alcune classi speciali hanno restrizioni su livelli e colori consentiti."
        },
        pestañasDisponibles: {
            title: "📊 Schede disponibili",
            tabs: [
                "Materiali: Mostra i materiali necessari per l'equipaggiamento selezionato",
                ">> Verde/Blu/Viola/Dorato: Calcola conversioni verso quella qualità",
                "Legenda: Mostra la tabella di equivalenze tra qualità",
                "ARTE: Simula equipaggiamenti con diverse configurazioni"
            ]
        },
        gallery: {
            title: "🖼️ Galleria di immagini",
            description: "Puoi salvare immagini di riferimento per aiutarti a ricordare:",
            features: [
                "Clicca sul pulsante galleria (📷) in basso",
                "Usa il pulsante \"+\" per aggiungere nuove immagini",
                "Clicca su un'immagine per vederla a schermo intero",
                "Usa il pulsante \"×\" per eliminare immagini"
            ]
        },
        saveLoad: {
            title: "💾 Salva e carica dati",
            description: "Per mantenere i tuoi dati al sicuro:",
            features: [
                "Usa il pulsante flottante di salvataggio (💾) nell'angolo in alto a destra",
                "Seleziona \"Salva dati\" per scaricare un file JSON",
                "Usa \"Carica dati\" per ripristinare da un file salvato",
                "Usa \"Pulisci dati\" per cancellare tutti i dati locali",
                "⚠️ Importante: I dati vengono salvati localmente, non nel cloud"
            ]
        },
        floatingButtons: {
            title: "📋 Pulsanti flottanti",
            description: "Nell'angolo in alto a destra troverai due pulsanti flottanti:",
            features: [
                "Pulsante superiore (💾): Opzioni di gestione dati (salva, carica, pulisci)",
                "Pulsante inferiore (📋): Mostra l'elenco completo dei materiali",
                "💡 I pulsanti si adattano automaticamente a diverse dimensioni dello schermo"
            ]
        },
        arte: {
            title: "🎨 Scheda ARTE",
            description: "Nella scheda ARTE puoi simulare la creazione di un equipaggiamento e salvarle le informazioni per consultazioni future:",
            features: [
                "Per prima cosa, seleziona il tipo di equipaggiamento, la classe, il livello e il colore nei selettori superiori.",
                "Scegli anche la base corretta in base al requisito mostrato nella própria base (apparirà un testo esplicativo se ci sono restrizioni).",
                "Dopo aver selezionato tutti i dati, clicca sul pulsante USAR per simulare la creazione dell'equipaggiamento.",
                "Una volta simulato, potrai vedere le informazioni dell'equipaggiamento nella tabella ARTE e salvarle per consultazioni future.",
                "Puoi ripetere il processo con diverse combinazioni per pianificare i tuoi progressi e confrontare i materiali necessari."
            ]
        },
        responsive: {
            title: "📱 Design responsivo",
            description: "L'applicazione si adatta automaticamente a diversi dispositivi:",
            features: [
                "Desktop: Interfaccia completa con tutti gli elementi visibili",
                "Tablet: Elementi riorganizzati per schermi medi",
                "Mobile: Interfaccia ottimizzata per schermi piccoli",
                "💡 I selettori di materiali mantengono la loro forma quadrata a tutte le risoluzioni"
            ]
        },
        links: {
            title: "🔗 Link utili",
            description: "Unisciti alla nostra community:",
            features: [
                "WhatsApp: Gruppo di giocatori per domande e strategie",
                "Telegram: Canale ufficiale con notizie e aggiornamenti",
                "YouTube: Tutorial e contenuti educativi"
            ]
        },
        backButton: "← Torna ai Materiali"
    },
    fr: {
        title: "📖 Guide d'utilisation - Gestionnaire de Matériaux",
        whatIsApp: {
            title: "🎯 Qu'est-ce que cette application ?",
            description: "Cette application vous aide à gérer les matériaux et équipements pour le jeu Deck Heroes. Vous pouvez :",
            features: [
                "Voir les matériaux nécessaires pour des équipements spécifiques",
                "Calculer les conversions entre différentes qualités de matériaux",
                "Simuler des équipements dans l'onglet ARTE",
                "Enregistrer des images de référence dans la galerie"
            ]
        },
        howToUse: {
            title: "⚙️ Comment utiliser les sélecteurs",
            steps: [
                "Équipement : Sélectionnez le type d'équipement (Épée, Plastron, Bottes, etc.)",
                "Classe : Choisissez la classe de l'équipement (Normal, Champion, Planewalker, etc.)",
                "Niveau : Sélectionnez le niveau de l'équipement (1-5)",
                "Couleur : Choisissez la qualité du matériau (Blanc, Vert, Bleu, Violet, Doré)"
            ],
            note: "💡 Remarque : Certaines classes spéciales ont des restrictions sur les niveaux et les couleurs autorisés."
        },
        pestañasDisponibles: {
            title: "📊 Onglets disponibles",
            tabs: [
                "Matériaux : Affiche les matériaux nécessaires pour l'équipement sélectionné",
                ">> Vert/Bleu/Violet/Doré : Calcule les conversions vers cette qualité",
                "Légende : Affiche le tableau d'équivalence entre les qualités",
                "ARTE : Simule des équipements avec différentes configurations"
            ]
        },
        gallery: {
            title: "🖼️ Galerie d'images",
            description: "Vous pouvez enregistrer des images de référence pour vous aider à vous souvenir :",
            features: [
                "Cliquez sur le bouton galerie (📷) en bas",
                "Utilisez le bouton \"+\" pour ajouter de nouvelles images",
                "Cliquez sur une image pour la voir en plein écran",
                "Utilisez le bouton \"×\" pour supprimer des images"
            ]
        },
        saveLoad: {
            title: "💾 Sauvegarder et charger des données",
            description: "Pour garder vos données en sécurité :",
            features: [
                "Utilisez le bouton flottant de sauvegarde (💾) en haut à droite",
                "Sélectionnez \"Sauvegarder les données\" pour télécharger un fichier JSON",
                "Utilisez \"Charger les données\" pour restaurer à partir d'un fichier sauvegardé",
                "Utilisez \"Effacer les données\" pour supprimer toutes les données locales",
                "⚠️ Important : Les données sont enregistrées localement, pas dans le cloud"
            ]
        },
        floatingButtons: {
            title: "📋 Boutons flottants",
            description: "En haut à droite, vous trouverez deux boutons flottants :",
            features: [
                "Bouton supérieur (💾) : Options de gestion des données (sauvegarder, charger, effacer)",
                "Bouton inférieur (📋) : Affiche la liste complète des matériaux",
                "💡 Les boutons s'adaptent automatiquement à différentes tailles d'écran"
            ]
        },
        arte: {
            title: "🎨 Onglet ARTE",
            description: "Dans l'onglet ARTE, vous pouvez simuler la création d'un équipement et enregistrer les informations pour de futures consultations :",
            features: [
                "Tout d'abord, sélectionnez le type d'équipement, la classe, le niveau et la couleur dans les sélecteurs en haut.",
                "Choisissez également la base appropriée selon la condition préalable affichée dans la base elle-même (un texte explicatif apparaîtra en cas de restriction).",
                "Après avoir sélectionné toutes les données, cliquez sur le bouton USAR pour simuler la création de l'équipement.",
                "Une fois la simulation effectuée, vous verrez les informations de l'équipement dans le tableau ARTE et pourrez les enregistrer pour de futures consultations.",
                "Vous pouvez répéter le processus avec différentes combinaisons pour planifier votre progression et comparer les matériaux nécessaires."
            ]
        },
        responsive: {
            title: "📱 Design réactif",
            description: "L'application s'adapte automatiquement à différents appareils :",
            features: [
                "Bureau : Interface complète avec tous les éléments visibles",
                "Tablette : Éléments réorganisés pour les écrans moyens",
                "Mobile : Interface optimisée pour les petits écrans",
                "💡 Les sélecteurs de matériaux gardent leur forme carrée à toutes les résolutions"
            ]
        },
        links: {
            title: "🔗 Liens utiles",
            description: "Rejoignez notre communauté :",
            features: [
                "WhatsApp : Groupe de joueurs pour questions et stratégies",
                "Telegram : Canal officiel avec des nouvelles et des mises à jour",
                "YouTube : Tutoriels et contenu éducatif"
            ]
        },
        backButton: "← Retour aux Matériaux"
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
    updateSection('pestañasDisponibles', t.pestañasDisponibles);
    
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
    if (list) {
        list.innerHTML = '';
        // Soporta tanto 'features' como 'tabs' como array de elementos
        const items = content.features || content.tabs;
        if (Array.isArray(items)) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            });
        }
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