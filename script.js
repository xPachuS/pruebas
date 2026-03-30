const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim();
  const duration = document.getElementById('duration').value.trim();

  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let y = 25;

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('Contrato de Sumisión D/s', pageWidth / 2, y, { align: 'center' });
  y += 12;

  doc.setFont('times', 'normal');
  doc.setFontSize(12);

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

  // Intro
  let pdfText = contrato.intro
    .replace('${sub}', sub)
    .replace(/\${domme}/g, domme)
    .replace('${duration}', duration)
    .replace('${safeword}', safeword);
  addText(pdfText + '\n\n');

  // Secciones
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

  // Firmas
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  const firmas = `${contrato.firmas.sumiso}\n\n${contrato.firmas.ama}`;
  addText(firmas);

  // Guardar PDF
  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
