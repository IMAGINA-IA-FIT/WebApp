# Configuración de Google Drive - ✅ CONFIGURADO

## 🔑 Credenciales Configuradas

- **API Key:** `AIzaSyA1MuXY_A732ieAIJ7Rh69e3-wr8_0Okzo` ✅
- **Client ID:** `957026094373-ivrv06aan5pa1sifcu1h8bpc6spvjevu.apps.googleusercontent.com` ✅  
- **Folder ID:** `1IyeuZkruHOwZ8pVd50kw4r3hq9TvbhgR` ✅

## 📁 Carpeta de Destino

Los videos se guardarán en: **[Fitness Videos](https://drive.google.com/drive/u/0/folders/1IyeuZkruHOwZ8pVd50kw4r3hq9TvbhgR)**

## 🚀 Status: LISTO PARA USAR

El sistema está configurado para:
1. ✅ Grabar video en la app
2. ✅ Subir directamente a Google Drive (carpeta específica)
3. ✅ Notificar a Make.com con metadata del archivo real
4. ✅ Make.com puede descargar y procesar el archivo

## 🧪 Para Probar:

1. Abre la app: `http://localhost:5174`
2. Selecciona un ejercicio
3. Graba un video
4. Presiona "Solicitar Feedback"
5. Autoriza acceso a Google Drive (primera vez)
6. Verifica que el archivo aparezca en la carpeta de Google Drive
7. Verifica que Make.com reciba los datos

## 📊 Datos que Make.com Recibirá:

```json
{
  "type": "DRIVE_FILE_UPLOADED",
  "exercise": "Sentadillas",
  "driveFile": {
    "fileId": "1aBcDeFgHiJkL...", // ID real del archivo
    "fileName": "sentadillas-2025-01-15T18-30-00.webm",
    "fileUrl": "https://drive.google.com/file/d/1aBcDeFgHiJkL.../view",
    "mimeType": "video/webm",
    "size": 2331410
  }
}
```

## 🔧 Configurar Make.com:

1. **Webhook** (ya configurado) ✅
2. **Google Drive > Download a file** 
   - File ID: `{{1.driveFile.fileId}}`
3. **Cloud Storage > Upload**
   - File: `{{2.data}}`
   - Name: `{{1.driveFile.fileName}}` 