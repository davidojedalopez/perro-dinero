export function initNewsletterObserver() {
  const newsletterCta = document.querySelector('.newsletter-cta');
  if (!newsletterCta) {
    return;
  }
  const iframe = newsletterCta.querySelector('iframe.newsletter-cta-iframe');
  if (!iframe) {
    return;
  }

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
