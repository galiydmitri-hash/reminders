import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

function getTodayString() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${year}-${month}-${day}`;
}

serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const today = getTodayString();

    // 1. Находим только те напоминания на сегодня, которые ЕЩЕ НЕ отправлены
    const { data: reminders, error } = await supabaseAdmin
      .from('reminders')
      .select('*')
      .eq('date', today)
      .eq('is_sent', false);

    if (error) throw error;

    if (!reminders || reminders.length === 0) {
      return new Response(JSON.stringify({ message: "Нет новых напоминаний для отправки на сегодня." }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = [];
    for (const item of reminders) {
      if (!item.email) continue;

      // 2. Отправляем письмо через Resend API
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Reminders App <onboarding@resend.dev>',
          to: [item.email],
          subject: 'Напоминание на сегодня!',
          html: `<p>Привет! Напоминаю: <strong>${item.text}</strong></p><p>Дата: ${item.date}</p>`,
        }),
      });

      const resData = await res.json();

      if (res.ok) {
        // 3. Если письмо успешно ушло, обновляем статус в базе данных
        await supabaseAdmin
          .from('reminders')
          .update({ is_sent: true })
          .eq('id', item.id);
      }

      results.push({ email: item.email, status: res.ok, response: resData });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
})