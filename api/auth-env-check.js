export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({
    resend:Boolean(process.env.RESEND_API_KEY),
    supabaseService:Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SECRET_KEY),
    supabaseUrl:Boolean(process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL)
  });
}
