const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');
const closeBtn = document.getElementById('closeBtn');
let stream;

// Abrir cámara cuando el usuario lo decida
async function openCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' } // cámara trasera
    });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
  }
}

// Capturar imagen
captureBtn.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const imageData = canvas.toDataURL('image/png');
  console.log("📷 Imagen capturada:", imageData.substring(0, 50) + "...");
  alert("Imagen capturada correctamente ✅");
});

// Cerrar cámara (nuevo botón)
closeBtn.addEventListener('click', () => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop()); // detiene la cámara
    video.srcObject = null;
    alert("Cámara cerrada ❌");
  }
});

// Llamar a la función cuando el usuario quiera abrir la cámara
document.addEventListener('DOMContentLoaded', openCamera);
