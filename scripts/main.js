import '../styles/base.css'
import '../styles/main.css'
import { annotate } from 'rough-notation'

window.addEventListener("load", (event) => {
  setSubstackEmbed();
  setDarkModeToggle();
  setAnnotations();
}, false);

function setAnnotations() {
  const annotations = document.querySelectorAll('.annotated');
  const options = {
    threshold: 1
  };

  if(annotations.length <= 0) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          annotate(entry.target, {
            type: 'underline',
            padding: 5,
            multiline: true,
            animationDuration: 1500
          }).show();
        }, 1000)
        observer.unobserve(entry.target)
      }
    });
  }, options);

  for(const annotation of annotations) {
    observer.observe(annotation);
  }
}

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
