const topics = require('../_data/topics');

module.exports = {
  eleventyComputed: {
    month: data => new Intl.DateTimeFormat('es-MX', {
      month: 'long',
    }).format(new Date(data.published_at)),
    year: data => new Intl.DateTimeFormat('es-MX', {
      year: 'numeric'
    }).format(new Date(data.published_at)),
    monthYear: data => `${data.month}, ${data.year}`,
    topics_normalized: data => topics.normalizeTopics(data.tags),
    primary_topic: data => {
      const [primaryTopic] = topics.normalizeTopics(data.tags);
      return primaryTopic || null;
    },
    primary_topic_data: data => {
      const [primaryTopic] = topics.normalizeTopics(data.tags);
      return primaryTopic ? topics.bySlug[primaryTopic] : null;
    }
  }
};
