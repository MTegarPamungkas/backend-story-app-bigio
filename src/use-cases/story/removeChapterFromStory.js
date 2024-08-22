module.exports = function removeChapterFromStory({ storyRepository }) {
  return async function (storyId, chapterId) {
    const story = await storyRepository.findById(storyId);
    if (!story) {
      throw new Error("Story not found");
    }
    story.chapters = story.chapters.filter(
      (chapter) => chapter._id.toString() !== chapterId
    );
    return await storyRepository.update(storyId, story);
  };
};
