import { CommentInterface } from './comment.interface'

export interface CommentResponseInterface{
	allCount: number;
	comments: CommentInterface[];
}