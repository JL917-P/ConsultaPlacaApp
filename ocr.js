function buscarPlaca(){
const placa=document.getElementById('placa').value.trim().toUpperCase();
const resultado=document.getElementById('resultado');
if(!placa){resultado.innerHTML='<p style="color:red;">Por favor ingresa una placa.</p>';return;}
resultado.innerHTML=`<p>Buscando información de la placa <b>${placa}</b>...</p>`;
setTimeout(()=>{
resultado.innerHTML=`<h3>Resultado:</h3><p>Propietario: Juan Pérez<br>Modelo: Toyota Corolla 2019<br>Estado: Activo</p>`;
},1500);}