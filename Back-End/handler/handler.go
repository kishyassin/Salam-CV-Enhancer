package handler

import (
	"kishyassin/Salam-CV-Enhancer/utils"
	"os"

	"github.com/gofiber/fiber/v2"
)

func UploadFile(c *fiber.Ctx) error {

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

	return c.JSON(fiber.Map{
		"text": text,
	})
}



//GetEnhancements is a function that returns the enhancements of the text in a language
func GetEnhancements(c *fiber.Ctx) error {
	text := c.FormValue("text")
	language := c.FormValue("language")

	if text == "" || language == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Text and language are required",
		})
	}

	enhancements, err := utils.GetEnhancements(text, language)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Unable to get enhancements",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"enhancements": enhancements,
	})
}