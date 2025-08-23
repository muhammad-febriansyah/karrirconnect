import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ReCaptcha from '@/components/ui/recaptcha';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface RegisterModalProps {
    children: React.ReactNode;
}

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
    'g-recaptcha-response': string;
}

export default function RegisterModal({ children }: RegisterModalProps) {
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { settings, recaptcha } = usePage<SharedData>().props;
    
    const [data, setData] = useState<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
        'g-recaptcha-response': '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const registerData = {
            ...data,
            role: 'user' // Set role sebagai 'user' untuk employee
        };

        router.post('/register', registerData, {
            onSuccess: () => {
                setOpen(false);
                setData({ 
                    name: '', 
                    email: '', 
                    password: '', 
                    password_confirmation: '', 
                    terms: false,
                    'g-recaptcha-response': ''
                });
            },
            onError: (errors) => {
                setErrors(errors);
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const handleChange = (field: keyof RegisterForm, value: string | boolean) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-transparent">
                        Daftar Akun Employee
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        Buat akun employee untuk melamar pekerjaan dan mengelola profil karir Anda
                    </DialogDescription>
                </DialogHeader>

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {Object.values(errors)[0]}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Nama Lengkap
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="Masukkan nama lengkap"
                                value={data.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`pl-10 h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-[#2347FA]/20 ${
                                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#2347FA]'
                                }`}
                                required
                            />
                        </div>
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={data.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={`pl-10 h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-[#2347FA]/20 ${
                                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#2347FA]'
                                }`}
                                required
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Minimal 8 karakter"
                                value={data.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                className={`pl-10 pr-12 h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-[#2347FA]/20 ${
                                    errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#2347FA]'
                                }`}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                            Konfirmasi Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? "text" : "password"}
                                placeholder="Ulangi password"
                                value={data.password_confirmation}
                                onChange={(e) => handleChange('password_confirmation', e.target.value)}
                                className={`pl-10 pr-12 h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-[#2347FA]/20 ${
                                    errors.password_confirmation ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#2347FA]'
                                }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                        )}
                    </div>

                    <div className="flex items-start space-x-2">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={data.terms}
                            onChange={(e) => handleChange('terms', e.target.checked)}
                            className="h-4 w-4 text-[#2347FA] border-gray-300 rounded focus:ring-[#2347FA] focus:ring-2 mt-1"
                            required
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-600 leading-5">
                            Saya menyetujui{' '}
                            <a href="/terms-of-service" target="_blank" className="text-[#2347FA] hover:underline">
                                Syarat & Ketentuan
                            </a>
                            {' '}dan{' '}
                            <a href="/privacy-policy" target="_blank" className="text-[#2347FA] hover:underline">
                                Kebijakan Privasi
                            </a>
                        </Label>
                    </div>
                    {errors.terms && (
                        <p className="text-sm text-red-600">{errors.terms}</p>
                    )}

                    <div className="space-y-2">
                        <ReCaptcha
                            siteKey={recaptcha?.site_key || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                            onChange={(token) => handleChange('g-recaptcha-response', token || '')}
                            size="normal"
                            theme="light"
                        />
                        {errors['g-recaptcha-response'] && (
                            <p className="text-sm text-red-600">{errors['g-recaptcha-response']}</p>
                        )}
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            type="submit"
                            disabled={loading || !data.terms || !data['g-recaptcha-response']}
                            className="w-full h-12 bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1e3af7] hover:to-[#3451f9] text-white font-semibold rounded-xl shadow-lg shadow-[#2347FA]/30 transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Mendaftar...</span>
                                </div>
                            ) : (
                                'Daftar Sekarang'
                            )}
                        </Button>
                    </motion.div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Sudah punya akun?{' '}
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-[#2347FA] hover:text-[#1e3af7] font-semibold transition-colors"
                            >
                                Masuk sekarang
                            </button>
                        </p>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}