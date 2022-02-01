/* eslint-disable react/no-danger */
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { formatDate } from '../utils/format-date';

import Header from '../components/Header';
import Comments from '../components/Comments';
import commonStyles from '../styles/common.module.scss';
import styles from './Post.module.scss';

export interface PostData {
  uid?: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    subtitle?: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

export interface NavigationData {
  prevPost: {
    uid: string;
    data: {
      title: string;
    };
  }[];
  nextPost: {
    uid: string;
    data: {
      title: string;
    };
  }[];
}

export interface PostProps {
  post: PostData;
  navigation: NavigationData;
}

export default function PostTemplate({
  post,
  navigation,
}: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) return <p>Carregando...</p>;

  const { first_publication_date, last_publication_date, data } = post;
  const { title, author, banner, content } = data;
  const formatedDate = formatDate(first_publication_date);
  const readingTime = content.reduce((total, item) => {
    const wordsLength = item.body.map(
      textItem => textItem.text.split(' ').length
    );
    const time = Math.ceil(
      wordsLength.reduce((acc, wordLength) => acc + wordLength, 0) / 200
    );

    return total + time;
  }, 0);

  const isPostEdited = first_publication_date !== last_publication_date;
  let editDate;

  if (isPostEdited) {
    editDate = formatDate(last_publication_date);
  }

  return (
    <>
      <Head>
        <title>{title} | spacetraveling</title>
      </Head>

      <Header />

      <img
        className={styles.image}
        src={banner.url}
        alt={`Imagem de ${title}`}
      />

      <main className={`${commonStyles.container} ${styles.post}`}>
        <h1>{title}</h1>

        <div className={commonStyles.info}>
          <div>
            <FiCalendar />
            {formatedDate}
          </div>

          <div>
            <FiUser />
            {author}
          </div>

          <div>
            <FiClock />
            {readingTime} min
          </div>
        </div>

        {isPostEdited && <span>* editado em {editDate}</span>}

        {content.map(item => (
          <article className={styles.content} key={item.heading}>
            <h2>{item.heading}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(item.body),
              }}
            />
          </article>
        ))}

        <section className={styles.navigation}>
          {navigation?.prevPost.length > 0 && (
            <div>
              <h3>{navigation.prevPost[0].data.title}</h3>
              <Link href={`/post/${navigation.prevPost[0].uid}`}>
                <a>Post anterior</a>
              </Link>
            </div>
          )}

          {navigation?.nextPost.length > 0 && (
            <div>
              <h3>{navigation.nextPost[0].data.title}</h3>
              <Link href={`/post/${navigation.nextPost[0].uid}`}>
                <a>Próximo post</a>
              </Link>
            </div>
          )}
        </section>

        <Comments />
      </main>
    </>
  );
}
