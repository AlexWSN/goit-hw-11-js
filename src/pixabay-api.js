import axios from "axios";

const API_KEY = "26152467-ce176253313c2a5b3a7419bf4"; // Cheia API 
const BASE_URL = "https://pixabay.com/api/";

export async function fetchImages(query, page = 1, perPage = 40) {
  const params = {
    key: API_KEY,           
    q: query,               
    image_type: "photo",    
    orientation: "horizontal", 
    safesearch: true,      
    page,                   
    per_page: perPage,      
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data; // Returnează doar datele utile
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}
