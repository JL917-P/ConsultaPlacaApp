const video=document.getElementById('camera');
const captureBtn=document.getElementById('capture-btn');
if(navigator.mediaDevices.getUserMedia){
navigator.mediaDevices.getUserMedia({video:true}).then(stream=>video.srcObject=stream)
.catch(err=>console.log('Error cámara:',err));}
captureBtn.addEventListener('click',()=>{alert('📸 Imagen capturada (simulada).');});