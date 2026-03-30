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
  const lineHeight = 7;

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text('Contrato de Sumisión D/s', 105, y, { align: 'center' });
  y += 12;

  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  // Contrato completo con estilo y claridad
  const contractText = `
Yo, ${sub}, sumiso(a) por voluntad propia y en pleno uso de mis facultades,
consiento, manifiesto y deseo entregarme plenamente a las manos de ${domme}, 
quien será mi Amo / Ama. Por su parte, el Amo / Ama, ${domme}, consiente y manifiesta 
su intención de tomar posesión de su sumiso(a), ${sub}.

Por la firma de este Contrato de Sumisión, se acuerda que el sumiso(a) cede derechos sobre su persona, 
y que el Amo / Ama toma completa posesión del sumiso(a), reclamando para sí su vida, su mente y su bienestar.

A) DEBERES DEL SUMISO/A
1. Obedecer y someterse completamente al Amo / Ama, salvo situaciones indicadas en el Veto (sección C).
2. Reconocer que su cuerpo pertenece al Amo / Ama, quien puede disponer de él según considere adecuado.
3. Comprender que todo lo que posee o hace pasará a ser privilegio otorgado por el Amo / Ama.

B) PALABRA DE SEGURIDAD
La palabra de seguridad acordada es "${safeword}". Su uso indica que el sumiso(a) requiere detener o modificar la actividad. 
El Amo / Ama respetará y evaluará la situación, sin castigar el uso de dicha palabra.

C) VETO DEL SUMISO/A
El sumiso(a) puede ejercer su derecho de veto usando la palabra “MAR”, que indicará la inmediata conclusión de la actividad.

D) CONDUCTA DEL SUMISO/A
1. Adecuar apariencia, hábitos y actitudes a los deseos del Amo / Ama.
2. Hablar y dirigirse siempre con respeto y términos acordados (Ama/Amo, Señora/Señor).
3. Exponer todos sus deseos, fantasías e información relevante a consideración del Amo / Ama.
4. Cumplir responsabilidades domésticas y cuidado de juguetes según indique el Amo / Ama.

E) APARIENCIA DEL SUMISO/A
1. Mantener higiene, aseo y presentación según indicaciones del Amo / Ama.
2. Cumplir reglas de vestimenta y símbolos de sumisión acordados.
3. Permitir modificaciones físicas (tatuajes, perforaciones) según lo desee el Amo / Ama.

F) RESPONSABILIDADES DEL AMO / AMA
1. Cuidar, proteger y entrenar al sumiso(a) con responsabilidad y consideración.
2. Asegurar el bienestar físico y emocional del sumiso(a).

G) CASTIGOS
El sumiso(a) acepta recibir correcciones según decida el Amo / Ama, entendiendo que estas forman parte del entrenamiento y disciplina.

H) OTRAS PERSONAS
El sumiso(a) no tendrá otros Amo / Ama ni relaciones sin permiso del Amo / Ama. 
El Amo / Ama puede aceptar otros sumisos, siempre considerando el bienestar del sumiso(a) principal.

I) ALTERACIÓN DEL CONTRATO
Cualquier cambio requiere consentimiento de ambas partes y generación de un nuevo contrato.

J) TERMINACIÓN
El contrato puede terminarse en cualquier momento por cualquiera de las partes.

K) FIRMA DEL SUMISO/A
Nombre completo: ______________________
Firma: ________________________________
Fecha: _________________________________

L) FIRMA DEL AMO / AMA
Nombre completo: ______________________
Firma: ________________________________
Fecha: _________________________________
`;

  const lines = doc.splitTextToSize(contractText, 180);
  doc.text(lines, 15, y);

  doc.save(`Contrato_Ds_${sub}_${domme}.pdf`);
});
