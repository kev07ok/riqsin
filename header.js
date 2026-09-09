document.write(`
  <div class="sidebar-overlay" id="overlay"></div>
  
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <h2>RIQSIN</h2>
      <button id="closeBtn" class="close-btn">✕</button>
    </div>
    <nav class="sidebar-nav">
      <a href="/">Inicio</a>
      <a href="/metodo/">Método</a>
      <a href="/investigaciones/">Investigación</a>
      <a href="/biblioteca/">Biblioteca</a>
      <a href="/aviso-legal/">Aviso Legal</a>
      <a href="/terminos/">Términos</a>
    </nav>
    <div class="sidebar-footer">
      <a href="https://instagram.com/kev07_ok" target="_blank">IG Personal</a>
      <a href="https://instagram.com/riqsin.oficial" target="_blank">IG RIQSIN</a>
    </div>
  </aside>

  <header class="topbar">
    <button id="openBtn" class="menu-btn">☰</button>
    <h2>RIQSIN</h2>
  </header>

  <script>
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');

    function openMenu() {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    }
    function closeMenu() {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    }

    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
  <\/script>
`);