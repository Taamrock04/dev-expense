// app/actions.ts
'use server';

import { createSupabaseServer } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

export type Expense = {
  id: string;
  amount: number;
  category: string;
  note: string | null;
  created_at: string;
};

export async function addExpenseAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'กรุณา login ก่อน' };

  const amount   = formData.get('amount')   as string;
  const category = formData.get('category') as string;
  const note     = formData.get('note')     as string;

  const errors: Record<string, string> = {};
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
    errors.amount = 'ใส่จำนวนเงินให้ถูกต้อง (ต้องมากกว่า 0)';
  if (!category || category.trim().length < 2)
    errors.category = 'ใส่ชื่อ category อย่างน้อย 2 ตัวอักษร';
  if (Object.keys(errors).length > 0)
    return { success: false, message: 'กรุณาแก้ไขข้อผิดพลาด', errors };

  const { error } = await supabase.from('expenses').insert({
    user_id:  user.id,
    amount:   parseFloat(amount),
    category: category.trim(),
    note:     note?.trim() || null,
  });

  if (error) return { success: false, message: `บันทึกไม่สำเร็จ: ${error.message}` };

  revalidatePath('/');
  return {
    success: true,
    message: `✅ บันทึกแล้ว: ${category.trim()} $${parseFloat(amount).toFixed(2)}`,
  };
}

export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('expenses')
    .select('id, amount, category, note, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) return [];
  return (data as Expense[]) ?? [];
}

export async function getUserDisplayName(): Promise<string> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return '';

  // Guest → แสดง "Guest-XXXXX" (5 ตัวท้ายของ user.id)
  if (user.is_anonymous) {
    return 'Guest-' + user.id.slice(-5).toUpperCase();
  }

  // Google / GitHub → แสดง email หรือ name
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.user_name ||
    user.email ||
    'User'
  );
}