package utils

import (
	"encoding/json"
	"os/exec"
)

func GetEnhancements(text string, language string) (string, error) {
	cmd := exec.Command("./utils/microservice/EnhancementOCR.exe", text, language)
	output, err := cmd.Output()
	if err != nil {
		return "", err
	}

	var result []map[string]string
	err = json.Unmarshal(output, &result)
	if err != nil {
		return "", err
	}

	jsonResult, err := json.Marshal(result)
	if err != nil {
		return "", err
	}

	return string(jsonResult), nil
}
