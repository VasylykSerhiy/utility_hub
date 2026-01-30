import { supabase } from '../src/configs/supabase';

interface PActivoRow {
  num: number;
}

async function triggerHeartbeat(): Promise<void> {
  console.log('--- Supabase Heartbeat Started ---');

  try {
    const { error: insertError } = await supabase
      .from('p_activo')
      .insert([{ num: 1 } satisfies PActivoRow]);

    if (insertError) throw insertError;

    const { data: latestRecords, error: fetchError } = await supabase
      .from('p_activo')
      .select('id')
      .order('created_at', { ascending: false })
      .range(10, 50);

    if (fetchError) throw fetchError;

    if (latestRecords && latestRecords.length > 0) {
      const idsToDelete: number[] = latestRecords.map((record: { id: number }) => record.id);

      const { error: deleteError } = await supabase.from('p_activo').delete().in('id', idsToDelete);

      if (deleteError) throw deleteError;
      console.log(`Step 2: Cleaned up ${idsToDelete.length} old heartbeat records.`);
    }

    console.log('--- Heartbeat Task Completed Successfully ---');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Status: Failed. Reason: ${message}`);
    process.exit(1);
  }
}

triggerHeartbeat();
