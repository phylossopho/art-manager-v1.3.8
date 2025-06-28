// widgets/widget-manager.js
// ============= INICIO DE widget-manager.js =============

class WidgetManager {
    constructor() {
        this.widgets = new Map();
        this.config = null;
        this.init();
    }

    async init() {
        try {
            // Cargar configuración de widgets
            await this.loadWidgetConfig();
            
            // Inicializar widgets disponibles
            this.initializeWidgets();
            
            // Configurar listeners para cambios
            this.setupEventListeners();
            
            console.log('Widget Manager inicializado');
        } catch (error) {
            console.error('Error inicializando Widget Manager:', error);
        }
    }

    async loadWidgetConfig() {
        try {
            const response = await fetch('./widgets/widget-config.json');
            this.config = await response.json();
        } catch (error) {
            console.error('Error cargando configuración de widgets:', error);
            // Configuración por defecto
            this.config = {
                widgets: [],
                global_settings: {
                    cache_duration: 3600000,
                    offline_support: true,
                    sync_enabled: true
                }
            };
        }
    }

    initializeWidgets() {
        if (!this.config || !this.config.widgets) return;

        this.config.widgets.forEach(widgetConfig => {
            this.registerWidget(widgetConfig);
        });
    }

    registerWidget(config) {
        const widget = {
            id: this.generateWidgetId(config.name),
            config: config,
            instance: null,
            data: null,
            lastUpdate: null
        };

        this.widgets.set(widget.id, widget);
        console.log(`Widget registrado: ${widget.id}`);
    }

    generateWidgetId(name) {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    async updateWidgetData(widgetId, data) {
        const widget = this.widgets.get(widgetId);
        if (!widget) return;

        widget.data = data;
        widget.lastUpdate = new Date();

        // Guardar en localStorage para sincronización
        localStorage.setItem(`widget_${widgetId}_data`, JSON.stringify({
            data: data,
            timestamp: widget.lastUpdate.toISOString()
        }));

        // Notificar a otros widgets sobre el cambio
        this.notifyWidgetUpdate(widgetId, data);
    }

    notifyWidgetUpdate(widgetId, data) {
        // Disparar evento personalizado para notificar cambios
        const event = new CustomEvent('widgetDataUpdate', {
            detail: {
                widgetId: widgetId,
                data: data,
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
    }

    getWidgetData(widgetId) {
        const widget = this.widgets.get(widgetId);
        return widget ? widget.data : null;
    }

    getAllWidgets() {
        return Array.from(this.widgets.values());
    }

    async refreshWidget(widgetId) {
        const widget = this.widgets.get(widgetId);
        if (!widget) return;

        try {
            // Intentar cargar datos actualizados
            const response = await fetch(widget.config.data);
            const data = await response.json();
            
            await this.updateWidgetData(widgetId, data);
            console.log(`Widget ${widgetId} actualizado`);
        } catch (error) {
            console.error(`Error actualizando widget ${widgetId}:`, error);
        }
    }

    setupEventListeners() {
        // Escuchar cambios en localStorage
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('widget_')) {
                const widgetId = e.key.replace('widget_', '').replace('_data', '');
                this.handleStorageChange(widgetId, e.newValue);
            }
        });

        // Escuchar eventos de actualización de widgets
        window.addEventListener('widgetDataUpdate', (e) => {
            this.handleWidgetUpdate(e.detail);
        });
    }

    handleStorageChange(widgetId, newValue) {
        try {
            const parsedData = JSON.parse(newValue);
            const widget = this.widgets.get(widgetId);
            if (widget) {
                widget.data = parsedData.data;
                widget.lastUpdate = new Date(parsedData.timestamp);
            }
        } catch (error) {
            console.error('Error procesando cambio de storage:', error);
        }
    }

    handleWidgetUpdate(detail) {
        console.log(`Widget ${detail.widgetId} actualizado:`, detail);
        // Aquí puedes agregar lógica adicional para manejar actualizaciones
    }

    // Métodos para gestión avanzada de widgets
    async exportWidgetData(widgetId) {
        const widget = this.widgets.get(widgetId);
        if (!widget) return null;

        return {
            widgetId: widgetId,
            config: widget.config,
            data: widget.data,
            lastUpdate: widget.lastUpdate,
            exportTimestamp: new Date().toISOString()
        };
    }

    async importWidgetData(widgetData) {
        try {
            const widget = this.widgets.get(widgetData.widgetId);
            if (widget) {
                await this.updateWidgetData(widgetData.widgetId, widgetData.data);
                return true;
            }
        } catch (error) {
            console.error('Error importando datos de widget:', error);
            return false;
        }
    }

    // Métodos para estadísticas de widgets
    getWidgetStats() {
        const stats = {
            totalWidgets: this.widgets.size,
            activeWidgets: 0,
            lastUpdates: {},
            dataSizes: {}
        };

        this.widgets.forEach((widget, id) => {
            if (widget.data) {
                stats.activeWidgets++;
                stats.lastUpdates[id] = widget.lastUpdate;
                stats.dataSizes[id] = JSON.stringify(widget.data).length;
            }
        });

        return stats;
    }
}

// Exportar para uso global
window.WidgetManager = WidgetManager;

// Auto-inicializar si se carga directamente
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        window.widgetManager = new WidgetManager();
    });
}

// ============= FIN DE widget-manager.js ============= 