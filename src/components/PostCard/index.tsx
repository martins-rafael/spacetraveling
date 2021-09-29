import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { Post } from '../../templates/Home';
import styles from './PostCard.module.scss';
import commonStyles from '../../styles/common.module.scss';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps): JSX.Element {
  const { uid, first_publication_date, data } = post;
  const { title, subtitle, author } = data;

  return (
    <div className={styles.post}>
      <Link href={`/post/${uid}`}>
        <a>
          <h2>{title}</h2>
          <p>{subtitle}</p>

          <div className={commonStyles.info}>
            <div>
              <FiCalendar />
              {first_publication_date}
            </div>

            <div>
              <FiUser />
              {author}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
