'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { travelService, authService } from '@/services/api';
import { User } from '@/types';

interface CreateRequestFields {
  linkedUserId: string;
  dni: string;
  passengerName: string;
  origin: string;
  destination: string;
  tripType: 'negocios' | 'turismo' | 'otros';
  departureDate: string;
  returnDate: string;
  status: 'pendiente' | 'en_proceso' | 'finalizada';
}

interface CreateRequestFormProps {
  onSuccess: () => void;
}

export default function CreateRequestForm({ onSuccess }: CreateRequestFormProps) {
  const { t } = useTranslation();
  const [clients, setClients] = useState<User[]>([]);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateRequestFields>({
    mode: 'onTouched',
    defaultValues: {
      tripType: 'turismo',
      status: 'pendiente',
    },
  });

  const departureDate = watch('departureDate');

  useEffect(() => {
    authService
      .getClients()
      .catch((err) => console.error('Error loading clients', err))
      .then((data) => data && setClients(data));
  }, []);

  const handleClientChange = (userId: string) => {
    const client = clients.find((c) => c.id === userId);
    if (client) {
      setValue('linkedUserId', client.id, { shouldValidate: true });
      setValue('passengerName', client.name, { shouldValidate: true });
      setValue('dni', client.dni ?? '');
    }
  };

  const onSubmit = async (data: CreateRequestFields) => {
    setServerError('');
    setLoading(true);
    try {
      const selectedClient = clients.find((c) => c.id === data.linkedUserId);
      await travelService.create({
        ...data,
        linkedUserName: selectedClient?.name ?? data.passengerName,
      });
      reset({ tripType: 'turismo', status: 'pendiente' });
      onSuccess();
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || t('createRequest.errors.createError')
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'mt-1 block w-full rounded-md border px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all';
  const inputNormal = `${inputBase} border-gray-300`;
  const inputErrorClass = `${inputBase} border-red-400 bg-red-50`;
  const readOnlyClass =
    'mt-1 block w-full rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-gray-500';

  const tripTypes: Array<'turismo' | 'negocios' | 'otros'> = [
    'turismo',
    'negocios',
    'otros',
  ];
  const statuses: Array<'pendiente' | 'en_proceso' | 'finalizada'> = [
    'pendiente',
    'en_proceso',
    'finalizada',
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
      noValidate
    >
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        {t('createRequest.title')}
      </h3>

      {serverError && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client selector */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('createRequest.client')}
          </label>
          <select
            className={
              errors.linkedUserId ? inputErrorClass : inputNormal
            }
            {...register('linkedUserId', {
              required: t('createRequest.errors.clientRequired'),
            })}
            onChange={(e) => handleClientChange(e.target.value)}
          >
            <option value="">{t('createRequest.clientPlaceholder')}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.dni})
              </option>
            ))}
          </select>
          {errors.linkedUserId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.linkedUserId.message}
            </p>
          )}
        </div>

        {/* DNI — read-only, auto-filled */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('createRequest.dniPassenger')}
          </label>
          <input
            type="text"
            readOnly
            className={readOnlyClass}
            {...register('dni')}
          />
        </div>

        {/* Passenger Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('createRequest.passengerName')}
          </label>
          <input
            type="text"
            className={errors.passengerName ? inputErrorClass : inputNormal}
            {...register('passengerName', {
              required: t('createRequest.errors.passengerRequired'),
            })}
          />
          {errors.passengerName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.passengerName.message}
            </p>
          )}
        </div>

        {/* Origin */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('createRequest.origin')}
          </label>
          <input
            type="text"
            placeholder={t('createRequest.originPlaceholder')}
            className={errors.origin ? inputErrorClass : inputNormal}
            {...register('origin', {
              required: t('createRequest.errors.originRequired'),
              minLength: {
                value: 2,
                message: t('createRequest.errors.originMin'),
              },
            })}
          />
          {errors.origin && (
            <p className="mt-1 text-xs text-red-600">{errors.origin.message}</p>
          )}
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('createRequest.destination')}
          </label>
          <input
            type="text"
            placeholder={t('createRequest.destinationPlaceholder')}
            className={errors.destination ? inputErrorClass : inputNormal}
            {...register('destination', {
              required: t('createRequest.errors.destinationRequired'),
              minLength: {
                value: 2,
                message: t('createRequest.errors.destinationMin'),
              },
            })}
          />
          {errors.destination && (
            <p className="mt-1 text-xs text-red-600">
              {errors.destination.message}
            </p>
          )}
        </div>

        {/* Trip Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('createRequest.tripType')}
          </label>
          <select className={inputNormal} {...register('tripType')}>
            {tripTypes.map((type) => (
              <option key={type} value={type}>
                {t(`createRequest.tripTypes.${type}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('createRequest.status')}
          </label>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {statuses.map((status) => (
              <label key={status} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  value={status}
                  {...register('status')}
                />
                <span className="ml-2 text-sm text-gray-700">
                  {t(`createRequest.statuses.${status}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('createRequest.departureDate')}
          </label>
          <input
            type="datetime-local"
            className={errors.departureDate ? inputErrorClass : inputNormal}
            {...register('departureDate', {
              required: t('createRequest.errors.departureDateRequired'),
            })}
          />
          {errors.departureDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.departureDate.message}
            </p>
          )}
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('createRequest.returnDate')}
          </label>
          <input
            type="datetime-local"
            className={errors.returnDate ? inputErrorClass : inputNormal}
            {...register('returnDate', {
              required: t('createRequest.errors.returnDateRequired'),
              validate: (val) =>
                !departureDate ||
                val > departureDate ||
                t('createRequest.errors.returnDateAfterDeparture'),
            })}
          />
          {errors.returnDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.returnDate.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-bold"
      >
        {loading ? t('createRequest.submitting') : t('createRequest.submit')}
      </button>
    </form>
  );
}
