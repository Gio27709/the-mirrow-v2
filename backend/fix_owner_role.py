import sqlite3
import os

db_path = "sql_app.db"

print(f"Using database: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Ensure Roles Exist
    roles = ["owner", "admin", "user"]
    for role_name in roles:
        cursor.execute("SELECT id FROM roles WHERE name = ?", (role_name,))
        existing = cursor.fetchone()
        if not existing:
            print(f"Creating role: {role_name}")
            cursor.execute("INSERT INTO roles (name, description) VALUES (?, ?)", (role_name, f"System {role_name}"))
        else:
            print(f"Role exists: {role_name} (ID: {existing[0]})")
            
    conn.commit()
    
    # 2. Assign Owner Role
    email = "villabonagiovany@gmail.com"
    
    # Get Owner Role ID
    cursor.execute("SELECT id FROM roles WHERE name = 'owner'")
    owner_role_id = cursor.fetchone()[0]
    
    # Update User
    cursor.execute("UPDATE users SET role_id = ? WHERE email = ?", (owner_role_id, email))
    
    if cursor.rowcount > 0:
        print(f"SUCCESS: Assigned 'owner' role (ID: {owner_role_id}) to user {email}")
    else:
        print(f"ERROR: User {email} not found!")

    conn.commit()
    conn.close()

except Exception as e:
    print(f"Error: {e}")
