const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // 1. Obtener valores del formulario
  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim().toUpperCase();
  const duration = document.getElementById('duration').value.trim();

  // Obtener y formatear la fecha actual (DD/MM/YYYY)
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Función para primera letra en mayúscula y el resto en minúsculas
  const formatPractice = (str) => {
    const trimmed = str.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  // Filtrar y formatear prácticas
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

  // Control de salto de página manual/automático
  function checkPageBreak(extraSpace = 0) {
    if (y + extraSpace > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
      return true;
    }
    return false;
  }

  // CALCULAR ALTURA: Simula cuánto espacio ocupará un bloque sin dibujarlo
  function calculateTextHeight(text, fontSize, isDefaultBold = false, indent = 0) {
    doc.setFontSize(fontSize);
    
    if (!text.includes('**')) {
      doc.setFont('times', isDefaultBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      return (lines.length * (fontSize * 0.45)) + 3;
    }

    let currentX = margin + indent;
    let height = 0;
    const maxWidth = contentWidth - indent;
    const paragraphs = text.split('\n');

    paragraphs.forEach(paragraph => {
      let parts = paragraph.split('**');
      let isBold = false;

      parts.forEach(part => {
        doc.setFont('times', isBold ? 'bold' : 'normal');
        const words = part.split(/(\s+)/);

        words.forEach(word => {
          if (word === '') return;
          const wordWidth = doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor;
          
          if (word.trim() !== '' && currentX + wordWidth > margin + indent + maxWidth) {
            currentX = margin + indent;
            height += fontSize * 0.45;
          }
          if (word.trim() === '' && currentX === margin + indent) return;
          currentX += wordWidth;
        });
        isBold = !isBold;
      });
      currentX = margin + indent;
      height += fontSize * 0.45;
    });
    return height + 3;
  }

  // DIBUJAR TEXTO: Imprime el texto en el PDF
  function addText(text, fontSize, isDefaultBold = false, align = 'left', indent = 0) {
    doc.setFontSize(fontSize);
    doc.setTextColor(40, 40, 40);

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

    let currentX = margin + indent;
    let currentY = y;
    const maxWidth = contentWidth - indent;
    const paragraphs = text.split('\n');

    paragraphs.forEach(paragraph => {
      let parts = paragraph.split('**');
      let isBold = false;

      parts.forEach(part => {
        doc.setFont('times', isBold ? 'bold' : 'normal');
        const words = part.split(/(\s+)/); 

        words.forEach(word => {
          if (word === '') return;
          const wordWidth = doc.getStringUnitWidth(word) * fontSize / doc.internal.scaleFactor;

          if (word.trim() !== '' && currentX + wordWidth > margin + indent + maxWidth) {
            currentX = margin + indent;
            currentY += fontSize * 0.45;
            y = currentY;
            if (checkPageBreak(7)) currentY = y;
          }

          if (word.trim() === '' && currentX === margin + indent) return;

          doc.text(word, currentX, currentY);
          currentX += wordWidth;
        });
        isBold = !isBold;
      });
      
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

  // Línea decorativa
  doc.setDrawColor(212, 175, 127);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Introducción
  let introText = contrato.intro
    .replaceAll('${sub}', `**${sub}**`)
    .replaceAll('${domme}', `**${domme}**`)
    .replaceAll('${duration}', `**${duration}**`)
    .replaceAll('${safeword}', `**${safeword}**`);
  
  addText(introText, 12, false, 'left');
  y += 5;

  // Apartado Duración (con predicción de altura)
  let duracionText = `El presente acuerdo entra en vigor en la fecha de su firma y tendrá una duración de **${duration}**. Sin embargo, ambas partes reconocen que el consentimiento es continuo y puede ser revocado mediante los mecanismos descritos en este documento.`;
  let durHeight = calculateTextHeight('Duración del Contrato', 13, true) + 1 + calculateTextHeight(duracionText, 11, false, 6) + 6;
  
  if (y + durHeight > pageHeight - margin) {
    doc.addPage();
    y = margin + 10;
  }
  
  doc.setTextColor(0, 0, 0);
  addText('Duración del Contrato', 13, true);
  y += 1;
  addText(duracionText, 11, false, 'left', 6);
  y += 6;

  // Secciones (con predicción de altura para no cortar enunciados)
  contrato.secciones.forEach(seccion => {
    let textoSeccion = seccion.texto
      .replaceAll('${sub}', `**${sub}**`)
      .replaceAll('${domme}', `**${domme}**`)
      .replaceAll('${safeword}', `**${safeword}**`);

    // 1. Calcular altura total del bloque
    let blockHeight = calculateTextHeight(seccion.titulo, 13, true) + 1;
    const lineas = textoSeccion.split('\n').filter(l => l.trim() !== '');
    
    lineas.forEach(linea => {
      if (linea.trim().startsWith('-')) {
        let textoViñeta = linea.replace('-', '•').trim();
        blockHeight += calculateTextHeight(textoViñeta, 11, false, 6);
      } else {
        blockHeight += calculateTextHeight(linea, 11, false, 0);
      }
    });
    blockHeight += 4;

    // 2. Si el bloque no cabe, saltar de página antes de escribir
    if (y + blockHeight > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
    }

    // 3. Dibujar el bloque
    doc.setTextColor(0, 0, 0);
    addText(seccion.titulo, 13, true);
    y += 1;

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

  // Prácticas Consentidas (agrupadas)
  if (consentedLines.length > 0) {
    let blockHeight = calculateTextHeight('Prácticas Consentidas', 13, true) + 1;
    consentedLines.forEach(item => {
      blockHeight += calculateTextHeight(`• ${item}`, 11, false, 6);
    });
    blockHeight += 4;

    if (y + blockHeight > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
    }

    addText('Prácticas Consentidas', 13, true);
    y += 1;
    consentedLines.forEach(item => addText(`• ${item}`, 11, false, 'left', 6));
    y += 4;
  }

  // Prácticas No Consentidas (agrupadas)
  if (nonconsentedLines.length > 0) {
    let blockHeight = calculateTextHeight('Prácticas No Consentidas (Límites Duros)', 13, true) + 1;
    nonconsentedLines.forEach(item => {
      blockHeight += calculateTextHeight(`• ${item}`, 11, false, 6);
    });
    blockHeight += 12;

    if (y + blockHeight > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
    }

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

  // 1. NOMBRE
  doc.text('Nombre:', col1X, y);
  doc.setFont('times', 'normal');
  doc.text(sub, col1X + 16, y); 
  doc.line(col1X + 15, y + 1, col1X + colWidth, y + 1);
  
  doc.setFont('times', 'bold');
  doc.text('Nombre:', col2X, y);
  doc.setFont('times', 'normal');
  doc.text(domme, col2X + 16, y); 
  doc.line(col2X + 15, y + 1, col2X + colWidth, y + 1);

  // 2. FECHA
  y += 10;
  doc.setFont('times', 'bold');
  doc.text('Fecha:', col1X, y);
  doc.setFont('times', 'normal');
  doc.text(currentDate, col1X + 14, y); 
  doc.line(col1X + 13, y + 1, col1X + colWidth, y + 1);

  doc.setFont('times', 'bold');
  doc.text('Fecha:', col2X, y);
  doc.setFont('times', 'normal');
  doc.text(currentDate, col2X + 14, y); 
  doc.line(col2X + 13, y + 1, col2X + colWidth, y + 1);

  // 3. FIRMA (CON HUECO)
  y += 15;
  doc.setFont('times', 'bold');
  doc.text('Firma del Sumiso/a:', col1X, y);
  doc.text('Firma del Amo/Ama:', col2X, y);

  y += 20; 
  doc.line(col1X, y, col1X + colWidth, y);
  doc.line(col2X, y, col2X + colWidth, y);

  // Generar PDF
  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
