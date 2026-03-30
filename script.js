const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

// Función para capitalizar la primera letra de cada palabra
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtener y capitalizar valores del formulario
  const domme = capitalizeWords(document.getElementById('domme').value.trim());
  const sub = capitalizeWords(document.getElementById('sub').value.trim());
  const safeword = document.getElementById('safeword').value.trim();
  const duration = capitalizeWords(document.getElementById('duration').value.trim());

  // Convertir prácticas a listas con capitalización
  const consentedLines = document.getElementById('consented').value
    .trim()
    .split('\n')
    .map(line => capitalizeWords(line));

  const nonconsentedLines = document.getElementById('nonconsented').value
    .trim()
    .split('\n')
    .map(line => capitalizeWords(line));

  // Crear PDF
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let y = 25;

  // Función para añadir texto con paginación automática
  function addText(text) {
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach(line => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
  }

  // Función para añadir listas con viñetas
  function addList(title, items) {
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(title, margin, y);
    y += lineHeight;

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    items.forEach(item => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(`- ${item}`, margin + 5, y);
      y += lineHeight;
    });
    y += lineHeight; // espacio extra después de la lista
  }

  // Título del contrato
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('Contrato de Sumisión D/s', pageWidth / 2, y, { align: 'center' });
  y += 12;

  // Texto de introducción
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  let introText = contrato.intro
    .replace('${sub}', sub)
    .replace(/\${domme}/g, domme)
    .replace('${duration}', duration)
    .replace('${safeword}', safeword);
  addText(introText + '\n\n');

  // Secciones del contrato
  contrato.secciones.forEach(seccion => {
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(seccion.titulo, margin, y);
    y += lineHeight;

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    let textoSeccion = seccion.texto
      .replace('${sub}', sub)
      .replace(/\${domme}/g, domme)
      .replace('${safeword}', safeword);
    addText(textoSeccion + '\n\n');
  });

  // Añadir listas de prácticas
  addList('Prácticas Consentidas:', consentedLines);
  addList('Prácticas No Consentidas:', nonconsentedLines);

  // Firmas
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  addText(contrato.firmas.sumiso + '\n\n' + contrato.firmas.ama);

  // Guardar PDF
  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
