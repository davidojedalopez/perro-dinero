import { annotate } from 'rough-notation'

export function initAnnotations() {
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
