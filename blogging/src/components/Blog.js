import React from 'react';
import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [FeaturedBlogs, setFeaturednBlogs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/featured`);
        setFeaturednBlogs(res.data[0]);

      }
      catch (err) {

      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/featured`);
        setBlogs(res.data);

      }
      catch (err) {

      }
    }
    fetchBlogs();
  }, []);
  const capitalizefirstLatter = (word) => {
    if (word)
      return word.charAt(0).toUpperCase() + word.slice(1);
    return '';
  };
  const getBlogs = () => {
    let list = [];
    let result = [];
    blogs.map(blogPost => {
      return list.push(
        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
          <div className="col p-4 d-flex flex-column position-static">
            <strong className="d-inline-block mb-2 text-primary">{capitalizefirstLatter(blogPost.category)}</strong>
            <h3 className="mb-0">{blogPost.title}</h3>
            <div className="mb-1 text-muted">{blogPost.month}</div>
            <p className="card-text mb-auto">{blogPost.excerpt}</p>
            <Link to={`blog/${blogPost.slug}`} className="stretched-link">Continue reading</Link>
          </div>
          <div className="col-auto d-none d-lg-block">
            <img width='200' height='250' src={blogPost.thumbnail} alt='thumbnail'></img>

          </div>
        </div>
      );
    })
    for ( let i = 0; i < list.length; i +=2){
      result.push(
        <div key={i}  className='row mb-2'>
          <div className='col-mb-6'>
            {list[i]}
          </div>
          <div className='col-mb-6'>
          {list[i+1] ? list[i+1] : null}
          </div>
        </div>
      )
    }




    return result;
  };
  return (
    <div className='container mt-3'>
      <div class="nav-scroller py-1 mb-2">
        <nav class="nav d-flex justify-content-between">
          <Link class="p-2 link-secondary" to='/category/world'>World</Link>
          <Link class="p-2 link-secondary" to='/category/enviorenment'>Enviorenment</Link>
          <Link class="p-2 link-secondary" to='/category/technology'>Technology</Link>
          <Link class="p-2 link-secondary" to='/category/design'>Design</Link>
          <Link class="p-2 link-secondary" to='/category/culture'>Culture</Link>
          <Link class="p-2 link-secondary" to='/category/buisness'>Business</Link>
          <Link class="p-2 link-secondary" to='/category/polictics'>Politics</Link>
          <Link class="p-2 link-secondary" to='/category/opinion'>Opinion</Link>
          <Link class="p-2 link-secondary" to='/category/science'>Science</Link>
          <Link class="p-2 link-secondary" to='/category/health'>Health</Link>
          <Link class="p-2 link-secondary" to='/category/style'>Style</Link>
          <Link class="p-2 link-secondary" to='/category/travel'>Travel</Link>
        </nav>
      </div>
      <div class="p-4 p-md-5 mb-4 text-white rounded bg-dark">
        <div class="col-md-6 px-0">
          <h1 class="display-4 fst-italic">{FeaturedBlogs.title}</h1>
          <p class="lead my-3">{FeaturedBlogs.excerpt}</p>
          <p class="lead mb-0">
            <Link to={`/blog/${FeaturedBlogs.slug}`} class="text-white fw-bold">
              Continue reading...
        </Link>
          </p>
        </div>
      </div>
    </div>
  );

}
export default Blog