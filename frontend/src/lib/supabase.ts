import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Sends 8-digit OTP email verification via Supabase Auth
 */
export async function sendEmailOTP(email: string) {
  const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: redirectUrl,
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Verifies the 8-digit OTP code entered by the user
 */
export async function verifyEmailOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });
  if (error) throw error;
  return data;
}

/**
 * Cloud Persistence: Saves extracted prescription data to Supabase database
 */
export async function savePrescriptionToSupabase(prescriptionData: any, ddiData: any, fhirBundle: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        user_id: user?.id || null,
        doctor_name: prescriptionData?.doctor_name,
        patient_name: prescriptionData?.patient_name,
        date: prescriptionData?.date,
        diagnosis: prescriptionData?.diagnosis,
        condition_summary: prescriptionData?.condition_summary,
        dietary_lifestyle_parhez: prescriptionData?.dietary_lifestyle_parhez || [],
        medicines: prescriptionData?.medicines || [],
        ddi_safety: ddiData,
        fhir_bundle: fhirBundle
      })
      .select()
      .single();

    if (error) console.warn('[Supabase Cloud Save Warning]:', error.message);
    return data;
  } catch (err) {
    console.warn('[Supabase Cloud Save Error]:', err);
    return null;
  }
}

/**
 * Cloud Persistence: Fetches user prescription history from Supabase database
 */
export async function fetchPrescriptionsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Supabase Fetch Error]:', err);
    return [];
  }
}

/**
 * Cloud Persistence: Saves extracted lab report data to Supabase database
 */
export async function saveLabReportToSupabase(labReportData: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('lab_reports')
      .insert({
        user_id: user?.id || null,
        report_title: labReportData?.report_title || 'Diagnostic Report',
        lab_name: labReportData?.lab_name,
        test_date: labReportData?.test_date || new Date().toISOString().split('T')[0],
        metrics: labReportData?.metrics || [],
      })
      .select()
      .single();

    if (error) console.warn('[Supabase Lab Report Save Warning]:', error.message);
    return data;
  } catch (err) {
    console.warn('[Supabase Lab Report Save Error]:', err);
    return null;
  }
}

/**
 * Cloud Persistence: Fetches lab reports history from Supabase database
 */
export async function fetchLabReportsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('lab_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Supabase Fetch Lab Reports Error]:', err);
    return [];
  }
}
