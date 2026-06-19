from sqlalchemy import text
from core.database import engine

def create_tables():
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS connected_accounts (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                platform TEXT NOT NULL,
                access_token TEXT,
                refresh_token TEXT,
                UNIQUE(user_id, platform)
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS scan_results (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                platform TEXT NOT NULL,
                item_type TEXT,
                item_id TEXT,
                metadata JSONB,
                deleted_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, item_id)
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS broker_progress (
                user_id TEXT NOT NULL,
                broker_id TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                PRIMARY KEY(user_id, broker_id)
            )
        """))
        conn.commit()
        print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()