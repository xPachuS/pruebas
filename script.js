const form = document.getElementById('contractForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const lang = document.getElementById('language').value;
  const domGender = document.getElementById('domGender').value;
  const subGender = document.getElementById('subGender').value;
  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim().toUpperCase();
  const duration = document.getElementById('duration').value.trim();
  const exclusivity = document.getElementById('exclusivity').value;
  const watermarkFile = document.getElementById('watermark').files[0];

  if (!exclusivity) {
    const errorMsg = { es: "Error: Debes seleccionar una regla de exclusividad.", en: "Error: You must select an exclusivity rule.", de: "Fehler: Sie müssen eine Exklusivitätsregel auswählen.", it: "Errore: Devi selezionare una regola di esclusività.", ro: "Eroare: Trebuie să selectați o regulă de exclusivitate." };
    alert(errorMsg[lang] || errorMsg.es);
    return;
  }

  const regexDuracion = /\b(día|días|dia|dias|mes|meses|año|años|ano|anos|day|days|month|months|year|years|tag|tage|monat|monate|jahr|jahre|giorno|giorni|mese|mesi|anno|anni|zi|zile|lună|luna|luni|an|ani)\b/i;
  
  if (!regexDuracion.test(duration)) {
    alert("Error: Missing time format in duration (e.g., '6 months', '1 año', '10 giorni', '1 Jahr').");
    return;
  }

  const formatPractice = (str) => {
    const trimmed = str.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const consentedLines = document.getElementById('consented').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);
  const nonconsentedLines = document.getElementById('nonconsented').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);
  const dailyTasksLines = document.getElementById('dailyTasks').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);

  const executeGeneration = (imgData = null, imgWidth = 0, imgHeight = 0) => {
    const contractData = {
      lang, domGender, subGender, domme, sub, safeword, duration, exclusivity,
      consentedLines, nonconsentedLines, dailyTasksLines, uiTranslations,
      watermark: imgData, watermarkWidth: imgWidth, watermarkHeight: imgHeight
    };

    generateContractPDF(contractData);

    // Resetear formulario
    form.reset();
    document.getElementById('domGender-display').value = '';
    document.getElementById('domGender-display').setAttribute('value', '');
    document.getElementById('subGender-display').value = '';
    document.getElementById('subGender-display').setAttribute('value', '');
    document.getElementById('exclusivity-display').value = '';
    document.getElementById('exclusivity-display').setAttribute('value', '');
    document.getElementById('lang-display').value = 'Español';
    document.getElementById('lang-display').setAttribute('value', 'Español');
    document.getElementById('language').value = 'es';
    document.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
    const spanishOption = document.querySelector('.custom-option[data-value="es"]');
    if (spanishOption) spanishOption.classList.add('selected');
    const event = new Event('change');
    document.getElementById('language').dispatchEvent(event);
  };

  // Leer imagen si el usuario la subió
  if (watermarkFile) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        executeGeneration(event.target.result, img.width, img.height);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(watermarkFile);
  } else {
    executeGeneration();
  }
});
