from kivymd.app import MDApp
from kivy.lang import Builder
from kivy.clock import mainthread
from kivy.core.window import Window
from kivymd.uix.snackbar import Snackbar
from kivymd.uix.dialog import MDDialog
from kivymd.uix.button import MDFlatButton, MDRaisedButton
from kivy.properties import StringProperty, BooleanProperty
import sqlite3, requests, threading, datetime

KV = """
MDScreen:
    md_bg_color: app.theme_cls.bg_normal

    MDTopAppBar:
        title: "Consulta Vehicular"
        elevation: 2
        pos_hint: {"top": 1}
        left_action_items: [["car", lambda x: None]]
        right_action_items: [["database", app.open_cache]]
    
    MDBoxLayout:
        orientation: "vertical"
        padding: dp(16), dp(64), dp(16), dp(16)
        spacing: dp(12)

        MDTextField:
            id: placa_input
            hint_text: "Ingrese placa (ej: ABC123)"
            helper_text: "Solo letras y números, sin guiones"
            helper_text_mode: "on_focus"
            text: app.placa_text
            on_text: app.placa_text = self.text.upper()
            max_text_length: 8

        MDBoxLayout:
            adaptive_height: True
            spacing: dp(8)

            MDRaisedButton:
                text: "Buscar"
                on_release: app.on_buscar()

            MDFlatButton:
                text: "Limpiar"
                on_release: app.clear_output()

            MDCheckbox:
                id: online_toggle
                size_hint: None, None
                size: dp(24), dp(24)
                active: app.force_online
                on_active: app.switch_online(self.active)
            MDLabel:
                text: "Forzar en línea"
                halign: "left"
                valign: "middle"

        MDCard:
            id: result_card
            orientation: "vertical"
            padding: dp(14)
            size_hint_y: None
            height: self.minimum_height
            MDLabel:
                id: result_label
                text: app.result_text
                theme_text_color: "Primary"
                halign: "left"
                markup: True

        MDSeparator:

        MDBoxLayout:
            adaptive_height: True
            spacing: dp(8)
            MDTextField:
                id: marca_input
                hint_text: "Marca (guardar manual)"
            MDTextField:
                id: modelo_input
                hint_text: "Modelo (guardar manual)"
            MDRaisedButton:
                text: "Guardar"
                on_release: app.guardar_manual()

"""

class ConsultaPlacaApp(MDApp):
    placa_text = StringProperty("")
    result_text = StringProperty("Esperando consulta…")
    force_online = BooleanProperty(False)

    def build(self):
        self.title = "Consulta Vehicular"
        self.theme_cls.primary_palette = "Blue"
        self.theme_cls.material_style = "M3"
        self._db_path = "placas.db"
        self._ensure_db()
        return Builder.load_string(KV)

    def _ensure_db(self):
        con = sqlite3.connect(self._db_path)
        cur = con.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS placas (
                placa TEXT PRIMARY KEY,
                marca TEXT,
                modelo TEXT,
                fuente TEXT,
                actualizado TEXT
            )
        """)
        con.commit()
        con.close()

    def switch_online(self, active):
        self.force_online = bool(active)
        Snackbar(text=f"{'Usando API en línea' if active else 'Usando caché/local si existe'}").open()

    def clear_output(self):
        self.result_text = "Esperando consulta…"
        self.root.ids.placa_input.text = ""
        self.root.ids.marca_input.text = ""
        self.root.ids.modelo_input.text = ""

    def _validar_placa(self, s):
        s = (s or "").strip().upper()
        return s if s and s.replace("-", "").isalnum() else ""

    def on_buscar(self):
        placa = self._validar_placa(self.root.ids.placa_input.text)
        if not placa:
            Snackbar(text="⚠️ Ingrese una placa válida").open()
            return
        self.result_text = "⌛ Buscando…"
        threading.Thread(target=self._buscar_thread, args=(placa,), daemon=True).start()

    def _buscar_thread(self, placa):
        # 1) Si no se fuerza en línea, intentar cache
        if not self.force_online:
            reg = self._buscar_cache(placa)
            if reg:
                self._mostrar_resultado(placa, reg, cached=True)
                return
        # 2) Consultar API pública de ejemplo (Perú)
        try:
            url = f"https://api.apis.net.pe/v1/placa?numero={placa}"
            r = requests.get(url, timeout=15)
            if r.status_code == 200:
                data = r.json()
                marca = data.get("marca") or data.get("Marca") or "Desconocido"
                modelo = data.get("modelo") or data.get("Modelo") or "N/D"
                reg = {
                    "marca": str(marca),
                    "modelo": str(modelo),
                    "fuente": "api.apis.net.pe",
                    "actualizado": datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z"
                }
                # Guardar / actualizar caché
                self._guardar_cache(placa, reg)
                self._mostrar_resultado(placa, reg, cached=False)
            else:
                self._mostrar_error("No se encontró la placa en la API.")
        except Exception as e:
            self._mostrar_error(f"Error de conexión: {e}")

    def _buscar_cache(self, placa):
        con = sqlite3.connect(self._db_path)
        cur = con.cursor()
        cur.execute("SELECT marca, modelo, fuente, actualizado FROM placas WHERE placa = ?", (placa,))
        row = cur.fetchone()
        con.close()
        if row:
            return {"marca": row[0], "modelo": row[1], "fuente": row[2], "actualizado": row[3]}
        return None

    def _guardar_cache(self, placa, reg):
        con = sqlite3.connect(self._db_path)
        cur = con.cursor()
        cur.execute("""
            INSERT INTO placas (placa, marca, modelo, fuente, actualizado)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(placa) DO UPDATE SET
                marca=excluded.marca,
                modelo=excluded.modelo,
                fuente=excluded.fuente,
                actualizado=excluded.actualizado
        """, (placa, reg.get("marca"), reg.get("modelo"), reg.get("fuente"), reg.get("actualizado")))
        con.commit()
        con.close()

    @mainthread
    def _mostrar_resultado(self, placa, reg, cached=False):
        fuente = reg.get("fuente") or ("caché" if cached else "desconocida")
        self.result_text = (
            f"[b]Placa:[/b] {placa}\n"
            f"[b]Marca:[/b] {reg.get('marca','N/D')}\n"
            f"[b]Modelo:[/b] {reg.get('modelo','N/D')}\n"
            f"[b]Fuente:[/b] {fuente}\n"
            f"[b]Actualizado:[/b] {reg.get('actualizado','')}"
        )
        # Rellenar campos manuales
        self.root.ids.marca_input.text = reg.get('marca','')
        self.root.ids.modelo_input.text = reg.get('modelo','')

    @mainthread
    def _mostrar_error(self, msg):
        self.result_text = f"[b]Error:[/b] {msg}"
        Snackbar(text=msg).open()

    def guardar_manual(self):
        placa = self._validar_placa(self.root.ids.placa_input.text)
        if not placa:
            Snackbar(text="Ingrese una placa válida").open()
            return
        marca = (self.root.ids.marca_input.text or "").strip()
        modelo = (self.root.ids.modelo_input.text or "").strip()
        if not (marca or modelo):
            Snackbar(text="Complete marca o modelo para guardar").open()
            return
        reg = {
            "marca": marca or "N/D",
            "modelo": modelo or "N/D",
            "fuente": "manual",
            "actualizado": datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z"
        }
        self._guardar_cache(placa, reg)
        self._mostrar_resultado(placa, reg, cached=True)
        Snackbar(text="Guardado en caché local").open()

    def open_cache(self, *args):
        # Dialogo simple mostrando conteo de registros
        con = sqlite3.connect(self._db_path)
        cur = con.cursor()
        cur.execute("SELECT COUNT(*) FROM placas")
        n = cur.fetchone()[0]
        con.close()
        dlg = MDDialog(
            title="Caché local",
            text=f"Registros guardados: {n}\nLa base se almacena en: {self._db_path}",
            buttons=[MDFlatButton(text="Cerrar", on_release=lambda x: dlg.dismiss())]
        )
        dlg.open()


if __name__ == "__main__":
    ConsultaPlacaApp().run()
