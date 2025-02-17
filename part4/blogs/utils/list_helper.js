const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  let likes = 0;

  blogs.forEach(blog => {
    likes += blog.likes;
  });

  return likes;
}

const favouriteBlog = (blogs) => {
  let maxLikes = Math.max(...blogs.map((blog) => blog.likes));

  let blog = blogs.find((blog) => blog.likes === maxLikes);

  return {
    "title": blog.title,
    "author": blog.author,
    "likes": blog.likes
  };
}

const mostBlogs = (blogs) => {
  const authors = {};

  blogs.forEach((blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + 1;
  });

  const maxBlogs = Math.max(...Object.values(authors));
  const mostProlificAuthor = Object.keys(authors).find((author) => authors[author] === maxBlogs);

  return {
    "author": mostProlificAuthor,
    "blogs": maxBlogs
  };
}

const mostLikes = (blogs) => {
  const authors = {};

  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes;
  })

  const maxLikes = Math.max(...Object.values(authors));
  const authorWithMoreLikes = Object.keys(authors).find((author) => authors[author] === maxLikes);

  return {
    "author": authorWithMoreLikes,
    "likes": maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}