const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

// Diccionario de traducciones para las etiquetas del PDF
const i18n = {
  es: { title: 'CONTRATO DE SUMISIÓN', durationTitle: 'Duración del Contrato', durationText: 'El presente acuerdo entra en vigor en la fecha de su firma y tendrá una duración de **${duration}**. Sin embargo, ambas partes reconocen que el consentimiento es continuo y puede ser revocado.', practicesCon: 'Prácticas Consentidas', practicesNon: 'Prácticas No Consentidas (Límites Duros)', name: 'Nombre:', date: 'Fecha:', signSub: 'Firma', signDom: 'Firma' },
  en: { title: 'SUBMISSION CONTRACT', durationTitle: 'Contract Duration', durationText: 'This agreement takes effect on the date of its signature and will have a duration of **${duration}**. However, both parties acknowledge that consent is continuous and can be revoked.', practicesCon: 'Consented Practices', practicesNon: 'Non-Consented Practices (Hard Limits)', name: 'Name:', date: 'Date:', signSub: 'Signature', signDom: 'Signature' },
  de: { title: 'UNTERWERFUNGSVERTRAG', durationTitle: 'Vertragsdauer', durationText: 'Diese Vereinbarung tritt am Tag der Unterzeichnung in Kraft und hat eine Laufzeit von **${duration}**. Beide Parteien erkennen jedoch an, dass die Zustimmung kontinuierlich ist und widerrufen werden kann.', practicesCon: 'Einvernehmliche Praktiken', practicesNon: 'Nicht einvernehmliche Praktiken (Harte Grenzen)', name: 'Name:', date: 'Datum:', signSub: 'Unterschrift', signDom: 'Unterschrift' },
  it: { title: 'CONTRATTO DI SOTTOMISSIONE', durationTitle: 'Durata del Contratto', durationText: 'Il presente accordo entra in vigore alla data della sua firma e avrà una durata di **${duration}**. Tuttavia, entrambe le parti riconoscono che il consenso è continuo e può essere revocato.', practicesCon: 'Pratiche Acconsentite', practicesNon: 'Pratiche Non Acconsentite (Limiti Invalicabili)', name: 'Nome:', date: 'Data:', signSub: 'Firma', signDom: 'Firma' },
  ro: { title: 'CONTRACT DE SUPUNERE', durationTitle: 'Durata Contractului', durationText: 'Acest acord intră în vigoare la data semnării sale și va avea o durată de **${duration}**. Cu toate acestea, ambele părți recunosc că consimțământul este continuu și poate fi revocat.', practicesCon: 'Practici Consimțite', practicesNon: 'Practici Neconsimțite (Limite Dure)', name: 'Nume:', date: 'Data:', signSub: 'Semnătura', signDom: 'Semnătura' }
};

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // 1. Obtener valores
  const lang = document.getElementById('language').value;
  const domGender = document.getElementById('domGender').value;
  const subGender = document.getElementById('subGender').value;
  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim().toUpperCase();
  const duration = document.getElementById('duration').value.trim();
  const ui = i18n[lang]; // Carga las etiquetas del idioma

  // Validación de la duración multi-idioma
  const regexDuracion = /\b(día|días|dia|dias|mes|meses|año|años|ano|anos|day|days|month|months|year|years|tag|tage|monat|monate|jahr|jahre|giorno|giorni|mese|mesi|anno|anni|zi|zile|lună|luna|luni|an|ani)\b/i;
  if (!regexDuracion.test(duration)) {
    alert("Error: Missing time format in duration (e.g., '6 months', '1 año', '10 giorni', '1 Jahr').");
    return;
  }

  // Locales para la fecha
  const locales = { es: 'es-ES', en: 'en-US', de: 'de-DE', it: 'it-IT', ro: 'ro-RO' };
  const currentDate = new Date().toLocaleDateString(locales[lang], { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatPractice = (str) => {
    const trimmed = str.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const consentedLines = document.getElementById('consented').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);
  const nonconsentedLines = document.getElementById('nonconsented').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);

  // --- REEMPLAZO DINÁMICO MULTI-IDIOMA ---
  const applyGenders = (text) => {
    let t = text;
    if (lang === 'es') {
      t = t.replaceAll('El Amo / el Ama', domGender === 'Amo' ? 'El Amo' : 'La Ama');
      t = t.replaceAll('El Amo/Ama', domGender === 'Amo' ? 'El Amo' : 'La Ama');
      t = t.replaceAll('Al Amo/Ama', domGender === 'Amo' ? 'Al Amo' : 'A la Ama');
      t = t.replaceAll('Del Amo/Ama', domGender === 'Amo' ? 'Del Amo' : 'De la Ama');
      t = t.replaceAll('el Amo / el Ama', domGender === 'Amo' ? 'el Amo' : 'la Ama');
      t = t.replaceAll('el Amo/Ama', domGender === 'Amo' ? 'el Amo' : 'la Ama');
      t = t.replaceAll('al Amo/Ama', domGender === 'Amo' ? 'al Amo' : 'a la Ama');
      t = t.replaceAll('del Amo/Ama', domGender === 'Amo' ? 'del Amo' : 'de la Ama');
      t = t.replaceAll('Amo/Ama', domGender); 
      
      t = t.replaceAll('El Sumiso / la Sumisa', subGender === 'Sumiso' ? 'El Sumiso' : 'La Sumisa');
      t = t.replaceAll('El Sumiso/a', subGender === 'Sumiso' ? 'El Sumiso' : 'La Sumisa');
      t = t.replaceAll('Al Sumiso/a', subGender === 'Sumiso' ? 'Al Sumiso' : 'A la Sumisa');
      t = t.replaceAll('Del Sumiso/a', subGender === 'Sumiso' ? 'Del Sumiso' : 'De la Sumisa');
      t = t.replaceAll('el Sumiso / la Sumisa', subGender === 'Sumiso' ? 'el Sumiso' : 'la Sumisa');
      t = t.replaceAll('el Sumiso/a', subGender === 'Sumiso' ? 'el Sumiso' : 'la Sumisa');
      t = t.replaceAll('al Sumiso/a', subGender === 'Sumiso' ? 'al Sumiso' : 'a la Sumisa');
      t = t.replaceAll('del Sumiso/a', subGender === 'Sumiso' ? 'del Sumiso' : 'de la Sumisa');
      t = t.replaceAll('Sumiso/a', subGender);
    } 
    else if (lang === 'en') {
      t = t.replaceAll('the Dom / the Domme', domGender === 'Amo' ? 'the Dom' : 'the Domme');
      t = t.replaceAll('Dom/Domme', domGender === 'Amo' ? 'Dom' : 'Domme');
    }
    else if (lang === 'de') {
      t = t.replaceAll('der Dom / die Domme', domGender === 'Amo' ? 'der Dom' : 'die Domme');
      t = t.replaceAll('des Doms / der Domme', domGender === 'Amo' ? 'des Doms' : 'der Domme');
      t = t.replaceAll('dem Dom / der Domme', domGender === 'Amo' ? 'dem Dom' : 'der Domme');
      t = t.replaceAll('den Dom / die Domme', domGender === 'Amo' ? 'den Dom' : 'die Domme');
      t = t.replaceAll('der Sub / die Sub', subGender === 'Sumiso' ? 'der Sub' : 'die Sub');
      t = t.replaceAll('des/der Sub', subGender === 'Sumiso' ? 'des Sub' : 'der Sub');
      t = t.replaceAll('dem/der Sub', subGender === 'Sumiso' ? 'dem Sub' : 'der Sub');
      t = t.replaceAll('den/die Sub', subGender === 'Sumiso' ? 'den Sub' : 'die Sub');
    }
    else if (lang === 'it') {
      t = t.replaceAll('il Padrone / la Padrona', domGender === 'Amo' ? 'il Padrone' : 'la Padrona');
      t = t.replaceAll('Padrone/la Padrona', domGender === 'Amo' ? 'Padrone' : 'Padrona');
      t = t.replaceAll('Padrone/dalla Padrona', domGender === 'Amo' ? 'Padrone' : 'dalla Padrona');
      t = t.replaceAll('Padrone/della Padrona', domGender === 'Amo' ? 'Padrone' : 'della Padrona');
      t = t.replaceAll('Padrone/alla Padrona', domGender === 'Amo' ? 'Padrone' : 'alla Padrona');
      
      t = t.replaceAll('il Sottomesso / la Sottomessa', subGender === 'Sumiso' ? 'il Sottomesso' : 'la Sottomessa');
      t = t.replaceAll('Sottomesso/a', subGender === 'Sumiso' ? 'Sottomesso' : 'Sottomessa');
      t = t.replaceAll('Sottomesso/la mia Sottomessa', subGender === 'Sumiso' ? 'Sottomesso' : 'mia Sottomessa');
    }
    else if (lang === 'ro') {
      t = t.replaceAll('Stăpânul / Stăpâna', domGender === 'Amo' ? 'Stăpânul' : 'Stăpâna');
      t = t.replaceAll('Stăpânului/Stăpânei', domGender === 'Amo' ? 'Stăpânului' : 'Stăpânei');
      t = t.replaceAll('Stăpânul/Stăpâna', domGender === 'Amo' ? 'Stăpânul' : 'Stăpâna');
      t = t.replaceAll('Stăpân/ă', domGender === 'Amo' ? 'Stăpân' : 'Stăpână');
      
      t = t.replaceAll('Supusul / Supusa', subGender === 'Sumiso' ? 'Supusul' : 'Supusa');
      t = t.replaceAll('Supusul/ei', subGender === 'Sumiso' ? 'Supusului' : 'Supusei');
      t = t.replaceAll('Supusul/a', subGender === 'Sumiso' ? 'Supusul' : 'Supusa');
      t = t.replaceAll('Supus/ă', subGender === 'Sumiso' ? 'Supus' : 'Supusă');
      t = t.replaceAll('meu/mea', subGender === 'Sumiso' ? 'meu' : 'mea');
    }
    return t;
  };

  // 2. Configuración PDF
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25; 
  const contentWidth = pageWidth - 2 * margin;
  let y = 30;

  function checkPageBreak(extraSpace = 0) {
    if (y + extraSpace > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
      return true;
    }
    return false;
  }

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

  // --- GENERACIÓN DEL CONTENIDO (Usando el idioma seleccionado) ---
  const currentContract = contratos[lang];

  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(212, 175, 127); 
  doc.text(ui.title, pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setDrawColor(212, 175, 127);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  let introText = currentContract.intro.replaceAll('${sub}', `**${sub}**`).replaceAll('${domme}', `**${domme}**`).replaceAll('${safeword}', `**${safeword}**`);
  introText = applyGenders(introText);
  addText(introText, 12, false, 'left');
  y += 5;

  let duracionText = ui.durationText.replace('${duration}', duration);
  let durHeight = calculateTextHeight(ui.durationTitle, 13, true) + 1 + calculateTextHeight(duracionText, 11, false, 6) + 6;
  
  if (y + durHeight > pageHeight - margin) { doc.addPage(); y = margin + 10; }
  
  doc.setTextColor(0, 0, 0);
  addText(ui.durationTitle, 13, true);
  y += 1;
  addText(duracionText, 11, false, 'left', 6);
  y += 6;

  currentContract.secciones.forEach(seccion => {
    let textoSeccion = seccion.texto.replaceAll('${safeword}', `**${safeword}**`);
    textoSeccion = applyGenders(textoSeccion);

    let blockHeight = calculateTextHeight(seccion.titulo, 13, true) + 1;
    const lineas = textoSeccion.split('\n').filter(l => l.trim() !== '');
    
    lineas.forEach(linea => {
      if (linea.trim().startsWith('-')) {
        blockHeight += calculateTextHeight(linea.replace('-', '•').trim(), 11, false, 6);
      } else {
        blockHeight += calculateTextHeight(linea, 11, false, 0);
      }
    });
    blockHeight += 4;

    if (y + blockHeight > pageHeight - margin) { doc.addPage(); y = margin + 10; }

    doc.setTextColor(0, 0, 0);
    addText(seccion.titulo, 13, true);
    y += 1;

    lineas.forEach(linea => {
      if (linea.trim().startsWith('-')) {
        addText(linea.replace('-', '•').trim(), 11, false, 'left', 6);
      } else {
        addText(linea, 11, false, 'left');
      }
    });
    y += 4;
  });

  if (consentedLines.length > 0) {
    let blockHeight = calculateTextHeight(ui.practicesCon, 13, true) + 1;
    consentedLines.forEach(item => blockHeight += calculateTextHeight(`• ${item}`, 11, false, 6));
    blockHeight += 4;
    if (y + blockHeight > pageHeight - margin) { doc.addPage(); y = margin + 10; }

    addText(ui.practicesCon, 13, true);
    y += 1;
    consentedLines.forEach(item => addText(`• ${item}`, 11, false, 'left', 6));
    y += 4;
  }

  if (nonconsentedLines.length > 0) {
    let blockHeight = calculateTextHeight(ui.practicesNon, 13, true) + 1;
    nonconsentedLines.forEach(item => blockHeight += calculateTextHeight(`• ${item}`, 11, false, 6));
    blockHeight += 12;
    if (y + blockHeight > pageHeight - margin) { doc.addPage(); y = margin + 10; }

    addText(ui.practicesNon, 13, true);
    y += 1;
    nonconsentedLines.forEach(item => addText(`• ${item}`, 11, false, 'left', 6));
    y += 12;
  }

  // --- SECCIÓN DE FIRMAS (PÁGINA NUEVA OBLIGATORIA) ---
  doc.addPage();
  y = margin + 10;
  
  const textoSumiso = applyGenders(currentContract.firmas.sumiso);
  const textoAma = applyGenders(currentContract.firmas.ama);

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
  doc.text(ui.name, col1X, y);
  doc.setFont('times', 'normal');
  doc.text(sub, col1X + 16, y); 
  doc.line(col1X + 15, y + 1, col1X + colWidth, y + 1);
  
  doc.setFont('times', 'bold');
  doc.text(ui.name, col2X, y);
  doc.setFont('times', 'normal');
  doc.text(domme, col2X + 16, y); 
  doc.line(col2X + 15, y + 1, col2X + colWidth, y + 1);

  // 2. FECHA
  y += 10;
  doc.setFont('times', 'bold');
  doc.text(ui.date, col1X, y);
  doc.setFont('times', 'normal');
  doc.text(currentDate, col1X + 14, y); 
  doc.line(col1X + 13, y + 1, col1X + colWidth, y + 1);

  doc.setFont('times', 'bold');
  doc.text(ui.date, col2X, y);
  doc.setFont('times', 'normal');
  doc.text(currentDate, col2X + 14, y); 
  doc.line(col2X + 13, y + 1, col2X + colWidth, y + 1);

  // 3. FIRMA (CON HUECO)
  y += 15;
  doc.setFont('times', 'bold');
  
  // Títulos de firma adaptados al idioma y género
  let firmaSub = lang === 'es' ? `${ui.signSub} ${subGender === 'Sumiso' ? 'del Sumiso' : 'de la Sumisa'}` : `${ui.signSub} (${subGender})`;
  let firmaDom = lang === 'es' ? `${ui.signDom} ${domGender === 'Amo' ? 'del Amo' : 'de la Ama'}` : `${ui.signDom} (${domGender})`;
  
  doc.text(firmaSub + ':', col1X, y);
  doc.text(firmaDom + ':', col2X, y);

  y += 20; 
  doc.line(col1X, y, col1X + colWidth, y);
  doc.line(col2X, y, col2X + colWidth, y);

  // Generar PDF con sufijo de idioma
  doc.save(`Contract_Ds_${lang.toUpperCase()}_${sub}_${domme}.pdf`);
});
