document.addEventListener('DOMContentLoaded', () => {
  const topbar = document.createElement('div');
  topbar.className = 'topbar';
  topbar.innerHTML = `
    <button class="menu-btn" id="open-menu">☰</button>
    <strong>RIQSIN</strong>
  `;
  document.body.prepend(topbar);

  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-top">
      <div class="sidebar-header">
        <strong>RIQSIN</strong>
        <button class="close-btn" id="close-menu">✕</button>
      </div>
      <nav class="sidebar-nav">
        <a href="/"><span>01</span> Inicio</a>
        <a href="/metodo/"><span>02</span> El Método</a>
        <a href="/biblioteca/"><span>03</span> Biblioteca</a>
        <a href="/investigaciones/"><span>04</span> Investigaciones</a>
        <a href="/contacto/"><span>05</span> Contacto</a>
        <a href="/mi-cuenta/"><span>06</span> Mi Cuenta</a>
      </nav>
    </div>
  `;
  document.body.appendChild(sidebar);

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'overlay';
  document.body.appendChild(overlay);

  const openBtn = document.getElementById('open-menu');
  const closeBtn = document.getElementById('close-menu');
  
  function openMenu(){
    sidebar.classList.add('open');
    overlay.classList.add('show');
  }
  function closeMenu(){
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }

  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
});
