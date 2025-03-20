package main

import (
	"log"
	"os"
	"github.com/gofiber/fiber/v2"
	"kishyassin/Salam-CV-Enhancer/router"
)

func main() {
	// Create a new Fiber app
	app := fiber.New()

	// Set up the routes with the database instance
	router.SetupRoutes(app)

	// Start the server
	port := os.Getenv("APP_PORT") // Railway assigns this dynamically
	if port == "" {
		port = "3001" // Default fallback
	}

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
