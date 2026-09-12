document.addEventListener("DOMContentLoaded", () => {
  const footerHTML = `
  <footer>
    <div class="footer-grid">
      <div>
        <h4>RIQSIN</h4>
        <p>© 2026 RIQSIN — Conocete, Controlate y Evoluciona.</p>
        <p style="margin-top:10px; font-size:12px; color:#999;">Proyecto en desarrollo por Kevin Arozamena — Buenos Aires, Argentina.</p>
      </div>
      <div>
        <h4>Legal</h4>
        <a href="/aviso-legal/">Aviso Legal</a>
        <a href="/terminos/">Términos y Condiciones</a>
        <a href="/privacidad/">Política de Privacidad</a>
      </div>
      <div>
        <h4>Contacto</h4>
        <a href="/contacto/">Contacto</a>
        <a href="https://instagram.com/kev07_ok" target="_blank">IG Creador — @kev07_ok</a>
        <a href="https://instagram.com/metodoriqsin" target="_blank">IG Oficial — @metodoriqsin</a>
      </div>
    </div>
  </footer>
  `;
  
  // Lo inserta al final del body
  document.body.insertAdjacentHTML('beforeend', footerHTML);
});