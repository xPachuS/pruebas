// script.js
const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim();
  const consented = document.getElementById('consented').value.trim();
  const nonconsented = document.getElementById('nonconsented').value.trim();
  const duration = document.getElementById('duration').value.trim();

  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 7;

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text('Contrato de Sumisión D/s', 105, y, { align: 'center' });
  y += 12;

  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  // Reemplazar variables en intro
  let pdfText = contrato.intro
    .replace('${sub}', sub)
    .replace(/\${domme}/g, domme)
    .replace('${duration}', duration)
    .replace('${safeword}', safeword);

  // Agregar secciones
  contrato.secciones.forEach(seccion => {
    let textoSeccion = seccion.texto
      .replace('${sub}', sub)
      .replace(/\${domme}/g, domme)
      .replace('${safeword}', safeword);
    pdfText += `\n\n${seccion.titulo}\n${textoSeccion}`;
  });

  // Agregar firmas
  pdfText += `\n\n${contrato.firmas.sumiso}\n\n${contrato.firmas.ama}`;

  // Dividir líneas si exceden ancho
  const lines = doc.splitTextToSize(pdfText, 180);
  doc.text(lines, 15, y);

  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
