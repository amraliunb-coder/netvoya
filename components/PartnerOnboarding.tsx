import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Building2, 
  User, 
  Globe, 
  Mail, 
  Loader2, 
  Smartphone,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  X
} from 'lucide-react';
import Button from './ui/Button';
import { registerUser, ApiError } from '../services/api';
import { RegistrationData, ValidationErrors } from '../types';

interface PartnerOnboardingProps {
  onBack: () => void;
  onComplete: () => void;
}

const PartnerOnboarding: React.FC<PartnerOnboardingProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    country: 'United States',
    vatId: '',
    address1: '',
    address2: '',
    city: '',
    zip: '',
    state: '',
    role: 'partner' as 'partner'
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  // Validation Logic
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const validateUsername = (username: string) => /^[a-zA-Z0-9]{3,}$/.test(username);

  const validateStep1 = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (!validateUsername(formData.username)) {
      errors.username = "Min 3 chars, alphanumeric only";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      errors.password = "Min 8 chars, 1 Upper, 1 Lower, 1 Number";
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: ValidationErrors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: ValidationErrors = {};
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    } else if (formData.companyName.trim().length < 2) {
      errors.companyName = "Company name too short";
    }
    
    if (!termsAccepted) errors.terms = "You must accept the terms";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    setApiError(null);
    let isValid = false;
    
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();
    
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setApiError(null);
    if (!validateStep3()) return;

    setLoading(true);

    const registrationPayload: RegistrationData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      companyName: formData.companyName,
      address: `${formData.address1} ${formData.address2}`.trim(),
      city: formData.city,
      zip: formData.zip,
      country: formData.country,
      vatId: formData.vatId,
      role: 'partner'
    };

    try {
      await registerUser(registrationPayload);
      
      // Clear sensitive data
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      
      // Show success step
      setStep(4);
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";
      
      // Map API errors to user friendly messages
      if (error instanceof ApiError) {
         errorMessage = error.message;
      }
      
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user types
    if (validationErrors[e.target.name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 mb-8 text-sm">
      <span className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${step >= 1 ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/20 text-slate-500'}`}>1</span>
      <div className={`w-12 h-px transition-colors duration-300 ${step >= 2 ? 'bg-orange-500' : 'bg-white/10'}`}></div>
      <span className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${step >= 2 ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/20 text-slate-500'}`}>2</span>
      <div className={`w-12 h-px transition-colors duration-300 ${step >= 3 ? 'bg-orange-500' : 'bg-white/10'}`}></div>
      <span className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${step >= 3 ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/20 text-slate-500'}`}>3</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col lg:flex-row relative overflow-hidden font-sans">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in-view">
           <Loader2 size={48} className="text-primary animate-spin mb-4" />
           <p className="text-white font-medium text-lg">Creating your account...</p>
           <p className="text-slate-400 text-sm">Please wait a moment</p>
        </div>
      )}

      {/* Left Panel: Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-12 relative z-20 bg-[#0A0A0A]">
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            disabled={loading}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          
          {step < 4 && (
            <div className="mb-8">
              <img 
                src="https://res.cloudinary.com/drzid08rg/image/upload/d91fcd24-8cf6-4adf-b9df-7312622185a8_ihpxqo.png" 
                alt="NetVoya" 
                className="h-10 w-auto object-contain mb-8"
              />
              {renderStepIndicator()}
            </div>
          )}

          {/* Error Banner */}
          {apiError && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 animate-in-view">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium">Registration Failed</div>
                <div className="text-xs opacity-90">{apiError}</div>
              </div>
              <button onClick={() => setApiError(null)} className="text-red-400 hover:text-red-300">
                <X size={16} />
              </button>
            </div>
          )}

          {/* STEP 1: Account Credentials */}
          {step === 1 && (
            <div className="animate-in-view">
              <h2 className="text-3xl font-display font-bold text-white mb-2">Create your account</h2>
              <p className="text-slate-400 mb-8">Enter your credentials to get started.</p>

              <div className="space-y-5">
                {/* Username */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-slate-500">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="business.name"
                      className={`w-full bg-[#171717] border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors ${validationErrors.username ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                      autoFocus
                    />
                  </div>
                  {validationErrors.username && <p className="text-xs text-red-400 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {validationErrors.username}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-slate-500">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className={`w-full bg-[#171717] border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors ${validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                    />
                  </div>
                  {validationErrors.email && <p className="text-xs text-red-400 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {validationErrors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-slate-500">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 8 chars, Upper, Lower & Number"
                      className={`w-full bg-[#171717] border rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-orange-500 transition-colors ${validationErrors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {validationErrors.password && <p className="text-xs text-red-400 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {validationErrors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-slate-500">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className={`w-full bg-[#171717] border rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-orange-500 transition-colors ${validationErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                    />
                     <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && <p className="text-xs text-red-400 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {validationErrors.confirmPassword}</p>}
                </div>

                <Button 
                  onClick={handleNext} 
                  className="w-full justify-center py-4 text-lg mt-4"
                >
                  Continue
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account? <button onClick={onBack} className="text-orange-500 hover:underline">Go to login</button>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Personal Info */}
          {step === 2 && (
            <div className="animate-in-view">
              <h2 className="text-3xl font-display font-bold text-white mb-2">Personal Details</h2>
              <p className="text-slate-400 mb-8">Who should we contact regarding this account?</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-slate-500">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full bg-[#171717] border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors ${validationErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                    />
                    {validationErrors.firstName && <p className="text-xs text-red-400 ml-1">{validationErrors.firstName}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-slate-500">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full bg-[#171717] border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors ${validationErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                    />
                    {validationErrors.lastName && <p className="text-xs text-red-400 ml-1">{validationErrors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-slate-500">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="w-24 bg-[#171717] border border-white/10 rounded-xl flex items-center justify-center text-slate-300 text-sm">
                      <span className="mr-1">🇺🇸</span> +1
                    </div>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      className={`flex-1 bg-[#171717] border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors ${validationErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                    />
                  </div>
                  {validationErrors.phone && <p className="text-xs text-red-400 ml-1">{validationErrors.phone}</p>}
                </div>

                <Button 
                  onClick={handleNext} 
                  className="w-full justify-center py-4 mt-4"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Company Info */}
          {step === 3 && (
            <div className="animate-in-view">
              <h2 className="text-3xl font-display font-bold text-white mb-2">Company Details</h2>
              <p className="text-slate-400 mb-8">This information will be used for invoicing and tax compliance.</p>

              <div className="space-y-4">
                {/* Company Name */}
                <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-slate-500">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`w-full bg-[#171717] border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors ${validationErrors.companyName ? 'border-red-500 focus:border-red-500' : 'border-white/10'}`}
                      />
                    </div>
                    {validationErrors.companyName && <p className="text-xs text-red-400 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {validationErrors.companyName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-slate-500">Country</label>
                    <select 
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-[#171717] border border-white/10 rounded-xl py-3 px-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-slate-500">VAT / Tax ID</label>
                    <input 
                      type="text"
                      name="vatId"
                      value={formData.vatId}
                      onChange={handleChange}
                      className="w-full bg-[#171717] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-slate-500">Address</label>
                  <input 
                    type="text"
                    name="address1"
                    placeholder="Street Address"
                    value={formData.address1}
                    onChange={handleChange}
                    className="w-full bg-[#171717] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors mb-2"
                  />
                  <input 
                    type="text"
                    name="address2"
                    placeholder="Apt, Suite, Unit (Optional)"
                    value={formData.address2}
                    onChange={handleChange}
                    className="w-full bg-[#171717] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#171717] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <input 
                    type="text"
                    name="zip"
                    placeholder="Postal Code"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full bg-[#171717] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      setValidationErrors(prev => ({...prev, terms: undefined}));
                    }}
                    className="rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500" 
                  />
                  <label htmlFor="terms" className={`text-xs ${validationErrors.terms ? 'text-red-400' : 'text-slate-400'}`}>
                    I accept the <a href="#" className="text-white underline">Terms and Conditions</a>
                  </label>
                </div>

                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="w-full justify-center py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Registration
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="animate-in-view text-center">
               <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                 <CheckCircle size={40} />
               </div>
               <h2 className="text-3xl font-display font-bold text-white mb-4">Account Created!</h2>
               <p className="text-slate-400 mb-8 max-w-md mx-auto">
                 Welcome to NetVoya. Your account has been successfully set up. You can now access the partner portal to request inventory and manage eSIMs.
               </p>
               
               <Button onClick={onComplete} className="w-full justify-center py-4 text-lg">
                 Enter Dashboard
               </Button>
            </div>
          )}

        </div>
        
        <div className="mt-8 text-center text-xs text-slate-600 font-mono">
           &copy; 2024 NetVoya Enterprise.
        </div>
      </div>

      {/* Right Panel: Visuals */}
      <div className="hidden lg:flex w-1/2 bg-[#121212] relative items-center justify-center p-12 overflow-hidden border-l border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-lg text-center">
          
          {/* Dynamic Graphic based on Step */}
          <div className="h-64 mb-12 flex items-center justify-center">
            {step === 1 && (
               <div className="relative">
                 <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
                 <Globe size={180} className="text-white relative z-10 opacity-80" strokeWidth={0.5} />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_20px_#F97316] animate-ping"></div>
                 </div>
               </div>
            )}
            {step === 2 && (
               <div className="relative w-64 h-48">
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-white/5 rounded-t-2xl border-t border-x border-white/10 backdrop-blur-md flex flex-col items-center pt-8">
                   <User size={48} className="text-slate-400 mb-2" />
                   <div className="w-24 h-2 bg-white/10 rounded-full"></div>
                   <div className="w-16 h-2 bg-white/10 rounded-full mt-2"></div>
                 </div>
                 <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-500/10 rounded-xl border border-orange-500/20 flex items-center justify-center animate-bounce">
                    <CheckCircle className="text-orange-500" />
                 </div>
               </div>
            )}
             {step === 3 && (
               <div className="relative">
                 <div className="w-48 h-48 border border-dashed border-white/20 rounded-full animate-spin-slow flex items-center justify-center">
                    <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center bg-white/5 backdrop-blur">
                       <Building2 size={48} className="text-orange-500" />
                    </div>
                 </div>
                 <div className="absolute top-0 left-0 w-full h-full animate-pulse opacity-20 bg-gradient-to-tr from-transparent via-orange-500/10 to-transparent"></div>
               </div>
            )}
            {step === 4 && (
               <div className="relative">
                  <Smartphone size={160} className="text-slate-700" strokeWidth={1} />
                  <div className="absolute top-4 left-4 right-4 bottom-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded opacity-20"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-2xl">
                    <img src="https://res.cloudinary.com/drzid08rg/image/upload/d91fcd24-8cf6-4adf-b9df-7312622185a8_ihpxqo.png" className="w-8 h-8 object-contain" />
                  </div>
               </div>
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">
            {step === 1 && "Grow your business with the global leader in corporate eSIMs"}
            {step === 2 && "Personalized support for your agency needs"}
            {step === 3 && "Your company, connected without borders"}
            {step === 4 && "Start enjoying global connectivity with your team"}
          </h3>
          <p className="text-slate-400">
            Join 50+ partners offering seamless connectivity to travelers worldwide.
          </p>

        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default PartnerOnboarding;