'use client';

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
    return (
        <div className="mt-16 prompt_layout">
            {data.map((post) => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    )
}

const Feed = () => {
    const [searchText, setSearchText] = useState("");
    const [allPosts, setAllPosts] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchedResults, setSearchedResults] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch("/api/prompt");
            const data = await response.json();
            setAllPosts(data);
        }
        fetchPosts();
    }, []);

    const filterPosts = (searchText) => {
        const regex = new RegExp(searchText, "i");
        return allPosts.filter((post) => (
            regex.test(post.tag) ||
            regex.test(post.prompt) ||
            regex.test(post.creator.username)
        ));
    };

    const handleSearchChange = (e) => {
        clearInterval(searchTimeout);
        setSearchText(e.target.value);
        
        setSearchTimeout(setTimeout(() => {
            const searchResults = filterPosts(e.target.value);
            setSearchedResults(searchResults);
        }))
    }

    const handleTagClick = (tag) => {
        setSearchText(tag);
        setSearchedResults(filterPosts(tag));
    }

    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                    type="text"
                    placeholder="Search for a tag or username"
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className="search_input peer"
                />
            </form>
            {searchText
            ? <PromptCardList
                data={searchedResults}
                handleTagClick={handleTagClick}
            />
            : <PromptCardList
                data={allPosts}
                handleTagClick={handleTagClick}
            />}
        </section>
    )
}

export default Feed;
