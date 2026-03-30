const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtener valores del formulario
  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim();
  const duration = document.getElementById('duration').value.trim();

  // Convertir prácticas a listas
  const consentedLines = document.getElementById('consented').value.trim().split('\n');
  const nonconsentedLines = document.getElementById('nonconsented').value.trim().split('\n');

  // Crear PDF
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let y = 25;

  // Función para añadir texto con paginación
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

  // Función para añadir listas
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
    y += lineHeight;
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

  // Prácticas como listas
  addList('Prácticas Consentidas:', consentedLines);
  addList('Prácticas No Consentidas:', nonconsentedLines);

  // Firmas
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  addText(contrato.firmas.sumiso + '\n\n' + contrato.firmas.ama);

  // Guardar PDF
  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
