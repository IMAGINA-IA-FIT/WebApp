# Configuración del Escenario en Make.com

## 📋 Escenario Simple (Recomendado para Empezar)

### Paso 1: Configurar el Trigger (Webhook)
✅ **Ya tienes esto configurado**

### Paso 2: Agregar Google Drive - Download File

1. **Busca el módulo:** "Google Drive" 
2. **Selecciona:** "Download a file"
3. **Conecta tu cuenta de Google Drive**
4. **Configuración:**
   - **File ID:** `{{1.driveFile.fileId}}`
   - **Convert:** No

### Paso 3: Agregar Cloud Storage (Elige uno)

#### Opción A: Google Cloud Storage
1. **Módulo:** "Google Cloud Storage" > "Upload an object"
2. **Configuración:**
   - **Bucket Name:** `tu-bucket-fitness`
   - **Object Name:** `fitness-videos/{{1.driveFile.fileName}}`
   - **Data:** `{{2.data}}` (del paso anterior)
   - **Content Type:** `{{1.driveFile.mimeType}}`

#### Opción B: AWS S3
1. **Módulo:** "AWS S3" > "Upload a file"
2. **Configuración:**
   - **Bucket:** `tu-bucket-fitness`
   - **Key:** `fitness-videos/{{1.driveFile.fileName}}`
   - **Source data:** `{{2.data}}`
   - **Content Type:** `{{1.driveFile.mimeType}}`

#### Opción C: Mantener en Google Drive (Simple)
1. **Módulo:** "Google Drive" > "Move a file"
2. **Configuración:**
   - **File ID:** `{{1.driveFile.fileId}}`
   - **New Parent Folder:** ID de carpeta "Processed"

## 🧪 Datos de Prueba que Recibirás

Cuando pruebes desde la app, verás estos datos en Make.com:

```json
{
  "type": "DRIVE_FILE_UPLOADED",
  "action": "PROCESS_FITNESS_VIDEO",
  "exercise": "Sentadillas",
  "timestamp": "2025-01-15T...",
  "sessionId": "session_...",
  "userId": "user_...",
  "driveFile": {
    "fileId": "drive_file_1737049380000_abc123def",
    "fileName": "sentadillas_session_1737049380000_abc123def.webm",
    "fileUrl": "https://drive.google.com/file/d/drive_file_1737049380000_abc123def/view",
    "mimeType": "video/webm",
    "size": 2331410
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "platform": "Win32",
    "language": "es-ES"
  }
}
```

## 🔧 Configuración Avanzada (Opcional)

### Agregar Análisis con IA
1. **Módulo:** "OpenAI" > "Create a Chat Completion"
2. **Prompt:** 
   ```
   Analiza este video de ejercicio:
   - Ejercicio: {{1.exercise}}
   - Duración: Basado en {{1.driveFile.size}}
   - Dame 3 consejos de mejora
   ```

### Notificaciones
1. **Módulo:** "Email" > "Send an email"
2. **Para:** Tu email
3. **Asunto:** `Video procesado: {{1.exercise}}`
4. **Contenido:** 
   ```
   Video de {{1.exercise}} procesado exitosamente.
   
   Archivo: {{1.driveFile.fileName}}
   Tamaño: {{1.driveFile.size}} bytes
   Hora: {{1.timestamp}}
   
   URL del archivo: {{1.driveFile.fileUrl}}
   ```

### Log/Database
1. **Módulo:** "Google Sheets" > "Add a row"
2. **Hoja:** "Fitness Tracking"
3. **Datos:**
   - **A:** `{{1.timestamp}}`
   - **B:** `{{1.exercise}}`
   - **C:** `{{1.userId}}`
   - **D:** `{{1.driveFile.fileName}}`
   - **E:** `{{1.driveFile.size}}`

## ✅ Verificación del Escenario

### Lista de Verificación:
- [ ] Webhook recibe datos correctamente
- [ ] Google Drive puede descargar el archivo usando `fileId`
- [ ] Cloud storage recibe el archivo
- [ ] No hay errores en las ejecuciones
- [ ] Los logs muestran datos correctos

### Troubleshooting Común:

#### Error: "File not found in Google Drive"
- **Causa:** El `fileId` es simulado (aún no hay subida real a Drive)
- **Solución temporal:** Sube manualmente un archivo a Drive y usa su ID real
- **Solución final:** Implementar la subida real a Google Drive

#### Error: "Access denied to Google Drive"
- **Causa:** Make.com no tiene permisos
- **Solución:** Reconectar la cuenta de Google Drive en Make.com

#### Error: "Bucket not found"
- **Causa:** El bucket de cloud storage no existe
- **Solución:** Crear el bucket primero

## 🚀 Prueba Rápida

### Método 1: Con Datos Simulados
1. Ejecuta tu app
2. Graba un video corto (5-10 segundos)
3. Presiona "Solicitar Feedback"
4. Ve a Make.com y verifica la ejecución
5. Los datos de `driveFile` son simulados pero válidos

### Método 2: Con Archivo Real de Drive
1. Sube manualmente un video a Google Drive
2. Copia el File ID desde la URL: 
   `https://drive.google.com/file/d/[FILE_ID]/view`
3. En Make.com, ejecuta manualmente con este File ID
4. Verifica que el archivo se descargue y procese

## 💡 Próximos Pasos

1. **Implementar subida real a Google Drive** (si lo necesitas)
2. **Configurar análisis de IA** para feedback real
3. **Agregar base de datos** para tracking
4. **Configurar notificaciones** para monitoreo

¿Necesitas ayuda configurando algún módulo específico? 