// ─── Export Card as PNG ───
async function exportCard() {
  const btn = document.querySelector('.export-btn');
  btn.textContent = '⏳ Rendering…';
  btn.disabled = true;

  try {
    const card = document.getElementById('characterCard');

    // html2canvas can't render conic-gradient on .avatar-ring::before (the spinning ring).
    // We temporarily swap it for a plain gold border so the export looks clean.
    const ring = card.querySelector('.avatar-ring');
    const ringBefore = ring; // we'll apply an inline override

    // Save original styles
    const originalBoxShadow = ring.style.boxShadow;
    const originalBackground = ring.style.background;
    const originalAnimation  = ring.style.animation;

    // Replace conic-gradient ring with a solid gold border for export
    ring.style.background   = 'linear-gradient(135deg, #c9a84c, #f0c040, #c9a84c, #8b6914)';
    ring.style.boxShadow    = '0 0 20px rgba(201,168,76,0.5), 0 0 60px rgba(201,168,76,0.2)';

    // Disable the ::before pseudo-element animation by adding a temp class
    const styleTag = document.createElement('style');
    styleTag.id = '__export_fix__';
    styleTag.textContent = `
      .avatar-ring::before { display: none !important; }
      #characterCard::before { border: 1px solid rgba(201,168,76,0.25) !important; }
    `;
    document.head.appendChild(styleTag);

    // Small delay to let styles apply
    await new Promise(r => setTimeout(r, 60));

    const canvas = await html2canvas(card, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      // Ignore the body stars pseudo-element — only capture the card itself
      ignoreElements: el => el !== card && !card.contains(el) && el.tagName === 'STYLE'
    });

    // Restore original styles
    ring.style.background  = originalBackground;
    ring.style.boxShadow   = originalBoxShadow;
    ring.style.animation   = originalAnimation;
    document.getElementById('__export_fix__')?.remove();

    const link = document.createElement('a');
    const name = (document.getElementById('charName').value || 'character')
      .toLowerCase()
      .replace(/\s+/g, '-');
    link.download = `${name}-card.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('✦ Card exported successfully!');
  } catch (err) {
    console.error('Export error:', err);
    showToast('⚠ Export failed — try again');
    document.getElementById('__export_fix__')?.remove();
  }

  btn.textContent = '⬇ Export Card as PNG';
  btn.disabled = false;
}
