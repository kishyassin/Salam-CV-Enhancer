package utils


import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	vision "cloud.google.com/go/vision/apiv1"
	"google.golang.org/api/option"
)

func ExtractTextFromFile(filePath string) (string, error) {
	ctx := context.Background()

	// Use the JSON credentials file
	client, err := vision.NewImageAnnotatorClient(ctx, option.WithCredentialsFile("./daring-fin-448723-d0-537da1216b22.json"))
	if err != nil {
		return "", fmt.Errorf("failed to create client: %v", err)
	}
	defer client.Close()

	fileBytes, err := ioutil.ReadFile(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %v", err)
	}

	image, err := vision.NewImageFromReader(bytes.NewReader(fileBytes))
	if err != nil {
		return "", fmt.Errorf("failed to create image from reader: %v", err)
	}

	annotations, err := client.DetectTexts(ctx, image, nil, 1)
	if err != nil {
		return "", fmt.Errorf("failed to detect texts: %v", err)
	}

	if len(annotations) == 0 {
		return "", nil
	}

	return annotations[0].Description, nil
}