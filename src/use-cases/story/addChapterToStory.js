module.exports = function addChapterToStory({ storyRepository }) {
  return async function (storyId, chapterData) {
    const story = await storyRepository.findById(storyId);
    if (!story) {
      throw new Error("Story not found");
    }
    story.chapters.push(chapterData);
    return await storyRepository.update(storyId, story);
  };
};
