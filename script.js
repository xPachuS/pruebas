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
  const safeword = capitalizeWords(document.getElementById('safeword').value.trim());
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

  // Función para añadir texto justificado con paginación
  function addText(text) {
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach(line => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y, { maxWidth: pageWidth - 2 * margin, align: 'justify' });
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
      doc.text(`- ${item}`, margin + 5, y, { maxWidth: pageWidth - 2 * margin - 5, align: 'justify' });
      y += lineHeight;
    });
    y += lineHeight;
  }

  // Título del contrato
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('Contrato de Sumisión D/s', pageWidth / 2, y, { align: 'center' });
  y += 12;

  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  // Texto de introducción
  const introText = `Yo ${sub}, quien soy sumiso/sumisa por gusto propio, en posesión de mis facultades, consiento, manifiesto, deseo y pretendo entregarme totalmente a las manos de ${domme}, quien será mi Amo/Ama. Por su parte el Amo/Ama, ${domme}, consiente y manifiesta que desea y pretende tomar posesión de su sumiso(a), ${sub}. Por la firma de este Contrato de Sumisión, se acuerda que el sumiso/sumisa cede todos los derechos sobre su persona, y que el Amo/Ama toma completa posesión del sumiso/sumisa como propiedad, reclamando para sí misma su vida, su futuro, su corazón y su mente. Duración del contrato: ${duration}. Palabra de seguridad: ${safeword}.`;
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
    addText(seccion.texto + '\n\n');
  });

  // Listas de prácticas
  addList('Prácticas Consentidas:', consentedLines);
  addList('Prácticas No Consentidas:', nonconsentedLines);

  // Firmas
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  addText(contrato.firmas.sumiso + '\n\n' + contrato.firmas.ama);

  // Guardar PDF
  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
