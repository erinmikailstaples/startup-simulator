import os
import sqlite3
import sys

# Add the parent directory to the path to import from config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import settings from the config file
from backend.config import settings

def init_db():
    """Initialize the database with the schema from models.sql."""
    # Create the database directory if it doesn't exist
    db_dir = os.path.dirname(settings.DATABASE_URL.replace('sqlite:///', ''))
    os.makedirs(db_dir, exist_ok=True)
    
    # Get the database path from the URL
    db_path = settings.DATABASE_URL.replace('sqlite:///', '')
    
    # Get the path to the SQL schema file
    schema_path = os.path.join(os.path.dirname(__file__), 'models.sql')
    
    # Read the schema from the file
    with open(schema_path, 'r') as f:
        schema = f.read()
    
    # Connect to the database and execute the schema
    conn = sqlite3.connect(db_path)
    conn.executescript(schema)
    conn.commit()
    conn.close()
    
    print(f"Database initialized at {db_path}")

if __name__ == "__main__":
    init_db() 