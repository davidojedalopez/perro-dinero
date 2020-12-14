import '../styles/base.css'
import '../styles/main.css'

window.addEventListener("load", (event) => {
  setSubstackEmbed();
  setDarkModeToggle();
}, false);

function setSubstackEmbed() {
  const embed = document.querySelector('[data-id="substack-embed"]');  
  let options = {    
    threshold: .75
  };

  if(!embed) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        var ifrm = document.createElement('iframe');
        ifrm.setAttribute('frameborder', '0');
        ifrm.setAttribute('scrolling', 'no');
        ifrm.setAttribute('title', 'Widget de Substack, el servicio para newsletters que utilizo.');
        ifrm.setAttribute('same', '');
        ifrm.setAttribute('class', 'mx-auto w-64');

        entry.target.appendChild(ifrm)
    
        ifrm.setAttribute('src', 'https://perrodinero.substack.com/embed');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  observer.observe(embed);
}

function setDarkModeToggle() {
  const darkModeToggle = document.querySelector('#dark-mode-toggle');
  if(!darkModeToggle) {
    return;
  }

  darkModeToggle.checked = !document.documentElement.classList.contains('dark');
  darkModeToggle.parentElement.classList.remove('hidden');
  
  darkModeToggle.addEventListener('click', (event) => {
    if(document.documentElement.classList.contains('dark')) {
      localStorage.setItem('dark-mode-enabled', 'false');      
    } else {
      localStorage.setItem('dark-mode-enabled', 'true');
    }
    document.documentElement.classList.toggle('dark');    
  });
}