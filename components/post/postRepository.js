const db = require('../../database/models/index');
const Post = db.posts;
const Tag = db.tags;
const PostTag = db.post_tag;
const Likes = db.likes;
const User = db.users;
const sequelize = require('sequelize');
const SQ = require('sequelize');
const Sequelize = SQ.Sequelize;
const Op = sequelize.Op;

/**
 * 기능: post 생성
 */
exports.createPost = async (title, content, userId) => {
  return await Post.create({
    title: title,
    content: content,
    user_id: userId,
  });
};

/**
 * 기능: tag 생성
 * 입력된 해시태그를 조회 후 없는 값이면 생성하고, 있는 값이면 찾아온다.
 */
exports.createTag = async (tag) => {
  return await Tag.findOrCreate({
    where: { tag: tag.replace(',', '') },
    raw: true,
  });
};

/**
 * 기능: posts, tags 중간 테이블에 post_id, tag_id 입력
 */
exports.createPostTag = async (postId, tagId) => {
  return await PostTag.create({
    post_id: postId,
    tag_id: tagId,
  });
};

/**
 * 기능: id로 post 조회
 */
exports.readPostById = async (postId) => {
  return await Post.findOne({
    where: { id: postId },
    raw: true,
  });
};

/**
 * 기능: posts 테이블 is_deleted 컬럼 업데이트
 */
exports.updatePostIsDeleted = async (postId, isDeleted) => {
  return await Post.update(
    {
      is_deleted: isDeleted,
    },
    { where: { id: postId } }
  );
};

/**
 * 기능: 좋아요 테이블에 create
 */
exports.createLike = async (userId, postId) => {
  return await Likes.create({
    user_id: userId,
    post_id: postId,
  });
};

/**
 * 기능: 좋아요 테이블에서 delete
 */
exports.deleteLike = async (userId, postId) => {
  return await Likes.destroy({
    where: { user_id: userId, post_id: postId },
  });
};

/**
 * 기능: 좋아요 테이블에서 userId, postId 조합으로 select
 */
exports.readLike = async (userId, postId) => {
  return await Likes.findOne({
    where: { user_id: userId, post_id: postId },
    raw: true,
  });
};

/**
 * 기능: posts 테이블에 hits +1 업데이트
 */
exports.updatePostsHits = async (postId, hits) => {
  return await Post.update(
    {
      hits: hits + 1,
    },
    { where: { id: postId } }
  );
};

/**
 * 기능: post id로 post, 유저 이름 조회
 */
exports.readPostAndUserName = async (postId) => {
  return await Post.findOne({
    attributes: [
      [Sequelize.col('user.name'), 'user_name'],
      ['title', 'title'],
      ['content', 'content'],
      ['hits', 'hits'],
    ],
    include: [
      {
        model: User,
        as: 'user',
        attributes: [],
      },
    ],
    where: { id: postId },
    raw: true,
  });
};

/**
 * 기능: post id로 tag 조회
 */
exports.readTags = async (postId) => {
  return await PostTag.findAll({
    attributes: [[Sequelize.col('tag.tag'), 'tag']],
    include: [
      {
        model: Tag,
        as: 'tag',
        attributes: [],
      },
    ],
    where: { post_id: postId },
    raw: true,
  });
};

/**
 * 기능: posts 테이블 title, content 업데이트
 */
exports.updatePost = async (title, content, postId) => {
  return await Post.update(
    {
      title: title,
      content: content,
    },
    { where: { id: postId } }
  );
};

/**
 * 기능: post 목록 조회
 */
exports.readPosts = async (search, page, countResult) => {
  return await Post.findAll({
    attributes: [
      ['id', 'post_id'],
      [Sequelize.col('user.name'), 'writer'],
      ['title', 'title'],
      ['content', 'content'],
      ['hits', 'hits'],
      ['createdAt', 'date'],
    ],
    include: [
      {
        model: User,
        as: 'user',
        attributes: [],
      },
    ],
    where: {
      [Op.and]: [
        { is_deleted: false },
        {
          [Op.or]: [
            { title: { [Op.like]: '%' + search + '%' } },
            { content: { [Op.like]: '%' + search + '%' } },
          ],
        },
      ],
    },
    order: [['createdAt', 'DESC']],
    offset: (page - 1) * countResult,
    limit: countResult,
    raw: true,
  });
};
