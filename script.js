const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

// Capitaliza la primera letra de cada palabra
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Función para escribir texto con negrita en placeholders
function addStyledText(doc, yStart, text, replacements, margin, lineHeight, pageWidth, pageHeight) {
  let y = yStart;
  const words = text.split(' ');

  let line = '';
  const maxWidth = pageWidth - 2 * margin;

  words.forEach((word, idx) => {
    let testLine = line + word + ' ';
    const textWidth = doc.getTextWidth(testLine);

    if (textWidth > maxWidth) {
      // dibujar línea actual
      y = drawLineWithBold(doc, line.trim(), replacements, margin, y, maxWidth, lineHeight, pageHeight);
      line = word + ' ';
    } else {
      line = testLine;
    }

    // dibujar última línea
    if (idx === words.length - 1) {
      y = drawLineWithBold(doc, line.trim(), replacements, margin, y, maxWidth, lineHeight, pageHeight);
    }
  });
  return y;
}

// Función para dibujar línea con placeholders en negrita
function drawLineWithBold(doc, line, replacements, margin, y, maxWidth, lineHeight, pageHeight) {
  if (y + lineHeight > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }

  let x = margin;
  const parts = line.split(/(\$\{[^\}]+\})/g); // divide placeholders
  parts.forEach(part => {
    if (replacements[part]) {
      doc.setFont('times', 'bold');
      doc.text(replacements[part], x, y, { align: 'left' });
      x += doc.getTextWidth(replacements[part] + ' ');
    } else {
      doc.setFont('times', 'normal');
      doc.text(part + ' ', x, y, { align: 'left' });
      x += doc.getTextWidth(part + ' ');
    }
  });

  return y + lineHeight;
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const domme = capitalizeWords(document.getElementById('domme').value.trim());
  const sub = capitalizeWords(document.getElementById('sub').value.trim());
  const safeword = document.getElementById('safeword').value.trim();
  const duration = capitalizeWords(document.getElementById('duration').value.trim());

  const consentedLines = document.getElementById('consented').value
    .trim()
    .split('\n')
    .map(line => capitalizeWords(line));

  const nonconsentedLines = document.getElementById('nonconsented').value
    .trim()
    .split('\n')
    .map(line => capitalizeWords(line));

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let y = 25;

  // Título
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('Contrato de Sumisión D/s', pageWidth / 2, y, { align: 'center' });
  y += 12;

  // Replacements en negrita
  const replacements = {
    '${sub}': sub,
    '${domme}': domme,
    '${safeword}': safeword,
    '${duration}': duration
  };

  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  // Introducción con negritas
  y = addStyledText(doc, y, contrato.intro, replacements, margin, lineHeight, pageWidth, pageHeight);
  y += lineHeight;

  // Secciones
  contrato.secciones.forEach(seccion => {
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    if (y + lineHeight > pageHeight - margin) { doc.addPage(); y = margin; }
    doc.text(seccion.titulo, margin, y, { align: 'left' });
    y += lineHeight;

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    y = addStyledText(doc, y, seccion.texto, replacements, margin, lineHeight, pageWidth, pageHeight);
    y += lineHeight;
  });

  // Listas de prácticas
  function addList(title, items) {
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    if (y + lineHeight > pageHeight - margin) { doc.addPage(); y = margin; }
    doc.text(title, margin, y, { align: 'left' });
    y += lineHeight;

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    items.forEach(item => {
      if (y + lineHeight > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.text(`- ${item}`, margin + 5, y, { maxWidth: pageWidth - 2 * margin - 5, align: 'justify' });
      y += lineHeight;
    });
    y += lineHeight;
  }

  addList('Prácticas Consentidas:', consentedLines);
  addList('Prácticas No Consentidas:', nonconsentedLines);

  // Firmas
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  y = addStyledText(doc, y, contrato.firmas.sumiso + '\n\n' + contrato.firmas.ama, replacements, margin, lineHeight, pageWidth, pageHeight);

  // Guardar PDF
  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
