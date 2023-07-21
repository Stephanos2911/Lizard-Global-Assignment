import { createServer } from 'miragejs';

import data from './data.json';

createServer({
  routes() {
    this.namespace = 'api';

    this.get('/posts', (schema, request) => {
      //Pagination can be done on the front (calling a big chunk and slowly introducing more as the user progresses), 
      //back(Calling the API for chunks at a time) or both. I myself had learned about the topic in Course, but had not yet implemented it in a program.
      
      //The API receives the current page index, on which it calculates the starting index for slicing of the posts. 
      //The end index is simply the starting index + the amount of posts returned by every api call.
      
      const { page } = request.queryParams;
      const perPage = 3;  

      //Validating the data the API receives.

       // Convert the page parameter to an integer
      const pageInt = parseInt(page);

      // Check if the page is a valid positive integer. if not, return Bad Request 400.
      if (isNaN(pageInt) || pageInt <= 0) {
        return new Response(400, {}, { error: 'Invalid page number. Please provide a positive integer.' });
      }

      //Making sure the Page is within range before calculating the indexes and sending the data.
      
      // Calculate the total number of pages available based on the data and perPage value
      const totalPosts = data.posts.length;
      const totalPages = Math.ceil(totalPosts / perPage);

      // Check if the requested page exceeds the total number of pages available
      if (pageInt > totalPages) {
        return new Response(404, {}, { error: 'Page is out of range.' });
      }

      //if all is correct, send the post of the requested page.

      // Calculate the start index and end index for pagination
      const startIndex = page === 1 ? 1 : (page - 1) * perPage;
      const endIndex = startIndex + perPage;

      return data.posts.slice(startIndex, endIndex);
    });



    //If the Detailpage for a post had to be implemented, then the ID of the post could be routed to the detail-component.
    //From there, an api call to the following GET endpoint with the corresponding post-ID could be made to receive the data of that specific post.
    this.get('/posts/:postId', (schema, request) => {
      const { postId } = request.params;
    
      //Validate the ID for the UUID format before trying to find it in the data source.
        
      // Regular expression to match the UUID format
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

      // Check if the postId matches the UUID format
      if (!uuidRegex.test(postId)) {
        return new Response(400, {}, { error: 'Invalid postId format. Please provide a valid ID.' });
      }

      // Find the post with the given postId in the JSON
      const post = data.posts.find((post) => post.id === parseInt(postId));
    
      // Return the post if found, otherwise return a 404 response
      if (post) {
        return post;
      } else {
        return new Response(404);
      }
    });
    


  },
});
