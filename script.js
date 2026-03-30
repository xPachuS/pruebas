const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');
const langSelect = document.getElementById('language');

// --- 1. TRADUCCIONES DE LA INTERFAZ DEL FORMULARIO ---
const uiTranslations = {
  es: { title: "Contrato D/s", subtitle: "Genera tu contrato personalizado en PDF", lang: "Idioma", domRole: "Rol Dominante", domFem: "Ama", domMale: "Amo", domName: "Nombre Dominante", subRole: "Rol Sumiso/a", subFem: "Sumisa", subMale: "Sumiso", subName: "Nombre Sumiso/a", safe: "Palabra de seguridad", con: "Prácticas consentidas (separadas por saltos de línea)", non: "Prácticas no consentidas (Límites Duros)", dur: "Duración del contrato (ej: 6 meses)", btn: "Generar PDF" },
  en: { title: "D/s Contract", subtitle: "Generate your personalized PDF contract", lang: "Language", domRole: "Dominant Role", domFem: "Mistress", domMale: "Master", domName: "Dominant Name", subRole: "Submissive Role", subFem: "Submissive", subMale: "Submissive", subName: "Submissive Name", safe: "Safeword", con: "Consented practices (separated by newlines)", non: "Non-consented practices (Hard Limits)", dur: "Contract duration (e.g., 6 months)", btn: "Generate PDF" },
  de: { title: "D/s Vertrag", subtitle: "Generieren Sie Ihren personalisierten PDF-Vertrag", lang: "Sprache", domRole: "Dominante Rolle", domFem: "Herrin", domMale: "Herr", domName: "Name des Dominanten", subRole: "Submissive Rolle", subFem: "Sub", subMale: "Sub", subName: "Name des Sub", safe: "Sicherheitswort", con: "Einvernehmliche Praktiken (durch Zeilenumbrüche getrennt)", non: "Nicht einvernehmliche Praktiken (Harte Grenzen)", dur: "Vertragsdauer (z.B. 6 Monate)", btn: "PDF generieren" },
  it: { title: "Contratto D/s", subtitle: "Genera il tuo contratto PDF personalizzato", lang: "Lingua", domRole: "Ruolo Dominante", domFem: "Padrona", domMale: "Padrone", domName: "Nome Dominante", subRole: "Ruolo Sottomesso/a", subFem: "Sottomessa", subMale: "Sottomesso", subName: "Nome Sottomesso/a", safe: "Parola di sicurezza", con: "Pratiche acconsentite (separate da ritorni a capo)", non: "Pratiche non acconsentite (Limiti Invalicabili)", dur: "Durata del contrato (es: 6 mesi)", btn: "Genera PDF" },
  ro: { title: "Contract D/s", subtitle: "Generează-ți contractul PDF personalizat", lang: "Limba", domRole: "Rol Dominant", domFem: "Stăpână", domMale: "Stăpân", domName: "Nume Dominant", subRole: "Rol Supus/ă", subFem: "Supusă", subMale: "Supus", subName: "Nume Supus/ă", safe: "Cuvânt de siguranță", con: "Practici consimțite (separate prin rânduri noi)", non: "Practici neconsimțite (Limite Dure)", dur: "Durata contractului (ex: 6 luni)", btn: "Generează PDF" }
};

langSelect.addEventListener('change', (e) => {
  const lang = e.target.value;
  const t = uiTranslations[lang];
  document.getElementById('ui-title').textContent = t.title;
  document.getElementById('ui-subtitle').textContent = t.subtitle;
  document.getElementById('ui-lbl-lang').textContent = t.lang;
  document.getElementById('ui-lbl-domRole').textContent = t.domRole;
  document.getElementById('ui-lbl-domName').textContent = t.domName;
  document.getElementById('ui-lbl-subRole').textContent = t.subRole;
  document.getElementById('ui-lbl-subName').textContent = t.subName;
  document.getElementById('ui-lbl-safe').textContent = t.safe;
  document.getElementById('ui-lbl-con').textContent = t.con;
  document.getElementById('ui-lbl-non').textContent = t.non;
  document.getElementById('ui-lbl-dur').textContent = t.dur;
  document.getElementById('ui-btn-submit').textContent = t.btn;
  document.querySelector('#domGender option[value="Ama"]').textContent = t.domFem;
  document.querySelector('#domGender option[value="Amo"]').textContent = t.domMale;
  document.querySelector('#subGender option[value="Sumisa"]').textContent = t.subFem;
  document.querySelector('#subGender option[value="Sumiso"]').textContent = t.subMale;
});

const i18n = {
  es: { title: 'CONTRATO DE SUMISIÓN', durationTitle: 'Duración del Contrato', durationText: 'El presente acuerdo entra en vigor en la fecha de su firma y tendrá una duración de **${duration}**.', practicesCon: 'Prácticas Consentidas', practicesNon: 'Prácticas No Consentidas (Límites Duros)', name: 'Nombre:', date: 'Fecha:', signSub: 'Firma', signDom: 'Firma' },
  en: { title: 'SUBMISSION CONTRACT', durationTitle: 'Contract Duration', durationText: 'This agreement takes effect on the date of its signature and will have a duration of **${duration}**.', practicesCon: 'Consented Practices', practicesNon: 'Non-Consented Practices (Hard Limits)', name: 'Name:', date: 'Date:', signSub: 'Signature', signDom: 'Signature' },
  de: { title: 'UNTERWERFUNGSVERTRAG', durationTitle: 'Vertragsdauer', durationText: 'Diese Vereinbarung tritt am Tag der Unterzeichnung in Kraft und hat eine Laufzeit von **${duration}**.', practicesCon: 'Einvernehmliche Praktiken', practicesNon: 'Nicht einvernehmliche Praktiken (Harte Grenzen)', name: 'Name:', date: 'Datum:', signSub: 'Unterschrift', signDom: 'Unterschrift' },
  it: { title: 'CONTRATTO DI SOTTOMISSIONE', durationTitle: 'Durata del Contratto', durationText: 'Il presente accordo entra in vigore alla data della sua firma e avrà una durata di **${duration}**.', practicesCon: 'Pratiche Acconsentite', practicesNon: 'Pratiche Non Acconsentite (Limiti Invalicabili)', name: 'Nome:', date: 'Data:', signSub: 'Firma', signDom: 'Firma' },
  ro: { title: 'CONTRACT DE SUPUNERE', durationTitle: 'Durata Contractului', durationText: 'Acest acord intră în vigoare la data semnării sale și va avea o durată de **${duration}**.', practicesCon: 'Practici Consimțite', practicesNon: 'Practici Neconsimțite (Limite Dure)', name: 'Nume:', date: 'Data:', signSub: 'Semnătura', signDom: 'Semnătura' }
};

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const lang = document.getElementById('language').value;
  const domGender = document.getElementById('domGender').value;
  const subGender = document.getElementById('subGender').value;
  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim().toUpperCase();
  const duration = document.getElementById('duration').value.trim();
  const ui = i18n[lang]; 

  const regexDuracion = /\b(día|días|dia|dias|mes|meses|año|años|ano|anos|day|days|month|months|year|years|tag|tage|monat|monate|jahr|jahre|giorno|giorni|mese|mesi|anno|anni|zi|zile|lună|luna|luni|an|ani)\b/i;
  if (!regexDuracion.test(duration)) {
    alert("Error: Format duration invalid.");
    return;
  }

  const locales = { es: 'es-ES', en: 'en-US', de: 'de-DE', it: 'it-IT', ro: 'ro-RO' };
  const currentDate = new Date().toLocaleDateString(locales[lang], { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatPractice = (str) => {
    const trimmed = str.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const consentedLines = document.getElementById('consented').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);
  const nonconsentedLines = document.getElementById('nonconsented').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);

  const applyGenders = (text) => {
    let t = text;
    if (lang === 'ro') {
      t = t.replaceAll('Stăpânul / Stăpâna', domGender === 'Amo' ? 'Stăpânul' : 'Stăpâna');
      t = t.replaceAll('Stăpânul/Stăpâna', domGender === 'Amo' ? 'Stăpânul' : 'Stăpâna');
      t = t.replaceAll('Stăpânului/Stăpânei', domGender === 'Amo' ? 'Stăpânului' : 'Stăpânei');
      t = t.replaceAll('Stăpân/ă', domGender === 'Amo' ? 'Stăpân' : 'Stăpână');
      t = t.replaceAll('Supusul / Supusa', subGender === 'Sumiso' ? 'Supusul' : 'Supusa');
      t = t.replaceAll('Supusul/ei', subGender === 'Sumiso' ? 'Supusului' : 'Supusei');
      t = t.replaceAll('Supusul/a', subGender === 'Sumiso' ? 'Supusul' : 'Supusa');
      t = t.replaceAll('Supus/ă', subGender === 'Sumiso' ? 'Supus' : 'Supusă');
      t = t.replaceAll('meu/mea', subGender === 'Sumiso' ? 'meu' : 'mea');
    } else if (lang === 'es') {
      t = t.replaceAll('el Amo/Ama', domGender === 'Amo' ? 'el Amo' : 'la Ama');
      t = t.replaceAll('Amo/Ama', domGender);
      t = t.replaceAll('el Sumiso/a', subGender === 'Sumiso' ? 'el Sumiso' : 'la Sumisa');
      t = t.replaceAll('Sumiso/a', subGender);
    }
    return t;
  };

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25; 
  const contentWidth = pageWidth - 2 * margin;
  let y = 30;

  function checkPageBreak(needed) {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
    }
  }

  function addText(text, fontSize, isBold = false, indent = 0) {
    doc.setFontSize(fontSize);
    doc.setTextColor(40, 40, 40);
    const processed = applyGenders(text);
    
    // Mejor manejo de líneas para idiomas con palabras largas (Rumano)
    const lines = doc.splitTextToSize(processed, contentWidth - indent);
    
    lines.forEach(line => {
      checkPageBreak(7);
      doc.setFont('times', isBold ? 'bold' : 'normal');
      
      // Dibujar negritas si existen marcadores
      if (line.includes('**')) {
        let parts = line.split('**');
        let currX = margin + indent;
        parts.forEach((p, i) => {
          doc.setFont('times', i % 2 === 1 ? 'bold' : 'normal');
          doc.text(p, currX, y);
          currX += doc.getTextWidth(p);
        });
      } else {
        doc.text(line, margin + indent, y);
      }
      y += fontSize * 0.45;
    });
    y += 2;
  }

  // --- GENERACIÓN ---
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(212, 175, 127); 
  doc.text(ui.title, pageWidth / 2, y, { align: 'center' });
  y += 15;

  const contract = contratos[lang];

  addText(contract.intro.replace('${sub}', `**${sub}**`).replace('${domme}', `**${domme}**`), 11);
  y += 5;

  contract.secciones.forEach(sec => {
    checkPageBreak(20);
    doc.setTextColor(0, 0, 0);
    addText(sec.titulo, 12, true);
    addText(sec.texto.replaceAll('${safeword}', `**${safeword}**`), 10, false, 5);
    y += 4;
  });

  if (consentedLines.length > 0) {
    checkPageBreak(20);
    addText(ui.practicesCon, 12, true);
    consentedLines.forEach(l => addText(`• ${l}`, 10, false, 5));
  }

  if (nonconsentedLines.length > 0) {
    checkPageBreak(20);
    addText(ui.practicesNon, 12, true);
    nonconsentedLines.forEach(l => addText(`• ${l}`, 10, false, 5));
  }

  // --- FIRMAS ---
  doc.addPage();
  y = margin + 10;
  
  const colW = (contentWidth / 2) - 10;
  doc.setFontSize(10);
  doc.setFont('times', 'italic');
  
  const sText = doc.splitTextToSize(applyGenders(contract.firmas.sumiso), colW);
  const dText = doc.splitTextToSize(applyGenders(contract.firmas.ama), colW);

  doc.text(sText, margin, y);
  doc.text(dText, margin + colW + 20, y);

  y += Math.max(sText.length, dText.length) * 5 + 20;

  doc.setFont('times', 'bold');
  doc.line(margin, y, margin + colW, y);
  doc.line(margin + colW + 20, y, margin + contentWidth, y);
  
  y += 6;
  doc.text(`${ui.name} ${sub}`, margin, y);
  doc.text(`${ui.name} ${domme}`, margin + colW + 20, y);
  
  y += 10;
  doc.text(`${ui.date} ${currentDate}`, margin, y);
  doc.text(`${ui.date} ${currentDate}`, margin + colW + 20, y);

  doc.save(`Contract_${lang.toUpperCase()}.pdf`);
});
