const buscarBtn = document.getElementById("buscarBtn");
const placaInput = document.getElementById("placaInput");

buscarBtn.addEventListener("click", () => {
  const placa = placaInput.value.trim().toUpperCase();
  if (placa) mostrarDatosVehiculo(placa);
  else alert("Por favor ingresa una placa válida.");
});

function mostrarDatosVehiculo(placa) {
  // Ejemplo: datos simulados (puedes conectarlo a API o base real)
  const datos = {
    "W4U807": {
      "N° PLACA": "W4U807",
      "N° SERIE": "KN3JAP3V1RK048532",
      "N° VIN": "KN3JAP3V1RK048532",
      "N° MOTOR": "FD350096981",
      "COLOR": "AZUL",
      "MARCA": "KIA",
      "MODELO": "TRADE",
      "PLACA VIGENTE": "W4U807",
      "PLACA ANTERIOR": "XP5657",
      "ESTADO": "EN CIRCULACIÓN",
      "ANOTACIONES": "NINGUNA",
      "SEDE": "LA MERCED (SELVA CENTRAL)",
      "AÑO DE MODELO": "1994",
      "PROPIETARIO(S)": "ROJAS ASTETE, WILLIAM DAVID"
    },
    "ABC123": {
      "N° PLACA": "ABC123",
      "N° SERIE": "XYZ0987654321",
      "N° VIN": "XYZ0987654321",
      "N° MOTOR": "MN123456789",
      "COLOR": "NEGRO",
      "MARCA": "TOYOTA",
      "MODELO": "COROLLA",
      "PLACA VIGENTE": "ABC123",
      "PLACA ANTERIOR": "AAA111",
      "ESTADO": "EN REVISIÓN",
      "ANOTACIONES": "MULTA PENDIENTE",
      "SEDE": "LIMA",
      "AÑO DE MODELO": "2018",
      "PROPIETARIO(S)": "PÉREZ GÓMEZ, JUAN CARLOS"
    }
  };

  const data = datos[placa] || null;
  const resultado = document.getElementById("resultado");
  const vehiculoDatos = document.getElementById("vehiculoDatos");
  vehiculoDatos.innerHTML = "";

  if (!data) {
    vehiculoDatos.innerHTML = `<p>No se encontraron datos para la placa <strong>${placa}</strong>.</p>`;
  } else {
    Object.entries(data).forEach(([key, value]) => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${key}:</strong> ${value}`;
      vehiculoDatos.appendChild(p);
    });
  }

  resultado.hidden = false;
  resultado.scrollIntoView({ behavior: "smooth" });
}
