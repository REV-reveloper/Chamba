import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { CheckCircle, Clock, AlertTriangle, ShieldCheck, MessageCircle, XCircle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import { LocationPickerMap } from '../components/maps/LocationPickerMap';

export function Dashboard() {
  const { currentUser, requests, users, services, toggleSuspension, becomeProvider, addService, updateRequestStatus, reportPayment, validatePayment } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');
  const [showAddService, setShowAddService] = useState(false);
  const [showBecomeProvider, setShowBecomeProvider] = useState(false);

  // Forms states
  const [newService, setNewService] = useState({ title: '', description: '', cost: '', category: '' });
  
  // By default center around a generic point (e.g., Madrid) to start picking
  const [providerForm, setProviderForm] = useState({ 
    age: '', radiusKm: '', location: '', phone: '', email: '', workingHours: '', hasTransport: false, 
    lat: 40.4168, lng: -3.7038 
  });

  // Client Data
  const myClientRequests = requests.filter(r => r.clientId === currentUser.id);

  // Provider Data
  const myProviderRequests = requests.filter(r => r.providerId === currentUser.id);
  const myServices = services.filter(s => s.providerId === currentUser.id);

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'active': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center"><Clock size={12} className="mr-1"/> Activo</span>;
      case 'finished': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center"><CheckCircle size={12} className="mr-1"/> Finalizado</span>;
      case 'canceled': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center"><XCircle size={12} className="mr-1"/> Cancelado</span>;
      default: return null;
    }
  };

  const PaymentBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">Pago Pendiente</span>;
      case 'reported': return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold">Pago Reportado</span>;
      case 'validated': return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-semibold">Pago Validado</span>;
      default: return null;
    }
  };

  const handleBecomeProvider = (e: React.FormEvent) => {
    e.preventDefault();
    becomeProvider({
      age: Number(providerForm.age),
      hasTransport: providerForm.hasTransport,
      radiusKm: Number(providerForm.radiusKm),
      location: providerForm.location,
      lat: providerForm.lat,
      lng: providerForm.lng,
      suspended: false,
      rating: 0,
      jobsCompleted: 0,
      email: providerForm.email,
      phone: providerForm.phone,
      workingHours: providerForm.workingHours,
      reviews: []
    });
    setShowBecomeProvider(false);
    setActiveTab('provider');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
      title: newService.title,
      description: newService.description,
      cost: Number(newService.cost),
      category: newService.category
    });
    setNewService({ title: '', description: '', cost: '', category: '' });
    setShowAddService(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Mi Panel</h1>
          <p className="text-neutral-500 text-sm">Gestiona tus solicitudes y servicios</p>
        </div>
        
        {/* Role Toggle */}
        <div className="flex bg-neutral-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('client')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'client' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Modo Cliente
          </button>
          {currentUser.isProvider && (
            <button 
              onClick={() => setActiveTab('provider')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'provider' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              Modo Proveedor
            </button>
          )}
        </div>
      </div>

      {!currentUser.isProvider && activeTab === 'client' && (
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-blue-900">¿Quieres ofrecer tus servicios?</h2>
            <p className="text-blue-700 text-sm mt-1">Conviértete en proveedor y llega a miles de clientes en tu zona.</p>
          </div>
          <button 
            onClick={() => setShowBecomeProvider(true)}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Ser Proveedor
          </button>
        </div>
      )}

      {/* BECOME PROVIDER MODAL */}
      {showBecomeProvider && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-xl m-auto my-8">
            <h2 className="text-2xl font-bold mb-6">Registro de Proveedor</h2>
            <form onSubmit={handleBecomeProvider} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Edad</label>
                  <input required type="number" className="w-full border rounded-xl px-4 py-2" value={providerForm.age} onChange={e => setProviderForm({...providerForm, age: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Radio de Acción (km)</label>
                  <input required type="number" className="w-full border rounded-xl px-4 py-2" value={providerForm.radiusKm} onChange={e => setProviderForm({...providerForm, radiusKm: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de la Ubicación</label>
                <input required type="text" className="w-full border rounded-xl px-4 py-2" value={providerForm.location} onChange={e => setProviderForm({...providerForm, location: e.target.value})} placeholder="Ej: Centro de Madrid" />
              </div>

              {/* MAP PICKER */}
              <div className="space-y-1 pt-2">
                <label className="block text-sm font-medium flex items-center">
                  <MapPin size={16} className="mr-1 text-green-600" />
                  Define tu punto de origen en el mapa
                </label>
                <LocationPickerMap 
                  initialLat={providerForm.lat} 
                  initialLng={providerForm.lng} 
                  radiusKm={Number(providerForm.radiusKm) || 0}
                  onChangeLocation={(lat, lng) => setProviderForm(prev => ({ ...prev, lat, lng }))} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input required type="tel" className="w-full border rounded-xl px-4 py-2" value={providerForm.phone} onChange={e => setProviderForm({...providerForm, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Público</label>
                  <input required type="email" className="w-full border rounded-xl px-4 py-2" value={providerForm.email} onChange={e => setProviderForm({...providerForm, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Horario de Atención</label>
                <input required type="text" className="w-full border rounded-xl px-4 py-2" value={providerForm.workingHours} onChange={e => setProviderForm({...providerForm, workingHours: e.target.value})} placeholder="Ej: Lunes a Viernes de 9 a 18hrs" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="transport" checked={providerForm.hasTransport} onChange={e => setProviderForm({...providerForm, hasTransport: e.target.checked})} className="rounded text-blue-600 w-5 h-5" />
                <label htmlFor="transport" className="text-sm font-medium">¿Cuentas con medio de transporte propio?</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowBecomeProvider(false)} className="flex-1 px-4 py-2 border rounded-xl font-semibold hover:bg-neutral-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">Guardar y Activar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT TAB */}
      {activeTab === 'client' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">Mis Solicitudes Realizadas</h2>
          {myClientRequests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center">
              <p className="text-neutral-500">Aún no has solicitado ningún servicio.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {myClientRequests.map(req => {
                const provider = users.find(u => u.id === req.providerId);
                const service = services.find(s => s.id === req.serviceId);
                if (!provider || !service) return null;

                return (
                  <div key={req.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <StatusBadge status={req.status} />
                        <PaymentBadge status={req.paymentStatus} />
                      </div>
                      <h3 className="font-bold text-lg">{service.title}</h3>
                      <p className="text-sm text-neutral-500 mb-2">Proveedor: <strong>{provider.name}</strong> • Solicitado el {format(new Date(req.createdAt), 'dd/MM/yyyy')}</p>
                      <p className="font-semibold text-blue-600">Monto: ${service.cost}</p>
                    </div>
                    
                    <div className="flex flex-col space-y-2 w-full md:w-auto">
                      <button 
                        onClick={() => navigate(`/chat/${req.id}`)}
                        className="w-full flex justify-center items-center px-4 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl font-semibold text-sm transition-colors"
                      >
                        <MessageCircle size={16} className="mr-2"/> Abrir Chat
                      </button>
                      
                      {req.status === 'active' && (
                        <button 
                          onClick={() => updateRequestStatus(req.id, 'canceled')}
                          className="w-full px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition-colors"
                        >
                          Cancelar Solicitud
                        </button>
                      )}

                      {req.status === 'finished' && req.paymentStatus === 'pending' && (
                        <button 
                          onClick={() => reportPayment(req.id)}
                          className="w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-xl font-semibold text-sm transition-colors shadow-sm"
                        >
                          Reportar Pago
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PROVIDER TAB */}
      {activeTab === 'provider' && currentUser.isProvider && currentUser.providerInfo && (
        <div className="space-y-8">
          {/* Provider Status Controls */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className={`w-3 h-3 rounded-full ${currentUser.providerInfo.suspended ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <div>
                <h3 className="font-bold text-neutral-900">Estado de tus servicios: {currentUser.providerInfo.suspended ? 'Pausado' : 'Activo'}</h3>
                <p className="text-sm text-neutral-500">
                  {currentUser.providerInfo.suspended 
                    ? 'No aparecerás en los resultados de búsqueda ni recibirás nuevos trabajos.' 
                    : 'Estás visible para los clientes y puedes recibir solicitudes.'}
                </p>
              </div>
            </div>
            <button 
              onClick={toggleSuspension}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${currentUser.providerInfo.suspended ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
            >
              {currentUser.providerInfo.suspended ? 'Reactivar Servicios' : 'Pausar Servicios'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Manage Services */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-neutral-900">Tus Fichas de Servicio</h2>
                <button onClick={() => setShowAddService(true)} className="text-blue-600 text-sm font-semibold hover:underline">
                  + Agregar Servicio
                </button>
              </div>
              
              <div className="space-y-3">
                {myServices.length === 0 ? (
                  <div className="bg-neutral-50 p-6 rounded-2xl text-center border border-neutral-200 text-neutral-500 text-sm">No has agregado ningún servicio todavía.</div>
                ) : (
                  myServices.map(service => (
                    <div key={service.id} className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex justify-between items-center">
                      <div>
                        <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-600 font-medium mb-1 inline-block">{service.category}</span>
                        <h4 className="font-bold">{service.title}</h4>
                        <p className="text-sm text-neutral-500 line-clamp-1">{service.description}</p>
                      </div>
                      <div className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg ml-4 whitespace-nowrap">
                        ${service.cost}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Received Requests */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">Trabajos Recibidos</h2>
              <div className="space-y-3">
                {myProviderRequests.length === 0 ? (
                  <div className="bg-neutral-50 p-6 rounded-2xl text-center border border-neutral-200 text-neutral-500 text-sm">No tienes solicitudes pendientes.</div>
                ) : (
                  myProviderRequests.map(req => {
                    const client = users.find(u => u.id === req.clientId);
                    const service = services.find(s => s.id === req.serviceId);
                    if (!client || !service) return null;

                    return (
                      <div key={req.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex space-x-2 mb-2">
                              <StatusBadge status={req.status} />
                              <PaymentBadge status={req.paymentStatus} />
                            </div>
                            <h4 className="font-bold text-lg">{service.title}</h4>
                            <p className="text-sm text-neutral-600">Cliente: <strong>{client.name}</strong></p>
                          </div>
                          <button onClick={() => navigate(`/chat/${req.id}`)} className="bg-neutral-100 p-2 rounded-full hover:bg-neutral-200 text-neutral-700">
                            <MessageCircle size={20} />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100">
                          {req.status === 'active' && (
                            <>
                              <button onClick={() => updateRequestStatus(req.id, 'finished')} className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-sm font-semibold hover:bg-neutral-800">
                                Marcar Terminado
                              </button>
                              <button onClick={() => updateRequestStatus(req.id, 'canceled')} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100">
                                Cancelar
                              </button>
                            </>
                          )}
                          {req.status === 'finished' && req.paymentStatus === 'reported' && (
                            <button onClick={() => validatePayment(req.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center">
                              <ShieldCheck size={16} className="mr-1"/> Validar Pago
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {showAddService && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl m-auto">
            <h2 className="text-2xl font-bold mb-6">Agregar Servicio</h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título del Servicio</label>
                <input required type="text" className="w-full border rounded-xl px-4 py-2" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} placeholder="Ej: Reparación de tuberías" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <input required type="text" className="w-full border rounded-xl px-4 py-2" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} placeholder="Ej: Plomería" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea required className="w-full border rounded-xl px-4 py-2 h-24" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} placeholder="Detalla qué incluye el servicio..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Costo Base ($)</label>
                <input required type="number" className="w-full border rounded-xl px-4 py-2" value={newService.cost} onChange={e => setNewService({...newService, cost: e.target.value})} />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddService(false)} className="flex-1 px-4 py-2 border rounded-xl font-semibold hover:bg-neutral-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">Guardar Ficha</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
