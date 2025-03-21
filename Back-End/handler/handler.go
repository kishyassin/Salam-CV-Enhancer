package handler

import (
	"kishyassin/Salam-CV-Enhancer/utils"
	"os"

	"github.com/gofiber/fiber/v2"
)

func UploadFile(c *fiber.Ctx) error {
	language := c.FormValue("language")
	if language == "" {
		language = "en"
	}
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File is required",
		})
	}

	filePath := "./uploads/" + file.Filename

	// Ensure the directory exists
	if err := os.MkdirAll("./uploads", os.ModePerm); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Unable to create directory",
		})
	}

	if err := c.SaveFile(file, filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Unable to save file",
		})
	}

	// Extract text from the file
	text, err := utils.ExtractTextFromFile(filePath)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Unable to extract text",
			"message": err.Error(),
		})
	}

	// Get enhancements of the text
	enhancements, err := utils.EnhanceTextWithGroq(text, language)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Unable to get enhancements",
			"message": err.Error(),
		})
	}

	// Return the enhancements array
	return c.JSON(fiber.Map{
		"enhancements": enhancements,
		"text":		 text,
		"language":	 language,
	})
}
