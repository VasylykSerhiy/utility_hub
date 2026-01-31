# Заміна лічильника / Meter replacement

## Проблема / Problem

**UA:** Коли фізично замінюють лічильник (електрика, вода, газ), новий лічильник починає з малого значення (0 або початкове). Попередній запис у БД містить останній показ **старого** лічильника (наприклад 5000 кВт·год). Система рахує різницю як `поточний − попередній` = 25 − 5000 → негативне або обрізане до 0, тобто **споживання втрачається або рахується неправильно**.

**EN:** When a meter is physically replaced, the new meter starts from a low value (0 or initial). The previous DB row holds the **old** meter's last reading (e.g. 5000 kWh). The system computes diff as `current − previous` = 25 − 5000 → negative or clamped to 0, so **consumption is lost or wrong**.

---

## Рішення / Solution

Додаємо опційні поля в таблицю `readings`:

- **Baseline (початкове значення нового лічильника)** — з якого значення рахувати різницю для **нового** лічильника в місяці заміни.  
  Формула: `diff = поточний_показ − baseline` (замість `поточний − попередній`).

- **Old final (остаточний показ старого лічильника)** — якщо заміна в середині місяця, споживання за місяць = споживання по **старому** до зняття + по **новому** після встановлення.  
  Формула: `diff = (old_final − prev) + (current − baseline)`.

Optional fields in `readings`:

- **Baseline** — value to use as “previous” for the **new** meter in the replacement month.  
  Formula: `diff = current − baseline`.

- **Old final** — final reading of the **old** meter when replacement is mid-month.  
  Formula: `diff = (old_final − prev) + (current − baseline)`.

---

## Міграція БД / DB migration

Виконай у Supabase SQL Editor (або створи міграцію):

```sql
-- Add optional columns for meter replacement
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
```

Після цього потрібно оновити view `view_readings_stats`, щоб `prev_*` і `diff_*` враховували `*_baseline` і `*_old_final`. Якщо view створений як щось на кшталт:

```sql
-- Приклад логіки для одного поля (вода). Аналогічно для gas, electricity_single, electricity_day, electricity_night.
-- prev_water залишається LAG(water).
-- diff_water:
--   якщо water_old_final задано: (water_old_final - prev_water) + (water - COALESCE(water_baseline, 0))
--   інакше: water - COALESCE(water_baseline, prev_water)
```

Точний текст view залежить від поточного визначення в твоєму проєкті. У коді бекенду можна тимчасово рахувати `diff` у сервісі, якщо з view не передаються нові колонки.

---

## Як користувач вводить дані / User flow

1. Вибір дати (місяць заміни).
2. Опція: «Це показ після заміни лічильника» (окремо для світла / вода / газ або один прапорець).
3. Якщо заміна:
   - **Поточний показ** — показ **нового** лічильника на кінець періоду.
   - **Початкове значення нового (baseline)** — з якого почав новий лічильник (зазвичай 0).
   - За потреби: **Остаточний показ старого (old final)** — останній показ знятого лічильника (щоб коректно порахувати споживання за старий + новий у тому ж місяці).

Після збереження система рахує споживання за формулами вище і зберігає його в історії та на дашборді.
