const { jsPDF } = window.jspdf;

const form = document.getElementById('contractForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const domme = document.getElementById('domme').value.trim();
  const sub = document.getElementById('sub').value.trim();
  const safeword = document.getElementById('safeword').value.trim();
  const consented = document.getElementById('consented').value.trim();
  const nonconsented = document.getElementById('nonconsented').value.trim();
  const duration = document.getElementById('duration').value.trim();

  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 8;

  // Título
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text('Contrato D/s', 105, y, { align: 'center' });
  y += 15;

  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  // Contrato completo
  const contractText = `
Yo, ${sub}, quien soy sumiso(a) por gusto propio, en posesión de mis facultades, 
consiento, manifiesto, deseo y pretendo entregarme totalmente a las manos de ${domme}, 
quien será mi Amo / Ama. Por su parte el Amo / Ama, ${domme}, consiente y manifiesta 
que desea y pretende tomar posesión de su sumiso(a), ${sub}.

Palabra de seguridad acordada: "${safeword}".
Duración del contrato: ${duration}.

PRÁCTICAS CONSENTIDAS:
${consented.split(',').map((p,i)=>`${i+1}. ${p.trim()}`).join('\n')}

PRÁCTICAS NO CONSENTIDAS:
${nonconsented.split(',').map((p,i)=>`${i+1}. ${p.trim()}`).join('\n')}

Ambas partes acuerdan respetar los límites, la seguridad y el bienestar mutuo.
Este contrato refleja un acuerdo de consentimiento completo dentro de la práctica D/s.
`;

  // Dividir en líneas si excede ancho
  const lines = doc.splitTextToSize(contractText, 170);
  doc.text(lines, 20, y);

  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
