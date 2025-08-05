-- Create kirim_data table with correct column structure
CREATE TABLE IF NOT EXISTS kirim_data (
    id BIGSERIAL PRIMARY KEY,
    korxona_nomi TEXT NOT NULL,
    inn TEXT NOT NULL,
    tel_raqami TEXT,
    ismi TEXT,
    xizmat_turi TEXT,
    filial_nomi TEXT NOT NULL,
    ishchilar_kesimi TEXT DEFAULT '',
    oldingi_oylar_soni INTEGER DEFAULT 0,
    oldingi_oylar_summasi NUMERIC(15,2) DEFAULT 0,
    bir_oylik_hisoblangan_summa NUMERIC(15,2) DEFAULT 0,
    jami_qarz_dorlik NUMERIC(15,2) DEFAULT 0,
    tolandi_jami NUMERIC(15,2) DEFAULT 0,
    tolandi_naqd NUMERIC(15,2) DEFAULT 0,
    tolandi_prechisleniya NUMERIC(15,2) DEFAULT 0,
    tolandi_karta NUMERIC(15,2) DEFAULT 0,
    qoldiq NUMERIC(15,2) DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chiqim_data table with correct column structure
CREATE TABLE IF NOT EXISTS chiqim_data (
    id BIGSERIAL PRIMARY KEY,
    sana TEXT NOT NULL,
    nomi TEXT NOT NULL,
    filial_nomi TEXT NOT NULL,
    chiqim_nomi TEXT NOT NULL,
    avvalgi_oylardan NUMERIC(15,2) DEFAULT 0,
    bir_oylik_hisoblangan NUMERIC(15,2) DEFAULT 0,
    jami_hisoblangan NUMERIC(15,2) DEFAULT 0,
    tolangan NUMERIC(15,2) DEFAULT 0,
    qoldiq_qarz_dorlik NUMERIC(15,2) DEFAULT 0,
    qoldiq_avans NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    frequency TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add ishchilar_kesimi column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'kirim_data' AND column_name = 'ishchilar_kesimi') THEN
        ALTER TABLE kirim_data ADD COLUMN ishchilar_kesimi TEXT DEFAULT '';
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kirim_data_created_at ON kirim_data(created_at);
CREATE INDEX IF NOT EXISTS idx_kirim_data_filial_nomi ON kirim_data(filial_nomi);
CREATE INDEX IF NOT EXISTS idx_chiqim_data_created_at ON chiqim_data(created_at);
CREATE INDEX IF NOT EXISTS idx_chiqim_data_filial_nomi ON chiqim_data(filial_nomi);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Insert sample data for testing (optional)
INSERT INTO kirim_data (
    korxona_nomi, inn, tel_raqami, ismi, xizmat_turi, filial_nomi, ishchilar_kesimi,
    oldingi_oylar_soni, oldingi_oylar_summasi, bir_oylik_hisoblangan_summa,
    jami_qarz_dorlik, tolandi_jami, tolandi_naqd, tolandi_prechisleniya, tolandi_karta, qoldiq
) VALUES 
    ('Test Korxona', '123456789', '+998901234567', 'Test Ism', 'Test Xizmat', 'Zarkent Filiali', 'Umumiy',
     2, 500000, 300000, 800000, 400000, 200000, 100000, 100000, 400000),
    ('Test Korxona 2', '987654321', '+998907654321', 'Test Ism 2', 'Test Xizmat 2', 'Nabrejniy filiali', 'Maxsus',
     1, 300000, 200000, 500000, 250000, 150000, 50000, 50000, 250000)
ON CONFLICT DO NOTHING;

INSERT INTO chiqim_data (
    sana, nomi, filial_nomi, chiqim_nomi, avvalgi_oylardan, bir_oylik_hisoblangan,
    jami_hisoblangan, tolangan, qoldiq_qarz_dorlik, qoldiq_avans
) VALUES 
    ('01/01/2024', 'Test Xodim', 'Zarkent Filiali', 'Oylik maosh', 100000, 150000, 250000, 200000, 50000, 0),
    ('01/01/2024', 'Test Xodim 2', 'Nabrejniy filiali', 'Bonus', 50000, 100000, 150000, 150000, 0, 0)
ON CONFLICT DO NOTHING;
