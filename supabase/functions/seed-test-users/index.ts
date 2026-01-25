import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const testUsers = [
      { email: 'admin@email.com', password: 'admin123', displayName: 'Test Parent', role: 'parent' },
      { email: 'kid@email.com', password: 'kid123', displayName: 'Test Kid', role: 'child' },
    ]

    const results = []

    for (const testUser of testUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(u => u.email === testUser.email)

      if (existingUser) {
        results.push({ email: testUser.email, status: 'already exists' })
        continue
      }

      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
      })

      if (authError) {
        results.push({ email: testUser.email, status: 'auth error', error: authError.message })
        continue
      }

      // Create profile
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          display_name: testUser.displayName,
          role: testUser.role,
          onboarding_complete: true,
        })
        .select()
        .single()

      if (profileError) {
        results.push({ email: testUser.email, status: 'profile error', error: profileError.message })
        continue
      }

      // Create screen time balance for children
      if (testUser.role === 'child') {
        await supabaseAdmin
          .from('screen_time_balance')
          .insert({
            user_id: profileData.id,
            minutes_remaining: 30,
          })
      }

      results.push({ email: testUser.email, status: 'created', role: testUser.role })
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
