import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

// Ajuste de iconos Leaflet por defecto
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/icons/marker-icon-2x.png',
  iconUrl: '/icons/marker-icon.png',
  shadowUrl: '/icons/marker-shadow.png'
})

// Icono rojo para la ubicación actual
const redIcon = new L.Icon({
  iconRetinaUrl: '/icons/marker-icon-2x-red.png',
  iconUrl: '/icons/marker-icon-red.png',
  shadowUrl: '/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// definimos coordenadas por defecto
const PUERTA_DEL_SOL = { lat: 40.4169, lng: -3.7035 }

function MoverCentro({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, 13)
    }
  }, [center, map])
  return null
}

// funcion para re-centrar el mapa
function App() {
  const [posicion, setPosicion] = useState(PUERTA_DEL_SOL)
  const [estaciones, setEstaciones] = useState([])

  const [latInput, setLatInput] = useState(posicion.lat.toString())
  const [lngInput, setLngInput] = useState(posicion.lng.toString())

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nuevaPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
        setPosicion(nuevaPos)
        setLatInput(nuevaPos.lat.toString())
        setLngInput(nuevaPos.lng.toString())
      },
      () => {
        console.warn('No se pudo obtener geolocalización, usando puerta del sol.')
      }
    )
  }, [])

  // Llamada a la API para estaciones
  useEffect(() => {
    const fetchEstaciones = async () => {
      try {
        const url =
          'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'
        const resp = await fetch(url)
        const data = await resp.json()

        if (data?.ListaEESSPrecio) {
          const listaValida = data.ListaEESSPrecio
            .map((est) => {
              const latStr = est['Latitud']
              const lngStr = est['Longitud (WGS84)']
              if (!latStr || !lngStr) return null

              return {
                nombre: est['Rótulo'],
                direccion: est['Dirección'] || 'Sin dirección',
                lat: parseFloat(latStr.replace(',', '.')),
                lng: parseFloat(lngStr.replace(',', '.')),
                gasolina95: est['Precio Gasolina 95 E5'] || 'N/A',
                gasoleoA: est['Precio Gasoleo A'] || 'N/A'
              }
            })
            .filter((item) => item !== null)

          setEstaciones(listaValida)
        }
      } catch (error) {
        console.error('Error obteniendo datos', error)
      }
    }
    fetchEstaciones()
  }, [])

  // Distancia Haversine
  const calcularDistancia = (lat1, lng1, lat2, lng2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        (Math.sin(dLng / 2) ** 2)
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const estacionesCercanas = estaciones
    .map((est) => {
      const dist = calcularDistancia(posicion.lat, posicion.lng, est.lat, est.lng)
      return { ...est, distancia: dist.toFixed(1) }
    })
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, 10)

  // Cambia la posición del mapa usando los valores introducidos
  const actualizarUbicacionManual = () => {
    const nuevaLat = parseFloat(latInput)
    const nuevaLng = parseFloat(lngInput)
    if (!isNaN(nuevaLat) && !isNaN(nuevaLng)) {
      setPosicion({ lat: nuevaLat, lng: nuevaLng })
    } else {
      alert('Por favor, introduce valores numéricos válidos.')
    }
  }

  const abrirEnGoogleMaps = (est) => {
    const url = `https://www.google.com/maps/dir/${posicion.lat},${posicion.lng}/${est.lat},${est.lng}/`
    window.open(url, '_blank')
  }

  return (
    <div className="container">
      <header className="header">
        <img src="/buscasofa.png" alt="BuscaSofa" className="logo" />
      </header>

      <div className="buscar-input">
        <p>
          Ubicación actual: {posicion.lat.toFixed(3)}, {posicion.lng.toFixed(3)}
        </p>

        <div >
          <label>
            Lat:
            <input
              type="text"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              style={{ width: '80px', marginLeft: '0.5rem' }}
            />
          </label>
          <label style={{ marginLeft: '1rem' }}>
            Lng:
            <input
              type="text"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              style={{ width: '80px', marginLeft: '0.5rem' }}
            />
          </label>
          <button onClick={actualizarUbicacionManual} style={{ marginLeft: '1rem' }}>
            Actualizar
          </button>
        </div>
      </div>

      <div className="mapa">
        <MapContainer center={[posicion.lat, posicion.lng]} zoom={13} style={{ height: '400px' }}>
          <MoverCentro center={[posicion.lat, posicion.lng]} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          <Marker position={[posicion.lat, posicion.lng]} icon={redIcon}>
            <Popup>Estás aquí</Popup>
          </Marker>
          {estacionesCercanas.map((est, idx) => (
            <Marker key={idx} position={[est.lat, est.lng]}>
              <Popup>
                <strong>{est.nombre}</strong>
                <br />
                Dirección: {est.direccion}
                <br />
                Gasóleo A: {est.gasoleoA}
                <br />
                Gasolina 95: {est.gasolina95}
                <br />
                Distancia: {est.distancia} km
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="lista-estaciones">
        <h2>Estaciones Cercanas</h2>
        <ul>
          {estacionesCercanas.map((est, idx) => (
            <li key={idx}>
              <strong>{est.nombre}</strong> - {est.direccion} (distancia {est.distancia} km)
              <br />
              Precios: Gasoil - {est.gasoleoA} € | Gasolina 95 - {est.gasolina95} € &nbsp;

              <button onClick={() => abrirEnGoogleMaps(est)} style={{ marginTop: '0.5rem' }}>
                iniciar ruta
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
