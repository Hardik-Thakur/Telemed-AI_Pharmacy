import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load the dataset
df = pd.read_csv('drugs.csv')

# Initialize the TF-IDF Vectorizer
tfidf = TfidfVectorizer(stop_words='english')

# Combine relevant columns into a single string for each drug
df['combined'] = df['ActiveIngredient'] + ' ' + df['Usage']

# Fit and transform the data
tfidf_matrix = tfidf.fit_transform(df['combined'])

# Compute the similarity matrix
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

def recommend_drugs(drug_name, cosine_sim=cosine_sim):
    # Get index of the drug
    idx = df.index[df['DrugName'] == drug_name].tolist()
    if not idx:
        return []
    idx = idx[0]
    
    # Get similarity scores for the drug
    sim_scores = list(enumerate(cosine_sim[idx]))
    
    # Sort drugs based on similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get the indices of the top similar drugs
    drug_indices = [i[0] for i in sim_scores[1:4]]  # Get top 3 recommendations
    
    # Return the top similar drugs
    return df['DrugName'].iloc[drug_indices].tolist()

# Example usage
if __name__ == "__main__":
    print(recommend_drugs('Aspirin'))
