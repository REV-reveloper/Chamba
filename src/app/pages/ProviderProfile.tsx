import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { MapPin, Star, Clock, Mail, Phone, Car, CheckCircle, Navigation } from 'lucide-react';
import { CoverageMap } from '../components/maps/CoverageMap';

export function ProviderProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, services, currentUser, createRequest } = useApp();
  
  const provider = users.find(u => u.id === id);
  const providerServices = services.filter(s => s.providerId === id);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!provider || !provider.isProvider || !provider.providerInfo) {
    return <div className="text-center p-12">Proveedor no encontrado o no disponible.</div>;
  }

  const pInfo = provider.providerInfo;

  const handleRequest = () => {
    if (selectedService) {
      createRequest(provider.id, selectedService);
      setShowConfirm(false);
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm relative overflow-hidden">
        {pInfo.suspended && (
          <div className="absolute top-4 right-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Servicios Pausados
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-4xl md:text-5xl font-bold flex-shrink-0">
            {provider.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{provider.name}</h1>
            <div className="flex flex-wrap items-center text-sm text-neutral-600 gap-4 mb-6">
              <span className="flex items-center"><Star className="text-yellow-400 mr-1 fill-yellow-400" size={16} /> {pInfo.rating} ({pInfo.reviews.length} opiniones)</span>
              <span className="flex items-center"><CheckCircle className="text-green-500 mr-1" size={16} /> {pInfo.jobsCompleted} trabajos realizados</span>
              <span className="flex items-center"><MapPin className="text-neutral-400 mr-1" size={16} /> {pInfo.location}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 rounded-2xl p-4">
              <div className="flex items-center space-x-3 text-sm text-neutral-700">
                <Clock className="text-neutral-400" size={18} />
                <span><strong className="block text-xs text-neutral-500">Horario de Atención</strong>{pInfo.workingHours}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-neutral-700">
                <Car className="text-neutral-400" size={18} />
                <span><strong className="block text-xs text-neutral-500">Transporte Propio</strong>{pInfo.hasTransport ? 'Sí' : 'No'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-neutral-700">
                <Navigation className="text-neutral-400" size={18} />
                <span><strong className="block text-xs text-neutral-500">Radio de Cobertura</strong>{pInfo.radiusKm} km</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-neutral-700">
                <Mail className="text-neutral-400" size={18} />
                <span><strong className="block text-xs text-neutral-500">Contacto</strong>{pInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Services List */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">Servicios Ofrecidos</h2>
          {providerServices.length === 0 ? (
            <p className="text-neutral-500 bg-white p-6 rounded-2xl border border-neutral-200">Este proveedor aún no ha registrado servicios.</p>
          ) : (
            <div className="space-y-4">
              {providerServices.map(service => (
                <div key={service.id} className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <span className="bg-neutral-100 text-neutral-700 text-xs font-bold px-2.5 py-1 rounded-full mb-2 inline-block">{service.category}</span>
                    <h3 className="font-bold text-lg text-neutral-900">{service.title}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{service.description}</p>
                    <p className="text-blue-600 font-bold mt-2">Costo estimado: ${service.cost}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedService(service.id);
                      setShowConfirm(true);
                    }}
                    disabled={pInfo.suspended}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-semibold transition-colors ${pInfo.suspended ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                  >
                    Solicitar
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Reviews Section */}
          <h2 className="text-xl font-bold text-neutral-900 pt-4">Opiniones</h2>
          <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100">
            {pInfo.reviews.length === 0 ? (
              <p className="p-6 text-neutral-500">Aún no hay opiniones.</p>
            ) : (
              pInfo.reviews.map((rev, idx) => (
                <div key={idx} className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-sm text-neutral-600">{rev.author.charAt(0)}</div>
                    <div>
                      <p className="font-semibold text-sm">{rev.author}</p>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < rev.rating ? "fill-yellow-400" : "text-neutral-200"} />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Area Map */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="bg-neutral-100 p-4 border-b border-neutral-200">
              <h3 className="font-bold text-neutral-900 flex items-center"><Navigation className="mr-2 text-blue-600" size={18} /> Área de Cobertura</h3>
            </div>
            
            <CoverageMap 
              lat={pInfo.lat} 
              lng={pInfo.lng} 
              radiusKm={pInfo.radiusKm} 
              locationName={pInfo.location} 
            />

            <div className="p-4 bg-white text-center border-t border-neutral-100">
              <p className="text-sm font-semibold text-neutral-800">Radio de {pInfo.radiusKm} km</p>
              <p className="text-xs text-neutral-500 mt-1">Sede principal registrada en {pInfo.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirmar Solicitud</h2>
            <p className="text-neutral-600 mb-6">Estás a punto de solicitar el servicio a <strong>{provider.name}</strong>. ¿Deseas continuar?</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
