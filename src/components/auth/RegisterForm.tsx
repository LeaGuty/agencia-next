'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface RegisterFields {
  name: string;
  dni: string;
  email: string;
  password: string;
  role: 'agent' | 'client';
}

export default function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    mode: 'onTouched',
    defaultValues: { role: 'client' },
  });

  const onSubmit = async (data: RegisterFields) => {
    setServerError('');
    setLoading(true);
    try {
      await authService.register(data);
      router.push('/login?registered=true');
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || t('register.errors.registrationError')
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'mt-1 block w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black';
  const inputNormal = `${inputBase} border-gray-300`;
  const inputError = `${inputBase} border-red-400 bg-red-50`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-600">{t('register.title')}</h2>
            <p className="text-gray-500 mt-2">{t('register.subtitle')}</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                {t('register.fullName')}
              </label>
              <input
                type="text"
                className={errors.name ? inputError : inputNormal}
                placeholder={t('register.fullNamePlaceholder')}
                {...register('name', {
                  required: t('register.errors.nameRequired'),
                  minLength: {
                    value: 2,
                    message: t('register.errors.nameMin'),
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* DNI / RUT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                {t('register.dniRut')}
              </label>
              <input
                type="text"
                className={errors.dni ? inputError : inputNormal}
                placeholder={t('register.dniPlaceholder')}
                {...register('dni', {
                  required: t('register.errors.dniRequired'),
                  minLength: {
                    value: 5,
                    message: t('register.errors.dniMin'),
                  },
                })}
              />
              {errors.dni && (
                <p className="mt-1 text-xs text-red-600">{errors.dni.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                {t('register.email')}
              </label>
              <input
                type="email"
                className={errors.email ? inputError : inputNormal}
                placeholder={t('register.emailPlaceholder')}
                {...register('email', {
                  required: t('register.errors.emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('register.errors.emailInvalid'),
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                {t('register.password')}
              </label>
              <input
                type="password"
                className={errors.password ? inputError : inputNormal}
                placeholder={t('register.passwordPlaceholder')}
                {...register('password', {
                  required: t('register.errors.passwordRequired'),
                  minLength: {
                    value: 6,
                    message: t('register.errors.passwordMin'),
                  },
                  validate: (val) => {
                    const hasUpper = /[A-Z]/.test(val);
                    const hasLower = /[a-z]/.test(val);
                    const hasDigit = /\d/.test(val);
                    return (
                      (hasUpper && hasLower && hasDigit) ||
                      t('register.errors.passwordStrength')
                    );
                  },
                })}
              />
              <p className="text-[10px] text-gray-500 mt-1">
                {t('register.passwordHint')}
              </p>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                {t('register.role')}
              </label>
              <select
                className={`${inputNormal} bg-white`}
                {...register('role')}
              >
                <option value="client">{t('register.roleClient')}</option>
                <option value="agent">{t('register.roleAgent')}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? t('register.submitting') : t('register.submit')}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            {t('register.hasAccount')}{' '}
            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500">
              {t('register.loginLink')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
