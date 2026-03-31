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

  // Validación: Si el campo oculto de exclusividad está vacío
  if (!exclusivity) {
    const errorMsg = {
      es: "Error: Debes seleccionar una regla de exclusividad.",
      en: "Error: You must select an exclusivity rule.",
      de: "Fehler: Sie müssen eine Exklusivitätsregel auswählen.",
      it: "Errore: Devi selezionare una regola di esclusività.",
      ro: "Eroare: Trebuie să selectați o regulă de exclusivitate."
    };
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

  const contractData = {
    lang,
    domGender,
    subGender,
    domme,
    sub,
    safeword,
    duration,
    exclusivity,
    consentedLines,
    nonconsentedLines,
    dailyTasksLines,
    uiTranslations
  };

  // 1. Generar el PDF
  generateContractPDF(contractData);

  // 2. Resetear el formulario nativo (limpia inputs y textareas)
  form.reset();

  // 3. Resetear visualmente los menús desplegables personalizados
  document.getElementById('domGender-display').value = '';
  document.getElementById('domGender-display').setAttribute('value', '');
  
  document.getElementById('subGender-display').value = '';
  document.getElementById('subGender-display').setAttribute('value', '');
  
  document.getElementById('exclusivity-display').value = '';
  document.getElementById('exclusivity-display').setAttribute('value', '');

  // 4. Restaurar el idioma por defecto (Español)
  document.getElementById('lang-display').value = 'Español';
  document.getElementById('lang-display').setAttribute('value', 'Español');
  document.getElementById('language').value = 'es';

  // 5. Restaurar la clase 'selected' en el menú de idiomas
  document.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
  const spanishOption = document.querySelector('.custom-option[data-value="es"]');
  if (spanishOption) spanishOption.classList.add('selected');

  // 6. Forzar la traducción de la UI de vuelta al español
  const event = new Event('change');
  document.getElementById('language').dispatchEvent(event);
});
