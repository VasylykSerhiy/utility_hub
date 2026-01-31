-- UA: Міграція для підтримки заміни лічильника (baseline / old_final).
-- EN: Migration for meter replacement support (baseline / old_final).
-- Виконай у Supabase SQL Editor / Run in Supabase SQL Editor.

ALTER TABLE readings
  ADD COLUMN IF NOT EXISTS electricity_baseline_single numeric,
  ADD COLUMN IF NOT EXISTS electricity_baseline_day numeric,
  ADD COLUMN IF NOT EXISTS electricity_baseline_night numeric,
  ADD COLUMN IF NOT EXISTS electricity_old_final_single numeric,
  ADD COLUMN IF NOT EXISTS electricity_old_final_day numeric,
  ADD COLUMN IF NOT EXISTS electricity_old_final_night numeric,
  ADD COLUMN IF NOT EXISTS water_baseline numeric,
  ADD COLUMN IF NOT EXISTS water_old_final numeric,
  ADD COLUMN IF NOT EXISTS gas_baseline numeric,
  ADD COLUMN IF NOT EXISTS gas_old_final numeric;

-- View view_readings_stats: якщо він будується як SELECT r.*, LAG(...) AS prev_*, ... FROM readings r,
-- то нові колонки автоматично потрапляють у результат. Розрахунок diff при заміні лічильника
-- виконується в бекенді (mapReadingToFrontend, dashboard calculateCosts), тому view можна не змінювати.
--
-- If view_readings_stats is built as SELECT r.*, LAG(...) AS prev_*, ... FROM readings r,
-- the new columns are included automatically. Diff for replacement is computed in the backend.
