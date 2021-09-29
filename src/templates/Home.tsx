import Head from 'next/head';
import { useState } from 'react';
import { formatDate } from '../utils/format-date';

import Header from '../components/Header';
import PostCard from '../components/PostCard';
import commonStyles from '../styles/common.module.scss';
import styles from './Home.module.scss';

export interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export interface PostPagination {
  next_page: string;
  results: Post[];
}

export interface PostPage extends PostPagination {
  page: number;
}

export interface HomeProps {
  postsPagination: PostPagination;
}

export default function HomeTemplate({
  postsPagination,
}: HomeProps): JSX.Element {
  const formattedPosts = postsPagination.results.map(post => ({
    ...post,
    first_publication_date: formatDate(post.first_publication_date),
  }));

  const [posts, setPosts] = useState<Post[]>(formattedPosts);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  const handleLoadPosts = async (): Promise<void> => {
    if (currentPage !== 1 && nextPage === null) return;

    const response = await fetch(nextPage);
    const postsResults: PostPage = await response.json();
    const newPosts = postsResults.results.map(post => ({
      uid: post.uid,
      first_publication_date: formatDate(post.first_publication_date),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }));

    setNextPage(postsResults.next_page);
    setCurrentPage(postsResults.page);
    setPosts([...posts, ...newPosts]);
  };

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <div className={commonStyles.container}>
        <Header />

        <main className={styles.postsContainer}>
          {posts.map(post => (
            <PostCard key={post.uid} post={post} />
          ))}

          {nextPage && (
            <button type="button" onClick={handleLoadPosts}>
              Carregar mais posts
            </button>
          )}
        </main>
      </div>
    </>
  );
}
