from app.database import SessionLocal, engine
from sqlalchemy import text, inspect

def migrate_roles_table():
    db = SessionLocal()
    try:
        # 1. Create 'roles' table explicitly (Raw SQL to be safe on existing DB)
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS roles (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR UNIQUE,
                    description VARCHAR
                )
            """))
            conn.commit()
        print("Created roles table.")

        # 2. Populate Roles
        roles = [
            ("user", "Regular user"),
            ("admin", "Administrator with dashboard access"),
            ("owner", "Super Admin with full control")
        ]
        
        with engine.connect() as conn:
            for name, desc in roles:
                try:
                    conn.execute(text("INSERT INTO roles (name, description) VALUES (:name, :desc)"), {"name": name, "desc": desc})
                    conn.commit()
                except Exception:
                   pass # Already exists
        print("Populated roles.")

        # 3. Add role_id column to users
        # Check if column exists first
        inspector = inspect(engine)
        columns = [c['name'] for c in inspector.get_columns('users')]
        
        if 'role_id' not in columns:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id)"))
                conn.commit()
            print("Added role_id to users.")
        
        # 4. Migrate Data
        # Map existing string roles (if any) or usage of ADMIN_EMAILS logic to IDs
        # We know: villabonagiovany@gmail.com -> Owner, giovanyvillabona@gmail.com -> Admin
        
        with engine.connect() as conn:
            # Get Role IDs
            owner_id = conn.execute(text("SELECT id FROM roles WHERE name='owner'")).scalar()
            admin_id = conn.execute(text("SELECT id FROM roles WHERE name='admin'")).scalar()
            user_id = conn.execute(text("SELECT id FROM roles WHERE name='user'")).scalar()

            # Set everyone to User first
            conn.execute(text(f"UPDATE users SET role_id = {user_id} WHERE role_id IS NULL"))
            
            # Set Admin
            conn.execute(text(f"UPDATE users SET role_id = {admin_id} WHERE email = 'giovanyvillabona@gmail.com'"))
            
            # Set Owner (Also ensures he is not just admin)
            conn.execute(text(f"UPDATE users SET role_id = {owner_id} WHERE email = 'villabonagiovany@gmail.com'"))
            
            conn.commit()
        
        print("Migrated user roles successfully.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_roles_table()
