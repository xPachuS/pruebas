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

  // Validación de la duración
  const regexDuracion = /\b(día|días|dia|dias|mes|meses|año|años|ano|anos|day|days|month|months|year|years|tag|tage|monat|monate|jahr|jahre|giorno|giorni|mese|mesi|anno|anni|zi|zile|lună|luna|luni|an|ani)\b/i;
  
  if (!regexDuracion.test(duration)) {
    alert("Error: Missing time format in duration (e.g., '6 months', '1 año', '10 giorni', '1 Jahr').");
    return;
  }

  // Utilidad para limpiar y formatear listas
  const formatPractice = (str) => {
    const trimmed = str.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const consentedLines = document.getElementById('consented').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);
  const nonconsentedLines = document.getElementById('nonconsented').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);
  const dailyTasksLines = document.getElementById('dailyTasks').value.trim().split('\n').filter(l => l.trim() !== '').map(formatPractice);

  // Empaquetar todo y enviarlo a pdf-generator.js
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
    uiTranslations // Extraído del contexto global en ui.js para las traducciones del PDF
  };

  generateContractPDF(contractData);
});
