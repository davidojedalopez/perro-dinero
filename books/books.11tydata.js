module.exports = {
    eleventyComputed: {
        month: data => new Intl.DateTimeFormat('es-MX', {                        
            month: 'long', 
        }).format(new Date(data.published_at)),
        year: data => new Intl.DateTimeFormat('es-MX', {                        
            year: 'numeric' 
        }).format(new Date(data.published_at)),
        monthYear: data => `${data.month}, ${data.year}`
    }
}