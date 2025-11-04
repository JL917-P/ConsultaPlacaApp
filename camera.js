const video = document.getElementById("video");
const openCameraBtn = document.getElementById("openCameraBtn");
const captureBtn = document.getElementById("captureBtn");
const closeBtn = document.getElementById("closeBtn");

let stream;

// 🔹 Abrir cámara trasera
openCameraBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    video.srcObject = stream;
    video.hidden = false;
    await video.play();

    openCameraBtn.disabled = true;
    captureBtn.disabled = false;
    closeBtn.disabled = false;

  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
  }
});

// 🔹 Capturar imagen
captureBtn.addEventListener("click", () => {
  if (!stream) return alert("Primero abre la cámara 📷");

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imgData = canvas.toDataURL("image/png");
  console.log("📸 Imagen capturada:", imgData.substring(0, 80) + "...");
  alert("✅ Imagen capturada correctamente");
});

// 🔹 Cerrar cámara
closeBtn.addEventListener("click", () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  video.srcObject = null;
  video.hidden = true;

  openCameraBtn.disabled = false;
  captureBtn.disabled = true;
  closeBtn.disabled = true;
});
