/*
 * Copyright (C) 2018-2025 LEIDOS.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
*/

class MapManager {
    constructor() {
        this.config = {
            defaultCenter: { lat: 38.955097, lng: -77.147190 },
            defaultZoom: 17,
            mapTypeId: 'hybrid',
            markerTimeout: 3000,
            mapId: "DEMO_MAP_ID",
        };

        // State management
        this.state = {
            map: null,
            mapFrame: null,
            mapDoc: null,
            mapContentWindow: null,
            hostMarker: null,
            markers: [],
            routePath: null,
            tcrPolygon: null,
            routePlanCoordinates: null,
            isInitialized: false,
            apiKey: null
        };

        // Polygon types
        this.polygonTypes = {
            TCR: 'TCR'
        };

        // API classes (will be set after Google Maps loads)
        this.googleMapsClasses = {};
    }

    // Initialize the map with improved error handling
    async init() {
        if (this.state.isInitialized) {
            console.log('Map already initialized');
            return Promise.resolve();
        }

        try {
            // Load API key first
            await this.loadApiKey();
            await this.createMapFrame();
            this.state.isInitialized = true;
            console.log('Map initialization completed');
        } catch (error) {
            console.error('Map initialization failed:', error);
            this.handleError('Map initialization failed', error);
            throw error;
        }
    }

    // Load API key from environment file
    async loadApiKey() {
        try {
            this.state.apiKey = await this.getApiKey();
            if (!this.state.apiKey || this.state.apiKey === 'ERROR_API_KEY') {
                throw new Error('Invalid or missing Google Maps API key');
            }
            console.log('Google Maps API key loaded successfully');
        } catch (error) {
            console.error('Failed to load API key:', error);
            throw error;
        }
    }

    // Get API key from configuration
    async getApiKey() {
        // Try to fetch the env file via HTTP (for browser environment)
        try {
            const response = await fetch('/google_map_api_key.env');
            if (response.ok) {
                const content = await response.text();
                const lines = content.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                        const [key, ...valueParts] = trimmed.split('=');
                        if (key.trim() === 'GOOGLE_MAPS_API_KEY' && valueParts.length > 0) {
                            const apiKey = valueParts.join('=').replace(/^(["'])|["']$/g, '');
                            console.log('API key loaded from env file');
                            return apiKey.trim();
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('Could not fetch env file via HTTP:', error.message);
        }

        // Check window object for client-side config
        if (typeof window !== 'undefined' && window.GOOGLE_MAPS_API_KEY) {
            console.log('API key loaded from window object');
            return window.GOOGLE_MAPS_API_KEY;
        }

        // Check for global config object
        if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.GOOGLE_MAPS_API_KEY) {
            console.log('API key loaded from APP_CONFIG');
            return APP_CONFIG.GOOGLE_MAPS_API_KEY;
        }

        console.error('GOOGLE_MAPS_API_KEY not found in any accessible location');
        return 'ERROR_API_KEY';
    }

    // Create iframe with improved structure
    createMapFrame() {
        return new Promise((resolve, reject) => {
            const mapContainer = document.getElementById('load-map');
            if (!mapContainer) {
                reject(new Error('Map container element not found'));
                return;
            }

            if (this.state.mapFrame) {
                console.log('Map frame already exists');
                resolve();
                return;
            }

            this.state.mapFrame = document.createElement("iframe");
            this.state.mapFrame.style.cssText = `
                width: 100%;
                height: 100%;
                border: 0;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
            `;

            this.state.mapFrame.onload = () => {
                try {
                    this.setupMapFrame();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            this.state.mapFrame.onerror = () => {
                reject(new Error('Failed to load map iframe'));
            };

            mapContainer.appendChild(this.state.mapFrame);
        });
    }

    // Setup map frame content
    setupMapFrame() {
        this.state.mapDoc = this.state.mapFrame.contentDocument;
        this.state.mapContentWindow = this.state.mapFrame.contentWindow;

        // Setup map initialization function
        this.state.mapContentWindow.showNewMap = this.initializeGoogleMap.bind(this);

        // Setup error handler
        this.state.mapContentWindow.handleGoogleMapsError = this.handleGoogleMapsError.bind(this);

        // Load Google Maps API
        this.loadGoogleMapsAPI();
    }

    // Initialize Google Map with modern approach
    async initializeGoogleMap() {
        try {
            const mapContainer = this.createMapContainer();

            // Import required Google Maps libraries with renamed destructuring
            const { Map: GoogleMap } = await this.state.mapContentWindow.google.maps.importLibrary("maps");
            const { AdvancedMarkerElement, PinElement } = await this.state.mapContentWindow.google.maps.importLibrary("marker");

            // Store classes for later use (fixed the reference)
            this.googleMapsClasses = { GoogleMap, AdvancedMarkerElement, PinElement };

            // Create the map using the renamed GoogleMap class
            this.state.map = new GoogleMap(mapContainer, {
                zoom: this.config.defaultZoom,
                center: this.config.defaultCenter,
                mapTypeId: this.config.mapTypeId,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: this.state.mapContentWindow.google.maps.ControlPosition.LEFT_CENTER
                },
                scaleControl: true,
                mapTypeControl: true,
                fullscreenControl: true,
                mapId: this.config.mapId
            });

            // Initialize map features
            this.initializeMapFeatures();

        } catch (error) {
            console.error('Google Maps initialization error:', error);
            this.handleGoogleMapsError(error.message);
            throw error;
        }
    }

    // Create map container element
    createMapContainer() {
        const mapContainer = this.state.mapDoc.createElement('div');
        mapContainer.style.cssText = "width: 100%; height: 100%";
        this.state.mapDoc.body.style.cssText = "width: 100%; height: 100%; padding: 0; margin: 0";
        this.state.mapDoc.body.appendChild(mapContainer);
        return mapContainer;
    }

    // Initialize map features after Google Maps is loaded
    initializeMapFeatures() {
        // Set route if coordinates exist
        if (this.state.routePlanCoordinates) {
            this.setRouteMap();
        }

        // Set host marker
        this.setHostMarker();

        // Start marker cleanup
        this.startMarkerCleanup();
    }

    // Load Google Maps API script
    loadGoogleMapsAPI() {
        const script = this.state.mapDoc.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;

        script.onerror = () => {
            this.handleGoogleMapsError('Failed to load Google Maps script');
        };

        // Use the loaded API key
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.state.apiKey}&callback=showNewMap&loading=async`;

        this.state.mapDoc.head.appendChild(script);
    }

    // Handle Google Maps errors
    handleGoogleMapsError(error) {
        console.error('Google Maps API Error:', error);
        const container = this.state.mapDoc.getElementById('map-container') || this.state.mapDoc.body;
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #f8f8f8; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="color: #d32f2f;">Map Loading Error</h3>
                <p>Unable to load Google Maps. Please check your configuration.</p>
                <p style="font-size: 14px; color: #666;">Error: ${error}</p>
                <button onclick="location.reload()" style="padding: 8px 16px; margin-top: 10px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }

    // Generic error handler
    handleError(message, error) {
        console.error(message, error);
        // Docker-friendly error reporting
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.trace(error);
        }
    }

    // Set route on map with validation
    setRouteMap() {
        if (!this.state.routePlanCoordinates || !Array.isArray(this.state.routePlanCoordinates)) {
            console.warn('No valid route coordinates available');
            return;
        }

        try {
            // Clear existing route
            if (this.state.routePath) {
                this.state.routePath.setMap(null);
            }

            this.state.routePath = new this.state.mapContentWindow.google.maps.Polyline({
                path: this.state.routePlanCoordinates,
                geodesic: true,
                strokeColor: '#6495ed',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            this.state.routePath.setMap(this.state.map);
        } catch (error) {
            this.handleError('Failed to set route on map', error);
        }
    }

    // Set host marker with improved error handling
    setHostMarker() {
        try {
            // Use the correctly stored GoogleMap classes
            const { AdvancedMarkerElement, PinElement } = this.googleMapsClasses;

            if (this.state.hostMarker) {
                this.state.hostMarker.map = null;
            }

            const hostPin = new PinElement({
                background: '#FF0000',
                borderColor: '#FFFFFF',
                glyphColor: '#FFFFFF',
                scale: 1.2
            });

            this.state.hostMarker = new AdvancedMarkerElement({
                map: this.state.map,
                position: { lat: 38.95647, lng: -77.15031 },
                content: hostPin.element,
                title: 'Host Vehicle'
            });

            this.state.hostMarker.id = 'mHostVehicle';
            this.state.map.setCenter(this.state.hostMarker.position);

        } catch (error) {
            this.handleError('Failed to create host marker', error);
        }
    }

    // Create custom pin with validation
    createCustomPin(color, scale = 1) {
        if (!this.googleMapsClasses.PinElement) {
            throw new Error('PinElement not available');
        }

        return new this.googleMapsClasses.PinElement({
            background: color,
            borderColor: '#FFFFFF',
            glyphColor: '#FFFFFF',
            scale: scale
        });
    }

    // Add vehicle marker with improved error handling
    addVehicleMarker(id, latitude, longitude) {
        if (!this.isValidCoordinate(latitude, longitude)) {
            console.error('Invalid coordinates provided:', { id, latitude, longitude });
            return;
        }

        try {
            const existingMarker = this.findMarker(id);

            if (existingMarker) {
                this.moveMarker(existingMarker, latitude, longitude);
            } else {
                this.createNewVehicleMarker(id, latitude, longitude);
            }
        } catch (error) {
            this.handleError(`Failed to add vehicle marker for ${id}`, error);
        }
    }

    // Validate coordinates
    isValidCoordinate(lat, lng) {
        return typeof lat === 'number' && typeof lng === 'number' &&
               lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    }

    // Create new vehicle marker
    createNewVehicleMarker(id, latitude, longitude) {
        setTimeout(() => {
            try {
                const vehiclePin = this.createCustomPin('#0000FF', 0.8);
                const { AdvancedMarkerElement } = this.googleMapsClasses;

                const marker = new AdvancedMarkerElement({
                    map: this.state.map,
                    position: { lat: latitude, lng: longitude },
                    content: vehiclePin.element,
                    title: id
                });

                marker.id = id;
                marker.dateTimeCreated = new Date();
                this.state.markers.push(marker);

            } catch (error) {
                this.handleError(`Failed to create marker for ${id}`, error);
            }
        }, this.config.markerTimeout);
    }

    // Move existing marker
    moveMarker(marker, latitude, longitude) {
        setTimeout(() => {
            try {
                marker.position = { lat: latitude, lng: longitude };

                if (marker.id === 'mHostVehicle') {
                    this.state.map.setCenter(marker.position);
                }
            } catch (error) {
                this.handleError(`Failed to move marker ${marker.id}`, error);
            }
        }, this.config.markerTimeout);
    }

    // Find marker by ID
    findMarker(id) {
        return this.state.markers.find(marker => marker.id === id) || null;
    }

    // Draw polygon with validation
    drawPolygon(polygonType, coordinates) {
        if (!Array.isArray(coordinates) || coordinates.length !== 4) {
            console.error('Invalid polygon coordinates: expected array of 4 coordinates');
            return;
        }

        if (!coordinates.every(coord => this.isValidCoordinate(coord.lat, coord.lng))) {
            console.error('Invalid coordinate values in polygon');
            return;
        }

        try {
            if (polygonType === this.polygonTypes.TCR) {
                this.drawTCRPolygon(coordinates);
            }
        } catch (error) {
            this.handleError('Failed to draw polygon', error);
        }
    }

    // Draw TCR polygon
    drawTCRPolygon(coordinates) {
        // Remove existing polygon
        if (this.state.tcrPolygon) {
            this.state.tcrPolygon.setMap(null);
        }

        const contentStr = this.generatePolygonInfoContent(coordinates);

        this.state.tcrPolygon = new this.state.mapContentWindow.google.maps.Polygon({
            paths: coordinates,
            strokeColor: "#000000",
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: "#FFA500",
            fillOpacity: 0.3
        });

        const infoWindow = new this.state.mapContentWindow.google.maps.InfoWindow();
        this.state.tcrPolygon.setMap(this.state.map);

        this.state.tcrPolygon.addListener("click", (event) => {
            infoWindow.setContent(contentStr);
            infoWindow.setPosition(event.latLng);
            infoWindow.open(this.state.map);
        });
    }

    // Generate polygon info content
    generatePolygonInfoContent(coordinates) {
        const coordsList = coordinates.map(coord =>
            `<li>Latitude: ${coord.lat.toFixed(6)}, Longitude: ${coord.lng.toFixed(6)}</li>`
        ).join('');

        return `
            <div style="max-width: 300px;">
                <b>TCR Bounding Box</b><br>
                <ul>
                    <li>Drawing polygon from position3D list in clockwise direction.</li>
                    <li>Position3D list:</li>
                    <ul>${coordsList}</ul>
                </ul>
            </div>
        `;
    }

    // Start automatic marker cleanup
    startMarkerCleanup() {
        setInterval(() => {
            this.removeExpiredMarkers();
        }, 5000); // Check every 5 seconds
    }

    // Remove expired markers
    removeExpiredMarkers() {
        const now = new Date();
        const expiredMarkers = [];

        for (let i = this.state.markers.length - 1; i >= 0; i--) {
            const marker = this.state.markers[i];
            if (marker.dateTimeCreated) {
                const ageInSeconds = (now.getTime() - marker.dateTimeCreated.getTime()) / 1000;
                if (ageInSeconds > 30) { // Remove markers older than 30 seconds
                    marker.map = null;
                    expiredMarkers.push(marker.id);
                    this.state.markers.splice(i, 1);
                }
            }
        }

        if (expiredMarkers.length > 0) {
            console.log('Removed expired markers:', expiredMarkers);
        }
    }

    // Batch update markers for efficiency
    batchUpdateMarkers(markerUpdates) {
        if (!Array.isArray(markerUpdates)) {
            console.error('Marker updates must be an array');
            return;
        }

        markerUpdates.forEach(update => {
            const { id, lat, lng } = update;
            if (this.isValidCoordinate(lat, lng)) {
                this.addVehicleMarker(id, lat, lng);
            }
        });
    }

    // Delete marker by ID
    deleteMarker(id) {
        const index = this.state.markers.findIndex(marker => marker.id === id);
        if (index !== -1) {
            this.state.markers[index].map = null;
            this.state.markers.splice(index, 1);
            console.log(`Marker ${id} deleted`);
        }
    }

    // Reset all map data
    resetMapData() {
        try {
            // Clear markers
            this.state.markers.forEach(marker => marker.map = null);
            this.state.markers = [];

            // Clear host marker
            if (this.state.hostMarker) {
                this.state.hostMarker.map = null;
                this.state.hostMarker = null;
            }

            // Clear polygon
            if (this.state.tcrPolygon) {
                this.state.tcrPolygon.setMap(null);
                this.state.tcrPolygon = null;
            }

            // Clear route
            if (this.state.routePath) {
                this.state.routePath.setMap(null);
                this.state.routePath = null;
            }

            this.state.routePlanCoordinates = null;
            console.log('Map data reset completed');

        } catch (error) {
            this.handleError('Failed to reset map data', error);
        }
    }

    // Public API methods
    setRouteCoordinates(coordinates) {
        if (Array.isArray(coordinates)) {
            this.state.routePlanCoordinates = coordinates;
            if (this.state.map) {
                this.setRouteMap();
            }
        }
    }

    isMapReady() {
        return !!(this.state.map && this.state.mapContentWindow && this.googleMapsClasses.GoogleMap);
    }

    getMapState() {
        return {
            isInitialized: this.state.isInitialized,
            isReady: this.isMapReady(),
            markerCount: this.state.markers.length,
            hasRoute: !!this.state.routePath,
            hasPolygon: !!this.state.tcrPolygon,
            apiKeyLoaded: !!this.state.apiKey && this.state.apiKey !== 'ERROR_API_KEY'
        };
    }
}

// Global instance and backward compatibility
let mapManager;

// Docker-safe initialization
function initializeMapManager() {
    if (!mapManager) {
        mapManager = new MapManager();
        mapManager.init().catch(error => {
            console.error('Failed to initialize map manager:', error);
        });
    }
}

// Initialize based on environment
if (typeof document !== 'undefined') {
    // Browser environment
    if (typeof $ !== 'undefined') {
        // jQuery available
        $(document).ready(initializeMapManager);
    } else {
        // No jQuery, use vanilla JS
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeMapManager);
        } else {
            initializeMapManager();
        }
    }
} else {
    // Node.js/Docker environment - defer initialization
    console.log('MapManager class loaded in server environment');
}

// Backward compatibility functions
function setOtherVehicleMarkers(id, latitude, longitude) {
    if (mapManager) {
        mapManager.addVehicleMarker(id, latitude, longitude);
    }
}

function drawPolygonsOnMap(polygonType, coordinates) {
    if (mapManager) {
        mapManager.drawPolygon(polygonType, coordinates);
    }
}

function setRouteCoordinates(coordinates) {
    if (mapManager) {
        mapManager.setRouteCoordinates(coordinates);
    }
}

function deleteMarker(id) {
    if (mapManager) {
        mapManager.deleteMarker(id);
    }
}

function resetMapData() {
    if (mapManager) {
        mapManager.resetMapData();
    }
}

function isMapReady() {
    return mapManager ? mapManager.isMapReady() : false;
}

function batchUpdateMarkers(markerUpdates) {
    if (mapManager) {
        mapManager.batchUpdateMarkers(markerUpdates);
    }
}

/*
    Move a marker.
*/
function updateHostMarkerPosition(latitude, longitude) {
    if (mapManager && mapManager.isMapReady()) {
        try {
            // Update the host marker position
            if (mapManager.state.hostMarker) {
                mapManager.moveMarker(mapManager.state.hostMarker, latitude, longitude);
            } else {
                // Create host marker if it doesn't exist
                mapManager.setHostMarker();
                mapManager.moveMarker(mapManager.state.hostMarker, latitude, longitude);
            }
        } catch (error) {
            console.error('Failed to update host marker position:', error);
        }
    }
}

// Export for module systems (Node.js/Docker compatible)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MapManager, mapManager, initializeMapManager };
}

// AMD support
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return { MapManager, mapManager, initializeMapManager };
    });
}

// Global export for browser
if (typeof window !== 'undefined') {
    window.MapManager = MapManager;
    window.mapManager = mapManager;
    window.initializeMapManager = initializeMapManager;
}
