package utils

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"github.com/ledongthuc/pdf"
	vision "cloud.google.com/go/vision/apiv1"
	"google.golang.org/api/option"
	
)

func ExtractTextFromFile(filePath string) (string, error) {
	// Check if the file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return "", fmt.Errorf("file does not exist: %s", filePath)
	}

	ext := strings.ToLower(filepath.Ext(filePath))
	if ext == ".pdf" {
		// Handle PDF files
		return extractTextFromPDF(filePath)
	}

	// Handle image files
	return extractTextFromImage(filePath)
}

func extractTextFromImage(filePath string) (string, error) {
	ctx := context.Background()

	// Initialize Google Vision client
	client, err := vision.NewImageAnnotatorClient(ctx, option.WithCredentialsFile("./daring-fin-448723-d0-537da1216b22.json"))
	if err != nil {
		return "", fmt.Errorf("failed to create Google Vision client: %v", err)
	}
	defer client.Close()

	// Read the image file
	fileBytes, err := os.ReadFile(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to read image file: %v", err)
	}

	// Create an image object for Google Vision
	image, err := vision.NewImageFromReader(bytes.NewReader(fileBytes))
	if err != nil {
		return "", fmt.Errorf("failed to create image object: %v", err)
	}

	// Detect text in the image
	annotations, err := client.DetectTexts(ctx, image, nil, 1)
	if err != nil {
		return "", fmt.Errorf("failed to detect text in image: %v", err)
	}

	// Return the detected text or an empty string if no text is found
	if len(annotations) == 0 {
		return "", nil
	}

	return annotations[0].Description, nil
}
func extractTextFromPDF(filePath string) (string, error) {
	f, r, err := pdf.Open(filePath)
	if err != nil {
		return "", err
	}
	defer f.Close()

	var extractedText string
	totalPages := r.NumPage()
	for i := 1; i <= totalPages; i++ {
		textReader, err := r.GetPlainText()
		if err != nil {
			return "", err
		}
		buf := new(bytes.Buffer)
		_, err = buf.ReadFrom(textReader)
		if err != nil {
			return "", err
		}
		extractedText += buf.String()
	}

	return extractedText, nil
}
