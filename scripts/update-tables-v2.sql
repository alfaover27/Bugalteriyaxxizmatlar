-- Add the missing ishchilar_kesimi column to kirim_data table
ALTER TABLE kirim_data ADD COLUMN IF NOT EXISTS ishchilar_kesimi VARCHAR(255) DEFAULT '';

-- Update existing records to have a default value
UPDATE kirim_data SET ishchilar_kesimi = 'Umumiy' WHERE ishchilar_kesimi IS NULL OR ishchilar_kesimi = '';
