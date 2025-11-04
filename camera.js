const video = document.getElementById('camera');
const openBtn = document.getElementById('open-camera');
const captureBtn = document.getElementById('capture-btn');
let stream = null;

openBtn.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } }
    });
    video.srcObject = stream;
    video.hidden = false;
    captureBtn.hidden = false;
    openBtn.hidden = true;
  } catch (err) {
    console.error("Error al abrir cámara:", err);
    alert("No se pudo acceder a la cámara trasera. Revisa permisos.");
  }
});

captureBtn.addEventListener('click', () => {
  alert('📸 Captura simulada: placa detectada “W4U807”');
  detenerCamara();
  mostrarDatosVehiculo("W4U807");
});

function detenerCamara() {
  if (stream) stream.getTracks().forEach(track => track.stop());
  video.hidden = true;
  captureBtn.hidden = true;
  openBtn.hidden = false;
}
