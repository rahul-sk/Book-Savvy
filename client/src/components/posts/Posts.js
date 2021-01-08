import React, { Fragment, useEffect,useState  } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../actions/post';
import API from './API';
// import arr from './globaldata';
// import barray from './Books';

const Posts = ({ getPosts, post: { posts, loading } }) => {

    useEffect(() => {
        getPosts()
    }, [getPosts]);

    return loading ? (
        <Spinner />
    ) : (
        <Fragment>
            <h1 className='large text-primary'>Books</h1>
            <p className='lead'>
                <i className='fas fa-user' /> Welcome to the community
            </p>
            <PostForm />
            <div className='posts'>
                {posts.map(post => (
                    <PostItem key={post._id} post={post} />
                ))}
            </div>
        </Fragment>
    );
};

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
