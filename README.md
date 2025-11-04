# Consulta Vehicular (Python → Android)

App en **Kivy/KivyMD** que consulta datos por **placa vehicular** usando una API pública de ejemplo y guarda resultados en **SQLite** para uso **offline**. Empaquetable a **APK** con **Buildozer**.

## Estructura
```
ConsultaPlacaApp/
├─ main.py
├─ buildozer.spec
└─ README.md
```

## Requisitos
- Linux o **WSL2** (Windows Subsystem for Linux) para compilar con Buildozer
- Python 3.10+
- Java + Android SDK/NDK (Buildozer los gestiona automáticamente)

## Instalación rápida (Ubuntu/WSL2)
```bash
sudo apt update && sudo apt install -y python3-pip git zip openjdk-17-jdk
pip install --upgrade pip
pip install buildozer cython
# Primer inicio dentro del proyecto
buildozer init  # ya incluimos el spec, pero crea dirs requeridos
```

## Compilar a APK
```bash
# En la carpeta del proyecto
buildozer android debug
# El APK quedará en: bin/*.apk
```

## Ejecutar en escritorio (opcional)
```bash
pip install kivy kivymd requests
python main.py
```

## Notas
- La API usada es de ejemplo: `https://api.apis.net.pe/v1/placa?numero=ABC123`.
- Puedes **reemplazarla** por tu propia API o base de datos.
- La base local `placas.db` se crea automáticamente y realiza *upsert* por placa.
- Permisos Android requeridos: `INTERNET`.
```
