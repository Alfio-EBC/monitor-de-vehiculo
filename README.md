# Simon Movilidad - Sala de Control de Flotas

Una aplicacion moderna y de alto rendimiento para el monitoreo de flotas de vehiculos en tiempo real, integrada con la API de Traccar. Cuenta con un mapa interactivo (React-Leaflet), deteccion automatica de rumbo, calculo de telemetria detallada, filtrado geografico avanzado por paises y soporte completo para modo claro/oscuro.

---

## Caracteristicas Principales

*   Monitoreo en Tiempo Real: Conexion y sincronizacion automatica cada 4 segundos con servidores Traccar.
*   Centrado de Camara Inteligente: Algoritmo avanzado que proyecta coordenadas geograficas a pixeles de pantalla, compensando la camara para que los paneles de interfaz (especialmente en moviles) nunca obstruyan la visualizacion del vehiculo.
*   Filtro Geografico Dinamico: Agrupacion y filtrado rap de forma reactiva por paises y ciudades.
*   Estilo Corporativo: Disenado con Tailwind CSS v4 usando la directiva @theme para la inyeccion de la fuente corporativa MuseoSans y scrollbars delgados personalizados.
*   Transicion de Capas Suave: Cambios fluidos con efecto fade entre mapas viales, satelitales, topograficos y oscuros.

---

## Requisitos Previos

Antes de comenzar, asegurese de tener instalado:
*   Node.js (Version 18 o superior recomendada)
*   npm o Yarn

---

## Instalacion y Configuracion Local

Siga estos pasos para ejecutar la aplicacion en su entorno de desarrollo local:

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/simon-movilidad.git](https://github.com/tu-usuario/simon-movilidad.git)
   cd simon-movilidad


*Instalar dependencias:

    Bash
    npm install

*Configurar las variables de entorno:

    Cree un archivo .env (o .env.local si utiliza Vite) en la raiz del proyecto y defina los endpoints y credenciales de conexion:

    # Endpoint de la API de Traccar
    VITE_API_BASE=[https://demo4.traccar.org/api](https://demo4.traccar.org/api)

    # Credenciales de acceso de Traccar
    VITE_TRACCAR_EMAIL=demo@traccar.org
    VITE_TRACCAR_PASSWORD=demo


*Iniciar el servidor de desarrollo:
    
    npm run dev


*La aplicacion se abrira automaticamente en su navegador en http://localhost:5173 (o el puerto configurado por su empaquetador).

    Integracion con Traccar
    La aplicacion se comunica con el backend de Traccar a traves de los siguientes endpoints estandar:

    Autenticacion (POST /session): Se realiza una peticion de inicio de sesion utilizando codificacion Basic Auth en las cabeceras (con las credenciales del .env) y enviando los parametros en formato application/x-www-form-urlencoded para establecer la sesion de manera persistente.

    Obtencion de Activos (GET /devices): Recupera la lista de dispositivos vinculados a la cuenta para mapear sus estados (online/offline) e identificadores unicos de seguimiento.

    Simulacion de Telemetria Realista: Combina los datos de Traccar con coordenadas y rumbos de simulacion en plano urbano para 40 vehiculos concurrentes distribuidos en ciudades de Colombia, Peru, Argentina, Chile, Mexico y Espana.

