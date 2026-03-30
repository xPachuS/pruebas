const form = document.getElementById('contractForm');

// Capitalizar la primera letra de cada palabra
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Reemplazar placeholders en el contrato
function fillPlaceholders(text, values) {
  return text
    .replace(/\$\{sub\}/g, values.sub)
    .replace(/\$\{domme\}/g, values.domme)
    .replace(/\$\{duration\}/g, values.duration)
    .replace(/\$\{safeword\}/g, values.safeword);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Obtener y capitalizar valores
  const sub = capitalizeWords(document.getElementById('sub').value.trim());
  const domme = capitalizeWords(document.getElementById('domme').value.trim());
  const safeword = capitalizeWords(document.getElementById('safeword').value.trim());
  const duration = capitalizeWords(document.getElementById('duration').value.trim());

  // Prácticas: convertir a listas y capitalizar
  const consented = document.getElementById('consented').value
    .trim()
    .split('\n')
    .filter(line => line)
    .map(line => capitalizeWords(line));

  const nonconsented = document.getElementById('nonconsented').value
    .trim()
    .split('\n')
    .filter(line => line)
    .map(line => capitalizeWords(line));

  // Crear PDF
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let y = margin;

  function addText(text, fontStyle = 'normal', fontSize = 12) {
    doc.setFont('times', fontStyle);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach(line => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y, { maxWidth: pageWidth - 2 * margin, align: 'justify' });
      y += lineHeight;
    });
    y += 3; // espacio extra después del párrafo
  }

  function addList(title, items) {
    addText(title, 'bold', 14);
    items.forEach(item => addText(`- ${item}`, 'normal', 12));
  }

  // Reemplazar placeholders en intro y secciones
  const values = { sub, domme, duration, safeword };

  addText(fillPlaceholders(contrato.intro, values), 'normal', 12);

  contrato.secciones.forEach(sec => {
    addText(fillPlaceholders(sec.titulo, values), 'bold', 14);
    addText(fillPlaceholders(sec.texto, values), 'normal', 12);
  });

  // Agregar listas de prácticas
  addList('Prácticas Consentidas:', consented);
  addList('Prácticas No Consentidas:', nonconsented);

  // Firmas
  addText(fillPlaceholders(contrato.firmas.sumiso, values), 'normal', 12);
  y += 10;
  addText(fillPlaceholders(contrato.firmas.ama, values), 'normal', 12);

  // Guardar PDF
  const filename = `Contrato_Ds_${sub.replace(/[^a-z0-9]/gi,'_')}_${domme.replace(/[^a-z0-9]/gi,'_')}.pdf`;
  doc.save(filename);
});
