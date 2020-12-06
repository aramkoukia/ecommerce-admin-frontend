import RestUtilities from './RestUtilities';

export default class BlogPostService {
  static async getBlogPosts() {
    try {
      const response = await RestUtilities.get(
        'blogposts',
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async createBlogPost(blogPost) {
    try {
      const response = await RestUtilities.post(
        'websitesliders',
        blogPost,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async deleteBlogPost(blogPost) {
    try {
      const response = await RestUtilities.delete(
        `websitesliders/${blogPost.id}`,
        blogPost,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateBlogPost(blogPost) {
    try {
      const response = await RestUtilities.put(
        `websitesliders/${blogPost.id}`,
        blogPost,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }

  static async updateBlogPostImage(id, blogPost) {
    try {
      const response = await RestUtilities.postForm(
        `websitesliders/${id}/upload`,
        blogPost,
      );
      return response.content;
    } catch (err) {
      return false;
    }
  }
}
