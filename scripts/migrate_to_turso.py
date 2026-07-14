import sqlite3
import json
import urllib.request
import os

db_path = r'd:\Informatika\Semester 6\HMTI\focus-app.backend-master\focus-app.backend-master\database\database.sqlite'
turso_url = 'https://hmti-database-jossmulalinda.aws-ap-northeast-1.turso.io'
turso_token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQwNDAyNjAsImlkIjoiMDE5ZjYxMTAtNWYwMS03MWQzLWIyMjQtM2Y3NTA2NDJlZTE1Iiwia2lkIjoiWFVROGt5aVhvNlpFUjY0VndlYlFRQWlTVXlFYm1WV2dVWk13Q0JORTZXRSIsInJpZCI6IjM2NzA5NzhjLWI4OTctNDcwMC05MDY1LTRjZjk1YjJhNzMxOCJ9.D8S_xHqU9N7alHWkR0_1MWMLQAkRqDfueKrorsOCC2bVxb_P7xJKc-rrnEFHmXoPdq_kDymtnwqR9XnXXLFiAw'

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

tables = ['users', 'berita', 'galeri', 'projects', 'bidang', 'divisi', 'pengurus', 'partners', 'events']

def execute_turso(statements):
    url = f"{turso_url}/v2/pipeline"
    payload = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": stmt["sql"],
                    "args": stmt.get("args", [])
                }
            } for stmt in statements
        ]
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {turso_token}',
            'Content-Type': 'application/json'
        },
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode('utf-8')
            return json.loads(res_data)
    except Exception as e:
        print("Error executing Turso batch:", e)
        return None

# Step 1: Get Create Table SQLs
statements = []
for table in tables:
    cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{table}'")
    row = cursor.fetchone()
    if row and row['sql']:
        sql = row['sql']
        statements.append({"sql": f"DROP TABLE IF EXISTS {table}"})
        statements.append({"sql": sql})

print(f"Creating {len(tables)} tables on Turso...")
res = execute_turso(statements)
print("Create tables result:", "SUCCESS" if res else "FAILED")

# Step 2: Migrate data
data_statements = []
for table in tables:
    cursor.execute(f"SELECT * FROM {table}")
    rows = cursor.fetchall()
    if not rows:
        continue
    
    col_names = rows[0].keys()
    cols_str = ", ".join([f'"{c}"' for c in col_names])
    placeholders = ", ".join(["?"] * len(col_names))
    
    for row in rows:
        vals = []
        for val in row:
            if val is None:
                vals.append({"type": "null"})
            elif isinstance(val, int):
                vals.append({"type": "integer", "value": str(val)})
            elif isinstance(val, float):
                vals.append({"type": "float", "value": val})
            else:
                vals.append({"type": "text", "value": str(val)})
                
        data_statements.append({
            "sql": f'INSERT INTO "{table}" ({cols_str}) VALUES ({placeholders})',
            "args": vals
        })

print(f"Migrating {len(data_statements)} data rows to Turso...")
# Batch in chunks of 50
chunk_size = 50
for i in range(0, len(data_statements), chunk_size):
    chunk = data_statements[i:i + chunk_size]
    res = execute_turso(chunk)
    print(f"Migrated batch {i//chunk_size + 1}/{-(-len(data_statements)//chunk_size)}: {'SUCCESS' if res else 'FAILED'}")

print("✨ Database Migration to Turso Finished Successfully!")
