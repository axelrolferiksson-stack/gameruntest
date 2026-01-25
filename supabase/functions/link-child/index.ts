import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { childEmail, childPassword } = await req.json();

    if (!childEmail || !childPassword) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Admin client for bypassing RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Client with parent's token
    const supabaseParent = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify parent authentication
    const { data: { user: parentUser }, error: parentAuthError } = await supabaseParent.auth.getUser();
    if (parentAuthError || !parentUser) {
      console.error("Parent auth error:", parentAuthError);
      return new Response(
        JSON.stringify({ error: "Parent authentication failed" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get parent profile using admin client
    const { data: parentProfile, error: parentProfileError } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("user_id", parentUser.id)
      .single();

    if (parentProfileError || !parentProfile || parentProfile.role !== "parent") {
      console.error("Parent profile error:", parentProfileError);
      return new Response(
        JSON.stringify({ error: "Only parents can add children" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify child credentials using a separate client to avoid session issues
    const supabaseAuthCheck = createClient(supabaseUrl, supabaseAnonKey);
    const { data: childAuth, error: childAuthError } = await supabaseAuthCheck.auth.signInWithPassword({
      email: childEmail,
      password: childPassword,
    });

    if (childAuthError || !childAuth.user) {
      console.error("Child auth error:", childAuthError);
      return new Response(
        JSON.stringify({ error: "Invalid child credentials" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sign out the child session immediately
    await supabaseAuthCheck.auth.signOut();

    // Get child profile using admin client
    const { data: childProfile, error: childProfileError } = await supabaseAdmin
      .from("profiles")
      .select("id, role, display_name")
      .eq("user_id", childAuth.user.id)
      .single();

    if (childProfileError || !childProfile) {
      console.error("Child profile error:", childProfileError);
      return new Response(
        JSON.stringify({ error: "Child profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (childProfile.role !== "child") {
      return new Response(
        JSON.stringify({ error: "This account is not a child account" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for existing link using admin client
    const { data: existingLink } = await supabaseAdmin
      .from("parent_child_links")
      .select("id")
      .eq("parent_id", parentProfile.id)
      .eq("child_id", childProfile.id)
      .maybeSingle();

    if (existingLink) {
      return new Response(
        JSON.stringify({ error: "This child is already linked to your account" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create link using admin client to bypass RLS
    const { error: linkError } = await supabaseAdmin
      .from("parent_child_links")
      .insert({
        parent_id: parentProfile.id,
        child_id: childProfile.id,
      });

    if (linkError) {
      console.error("Link error:", linkError);
      return new Response(
        JSON.stringify({ error: "Failed to link child account" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully linked child ${childProfile.display_name} to parent ${parentProfile.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        childName: childProfile.display_name,
        message: `Successfully linked ${childProfile.display_name} to your account` 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
