import React, { useEffect, useState } from 'react';
import './Homepage.css' 


//function to reformat the raw dateTime to a simple D-M-Y format.
function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function Homepage() {
  const [posts, setPosts] = useState([]); //  initialize a State to hold all posts in the front-end.
  const [selectedCategories, setSelectedCategories] = useState(['All']); // State for the selected categories, which are initially 'All'.
  const [currentPage, setCurrentPage] = useState(1); // State to handle pagination, starts from page 1

  // DATA HANDLING //

  useEffect(() => {
    // Fetch the posts based on the current page number
    fetch(`/api/posts?page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => {
        // If it's the first page, then we simply intialize 'posts' with the first page-data.
        // If it's any page after that, then we simply append the fetched posts to the existing posts.
        setPosts((prevPosts) => (currentPage === 1 ? data : [...prevPosts, ...data]));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [currentPage]); // Trigger the effect when currentPage changes
  

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Increment 'currentPage' to load the next page of posts
  };

  //Category handling

  // Extract only the category names that are currently loaded into the Posts state.
    const allCategories = [];
    for (const post of posts) {
      for (const category of post.categories) {
        if (!allCategories.includes(category.name)) {
          allCategories.push(category.name);
        }
      }
    }

  const handleCategoryChange = (event) => {
    // Update the selected categories based on the user's selection
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedCategories(selectedOptions);
  };

  const filteredPosts = selectedCategories.includes('All')
    ? posts // Show all posts if 'All' category is selected
    : posts.filter((post) => {
        // Filter posts based on selected categories
        return post.categories.some((category) => selectedCategories.includes(category.name));
      });

  return (
    <div>
      <nav className='Navigation-Bar'>
      </nav>
      <div className='FullPage-Container'>
      <div className='Left-Container'>
        <label>Select one or more Categories</label>
        <select className='select-box' value={selectedCategories} onChange={handleCategoryChange} multiple size={7}>
            {/* The category options are extracted from the current present Posts inside Posts. 
            We could simply hardcode all the categories, but that means categorie-options will be present whilst not having any posts present to filter them on.
            In this case it's a design choice, but i would rather consolidate with fellow developers (or the designer of the system) on the matter.*/}
            <option key='All' value='All'>All</option>
            {allCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
             ))}
        </select>
        </div>

        <div className='Post-Container'>
          {/* Display the filtered posts */}
          {filteredPosts && filteredPosts.map((post) => (
            <div className='Single-Post' key={post.id}>
              {/* Display post information */}
              <div className='Picture-Name-Container'>
                <img className='Profile-Picture' alt='avatar' src={post.author.avatar}></img>
                <h3 className='Author-Name'>{post.author.name}</h3>
              </div>
              <div className='title-date-container'>
                <h2 className='post-title'>{post.title}</h2>
                <h3 className='Publish-Date'>{formatDate(post.publishDate)}</h3>
              </div>
              <div className='summary-container'>
                <p className='summary-text'>{post.summary}</p>
              </div>
              <div className='categories-overview'> 
              {post.categories.map((category) => (
                <div className='category-box'>
                  <h3 className='category-name'>{category.name}</h3></div>
             ))}
             </div>
            </div>
          ))}
          {/* Load more button to fetch the next page of posts */}
          <button className='Load-More-Button' onClick={handleLoadMore}>Load More</button>
        </div>
        <div className='Right-Container'></div>
      </div>
      <footer></footer>
    </div>
  );
}

export default Homepage;
