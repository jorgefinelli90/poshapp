export interface Memory {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string;
  likes: string[]; // Array of user IDs who liked the memory
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
}
