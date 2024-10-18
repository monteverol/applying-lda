import json
import os
import pandas as pd
import re
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import nltk
import logging
import gensim
from gensim import corpora

nltk.download('stopwords')

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS globally for all routes

# Enable detailed logging for debugging
logging.basicConfig(level=logging.DEBUG)

# Initialize NLTK resources
lemmatizer = WordNetLemmatizer()
nltk_stop_words = set(stopwords.words('english'))

# Custom stop words
custom_stop_words = {
    'generate', 'movie', 'movies', 'song', 'songs', 'show', 'list', 'recommend',
    'suggest', 'book', 'books', 'game', 'games', 'film', 'watch', 'something',
    'series', 'give', 'find', 'tell', 'about', 'please', 'create', 'top', 'best',
    'good', 'popular', 'the', 'a', 'an', 'of', 'to', 'for'
}
all_stop_words = nltk_stop_words.union(custom_stop_words)

# Load datasets
movies = pd.read_csv('backend/data/cleaned/movies_cleaned.csv')
songs = pd.read_csv('backend/data/cleaned/songs_cleaned.csv')
books = pd.read_csv('backend/data/cleaned/books_cleaned.csv')
games = pd.read_csv('backend/data/cleaned/games_cleaned.csv')

print(f"Loaded {len(movies)} movies, {len(songs)} songs, {len(books)} books, {len(games)} games")

# Directory for saving playlists
PLAYLISTS_DIR = 'backend/data/playlists'
os.makedirs(PLAYLISTS_DIR, exist_ok=True)

# Preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = re.sub(r'[^\w\s]', '', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    words = text.split()
    processed_words = [lemmatizer.lemmatize(word) for word in words if word not in all_stop_words]
    return ' '.join(processed_words)

# Preprocess description columns
for dataset in [movies, songs, books, games]:
    dataset['description_cleaned'] = dataset['description'].fillna('').apply(preprocess_text)

# Save playlist locally
def save_playlist(playlist):
    playlist_file = os.path.join(PLAYLISTS_DIR, f"playlist_{playlist['id']}.json")
    with open(playlist_file, 'w') as f:
        json.dump(playlist, f, indent=4)

# Load all playlists
def load_playlists():
    playlists = []
    for filename in os.listdir(PLAYLISTS_DIR):
        if filename.endswith('.json'):
            with open(os.path.join(PLAYLISTS_DIR, filename), 'r') as f:
                playlists.append(json.load(f))
    return playlists

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
import os

app = Flask(__name__)
CORS(app)

PLAYLISTS_DIR = 'backend/data/playlists'
os.makedirs(PLAYLISTS_DIR, exist_ok=True)

# Load all playlists from disk
def load_playlists():
    playlists = []
    for filename in os.listdir(PLAYLISTS_DIR):
        if filename.endswith('.json'):
            with open(os.path.join(PLAYLISTS_DIR, filename), 'r') as f:
                playlists.append(json.load(f))
    return playlists

# Save a playlist back to disk
def save_playlist(playlist):
    playlist_file = os.path.join(PLAYLISTS_DIR, f"playlist_{playlist['id']}.json")
    with open(playlist_file, 'w') as f:
        json.dump(playlist, f, indent=4)
        
# Delete a playlist by ID (from local folder)
@app.route('/api/delete-playlist', methods=['DELETE'])
@cross_origin()
def delete_playlist():
    data = request.json
    playlist_id = data.get('playlist_id')

    # Locate and delete the playlist file
    playlist_file = os.path.join(PLAYLISTS_DIR, f"playlist_{playlist_id}.json")
    if os.path.exists(playlist_file):
        os.remove(playlist_file)
        return jsonify({'message': 'Playlist deleted successfully'}), 200
    else:
        return jsonify({'error': 'Playlist not found'}), 404


# Add an item to a playlist by ID
@app.route('/api/add-item', methods=['POST'])
@cross_origin()
def add_item_to_playlist():
    data = request.json
    playlist_id = data.get('playlist_id')
    new_item = data.get('item')

    # Load the current playlist
    playlists = load_playlists()
    playlist = next((p for p in playlists if p['id'] == playlist_id), None)

    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404

    # Add the new item to the playlist
    playlist['items'].append(new_item)
    save_playlist(playlist)

    return jsonify({'message': 'Item added successfully', 'playlist': playlist})


# Conditional date parsing based on dataset type
def parse_date(date_str, dataset_type):
    try:
        if dataset_type == 'games':
            return pd.to_datetime(date_str, format='%b %d, %Y', errors='coerce')
        elif dataset_type == 'movies':
            return pd.to_datetime(date_str, errors='coerce')
        elif dataset_type == 'books':
            return pd.to_datetime(date_str, format='%Y', errors='coerce')
        elif dataset_type == 'songs':
            return pd.to_datetime(date_str, format='%Y', errors='coerce')
    except Exception as e:
        logging.error(f"Date parsing error: {e}")
        return pd.NaT


# Extract topics using LDA
def extract_topics_lda(texts, num_topics=5, num_words=10):
    try:
        # Tokenize the text
        texts = [text.split() for text in texts]

        # Create a dictionary and a corpus for LDA
        dictionary = corpora.Dictionary(texts)
        corpus = [dictionary.doc2bow(text) for text in texts]

        # Train the LDA model
        lda_model = gensim.models.ldamodel.LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=10)

        # Get the topics
        topics = lda_model.show_topics(num_topics=num_topics, num_words=num_words, formatted=False)

        # Extract top terms for each topic
        top_terms = []
        for topic in topics:
            top_terms.extend([term for term, _ in topic[1]])

        return list(set(top_terms)), 0  # Success
    except Exception as e:
        logging.error(f"Error extracting topics with LDA: {e}")
        return [], 1  # Error

# Generate recommendations and extract topics using LDA
def get_recommendations_with_lda(prompt, data, dataset_type, column='description_cleaned', top_n=20):
    try:
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=5000)
        tfidf_matrix = vectorizer.fit_transform(data[column].tolist())
        prompt_vector = vectorizer.transform([preprocess_text(prompt)])

        # Compute cosine similarities
        cosine_similarities = cosine_similarity(prompt_vector, tfidf_matrix).flatten()

        # Add similarities to the dataset
        data = data.copy()
        data['similarity'] = cosine_similarities

        # Parse dates based on dataset type
        if 'date' in data.columns:
            data['date'] = data['date'].apply(lambda x: parse_date(x, dataset_type))

        # Sort by similarity and date (most recent first)
        sorted_data = data.sort_values(by=['similarity', 'date'], ascending=[False, False])

        # Get the top N recommendations
        recommendations = sorted_data.head(top_n).drop_duplicates(subset='title')

        # Combine text for topic extraction using LDA
        combined_texts = recommendations[column].tolist()
        top_terms, lda_status = extract_topics_lda(combined_texts)

        if lda_status == 0:
            return recommendations.to_dict(orient='records'), top_terms, 0  # Success
        else:
            return [], [], 1  # LDA error

    except Exception as e:
        logging.error(f"Error generating recommendations with LDA: {e}")
        return [], [], 1  # Error


# Routes with CORS enabled

@app.route('/api/save-playlist', methods=['POST'])
@cross_origin()
def save_playlist_endpoint():
    playlist = request.json
    save_playlist(playlist)
    return jsonify({'message': 'Playlist saved successfully'})

@app.route('/api/get-playlists', methods=['GET'])
@cross_origin()
def get_playlists():
    playlist_type = request.args.get('type', '').lower()
    playlists = load_playlists()
    if playlist_type:
        playlists = [p for p in playlists if p.get('type') == playlist_type]
    return jsonify(playlists)

@app.route('/api/generate-playlist', methods=['POST'])
@cross_origin()
def generate_playlist():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        playlist_type = data.get('type', '').lower()

        if playlist_type == 'movies':
            recommendations, topic, status = get_recommendations_with_lda(prompt, movies, 'movies')
        elif playlist_type == 'songs':
            recommendations, topic, status = get_recommendations_with_lda(prompt, songs, 'songs')
        elif playlist_type == 'books':
            recommendations, topic, status = get_recommendations_with_lda(prompt, books, 'books')
        elif playlist_type == 'games':
            recommendations, topic, status = get_recommendations_with_lda(prompt, games, 'games')
        else:
            return jsonify({'error': 'Invalid playlist type'}), 400

        if status == 0:
            # Print or log the topics for debugging/verification
            print(f"Generated Topics: {topic}")
            logging.info(f"Generated Topics: {topic}")
            return jsonify({'playlist': recommendations, 'topic': topic})
        else:
            return jsonify({'error': 'Error generating playlist'}), 500

    except Exception as e:
        logging.error(f"Error generating playlist: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/api/search', methods=['GET'])
@cross_origin()
def search_items():
    """Search for items based on query and dataset type."""
    query = request.args.get('query', '').lower().strip()  # Get query from request
    dataset_type = request.args.get('type', '').lower().strip()  # Get dataset type

    # Select the correct dataset based on type
    if dataset_type == 'movies':
        data = movies
    elif dataset_type == 'songs':
        data = songs
    elif dataset_type == 'books':
        data = books
    elif dataset_type == 'games':
        data = games
    else:
        return jsonify({'error': 'Invalid dataset type'}), 400

    # Perform the search: titles that start with the query (case-insensitive)
    results = data[data['title'].str.lower().str.startswith(query)]

    # Debugging message
    print(f"Search results for '{query}' in '{dataset_type}': {len(results)} found")

    # Return the search result (limited to 1 item)
    return jsonify(results.head(1).to_dict(orient='records'))

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
