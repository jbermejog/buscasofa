# BuscaSofa - Buscador de Estaciones de Servicio

BuscaSofa es una aplicación web interactiva diseñada para buscar estaciones de servicio cercanas y proporcionar información detallada, como precios de combustible, dirección y la distancia desde tu ubicación actual. Además, permite navegar a una estación específica mediante Google Maps.


## Características

- **Geolocalización automática**: Detecta tu ubicación actual para mostrar estaciones cercanas.
- **Busqueda manual**: Permite ingresar manualmente las coordenadas (Lat, Lng) para ajustar el mapa.
- **Lista de estaciones cercanas**: Muestra las estaciones más cercanas, incluyendo precios de gasolina y gasóleo.
- **Navegación**: Botón "Ir a estación" que abre una ruta en Google Maps hacia la estación seleccionada.
- **Interfaz intuitiva**: Diseño limpio y responsivo para dispositivos móviles y de escritorio.
- **Mapa interactivo**: Visualiza estaciones cercanas y la ubicación actual en un mapa.

## Tecnologías utilizadas

- **React.js**: Framework principal para la interfaz.
- **React Leaflet**: Para la integración con mapas interactivos de OpenStreetMap.
- **Leaflet.js**: Biblioteca de mapas en la que se basa React Leaflet.
- **Google Maps**: Navegación a estaciones.
- **HTML5 y CSS3**: Diseño responsivo y estilización.

## Instalación

Sigue estos pasos para ejecutar el proyecto localmente:

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-repositorio/buscasofa.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd buscasofa
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Inicia la aplicación:

   ```bash
   npm run dev
   ```

5. Abre el navegador en `http://localhost:5173`.

## Uso

1. **Inicio automático con geolocalización**:
   - La aplicación intentará determinar automáticamente tu ubicación y centrar el mapa en tu posición.

2. **Buscar manualmente**:
   - Introduce las coordenadas de latitud y longitud en los campos correspondientes y haz clic en "Actualizar".

3. **Explorar estaciones cercanas**:
   - Consulta la lista de estaciones más cercanas. Cada entrada incluye:
     - Dirección
     - Distancia
     - Precios de gasolina y gasóleo
   - Haz clic en "Ir a estación" para abrir Google Maps con la ruta a la estación.

4. **Mapa interactivo**:
   - Observa el marcador rojo para tu ubicación actual.
   - Explora las estaciones cercanas, representadas como marcadores en el mapa.

## Capturas de pantalla

### Mapa interactivo
![Mapa interactivo](./screenshots/mapa.png)

### Lista de estaciones
![Lista de estaciones](./screenshots/estaciones.png)

## Personalización

Si deseas personalizar el proyecto, asegúrate de ajustar las rutas de los iconos y las configuraciones en `App.jsx`.

## Créditos

- **API de estaciones de servicio**: [API del Ministerio para la Transición Ecológica y el Reto Demográfico](https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/).
- **React Leaflet**: [Sitio oficial](https://react-leaflet.js.org/).
- **OpenStreetMap**: [Sitio oficial](https://www.openstreetmap.org/).

## Licencia

Este proyecto está licenciado bajo la [MIT License](./LICENSE).

---

¡Gracias por usar BuscaSofa! Si tienes comentarios o sugerencias, no dudes en contactarnos.
