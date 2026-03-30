const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // 1. Obtener valores del formulario (Palabra de seguridad forzada a MAYÚSCULAS)
  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim().toUpperCase();
  const duration = document.getElementById('duration').value.trim();

  // Función para primera letra en mayúscula y el resto estrictamente en minúsculas
  const formatPractice = (str) => {
    const trimmed = str.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  // Filtrar líneas vacías y formatear el texto
  const consentedLines = document.getElementById('consented').value.trim().split('\n')
    .filter(l => l.trim() !== '')
    .map(formatPractice);
    
  const nonconsentedLines = document.getElementById('nonconsented').value.trim().split('\n')
    .filter(l => l.trim() !== '')
    .map(formatPractice);

  // 2. Configuración inicial del PDF
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25; 
  const contentWidth = pageWidth - 2 * margin;
  let y = 30;

  // --- FUNCIONES AUXILIARES ---

  // Control de salto de página
  function checkPageBreak(extraSpace = 0) {
    if (y + extraSpace > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
      return true;
    }
    return false;
  }

  // Función avanzada para añadir texto con soporte de **negritas intercaladas**
  function addText(text, fontSize, isDefaultBold = false, align = 'left', indent = 0) {
    doc.setFontSize(fontSize);
    doc.setTextColor(40, 40, 40);

    // Si no hay marcadores de negrita (**), usamos el dibujado estándar (permite justificar)
    if (!text.includes('**')) {
      doc.setFont('times', isDefaultBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      lines.forEach(line => {
        checkPageBreak(7);
        let x = margin + indent;
        if (align === 'center') x = pageWidth / 2;
        doc.text(line, x, y, { align: align });
        y += fontSize * 0.45; 
      });
      y += 3;
      return;
    }

    // Si hay marcadores (**), renderizamos palabra por palabra
    let currentX = margin + indent;
    let currentY = y;
    const maxWidth = contentWidth - indent;
    const paragraphs = text.split('\n');

    paragraphs.forEach(paragraph => {
      let parts = paragraph.split('**');
      let isBold = false; // Alterna: normal, negrita, normal...

      parts.forEach(part => {
        doc.setFont('times', isBold ? 'bold' : 'normal');
        // Separamos preservando los espacios como elementos del array
        const words = part.split(/(\s+)/); 

        words.forEach(word => {
          if (word === '') return;
          
          const wordWidth = doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor;

          // Si la palabra excede el margen derecho, salto de línea
          if (word.trim() !== '' && currentX + wordWidth > margin + indent + maxWidth) {
            currentX = margin + indent;
            currentY += fontSize * 0.45;
            y = currentY;
            if (checkPageBreak(7)) {
              currentY = y;
            }
          }

          // Evitar imprimir espacios en blanco al inicio de una nueva línea
          if (word.trim() === '' && currentX === margin + indent) return;

          doc.text(word, currentX, currentY);
          currentX += wordWidth;
        });
        
        isBold = !isBold; // Cambiar el estado para el siguiente fragmento
      });
      
      // Salto al final de cada párrafo
      currentX = margin + indent;
      currentY += fontSize * 0.45;
      y = currentY;
    });
    y += 3;
  }

  // --- GENERACIÓN DEL CONTENIDO ---

  // Título principal
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(212, 175, 127); 
  doc.text('CONTRATO DE SUMISIÓN', pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Línea separadora decorativa
  doc.setDrawColor(212, 175, 127);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Introducción (Inyectamos ** ** alrededor de las variables para hacerlas negritas)
  let introText = contrato.intro
    .replaceAll('${sub}', `**${sub}**`)
    .replaceAll('${domme}', `**${domme}**`)
    .replaceAll('${duration}', `**${duration}**`)
    .replaceAll('${safeword}', `**${safeword}**`);
  
  addText(introText, 12, false, 'left');
  y += 5;

  // Nuevo apartado exclusivo para la Duración
  checkPageBreak(15);
  doc.setTextColor(0, 0, 0);
  addText('Duración del Contrato', 13, true);
  y += 1;
  addText(`El presente acuerdo entra en vigor en la fecha de su firma y tendrá una duración de **${duration}**. Sin embargo, ambas partes reconocen que el consentimiento es continuo y puede ser revocado mediante los mecanismos descritos en este documento.`, 11, false, 'left', 6);
  y += 6;

  // Iterar sobre las secciones originales
  contrato.secciones.forEach(seccion => {
    checkPageBreak(15);
    
    // Título de la sección
    doc.setTextColor(0, 0, 0);
    addText(seccion.titulo, 13, true);
    y += 1;

    // Cuerpo de la sección reemplazando variables por su versión en negrita
    let textoSeccion = seccion.texto
      .replaceAll('${sub}', `**${sub}**`)
      .replaceAll('${domme}', `**${domme}**`)
      .replaceAll('${safeword}', `**${safeword}**`);

    const lineas = textoSeccion.split('\n').filter(l => l.trim() !== '');
    lineas.forEach(linea => {
      if (linea.trim().startsWith('-')) {
        let textoViñeta = linea.replace('-', '•').trim();
        addText(textoViñeta, 11, false, 'left', 6);
      } else {
        addText(linea, 11, false, 'left');
      }
    });
    y += 4;
  });

  // Prácticas Consentidas
  if (consentedLines.length > 0) {
    checkPageBreak(20);
    addText('Prácticas Consentidas', 13, true);
    y += 1;
    consentedLines.forEach(item => addText(`• ${item}`, 11, false, 'left', 6));
    y += 4;
  }

  // Prácticas No Consentidas
  if (nonconsentedLines.length > 0) {
    checkPageBreak(20);
    addText('Prácticas No Consentidas (Límites Duros)', 13, true);
    y += 1;
    nonconsentedLines.forEach(item => addText(`• ${item}`, 11, false, 'left', 6));
    y += 12;
  }

  // --- SECCIÓN DE FIRMAS ---
  checkPageBreak(50); 
  
  const textoSumiso = contrato.firmas.sumiso.replace(/Nombre completo:[\s\S]*/, '').trim();
  const textoAma = contrato.firmas.ama.replace(/Nombre completo:[\s\S]*/, '').trim();

  const colWidth = (contentWidth / 2) - 10;
  const col1X = margin;
  const col2X = margin + colWidth + 20;

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);

  const sumisoLines = doc.splitTextToSize(textoSumiso, colWidth);
  const amaLines = doc.splitTextToSize(textoAma, colWidth);
  
  doc.text(sumisoLines, col1X, y);
  doc.text(amaLines, col2X, y);

  y += Math.max(sumisoLines.length, amaLines.length) * 5 + 15;

  doc.setFont('times', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(150, 150, 150);

  // Columna Sumiso
  doc.text('Firma del Sumiso/a:', col1X, y);
  doc.line(col1X + 32, y, col1X + colWidth, y);
  
  doc.text('Nombre:', col1X, y + 10);
  doc.setFont('times', 'normal');
  doc.text(sub, col1X + 16, y + 10); 
  doc.line(col1X + 15, y + 10, col1X + colWidth, y + 10);
  
  doc.setFont('times', 'bold');
  doc.text('Fecha:', col1X, y + 20);
  doc.line(col1X + 12, y + 20, col1X + colWidth, y + 20);

  // Columna Ama
  doc.text('Firma del Amo/Ama:', col2X, y);
  doc.line(col2X + 34, y, col2X + colWidth, y);
  
  doc.text('Nombre:', col2X, y + 10);
  doc.setFont('times', 'normal');
  doc.text(domme, col2X + 16, y + 10); 
  doc.line(col2X + 15, y + 10, col2X + colWidth, y + 10);
  
  doc.setFont('times', 'bold');
  doc.text('Fecha:', col2X, y + 20);
  doc.line(col2X + 12, y + 20, col2X + colWidth, y + 20);

  // 3. Generar PDF
  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
