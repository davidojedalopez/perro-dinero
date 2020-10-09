import '../styles/base.css'
import '../styles/main.css'

window.addEventListener("load", (event) => {
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
        ifrm.setAttribute('class', 'bg-background mx-auto');
  
        entry.target.appendChild(ifrm)
    
        ifrm.setAttribute('src', 'https://perrodinero.substack.com/embed');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  observer.observe(embed);
}, false);