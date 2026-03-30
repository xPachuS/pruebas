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

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('Contrato D/s', 105, 20, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  let y = 40;
  const lineHeight = 8;

  doc.text(`Ama / Dominante: ${domme}`, 20, y); y += lineHeight;
  doc.text(`Sumiso: ${sub}`, 20, y); y += lineHeight;
  doc.text(`Palabra de seguridad: ${safeword}`, 20, y); y += lineHeight;
  doc.text(`Duración del contrato: ${duration}`, 20, y); y += lineHeight + 5;

  doc.setFont('times', 'bold');
  doc.text('Prácticas consentidas:', 20, y); y += lineHeight;
  doc.setFont('times', 'normal');
  consented.split(',').forEach((p, i) => {
    doc.text(`${i + 1}. ${p.trim()}`, 25, y);
    y += lineHeight;
  });

  y += 5;
  doc.setFont('times', 'bold');
  doc.text('Prácticas no consentidas:', 20, y); y += lineHeight;
  doc.setFont('times', 'normal');
  nonconsented.split(',').forEach((p, i) => {
    doc.text(`${i + 1}. ${p.trim()}`, 25, y);
    y += lineHeight;
  });

  doc.save(`Contrato_${sub}_${domme}.pdf`);
});
