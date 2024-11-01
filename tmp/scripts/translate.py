#!/usr/bin/env python

import os
import requests
import json
from dotenv import load_dotenv
load_dotenv()

input_file = "./src/locales/{language}/translation.json"
output_file = "./src/locales/{language}/translation-auto.json" # TODO: should overwrite "translation.json" ...
source_language = "en"
target_languages = ["fr", "it"]

# set up Microsoft Translator API credentials
key = os.getenv("COG_SERVICE_KEY") # TODO: get COG SERVICE KEY
region = os.getenv("COG_SERVICE_REGION") # TODO: get COG SERVICE REGION
endpoint = "https://api.cognitive.microsofttranslator.com"

def translate_text(text, target_lang, source_lang=source_language):
  path = "/translate"
  url = endpoint + path
  params = {
    "api-version": "3.0",
    "from": source_lang,
    "to": target_lang
  }
  headers = {
    "Ocp-Apim-Subscription-Key": key,
    "Ocp-Apim-Subscription-Region": region,
    "Content-type": "application/json"
  }
  body = [{ "text": text }]
  
  request = requests.post(url, params=params, headers=headers, json=body)
  response = request.json()
  
  return response[0]["translations"][0]["text"]

def translate_json(input_file, output_file, target_languages):
  for lang in target_languages:

    input_file_current = input_file.format(language = lang)

    # load JSON input file
    with open(input_file_current, "r", encoding="utf-8") as f:
      data = json.load(f)
  
    translated_data = {}
    count = 0
    for key, value in data.items():
      if value == "__STRING_NOT_TRANSLATED__":
        # translate only if value is "__STRING_NOT_TRANSLATED__"
        translated_data[key] = translate_text(value, lang)
        count += 1
      else:
        # keep existing translation
        translated_data[key] = value
    
    # save translated JSON file
    output_file_current = output_file.format(language=lang)
    with open(output_file_current, "w", encoding="utf-8") as f:
      json.dump(translated_data, f, ensure_ascii=False, indent=2)
    
    print(f"Translation to {lang} completed, {count} strings translated, saved to {output_file_current}")

translate_json(input_file, output_file, target_languages)
