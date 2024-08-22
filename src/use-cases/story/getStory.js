module.exports = function getStories({ storyRepository }) {
  return async function () {
    return await storyRepository.findAll();
  };
};
