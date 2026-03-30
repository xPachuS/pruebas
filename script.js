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

  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4'
  });

  let y = 25;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const lineHeight = 7;

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('Contrato de Sumisión D/s', pageWidth / 2, y, { align: 'center' });
  y += 12;

  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  // Intro
  let pdfText = contrato.intro
    .replace('${sub}', sub)
    .replace(/\${domme}/g, domme)
    .replace('${duration}', duration)
    .replace('${safeword}', safeword);

  const linesIntro = doc.splitTextToSize(pdfText, pageWidth - 2 * margin);
  doc.text(linesIntro, margin, y);
  y += linesIntro.length * lineHeight + 5;

  // Secciones
  contrato.secciones.forEach(seccion => {
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text(seccion.titulo, margin, y);
    y += lineHeight;

    let textoSeccion = seccion.texto
      .replace('${sub}', sub)
      .replace(/\${domme}/g, domme)
      .replace('${safeword}', safeword);

    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(textoSeccion, pageWidth - 2 * margin);
    doc.text(lines, margin, y);
    y += lines.length * lineHeight + 6;
  });

  // Firmas
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  const firmas = `${contrato.firmas.sumiso}\n\n${contrato.firmas.ama}`;
  const linesFirmas = doc.splitTextToSize(firmas, pageWidth - 2 * margin);
  doc.text(linesFirmas, margin, y);

  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
