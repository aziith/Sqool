from google import genai

client = genai.Client(api_key="AIzaSyACF5DBwb8m3wBc4ZZWR5YAr8Ozh-CiezA")

response = client.models.generate_content(
    model="gemini-1.5-flash",
    contents="Explain quantum physics simply"
)

print(response.text)