package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

const groqAPIKey = "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"
const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions"

type GroqRequest struct {
	Model    string        `json:"model"`
	Messages []GroqMessage `json:"messages"`
}

type GroqMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GroqResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// Define the structure for enhanced JSON
type EnhancedJSON struct {
	CurrentText  string                 `json:"current_text"`
	EnhancedText map[string]interface{} `json:"enhanced_text"`
}

func EnhanceTextWithGroq(text, language string) ([]map[string]interface{}, error) {
	// Construct the prompt based on the language
	var prompt string
	if language == "en" {
		prompt = fmt.Sprintf("Return me an array of recommended enhancements on this CV text as a valid JSON array. Each object must have the keys: 'section', 'improvement', and 'description'. %s", text)
	} else {
		prompt = fmt.Sprintf("Retournez-moi un tableau d'améliorations recommandées sur ce texte de CV en tant que tableau JSON valide. Chaque objet doit avoir les clés : 'section', 'improvement' et 'description'. %s", text)
	}

	// Debug: Log the constructed prompt
	fmt.Printf("Debug: Constructed prompt: %s\n", prompt)

	// Create the Groq API request payload
	requestBody := GroqRequest{
		Model: "llama-3.3-70b-versatile",
		Messages: []GroqMessage{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	}

	// Marshal the request body to JSON
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request body: %w", err)
	}

	// Make the HTTP POST request to the Groq API
	req, err := http.NewRequest("POST", groqEndpoint, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", groqAPIKey))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send HTTP request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("received non-OK HTTP status: %s", resp.Status)
	}

	// Parse the Groq API response
	var groqResponse GroqResponse
	rawResponse := new(bytes.Buffer)
	if _, err := rawResponse.ReadFrom(resp.Body); err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Debug: Log the raw response content
	fmt.Printf("Debug: Raw response content: %s\n", rawResponse.String())

	// Attempt to decode the response as JSON
	if err := json.Unmarshal(rawResponse.Bytes(), &groqResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response body: %w", err)
	}

	// Form the response as a unique static JSON array
	var enhancements []map[string]interface{}
	for _, choice := range groqResponse.Choices {
		// Extract the content
		content := choice.Message.Content

		// Debug: Log the raw content
		fmt.Printf("Debug: Raw content: %s\n", content)

		// Remove code block markers (e.g., ```json and ```)
		start := "```json"
		end := "```"
		startIndex := bytes.Index([]byte(content), []byte(start))
		endIndex := bytes.LastIndex([]byte(content), []byte(end))
		if startIndex != -1 && endIndex != -1 && startIndex < endIndex {
			content = content[startIndex+len(start) : endIndex]
		}

		// Debug: Log the cleaned content
		fmt.Printf("Debug: Cleaned content: %s\n", content)

		// Parse the cleaned JSON array or extract from "data" key
		var parsedContent map[string]interface{}
		if err := json.Unmarshal([]byte(content), &parsedContent); err == nil {
			if data, ok := parsedContent["data"].([]interface{}); ok {
				for _, item := range data {
					if enhancement, ok := item.(map[string]interface{}); ok {
						// Map to fixed schema
						enhancements = append(enhancements, map[string]interface{}{
							"section":     enhancement["section"],
							"improvement": enhancement["amélioration"], // Map French key to English
							"description": enhancement["description"],
						})
					}
				}
				continue
			}
		}

		// Fallback: Parse directly as an array
		var parsedEnhancements []map[string]interface{}
		if err := json.Unmarshal([]byte(content), &parsedEnhancements); err != nil {
			return nil, fmt.Errorf("failed to parse enhancements: %w", err)
		}
		for _, enhancement := range parsedEnhancements {
			// Map to fixed schema
			enhancements = append(enhancements, map[string]interface{}{
				"section":     enhancement["section"],
				"improvement": enhancement["amélioration"], // Map French key to English
				"description": enhancement["description"],
			})
		}
	}

	return enhancements, nil
}
