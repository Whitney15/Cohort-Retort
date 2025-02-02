import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_POSTS, USER_BY_ID } from "../../utils/queries";
import CreateComment from "../CreateComment";
import Comment from "../Comment";
import PostHeader from "./PostHeader";
import Linkify from "react-linkify";

const PostCard = () => {
  const { loading, data, error } = useQuery(QUERY_POSTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching posts: {error.message}</p>;

  const posts = data?.posts || [];

  console.log("postsData", posts);

  return (
    <div className="">
      {posts.map((post) => (
        <PostCardItem key={post._id} post={post} />
      ))}
    </div>
  );
};

const PostCardItem = ({ post }) => {
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowComments(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const [showComments, setShowComments] = useState(false);

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  console.log("Post from card item", post);
  console.log("Post.user from card item", post.user);
  console.log("Post.user._id from card item", post.user._id);

  const props = {
    postID: post._id,
    userId: post.user._id,
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div
      ref={wrapperRef}
      className="bg-white shadow-md shadow-slate-400 rounded-xl mx-4 md:mx-auto max-w-md md:max-w-2xl my-6"
    >
      <PostHeader userId={post.user._id} postId={post._id} />
      <div key={post._id} className="">
        <p className="-mt-8 text-slate-400 text-xs pl-12 pt-6">
          Created on: {post.createdAt}
        </p>

        <div className="pl-12 pr-10">
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a
                href={decoratedHref}
                key={key}
                target="_blank"
                rel="noopener noreferrer"
              >
                {decoratedText}
              </a>
            )}
          >
            <p className="mt-2 color-medblue text-l pb-6">{post.postText}</p>
          </Linkify>
        </div>

        <div className="">{/* Rest of the component code */}</div>
      </div>
      <div className="grid justify-items-end pr-5 pb-8">
        <button
          onClick={handleShowComments}
          className="flex text-gray-700 text-sm pr-8 rounded"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className="color-dkblue w-4 h-4 mr-1"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          <span>Comment</span>
        </button>
        {showComments && (
          <div className="w-full flex-col items-start text-gray-700 text-sm pl-5">
            {/* Render CreateComment and Comment components if showComments is true */}

            <CreateComment postID={post._id} />
            <Comment postID={post._id} userId={post.user._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
