import { CommentInterface } from '../main/comment.interface';

export interface ArticleFullInterface {
  text: string;
  comments: CommentInterface[];
  commentsCount: 0;
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  url: string;
}
