const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // 1. Obtener valores del formulario
  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim();
  const duration = document.getElementById('duration').value.trim();

  // Filtrar líneas vacías en las prácticas
  const consentedLines = document.getElementById('consented').value.trim().split('\n').filter(l => l.trim() !== '');
  const nonconsentedLines = document.getElementById('nonconsented').value.trim().split('\n').filter(l => l.trim() !== '');

  // 2. Configuración inicial del PDF
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25; // Márgenes más amplios para aspecto formal
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

  // Añadir texto con soporte para negritas, alineación y sangría
  function addText(text, fontSize, isBold = false, align = 'left', indent = 0) {
    doc.setFont('times', isBold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(40, 40, 40); // Gris muy oscuro, más suave que el negro puro

    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach(line => {
      checkPageBreak(7);
      let x = margin + indent;
      if (align === 'center') x = pageWidth / 2;
      doc.text(line, x, y, { align: align });
      y += fontSize * 0.45; // Interlineado dinámico
    });
    y += 3; // Espacio extra al final del párrafo
  }

  // --- GENERACIÓN DEL CONTENIDO ---

  // Título principal
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(212, 175, 127); // Color #d4af7f de tu CSS
  doc.text('CONTRATO DE SUMISIÓN', pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Línea separadora decorativa
  doc.setDrawColor(212, 175, 127);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Introducción
  let introText = contrato.intro
    .replaceAll('${sub}', sub)
    .replaceAll('${domme}', domme)
    .replaceAll('${duration}', duration)
    .replaceAll('${safeword}', safeword);
  
  addText(introText, 12, false, 'justify');
  y += 5;

  // Iterar sobre las secciones
  contrato.secciones.forEach(seccion => {
    checkPageBreak(15);
    
    // Título de la sección
    doc.setTextColor(0, 0, 0);
    addText(seccion.titulo, 13, true);
    y += 1;

    // Cuerpo de la sección reemplazando variables
    let textoSeccion = seccion.texto
      .replaceAll('${sub}', sub)
      .replaceAll('${domme}', domme)
      .replaceAll('${safeword}', safeword);

    // Convertir guiones en viñetas elegantes (bullets)
    const lineas = textoSeccion.split('\n').filter(l => l.trim() !== '');
    lineas.forEach(linea => {
      if (linea.trim().startsWith('-')) {
        let textoViñeta = linea.replace('-', '•').trim();
        addText(textoViñeta, 11, false, 'justify', 6);
      } else {
        addText(linea, 11, false, 'justify');
      }
    });
    y += 4;
  });

  // Prácticas Consentidas
  if (consentedLines.length > 0) {
    checkPageBreak(20);
    addText('K) Prácticas Consentidas', 13, true);
    y += 1;
    consentedLines.forEach(item => addText(`• ${item}`, 11, false, 'left', 6));
    y += 4;
  }

  // Prácticas No Consentidas
  if (nonconsentedLines.length > 0) {
    checkPageBreak(20);
    addText('L) Prácticas No Consentidas (Límites Duros)', 13, true);
    y += 1;
    nonconsentedLines.forEach(item => addText(`• ${item}`, 11, false, 'left', 6));
    y += 12;
  }

  // --- SECCIÓN DE FIRMAS (A DOS COLUMNAS) ---
  checkPageBreak(50); // Asegurar que las firmas no se corten
  
  // Extraer solo el texto introductorio de las firmas de contrato.js
  const textoSumiso = contrato.firmas.sumiso.replace(/Nombre completo:[\s\S]*/, '').trim();
  const textoAma = contrato.firmas.ama.replace(/Nombre completo:[\s\S]*/, '').trim();

  const colWidth = (contentWidth / 2) - 10;
  const col1X = margin;
  const col2X = margin + colWidth + 20;

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);

  // Textos de compromiso
  const sumisoLines = doc.splitTextToSize(textoSumiso, colWidth);
  const amaLines = doc.splitTextToSize(textoAma, colWidth);
  
  doc.text(sumisoLines, col1X, y);
  doc.text(amaLines, col2X, y);

  // Bajar el cursor debajo del bloque de texto más largo
  y += Math.max(sumisoLines.length, amaLines.length) * 5 + 15;

  // Líneas para firmar
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(150, 150, 150);

  // Columna 1: Sumiso
  doc.text('Firma del Sumiso/a:', col1X, y);
  doc.line(col1X + 32, y, col1X + colWidth, y);
  
  doc.text('Nombre:', col1X, y + 10);
  doc.setFont('times', 'normal');
  doc.text(sub, col1X + 16, y + 10); // Rellena el nombre automáticamente
  doc.line(col1X + 15, y + 10, col1X + colWidth, y + 10);
  
  doc.setFont('times', 'bold');
  doc.text('Fecha:', col1X, y + 20);
  doc.line(col1X + 12, y + 20, col1X + colWidth, y + 20);

  // Columna 2: Ama
  doc.text('Firma del Amo/Ama:', col2X, y);
  doc.line(col2X + 34, y, col2X + colWidth, y);
  
  doc.text('Nombre:', col2X, y + 10);
  doc.setFont('times', 'normal');
  doc.text(domme, col2X + 16, y + 10); // Rellena el nombre automáticamente
  doc.line(col2X + 15, y + 10, col2X + colWidth, y + 10);
  
  doc.setFont('times', 'bold');
  doc.text('Fecha:', col2X, y + 20);
  doc.line(col2X + 12, y + 20, col2X + colWidth, y + 20);

  // 3. Generar y descargar
  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
