[app]
title = ConsultaPlaca
package.name = consultaplaca
package.domain = org.ejemplo
source.dir = .
source.include_exts = py,kv,txt,md
version = 0.1
requirements = python3,kivy==2.3.0,kivymd,requests,urllib3,chardet,certifi,idna
orientation = portrait
fullscreen = 0

# Permisos
android.permissions = INTERNET

# Icono opcional (comenta/actualiza si tienes uno)
# icon.filename = %(source.dir)s/icon.png

[buildozer]
log_level = 2

[android]
# Ajusta si deseas architectures específicas
# android.arch = armeabi-v7a, arm64-v8a

# SDK/NDK se descargan automáticamente en el primer build
