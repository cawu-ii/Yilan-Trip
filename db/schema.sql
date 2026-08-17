-- 宜蘭羅東小旅行 schema (Turso / libSQL, SQLite dialect)

CREATE TABLE IF NOT EXISTS people (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS itinerary_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  day         INTEGER NOT NULL CHECK (day IN (1,2)),
  sort_order  INTEGER NOT NULL,
  time        TEXT,
  title       TEXT NOT NULL,
  location    TEXT,
  map_url     TEXT,
  note        TEXT,
  created_by  INTEGER NOT NULL REFERENCES people(id),
  updated_by  INTEGER REFERENCES people(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_itinerary_day_sort ON itinerary_items(day, sort_order);

CREATE TABLE IF NOT EXISTS expenses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  day         INTEGER NOT NULL CHECK (day IN (1,2)),
  title       TEXT NOT NULL,
  amount      INTEGER NOT NULL CHECK (amount > 0),
  paid_by     INTEGER NOT NULL REFERENCES people(id),
  split_type  TEXT NOT NULL CHECK (split_type IN ('equal','custom')),
  created_by  INTEGER NOT NULL REFERENCES people(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_expenses_day ON expenses(day);

CREATE TABLE IF NOT EXISTS expense_participants (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  expense_id    INTEGER NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  person_id     INTEGER NOT NULL REFERENCES people(id),
  share_amount  INTEGER NOT NULL CHECK (share_amount >= 0),
  UNIQUE(expense_id, person_id)
);
CREATE INDEX IF NOT EXISTS idx_participants_expense ON expense_participants(expense_id);
CREATE INDEX IF NOT EXISTS idx_participants_person  ON expense_participants(person_id);

-- Records an actual repayment between two people (e.g. a bank transfer to
-- settle up). Nets against the pairwise debt computed from expenses so
-- "我的結算" reflects money that's already changed hands.
CREATE TABLE IF NOT EXISTS settlement_payments (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  from_person_id  INTEGER NOT NULL REFERENCES people(id),
  to_person_id    INTEGER NOT NULL REFERENCES people(id),
  amount          INTEGER NOT NULL CHECK (amount > 0),
  created_by      INTEGER NOT NULL REFERENCES people(id),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_settlement_payments_pair ON settlement_payments(from_person_id, to_person_id);

CREATE TABLE IF NOT EXISTS food_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category    TEXT NOT NULL CHECK (category IN ('night_market','restaurant','souvenir')),
  name        TEXT NOT NULL,
  note        TEXT,
  map_url     TEXT,
  visited     INTEGER NOT NULL DEFAULT 0 CHECK (visited IN (0,1)),
  created_by  INTEGER NOT NULL REFERENCES people(id),
  updated_by  INTEGER REFERENCES people(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
