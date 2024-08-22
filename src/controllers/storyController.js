const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const createStory = require("../use-cases/story/createStory");
const createTempStory = require("../use-cases/story/createTempStory");
const saveTempStoryToStory = require("../use-cases/story/saveTempStoryToStory");
const uploadToBytescale = require("../config/bytescaleUpload");

module.exports = function storyController({
  storyRepository,
  tempStoryRepository,
}) {
  return {
    createStory: async (req, res) => {
      try {
        const { title, synopsis, writer, category, tags, status } = req.body;

        if (!title || !category) {
          return res
            .status(400)
            .json({ error: "Title and category are required." });
        }

        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.file.buffer;
        const uniqueFileName = `${uuidv4()}-${Date.now()}-${
          req.file.originalname
        }`;
        const result = await uploadToBytescale({
          accountId: process.env.BYTESCALE_ACCOUNT_ID,
          requestBody: file,
          metadata: {},
          querystring: {
            fileName: uniqueFileName,
            filePath: `/uploads/${uniqueFileName}`,
          },
        });

        const { fileUrl } = result;

        const newStory = {
          title,
          synopsis,
          writer,
          category,
          tags,
          coverImage: fileUrl,
          status,
          chapters: [],
        };

        const savedStory = await createStory({ storyRepository })(newStory);
        res.status(201).json(savedStory);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    createTempStory: async (req, res) => {
      try {
        const { title, synopsis, writer, category, tags, status } = req.body;

        if (!title || !category) {
          return res
            .status(400)
            .json({ error: "Title and category are required." });
        }

        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.file.buffer;
        const uniqueFileName = `${uuidv4()}-${Date.now()}-${
          req.file.originalname
        }`;
        const result = await uploadToBytescale({
          accountId: process.env.BYTESCALE_ACCOUNT_ID,
          requestBody: file,
          metadata: {},
          querystring: {
            fileName: uniqueFileName,
            filePath: `/uploads/${uniqueFileName}`,
          },
        });

        const { fileUrl } = result;

        const newStory = {
          title,
          synopsis,
          writer,
          category,
          tags,
          coverImage: fileUrl,
          status,
          chapters: [],
        };

        const savedStory = await createTempStory({ tempStoryRepository })(
          newStory
        );
        res.status(201).json(savedStory);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    saveTempStoryToStory: async (req, res) => {
      try {
        const { tempStoryId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(tempStoryId)) {
          return res.status(400).json({ error: "Invalid temp story ID" });
        }

        const savedStory = await saveTempStoryToStory({
          tempStoryRepository,
          storyRepository,
        })(tempStoryId);

        res.status(200).json(savedStory);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    getStories: async (req, res) => {
      try {
        const stories = await storyRepository.findAll();
        res.status(200).json(stories);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    getStoryById: async (req, res) => {
      try {
        const { storyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
          return res.status(400).json({ error: "Invalid story ID" });
        }

        const story = await storyRepository.findById(storyId);
        if (!story) {
          return res.status(404).json({ error: "Story not found" });
        }

        res.status(200).json(story);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    updateStory: async (req, res) => {
      try {
        const { storyId } = req.params;
        const { title, synopsis, writer, category, tags, status, chapters } =
          req.body;

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
          return res.status(400).json({ error: "Invalid story ID" });
        }

        const existingStory = await storyRepository.findById(storyId);
        if (!existingStory) {
          return res.status(404).json({ error: "Story not found" });
        }

        let coverImageUrl = existingStory.coverImage;
        if (req.file) {
          const file = req.file.buffer;
          const uniqueFileName = `${uuidv4()}-${Date.now()}-${
            req.file.originalname
          }`;
          const result = await uploadToBytescale({
            accountId: process.env.BYTESCALE_ACCOUNT_ID,
            requestBody: file,
            metadata: {},
            querystring: {
              fileName: uniqueFileName,
              filePath: `/uploads/${uniqueFileName}`,
            },
          });

          coverImageUrl = result.fileUrl;
        }

        let parsedChapters = [];
        if (chapters) {
          try {
            parsedChapters = JSON.parse(chapters);
            if (!Array.isArray(parsedChapters)) {
              throw new Error("Chapters data is not an array");
            }
          } catch (error) {
            console.error("Error parsing chapters:", error.message);
            return res.status(400).json({ error: "Invalid chapter data" });
          }
        }

        const chapterMap = new Map();
        existingStory.chapters.forEach((chapter) => {
          chapterMap.set(chapter._id.toString(), chapter);
        });

        const updatedChapters = [];
        parsedChapters.forEach((newChapter) => {
          if (newChapter._id) {
            const existingChapter = chapterMap.get(newChapter._id.toString());
            if (existingChapter) {
              updatedChapters.push({
                ...existingChapter.toObject(),
                ...newChapter,
              });
              chapterMap.delete(newChapter._id.toString());
            }
          } else {
            updatedChapters.push(newChapter);
          }
        });

        updatedChapters.push(...Array.from(chapterMap.values()));

        const updatedStory = await storyRepository.update(storyId, {
          title,
          synopsis,
          writer,
          category,
          tags,
          status,
          coverImage: coverImageUrl,
          chapters: updatedChapters,
        });

        res.status(200).json(updatedStory);
      } catch (error) {
        console.error("Error updating story:", error.message);
        res.status(500).json({ error: error.message });
      }
    },

    deleteStory: async (req, res) => {
      try {
        const { storyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
          return res.status(400).json({ error: "Invalid story ID" });
        }

        const deletedStory = await storyRepository.delete(storyId);
        if (!deletedStory) {
          return res.status(404).json({ error: "Story not found" });
        }

        res.status(200).json({ message: "Story deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  };
};
