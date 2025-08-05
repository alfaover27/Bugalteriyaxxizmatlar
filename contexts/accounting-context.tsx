"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  getKirimData,
  addKirimData,
  updateKirimData,
  deleteKirimData,
  getChiqimData,
  addChiqimData,
  updateChiqimData,
  deleteChiqimData,
  type KirimData as DBKirimData,
  type ChiqimData as DBChiqimData,
} from "@/lib/database"

// Transform database types to component types
export interface KirimData {
  id: number
  korxonaNomi: string
  inn: string
  telRaqami: string
  ismi: string
  xizmatTuri: string
  filialNomi: string
  oldingiOylardan: {
    oylarSoni: number
    summasi: number
  }
  birOylikHisoblanganSumma: number
  jamiQarzDorlik: number
  tolandi: {
    jami: number
    naqd: number
    prechisleniya: number
    karta: number
  }
  qoldiq: number
  lastUpdated: string
}

export interface ChiqimData {
  id: number
  sana: string
  nomi: string
  filialNomi: string
  chiqimNomi: string
  avvalgiOylardan: number
  birOylikHisoblangan: number
  jamiHisoblangan: number
  tolangan: number
  qoldiqQarzDorlik: number
  qoldiqAvans: number
}

interface AccountingContextType {
  kirimData: KirimData[]
  chiqimData: ChiqimData[]
  loading: boolean
  addKirim: (data: Omit<KirimData, "id">) => Promise<void>
  updateKirim: (id: number, data: Partial<KirimData>) => Promise<void>
  deleteKirim: (id: number) => Promise<void>
  addChiqim: (data: Omit<ChiqimData, "id">) => Promise<void>
  updateChiqim: (id: number, data: Partial<ChiqimData>) => Promise<void>
  deleteChiqim: (id: number) => Promise<void>
  refreshData: () => Promise<void>
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined)

// Transform functions
function transformKirimFromDB(dbData: DBKirimData): KirimData {
  return {
    id: dbData.id!,
    korxonaNomi: dbData.korxona_nomi,
    inn: dbData.inn,
    telRaqami: dbData.tel_raqami,
    ismi: dbData.ismi,
    xizmatTuri: dbData.xizmat_turi,
    filialNomi: dbData.filial_nomi,
    oldingiOylardan: {
      oylarSoni: dbData.oldingi_oylar_soni,
      summasi: dbData.oldingi_oylar_summasi,
    },
    birOylikHisoblanganSumma: dbData.bir_oylik_hisoblangan_summa,
    jamiQarzDorlik: dbData.jami_qarz_dorlik,
    tolandi: {
      jami: dbData.tolandi_jami,
      naqd: dbData.tolandi_naqd,
      prechisleniya: dbData.tolandi_prechisleniya,
      karta: dbData.tolandi_karta,
    },
    qoldiq: dbData.qoldiq,
    lastUpdated: dbData.last_updated,
  }
}

function transformKirimToDB(data: Omit<KirimData, "id">): Omit<DBKirimData, "id" | "created_at"> {
  return {
    korxona_nomi: data.korxonaNomi,
    inn: data.inn,
    tel_raqami: data.telRaqami,
    ismi: data.ismi,
    xizmat_turi: data.xizmatTuri,
    filial_nomi: data.filialNomi,
    oldingi_oylar_soni: data.oldingiOylardan.oylarSoni,
    oldingi_oylar_summasi: data.oldingiOylardan.summasi,
    bir_oylik_hisoblangan_summa: data.birOylikHisoblanganSumma,
    jami_qarz_dorlik: data.jamiQarzDorlik,
    tolandi_jami: data.tolandi.jami,
    tolandi_naqd: data.tolandi.naqd,
    tolandi_prechisleniya: data.tolandi.prechisleniya,
    tolandi_karta: data.tolandi.karta,
    qoldiq: data.qoldiq,
    last_updated: data.lastUpdated,
  }
}

function transformChiqimFromDB(dbData: DBChiqimData): ChiqimData {
  return {
    id: dbData.id!,
    sana: dbData.sana,
    nomi: dbData.nomi,
    filialNomi: dbData.filial_nomi,
    chiqimNomi: dbData.chiqim_nomi,
    avvalgiOylardan: dbData.avvalgi_oylardan,
    birOylikHisoblangan: dbData.bir_oylik_hisoblangan,
    jamiHisoblangan: dbData.jami_hisoblangan,
    tolangan: dbData.tolangan,
    qoldiqQarzDorlik: dbData.qoldiq_qarz_dorlik,
    qoldiqAvans: dbData.qoldiq_avans,
  }
}

function transformChiqimToDB(data: Omit<ChiqimData, "id">): Omit<DBChiqimData, "id" | "created_at"> {
  return {
    sana: data.sana,
    nomi: data.nomi,
    filial_nomi: data.filialNomi,
    chiqim_nomi: data.chiqimNomi,
    avvalgi_oylardan: data.avvalgiOylardan,
    bir_oylik_hisoblangan: data.birOylikHisoblangan,
    jami_hisoblangan: data.jamiHisoblangan,
    tolangan: data.tolangan,
    qoldiq_qarz_dorlik: data.qoldiqQarzDorlik,
    qoldiq_avans: data.qoldiqAvans,
  }
}

export function AccountingProvider({ children }: { children: ReactNode }) {
  const [kirimData, setKirimData] = useState<KirimData[]>([])
  const [chiqimData, setChiqimData] = useState<ChiqimData[]>([])
  const [loading, setLoading] = useState(true)

  const refreshData = async () => {
    try {
      setLoading(true)
      const [kirimResult, chiqimResult] = await Promise.all([getKirimData(), getChiqimData()])

      setKirimData(kirimResult.map(transformKirimFromDB))
      setChiqimData(chiqimResult.map(transformChiqimFromDB))
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const addKirim = async (data: Omit<KirimData, "id">) => {
    try {
      const dbData = transformKirimToDB(data)
      const result = await addKirimData(dbData)
      const newKirim = transformKirimFromDB(result)
      setKirimData((prev) => [newKirim, ...prev])
    } catch (error) {
      console.error("Error adding kirim:", error)
      throw error
    }
  }

  const updateKirim = async (id: number, data: Partial<KirimData>) => {
    try {
      const dbData: Partial<DBKirimData> = {}

      if (data.korxonaNomi !== undefined) dbData.korxona_nomi = data.korxonaNomi
      if (data.inn !== undefined) dbData.inn = data.inn
      if (data.telRaqami !== undefined) dbData.tel_raqami = data.telRaqami
      if (data.ismi !== undefined) dbData.ismi = data.ismi
      if (data.xizmatTuri !== undefined) dbData.xizmat_turi = data.xizmatTuri
      if (data.filialNomi !== undefined) dbData.filial_nomi = data.filialNomi
      if (data.oldingiOylardan !== undefined) {
        dbData.oldingi_oylar_soni = data.oldingiOylardan.oylarSoni
        dbData.oldingi_oylar_summasi = data.oldingiOylardan.summasi
      }
      if (data.birOylikHisoblanganSumma !== undefined)
        dbData.bir_oylik_hisoblangan_summa = data.birOylikHisoblanganSumma
      if (data.jamiQarzDorlik !== undefined) dbData.jami_qarz_dorlik = data.jamiQarzDorlik
      if (data.tolandi !== undefined) {
        dbData.tolandi_jami = data.tolandi.jami
        dbData.tolandi_naqd = data.tolandi.naqd
        dbData.tolandi_prechisleniya = data.tolandi.prechisleniya
        dbData.tolandi_karta = data.tolandi.karta
      }
      if (data.qoldiq !== undefined) dbData.qoldiq = data.qoldiq
      if (data.lastUpdated !== undefined) dbData.last_updated = data.lastUpdated

      const result = await updateKirimData(id, dbData)
      const updatedKirim = transformKirimFromDB(result)
      setKirimData((prev) => prev.map((item) => (item.id === id ? updatedKirim : item)))
    } catch (error) {
      console.error("Error updating kirim:", error)
      throw error
    }
  }

  const deleteKirim = async (id: number) => {
    try {
      await deleteKirimData(id)
      setKirimData((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting kirim:", error)
      throw error
    }
  }

  const addChiqim = async (data: Omit<ChiqimData, "id">) => {
    try {
      const dbData = transformChiqimToDB(data)
      const result = await addChiqimData(dbData)
      const newChiqim = transformChiqimFromDB(result)
      setChiqimData((prev) => [newChiqim, ...prev])
    } catch (error) {
      console.error("Error adding chiqim:", error)
      throw error
    }
  }

  const updateChiqim = async (id: number, data: Partial<ChiqimData>) => {
    try {
      const dbData: Partial<DBChiqimData> = {}

      if (data.sana !== undefined) dbData.sana = data.sana
      if (data.nomi !== undefined) dbData.nomi = data.nomi
      if (data.filialNomi !== undefined) dbData.filial_nomi = data.filialNomi
      if (data.chiqimNomi !== undefined) dbData.chiqim_nomi = data.chiqimNomi
      if (data.avvalgiOylardan !== undefined) dbData.avvalgi_oylardan = data.avvalgiOylardan
      if (data.birOylikHisoblangan !== undefined) dbData.bir_oylik_hisoblangan = data.birOylikHisoblangan
      if (data.jamiHisoblangan !== undefined) dbData.jami_hisoblangan = data.jamiHisoblangan
      if (data.tolangan !== undefined) dbData.tolangan = data.tolangan
      if (data.qoldiqQarzDorlik !== undefined) dbData.qoldiq_qarz_dorlik = data.qoldiqQarzDorlik
      if (data.qoldiqAvans !== undefined) dbData.qoldiq_avans = data.qoldiqAvans

      const result = await updateChiqimData(id, dbData)
      const updatedChiqim = transformChiqimFromDB(result)
      setChiqimData((prev) => prev.map((item) => (item.id === id ? updatedChiqim : item)))
    } catch (error) {
      console.error("Error updating chiqim:", error)
      throw error
    }
  }

  const deleteChiqim = async (id: number) => {
    try {
      await deleteChiqimData(id)
      setChiqimData((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting chiqim:", error)
      throw error
    }
  }

  const value: AccountingContextType = {
    kirimData,
    chiqimData,
    loading,
    addKirim,
    updateKirim,
    deleteKirim,
    addChiqim,
    updateChiqim,
    deleteChiqim,
    refreshData,
  }

  return <AccountingContext.Provider value={value}>{children}</AccountingContext.Provider>
}

export function useAccounting() {
  const context = useContext(AccountingContext)
  if (context === undefined) {
    throw new Error("useAccounting must be used within an AccountingProvider")
  }
  return context
}
