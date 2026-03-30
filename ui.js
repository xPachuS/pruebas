// --- LÓGICA DEL MODO OSCURO ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '🌙';
  }
});

// --- LÓGICA DE DESPLEGABLES PERSONALIZADOS (Custom Selects) ---
document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
  const displayInput = wrapper.querySelector('.custom-select-trigger');
  const hiddenInput = wrapper.querySelector('input[type="hidden"]');
  const options = wrapper.querySelectorAll('.custom-option');

  displayInput.addEventListener('click', (e) => {
    document.querySelectorAll('.custom-select-wrapper').forEach(w => {
      if (w !== wrapper) w.classList.remove('open');
    });
    wrapper.classList.toggle('open');
    e.stopPropagation();
  });

  options.forEach(option => {
    option.addEventListener('click', (e) => {
      const value = option.getAttribute('data-value');
      const text = option.textContent;
      
      displayInput.value = text;
      displayInput.setAttribute('value', text); 
      hiddenInput.value = value;
      
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      wrapper.classList.remove('open');

      if (hiddenInput.id === 'language') {
        const event = new Event('change');
        hiddenInput.dispatchEvent(event);
      }
      e.stopPropagation();
    });
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
});

// --- TRADUCCIONES DE LA INTERFAZ DEL FORMULARIO ---
const uiTranslations = {
  es: {
    title: "Contrato D/s", subtitle: "Genera tu contrato personalizado en PDF", lang: "Idioma", domRole: "Rol Dominante", domFem: "Ama", domMale: "Amo", domName: "Nombre Dominante", subRole: "Rol Sumiso/a", subFem: "Sumisa", subMale: "Sumiso", subName: "Nombre Sumiso/a", safe: "Palabra de seguridad", con: "Prácticas consentidas (separadas por saltos de línea)", non: "Prácticas no consentidas (Límites Duros)", dur: "Duración del contrato (ej: 6 meses)", excl: "Reglas de Exclusividad", exclTotal: "Exclusividad Total", exclOpen: "Dinámica Abierta", tasks: "Tareas Diarias / Rituales (Opcional)", btn: "Generar PDF"
  },
  en: {
    title: "D/s Contract", subtitle: "Generate your personalized PDF contract", lang: "Language", domRole: "Dominant Role", domFem: "Mistress", domMale: "Master", domName: "Dominant Name", subRole: "Submissive Role", subFem: "Submissive (F)", subMale: "Submissive (M)", subName: "Submissive Name", safe: "Safeword", con: "Consented practices (separated by newlines)", non: "Non-consented practices (Hard Limits)", dur: "Contract duration (e.g., 6 months)", excl: "Exclusivity Rules", exclTotal: "Total Exclusivity", exclOpen: "Open Dynamics", tasks: "Daily Tasks / Rituals (Optional)", btn: "Generate PDF"
  },
  de: {
    title: "D/s Vertrag", subtitle: "Generieren Sie Ihren personalisierten PDF-Vertrag", lang: "Sprache", domRole: "Dominante Rolle", domFem: "Herrin", domMale: "Herr", domName: "Name des Dominanten", subRole: "Submissive Rolle", subFem: "Sub (W)", subMale: "Sub (M)", subName: "Name des Sub", safe: "Sicherheitswort", con: "Einvernehmliche Praktiken (durch Zeilenumbrüche getrennt)", non: "Nicht einvernehmliche Praktiken (Harte Grenzen)", dur: "Vertragsdauer (z.B. 6 Monate)", excl: "Exklusivitätsregeln", exclTotal: "Vollständige Exklusivität", exclOpen: "Offene Dynamik", tasks: "Tägliche Aufgaben / Rituale (Optional)", btn: "PDF generieren"
  },
  it: {
    title: "Contratto D/s", subtitle: "Genera il tuo contratto PDF personalizzato", lang: "Lingua", domRole: "Ruolo Dominante", domFem: "Padrona", domMale: "Padrone", domName: "Nome Dominante", subRole: "Ruolo Sottomesso/a", subFem: "Sottomessa", subMale: "Sottomesso", subName: "Nome Sottomesso/a", safe: "Parola di sicurezza", con: "Pratiche acconsentite (separate da ritorni a capo)", non: "Pratiche non acconsentite (Limiti Invalicabili)", dur: "Durata del contratto (es: 6 mesi)", excl: "Regole di Esclusività", exclTotal: "Esclusività Totale", exclOpen: "Dinamica Aperta", tasks: "Compiti Giornalieri / Rituali (Opzionale)", btn: "Genera PDF"
  },
  ro: {
    title: "Contract D/s", subtitle: "Generează-ți contractul PDF personalizat", lang: "Limba", domRole: "Rol Dominant", domFem: "Stăpână", domMale: "Stăpân", domName: "Nume Dominant", subRole: "Rol Supus/ă", subFem: "Supusă", subMale: "Supus", subName: "Nume Supus/ă", safe: "Cuvânt de siguranță", con: "Practici consimțite (separate prin rânduri noi)", non: "Practici neconsimțite (Limite Dure)", dur: "Durata contractului (ex: 6 luni)", excl: "Reguli de Exclusivitate", exclTotal: "Exclusivitate Totală", exclOpen: "Dinamică Deschisă", tasks: "Sarcini Zilnice / Ritualuri (Opțional)", btn: "Generează PDF"
  }
};

const langSelect = document.getElementById('language');

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
  document.getElementById('ui-lbl-excl').textContent = t.excl;
  document.getElementById('ui-lbl-tasks').textContent = t.tasks;
  document.getElementById('ui-btn-submit').textContent = t.btn;
  
  document.getElementById('opt-dom-fem').textContent = t.domFem;
  document.getElementById('opt-dom-male').textContent = t.domMale;
  document.getElementById('opt-sub-fem').textContent = t.subFem;
  document.getElementById('opt-sub-male').textContent = t.subMale;
  document.getElementById('opt-excl-total').textContent = t.exclTotal;
  document.getElementById('opt-excl-open').textContent = t.exclOpen;

  const currentDom = document.getElementById('domGender').value;
  const domDisplay = document.getElementById('domGender-display');
  if(currentDom === 'Ama') { domDisplay.value = t.domFem; domDisplay.setAttribute('value', t.domFem); }
  if(currentDom === 'Amo') { domDisplay.value = t.domMale; domDisplay.setAttribute('value', t.domMale); }

  const currentSub = document.getElementById('subGender').value;
  const subDisplay = document.getElementById('subGender-display');
  if(currentSub === 'Sumisa') { subDisplay.value = t.subFem; subDisplay.setAttribute('value', t.subFem); }
  if(currentSub === 'Sumiso') { subDisplay.value = t.subMale; subDisplay.setAttribute('value', t.subMale); }

  const currentExcl = document.getElementById('exclusivity').value;
  const exclDisplay = document.getElementById('exclusivity-display');
  if(currentExcl === 'total') { exclDisplay.value = t.exclTotal; exclDisplay.setAttribute('value', t.exclTotal); }
  if(currentExcl === 'open') { exclDisplay.value = t.exclOpen; exclDisplay.setAttribute('value', t.exclOpen); }
});
