import { createClient, Provider } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL

export const supabase = createClient(supabaseUrl!, supabaseKey!);


export async function signIn(provider: Provider) {
  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${appUrl}/dashboard`
    }
  })
}

export async function signOut() {
  await supabase.auth.signOut()
}
