import sys
import psycopg2

def test_connection():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="admin123"
        )
        print("SUCCESS: Connected to PostgreSQL database 'postgres'")
        
        # Create the specific database for the app if it doesn't exist?
        # For now just checking connection.
        
        conn.close()
    except Exception as e:
        print(f"ERROR: Could not connect to PostgreSQL. {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_connection()
