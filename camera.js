const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const closeBtn = document.getElementById("closeBtn");
let stream = null;

// Abrir cámara trasera
captureBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    video.srcObject = stream;
    video.hidden = false;
    await video.play();
  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
  }
});

// Cerrar cámara
closeBtn.addEventListener("click", () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  video.srcObject = null;
  video.hidden = true;
});

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
document.getElementById("captureBtn").addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" } // cámara trasera
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = "100%";
    video.style.maxWidth = "400px";
    document.body.appendChild(video);

    // Cerrar cámara al presionar el botón "Cerrar"
    const closeBtn = document.getElementById("closeBtn");
    closeBtn.onclick = () => {
      stream.getTracks().forEach(track => track.stop());
      video.remove();
    };
  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
  }
});
