import { supabase } from "./supabase"

export interface KirimData {
  id?: number
  korxona_nomi: string
  inn: string
  tel_raqami: string
  ismi: string
  xizmat_turi: string
  filial_nomi: string
  oldingi_oylar_soni: number
  oldingi_oylar_summasi: number
  bir_oylik_hisoblangan_summa: number
  jami_qarz_dorlik: number
  tolandi_jami: number
  tolandi_naqd: number
  tolandi_prechisleniya: number
  tolandi_karta: number
  qoldiq: number
  last_updated: string
  created_at?: string
}

export interface ChiqimData {
  id?: number
  sana: string
  nomi: string
  filial_nomi: string
  chiqim_nomi: string
  avvalgi_oylardan: number
  bir_oylik_hisoblangan: number
  jami_hisoblangan: number
  tolangan: number
  qoldiq_qarz_dorlik: number
  qoldiq_avans: number
  created_at?: string
}

export interface NotificationData {
  id?: number
  title: string
  message: string
  date?: string
  is_recurring: boolean
  frequency?: string
  is_active: boolean
  created_at?: string
}

// Kirim Data Functions
export async function getKirimData(): Promise<KirimData[]> {
  const { data, error } = await supabase.from("kirim_data").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching kirim data:", error)
    throw error
  }

  return data || []
}

export async function addKirimData(data: Omit<KirimData, "id" | "created_at">): Promise<KirimData> {
  const { data: result, error } = await supabase.from("kirim_data").insert([data]).select().single()

  if (error) {
    console.error("Error adding kirim data:", error)
    throw error
  }

  return result
}

export async function updateKirimData(id: number, data: Partial<KirimData>): Promise<KirimData> {
  const { data: result, error } = await supabase.from("kirim_data").update(data).eq("id", id).select().single()

  if (error) {
    console.error("Error updating kirim data:", error)
    throw error
  }

  return result
}

export async function deleteKirimData(id: number): Promise<void> {
  const { error } = await supabase.from("kirim_data").delete().eq("id", id)

  if (error) {
    console.error("Error deleting kirim data:", error)
    throw error
  }
}

// Chiqim Data Functions
export async function getChiqimData(): Promise<ChiqimData[]> {
  const { data, error } = await supabase.from("chiqim_data").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching chiqim data:", error)
    throw error
  }

  return data || []
}

export async function addChiqimData(data: Omit<ChiqimData, "id" | "created_at">): Promise<ChiqimData> {
  const { data: result, error } = await supabase.from("chiqim_data").insert([data]).select().single()

  if (error) {
    console.error("Error adding chiqim data:", error)
    throw error
  }

  return result
}

export async function updateChiqimData(id: number, data: Partial<ChiqimData>): Promise<ChiqimData> {
  const { data: result, error } = await supabase.from("chiqim_data").update(data).eq("id", id).select().single()

  if (error) {
    console.error("Error updating chiqim data:", error)
    throw error
  }

  return result
}

export async function deleteChiqimData(id: number): Promise<void> {
  const { error } = await supabase.from("chiqim_data").delete().eq("id", id)

  if (error) {
    console.error("Error deleting chiqim data:", error)
    throw error
  }
}

// Notification Functions
export async function getNotifications(): Promise<NotificationData[]> {
  const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }

  return data || []
}

export async function addNotification(data: Omit<NotificationData, "id" | "created_at">): Promise<NotificationData> {
  const { data: result, error } = await supabase.from("notifications").insert([data]).select().single()

  if (error) {
    console.error("Error adding notification:", error)
    throw error
  }

  return result
}

export async function updateNotification(id: number, data: Partial<NotificationData>): Promise<NotificationData> {
  const { data: result, error } = await supabase.from("notifications").update(data).eq("id", id).select().single()

  if (error) {
    console.error("Error updating notification:", error)
    throw error
  }

  return result
}

export async function deleteNotification(id: number): Promise<void> {
  const { error } = await supabase.from("notifications").delete().eq("id", id)

  if (error) {
    console.error("Error deleting notification:", error)
    throw error
  }
}
