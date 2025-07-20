# Integración con Make.com

Este proyecto utiliza Make.com como backend para procesar videos de ejercicios y almacenarlos en cloud storage.

## Configuración

### 1. Configurar Make.com

1. Crea un nuevo escenario en Make.com
2. Agrega un webhook como trigger (módulo "Webhooks > Custom webhook")
3. Copia la URL del webhook que Make.com te proporciona

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente variable:

```env
VITE_MAKE_WEBHOOK_URL=https://hook.make.com/tu-webhook-endpoint-aqui
```

**Ejemplo de URL real:**
```env
VITE_MAKE_WEBHOOK_URL=https://hook.make.com/abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### 3. Configurar el Escenario en Make.com

El webhook recibirá un JSON con la siguiente estructura:

```json
{
  "exercise": "Sentadillas",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "sessionId": "session_1705312200000_abc123def",
  "userId": "user_1705312200000",
  "video": {
    "data": "base64-encoded-video-data",
    "mimeType": "video/webm",
    "size": 1234567
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "platform": "Win32",
    "language": "es-ES"
  }
}
```

### 4. Módulos Recomendados para Make.com

1. **Webhook** - Para recibir los datos
2. **Base64 to File** - Para convertir el video
3. **Google Drive/AWS S3/Azure Blob** - Para almacenar el video
4. **OpenAI/Claude API** - Para análisis de IA (opcional)
5. **Email/Slack** - Para notificaciones (opcional)

### 5. Flujo Sugerido

```
Webhook → Base64 to File → Cloud Storage → AI Analysis → Response
```

## Estructura de Datos

### Request (desde la app al webhook)
- `exercise`: Nombre del ejercicio
- `timestamp`: Fecha y hora ISO
- `sessionId`: ID único de la sesión
- `userId`: ID del usuario
- `video.data`: Video en base64
- `video.mimeType`: Tipo MIME del video
- `video.size`: Tamaño en bytes
- `metadata`: Información adicional del navegador

### Response (opcional, desde Make.com a la app)
```json
{
  "success": true,
  "message": "Video procesado exitosamente",
  "videoUrl": "https://storage.example.com/videos/session_123.webm",
  "analysis": {
    "score": 85,
    "feedback": "Excelente técnica general..."
  }
}
```

## Pruebas

Para probar la integración:

1. Configura un webhook simple en Make.com que solo reciba y loguee los datos
2. Ejecuta la app y graba un video
3. Presiona "Solicitar Feedback"
4. Verifica en Make.com que los datos lleguen correctamente

## Seguridad

- El video se envía en base64, lo que es seguro para webhooks HTTPS
- Make.com maneja la autenticación y seguridad del webhook
- Considera agregar validación adicional en Make.com (tokens, IPs permitidas, etc.)

## Troubleshooting

### Error: "Error al enviar el video"
- Verifica que la URL del webhook sea correcta
- Asegúrate de que el escenario en Make.com esté activo
- Revisa los logs en Make.com para ver errores específicos

### Video muy grande
- Los webhooks tienen límites de tamaño
- Considera comprimir el video antes de enviarlo
- O usa un flujo alternativo: subir a storage temporal y enviar solo la URL

### Timeout
- Make.com puede tener timeouts en webhooks
- Para videos grandes, considera usar procesamiento asíncrono 