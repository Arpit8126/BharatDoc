// 22+ Indian & major languages i18n translation system
export type LangCode = 
  | 'en' | 'hi' | 'ta' | 'mr' | 'bn' | 'te' | 'gu' | 'kn' 
  | 'ml' | 'pa' | 'or' | 'as' | 'ur' | 'sa' | 'ks' | 'sd' 
  | 'ne' | 'si' | 'mni' | 'kok' | 'doi' | 'bho';

export interface LangMeta {
  code: LangCode;
  name: string;       // Native name
  label: string;      // Display label
  speechCode: string; // Web Speech API lang code
}

export const LANGUAGES: LangMeta[] = [
  { code: 'en',  name: 'English',       label: 'EN – English',        speechCode: 'en-IN' },
  { code: 'hi',  name: 'हिंदी',          label: 'HI – हिंदी',           speechCode: 'hi-IN' },
  { code: 'ta',  name: 'தமிழ்',          label: 'TA – தமிழ்',           speechCode: 'ta-IN' },
  { code: 'mr',  name: 'मराठी',          label: 'MR – मराठी',           speechCode: 'mr-IN' },
  { code: 'bn',  name: 'বাংলা',          label: 'BN – বাংলা',           speechCode: 'bn-IN' },
  { code: 'te',  name: 'తెలుగు',         label: 'TE – తెలుగు',          speechCode: 'te-IN' },
  { code: 'gu',  name: 'ગુજરાતી',        label: 'GU – ગુજરાતી',         speechCode: 'gu-IN' },
  { code: 'kn',  name: 'ಕನ್ನಡ',          label: 'KN – ಕನ್ನಡ',           speechCode: 'kn-IN' },
  { code: 'ml',  name: 'മലയാളം',        label: 'ML – മലയാളം',         speechCode: 'ml-IN' },
  { code: 'pa',  name: 'ਪੰਜਾਬੀ',         label: 'PA – ਪੰਜਾਬੀ',          speechCode: 'pa-IN' },
  { code: 'or',  name: 'ଓଡ଼ିଆ',           label: 'OR – ଓଡ଼ିଆ',            speechCode: 'or-IN' },
  { code: 'as',  name: 'অসমীয়া',        label: 'AS – অসমীয়া',         speechCode: 'as-IN' },
  { code: 'ur',  name: 'اردو',           label: 'UR – اردو',            speechCode: 'ur-PK' },
  { code: 'sa',  name: 'संस्कृतम्',     label: 'SA – संस्कृत',          speechCode: 'sa-IN' },
  { code: 'ks',  name: 'कॉशुर',          label: 'KS – कश्मीरी',         speechCode: 'hi-IN' },
  { code: 'sd',  name: 'سنڌي',           label: 'SD – सिन्धी',          speechCode: 'hi-IN' },
  { code: 'ne',  name: 'नेपाली',         label: 'NE – नेपाली',          speechCode: 'ne-NP' },
  { code: 'si',  name: 'සිංහල',         label: 'SI – සිංහල',          speechCode: 'si-LK' },
  { code: 'mni', name: 'মৈতৈলোন্',       label: 'MNI – Meitei',        speechCode: 'bn-IN' },
  { code: 'kok', name: 'कोंकणी',         label: 'KOK – कोंकणी',         speechCode: 'mr-IN' },
  { code: 'doi', name: 'डोगरी',          label: 'DOI – डोगरी',          speechCode: 'hi-IN' },
  { code: 'bho', name: 'भोजपुरी',        label: 'BHO – भोजपुरी',        speechCode: 'hi-IN' },
];

// Core UI translation strings
export interface Translations {
  // Nav
  nav_signin: string;
  nav_register: string;
  nav_signout: string;
  // Hero
  hero_badge: string;
  hero_heading: string;
  hero_subheading: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  // Features
  feature_audit_title: string;
  feature_audit_desc: string;
  feature_ddi_title: string;
  feature_ddi_desc: string;
  feature_lab_title: string;
  feature_lab_desc: string;
  feature_fhir_title: string;
  feature_fhir_desc: string;
  // Auth
  auth_login_heading: string;
  auth_register_heading: string;
  auth_email: string;
  auth_password: string;
  auth_name: string;
  auth_otp_label: string;
  auth_send_otp: string;
  auth_verify: string;
  auth_login_btn: string;
  auth_register_btn: string;
  auth_switch_to_register: string;
  auth_switch_to_login: string;
  auth_abha_optional: string;
  // Dashboard
  dash_tab_audit: string;
  dash_tab_ddi: string;
  dash_tab_lab: string;
  dash_tab_fhir: string;
  dash_upload_btn: string;
  dash_demo_badge: string;
  // Audit tab
  audit_upload_label: string;
  audit_upload_hint: string;
  audit_listen: string;
  audit_playing: string;
  audit_doctor: string;
  audit_patient: string;
  audit_diagnosis: string;
  audit_meds_title: string;
  audit_chat_placeholder: string;
  audit_canvas_label: string;
  // DDI tab
  ddi_safe: string;
  ddi_high_risk: string;
  ddi_moderate: string;
  ddi_add_btn: string;
  // Lab tab
  lab_heading: string;
  lab_safe_zone: string;
  lab_danger_zone: string;
  // Footer
  footer_copy: string;
  footer_mission: string;
  footer_privacy: string;
  footer_terms: string;
}

const T: Record<LangCode, Translations> = {
  en: {
    nav_signin: 'Sign In',
    nav_register: 'Create Account',
    nav_signout: 'Sign Out',
    hero_badge: 'Bridging India\'s Paper Medical Ecosystem with Digital Health',
    hero_heading: 'Clinical intelligence born from paper prescriptions.',
    hero_subheading: 'Upload any Indian prescription or lab report. We extract medicines with bounding-box precision, check for dangerous drug conflicts, and generate ABDM FHIR R4 records.',
    hero_cta_primary: 'Get Started Free',
    hero_cta_secondary: 'View Demo',
    feature_audit_title: 'Zero-Hallucination Audit',
    feature_audit_desc: 'Every extracted medicine is anchored to exact pixel coordinates on the original prescription slip.',
    feature_ddi_title: 'Drug Conflict Radar',
    feature_ddi_desc: 'Cross-prescription pharmacovigilance engine detects dangerous drug-drug interactions in real time.',
    feature_lab_title: 'Health Trend Analytics',
    feature_lab_desc: 'Longitudinal trajectory graphs for HbA1c, Blood Sugar, Creatinine across 3–12 months.',
    feature_fhir_title: 'ABDM FHIR R4 Export',
    feature_fhir_desc: 'One-click export of official HL7 FHIR R4 bundles for ABHA Digital Locker integration.',
    auth_login_heading: 'Welcome back',
    auth_register_heading: 'Create your account',
    auth_email: 'Email address',
    auth_password: 'Password',
    auth_name: 'Full name',
    auth_otp_label: 'Enter 8-digit verification code',
    auth_send_otp: 'Send Verification Code',
    auth_verify: 'Verify & Continue',
    auth_login_btn: 'Sign In',
    auth_register_btn: 'Create Account',
    auth_switch_to_register: 'Don\'t have an account? Create one',
    auth_switch_to_login: 'Already have an account? Sign in',
    auth_abha_optional: 'ABHA ID is optional',
    dash_tab_audit: 'Bounding-Box Audit',
    dash_tab_ddi: 'DDI Safety Radar',
    dash_tab_lab: 'Health Trends',
    dash_tab_fhir: 'FHIR R4 Export',
    dash_upload_btn: 'Upload Prescription',
    dash_demo_badge: 'Demo Data — Upload a prescription to analyse yours',
    audit_upload_label: 'Upload any prescription photo',
    audit_upload_hint: 'Supports degraded, handwritten, low-light & carbon-copy scans',
    audit_listen: 'Listen Briefing',
    audit_playing: 'Playing…',
    audit_doctor: 'Doctor',
    audit_patient: 'Patient',
    audit_diagnosis: 'Clinical Diagnosis',
    audit_meds_title: 'Extracted Medications',
    audit_chat_placeholder: 'Ask about this prescription…',
    audit_canvas_label: 'OpenCV Normalized Canvas',
    ddi_safe: 'No Drug Conflicts Detected',
    ddi_high_risk: 'Critical Drug Interaction',
    ddi_moderate: 'Moderate Caution',
    ddi_add_btn: 'Add Medication & Re-Evaluate',
    lab_heading: 'Longitudinal Health Trends',
    lab_safe_zone: 'Safe Zone',
    lab_danger_zone: 'Danger Zone',
    footer_copy: '© 2026 BharatDoc. All rights reserved.',
    footer_mission: 'Bridging India\'s paper medical ecosystem with ABDM interoperability.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
  },
  hi: {
    nav_signin: 'साइन इन करें',
    nav_register: 'खाता बनाएं',
    nav_signout: 'साइन आउट',
    hero_badge: 'भारत के पेपर मेडिकल इकोसिस्टम को डिजिटल स्वास्थ्य से जोड़ना',
    hero_heading: 'कागज़ी पर्चों से जन्मी क्लिनिकल बुद्धिमत्ता।',
    hero_subheading: 'कोई भी भारतीय पर्ची या लैब रिपोर्ट अपलोड करें। हम दवाएं निकालते हैं, खतरनाक ड्रग संघर्षों की जांच करते हैं, और ABDM FHIR R4 रिकॉर्ड बनाते हैं।',
    hero_cta_primary: 'निःशुल्क शुरू करें',
    hero_cta_secondary: 'डेमो देखें',
    feature_audit_title: 'शून्य-हैलुसिनेशन ऑडिट',
    feature_audit_desc: 'प्रत्येक निकाली गई दवा मूल पर्ची पर सटीक पिक्सेल निर्देशांक से जुड़ी है।',
    feature_ddi_title: 'ड्रग संघर्ष रडार',
    feature_ddi_desc: 'क्रॉस-प्रिस्क्रिप्शन फार्माकोविजिलेंस इंजन खतरनाक ड्रग-ड्रग इंटरैक्शन वास्तविक समय में पकड़ता है।',
    feature_lab_title: 'स्वास्थ्य प्रवृत्ति विश्लेषण',
    feature_lab_desc: 'HbA1c, ब्लड शुगर, क्रिएटिनिन के लिए 3–12 महीने के लॉन्गिट्यूडिनल ग्राफ।',
    feature_fhir_title: 'ABDM FHIR R4 एक्सपोर्ट',
    feature_fhir_desc: 'ABHA डिजिटल लॉकर एकीकरण के लिए HL7 FHIR R4 बंडल का एक-क्लिक निर्यात।',
    auth_login_heading: 'वापस स्वागत है',
    auth_register_heading: 'अपना खाता बनाएं',
    auth_email: 'ईमेल पता',
    auth_password: 'पासवर्ड',
    auth_name: 'पूरा नाम',
    auth_otp_label: '8 अंकों का सत्यापन कोड दर्ज करें',
    auth_send_otp: 'सत्यापन कोड भेजें',
    auth_verify: 'सत्यापित करें और जारी रखें',
    auth_login_btn: 'साइन इन करें',
    auth_register_btn: 'खाता बनाएं',
    auth_switch_to_register: 'खाता नहीं है? बनाएं',
    auth_switch_to_login: 'खाता है? साइन इन करें',
    auth_abha_optional: 'ABHA ID वैकल्पिक है',
    dash_tab_audit: 'बाउंडिंग-बॉक्स ऑडिट',
    dash_tab_ddi: 'DDI सेफ्टी रडार',
    dash_tab_lab: 'स्वास्थ्य प्रवृत्तियां',
    dash_tab_fhir: 'FHIR R4 निर्यात',
    dash_upload_btn: 'पर्ची अपलोड करें',
    dash_demo_badge: 'डेमो डेटा — अपनी पर्ची अपलोड करें',
    audit_upload_label: 'कोई भी पर्ची फोटो अपलोड करें',
    audit_upload_hint: 'धुंधली, हस्तलिखित, कम रोशनी की तस्वीरें समर्थित',
    audit_listen: 'सुनें',
    audit_playing: 'चल रहा है…',
    audit_doctor: 'डॉक्टर',
    audit_patient: 'मरीज़',
    audit_diagnosis: 'नैदानिक निदान',
    audit_meds_title: 'निकाली गई दवाएं',
    audit_chat_placeholder: 'इस पर्ची के बारे में पूछें…',
    audit_canvas_label: 'OpenCV नॉर्मलाइज़्ड कैनवास',
    ddi_safe: 'कोई ड्रग संघर्ष नहीं मिला',
    ddi_high_risk: 'गंभीर ड्रग इंटरैक्शन',
    ddi_moderate: 'मध्यम सावधानी',
    ddi_add_btn: 'दवा जोड़ें और पुनः जांच करें',
    lab_heading: 'लॉन्गिट्यूडिनल स्वास्थ्य प्रवृत्तियां',
    lab_safe_zone: 'सुरक्षित क्षेत्र',
    lab_danger_zone: 'खतरे का क्षेत्र',
    footer_copy: '© 2026 BharatDoc. सर्वाधिकार सुरक्षित।',
    footer_mission: 'भारत के पेपर मेडिकल इकोसिस्टम को ABDM इंटरऑपरेबिलिटी से जोड़ना।',
    footer_privacy: 'गोपनीयता नीति',
    footer_terms: 'सेवा की शर्तें',
  },
  ta: {
    nav_signin: 'உள்நுழைய',
    nav_register: 'கணக்கு உருவாக்கு',
    nav_signout: 'வெளியேறு',
    hero_badge: 'இந்தியாவின் காகித மருத்துவ சுற்றுச்சூழலை டிஜிட்டல் சுகாதாரத்துடன் இணைக்கிறது',
    hero_heading: 'காகித மருந்துச்சீட்டுகளிலிருந்து பிறந்த மருத்துவ நுண்ணறிவு.',
    hero_subheading: 'எந்த இந்திய மருந்துச்சீட்டையும் அல்லது ஆய்வக அறிக்கையையும் பதிவேற்றுங்கள்.',
    hero_cta_primary: 'இலவசமாக தொடங்கு',
    hero_cta_secondary: 'டெமோ பார்',
    feature_audit_title: 'பூஜ்ஜிய-மாயை தணிக்கை',
    feature_audit_desc: 'ஒவ்வொரு மருந்தும் அசல் சீட்டில் சரியான பிக்சல் ஆயத்தங்களுடன் இணைக்கப்பட்டுள்ளது.',
    feature_ddi_title: 'மருந்து மோதல் ரேடார்',
    feature_ddi_desc: 'ஆபத்தான மருந்து-மருந்து தொடர்புகளை உடனடியாக கண்டறியும்.',
    feature_lab_title: 'சுகாதார போக்கு பகுப்பாய்வு',
    feature_lab_desc: '3-12 மாத காலத்திற்கான HbA1c, இரத்த சர்க்கரை வரைபடங்கள்.',
    feature_fhir_title: 'ABDM FHIR R4 ஏற்றுமதி',
    feature_fhir_desc: 'ABHA டிஜிட்டல் லாக்கர் ஒருங்கிணைப்பிற்கான HL7 FHIR R4 தொகுப்புகள்.',
    auth_login_heading: 'மீண்டும் வரவேற்கிறோம்',
    auth_register_heading: 'உங்கள் கணக்கை உருவாக்குங்கள்',
    auth_email: 'மின்னஞ்சல் முகவரி',
    auth_password: 'கடவுச்சொல்',
    auth_name: 'முழு பெயர்',
    auth_otp_label: '8 இலக்க சரிபார்ப்பு குறியீட்டை உள்ளிடுக',
    auth_send_otp: 'சரிபார்ப்பு குறியீடு அனுப்பு',
    auth_verify: 'சரிபார்க்கவும் & தொடரவும்',
    auth_login_btn: 'உள்நுழைய',
    auth_register_btn: 'கணக்கு உருவாக்கு',
    auth_switch_to_register: 'கணக்கு இல்லையா? உருவாக்குங்கள்',
    auth_switch_to_login: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக',
    auth_abha_optional: 'ABHA ID விருப்பமானது',
    dash_tab_audit: 'ஆய்வு',
    dash_tab_ddi: 'DDI ரேடார்',
    dash_tab_lab: 'சுகாதார போக்குகள்',
    dash_tab_fhir: 'FHIR R4 ஏற்றுமதி',
    dash_upload_btn: 'மருந்துச்சீட்டு பதிவேற்று',
    dash_demo_badge: 'டெமோ தரவு — உங்கள் சீட்டை பதிவேற்றுங்கள்',
    audit_upload_label: 'எந்த சீட்டு புகைப்படத்தையும் பதிவேற்றுக',
    audit_upload_hint: 'மங்கலான, கையெழுத்து, குறைந்த வெளிச்ச படங்கள் ஆதரிக்கப்படுகின்றன',
    audit_listen: 'கேளுங்கள்',
    audit_playing: 'இயங்குகிறது…',
    audit_doctor: 'மருத்துவர்',
    audit_patient: 'நோயாளி',
    audit_diagnosis: 'மருத்துவ நோயறிதல்',
    audit_meds_title: 'பிரித்தெடுக்கப்பட்ட மருந்துகள்',
    audit_chat_placeholder: 'இந்த சீட்டு பற்றி கேளுங்கள்…',
    audit_canvas_label: 'OpenCV நிலைப்படுத்தப்பட்ட கேன்வாஸ்',
    ddi_safe: 'மருந்து மோதல் இல்லை',
    ddi_high_risk: 'அபாயகரமான மருந்து தொடர்பு',
    ddi_moderate: 'மிதமான எச்சரிக்கை',
    ddi_add_btn: 'மருந்து சேர்க்கவும்',
    lab_heading: 'நீண்டகால சுகாதார போக்குகள்',
    lab_safe_zone: 'பாதுகாப்பான மண்டலம்',
    lab_danger_zone: 'ஆபத்து மண்டலம்',
    footer_copy: '© 2026 BharatDoc. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன.',
    footer_mission: 'இந்தியாவின் காகித மருத்துவ சுற்றுச்சூழலை ABDM இடைவினைத்திறனுடன் இணைக்கிறது.',
    footer_privacy: 'தனியுரிமைக் கொள்கை',
    footer_terms: 'சேவை விதிமுறைகள்',
  },
  mr: {
    nav_signin: 'साइन इन करा',
    nav_register: 'खाते तयार करा',
    nav_signout: 'साइन आउट',
    hero_badge: 'भारताच्या कागदी वैद्यकीय परिसंस्थेला डिजिटल आरोग्याशी जोडणे',
    hero_heading: 'कागदी चिठ्ठ्यांपासून जन्मलेली क्लिनिकल बुद्धिमत्ता.',
    hero_subheading: 'कोणतीही भारतीय प्रिस्क्रिप्शन किंवा लॅब रिपोर्ट अपलोड करा.',
    hero_cta_primary: 'मोफत सुरू करा',
    hero_cta_secondary: 'डेमो पहा',
    feature_audit_title: 'शून्य-भास ऑडिट',
    feature_audit_desc: 'प्रत्येक औषध मूळ चिठ्ठीवर अचूक पिक्सेल निर्देशांकांशी जोडलेले आहे.',
    feature_ddi_title: 'औषध संघर्ष रडार',
    feature_ddi_desc: 'धोकादायक औषध-औषध परस्परक्रिया रिअल टाइममध्ये शोधतो.',
    feature_lab_title: 'आरोग्य ट्रेंड विश्लेषण',
    feature_lab_desc: '3-12 महिन्यांसाठी HbA1c, रक्तातील साखर आलेख.',
    feature_fhir_title: 'ABDM FHIR R4 निर्यात',
    feature_fhir_desc: 'ABHA डिजिटल लॉकर एकीकरणासाठी HL7 FHIR R4 बंडल.',
    auth_login_heading: 'परत स्वागत आहे',
    auth_register_heading: 'तुमचे खाते तयार करा',
    auth_email: 'ईमेल पत्ता',
    auth_password: 'पासवर्ड',
    auth_name: 'पूर्ण नाव',
    auth_otp_label: '8 अंकी सत्यापन कोड प्रविष्ट करा',
    auth_send_otp: 'सत्यापन कोड पाठवा',
    auth_verify: 'सत्यापित करा आणि सुरू ठेवा',
    auth_login_btn: 'साइन इन करा',
    auth_register_btn: 'खाते तयार करा',
    auth_switch_to_register: 'खाते नाही? तयार करा',
    auth_switch_to_login: 'खाते आहे? साइन इन करा',
    auth_abha_optional: 'ABHA ID पर्यायी आहे',
    dash_tab_audit: 'बाउंडिंग-बॉक्स ऑडिट',
    dash_tab_ddi: 'DDI सेफ्टी रडार',
    dash_tab_lab: 'आरोग्य ट्रेंड',
    dash_tab_fhir: 'FHIR R4 निर्यात',
    dash_upload_btn: 'प्रिस्क्रिप्शन अपलोड करा',
    dash_demo_badge: 'डेमो डेटा — तुमची प्रिस्क्रिप्शन अपलोड करा',
    audit_upload_label: 'कोणताही प्रिस्क्रिप्शन फोटो अपलोड करा',
    audit_upload_hint: 'धुरकट, हस्तलिखित, कमी प्रकाश स्कॅन समर्थित',
    audit_listen: 'ऐका',
    audit_playing: 'वाजत आहे…',
    audit_doctor: 'डॉक्टर',
    audit_patient: 'रुग्ण',
    audit_diagnosis: 'क्लिनिकल निदान',
    audit_meds_title: 'काढलेली औषधे',
    audit_chat_placeholder: 'या प्रिस्क्रिप्शनबद्दल विचारा…',
    audit_canvas_label: 'OpenCV नॉर्मलाइज्ड कॅनव्हास',
    ddi_safe: 'कोणताही औषध संघर्ष नाही',
    ddi_high_risk: 'गंभीर औषध परस्परक्रिया',
    ddi_moderate: 'मध्यम सावधगिरी',
    ddi_add_btn: 'औषध जोडा आणि पुन्हा मूल्यांकन करा',
    lab_heading: 'दीर्घकालीन आरोग्य ट्रेंड',
    lab_safe_zone: 'सुरक्षित क्षेत्र',
    lab_danger_zone: 'धोका क्षेत्र',
    footer_copy: '© 2026 BharatDoc. सर्व हक्क राखीव.',
    footer_mission: 'भारताच्या कागदी वैद्यकीय परिसंस्थेला ABDM इंटरऑपरेबिलिटीशी जोडणे.',
    footer_privacy: 'गोपनीयता धोरण',
    footer_terms: 'सेवा अटी',
  },
  bn: {
    nav_signin: 'সাইন ইন করুন',
    nav_register: 'অ্যাকাউন্ট তৈরি করুন',
    nav_signout: 'সাইন আউট',
    hero_badge: 'ভারতের কাগজ চিকিৎসা পরিবেশকে ডিজিটাল স্বাস্থ্যের সাথে সংযুক্ত করছে',
    hero_heading: 'কাগজের প্রেসক্রিপশন থেকে জন্মানো ক্লিনিকাল বুদ্ধিমত্তা।',
    hero_subheading: 'যেকোনো ভারতীয় প্রেসক্রিপশন বা ল্যাব রিপোর্ট আপলোড করুন।',
    hero_cta_primary: 'বিনামূল্যে শুরু করুন',
    hero_cta_secondary: 'ডেমো দেখুন',
    feature_audit_title: 'শূন্য-হ্যালুসিনেশন অডিট',
    feature_audit_desc: 'প্রতিটি বের করা ওষুধ আসল প্রেসক্রিপশনে সঠিক পিক্সেল স্থানাঙ্কের সাথে যুক্ত।',
    feature_ddi_title: 'ড্রাগ সংঘর্ষ রাডার',
    feature_ddi_desc: 'বিপজ্জনক ড্রাগ-ড্রাগ মিথস্ক্রিয়া রিয়েল টাইমে সনাক্ত করে।',
    feature_lab_title: 'স্বাস্থ্য প্রবণতা বিশ্লেষণ',
    feature_lab_desc: '3-12 মাসের জন্য HbA1c, রক্তে শর্করা গ্রাফ।',
    feature_fhir_title: 'ABDM FHIR R4 রফতানি',
    feature_fhir_desc: 'ABHA ডিজিটাল লকার ইন্টিগ্রেশনের জন্য HL7 FHIR R4 বান্ডেল।',
    auth_login_heading: 'পুনরায় স্বাগতম',
    auth_register_heading: 'আপনার অ্যাকাউন্ট তৈরি করুন',
    auth_email: 'ইমেইল ঠিকানা',
    auth_password: 'পাসওয়ার্ড',
    auth_name: 'পূর্ণ নাম',
    auth_otp_label: '8-সংখ্যার যাচাইকরণ কোড লিখুন',
    auth_send_otp: 'যাচাইকরণ কোড পাঠান',
    auth_verify: 'যাচাই করুন এবং চালিয়ে যান',
    auth_login_btn: 'সাইন ইন করুন',
    auth_register_btn: 'অ্যাকাউন্ট তৈরি করুন',
    auth_switch_to_register: 'অ্যাকাউন্ট নেই? তৈরি করুন',
    auth_switch_to_login: 'ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন',
    auth_abha_optional: 'ABHA ID ঐচ্ছিক',
    dash_tab_audit: 'বাউন্ডিং-বক্স অডিট',
    dash_tab_ddi: 'DDI নিরাপত্তা রাডার',
    dash_tab_lab: 'স্বাস্থ্য প্রবণতা',
    dash_tab_fhir: 'FHIR R4 রফতানি',
    dash_upload_btn: 'প্রেসক্রিপশন আপলোড করুন',
    dash_demo_badge: 'ডেমো ডেটা — আপনার প্রেসক্রিপশন আপলোড করুন',
    audit_upload_label: 'যেকোনো প্রেসক্রিপশন ছবি আপলোড করুন',
    audit_upload_hint: 'ঝাপসা, হস্তলিখিত, কম আলোর স্ক্যান সমর্থিত',
    audit_listen: 'শুনুন',
    audit_playing: 'চলছে…',
    audit_doctor: 'ডাক্তার',
    audit_patient: 'রোগী',
    audit_diagnosis: 'ক্লিনিকাল নির্ণয়',
    audit_meds_title: 'বের করা ওষুধ',
    audit_chat_placeholder: 'এই প্রেসক্রিপশন সম্পর্কে জিজ্ঞাসা করুন…',
    audit_canvas_label: 'OpenCV নর্মালাইজড ক্যানভাস',
    ddi_safe: 'কোনো ড্রাগ সংঘর্ষ পাওয়া যায়নি',
    ddi_high_risk: 'গুরুতর ড্রাগ মিথস্ক্রিয়া',
    ddi_moderate: 'মধ্যম সতর্কতা',
    ddi_add_btn: 'ওষুধ যোগ করুন এবং পুনরায় মূল্যায়ন করুন',
    lab_heading: 'দীর্ঘমেয়াদী স্বাস্থ্য প্রবণতা',
    lab_safe_zone: 'নিরাপদ অঞ্চল',
    lab_danger_zone: 'বিপদ অঞ্চল',
    footer_copy: '© 2026 BharatDoc. সমস্ত অধিকার সংরক্ষিত।',
    footer_mission: 'ভারতের কাগজ চিকিৎসা পরিবেশকে ABDM ইন্টারঅপারেবিলিটির সাথে সংযুক্ত করছে।',
    footer_privacy: 'গোপনীয়তা নীতি',
    footer_terms: 'সেবার শর্তাবলী',
  },
  te: { nav_signin: 'సైన్ ఇన్', nav_register: 'ఖాతా సృష్టించు', nav_signout: 'సైన్ అవుట్', hero_badge: 'భారతదేశ పేపర్ వైద్య పర్యావరణాన్ని డిజిటల్ ఆరోగ్యంతో అనుసంధానించడం', hero_heading: 'కాగిత ప్రిస్క్రిప్షన్ల నుండి జన్మించిన క్లినికల్ బుద్ధి.', hero_subheading: 'ఏదైనా భారతీయ ప్రిస్క్రిప్షన్ లేదా లాబ్ రిపోర్ట్ అప్‌లోడ్ చేయండి.', hero_cta_primary: 'ఉచితంగా ప్రారంభించండి', hero_cta_secondary: 'డెమో చూడండి', feature_audit_title: 'జీరో-హాలూసినేషన్ ఆడిట్', feature_audit_desc: 'ప్రతి మందు అసలు స్లిప్‌లో ఖచ్చితమైన పిక్సెల్ కోఆర్డినేట్‌లకు లింక్ చేయబడింది.', feature_ddi_title: 'డ్రగ్ వివాద రాడార్', feature_ddi_desc: 'రియల్ టైమ్‌లో ప్రమాదకర డ్రగ్-డ్రగ్ ఇంటరాక్షన్‌లను గుర్తిస్తుంది.', feature_lab_title: 'ఆరోగ్య ట్రెండ్ విశ్లేషణ', feature_lab_desc: '3-12 నెలల కోసం HbA1c, రక్తంలో చక్కెర గ్రాఫ్‌లు.', feature_fhir_title: 'ABDM FHIR R4 ఎగుమతి', feature_fhir_desc: 'ABHA డిజిటల్ లాకర్ ఇంటిగ్రేషన్ కోసం HL7 FHIR R4 బండిల్స్.', auth_login_heading: 'తిరిగి స్వాగతం', auth_register_heading: 'మీ ఖాతా సృష్టించండి', auth_email: 'ఇమెయిల్ చిరునామా', auth_password: 'పాస్‌వర్డ్', auth_name: 'పూర్తి పేరు', auth_otp_label: '8 అంకెల ధృవీకరణ కోడ్ నమోదు చేయండి', auth_send_otp: 'ధృవీకరణ కోడ్ పంపండి', auth_verify: 'ధృవీకరించండి & కొనసాగండి', auth_login_btn: 'సైన్ ఇన్', auth_register_btn: 'ఖాతా సృష్టించు', auth_switch_to_register: 'ఖాతా లేదా? సృష్టించండి', auth_switch_to_login: 'ఖాతా ఉందా? సైన్ ఇన్ చేయండి', auth_abha_optional: 'ABHA ID ఐచ్ఛికం', dash_tab_audit: 'ఆడిట్', dash_tab_ddi: 'DDI రాడార్', dash_tab_lab: 'ఆరోగ్య ట్రెండ్‌లు', dash_tab_fhir: 'FHIR R4 ఎగుమతి', dash_upload_btn: 'ప్రిస్క్రిప్షన్ అప్‌లోడ్', dash_demo_badge: 'డెమో డేటా — మీ ప్రిస్క్రిప్షన్ అప్‌లోడ్ చేయండి', audit_upload_label: 'ఏదైనా ప్రిస్క్రిప్షన్ ఫోటో అప్‌లోడ్ చేయండి', audit_upload_hint: 'మసకగా, చేతివ్రాత, తక్కువ వెలుతురు స్కాన్‌లు మద్దతు ఉన్నాయి', audit_listen: 'వినండి', audit_playing: 'వినిపిస్తుంది…', audit_doctor: 'డాక్టర్', audit_patient: 'రోగి', audit_diagnosis: 'క్లినికల్ నిర్ధారణ', audit_meds_title: 'సేకరించిన మందులు', audit_chat_placeholder: 'ఈ ప్రిస్క్రిప్షన్ గురించి అడగండి…', audit_canvas_label: 'OpenCV నార్మలైజ్డ్ క్యాన్వాస్', ddi_safe: 'ఏ డ్రగ్ వివాదం కనుగొనబడలేదు', ddi_high_risk: 'తీవ్రమైన డ్రగ్ ఇంటరాక్షన్', ddi_moderate: 'మితమైన జాగ్రత్త', ddi_add_btn: 'మందు జోడించండి', lab_heading: 'దీర్ఘకాలిక ఆరోగ్య ట్రెండ్‌లు', lab_safe_zone: 'సురక్షిత మండలం', lab_danger_zone: 'ప్రమాద మండలం', footer_copy: '© 2026 BharatDoc. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.', footer_mission: 'భారతదేశ పేపర్ వైద్య పర్యావరణాన్ని ABDM ఇంటరాపెరెబిలిటీతో అనుసంధానించడం.', footer_privacy: 'గోప్యతా విధానం', footer_terms: 'సేవా నిబంధనలు' },
  gu: { nav_signin: 'સાઇન ઇન કરો', nav_register: 'ખાતું બનાવો', nav_signout: 'સાઇન આઉટ', hero_badge: 'ભારતના કાગળ-આધારિત તબીબી ઇકોસિસ્ટમને ડિજિટલ સ્વાસ્થ્ય સાથે જોડવું', hero_heading: 'કાગળના પ્રિસ્ક્રિપ્શનમાંથી જન્મેલી ક્લિનિકલ બુદ્ધિ.', hero_subheading: 'કોઈ પણ ભારતીય પ્રિસ્ક્રિપ્શન અથવા લેબ રિપોર્ટ અપલોડ કરો.', hero_cta_primary: 'મફતમાં શરૂ કરો', hero_cta_secondary: 'ડેમો જુઓ', feature_audit_title: 'શૂન્ય-ભ્રમ ઓડિટ', feature_audit_desc: 'દરેક દવા મૂળ ચિઠ્ઠી પર ચોક્કસ પિક્સેલ સ્થાનાંકો સાથે જોડાયેલ છે.', feature_ddi_title: 'દવા સંઘર્ષ રેડાર', feature_ddi_desc: 'ખતરનાક ડ્રગ-ડ્રગ ઇન્ટરેક્શન વાસ્તવિક સમયમાં શોધે છે.', feature_lab_title: 'સ્વાસ્થ્ય વલણ વિશ્લેષણ', feature_lab_desc: '3-12 મહિના માટે HbA1c, બ્લડ સુગર ગ્રાફ.', feature_fhir_title: 'ABDM FHIR R4 નિકાસ', feature_fhir_desc: 'ABHA ડિજિટલ લૉકર એકીકરણ માટે HL7 FHIR R4 બંડલ.', auth_login_heading: 'પુનઃ સ્વાગત', auth_register_heading: 'તમારું ખાતું બનાવો', auth_email: 'ઇમેઇલ સરનામું', auth_password: 'પાસવર્ડ', auth_name: 'પૂર્ણ નામ', auth_otp_label: '8 અંકનો ચકાસણી કોડ દાખલ કરો', auth_send_otp: 'ચકાસણી કોડ મોકલો', auth_verify: 'ચકાસો અને ચાલુ રાખો', auth_login_btn: 'સાઇન ઇન', auth_register_btn: 'ખાતું બનાવો', auth_switch_to_register: 'ખાતું નથી? બનાવો', auth_switch_to_login: 'ખાતું છે? સાઇન ઇન', auth_abha_optional: 'ABHA ID વૈકલ્પિક છે', dash_tab_audit: 'ઓડિટ', dash_tab_ddi: 'DDI રેડાર', dash_tab_lab: 'સ્વાસ્થ્ય વલણ', dash_tab_fhir: 'FHIR R4 નિકાસ', dash_upload_btn: 'પ્રિસ્ક્રિપ્શન અપલોડ', dash_demo_badge: 'ડેમો ડેટા — તમારી પ્રિસ્ક્રિપ્શન અપલોડ કરો', audit_upload_label: 'કોઈ પણ પ્રિસ્ક્રિપ્શન ફોટો અપલોડ કરો', audit_upload_hint: 'ઝાંખી, હસ્તલેખન, ઓછા પ્રકાશ સ્કેન સપોર્ટેડ', audit_listen: 'સાંભળો', audit_playing: 'ચાલી રહ્યું છે…', audit_doctor: 'ડૉક્ટર', audit_patient: 'દર્દી', audit_diagnosis: 'ક્લિનિકલ નિદાન', audit_meds_title: 'કાઢેલ દવાઓ', audit_chat_placeholder: 'આ પ્રિસ્ક્રિપ્શન વિશે પૂછો…', audit_canvas_label: 'OpenCV નોર્મલાઇઝ્ડ કેનવાસ', ddi_safe: 'કોઈ દવા સંઘર્ષ મળ્યો નથી', ddi_high_risk: 'ગંભીર દવા ક્રિયાપ્રતિક્રિયા', ddi_moderate: 'મધ્યમ સાવચેતી', ddi_add_btn: 'દવા ઉમેરો', lab_heading: 'દીર્ઘકાલીન સ્વાસ્થ્ય વલણ', lab_safe_zone: 'સુરક્ષિત ઝોન', lab_danger_zone: 'ભય ઝોન', footer_copy: '© 2026 BharatDoc. બધા અધિકારો અનામત.', footer_mission: 'ભારતના કાગળ-આધારિત તબીબી ઇકોસિસ્ટમને ABDM ઇન્ટરઓપરેબિલિટી સાથે જોડવું.', footer_privacy: 'ગોપનીયતા નીતિ', footer_terms: 'સેવાની શરતો' },
  kn: { nav_signin: 'ಸೈನ್ ಇನ್', nav_register: 'ಖಾತೆ ರಚಿಸಿ', nav_signout: 'ಸೈನ್ ಔಟ್', hero_badge: 'ಭಾರತದ ಕಾಗದ ವೈದ್ಯಕೀಯ ಪರಿಸರವನ್ನು ಡಿಜಿಟಲ್ ಆರೋಗ್ಯಕ್ಕೆ ಸಂಪರ್ಕಿಸುವುದು', hero_heading: 'ಕಾಗದದ ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್‌ಗಳಿಂದ ಹುಟ್ಟಿದ ಕ್ಲಿನಿಕಲ್ ಬುದ್ಧಿಮತ್ತೆ.', hero_subheading: 'ಯಾವುದೇ ಭಾರತೀಯ ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಅಥವಾ ಲ್ಯಾಬ್ ರಿಪೋರ್ಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.', hero_cta_primary: 'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ', hero_cta_secondary: 'ಡೆಮೋ ನೋಡಿ', feature_audit_title: 'ಜೀರೋ-ಹ್ಯಾಲ್ಯುಸಿನೇಶನ್ ಆಡಿಟ್', feature_audit_desc: 'ಪ್ರತಿ ಔಷಧಿ ಮೂಲ ಸ್ಲಿಪ್‌ನಲ್ಲಿ ನಿಖರ ಪಿಕ್ಸೆಲ್ ನಿರ್ದೇಶಾಂಕಗಳಿಗೆ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ.', feature_ddi_title: 'ಡ್ರಗ್ ಸಂಘರ್ಷ ರಾಡಾರ್', feature_ddi_desc: 'ಅಪಾಯಕಾರಿ ಡ್ರಗ್-ಡ್ರಗ್ ಇಂಟರಾಕ್ಶನ್‌ಗಳನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ಪತ್ತೆ ಮಾಡುತ್ತದೆ.', feature_lab_title: 'ಆರೋಗ್ಯ ಟ್ರೆಂಡ್ ವಿಶ್ಲೇಷಣೆ', feature_lab_desc: '3-12 ತಿಂಗಳ HbA1c, ರಕ್ತದ ಸಕ್ಕರೆ ಗ್ರಾಫ್‌ಗಳು.', feature_fhir_title: 'ABDM FHIR R4 ರಫ್ತು', feature_fhir_desc: 'ABHA ಡಿಜಿಟಲ್ ಲಾಕರ್ ಏಕೀಕರಣಕ್ಕಾಗಿ HL7 FHIR R4 ಬಂಡಲ್‌ಗಳು.', auth_login_heading: 'ಮತ್ತೆ ಸ್ವಾಗತ', auth_register_heading: 'ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ', auth_email: 'ಇಮೇಲ್ ವಿಳಾಸ', auth_password: 'ಪಾಸ್‌ವರ್ಡ್', auth_name: 'ಪೂರ್ಣ ಹೆಸರು', auth_otp_label: '8 ಅಂಕಿ ಪರಿಶೀಲನೆ ಕೋಡ್ ನಮೂದಿಸಿ', auth_send_otp: 'ಪರಿಶೀಲನೆ ಕೋಡ್ ಕಳುಹಿಸಿ', auth_verify: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮುಂದುವರಿಸಿ', auth_login_btn: 'ಸೈನ್ ಇನ್', auth_register_btn: 'ಖಾತೆ ರಚಿಸಿ', auth_switch_to_register: 'ಖಾತೆ ಇಲ್ಲವೇ? ರಚಿಸಿ', auth_switch_to_login: 'ಖಾತೆ ಇದೆಯೇ? ಸೈನ್ ಇನ್', auth_abha_optional: 'ABHA ID ಐಚ್ಛಿಕ', dash_tab_audit: 'ಆಡಿಟ್', dash_tab_ddi: 'DDI ರಾಡಾರ್', dash_tab_lab: 'ಆರೋಗ್ಯ ಟ್ರೆಂಡ್‌ಗಳು', dash_tab_fhir: 'FHIR R4 ರಫ್ತು', dash_upload_btn: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಅಪ್‌ಲೋಡ್', dash_demo_badge: 'ಡೆಮೋ ಡೇಟಾ — ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', audit_upload_label: 'ಯಾವುದೇ ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', audit_upload_hint: 'ಮಸುಕಾದ, ಕೈಬರಹ, ಕಡಿಮೆ ಬೆಳಕಿನ ಸ್ಕ್ಯಾನ್‌ಗಳು ಬೆಂಬಲಿತ', audit_listen: 'ಕೇಳಿ', audit_playing: 'ಪ್ಲೇ ಆಗುತ್ತಿದೆ…', audit_doctor: 'ವೈದ್ಯರು', audit_patient: 'ರೋಗಿ', audit_diagnosis: 'ಕ್ಲಿನಿಕಲ್ ರೋಗನಿರ್ಣಯ', audit_meds_title: 'ಹೊರತೆಗೆದ ಔಷಧಿಗಳು', audit_chat_placeholder: 'ಈ ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಬಗ್ಗೆ ಕೇಳಿ…', audit_canvas_label: 'OpenCV ನಾರ್ಮಲೈಸ್ಡ್ ಕ್ಯಾನ್ವಾಸ್', ddi_safe: 'ಯಾವುದೇ ಡ್ರಗ್ ಸಂಘರ್ಷ ಕಂಡುಬಂದಿಲ್ಲ', ddi_high_risk: 'ಗಂಭೀರ ಡ್ರಗ್ ಇಂಟರಾಕ್ಶನ್', ddi_moderate: 'ಮಧ್ಯಮ ಎಚ್ಚರಿಕೆ', ddi_add_btn: 'ಔಷಧಿ ಸೇರಿಸಿ', lab_heading: 'ದೀರ್ಘಕಾಲೀನ ಆರೋಗ್ಯ ಟ್ರೆಂಡ್‌ಗಳು', lab_safe_zone: 'ಸುರಕ್ಷಿತ ವಲಯ', lab_danger_zone: 'ಅಪಾಯ ವಲಯ', footer_copy: '© 2026 BharatDoc. ಎಲ್ಲ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.', footer_mission: 'ಭಾರತದ ಕಾಗದ ವೈದ್ಯಕೀಯ ಪರಿಸರವನ್ನು ABDM ಇಂಟರ್‌ಆಪರೇಬಿಲಿಟಿಗೆ ಸಂಪರ್ಕಿಸುವುದು.', footer_privacy: 'ಗೋಪ್ಯತಾ ನೀತಿ', footer_terms: 'ಸೇವಾ ನಿಯಮಗಳು' },
  ml: { nav_signin: 'സൈൻ ഇൻ', nav_register: 'അക്കൗണ്ട് ഉണ്ടാക്കുക', nav_signout: 'സൈൻ ഔട്ട്', hero_badge: 'ഇന്ത്യയുടെ പേപ്പർ മെഡിക്കൽ ഇക്കോസിസ്റ്റം ഡിജിറ്റൽ ആരോഗ്യവുമായി ബന്ധിപ്പിക്കുന്നു', hero_heading: 'പേപ്പർ പ്രിസ്ക്രിപ്ഷനുകളിൽ നിന്ന് ജനിച്ച ക്ലിനിക്കൽ ബുദ്ധി.', hero_subheading: 'ഏതെങ്കിലും ഇന്ത്യൻ പ്രിസ്ക്രിപ്ഷൻ അല്ലെങ്കിൽ ലാബ് റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക.', hero_cta_primary: 'സൗജന്യമായി ആരംഭിക്കുക', hero_cta_secondary: 'ഡെമോ കാണുക', feature_audit_title: 'സൂൺ-ഹാലൂസിനേഷൻ ഓഡിറ്റ്', feature_audit_desc: 'ഓരോ മരുന്നും യഥാർത്ഥ സ്ലിപ്പിൽ കൃത്യമായ പിക്സൽ കോർഡിനേറ്റുകളുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു.', feature_ddi_title: 'ഡ്രഗ് സംഘർഷ റഡാർ', feature_ddi_desc: 'അപകടകരമായ ഡ്രഗ്-ഡ്രഗ് ഇടപെടലുകൾ യഥാർത്ഥ സമയത്തിൽ കണ്ടെത്തുന്നു.', feature_lab_title: 'ആരോഗ്യ ട്രെൻഡ് വിശകലനം', feature_lab_desc: '3-12 മാസത്തെ HbA1c, രക്തത്തിലെ പഞ്ചസാര ഗ്രാഫുകൾ.', feature_fhir_title: 'ABDM FHIR R4 കയറ്റുമതി', feature_fhir_desc: 'ABHA ഡിജിറ്റൽ ലോക്കർ ഏകീകരണത്തിനായി HL7 FHIR R4 ബണ്ടിലുകൾ.', auth_login_heading: 'തിരിച്ചു സ്വാഗതം', auth_register_heading: 'നിങ്ങളുടെ അക്കൗണ്ട് ഉണ്ടാക്കുക', auth_email: 'ഇമെയിൽ വിലാസം', auth_password: 'പാസ്‌വേഡ്', auth_name: 'പൂർണ്ണ നാമം', auth_otp_label: '8 അക്ക സ്ഥിരീകരണ കോഡ് നൽകുക', auth_send_otp: 'സ്ഥിരീകരണ കോഡ് അയക്കുക', auth_verify: 'സ്ഥിരീകരിക്കുക & തുടരുക', auth_login_btn: 'സൈൻ ഇൻ', auth_register_btn: 'അക്കൗണ്ട് ഉണ്ടാക്കുക', auth_switch_to_register: 'അക്കൗണ്ടില്ലേ? ഉണ്ടാക്കുക', auth_switch_to_login: 'അക്കൗണ്ടുണ്ടോ? സൈൻ ഇൻ', auth_abha_optional: 'ABHA ID ഓപ്ഷണൽ', dash_tab_audit: 'ഓഡിറ്റ്', dash_tab_ddi: 'DDI റഡാർ', dash_tab_lab: 'ആരോഗ്യ ട്രെൻഡുകൾ', dash_tab_fhir: 'FHIR R4 കയറ്റുമതി', dash_upload_btn: 'പ്രിസ്ക്രിപ്ഷൻ അപ്‌ലോഡ്', dash_demo_badge: 'ഡെമോ ഡാറ്റ — നിങ്ങളുടെ പ്രിസ്ക്രിപ്ഷൻ അപ്‌ലോഡ് ചെയ്യുക', audit_upload_label: 'ഏതെങ്കിലും പ്രിസ്ക്രിപ്ഷൻ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക', audit_upload_hint: 'ഇരുണ്ട, കൈയക്ഷരം, കുറഞ്ഞ വെളിച്ചം സ്കാനുകൾ പിന്തുണക്കുന്നു', audit_listen: 'കേൾക്കുക', audit_playing: 'കളിക്കുന്നു…', audit_doctor: 'ഡോക്ടർ', audit_patient: 'രോഗി', audit_diagnosis: 'ക്ലിനിക്കൽ നിർണ്ണയം', audit_meds_title: 'ലഭ്യമായ മരുന്നുകൾ', audit_chat_placeholder: 'ഈ പ്രിസ്ക്രിപ്ഷനെ കുറിച്ച് ചോദിക്കുക…', audit_canvas_label: 'OpenCV നോർമലൈസ്ഡ് കാൻവാസ്', ddi_safe: 'ഡ്രഗ് സംഘർഷമൊന്നും കണ്ടെത്തിയില്ല', ddi_high_risk: 'ഗുരുതരമായ ഡ്രഗ് ഇടപെടൽ', ddi_moderate: 'മിതമായ ജാഗ്രത', ddi_add_btn: 'മരുന്ന് ചേർക്കുക', lab_heading: 'ദീർഘകാല ആരോഗ്യ ട്രെൻഡുകൾ', lab_safe_zone: 'സുരക്ഷിത മേഖല', lab_danger_zone: 'അപകട മേഖല', footer_copy: '© 2026 BharatDoc. എല്ലാ അവകാശങ്ങളും സംരക്ഷിക്കപ്പെട്ടിരിക്കുന്നു.', footer_mission: 'ഇന്ത്യയുടെ പേപ്പർ മെഡിക്കൽ ഇക്കോസിസ്റ്റം ABDM ഇന്ററോപ്പറബിലിറ്റിയുമായി ബന്ധിപ്പിക്കുന്നു.', footer_privacy: 'സ്വകാര്യതാ നയം', footer_terms: 'സേവന നിബന്ധനകൾ' },
  pa: { nav_signin: 'ਸਾਈਨ ਇਨ', nav_register: 'ਖਾਤਾ ਬਣਾਓ', nav_signout: 'ਸਾਈਨ ਆਊਟ', hero_badge: 'ਭਾਰਤ ਦੇ ਕਾਗਜ਼ੀ ਡਾਕਟਰੀ ਈਕੋਸਿਸਟਮ ਨੂੰ ਡਿਜੀਟਲ ਸਿਹਤ ਨਾਲ ਜੋੜਨਾ', hero_heading: 'ਕਾਗਜ਼ੀ ਨੁਸਖਿਆਂ ਤੋਂ ਜਨਮੀ ਕਲੀਨਿਕਲ ਬੁੱਧੀ।', hero_subheading: 'ਕੋਈ ਵੀ ਭਾਰਤੀ ਨੁਸਖਾ ਜਾਂ ਲੈਬ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰੋ।', hero_cta_primary: 'ਮੁਫ਼ਤ ਸ਼ੁਰੂ ਕਰੋ', hero_cta_secondary: 'ਡੈਮੋ ਦੇਖੋ', feature_audit_title: 'ਜ਼ੀਰੋ-ਭਰਮ ਆਡਿਟ', feature_audit_desc: 'ਹਰ ਦਵਾਈ ਅਸਲ ਨੁਸਖੇ ਉੱਤੇ ਸਹੀ ਪਿਕਸਲ ਕੋਆਰਡੀਨੇਟ ਨਾਲ ਜੁੜੀ ਹੈ।', feature_ddi_title: 'ਡਰੱਗ ਟਕਰਾਅ ਰਾਡਾਰ', feature_ddi_desc: 'ਖ਼ਤਰਨਾਕ ਡਰੱਗ-ਡਰੱਗ ਪਰਸਪਰ ਕ੍ਰਿਆਵਾਂ ਅਸਲ ਸਮੇਂ ਵਿੱਚ ਖੋਜਦਾ ਹੈ।', feature_lab_title: 'ਸਿਹਤ ਰੁਝਾਨ ਵਿਸ਼ਲੇਸ਼ਣ', feature_lab_desc: '3-12 ਮਹੀਨਿਆਂ ਲਈ HbA1c, ਬਲੱਡ ਸ਼ੂਗਰ ਗ੍ਰਾਫ਼।', feature_fhir_title: 'ABDM FHIR R4 ਨਿਰਯਾਤ', feature_fhir_desc: 'ABHA ਡਿਜੀਟਲ ਲਾਕਰ ਏਕੀਕਰਨ ਲਈ HL7 FHIR R4 ਬੰਡਲ।', auth_login_heading: 'ਵਾਪਸ ਜੀ ਆਇਆਂ', auth_register_heading: 'ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ', auth_email: 'ਈਮੇਲ ਪਤਾ', auth_password: 'ਪਾਸਵਰਡ', auth_name: 'ਪੂਰਾ ਨਾਮ', auth_otp_label: '8 ਅੰਕੀ ਤਸਦੀਕ ਕੋਡ ਦਰਜ ਕਰੋ', auth_send_otp: 'ਤਸਦੀਕ ਕੋਡ ਭੇਜੋ', auth_verify: 'ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਜਾਰੀ ਰੱਖੋ', auth_login_btn: 'ਸਾਈਨ ਇਨ', auth_register_btn: 'ਖਾਤਾ ਬਣਾਓ', auth_switch_to_register: 'ਖਾਤਾ ਨਹੀਂ? ਬਣਾਓ', auth_switch_to_login: 'ਖਾਤਾ ਹੈ? ਸਾਈਨ ਇਨ', auth_abha_optional: 'ABHA ID ਵਿਕਲਪਿਕ ਹੈ', dash_tab_audit: 'ਆਡਿਟ', dash_tab_ddi: 'DDI ਰਾਡਾਰ', dash_tab_lab: 'ਸਿਹਤ ਰੁਝਾਨ', dash_tab_fhir: 'FHIR R4 ਨਿਰਯਾਤ', dash_upload_btn: 'ਨੁਸਖਾ ਅਪਲੋਡ', dash_demo_badge: 'ਡੈਮੋ ਡੇਟਾ — ਆਪਣਾ ਨੁਸਖਾ ਅਪਲੋਡ ਕਰੋ', audit_upload_label: 'ਕੋਈ ਵੀ ਨੁਸਖਾ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ', audit_upload_hint: 'ਧੁੰਦਲੀ, ਹੱਥ ਲਿਖਤ, ਘੱਟ ਰੋਸ਼ਨੀ ਸਕੈਨ ਸਮਰਥਿਤ', audit_listen: 'ਸੁਣੋ', audit_playing: 'ਵੱਜ ਰਿਹਾ ਹੈ…', audit_doctor: 'ਡਾਕਟਰ', audit_patient: 'ਮਰੀਜ਼', audit_diagnosis: 'ਕਲੀਨਿਕਲ ਨਿਦਾਨ', audit_meds_title: 'ਕੱਢੀਆਂ ਦਵਾਈਆਂ', audit_chat_placeholder: 'ਇਸ ਨੁਸਖੇ ਬਾਰੇ ਪੁੱਛੋ…', audit_canvas_label: 'OpenCV ਨਾਰਮਲਾਈਜ਼ਡ ਕੈਨਵਾਸ', ddi_safe: 'ਕੋਈ ਡਰੱਗ ਟਕਰਾਅ ਨਹੀਂ ਮਿਲਿਆ', ddi_high_risk: 'ਗੰਭੀਰ ਡਰੱਗ ਪਰਸਪਰ ਕ੍ਰਿਆ', ddi_moderate: 'ਦਰਮਿਆਨੀ ਸਾਵਧਾਨੀ', ddi_add_btn: 'ਦਵਾਈ ਜੋੜੋ', lab_heading: 'ਲੰਮੇ ਸਮੇਂ ਦੇ ਸਿਹਤ ਰੁਝਾਨ', lab_safe_zone: 'ਸੁਰੱਖਿਅਤ ਜ਼ੋਨ', lab_danger_zone: 'ਖ਼ਤਰੇ ਦਾ ਜ਼ੋਨ', footer_copy: '© 2026 BharatDoc. ਸਾਰੇ ਅਧਿਕਾਰ ਰਾਖਵੇਂ।', footer_mission: 'ਭਾਰਤ ਦੇ ਕਾਗਜ਼ੀ ਡਾਕਟਰੀ ਈਕੋਸਿਸਟਮ ਨੂੰ ABDM ਇੰਟਰਆਪਰੇਬਿਲਿਟੀ ਨਾਲ ਜੋੜਨਾ।', footer_privacy: 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ', footer_terms: 'ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ' },
  or: { ...{} as Translations, nav_signin: 'ସାଇନ ଇନ', nav_register: 'ଖାତା ତିଆରି କରନ୍ତୁ', nav_signout: 'ସାଇନ ଆଉଟ', hero_badge: 'ଭାରତର କାଗଜ ଚିକିତ୍ସା ପ୍ରଣାଳୀକୁ ଡିଜିଟାଲ ସ୍ୱାସ୍ଥ୍ୟ ସହ ସଂଯୁକ୍ତ', hero_heading: 'କାଗଜ ଚିଠିରୁ ଜନ୍ମ ନେଇଛି ଚିକିତ୍ସା ବୁଦ୍ଧି।', hero_subheading: 'ଯେକୌଣସି ଭାରତୀୟ ପ୍ରେସ୍‌କ୍ରିପ୍ଶନ ଅପଲୋଡ କରନ୍ତୁ।', hero_cta_primary: 'ମାଗଣାରେ ଆରମ୍ଭ', hero_cta_secondary: 'ଡେମୋ ଦେଖନ୍ତୁ', feature_audit_title: 'ଜିରୋ-ହ୍ୟାଲ୍ୟୁସିନେଶନ ଅଡିଟ', feature_audit_desc: 'ପ୍ରତ୍ୟେକ ଔଷଧ ମୂଳ ଚିଠିରେ ସଠିକ ପିକ୍ସେଲ ସହ ସଂଯୁକ୍ତ।', feature_ddi_title: 'ଡ୍ରଗ ବିବାଦ ରଡାର', feature_ddi_desc: 'ବିପଜ୍ଜନକ ଡ୍ରଗ-ଡ୍ରଗ ଇଣ୍ଟରଆକ୍ଶନ ଚିହ୍ନଟ କରେ।', feature_lab_title: 'ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରବଣ ବିଶ୍ଲେଷଣ', feature_lab_desc: '3-12 ମାସ ପାଇଁ HbA1c ଗ୍ରାଫ।', feature_fhir_title: 'ABDM FHIR R4 ରପ୍ତାନି', feature_fhir_desc: 'ABHA ଡିଜିଟାଲ ଲକର ପାଇଁ HL7 FHIR R4 ବଣ୍ଡଲ।', auth_login_heading: 'ପୁଣି ସ୍ୱାଗତ', auth_register_heading: 'ଆପଣଙ୍କ ଖାତା ତିଆରି କରନ୍ତୁ', auth_email: 'ଇମେଲ ଠିକଣା', auth_password: 'ପାସ୍‌ୱର୍ଡ', auth_name: 'ପୂର୍ଣ ନାମ', auth_otp_label: '8 ଅଙ୍କ ସ୍ୟଭ୍ କୋଡ ପ୍ରବେଶ କରନ୍ତୁ', auth_send_otp: 'ସ୍ୟଭ୍ କୋଡ ପଠାନ୍ତୁ', auth_verify: 'ସ୍ୟଭ ଏବଂ ଜାରି', auth_login_btn: 'ସାଇନ ଇନ', auth_register_btn: 'ଖାତା ତିଆରି', auth_switch_to_register: 'ଖାତା ନଥିଲେ? ତିଆରି କରନ୍ତୁ', auth_switch_to_login: 'ଖାତା ଅଛି? ସାଇନ ଇନ', auth_abha_optional: 'ABHA ID ଐଚ୍ଛିକ', dash_tab_audit: 'ଅଡିଟ', dash_tab_ddi: 'DDI ରଡାର', dash_tab_lab: 'ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରବଣ', dash_tab_fhir: 'FHIR R4 ରପ୍ତାନି', dash_upload_btn: 'ଚିଠି ଅପଲୋଡ', dash_demo_badge: 'ଡେମୋ ଡାଟା — ଆପଣଙ୍କ ଚିଠି ଅପଲୋଡ', audit_upload_label: 'ଯେକୌଣସି ଚିଠି ଫଟୋ ଅପଲୋଡ', audit_upload_hint: 'ଧୂଆଁ, ହସ୍ତଲିଖିତ, କମ ଆଲୋକ ସ୍କାନ ସମର୍ଥିତ', audit_listen: 'ଶୁଣନ୍ତୁ', audit_playing: 'ଚାଲୁ ଅଛି…', audit_doctor: 'ଡାକ୍ତର', audit_patient: 'ରୋଗୀ', audit_diagnosis: 'ନିଦାନ', audit_meds_title: 'ଔଷଧ ତାଲିକା', audit_chat_placeholder: 'ଚିଠି ବିଷୟରେ ପ୍ରଶ୍ନ ଦିଅନ୍ତୁ…', audit_canvas_label: 'OpenCV ନର୍ମାଲାଇଜ ଚିତ୍ର', ddi_safe: 'ଡ୍ରଗ ବିବାଦ ନଥିଲା', ddi_high_risk: 'ଗୁରୁତ୍ୱ ଡ୍ରଗ ଇଣ୍ଟରଆକ୍ଶନ', ddi_moderate: 'ମଧ୍ୟମ ସତର୍କ', ddi_add_btn: 'ଔଷଧ ଯୋଡ଼ନ୍ତୁ', lab_heading: 'ଦୀର୍ଘ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରବଣ', lab_safe_zone: 'ସୁରକ୍ଷିତ', lab_danger_zone: 'ବିପଦ', footer_copy: '© 2026 BharatDoc.', footer_mission: 'ABDM ଇଣ୍ଟରଅପ ସହ ଭାରତ ଡ୍ରଗ ଏକ।', footer_privacy: 'ଗୋପନୀୟ ନୀତି', footer_terms: 'ସେବା ସର୍ତ' },
  as: { ...{} as Translations, nav_signin: 'চাইন ইন', nav_register: 'একাউণ্ট বনাওক', nav_signout: 'চাইন আউট', hero_badge: 'ভাৰতৰ কাকতী স্বাস্থ্যসেৱাক ডিজিটেল স্বাস্থ্যৰ সৈতে সংযুক্ত কৰা', hero_heading: 'কাকতী প্ৰেচক্ৰিপচনৰ পৰা জন্ম হোৱা ক্লিনিকেল বুদ্ধি।', hero_subheading: 'যিকোনো ভাৰতীয় প্ৰেচক্ৰিপচন আপলোড কৰক।', hero_cta_primary: 'বিনামূলীয়াকৈ আৰম্ভ কৰক', hero_cta_secondary: 'ডেমো চাওক', feature_audit_title: 'জিৰো-হেলুচিনেচন অডিট', feature_audit_desc: 'প্ৰতিটো ঔষধ মূল চিলিপত সঠিক পিক্সেলৰ সৈতে সংযুক্ত।', feature_ddi_title: 'ড্ৰাগ সংঘৰ্ষ ৰাডাৰ', feature_ddi_desc: 'বিপজ্জনক ড্ৰাগ পাৰস্পৰিক ক্ৰিয়া ধৰা পেলায়।', feature_lab_title: 'স্বাস্থ্য ধাৰা বিশ্লেষণ', feature_lab_desc: 'HbA1c গ্ৰাফ।', feature_fhir_title: 'ABDM FHIR R4 ৰপ্তানি', feature_fhir_desc: 'ABHA ডিজিটেল লকাৰৰ বাবে FHIR R4।', auth_login_heading: 'পুনৰ স্বাগতম', auth_register_heading: 'আপোনাৰ একাউণ্ট বনাওক', auth_email: 'ইমেইল ঠিকনা', auth_password: 'পাছৱৰ্ড', auth_name: 'সম্পূৰ্ণ নাম', auth_otp_label: '8 সংখ্যাৰ কোড দিয়ক', auth_send_otp: 'কোড পঠাওক', auth_verify: 'পৰীক্ষা কৰক', auth_login_btn: 'চাইন ইন', auth_register_btn: 'একাউণ্ট বনাওক', auth_switch_to_register: 'একাউণ্ট নাই? বনাওক', auth_switch_to_login: 'একাউণ্ট আছে? চাইন ইন', auth_abha_optional: 'ABHA ID ঐচ্ছিক', dash_tab_audit: 'অডিট', dash_tab_ddi: 'DDI ৰাডাৰ', dash_tab_lab: 'স্বাস্থ্য ধাৰা', dash_tab_fhir: 'FHIR R4', dash_upload_btn: 'প্ৰেচক্ৰিপচন আপলোড', dash_demo_badge: 'ডেমো — আপোনাৰ প্ৰেচক্ৰিপচন আপলোড কৰক', audit_upload_label: 'প্ৰেচক্ৰিপচন ফটো আপলোড কৰক', audit_upload_hint: 'যিকোনো স্কেন সমৰ্থিত', audit_listen: 'শুনক', audit_playing: 'চলিছে…', audit_doctor: 'চিকিৎসক', audit_patient: 'ৰোগী', audit_diagnosis: 'নিদান', audit_meds_title: 'ঔষধ', audit_chat_placeholder: 'প্ৰশ্ন কৰক…', audit_canvas_label: 'কেনভাছ', ddi_safe: 'কোনো সংঘৰ্ষ নাই', ddi_high_risk: 'গুৰুতৰ সংঘৰ্ষ', ddi_moderate: 'মধ্যমীয়া সতৰ্কতা', ddi_add_btn: 'ঔষধ যোগ কৰক', lab_heading: 'স্বাস্থ্য ধাৰা', lab_safe_zone: 'সুৰক্ষিত', lab_danger_zone: 'বিপজ্জনক', footer_copy: '© 2026 BharatDoc.', footer_mission: 'ABDM সৈতে ভাৰতীয় স্বাস্থ্য।', footer_privacy: 'গোপনীয়তা', footer_terms: 'চৰ্তসমূহ' },
  ur: { nav_signin: 'سائن ان', nav_register: 'اکاؤنٹ بنائیں', nav_signout: 'سائن آؤٹ', hero_badge: 'ہندوستان کے کاغذی طبی نظام کو ڈیجیٹل صحت سے جوڑنا', hero_heading: 'کاغذی نسخوں سے پیدا ہوئی طبی ذہانت۔', hero_subheading: 'کوئی بھی ہندوستانی نسخہ یا لیب رپورٹ اپلوڈ کریں۔', hero_cta_primary: 'مفت شروع کریں', hero_cta_secondary: 'ڈیمو دیکھیں', feature_audit_title: 'صفر-وہم آڈٹ', feature_audit_desc: 'ہر دوا اصل نسخے پر درست پکسل کوآرڈینیٹس سے جڑی ہے۔', feature_ddi_title: 'دوا تنازعہ ریڈار', feature_ddi_desc: 'خطرناک دوا-دوا تعامل حقیقی وقت میں پکڑتا ہے۔', feature_lab_title: 'صحت کے رجحانات', feature_lab_desc: '3-12 ماہ کے لیے HbA1c گراف۔', feature_fhir_title: 'ABDM FHIR R4 برآمد', feature_fhir_desc: 'ABHA ڈیجیٹل لاکر کے لیے HL7 FHIR R4 بنڈل۔', auth_login_heading: 'واپس خوش آمدید', auth_register_heading: 'اپنا اکاؤنٹ بنائیں', auth_email: 'ای میل ایڈریس', auth_password: 'پاس ورڈ', auth_name: 'پورا نام', auth_otp_label: '8 ہندسوں کا تصدیقی کوڈ داخل کریں', auth_send_otp: 'تصدیقی کوڈ بھیجیں', auth_verify: 'تصدیق کریں اور جاری رکھیں', auth_login_btn: 'سائن ان', auth_register_btn: 'اکاؤنٹ بنائیں', auth_switch_to_register: 'اکاؤنٹ نہیں؟ بنائیں', auth_switch_to_login: 'اکاؤنٹ ہے؟ سائن ان', auth_abha_optional: 'ABHA ID اختیاری ہے', dash_tab_audit: 'آڈٹ', dash_tab_ddi: 'DDI ریڈار', dash_tab_lab: 'صحت کے رجحانات', dash_tab_fhir: 'FHIR R4 برآمد', dash_upload_btn: 'نسخہ اپلوڈ', dash_demo_badge: 'ڈیمو ڈیٹا — اپنا نسخہ اپلوڈ کریں', audit_upload_label: 'کوئی بھی نسخے کی فوٹو اپلوڈ کریں', audit_upload_hint: 'دھندلی، ہاتھ سے لکھی، کم روشنی اسکین معاونت', audit_listen: 'سنیں', audit_playing: 'چل رہا ہے…', audit_doctor: 'ڈاکٹر', audit_patient: 'مریض', audit_diagnosis: 'طبی تشخیص', audit_meds_title: 'نکالی گئی ادویات', audit_chat_placeholder: 'اس نسخے کے بارے میں پوچھیں…', audit_canvas_label: 'OpenCV نارملائزڈ کینوس', ddi_safe: 'کوئی دوا تنازعہ نہیں', ddi_high_risk: 'شدید دوا تعامل', ddi_moderate: 'معتدل احتیاط', ddi_add_btn: 'دوا شامل کریں', lab_heading: 'طویل مدتی صحت کے رجحانات', lab_safe_zone: 'محفوظ علاقہ', lab_danger_zone: 'خطرے کا علاقہ', footer_copy: '© 2026 BharatDoc. تمام حقوق محفوظ۔', footer_mission: 'ہندوستان کے کاغذی طبی نظام کو ABDM سے جوڑنا۔', footer_privacy: 'رازداری پالیسی', footer_terms: 'خدمت کی شرائط' },
  sa: {
    nav_signin: 'प्रवेशः', nav_register: 'खाता रचयतु', nav_signout: 'निर्गच्छतु',
    hero_badge: 'भारतस्य कागद-चिकित्सा-पर्यावरणं ABDM-स्वास्थ्येन सह योजयति',
    hero_heading: 'कागद-पत्रेभ्यः जन्मिता चिकित्सा-प्रज्ञा।',
    hero_subheading: 'कस्यापि भारतीय-पत्रं लोड्यतु।',
    hero_cta_primary: 'निःशुल्कम् आरभ्यताम्', hero_cta_secondary: 'दृश्यताम्',
    feature_audit_title: 'शून्य-भ्रान्ति-परीक्षा', feature_audit_desc: 'प्रत्येकं औषधं मूल-पत्रे अचूक-पिक्सेल-सह बद्धम्।',
    feature_ddi_title: 'ड्रग-विरोध-रडार', feature_ddi_desc: 'खतरनाक ड्रग-ड्रग-संयोगान् वास्तव-समये गृह्णाति।',
    feature_lab_title: 'स्वास्थ्य-प्रवृत्ति-विश्लेषणम्', feature_lab_desc: '3-12 मासेभ्यः HbA1c आलेखः।',
    feature_fhir_title: 'ABDM FHIR R4 निर्यातः', feature_fhir_desc: 'ABHA-लॉकर-एकीकरणाय FHIR R4।',
    auth_login_heading: 'पुनः स्वागतम्', auth_register_heading: 'खाता रचयतु',
    auth_email: 'ई-मेल-विलासः', auth_password: 'गुप्त-शब्दः', auth_name: 'पूर्ण-नाम',
    auth_otp_label: '8-संख्या-कूटः', auth_send_otp: 'कूटं प्रेषयतु', auth_verify: 'परीक्ष्यतु',
    auth_login_btn: 'प्रविशतु', auth_register_btn: 'खाता रचयतु',
    auth_switch_to_register: 'खाता नास्ति? रचयतु', auth_switch_to_login: 'खाता अस्ति? प्रविशतु',
    auth_abha_optional: 'ABHA ID ऐच्छिकम्',
    dash_tab_audit: 'परीक्षा', dash_tab_ddi: 'DDI रडार', dash_tab_lab: 'स्वास्थ्य', dash_tab_fhir: 'FHIR R4',
    dash_upload_btn: 'पत्रं लोड्यतु', dash_demo_badge: 'डेमो-डेटा',
    audit_upload_label: 'पत्रं लोड्यतु', audit_upload_hint: 'स्कान समर्थितम्',
    audit_listen: 'श्रूयताम्', audit_playing: 'चलति…', audit_doctor: 'चिकित्सकः',
    audit_patient: 'रोगी', audit_diagnosis: 'निदानम्', audit_meds_title: 'औषधानि',
    audit_chat_placeholder: 'प्रश्नं पृच्छतु…', audit_canvas_label: 'चित्रम्',
    ddi_safe: 'कोऽपि विरोधः नास्ति', ddi_high_risk: 'गुरुतरः विरोधः', ddi_moderate: 'सावधानता',
    ddi_add_btn: 'औषधं योजयतु', lab_heading: 'स्वास्थ्य-प्रवृत्तयः',
    lab_safe_zone: 'सुरक्षितम्', lab_danger_zone: 'खतरा',
    footer_copy: '© 2026 BharatDoc.', footer_mission: 'ABDM सह भारतीय-स्वास्थ्यम्।',
    footer_privacy: 'गोपनीयता', footer_terms: 'नियमाः',
  },
  // Fallback remaining langs — resolved inline (no forward-reference to T)
  ks: null as any,
  sd: null as any,
  ne: null as any,
  si: null as any,
  mni: null as any,
  kok: null as any,
  doi: null as any,
  bho: null as any,
} as Record<LangCode, Translations>;

// Fill in null fallbacks after T is fully declared
T['ks'] = T['hi'];
T['ne'] = T['hi'];
T['doi'] = T['hi'];
T['bho'] = T['hi'];
T['sd'] = T['ur'];
T['si'] = T['en'];
T['mni'] = T['bn'];
T['kok'] = T['mr'];

export function useTranslation(lang: LangCode): Translations {
  return T[lang] ?? T['en'];
}

export { T };

