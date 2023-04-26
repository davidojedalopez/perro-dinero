import '../styles/base.css'
import '../styles/main.css'
import { annotate } from 'rough-notation'

window.addEventListener("load", (event) => {
  setDarkModeToggle();
  setAnnotations();
  setNewsletterObserver();
}, false);

function setNewsletterObserver() {
  const newsletterCta = document.querySelector('.newsletter-cta');
  const iframe = newsletterCta.querySelector('iframe.newsletter-cta-iframe');

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        iframe.src = iframe.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  };

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(newsletterCta);
}

function setAnnotations() {
  const annotations = document.querySelectorAll('.annotated');
  const options = {
    threshold: 1
  };

  if (annotations.length <= 0) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          annotate(entry.target, {
            type: 'box',
            padding: 5,
            multiline: true,
            animationDuration: 1000,
            color: "#b91c1c"
          }).show();
        }, 500)
        observer.unobserve(entry.target)
      }
    });
  }, options);

  for (const annotation of annotations) {
    observer.observe(annotation);
  }
}

function setDarkModeToggle() {
  const darkModeToggle = document.querySelector('#dark-mode-toggle');
  if (!darkModeToggle) {
    return;
  }

  darkModeToggle.checked = !document.documentElement.classList.contains('dark');
  darkModeToggle.parentElement.classList.remove('hidden');

  darkModeToggle.addEventListener('click', (event) => {
    if (document.documentElement.classList.contains('dark')) {
      localStorage.setItem('dark-mode-enabled', 'false');
    } else {
      localStorage.setItem('dark-mode-enabled', 'true');
    }
    document.documentElement.classList.toggle('dark');
  });
}
