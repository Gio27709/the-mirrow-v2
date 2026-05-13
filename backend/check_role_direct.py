import sqlite3
import os

db_path = "sql_app.db"

if not os.path.exists(db_path):
    print(f"Error: Database not found at {os.path.abspath(db_path)}")
    # Try looking in backend/ just in case
    db_path = "backend/sql_app.db"
    if not os.path.exists(db_path):
         print(f"Error: Database not found at {os.path.abspath(db_path)} either.")
         exit(1)

print(f"Using database: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    email = "villabonagiovany@gmail.com"
    
    # Check if user exists
    cursor.execute("SELECT id, email, role_id, is_active FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    
    if user:
        user_id, email, role_id, is_active = user
        print(f"User ID: {user_id}")
        print(f"Email: {email}")
        print(f"Is Active: {is_active}")
        print(f"Role ID: {role_id}")
        
        # Get Role Name
        if role_id:
            cursor.execute("SELECT name FROM roles WHERE id = ?", (role_id,))
            role = cursor.fetchone()
            if role:
                print(f"Role Name: {role[0]}")
            else:
                print(f"Role ID {role_id} found in user, but not in roles table!")
        else:
            print("Role ID is NULL (User has no role!)")
            
    else:
        print(f"User with email {email} not found.")

    conn.close()

except Exception as e:
    print(f"Error: {e}")
