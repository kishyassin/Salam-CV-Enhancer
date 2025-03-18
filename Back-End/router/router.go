package router

import (
	"kishyassin/Salam-CV-Enhancer/handler"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!, Welcome to Salam CV Enhancer")
	})
	app.Post("/upload", handler.UploadFile)
	app.Get("/enhancements", handler.GetEnhancements)
}