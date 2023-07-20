import { createServer } from 'miragejs';

import data from './data.json';

createServer({
  routes() {
    this.namespace = 'api';

    this.get('/posts', (schema, request) => {
      const { page } = request.queryParams;
      const perPage = 3;

      // Calculate the start index and end index for pagination
      const startIndex = page === 1 ? 1 : (page - 1) * perPage;
      const endIndex = startIndex + perPage;

      // Check if the start index is within the range of the data array
      if (startIndex >= 0 && startIndex < data.posts.length) {
        // Return the paginated posts
        return data.posts.slice(startIndex, endIndex);
      } else {
        // If the start index is out of range, return an empty array
        return [];
      }
    });
  },
});
