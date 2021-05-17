import React from 'react';
import Navbar from './navbar';
import { Link } from 'react-router-dom';

const home = () => (<>
        <Navbar />
    <div className='container'>

        <div className="jumbotron">
            <h1 className="display-4">Welcome, to BLog Life!</h1>
            <p className="lead">This is the private Blog channel to create a Professional Blogs </p>
            <hr className="my-4" />
            <p>Feel Free ! to Your Blog </p>
            <p className="lead">
                <Link className="btn btn-primary btn-lg" exact to ="/blog" role="button">Check Out over Blogs</Link>
            </p>
        </div>
    </div>
</> )

export default home;    