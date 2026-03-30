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

  doc.setFontSize(20);
  doc.text('Contrato D/s', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Ama / Dominante: ${domme}`, 20, 40);
  doc.text(`Sumiso: ${sub}`, 20, 50);
  doc.text(`Palabra de seguridad: ${safeword}`, 20, 60);
  doc.text(`Duración del contrato: ${duration}`, 20, 70);

  doc.text('Prácticas consentidas:', 20, 85);
  doc.text(consented.split(',').map((p, i) => `${i+1}. ${p.trim()}`).join('\n'), 25, 95);

  doc.text('Prácticas no consentidas:', 20, 120);
  doc.text(nonconsented.split(',').map((p, i) => `${i+1}. ${p.trim()}`).join('\n'), 25, 130);

  doc.save(`Contrato_${sub}_${domme}.pdf`);
});