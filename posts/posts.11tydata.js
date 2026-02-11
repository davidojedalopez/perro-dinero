module.exports = {
  eleventyComputed: {
    month: data => new Intl.DateTimeFormat('es-MX', {
      month: 'long',
    }).format(new Date(data.published_at)),
    year: data => new Intl.DateTimeFormat('es-MX', {
      year: 'numeric'
    }).format(new Date(data.published_at)),
    monthYear: data => `${data.month}, ${data.year}`,
    temas: (data) => {
      const predefinedThemes = Array.isArray(data.temas) ? data.temas : []
      const automaticThemes = data.temas_hub.getThemesForPost({
        fileSlug: data.page.fileSlug,
        tags: data.tags,
        title: data.title
      })

      return Array.from(new Set([...predefinedThemes, ...automaticThemes]))
    }
  }
}
