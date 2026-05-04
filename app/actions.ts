'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/db';

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

export async function addExpenseAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. ดึงค่าจาก FormData
  const amount = formData.get('amount') as string;
  const category = formData.get('category') as string;
  const note = formData.get('note') as string;

  // 2. Validate ฝั่ง Server
  const errors: Record<string, string> = {};

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.amount = 'Amount ต้องเป็นตัวเลขมากกว่า 0';
  }
  if (!category || category.trim().length < 2) {
    errors.category = 'Category ต้องมีอย่างน้อย 2 ตัวอักษร';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: 'กรุณาแก้ไขข้อผิดพลาด', errors };
  }

  // 3. บันทึกลง Supabase
  const { error } = await supabase.from('expenses').insert({
    amount: parseFloat(amount),
    category: category.trim(),
    note: note?.trim() || null,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, message: `Database error: ${error.message}` };
  }

  // 4. Revalidate หน้าหลักให้ดึงข้อมูลใหม่
  revalidatePath('/');

  return { success: true, message: `✅ บันทึกค่าใช้จ่าย ${category} ฿${amount} แล้ว!` };
}

export async function getExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return [];
  return data;
}