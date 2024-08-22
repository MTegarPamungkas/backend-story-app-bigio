module.exports = function createStoryUseCase({ storyRepository }) {
  return async function (storyData) {
    return await storyRepository.save(storyData);
  };
};
