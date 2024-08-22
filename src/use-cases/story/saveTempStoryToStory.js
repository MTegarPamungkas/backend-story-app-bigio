module.exports = function saveTempStoryToStory({
  tempStoryRepository,
  storyRepository,
}) {
  return async function (tempStoryId) {
    try {
      // Temukan TempStory berdasarkan ID
      const tempStory = await tempStoryRepository.findById(tempStoryId);
      if (!tempStory) {
        throw new Error("Temp Story not found");
      }

      // Persiapkan data untuk Story baru
      const storyData = {
        title: tempStory.title,
        synopsis: tempStory.description, // Menyesuaikan dengan field schema Story
        writer: tempStory.writer, // Asumsi ada field writer dalam TempStory
        categoryId: tempStory.categoryId, // Menyesuaikan dengan field schema Story
        tags: tempStory.tags || [], // Pastikan field tags ada
        coverImage: tempStory.coverImage || null, // Pastikan field coverImage ada
        status: tempStory.status || "Draft", // Pastikan field status ada
        chapters: tempStory.chapters || [], // Pastikan field chapters ada
      };

      // Simpan Story baru ke database
      const savedStory = await storyRepository.save(storyData);

      // Hapus TempStory dari database
      await tempStoryRepository.remove(tempStoryId);

      // Kembalikan Story yang telah disimpan
      return savedStory;
    } catch (error) {
      // Menangani error
      console.error("Failed to save Temp Story to Story:", error);
      throw new Error(`Failed to save Temp Story to Story: ${error.message}`);
    }
  };
};
