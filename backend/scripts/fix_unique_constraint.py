import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load env
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def run():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'talent_profiles'::regclass
            AND contype = 'u'
        """))
        
        constraints = [row[0] for row in result]
        print("Unique constraints found:", constraints)
        
        for constraint in constraints:
            if 'stage_name' in constraint or constraint == 'ix_talent_profiles_stage_name':
                print(f"Dropping constraint {constraint}...")
                conn.execute(text(f"ALTER TABLE talent_profiles DROP CONSTRAINT {constraint}"))
                conn.commit()
                print("Dropped successfully.")
        
        # In postgres, a UNIQUE INDEX might also enforce uniqueness
        result_idx = conn.execute(text("""
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE tablename = 'talent_profiles'
        """))
        for row in result_idx:
            print("Index:", row[0], "Def:", row[1])
            if 'UNIQUE' in row[1] and 'stage_name' in row[1]:
                print(f"Dropping unique index {row[0]}...")
                conn.execute(text(f"DROP INDEX {row[0]}"))
                conn.commit()
                # recreate it as non-unique
                conn.execute(text(f"CREATE INDEX ix_talent_profiles_stage_name ON talent_profiles (stage_name)"))
                conn.commit()
                print("Recreated as non-unique index.")
                
if __name__ == "__main__":
    run()
