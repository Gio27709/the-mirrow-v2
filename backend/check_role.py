from app.database import SessionLocal
from app.models import User

def check_user_role(email):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User: {user.email}")
            print(f"Role: {user.role}")
            print(f"Is Active: {user.is_active}")
        else:
            print(f"User with email {email} not found.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_user_role("villabonagiovany@gmail.com")
