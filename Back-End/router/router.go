package router

import (
	"kishyassin/Salam-CV-Enhancer/handler"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/ocr", handler.OCR)
}