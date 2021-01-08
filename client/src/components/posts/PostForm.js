import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';
import PostItem from './PostItem';
import { getPosts } from '../../actions/post';

import axios from 'axios';
import { UPDATE_PROFILE } from '../../actions/types';

const PostForm = ({ addPost,post: { posts, loading }}) => {
    const [text, setText] = useState('');
    const [jdata, setJdata] = useState({});
    const [tmp,setTmp]= useState(1);
    const [flag,setFlag] = useState(false);
    const [a,setA] =useState([]);
    const [cnt,setCnt] =useState(0)
  
   

    return (
        <div className='post-form'>
            <div className='bg-primary p'>
                <h3>Add a book if not already present in the repository...</h3>
            </div>
            <form
                className='form my-1'
                onSubmit={e => {
                    e.preventDefault();

                    const apikey='AIzaSyCeAp2Iyywk86cdbiYb2k5PnnziOwsa5gk';
                    fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + text + '&key=AIzaSyCeAp2Iyywk86cdbiYb2k5PnnziOwsa5gk')
                    .then(response => {
                        return response.json();
                    }).then(data => {
                        if(tmp==1 && data.totalItems===0 ){
                            alert("Invalid ISBN");
                            window.location.reload(true);
                        }
                        else 
                        setText(data.items[0].volumeInfo.title+" by "+data.items[0].volumeInfo.authors[0]);
                        
                    }).catch(err => console.log(err));
                    if(tmp==2){
                        let f=false;
                        posts.forEach(function(p){
                            if(p.text===text){
                                f=true;
                            }
                        })
                       if(f) alert("This Book already exists, You May Enter into it's Discussion to post your queries");
                       else
                       addPost({text});
                       setTmp(1);
                       setFlag(false);
                    }
                    else{
                        setTmp(2);
                        setFlag(true);
                    }
                    setText("");
                }}
            >
                <textarea
                    name='text'
                    cols='30'
                    rows='5'
                    placeholder='Enter The ISBN without spaces or hypens'
                    value={text}
                    onChange={e => {
                        setText(e.target.value)
                    }}
                    required
                />
                <input
                    type='submit'
                    className='btn btn-dark my-1'
                    value={flag?'Add Book':'Verify ISBN'}
                />
            </form>
        </div>
    );
};

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    post: state.post,
});

export default connect(mapStateToProps , { addPost})(PostForm);
