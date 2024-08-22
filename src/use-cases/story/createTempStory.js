module.exports = function createTempStory({ tempStoryRepository }) {
  return async function (storyData) {
    return await tempStoryRepository.save(storyData);
  };
};
